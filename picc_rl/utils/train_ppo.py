#!/usr/bin/env python3

"""
picc_rl.utils.train_ppo
-------------------

Experiment runner for PPO training, which parses a configuration file to run
one or more trials.

This script leverages multiprocessing to run multiple trials in parallel.
It uses the centralized LLMHandler to simulate the "AI Architect" role
without human intervention, allowing for fully automated baseline data collection.

Outputs a npz for analysis containing:
- 'x_axis_timestep': 1D array of shape (num_points,)
- 'x_axis_episode': 1D array of shape (num_points,)
- 'reward': A 2D array of shape (total_combined_trials, num_points)
- 'timestep': A 2D array of shape (total_combined_trials, num_points)
- 'success': A 2D array of shape (total_combined_trials, num_points)
"""

from picc_rl.llm.llm_handler import LLMHandler, format_curriculum_history
from picc_rl.learning.trainer import Trainer
import numpy as np
import torch.multiprocessing as mp
from datetime import datetime
import os
import requests
import yaml
import argparse
from typing import Optional, List, Tuple, Dict, Any
from pydantic import BaseModel, Field
import importlib
from tqdm import tqdm
import copy


class TrainPPOConfig(BaseModel):
    """Configuration schema for a PPO training experiment."""

    trials: int
    number_of_procs: int
    test_storage: str
    env: str

    llm_training_config: Optional[dict] = None
    standard_training_config: Optional[dict] = None

    experiment_name: Optional[str] = None
    post_complete: Optional[str] = None
    env_path: Optional[str] = None
    env_config: dict = {}

    # LLM Curriculum settings
    use_llm_curriculum: bool = False
    llm_curriculum_iterations: Optional[int] = None
    llm_settings: Optional[Dict[str, Any]] = None

    # Standard Training settings
    standard_training_iterations: int = 0


class TrainPPO:
    """Manages the setup and execution of a PPO training experiment."""

    def __init__(self, config: str) -> None:
        """Initializes and runs the PPO training experiment based on a config file."""
        with open(config, "r") as f:
            conf_dict = yaml.safe_load(f)

        self.config = TrainPPOConfig(**conf_dict)
        self._validate_config()

        self.save_path = self._create_save_path()
        config_save_path = os.path.join(self.save_path, "config.yaml")
        with open(config_save_path, "w") as f:
            yaml.dump(self.config.model_dump(), f, indent=4, sort_keys=False)

        print("Training starting...")

        (
            reward,
            timestep,
            success,
            x_axis_episodes_data,
            x_axis_timesteps_data,
        ) = self._start_experiment()

        np.savez(
            f"{self.save_path}/data.npz",
            reward=reward,
            timestep=timestep,
            success=success,
            x_axis_episode=x_axis_episodes_data,
            x_axis_timestep=x_axis_timesteps_data,
        )

        print(f"Completed, results in {self.save_path}")

        if self.config.post_complete is not None:
            requests.post(
                self.config.post_complete,
                data=f"Training complete --- see {self.save_path}".encode(
                    encoding="utf-8"
                ),
            )

    def _validate_config(self):
        """Validates the loaded configuration to ensure logical consistency."""
        if not self.config.use_llm_curriculum:
            self.config.llm_curriculum_iterations = 0
        elif (
            self.config.llm_curriculum_iterations is None
            or self.config.llm_curriculum_iterations <= 0
        ):
            raise ValueError(
                "Config Error: 'llm_curriculum_iterations' must be a positive number when 'use_llm_curriculum' is true."
            )

        llm_is_active = self.config.llm_curriculum_iterations > 0
        std_is_active = self.config.standard_training_iterations > 0

        if not llm_is_active and not std_is_active:
            raise ValueError(
                "Config Error: No training phases active. Enable 'use_llm_curriculum' or set 'standard_training_iterations' > 0."
            )

        if llm_is_active:
            if not self.config.llm_training_config:
                raise ValueError(
                    "Config Error: 'llm_training_config' must be provided when LLM curriculum is active."
                )
            # Ensure we have the settings for the LLMHandler
            if not self.config.llm_settings:
                raise ValueError(
                    "Config Error: 'llm_settings' must be provided for the LLMHandler."
                )

        if std_is_active and not self.config.standard_training_config:
            print(
                "Warning: 'standard_training_config' not provided. Falling back to 'llm_training_config'."
            )
            self.config.standard_training_config = self.config.llm_training_config
            if not self.config.standard_training_config:
                raise ValueError(
                    "Config Error: No valid training config found for standard training."
                )

    def _create_save_path(self) -> str:
        """Creates a unique directory for storing experiment results."""
        date_string = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
        dir_name = f"{self.config.experiment_name or self.config.env}_{date_string}"
        save_path = os.path.join(self.config.test_storage, dir_name)
        os.makedirs(save_path, exist_ok=True)
        return save_path

    def _start_experiment(
        self,
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """Starts the multiprocessing pool and collects results from all trials."""
        mp.set_start_method("spawn", force=True)
        with mp.Pool(self.config.number_of_procs) as pool:
            data = [(i, self.config, self.save_path) for i in range(self.config.trials)]
            process_data = pool.starmap(TrainPPO.run_trial, data)

        reward_sum = [data[0] for data in process_data]
        timesteps = [data[1] for data in process_data]
        success = [data[2] for data in process_data]
        x_axis_episodes_data = process_data[0][3] if process_data else np.array([])
        x_axis_timesteps_data = process_data[0][4] if process_data else np.array([])

        return (
            np.array(reward_sum),
            np.array(timesteps),
            np.array(success),
            np.array(x_axis_episodes_data),
            np.array(x_axis_timesteps_data),
        )

    @staticmethod
    def _process_training_iteration(
        train_model_output: tuple,
        trackers: Dict[str, List],
        cumulative_episodes: int,
        cumulative_timesteps: int,
        episodes_per_iter: int,
        training_progress_list: List[Dict],  # NEW: Keep track of history locally
        curriculum_params: Dict,
    ) -> Tuple[int, int]:
        """
        Helper function to process results and update trackers/history.
        """
        (
            _,
            train_timesteps_list,
            _,
            _,
            _,
            _,
            eval_rewards,
            eval_timesteps,
            eval_success,
            iterations_taken,
            _,
        ) = train_model_output

        trackers["reward"].append(eval_rewards)
        trackers["timestep"].append(eval_timesteps)
        trackers["success"].append(eval_success)

        cumulative_episodes += iterations_taken * episodes_per_iter
        trackers["x_axis_episodes"].append(cumulative_episodes)

        stage_total_timesteps = sum(train_timesteps_list)
        cumulative_timesteps += stage_total_timesteps
        trackers["x_axis_timesteps"].append(cumulative_timesteps)

        # Update Local History for LLM Context
        training_progress_list.append(
            {
                "curriculum_params": curriculum_params,
                "final_eval_success": eval_success,
                "final_eval_reward": eval_rewards,
                "final_eval_timesteps": eval_timesteps,
            }
        )

        return cumulative_episodes, cumulative_timesteps

    @staticmethod
    def _run_llm_training_phase(
        config: TrainPPOConfig,
        trial_number: int,
        env_class: object,
        model_save_path: str,
        trackers: Dict[str, List],
        cumulative_episodes: int,
        cumulative_timesteps: int,
        training_progress_list: List[Dict],  # Passed in to maintain state
    ) -> Tuple[int, int]:
        """Runs the LLM-guided curriculum training phase."""

        episodes_per_llm_iter = config.llm_training_config.get(
            "episodes_per_iteration", 0
        )

        # Initialize Trainer
        trainer = Trainer(
            env=env_class,
            env_config=config.env_config,
            save_path=model_save_path,
            seed=trial_number,
            **config.llm_training_config,
        )

        # Initialize LLM Handler with explicit settings
        llm_handler = LLMHandler(settings=config.llm_settings)

        desc = f"Trial {trial_number + 1}/{config.trials} (LLM)"

        for i in tqdm(
            range(config.llm_curriculum_iterations),
            desc=desc,
            position=trial_number,
            leave=False,
        ):
            history_str = format_curriculum_history(training_progress_list)
            
            context_data = {
                "context": history_str,
                "current_stage": i + 1,
                "total_stages": config.llm_curriculum_iterations,
            }

            try:
                curriculum_params = llm_handler.generate_curriculum(context_data)
            except Exception as e:
                print(f"LLM Generation Failed in Trial {trial_number}: {e}")
                # Fallback to base environment if LLM fails
                curriculum_params = None

            # If curriculum_params is None, trainer uses default config
            train_output = trainer.train_model(curriculum_params, curriculum_params)

            (
                cumulative_episodes,
                cumulative_timesteps,
            ) = TrainPPO._process_training_iteration(
                train_output,
                trackers,
                cumulative_episodes,
                cumulative_timesteps,
                episodes_per_llm_iter,
                training_progress_list,
                curriculum_params,
            )

        return cumulative_episodes, cumulative_timesteps

    @staticmethod
    def _run_standard_training_phase(
        config: TrainPPOConfig,
        trial_number: int,
        env_class: object,
        model_save_path: str,
        trackers: Dict[str, List],
        cumulative_episodes: int,
        cumulative_timesteps: int,
        training_progress_list: List[Dict],
    ) -> Tuple[int, int]:
        """Runs the standard (non-curriculum) training phase."""

        std_config = config.standard_training_config or config.llm_training_config
        episodes_per_std_iter = std_config.get("episodes_per_iteration", 0)

        trainer = Trainer(
            env=env_class,
            env_config=config.env_config,
            save_path=model_save_path,
            seed=trial_number,
            **std_config,
        )
        base_env_config = trainer.generate_environment()

        desc = f"Trial {trial_number + 1}/{config.trials} (Standard)"
        for _ in tqdm(
            range(config.standard_training_iterations),
            desc=desc,
            position=trial_number,
            leave=True,
        ):
            train_output = trainer.train_model(base_env_config, base_env_config)

            (
                cumulative_episodes,
                cumulative_timesteps,
            ) = TrainPPO._process_training_iteration(
                train_output,
                trackers,
                cumulative_episodes,
                cumulative_timesteps,
                episodes_per_std_iter,
                training_progress_list,  # Updates history, though AI won't use it in this phase
                base_env_config,
            )

        return cumulative_episodes, cumulative_timesteps

    @staticmethod
    def run_trial(
        trial_number: int, config: TrainPPOConfig, save_path: str
    ) -> Tuple[List, List, List, List, List]:
        """
        Worker function for a single trial, executed in a separate process.
        """

        trackers = {
            "reward": [],
            "timestep": [],
            "success": [],
            "x_axis_episodes": [],
            "x_axis_timesteps": [],
        }

        # Local history tracker for this specific trial
        training_progress_list = []

        cumulative_episodes = 0
        cumulative_timesteps = 0

        model_save_path = f"{save_path}/test_{trial_number}.pt"
        env_class = (
            config.env
            if config.env_path is None
            else importlib.import_module(config.env_path).envs[config.env]
        )

        # LLM Curriculum Phase
        if config.llm_curriculum_iterations and config.llm_curriculum_iterations > 0:
            (
                cumulative_episodes,
                cumulative_timesteps,
            ) = TrainPPO._run_llm_training_phase(
                config,
                trial_number,
                env_class,
                model_save_path,
                trackers,
                cumulative_episodes,
                cumulative_timesteps,
                training_progress_list,
            )

        # Standard Training Phase
        if config.standard_training_iterations > 0:
            (
                cumulative_episodes,
                cumulative_timesteps,
            ) = TrainPPO._run_standard_training_phase(
                config,
                trial_number,
                env_class,
                model_save_path,
                trackers,
                cumulative_episodes,
                cumulative_timesteps,
                training_progress_list,
            )

        return (
            trackers["reward"],
            trackers["timestep"],
            trackers["success"],
            trackers["x_axis_episodes"],
            trackers["x_axis_timesteps"],
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="train_ppo",
        description="Train a PPO agent with an automated LLM-designed curriculum.",
    )
    parser.add_argument(
        "--config", required=True, help="Path to the YAML configuration file."
    )
    args = parser.parse_args()
    TrainPPO(args.config)
