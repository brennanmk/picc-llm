#!/usr/bin/env python3

"""
picc_llm.utils.train_curriculum
===============================

Unified curriculum training system supporting multiple modes.

This script handles curriculum-based training from exported session data,
supporting replay of existing sessions and augmentation to target episodes.

Works with both LLM-generated and manually-designed curricula.

Modes of Operation:
    1. **curriculum**: Execute training from session data (replay/offline mode)
    2. **augment**: Continue training from checkpoints to reach target episodes
    3. **full**: Execute curriculum then seamlessly augment to target

Output:
    - **.npz files:** Training metrics for each session
    - **.json files:** Consolidated experiment results
    - **.pt files:** Model checkpoints

.. module:: train_curriculum
   :synopsis: Unified curriculum training from exported session data
"""

import json
import yaml
import argparse
import math
import os
import numpy as np
from typing import List, Optional, Dict
from pydantic import BaseModel, model_validator
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
    send_completion_notification,
)
from picc_llm.utils.aggregate import aggregate_directory


class CurriculumConfig(BaseModel):
    """Configuration for curriculum training experiments."""

    experiment_name: str = "curriculum_run"
    test_storage: str = "curriculum_experiments"
    number_of_procs: int = 1
    post_complete: Optional[str] = None

    env: str
    env_config: dict = {}
    env_path: Optional[str] = None

    mode: str  # "curriculum" | "augment" | "full"

    # For curriculum mode
    session_data_file: Optional[str] = None
    curriculum_training_config: Optional[Dict] = None

    # For augment mode
    curriculum_results_file: Optional[str] = None
    augment_training_config: Optional[Dict] = None
    max_total_episodes: Optional[int] = None

    # For all modes
    runs_per_session: int = 1

    # Decay scope for curriculum stages.
    # "none": no decay during curriculum stages (default).
    # "stage": decay LR/entropy within each stage, resetting to initial values
    curriculum_decay_scope: str = "none"  # "none" | "stage"

    # Decay scope for augmentation phase.
    # "global": decay is calculated over max_total_episodes
    # "phase": decay is calculated only over Phase 2's remaining episodes
    augment_decay_scope: str = "global"  # "global" | "phase"

    # Early stopping for augmentation phase: stop once reward stabilizes at a
    # high level. Set convergence_reward_threshold to enable (e.g. 0.95).
    convergence_reward_threshold: Optional[float] = None
    convergence_check_window: int = 20
    convergence_delta_threshold: float = 15.0

    @model_validator(mode="after")
    def validate_mode_requirements(self):
        """Ensures required fields are present for each mode."""
        mode = self.mode.lower()
        if mode == "curriculum":
            if not self.session_data_file:
                raise ValueError("curriculum mode requires 'session_data_file'")
            if not self.curriculum_training_config:
                raise ValueError("curriculum mode requires 'curriculum_training_config'")

        elif mode == "augment":
            if not self.curriculum_results_file:
                raise ValueError("augment mode requires 'curriculum_results_file'")
            if not self.augment_training_config:
                raise ValueError("augment mode requires 'augment_training_config'")
            if not self.max_total_episodes:
                raise ValueError("augment mode requires 'max_total_episodes'")

        elif mode == "full":
            if not self.session_data_file:
                raise ValueError("full mode requires 'session_data_file'")
            if not self.curriculum_training_config:
                raise ValueError("full mode requires 'curriculum_training_config'")
            if not self.augment_training_config:
                raise ValueError("full mode requires 'augment_training_config'")
            if not self.max_total_episodes:
                raise ValueError("full mode requires 'max_total_episodes'")
        else:
            raise ValueError(
                f"mode must be 'curriculum', 'augment', or 'full', got '{self.mode}'"
            )

        if self.augment_decay_scope not in ("global", "phase"):
            raise ValueError(
                f"augment_decay_scope must be 'global' or 'phase', got '{self.augment_decay_scope}'"
            )

        if self.curriculum_decay_scope not in ("none", "stage"):
            raise ValueError(
                f"curriculum_decay_scope must be 'none' or 'stage', got '{self.curriculum_decay_scope}'"
            )

        return self


class TrainCurriculum:
    """
    Unified trainer for curriculum-based learning experiments.
    Replays training sessions from exported session data.
    Works with both LLM-generated and manually-designed curricula.
    """

    @staticmethod
    def _save_training_data(
        save_path: str,
        session_id: str,
        metrics: CumulativeMetrics,
        split_index: Optional[int] = None,
        suffix: str = "data",
    ) -> str:
        """Save training metrics to NPZ file."""

        npz_path = os.path.join(save_path, f"session_{session_id}_{suffix}.npz")

        save_dict = {
            "reward": np.array(metrics.rewards),
            "timestep": np.array(metrics.timesteps),
            "success": np.array(metrics.successes),
            "x_axis_episode": np.array(metrics.x_axis_episodes),
            "x_axis_timestep": np.array(metrics.x_axis_timesteps),
        }

        if split_index is not None:
            save_dict["split_index"] = split_index

        np.savez(npz_path, **save_dict)

        return npz_path

    def __init__(
        self,
        config_path: str,
        num_chunks: int = None,
        chunk_index: int = None,
        output_dir: str = None,
    ):
        """Initialize and run the curriculum training experiment.

        Args:
            config_path: Path to YAML configuration file.
            num_chunks: If set, split sessions into this many chunks across jobs.
            chunk_index: Which chunk this job should process (0-based).
            output_dir: If set, write results here instead of creating a
                timestamped directory. Required for chunked mode so all
                array tasks share one output directory.
        """

        if (num_chunks is None) != (chunk_index is None):
            raise ValueError("--num-chunks and --chunk-index must both be provided or both omitted")

        if num_chunks is not None:
            if num_chunks < 1:
                raise ValueError(f"--num-chunks must be >= 1, got {num_chunks}")
            if chunk_index < 0 or chunk_index >= num_chunks:
                raise ValueError(f"--chunk-index must be in [0, {num_chunks}), got {chunk_index}")

        self.num_chunks = num_chunks
        self.chunk_index = chunk_index

        with open(config_path, "r") as f:
            self.config = CurriculumConfig(**yaml.safe_load(f))

        if output_dir is not None:
            os.makedirs(output_dir, exist_ok=True)
            self.save_path = output_dir
        else:
            self.save_path = create_experiment_directory(
                self.config.test_storage, self.config.experiment_name
            )

        # Save config for reproducibility (only once in chunked mode)
        if self.num_chunks is None or self.chunk_index == 0:
            with open(os.path.join(self.save_path, "config.yaml"), "w") as f:
                yaml.dump(self.config.model_dump(), f, indent=4, sort_keys=False)

        print(f"{'=' * 70}")
        print(f"Starting Curriculum Training Experiment")
        print(f"Mode: {self.config.mode}")
        print(f"Results will be saved to: {self.save_path}")
        print(f"{'=' * 70}\n")

        # Route to appropriate handler
        if self.config.mode == "curriculum":
            self._run_curriculum_mode()
        elif self.config.mode == "augment":
            self._run_augment_mode()
        elif self.config.mode == "full":
            self._run_full_mode()

        print(f"\n{'=' * 70}")
        print(f"Experiment complete! Results saved to: {self.save_path}")
        print(f"{'=' * 70}")

        send_completion_notification(
            self.config.post_complete, self.config.experiment_name, self.save_path
        )

    def _chunk_sessions(self, sessions: List) -> List:
        """Select the chunk of sessions assigned to this job.

        Uses contiguous slicing so that sessions are grouped sequentially.
        If chunking is not enabled, returns all sessions unchanged.
        """
        if self.num_chunks is None:
            return sessions

        total = len(sessions)
        chunk_size = math.ceil(total / self.num_chunks)
        start = self.chunk_index * chunk_size
        end = min(start + chunk_size, total)

        chunk = sessions[start:end]
        if not chunk:
            print(
                f"Chunking: chunk {self.chunk_index + 1}/{self.num_chunks} "
                f"has no sessions (total={total}), nothing to do"
            )
        else:
            print(
                f"Chunking: processing sessions {start}-{end - 1} "
                f"(chunk {self.chunk_index + 1}/{self.num_chunks}, {len(chunk)} sessions)"
            )
        return chunk

    def _run_curriculum_mode(self):
        """Execute curriculum training from session data (replay/offline mode)."""
        print("Mode: CURRICULUM - Running training sessions from data\n")

        sessions = self._load_session_data()
        sessions = self._chunk_sessions(sessions)
        print(f"Processing {len(sessions)} sessions\n")

        worker_args = []
        for session_data in sessions:
            for run_idx in range(self.config.runs_per_session):
                worker_args.append(
                    (session_data, run_idx, self.config, self.save_path, "curriculum")
                )

        results = self._run_parallel_workers(worker_args)

        # Save consolidated results (namespaced by chunk index if chunking)
        successful_results = [r for r in results if r is not None]
        if self.num_chunks is not None:
            results_filename = f"curriculum_results_chunk_{self.chunk_index}.json"
        else:
            results_filename = "curriculum_results.json"
        output_path = os.path.join(self.save_path, results_filename)
        with open(output_path, "w") as f:
            json.dump(successful_results, f, indent=2)

        print(f"\nSaved {len(successful_results)} curriculum results to: {output_path}")

        # Skip inline aggregation in chunked mode — run it after all chunks finish
        if self.num_chunks is None and len(successful_results) > 1:
            aggregate_directory(self.save_path, suffix="curriculum")

    def _run_augment_mode(self):
        """Load completed curricula and augment with additional training."""
        print("Mode: AUGMENT - Continuing training from curriculum checkpoints\n")

        with open(self.config.curriculum_results_file, "r") as f:
            curriculum_results = json.load(f)

        curriculum_results = self._chunk_sessions(curriculum_results)
        print(f"Processing {len(curriculum_results)} curriculum sessions for augmentation\n")

        worker_args = []
        for session_data in curriculum_results:
            worker_args.append(
                (session_data, 0, self.config, self.save_path, "augment")
            )

        results = self._run_parallel_workers(worker_args)

        print(f"\nAugmented {len([r for r in results if r is not None])} sessions")

    def _run_full_mode(self):
        """Execute curriculum then seamlessly continue with augmentation."""
        print("Mode: FULL - Curriculum training followed by augmentation\n")

        sessions = self._load_session_data()
        sessions = self._chunk_sessions(sessions)
        print(f"Processing {len(sessions)} sessions for full training\n")

        worker_args = []
        for session_data in sessions:
            for run_idx in range(self.config.runs_per_session):
                worker_args.append(
                    (session_data, run_idx, self.config, self.save_path, "full")
                )

        results = self._run_parallel_workers(worker_args)

        print(
            f"\nCompleted full training for {len([r for r in results if r is not None])} sessions"
        )

        successful_results = [r for r in results if r is not None]
        # Skip inline aggregation in chunked mode — run it after all chunks finish
        if self.num_chunks is None and len(successful_results) > 1:
            aggregate_directory(self.save_path, suffix="data")

    def _load_session_data(self) -> List[Dict]:
        """Load session data from JSON file exported by export_session_data.py."""

        print(f"Loading session data from file: {self.config.session_data_file}")
        with open(self.config.session_data_file, "r") as f:
            sessions = json.load(f)

        if not isinstance(sessions, list):
            raise ValueError(
                f"Expected JSON file to contain a list of sessions, got {type(sessions)}"
            )

        return sessions

    def _run_parallel_workers(self, worker_args: List) -> List:
        """Execute workers in parallel and collect results."""

        mp.set_start_method("spawn", force=True)

        print(
            f"Starting {len(worker_args)} worker jobs across {self.config.number_of_procs} processes\n"
        )

        with mp.Pool(self.config.number_of_procs) as pool:
            results = list(
                tqdm(
                    pool.starmap(TrainCurriculum._worker, worker_args),
                    total=len(worker_args),
                    desc="Training Progress",
                )
            )

        return results

    @staticmethod
    def _worker(
        session_data: Dict,
        run_index: int,
        config: CurriculumConfig,
        save_path: str,
        mode: str,
    ) -> Optional[Dict]:
        """Worker that trains a single session run."""

        learning_id = session_data.get("learning_id", 0)
        session_id = (learning_id * 1000) + run_index

        try:
            if mode in ["curriculum", "full"]:
                curriculum_history = TrainCurriculum._execute_curriculum_phase(
                    session_data=session_data,
                    session_id=session_id,
                    config=config,
                    save_path=save_path,
                )
            else:  # mode == "augment"
                curriculum_history = TrainCurriculum._load_curriculum_history(
                    session_data
                )

            if mode in ["augment", "full"]:
                TrainCurriculum._execute_augment_phase(
                    curriculum_history=curriculum_history,
                    session_id=session_id,
                    config=config,
                    save_path=save_path,
                    augment_decay_scope=config.augment_decay_scope,
                )

            return curriculum_history.get("result_summary", {"learning_id": session_id})

        except Exception as e:
            print(f"\nERROR in worker for session {learning_id} (run {run_index}): {e}")
            import traceback

            traceback.print_exc()
            return None

    @staticmethod
    def _execute_curriculum_phase(
        session_data: Dict, session_id: int, config: CurriculumConfig, save_path: str
    ) -> Dict:
        """
        Execute the curriculum training phase from exported session data.

        Expects session_data format from export_session_data.py:
        {
            "learning_id": 123,
            "training_progress": [
                {
                    "user_params": {...},
                    ...
                },
                ...
            ]
        }
        """

        training_progress = session_data.get("training_progress")
        if not training_progress:
            raise ValueError(f"Session {session_id}: No training_progress found")

        print(f"\nSession {session_id}: Starting curriculum ({len(training_progress)} stages)")

        # Setup environment
        env_class = load_environment_class(config.env, config.env_path)

        # Model paths
        _, model_path = create_model_directory(save_path, str(session_id))
        model_path = model_path.replace("model.pt", "curriculum_final.pt")

        # Metrics tracking
        metrics = CumulativeMetrics()
        episodes_per_iter = config.curriculum_training_config.get(
            "episodes_per_iteration", 1
        )
        max_iterations = config.curriculum_training_config.get(
            "max_stability_training_iterations", 100
        )
        stability_window = config.curriculum_training_config.get(
            "stability_check_window", 5
        )

        # Build curriculum trainer config with per-stage decay budget
        curriculum_config = config.curriculum_training_config.copy()
        if config.curriculum_decay_scope == "stage":
            max_iters = curriculum_config.get("max_stability_training_iterations", 100)
            eps_per_iter = curriculum_config.get("episodes_per_iteration", 1)
            curriculum_config["target_episodes"] = max_iters * eps_per_iter

        # Create trainer
        trainer = Trainer(
            env=env_class,
            env_config=config.env_config,
            save_path=model_path,
            load_path=None,
            seed=session_id,
            **curriculum_config,
        )

        # Process each stage
        stage_summaries = []
        for stage_idx, stage in enumerate(training_progress):
            user_params = stage.get("user_params")

            # Skip stages with missing user_params
            if user_params is None:
                print(f"  WARNING: Stage {stage_idx + 1} missing user_params - SKIPPING")
                continue

            # Reset decay state between stages so each stage gets its own decay arc
            if config.curriculum_decay_scope == "stage":
                trainer.reset_decay_state()

            # Train on this stage (target evaluation derived from env_config internally)
            train_result = trainer.train_model(
                user_params=user_params,
            )

            # Update metrics
            process_training_iteration(train_result, metrics, episodes_per_iter)

            # Extract per-stage diagnostics from train_result
            (
                _, _, _,
                stage_eval_rewards, _, _,
                stage_max_reward,
                target_eval_rewards, _, _,
                target_max_reward,
                iterations_taken, _,
            ) = train_result

            window = min(stability_window, len(stage_eval_rewards))
            stage_final_reward = (
                float(np.mean(stage_eval_rewards[-window:])) if stage_eval_rewards else 0.0
            )
            target_final_reward = (
                float(np.mean(target_eval_rewards[-window:])) if target_eval_rewards else 0.0
            )

            objects = user_params.get("objects", user_params) if isinstance(user_params, dict) else user_params
            rewards = user_params.get("rewards") if isinstance(user_params, dict) else None

            stage_summaries.append({
                "stage": stage_idx + 1,
                "objects": objects,
                "rewards": rewards,
                "iterations_taken": iterations_taken,
                "max_iterations": max_iterations,
                "stabilized": iterations_taken < max_iterations,
                "episodes_used": iterations_taken * episodes_per_iter,
                "stage_max_reward": float(stage_max_reward) if stage_max_reward is not None else None,
                "stage_final_reward": round(stage_final_reward, 2),
                "stage_proportion": round(stage_final_reward / stage_max_reward, 3) if stage_max_reward else None,
                "target_max_reward": float(target_max_reward) if target_max_reward is not None else None,
                "target_final_reward": round(target_final_reward, 2),
                "target_proportion": round(target_final_reward / target_max_reward, 3) if target_max_reward else None,
            })

            print(f"  Stage {stage_idx + 1}/{len(training_progress)} complete")

        # Save per-stage curriculum summary
        summary_path = os.path.join(save_path, f"session_{session_id}_curriculum_summary.json")
        with open(summary_path, "w") as f:
            json.dump(stage_summaries, f, indent=2)
        print(f"  Saved curriculum summary: {summary_path}")

        # Save curriculum results
        TrainCurriculum._save_training_data(
            save_path,
            str(session_id),
            metrics,
            split_index=len(metrics.rewards) - 1,
            suffix="curriculum",
        )

        print(
            f"Session {session_id}: Curriculum complete ({metrics.cumulative_episodes} episodes)"
        )

        # Store for potential augmentation phase
        return {
            "learning_id": session_id,
            "model_path": model_path,
            "rewards": metrics.rewards,
            "timesteps": metrics.timesteps,
            "successes": metrics.successes,
            "x_axis_episode": metrics.x_axis_episodes,
            "x_axis_timestep": metrics.x_axis_timesteps,
            "total_episodes": metrics.cumulative_episodes,
            "total_timesteps": metrics.cumulative_timesteps,
            "result_summary": {
                "learning_id": session_id,
                "final_reward": metrics.rewards[-1] if metrics.rewards else 0,
                "total_episodes": metrics.cumulative_episodes,
            },
        }

    @staticmethod
    def _load_curriculum_history(session_data: Dict) -> Dict:
        """
        Load history from a completed curriculum session.
        Used in augment mode to continue from checkpoint.
        """
        learning_id = session_data.get("learning_id", 0)

        # Get training progress to compute totals
        stages = session_data.get("training_progress", [])

        # Compute historical metrics
        rewards, timesteps, successes = [], [], []
        x_axis_episodes, x_axis_timesteps = [], []
        total_episodes, total_timesteps = 0, 0

        for stage in stages:
            try:
                # Use target evaluation metrics (performance on full task)
                stage_reward = stage["target_eval_reward"][-1]
                stage_success = stage["target_eval_success"][-1]
                stage_timestep = stage["target_eval_timesteps"][-1]

                # Compute episode counts from train metrics
                stage_episodes = len(stage.get("train_reward", []))
                stage_ts = sum(stage.get("train_timesteps", [0]))

                rewards.append(stage_reward)
                timesteps.append(stage_timestep)
                successes.append(stage_success)

                total_episodes += stage_episodes
                x_axis_episodes.append(total_episodes)

                total_timesteps += stage_ts
                x_axis_timesteps.append(total_timesteps)

            except (KeyError, IndexError, TypeError):
                # Skip malformed stages
                continue

        # Find model path
        model_path = None
        for stage in reversed(stages):
            if stage.get("model_path"):
                model_path = stage["model_path"]
                break

        return {
            "learning_id": learning_id,
            "model_path": model_path,
            "rewards": rewards,
            "timesteps": timesteps,
            "successes": successes,
            "x_axis_episode": x_axis_episodes,
            "x_axis_timestep": x_axis_timesteps,
            "total_episodes": total_episodes,
            "total_timesteps": total_timesteps,
        }

    @staticmethod
    def _execute_augment_phase(
        curriculum_history: Dict,
        session_id: int,
        config: CurriculumConfig,
        save_path: str,
        augment_decay_scope: str = "global",
    ):
        """
        Execute the augmentation phase: continue training to reach target episodes.
        Can train on the final curriculum params or randomly.
        """

        target_episodes = config.max_total_episodes
        current_episodes = curriculum_history["total_episodes"]
        episodes_to_run = target_episodes - current_episodes

        # Initialize metrics from curriculum history
        metrics = CumulativeMetrics()
        metrics.rewards = curriculum_history["rewards"].copy()
        metrics.timesteps = curriculum_history["timesteps"].copy()
        metrics.successes = curriculum_history["successes"].copy()
        metrics.x_axis_episodes = curriculum_history["x_axis_episode"].copy()
        metrics.x_axis_timesteps = curriculum_history["x_axis_timestep"].copy()
        metrics.cumulative_episodes = current_episodes
        metrics.cumulative_timesteps = curriculum_history["total_timesteps"]

        split_index = len(curriculum_history["rewards"]) - 1

        if episodes_to_run <= 0:
            print(
                f"Session {session_id}: Already at target episodes, skipping augmentation"
            )
            TrainCurriculum._save_training_data(
                save_path, str(session_id), metrics, split_index=split_index
            )
            return

        print(
            f"\nSession {session_id}: Starting augmentation ({episodes_to_run} episodes to go)"
        )

        episodes_per_iter = config.augment_training_config.get(
            "episodes_per_iteration", 1
        )
        iterations_to_run = math.ceil(episodes_to_run / episodes_per_iter)

        # Setup environment
        env_class = load_environment_class(config.env, config.env_path)

        # Model paths
        _, final_model_path = create_model_directory(save_path, str(session_id))
        final_model_path = final_model_path.replace("model.pt", "augmented_final.pt")

        # Load from curriculum checkpoint
        checkpoint_path = curriculum_history.get("model_path")
        if not checkpoint_path or not os.path.exists(checkpoint_path):
            raise FileNotFoundError(
                f"Curriculum checkpoint not found: {checkpoint_path}"
            )

        print(f"  Loading checkpoint: {checkpoint_path}")
        print(f"  Target: {config.max_total_episodes} episodes")
        print(f"  Current: {current_episodes} episodes")
        print(f"  Remaining: {episodes_to_run} episodes ({iterations_to_run} iterations)")

        # Create trainer with augmentation config
        # Augment phase owns its own outer loop, so each train_model() call is 1 iteration
        augment_config = config.augment_training_config.copy()
        augment_config["max_stability_training_iterations"] = 1

        if augment_decay_scope == "phase":
            # Decay scoped to Phase 2 only: starts at full LR/entropy and decays
            # over episodes_to_run, regardless of how many episodes Phase 1 used.
            augment_config["target_episodes"] = episodes_to_run
            augment_config["training_episode_start"] = 0
        else:
            # Decay scoped globally: Phase 2 inherits Phase 1's episode count as
            # progress, treating the full run as one continuous decay arc.
            augment_config["target_episodes"] = target_episodes
            augment_config["training_episode_start"] = current_episodes

        trainer = Trainer(
            env=env_class,
            env_config=config.env_config,
            save_path=final_model_path,
            load_path=checkpoint_path,
            seed=session_id,
            **augment_config,
        )

        # user_params=None lets the trainer use the env's default config
        # (RANDOM mode generates full task layouts, AUGMENTED would need explicit params)
        user_params = None
        target_max_reward = None

        # Train (target evaluation derived from env_config internally)
        for iteration_idx in tqdm(
            range(iterations_to_run),
            desc=f"Augmenting Session {session_id}",
            leave=False,
        ):
            train_result = trainer.train_model(
                user_params=user_params,
            )

            process_training_iteration(train_result, metrics, episodes_per_iter)

            if target_max_reward is None:
                target_max_reward = train_result[10]

            if (
                config.convergence_reward_threshold is not None
                and target_max_reward is not None
                and check_convergence(
                    metrics.rewards[split_index + 1:],
                    target_max_reward,
                    config.convergence_reward_threshold,
                    config.convergence_check_window,
                    config.convergence_delta_threshold,
                )
            ):
                print(
                    f"\nSession {session_id}: Converged at episode "
                    f"{metrics.cumulative_episodes} "
                    f"(avg reward {sum(metrics.rewards[-config.convergence_check_window:]) / config.convergence_check_window:.1f}"
                    f" >= {config.convergence_reward_threshold * target_max_reward:.1f}). Stopping early."
                )
                break

        # Save combined results
        TrainCurriculum._save_training_data(
            save_path, str(session_id), metrics, split_index=split_index
        )

        print(
            f"Session {session_id}: Augmentation complete ({metrics.cumulative_episodes} total episodes)"
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Unified curriculum training from exported session data"
    )
    parser.add_argument(
        "--config", required=True, help="Path to YAML configuration file"
    )
    parser.add_argument(
        "--num-chunks",
        type=int,
        default=None,
        help="Split sessions into N chunks across SLURM array jobs",
    )
    parser.add_argument(
        "--chunk-index",
        type=int,
        default=None,
        help="Which chunk this job processes (0-based, typically $SLURM_ARRAY_TASK_ID)",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default=None,
        help="Shared output directory (required for chunked mode so all tasks write to the same place)",
    )
    args = parser.parse_args()

    TrainCurriculum(
        args.config,
        num_chunks=args.num_chunks,
        chunk_index=args.chunk_index,
        output_dir=args.output_dir,
    )
