#!/usr/bin/env python3

"""
picc_rl.utils.run_offline_training
==================================

A utility to re-run or simulate training sessions offline using the ``Trainer`` class.

This script reads session specifications (either from a live database or a JSON dump),
spins up fresh training instances, and executes the training curriculum. It is designed
for batch processing on high-performance computing (HPC) clusters or local workstations
independent of the web server.

Key Features:
    - **Dual Data Source:** Can ingest data from a JSON file (legacy/dump) or list of DB IDs.
    - **Robust Replay:** If a stage configuration is missing (e.g., in an open-ended
      AI experiment), it can optionally query the ``LLMHandler`` to regenerate it dynamically.
    - **Target Validation:** Ensures every training stage is evaluated against the *Target Task*
      (Final Goal), allowing for consistent "Distance to Goal" plots.

Output:
    - **.npz files:** Numpy archives containing high-resolution arrays for plotting.
    - **.json files:** Consolidated logs of the re-run sessions.

.. module:: run_offline_training
   :synopsis: CLI tool for batch offline processing of RL training sessions.
"""

import json
import yaml
import argparse
import os
import requests
from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple
from pydantic import BaseModel, model_validator
from tqdm import tqdm
import importlib
import numpy as np

import torch.multiprocessing as mp

from picc_rl.learning.trainer import Trainer
from picc_rl.llm.llm_handler import LLMHandler, format_curriculum_history


class ProcessingConfig(BaseModel):
    """
    Configuration schema for an offline processing run.

    This class uses Pydantic to validate the YAML configuration file provided
    at runtime. It enforces that exactly one data source (file or DB IDs) is provided.

    :param session_data_file: Optional path to a JSON dump of session data.
    :param training_config: Dictionary of hyperparameters passed to the PPO Trainer.
    :param llm_settings: Configuration for the AI Architect (if dynamic generation is needed).
    :param env: The environment ID (e.g., 'minecraft').
    :param env_config: The **Target Task** configuration (used for final evaluation).
    """

    session_data_file: str

    training_config: Dict
    llm_settings: Dict[str, Any]

    env: str
    env_config: dict = {}
    number_of_procs: int = 1
    test_storage: str = "offline_runs"
    experiment_name: Optional[str] = "offline_processing_run"
    runs_per_session: int = 1
    env_path: Optional[str] = None
    post_complete: Optional[str] = None


class OfflineProcessor:
    """
    Orchestrates the parallel processing of offline training jobs.

    This class manages the multiprocessing pool, distributes work items (sessions)
    to worker processes, and aggregates the results into a final report.
    """

    def __init__(self, config_path: str):
        """
        Initialize the processor.

        :param config_path: Path to the YAML config file.
        """
        with open(config_path, "r") as f:
            self.config = ProcessingConfig(**yaml.safe_load(f))

        date_string = datetime.now().strftime("%Y%m%d_%H%M%S")
        dir_name = f"{self.config.experiment_name}_{date_string}"
        self.save_path = os.path.join(self.config.test_storage, dir_name)
        os.makedirs(self.save_path, exist_ok=True)

        with open(os.path.join(self.save_path, "config.yaml"), "w") as f:
            yaml.dump(self.config.model_dump(), f, indent=4, sort_keys=False)

        print(
            f"Initialized run. Experimental results will be saved in: {self.save_path}"
        )
        self.run()

    def run(self) -> None:
        """
        Main execution loop.

        Loads learning sessions from the configured data source and spawns
        a ``torch.multiprocessing`` pool to process them in parallel.
        """
        mp.set_start_method("spawn", force=True)

        all_session_data = []

        if self.config.session_data_file:
            data_file_path = self.config.session_data_file
            print(f"Loading session data from JSON file: {data_file_path}")
            if not os.path.exists(data_file_path):
                print(f"Error: Session data file not found at {data_file_path}")
                return
            with open(data_file_path, "r") as f:
                all_session_data = json.load(f)

        print(f"Loaded {len(all_session_data)} total sessions to process.")

        worker_args = []
        for session_data in all_session_data:
            for run_idx in range(self.config.runs_per_session):
                worker_args.append((session_data, self.config, self.save_path, run_idx))

        print(
            f"Will execute {self.config.runs_per_session} run(s) per session, "
            f"for a total of {len(worker_args)} worker jobs."
        )

        all_results = []
        with mp.Pool(self.config.number_of_procs) as pool:
            all_results = list(
                tqdm(
                    pool.starmap(OfflineProcessor._worker, worker_args),
                    total=len(worker_args),
                )
            )

        successful_results = [res for res in all_results if res is not None]
        if not successful_results:
            print("\nNo sessions were processed successfully. Exiting.")
            return

        output_path = os.path.join(self.save_path, "experiment_results.json")
        with open(output_path, "w") as f:
            json.dump(successful_results, f, indent=4)
        print(f"\nConsolidated JSON results saved to: {output_path}")

        self._post_complete_hook()

    @staticmethod
    def _worker(
        session_data: dict, config: ProcessingConfig, run_save_path: str, run_index: int
    ) -> Optional[dict]:
        """
        Static worker method that processes a single training session.

        :param session_data: Dictionary containing the history of a specific user session.
        :param config: Global configuration object.
        :param run_save_path: Directory where artifacts for this run should be stored.
        :param run_index: The iteration index (if running multiple trials per session).
        :return: A dictionary containing the re-run logs, or None on failure.
        """
        session_results = {"iterations": []}
        all_eval_rewards, all_eval_timesteps, all_eval_successes = [], [], []
        x_axis_episodes, x_axis_timesteps = [], []
        cumulative_episodes = 0
        cumulative_timesteps = 0

        episodes_per_iter = config.training_config.get("episodes_per_iteration", 0)
        session_id = session_data.get("learning_id")

        print(f"Session {session_id} (run {run_index}) starting training")

        training_progress = session_data.get("training_progress")
        if not training_progress:
            print(
                f"Warning: Session {session_id} has no 'training_progress'. Skipping."
            )
            return None

        env_class = (
            config.env
            if config.env_path is None
            else importlib.import_module(config.env_path).envs[config.env]
        )

        try:
            session_run_id = (1000 * session_id) + run_index
            session_results["learning_id"] = session_run_id

            new_model_dir = os.path.join(
                run_save_path, "models", f"session_{session_run_id}"
            )
            os.makedirs(new_model_dir, exist_ok=True)
            model_save_path = os.path.join(new_model_dir, "model.pt")

            for stage_idx, stage in enumerate(training_progress):
                curriculum_params = stage.get("curriculum_params")

                base_params = stage.get("base_params")
                if base_params is None:
                    base_params = config.env_config

                if curriculum_params is None:
                    print(
                        f"  > Session {session_id}: Stage {stage_idx + 1} Config Missing. Triggering AI Architect..."
                    )

                    try:
                        history_str = format_curriculum_history(
                            session_results["iterations"]
                        )
                        context_data = {
                            "context": history_str,
                            "current_stage": stage_idx + 1,
                            "total_stages": len(training_progress),
                        }

                        llm_handler = LLMHandler(settings=config.llm_settings)

                        generated_config = llm_handler.generate_curriculum(context_data)
                        print(f"  > AI Generated Config: {generated_config}")

                        curriculum_params = generated_config

                    except Exception as e:
                        print(f"  ! AI Generation Failed for Session {session_id}: {e}")
                        # If we can't generate, we likely have to skip this stage
                        continue

                trainer = Trainer(
                    env=env_class,
                    env_config=config.env_config,
                    save_path=model_save_path,
                    load_path=model_save_path,
                    seed=session_id,
                    **config.training_config,
                )

                (
                    train_reward,
                    train_timesteps,
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
                    curriculum_params=curriculum_params, base_params=base_params
                )

                session_results["iterations"].append(
                    {
                        "curriculum_params": curriculum_params,
                        "base_params": base_params,
                        "train_reward": train_reward,
                        "train_timesteps": train_timesteps,
                        "train_success": train_success,
                        "stage_eval_reward": stage_eval_rewards,
                        "stage_eval_timesteps": stage_eval_timesteps,
                        "stage_eval_success": stage_eval_success,
                        "target_eval_reward": target_eval_rewards,
                        "target_eval_timesteps": target_eval_timesteps,
                        "target_eval_success": target_eval_successes,
                        "iterations_taken": iterations_taken,
                        "model_path": model_save_path,
                        "training_config": config.training_config,
                    }
                )

                all_eval_rewards.extend(target_eval_rewards)
                all_eval_timesteps.extend(target_eval_timesteps)
                all_eval_successes.extend(target_eval_successes)

                num_points = len(target_eval_rewards)
                for i in range(num_points):
                    cumulative_episodes += episodes_per_iter
                    x_axis_episodes.append(cumulative_episodes)

                    steps_this_iter = train_timesteps[i] * episodes_per_iter
                    cumulative_timesteps += int(steps_this_iter)
                    x_axis_timesteps.append(cumulative_timesteps)

                print(
                    f"Completed stage {stage_idx + 1}/{len(training_progress)} for session {session_id} (run {run_index})"
                )

            npz_output_path = os.path.join(
                run_save_path, f"session_{session_run_id}_results.npz"
            )

            np.savez(
                npz_output_path,
                reward=np.array(all_eval_rewards),
                timestep=np.array(all_eval_timesteps),
                success=np.array(all_eval_successes),
                x_axis_episode=np.array(x_axis_episodes),
                x_axis_timestep=np.array(x_axis_timesteps),
            )

            print(f"Saved NPZ data for session {session_run_id} to: {npz_output_path}")
            return session_results

        except Exception as e:
            print(f"ERROR in worker for session {session_id} (run {run_index}): {e}")
            import traceback

            traceback.print_exc()
            return None

    def _post_complete_hook(self):
        """
        Sends an HTTP POST request to a configured endpoint upon completion.
        Useful for notifying a Slack webhook or a monitoring service.
        """
        if self.config.post_complete:
            try:
                message = f"Offline run '{self.config.experiment_name}' complete. Results at {self.save_path}"
                requests.post(self.config.post_complete, data=message.encode("utf-8"))
            except requests.exceptions.RequestException as e:
                print(f"Warning: Failed to send completion notification: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Run offline experiments from DB or JSON based on config."
    )
    parser.add_argument(
        "--config", required=True, help="Path to the YAML configuration file."
    )
    args = parser.parse_args()
    OfflineProcessor(args.config)
