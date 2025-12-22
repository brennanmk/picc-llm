#!/usr/bin/env python3

"""
picc_rl.utils.augment_training
==============================

Utility to augment training from exported session data.

This script reads a user's training history and continues training for a specified
number of additional episodes to reach a target total. It is useful for extending
experiments to see if convergence occurs later.

Output:
    - **.npz files:** Arrays containing **Target Task** metrics (Reward, Success, Timesteps).
    - **.pt files:** The updated PyTorch model checkpoint.

.. module:: augment_training
   :synopsis: CLI utility for extending RL training sessions offline.
"""

import json
import yaml
import argparse
import math
import os
from datetime import datetime
from typing import List, Optional
from tqdm import tqdm
import importlib

import numpy as np
import requests
import torch.multiprocessing as mp
from pydantic import BaseModel, model_validator

from picc_rl.learning.trainer import Trainer


class AugmentConfig(BaseModel):
    """
    Pydantic model for validating the YAML configuration file.
    
    :param env: The environment ID.
    :param target_total_episodes: The desired total episode count (history + new).
    :param experiment_results_paths: List of JSON files containing session history.
    :param env_config: The **Target Task** configuration used for evaluation.
    """

    env: str
    target_total_episodes: int
    number_of_procs: int
    test_storage: str
    training_config: dict
    env_path: Optional[str] = None
    env_config: dict = {}
    experiment_name: Optional[str] = "augmented_training"
    post_complete: Optional[str] = None

    experiment_results_paths: List[str]

    @model_validator(mode="after")
    def check_files_exist(self):
        """Ensures input files actually exist."""
        for path in self.experiment_results_paths:
            if not os.path.exists(path):
                raise ValueError(f"Input file not found: {path}")
        return self


class AugmentTraining:
    """
    Controller for the augmentation process.
    """

    def __init__(self, config_path: str):
        """
        Initialize the augmentation run.
        """
        with open(config_path, "r") as f:
            self.config = AugmentConfig(**yaml.safe_load(f))

        self.save_path = self.create_save_path()
        config_save_path = os.path.join(self.save_path, "config.yaml")
        with open(config_save_path, "w") as f:
            yaml.dump(self.config.model_dump(), f, indent=4, sort_keys=False)

        print(f"Preparing to augment training for env: {self.config.env}")
        self.start_augmentation()
        print(f"Augmented training complete. Results saved in {self.save_path}")

        if self.config.post_complete:
            try:
                message = (
                    f"Augmented training complete. Results saved in {self.save_path}"
                )
                requests.post(self.config.post_complete, data=message.encode("utf-8"))
                print("Successfully sent completion notification to endpoint.")
            except requests.exceptions.RequestException as e:
                print(f"Warning: Failed to send completion notification: {e}")

    def create_save_path(self) -> str:
        """Creates a timestamped directory for results."""
        date_string = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
        dir_name = f"{self.config.experiment_name}_{date_string}"
        save_path = os.path.join(self.config.test_storage, dir_name)
        os.makedirs(save_path, exist_ok=True)
        return save_path

    def start_augmentation(self):
        """
        Orchestrates the loading and distribution of training tasks.
        """
        mp.set_start_method("spawn", force=True)
        sessions_to_process = []

        print("Loading session data from files...")
        for path in self.config.experiment_results_paths:
            try:
                with open(path, "r") as f:
                    file_data = json.load(f)
                    if isinstance(file_data, list):
                        sessions_to_process.extend(file_data)
                    else:
                        print(
                            f"Warning: Expected list of sessions in {path}, got {type(file_data)}"
                        )
            except json.JSONDecodeError as e:
                print(f"Warning: Error parsing JSON {path}: {e}")

        if not sessions_to_process:
            print("No valid sessions found to augment. Exiting.")
            return

        seen_ids = set()
        unique_sessions = []

        for s in sessions_to_process:
            lid = s.get("learning_id")
            if lid is None:
                print("Warning: Found session data without a Learning ID. Skipping.")
                continue

            if lid not in seen_ids:
                seen_ids.add(lid)
                unique_sessions.append(s)
            else:
                print(f"Skipping duplicate session ID: {lid}")

        print(f"Found {len(unique_sessions)} unique sessions. Starting processing...")

        worker_args = [
            (session, self.config, self.save_path) for session in unique_sessions
        ]

        with mp.Pool(self.config.number_of_procs) as pool:
            _ = list(
                tqdm(
                    pool.starmap(AugmentTraining.run_augment_trial, worker_args),
                    total=len(worker_args),
                )
            )

    @staticmethod
    def run_augment_trial(session_data: dict, config: AugmentConfig, save_path: str):
        """
        Worker that augments a SINGLE session.
        """
        learning_id = session_data.get("learning_id", "unknown")

        # Determine active config (used for augmentation steps)
        base_config = session_data.get("active_environment_config")

        # Get progress history
        stages_to_process = session_data.get(
            "training_progress", []
        ) or session_data.get("iterations", [])

        # Determine latest model path
        latest_model_path = None
        for stage in reversed(stages_to_process):
            if stage.get("model_path"):
                latest_model_path = stage["model_path"]
                break

        if not latest_model_path:
            print(
                f"\n[Warning] Session {learning_id}: No 'model_path' found in training history. Cannot augment."
            )
            return

        train_random = config.training_config.get("train_with_random_configs", True)

        if base_config is None:
            if train_random:
                print(
                    f"\n[Info] Session {learning_id}: No 'active_environment_config' found, but random mode is ON. Using None."
                )
                base_config = None
            else:
                print(
                    f"\n[Error] Session {learning_id}: 'active_environment_config' is missing and random mode is OFF."
                )
                print("Skipping this session.")
                return

        try:
            history = AugmentTraining._process_history(stages_to_process, base_config)
        except KeyError as e:
            print(
                f"\n[Error] Session {learning_id}: Malformed history data. Missing key: {e}"
            )
            return

        AugmentTraining._run_and_save(
            learning_id, config, save_path, history, config.env, latest_model_path
        )

    @staticmethod
    def _process_history(stages: List[dict], base_config: Optional[List]) -> dict:
        """
        Aggregates historical performance metrics from a list of training stages.
        Strictly enforces the new data schema (lists for Target Eval metrics).
        
        :raises KeyError: If ``target_eval_*`` keys are missing.
        """
        historical_rewards, historical_timesteps, historical_successes = [], [], []

        historical_x_axis_episodes = []
        historical_x_axis_timesteps = []
        total_episodes_so_far = 0
        total_timesteps_so_far = 0

        for count, stage in enumerate(stages):
            try:
                stage_reward = stage["target_eval_reward"][-1]
                stage_success = stage["target_eval_success"][-1]
                stage_timestep = stage["target_eval_timesteps"][-1]

                stage_total_timesteps = stage.get("stage_total_timesteps", 0)
                stage_total_episodes = stage.get("stage_total_episodes", 0)

            except (KeyError, IndexError, TypeError) as e:
                print(
                    f"\n[Error] Historical data is malformed at stage {count}. "
                    f"Expected 'target_eval_*' lists. Error: {e}"
                )
                raise

            historical_rewards.append(stage_reward)
            historical_timesteps.append(stage_timestep)
            historical_successes.append(stage_success)

            total_episodes_so_far += stage_total_episodes
            historical_x_axis_episodes.append(total_episodes_so_far)

            total_timesteps_so_far += stage_total_timesteps
            historical_x_axis_timesteps.append(total_timesteps_so_far)

        return {
            "base_config": base_config,
            "rewards": historical_rewards,
            "timesteps": historical_timesteps,
            "successes": historical_successes,
            "x_axis_episode": np.array(historical_x_axis_episodes, dtype=int),
            "x_axis_timestep": np.array(historical_x_axis_timesteps, dtype=int),
            "total_episodes": total_episodes_so_far,
            "total_timesteps": total_timesteps_so_far,
        }

    @staticmethod
    def _run_and_save(
        learning_id: int,
        config: AugmentConfig,
        save_path: str,
        history: dict,
        env: str,
        model_path: str,
    ):
        """
        Instantiates the Trainer, runs the augmentation loop, and saves the results.
        Enforces use of Target Task metrics.
        """
        output_path = os.path.join(save_path, f"session_{learning_id}_data.npz")

        episodes_to_run = config.target_total_episodes - history["total_episodes"]
        if episodes_to_run <= 0:
            print(
                f"Session {learning_id}: Already meets target ({history['total_episodes']} eps). Saving historical data only."
            )
            np.savez(
                output_path,
                reward=history["rewards"],
                timestep=history["timesteps"],
                success=history["successes"],
                x_axis_episode=history["x_axis_episode"],
                x_axis_timestep=history["x_axis_timestep"],
            )
            return

        new_episodes_per_iteration = config.training_config.get(
            "episodes_per_iteration", 1
        )
        iterations_to_run = math.ceil(episodes_to_run / new_episodes_per_iteration)

        env_class = (
            config.env
            if config.env_path is None
            else importlib.import_module(config.env_path).envs[config.env]
        )

        new_model_save_path = os.path.join(save_path, f"session_{learning_id}_model.pt")
        input_load_path = model_path

        run_config = config.training_config.copy()
        run_config["target_episodes"] = config.target_total_episodes
        start_episodes = history["total_episodes"]

        trainer = Trainer(
            env=env_class,
            env_config=config.env_config,
            save_path=new_model_save_path,
            load_path=input_load_path,
            seed=learning_id,
            training_episode_start=start_episodes,
            **run_config,
        )

        curriculum_env_config = history["base_config"]
        target_env_config = config.env_config

        new_rewards, new_timesteps, new_successes = [], [], []
        new_x_axis_episodes = []
        new_x_axis_timesteps = []

        current_cumulative_episodes = history["total_episodes"]
        current_cumulative_timesteps = history["total_timesteps"]

        iteration_pbar = tqdm(
            range(iterations_to_run),
            desc=f"Augmenting Session {learning_id}",
            leave=False,
        )

        for _ in iteration_pbar:
            (
                train_reward,
                train_timesteps_list, 
                train_success,
                stage_eval_rewards,
                stage_eval_timesteps,
                stage_eval_success,
                target_eval_rewards,
                target_eval_timesteps,
                target_eval_successes,
                iterations_taken,
                checkpoint_path,
            ) = trainer.train_model(
                curriculum_params=curriculum_env_config,
                base_params=target_env_config
            )

            new_rewards.extend(target_eval_rewards)
            new_successes.extend(target_eval_successes)
            new_timesteps.extend(target_eval_timesteps)

            num_points = len(target_eval_rewards)
            for i in range(num_points):
                current_cumulative_episodes += new_episodes_per_iteration
                new_x_axis_episodes.append(current_cumulative_episodes)

                steps_this_iter = train_timesteps_list[i] * new_episodes_per_iteration
                current_cumulative_timesteps += int(steps_this_iter)
                new_x_axis_timesteps.append(current_cumulative_timesteps)

        new_x_axis_array_episodes = np.array(new_x_axis_episodes, dtype=int)
        new_x_axis_array_timesteps = np.array(new_x_axis_timesteps, dtype=int)

        np.savez(
            output_path,
            reward=history["rewards"] + new_rewards,
            timestep=history["timesteps"] + new_timesteps,
            success=history["successes"] + new_successes,
            x_axis_episode=np.concatenate(
                [history["x_axis_episode"], new_x_axis_array_episodes]
            ),
            x_axis_timestep=np.concatenate(
                [history["x_axis_timestep"], new_x_axis_array_timesteps]
            ),
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Augment training from exported JSON session data."
    )
    parser.add_argument(
        "--config", required=True, help="Path to the YAML configuration file."
    )
    args = parser.parse_args()
    AugmentTraining(args.config)
