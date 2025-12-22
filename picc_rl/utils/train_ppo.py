#!/usr/bin/env python3

"""
picc_rl.utils.train_ppo
=======================

Experiment runner for automated PPO training.

This script parses a configuration file to execute one or more training trials.
It leverages multiprocessing to run trials in parallel.

Modes of Operation:
    1. **LLM Curriculum:** Uses the ``LLMHandler`` to simulate an "AI Architect." 
       The LLM reviews the training history (just like a human would) and generates
       new environment configurations.
    2. **Standard Training:** Runs a baseline PPO agent against the default 
       environment configuration (Target Task) for a set number of iterations.

Output:
    - **.npz file:** A consolidated archive containing rewards, timesteps, and success rates
      for all trials, suitable for plotting comparisons.
    - **.yaml file:** A dump of the configuration used for the run.

.. module:: train_ppo
   :synopsis: Automated experiment runner for LLM-guided vs. Standard RL.
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
from pydantic import BaseModel
import importlib
from tqdm import tqdm


class TrainPPOConfig(BaseModel):
    """
    Configuration schema for a PPO training experiment.

    :param trials: Number of independent trials to run in parallel.
    :param number_of_procs: Number of worker processes to spawn.
    :param test_storage: Directory for saving results.
    :param env: The environment ID string.
    :param llm_training_config: Hyperparameters for PPO during LLM phases.
    :param standard_training_config: Hyperparameters for PPO during standard phases.
    :param env_config: The **Target Task** configuration used for evaluation.
    """

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
    """
    Manages the setup and execution of a PPO training experiment.
    """

    def __init__(self, config: str) -> None:
        """
        Initializes and runs the PPO training experiment based on a config file.

        :param config: Path to the YAML configuration file.
        """
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
            try:
                requests.post(
                    self.config.post_complete,
                    data=f"Training complete --- see {self.save_path}".encode(
                        encoding="utf-8"
                    ),
                )
            except Exception as e:
                print(f"Failed to send post_complete notification: {e}")

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
        """
        Starts the multiprocessing pool and collects results from all trials.
        
        :return: Tuple of numpy arrays (reward, timestep, success, x_episodes, x_timesteps)
        """
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
        training_progress_list: List[Dict],
        curriculum_params: Dict,
    ) -> Tuple[int, int]:
        """
        Helper function to unpack Trainer results, update trackers, and maintain history.
        
        Crucially, this extracts metrics from the **Target Task** evaluation lists
        to ensure the recorded history reflects progress toward the final goal.

        :param train_model_output: The 11-element tuple returned by ``Trainer.train_model``.
        :param trackers: Dictionary of lists for storing plotting data (reward, success, etc.).
        :param cumulative_episodes: Total episodes trained so far in this trial.
        :param cumulative_timesteps: Total environment steps taken so far.
        :param episodes_per_iter: Number of episodes per training iteration (config).
        :param training_progress_list: List of stage dictionaries used as context for the LLM.
        :param curriculum_params: The configuration used for the current training stage.
        :return: A tuple (updated_cumulative_episodes, updated_cumulative_timesteps).
        """
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
        ) = train_model_output

        trackers["reward"].extend(target_eval_rewards)
        trackers["success"].extend(target_eval_successes)
        trackers["timestep"].extend(target_eval_timesteps)

        num_points = len(target_eval_rewards)
        
        for i in range(num_points):
            cumulative_episodes += episodes_per_iter
            trackers["x_axis_episodes"].append(cumulative_episodes)

            steps_this_iter = train_timesteps_list[i] * episodes_per_iter
            cumulative_timesteps += int(steps_this_iter)
            trackers["x_axis_timesteps"].append(cumulative_timesteps)

        training_progress_list.append(
            {
                "curriculum_params": curriculum_params,
                "train_reward": train_reward,
                "train_timesteps": train_timesteps_list,
                "train_success": train_success,
                "stage_eval_reward": stage_eval_rewards,
                "stage_eval_timesteps": stage_eval_timesteps,
                "stage_eval_success": stage_eval_success,
                "target_eval_reward": target_eval_rewards,
                "target_eval_timesteps": target_eval_timesteps,
                "target_eval_success": target_eval_successes,
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
        training_progress_list: List[Dict],
    ) -> Tuple[int, int]:
        """
        Runs the LLM-guided curriculum training phase.

        Iteratively queries the LLM for new environment parameters based on the 
        training history, then trains the agent on the generated curriculum step.
        
        :param config: The experiment configuration object.
        :param trial_number: The index of the current trial (for seeding/logging).
        :param env_class: The class of the environment to instantiate.
        :param model_save_path: Path where the model checkpoint should be saved.
        :param trackers: Dictionary for accumulating plotting metrics.
        :param cumulative_episodes: Running count of total episodes trained.
        :param cumulative_timesteps: Running count of total timesteps trained.
        :param training_progress_list: History list used to prompt the LLM.
        :return: A tuple (updated_cumulative_episodes, updated_cumulative_timesteps).
        """

        episodes_per_llm_iter = config.llm_training_config.get(
            "episodes_per_iteration", 0
        )

        trainer = Trainer(
            env=env_class,
            env_config=config.env_config,
            save_path=model_save_path,
            seed=trial_number,
            **config.llm_training_config,
        )

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

            curriculum_params = llm_handler.generate_curriculum(context_data)

            train_output = trainer.train_model(
                curriculum_params=curriculum_params, 
                base_params=config.env_config
            )

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
        """
        Runs the standard (non-curriculum) training phase.

        Trains the agent directly on the Target Task configuration for a set
        number of iterations. Used for baselines or post-curriculum fine-tuning.

        :param config: The experiment configuration object.
        :param trial_number: The index of the current trial.
        :param env_class: The class of the environment to instantiate.
        :param model_save_path: Path where the model checkpoint should be saved.
        :param trackers: Dictionary for accumulating plotting metrics.
        :param cumulative_episodes: Running count of total episodes trained.
        :param cumulative_timesteps: Running count of total timesteps trained.
        :param training_progress_list: History list (updated but unused by logic here).
        :return: A tuple (updated_cumulative_episodes, updated_cumulative_timesteps).
        """

        std_config = config.standard_training_config or config.llm_training_config
        episodes_per_std_iter = std_config.get("episodes_per_iteration", 0)

        trainer = Trainer(
            env=env_class,
            env_config=config.env_config,
            save_path=model_save_path,
            seed=trial_number,
            **std_config,
        )
        
        target_params = config.env_config

        desc = f"Trial {trial_number + 1}/{config.trials} (Standard)"
        for _ in tqdm(
            range(config.standard_training_iterations),
            desc=desc,
            position=trial_number,
            leave=True,
        ):
            train_output = trainer.train_model(
                curriculum_params=target_params, 
                base_params=target_params
            )

            (
                cumulative_episodes,
                cumulative_timesteps,
            ) = TrainPPO._process_training_iteration(
                train_output,
                trackers,
                cumulative_episodes,
                cumulative_timesteps,
                episodes_per_std_iter,
                training_progress_list,
                target_params,
            )

        return cumulative_episodes, cumulative_timesteps

    @staticmethod
    def run_trial(
        trial_number: int, config: TrainPPOConfig, save_path: str
    ) -> Tuple[List, List, List, List, List]:
        """
        Worker function for a single trial, executed in a separate process.

        Orchestrates the sequence of training phases (LLM then Standard, or just Standard)
        for one independent run.

        :param trial_number: The unique ID for this trial.
        :param config: The global experiment configuration.
        :param save_path: Directory to save trial-specific artifacts.
        :return: A tuple containing lists of (reward, timestep, success, x_episodes, x_timesteps).
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
