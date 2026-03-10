#!/usr/bin/env python3

"""
run_offline_training.py
-----------------------
Reads session data from EITHER a live database OR a JSON file,
runs offline training, and saves results.

Generates .npz files containing:
- 'reward', 'timestep', 'success': 1D arrays of final eval metrics per stage.
- 'x_axis_episode': 1D array of cumulative episodes at the end of each stage.
- 'x_axis_timestep': 1D array of cumulative timesteps at the end of each stage.

Generates a consolidated .json file containing 'stage_total_episodes'
and 'stage_total_timesteps' for use by augment_training.py.
"""

import json
import yaml
import argparse
import os
import requests
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, model_validator
from tqdm import tqdm
import importlib
import numpy as np

import torch.multiprocessing as mp

from picc_llm.learning.trainer import Trainer

from picc_llm.llm.llm_handler import LLMHandler, format_curriculum_history


class ProcessingConfig(BaseModel):
    """
    Defines the configuration for a targeted offline processing run.
    Validates that exactly one data source is provided.
    """

    learning_ids_to_process: Optional[List[int]] = None
    session_data_file: Optional[str] = None

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

    @model_validator(mode="after")
    def check_data_source(self):
        """Ensures exactly one data source is specified."""
        has_db_ids = self.learning_ids_to_process is not None
        has_file = self.session_data_file is not None

        if not has_db_ids and not has_file:
            raise ValueError(
                "Either 'session_data_file' (for JSON) or 'learning_ids_to_process' (for DB) must be provided."
            )
        if has_db_ids and has_file:
            raise ValueError(
                "Provide *either* 'session_data_file' or 'learning_ids_to_process', not both."
            )
        
class OfflineProcessor:
    """Orchestrates the parallel processing of offline jobs."""

    def __init__(self, config_path: str):
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

    def run(self):
        """
        Loads learning sessions from the configured data source (DB or JSON)
        and distributes them to a processing pool.
        """
        mp.set_start_method("spawn", force=True)
        
        all_session_data = [] # This list will be populated by either branch

        if self.config.session_data_file:
            data_file_path = self.config.session_data_file
            print(f"Loading session data from JSON file: {data_file_path}")
            if not os.path.exists(data_file_path):
                print(f"Error: Session data file not found at {data_file_path}")
                return
            with open(data_file_path, "r") as f:
                all_session_data = json.load(f) # This is already a list of dicts

        print(f"Loaded {len(all_session_data)} total sessions to process.")
        
        worker_args = []
        for session_data in all_session_data:
            for run_idx in range(self.config.runs_per_session):
                worker_args.append(
                    # Pass the whole session_data dict to the worker
                    (session_data, self.config, self.save_path, run_idx)
                )

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
        session_data: dict,
        config: ProcessingConfig, 
        run_save_path: str, 
        run_index: int
    ) -> Optional[dict]:
        """
        Worker that processes one session.
        Handles both pre-defined curriculum replay and dynamic AI generation if config is missing.
        """
        # Initialize results structure
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
            print(f"Warning: Session {session_id} has no 'training_progress'. Skipping.")
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

            # --- START STAGE LOOP ---
            for stage_idx, stage in enumerate(training_progress):
                
                curriculum_params = stage.get("curriculum_params")
                base_params = stage.get("base_params")

                if curriculum_params is None:
                    print(f"  > Session {session_id}: Stage {stage_idx+1} Config Missing. Triggering AI Architect...")
                    
                    try:
                        history_str = format_curriculum_history(session_results["iterations"])                       
                        context_data = {
                            "context": history_str,
                            "current_stage": stage_idx + 1,
                            "total_stages": len(training_progress) 
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

                train_result = trainer.train_model(
                    curriculum_params=curriculum_params,
                    base_params=base_params
                )

                if train_result is None:
                    raise RuntimeError(f"Trainer returned None for stage {stage_idx}")

                (
                    train_reward,
                    train_timesteps,
                    train_success,
                    train_eval_rewards,
                    train_eval_timesteps,
                    train_eval_success,
                    final_eval_reward,
                    final_eval_timesteps,
                    final_eval_success,
                    iterations_taken,
                    checkpoint_path,
                ) = train_result

                stage_total_timesteps = sum(train_timesteps)
                stage_total_episodes = iterations_taken * episodes_per_iter

                # Append to our local results (which also serves as history for the next AI step)
                session_results["iterations"].append(
                    {
                        "curriculum_params": curriculum_params,
                        "base_params": base_params,
                        "train_reward": train_reward,
                        "train_timesteps": train_timesteps,
                        "train_success": train_success,
                        "train_eval_reward": train_eval_rewards,
                        "train_eval_timesteps": train_eval_timesteps,
                        "train_eval_success": train_eval_success,
                        "final_eval_reward": final_eval_reward,
                        "final_eval_timesteps": final_eval_timesteps,
                        "final_eval_success": final_eval_success,
                        "iterations_taken": iterations_taken,
                        "model_path": model_save_path,
                        "training_config": config.training_config,
                        "stage_total_timesteps": stage_total_timesteps,
                        "stage_total_episodes": stage_total_episodes,
                    }
                )

                all_eval_rewards.append(final_eval_reward)
                all_eval_timesteps.append(final_eval_timesteps)
                all_eval_successes.append(final_eval_success)

                cumulative_episodes += stage_total_episodes
                x_axis_episodes.append(cumulative_episodes)

                cumulative_timesteps += stage_total_timesteps
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
