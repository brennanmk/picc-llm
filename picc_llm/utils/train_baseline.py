#!/usr/bin/env python3

"""
picc_llm.utils.train_baseline
-------------------------------
Train baseline agents for comparison with curriculum methods.

Runs multiple independent training trials on randomly generated
environments and aggregates results for statistical analysis.

Updated to work with object_counts-based Trainer API.

Refactored with help from Gemini
"""

import yaml
import argparse
import os
import numpy as np
from typing import Optional, List, Dict
from pydantic import BaseModel
from tqdm import tqdm
import torch.multiprocessing as mp

from picc_llm.learning.trainer import Trainer
from picc_llm.utils.training_utils import (
    CumulativeMetrics,
    process_training_iteration,
    check_convergence,
    load_environment_class,
    create_experiment_directory,
    create_model_directory,
    send_completion_notification
)


class BaselineConfig(BaseModel):
    """Configuration for baseline training experiments."""

    experiment_name: str = "baseline_experiment"
    test_storage: str = "baseline_experiments"
    trials: int = 1
    number_of_procs: int = 1
    post_complete: Optional[str] = None

    env: str
    env_config: dict = {}
    env_path: Optional[str] = None

    max_total_episodes: int
    training_config: Dict

    # Early stopping: stop once reward stabilizes at a high level.
    # Set convergence_reward_threshold to enable (e.g. 0.95 = 95% of max reward).
    convergence_reward_threshold: Optional[float] = None
    convergence_check_window: int = 20
    convergence_delta_threshold: float = 15.0

    def model_post_init(self, __context):
        """Validate configuration after initialization."""

        if self.max_total_episodes <= 0:
            raise ValueError("max_total_episodes must be > 0")

        if not self.training_config:
            raise ValueError("training_config is required")


class TrainBaseline:
    """
    Manages baseline training experiments.
    """

    def __init__(self, config_path: str):
        """Initialize and run baseline training."""

        with open(config_path, "r") as f:
            self.config = BaselineConfig(**yaml.safe_load(f))

        self.save_path = create_experiment_directory(
            self.config.test_storage,
            self.config.experiment_name
        )

        # Save config
        with open(os.path.join(self.save_path, "config.yaml"), "w") as f:
            yaml.dump(self.config.model_dump(), f, indent=4)

        print(f"{'='*70}")
        print(f"Starting Baseline Training Experiment")
        print(f"Trials: {self.config.trials}")
        print(f"Target episodes: {self.config.max_total_episodes}")
        print(f"Results: {self.save_path}")
        print(f"{'='*70}\n")

        # Run trials
        all_metrics = self._run_trials()

        # Aggregate and save
        self._save_aggregated_results(all_metrics)

        print(f"\n{'='*70}")
        print(f"Experiment complete! Results: {self.save_path}")
        print(f"{'='*70}")

        send_completion_notification(
            self.config.post_complete,
            self.config.experiment_name,
            self.save_path
        )

    def _run_trials(self) -> List[CumulativeMetrics]:
        """
        Run all trials in parallel.

        :return: List of CumulativeMetrics from successful trials
        """

        mp.set_start_method("spawn", force=True)

        worker_args = [
            (trial_idx, self.config, self.save_path)
            for trial_idx in range(self.config.trials)
        ]

        with mp.Pool(self.config.number_of_procs) as pool:
            results = list(
                tqdm(
                    pool.starmap(TrainBaseline._run_single_trial, worker_args),
                    total=len(worker_args),
                    desc="Running Trials"
                )
            )

        return [r for r in results if r is not None]

    @staticmethod
    def _run_single_trial(
        trial_idx: int,
        config: BaselineConfig,
        save_path: str
    ) -> Optional[CumulativeMetrics]:
        """
        Worker function for a single trial.

        Executes training on randomly generated environments.

        :param trial_idx: Index of this trial
        :param config: Global configuration object
        :param save_path: Directory to save results
        :return: CumulativeMetrics object or None on failure
        """

        try:
            metrics = CumulativeMetrics()

            env_class = load_environment_class(config.env, config.env_path)
            _, model_path = create_model_directory(save_path, str(trial_idx))

            episodes_per_iter = config.training_config.get("episodes_per_iteration", 1)
            training_iterations = config.max_total_episodes // episodes_per_iter

            # Baseline outer loop owns the iteration count
            training_config = dict(config.training_config)
            training_config["max_stability_training_iterations"] = 1

            trainer = Trainer(
                env=env_class,
                env_config=config.env_config,
                save_path=model_path,
                seed=trial_idx,
                target_episodes=config.max_total_episodes,
                **training_config
            )

            target_max_reward = None

            for iteration in tqdm(
                range(training_iterations),
                desc=f"Trial {trial_idx}",
                position=trial_idx,
                leave=True
            ):
                train_result = trainer.train_model()
                process_training_iteration(train_result, metrics, episodes_per_iter)

                if target_max_reward is None:
                    target_max_reward = train_result[10]

                if (
                    config.convergence_reward_threshold is not None
                    and target_max_reward is not None
                    and check_convergence(
                        metrics.rewards,
                        target_max_reward,
                        config.convergence_reward_threshold,
                        config.convergence_check_window,
                        config.convergence_delta_threshold,
                    )
                ):
                    print(
                        f"\nTrial {trial_idx}: Converged at episode "
                        f"{metrics.cumulative_episodes} "
                        f"(avg reward {sum(metrics.rewards[-config.convergence_check_window:]) / config.convergence_check_window:.1f}"
                        f" >= {config.convergence_reward_threshold * target_max_reward:.1f}). Stopping early."
                    )
                    break

            return metrics

        except Exception as e:
            print(f"\nERROR in trial {trial_idx}: {e}")
            import traceback
            traceback.print_exc()
            return None

    def _save_aggregated_results(self, all_metrics: List[CumulativeMetrics]):
        """
        Save aggregated results across trials.

        Combines metrics from all trials into 2D arrays and saves
        to a single NPZ file for statistical analysis.

        :param all_metrics: List of CumulativeMetrics from all trials
        """

        if not all_metrics:
            print("No data to aggregate.")
            return

        # Convert lists of 1D arrays to 2D arrays (trials x num_points)
        rewards = np.array([trial.rewards for trial in all_metrics])
        timesteps = np.array([trial.timesteps for trial in all_metrics])
        successes = np.array([trial.successes for trial in all_metrics])

        # X-axis should be same for all trials (use first trial)
        x_episodes = np.array(all_metrics[0].x_axis_episodes)
        x_timesteps = np.array(all_metrics[0].x_axis_timesteps)

        # Save to NPZ
        output_path = os.path.join(self.save_path, "aggregated_data.npz")

        np.savez(
            output_path,
            reward=rewards,
            timestep=timesteps,
            success=successes,
            x_axis_episode=x_episodes,
            x_axis_timestep=x_timesteps
        )

        print(f"\nSaved aggregated results: {output_path}")
        print(f"  Shape: {rewards.shape} (trials × timesteps)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Run baseline training experiments"
    )
    parser.add_argument("--config", required=True, help="Path to YAML config file")
    args = parser.parse_args()

    TrainBaseline(args.config)
