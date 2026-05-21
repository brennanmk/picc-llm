#!/usr/bin/env python3

"""
picc_llm.learning.trainer
--------------------------

Module for trainer class responsible for training agent

Updated to accept object_counts directly instead of full grid configs.

Gemini helped with doc strings and parallelization refactor
"""

from picc_llm.environments import ENVIRONMENTS
from picc_llm.learning.ppo import PPO
from picc_llm.learning.chunked_vec_env import ChunkedVecEnv
from picc_llm.environments.schemas import TrainingMode
from picc_llm.environments.wrappers import ConfigResetWrapper

from pydantic import BaseModel, ValidationError, model_validator
from gymnasium import wrappers
from gymnasium.vector import SyncVectorEnv
import multiprocessing as mp
import numpy as np
import os
import copy
from typing import Union, Callable, Optional, Tuple, List, Dict, Any
from collections import deque
import torch


class TrainerKwargs(BaseModel):
    episodes_per_evaluation: int
    episodes_per_iteration: int
    max_episode_len: int = 500
    lr_actor: float = 0.0003
    lr_critic: float = 0.001
    gamma: float = 0.99
    K_epochs: int = 80
    eps_clip: float = 0.2
    ent_coef: float = 0.01
    max_grad_norm: float = 0.5

    decay_lr: bool = False
    decay_ent: bool = False
    min_lr_fraction: float = 0.1
    min_ent_fraction: float = 0.1
    target_episodes: Optional[int] = None
    training_episode_start: int = 0

    update_frequency: int = 1600
    use_gpu: bool = False
    train_until_stable: bool = False
    stability_delta_threshold: float = 5.0
    stability_check_window: int = 5
    min_stability_iterations: int = 0
    max_stability_training_iterations: int = 100
    min_stability_proportion: Optional[float] = None
    num_parallel_envs: int = 10
    num_env_workers: int = 1
    number_of_procs: int = 1
    torch_num_threads: Optional[int] = None
    freeze_actor_updates: int = 0

    train_mode: TrainingMode = TrainingMode.RANDOM
    eval_mode: TrainingMode = TrainingMode.RANDOM

    load_critic: bool = True
    load_optimizer: bool = True

    @model_validator(mode="after")
    def validate_stability_requires_non_random(self):
        if self.train_mode == TrainingMode.RANDOM:
            if self.train_until_stable:
                raise ValueError(
                    "train_until_stable requires a non-RANDOM train_mode "
                    "(stability checks are meaningless when every episode is a different layout)"
                )
            if self.min_stability_proportion is not None:
                raise ValueError(
                    "min_stability_proportion requires a non-RANDOM train_mode "
                    "(stage_max_reward is unavailable in RANDOM mode)"
                )
        return self


class Trainer:
    """
    This class is responsible for training and evaluating PPO models
    using parallel vectorized environments.

    Updated to work with object_counts for more efficient, compact configuration.
    """

    def __init__(
        self,
        env: Union[str, object],
        save_path: str,
        load_path: Optional[str] = None,
        checkpoint_dir: Optional[str] = None,
        seed: Optional[int] = None,
        training_iteration_start: int = 0,
        env_config: dict = {},
        **kwargs,
    ) -> None:
        """Initializes the Trainer object."""
        # Normalize string values to lowercase for enum validation
        normalized_kwargs = {}
        for key, value in kwargs.items():
            if isinstance(value, str) and key in ["train_mode", "eval_mode"]:
                normalized_kwargs[key] = value.lower()
            else:
                normalized_kwargs[key] = value

        try:
            validated_kwargs = TrainerKwargs(**normalized_kwargs)
        except ValidationError as e:
            raise ValueError(f"Invalid training configuration: {e}")

        self.num_envs = validated_kwargs.num_parallel_envs
        self._num_env_workers = validated_kwargs.num_env_workers
        self.default_env_config = env_config
        self.env_name_or_class = env
        self.max_episode_len = validated_kwargs.max_episode_len

        self._min_lr_fraction = validated_kwargs.min_lr_fraction
        self._min_ent_fraction = validated_kwargs.min_ent_fraction
        self._decay_lr = validated_kwargs.decay_lr
        self._decay_ent = validated_kwargs.decay_ent
        self._target_episodes = validated_kwargs.target_episodes
        self._total_episodes_completed = validated_kwargs.training_episode_start

        self._train_mode = validated_kwargs.train_mode
        self._eval_mode = validated_kwargs.eval_mode

        _env_class = (
            ENVIRONMENTS[self.env_name_or_class]
            if isinstance(self.env_name_or_class, str)
            else self.env_name_or_class
        )
        _env_config = self.default_env_config
        _max_ep_len = self.max_episode_len

        def make_env():
            def _init():
                env = ConfigResetWrapper(_env_class(**_env_config))
                if _max_ep_len:
                    env = wrappers.TimeLimit(env, max_episode_steps=_max_ep_len)
                return env
            return _init

        env_fns = [make_env() for _ in range(self.num_envs)]
        if self._num_env_workers > 1 and not mp.current_process().daemon:
            self._env = ChunkedVecEnv(env_fns, n_workers=self._num_env_workers)
        else:
            self._env = SyncVectorEnv(env_fns)

        # Cap PyTorch intra-op threads to avoid oversubscription when multiple
        # trainers run in parallel. Priority: manual > OMP_NUM_THREADS > SLURM > cpu_count.
        n_threads = validated_kwargs.torch_num_threads
        if n_threads is None:
            omp = os.environ.get("OMP_NUM_THREADS")
            if omp:
                n_threads = int(omp)
            else:
                slurm_cpus = os.environ.get("SLURM_CPUS_PER_TASK")
                total_cpus = int(slurm_cpus) if slurm_cpus else (os.cpu_count() or 1)
                n_threads = min(8, max(1, total_cpus // validated_kwargs.number_of_procs))
        torch.set_num_threads(n_threads)

        if seed is not None:
            torch.manual_seed(seed)
            np.random.seed(seed)

        self.seed = seed

        # Keep a standalone env instance for utility methods (encode_config, decode_config).
        # Workers in ChunkedVecEnv run in separate processes and aren't accessible directly.
        self._unwrapped_env = _env_class(**_env_config)

        state_dim = self._env.single_observation_space.shape[0]
        action_dim = self._env.single_action_space.n

        self._ppo_agent = PPO(
            state_dim=state_dim,
            action_dim=action_dim,
            lr_actor=validated_kwargs.lr_actor,
            lr_critic=validated_kwargs.lr_critic,
            gamma=validated_kwargs.gamma,
            K_epochs=validated_kwargs.K_epochs,
            eps_clip=validated_kwargs.eps_clip,
            ent_coef=validated_kwargs.ent_coef,
            max_grad_norm=validated_kwargs.max_grad_norm,
            use_gpu=validated_kwargs.use_gpu,
        )

        self._episodes_per_evaluation = validated_kwargs.episodes_per_evaluation
        self._episodes_per_iteration = validated_kwargs.episodes_per_iteration

        self._update_frequency = validated_kwargs.update_frequency
        self._train_until_stable = validated_kwargs.train_until_stable
        self._stability_delta_threshold = validated_kwargs.stability_delta_threshold
        self._stability_check_window = validated_kwargs.stability_check_window
        self._min_stability_iterations = validated_kwargs.min_stability_iterations
        self._max_stability_training_iterations = (
            validated_kwargs.max_stability_training_iterations
        )
        self._min_stability_proportion = validated_kwargs.min_stability_proportion

        self._freeze_actor_updates = validated_kwargs.freeze_actor_updates
        self._updates_done = 0

        self._reward_buffer = []
        self._is_terminal_buffer = []

        self._save_path = save_path
        self._training_iteration = training_iteration_start

        if checkpoint_dir:
            os.makedirs(checkpoint_dir, exist_ok=True)

        self._checkpoint_dir = checkpoint_dir

        if load_path and os.path.isfile(load_path):
            print(f"Trainer: Initializing weights from input load path: {load_path}")
            self._ppo_agent.load(
                load_path, validated_kwargs.load_critic, validated_kwargs.load_optimizer
            )
        else:
            print(
                "Trainer: Starting training from scratch (no valid load_path provided)."
            )

    def reset_decay_state(self):
        """Resets the episode counter and restores LR/entropy to their initial values.

        Call before each curriculum stage when using per-stage decay, so that
        each stage gets its own full decay arc rather than inheriting progress
        from the previous stage.
        """
        self._total_episodes_completed = 0
        self._ppo_agent.decay(lr_rate=1.0, ent_rate=1.0)

    def _try_decay(self, current_session_episodes: int):
        """
        Calculates and applies the decayed learning rate and/or entropy
        coefficient based on global progress.

        LR decay and entropy decay are independent — either can be enabled
        without the other.
        """
        if not (
            (self._decay_lr or self._decay_ent)
            and self._target_episodes is not None
            and self._target_episodes > 0
        ):
            return

        current_global_episodes = (
            self._total_episodes_completed + current_session_episodes
        )
        progress = current_global_episodes / self._target_episodes
        progress = min(progress, 1.0)
        progress_remaining = 1.0 - progress

        lr_fraction = 1.0
        if self._decay_lr:
            lr_fraction = (
                self._min_lr_fraction
                + (1.0 - self._min_lr_fraction) * progress_remaining
            )
            lr_fraction = max(lr_fraction, self._min_lr_fraction)

        ent_fraction = 1.0
        if self._decay_ent:
            ent_fraction = (
                self._min_ent_fraction
                + (1.0 - self._min_ent_fraction) * progress_remaining
            )
            ent_fraction = max(ent_fraction, self._min_ent_fraction)

        self._ppo_agent.decay(lr_rate=lr_fraction, ent_rate=ent_fraction)

    def _generate_config_from_counts(self, object_counts: Dict[str, int], grid_override: Optional[Dict[str, int]] = None) -> List:
        """
        Generate a full grid configuration from compact object_counts.

        :param object_counts: Dictionary mapping object types to counts
        :param grid_override: Optional dict with "width" and "height" to override default grid dimensions
        :return: Encoded grid configuration
        """
        if grid_override is not None:
            width = grid_override.get("width", 15)
            height = grid_override.get("height", 15)
        else:
            grid_config = self.default_env_config.get("grid", {})
            width = grid_config.get("width", 15)
            height = grid_config.get("height", 15)

        # Get the environment class
        env_class = (
            ENVIRONMENTS[self.env_name_or_class]
            if isinstance(self.env_name_or_class, str)
            else self.env_name_or_class
        )

        # Generate grid from object counts
        generated_grid = env_class.generate_from_params(width, height, object_counts)

        return generated_grid

    def _extract_stage_params(self, params: Any) -> Tuple[Optional[Dict[str, int]], Optional[Dict[str, int]], Optional[Dict[str, str]]]:
        """
        Extract object_counts, optional grid override, and optional reward tiers from params.

        :param params: Parameters in any supported format
        :return: Tuple of (object_counts, grid_override, rewards). grid_override is
                 {"width": W, "height": H} if present, else None.
                 rewards is {"TREE": "medium", ...} if present, else None.
        """
        if params is None:
            return None, None, None

        if not isinstance(params, dict):
            return None, None, None

        grid_override = params.get("grid") if "grid" in params else None
        rewards = params.get("rewards") if "rewards" in params else None

        if "objects" in params:
            return params["objects"], grid_override, rewards

        if "width" in params or "height" in params:
            objects = {
                k: v
                for k, v in params.items()
                if k not in ["width", "height", "grid", "rewards"]
            }
            return (objects if objects else None), grid_override, rewards

        return params, grid_override, rewards

    def train_model(
        self,
        user_params: Any = None,
        progress_callback: Optional[Callable[[int], None]] = None,
    ) -> Tuple:
        """
        Main training loop for the PPO agent.

        :param user_params: Curriculum/stage parameters (any format). If None, uses random generation.
        :param progress_callback: Optional callback for progress updates.
        :return: Tuple of training metrics and checkpoint path.
        """

        # Extract object counts, optional grid override, and reward tiers from params
        user_object_counts, grid_override, user_rewards = self._extract_stage_params(user_params)

        env_class = (
            ENVIRONMENTS[self.env_name_or_class]
            if isinstance(self.env_name_or_class, str)
            else self.env_name_or_class
        )

        # Target is always the full task, derived from env_config
        target_object_counts = env_class.get_max_limits(self.default_env_config)

        stage_max_reward = (
            env_class.get_max_episode_reward(user_object_counts, user_rewards)
            if user_object_counts is not None
            else None
        )
        # Target eval always uses default (sparse) rewards for consistent comparison
        target_max_reward = env_class.get_max_episode_reward(target_object_counts)

        # Generate configs from object_counts if provided
        if user_object_counts is not None:
            stage_config = self._generate_config_from_counts(user_object_counts, grid_override=grid_override)
            decoded_stage_config = self._unwrapped_env.decode_config(
                copy.deepcopy(stage_config)
            )
        else:
            decoded_stage_config = None

        # Generate target config from full task
        target_config = self._generate_config_from_counts(target_object_counts)
        decoded_target_config = self._unwrapped_env.decode_config(
            copy.deepcopy(target_config)
        )

        training_iterations = self._max_stability_training_iterations

        stage_eval_reward_history = deque(maxlen=self._stability_check_window)
        target_eval_reward_history = deque(maxlen=self._stability_check_window)

        all_train_rewards = []
        all_train_timesteps = []
        all_train_successes = []

        all_stage_eval_rewards = []
        all_stage_eval_timesteps = []
        all_stage_eval_successes = []

        all_target_eval_rewards = []
        all_target_eval_timesteps = []
        all_target_eval_successes = []

        iterations_taken = 0

        stage_rewards = user_rewards if user_rewards is not None else {}

        for _ in range(training_iterations):
            iterations_taken += 1

            # Training Phase (On Stage Config, with user reward tiers)
            self._env.call("set_rewards", stage_rewards)
            self._env.call("set_mode", self._train_mode)
            if decoded_stage_config is not None:
                self._env.call("set_config", decoded_stage_config)

            (
                current_train_reward,
                current_train_timesteps,
                current_train_success,
            ) = self._train_iteration()

            self._total_episodes_completed += self._episodes_per_iteration

            all_train_rewards.append(current_train_reward)
            all_train_timesteps.append(current_train_timesteps)
            all_train_successes.append(current_train_success)

            # Stage Evaluation Phase (On Stage Config, with user reward tiers)
            self._env.call("set_rewards", stage_rewards)
            self._env.call("set_mode", self._eval_mode)
            if decoded_stage_config is not None:
                self._env.call("set_config", decoded_stage_config)

            (
                stage_eval_reward,
                stage_eval_timesteps,
                stage_eval_success,
            ) = self._evaluate_model()

            all_stage_eval_rewards.append(stage_eval_reward)
            all_stage_eval_timesteps.append(stage_eval_timesteps)
            all_stage_eval_successes.append(stage_eval_success)

            # Target Evaluation Phase (On Full Task Config, default rewards)
            self._env.call("set_rewards", {})
            self._env.call("set_mode", self._eval_mode)
            self._env.call("set_config", decoded_target_config)

            (
                target_eval_reward,
                target_eval_timesteps,
                target_eval_success,
            ) = self._evaluate_model()

            all_target_eval_rewards.append(target_eval_reward)
            all_target_eval_timesteps.append(target_eval_timesteps)
            all_target_eval_successes.append(target_eval_success)

            # Progress update (outer loop, smooth 0→100 across all iterations)
            if progress_callback:
                progress = int(
                    (iterations_taken / training_iterations) * 100
                )
                progress_callback(min(progress, 100))

            # Stability Check
            if self._train_until_stable:
                stage_eval_reward_history.append(stage_eval_reward)
                target_eval_reward_history.append(target_eval_reward)

                if iterations_taken < self._min_stability_iterations:
                    continue

                if len(stage_eval_reward_history) == self._stability_check_window:
                    current_delta = max(stage_eval_reward_history) - min(
                        stage_eval_reward_history
                    )
                    is_stable = current_delta < self._stability_delta_threshold

                    if is_stable and self._min_stability_proportion is not None:
                        if stage_max_reward is not None and stage_max_reward > 0:
                            target_window_mean = sum(target_eval_reward_history) / len(
                                target_eval_reward_history
                            )
                            proportion = target_window_mean / stage_max_reward
                            is_stable = proportion >= self._min_stability_proportion

                    if is_stable:
                        break

        self._ppo_agent.buffer.clear()
        self._ppo_agent.save(self._save_path)

        if self._checkpoint_dir:
            checkpoint_path = os.path.join(
                self._checkpoint_dir, f"model_iter_{self._training_iteration}.pt"
            )
            self._ppo_agent.save(checkpoint_path)

            # Clean up previous iteration checkpoint to avoid unbounded disk usage
            if self._training_iteration > 0:
                prev_checkpoint = os.path.join(
                    self._checkpoint_dir,
                    f"model_iter_{self._training_iteration - 1}.pt",
                )
                if os.path.isfile(prev_checkpoint):
                    os.remove(prev_checkpoint)
        else:
            checkpoint_path = None

        self._training_iteration += 1

        return (
            all_train_rewards,
            all_train_timesteps,
            all_train_successes,
            all_stage_eval_rewards,
            all_stage_eval_timesteps,
            all_stage_eval_successes,
            stage_max_reward,
            all_target_eval_rewards,
            all_target_eval_timesteps,
            all_target_eval_successes,
            target_max_reward,
            iterations_taken,
            checkpoint_path,
        )

    def generate_environment(self) -> List:
        """Helper function to generate a random environment configuration.

        :return: The encoded environment configuration.
        """
        self._unwrapped_env.reset(config=None, seed=self.seed)
        return self._unwrapped_env.encode_config()

    def _train_iteration(
        self, progress_callback: Optional[Callable[[int], None]] = None
    ) -> Tuple[float, float, float]:
        """Runs a single training iteration using parallel environments.

        This involves collecting experiences from all environments step-by-step
        and updating the policy when the buffer is full.

        :param progress_callback: An optional callback for episode-based progress.
        :return: A tuple containing the mean reward, mean timesteps, and success rate.
        """
        total_episodes_collected = 0
        global_time_steps = 0

        # Metrics for completed episodes
        ep_rewards = []
        ep_timesteps = []
        ep_success = 0

        current_states, infos = self._env.reset(seed=self.seed)

        # Track rewards and lengths for each parallel env
        current_episode_rewards = np.zeros(self.num_envs)
        current_episode_timesteps = np.zeros(self.num_envs, dtype=int)

        # Loop until we have collected enough episodes
        while total_episodes_collected < self._episodes_per_iteration:
            actions, log_probs, state_values = self._ppo_agent._act_batch(
                current_states
            )

            next_states, rewards, dones, truncs, infos = self._env.step(
                actions.cpu().numpy()
            )

            current_episode_timesteps += 1

            # Append a full batch per step — faster than num_envs individual appends.
            is_terminal_batch = dones | truncs
            self._ppo_agent.buffer.states.append(current_states)
            self._ppo_agent.buffer.actions.append(actions)
            self._ppo_agent.buffer.logprobs.append(log_probs)
            self._ppo_agent.buffer.state_values.append(state_values)
            self._ppo_agent.buffer.rewards.append(rewards)
            self._ppo_agent.buffer.is_terminals.append(is_terminal_batch)

            global_time_steps += self.num_envs

            # Per-env episode tracking (no buffer ops here)
            for i in range(self.num_envs):
                current_episode_rewards[i] += rewards[i]

                if is_terminal_batch[i]:
                    total_episodes_collected += 1

                    ep_rewards.append(current_episode_rewards[i])
                    ep_timesteps.append(current_episode_timesteps[i])

                    if (
                        dones[i] and not truncs[i]
                    ):  # Only count non-truncated as success
                        ep_success += 1

                    current_episode_rewards[i] = 0
                    current_episode_timesteps[i] = 0

                    if progress_callback:
                        progress = int(
                            (total_episodes_collected / self._episodes_per_iteration)
                            * 100
                        )
                        progress_callback(min(progress, 100))

            # Buffer length is in steps; multiply by num_envs for transition count
            if len(self._ppo_agent.buffer.rewards) * self.num_envs >= self._update_frequency:
                self._try_decay(total_episodes_collected)
                if self._updates_done < self._freeze_actor_updates:
                    self._ppo_agent.optimizer.param_groups[0]["lr"] = 0.0
                self._ppo_agent.update()
                self._updates_done += 1
                self._ppo_agent.buffer.clear()

            # Update states for next loop
            current_states = next_states

        return (
            np.mean(ep_rewards) if ep_rewards else 0,
            np.mean(ep_timesteps) if ep_timesteps else 0,
            ep_success / total_episodes_collected
            if total_episodes_collected > 0
            else 0,
        )

    def _evaluate_model(self) -> Tuple[float, float, float]:
        """Evaluates the current policy's performance using parallel environments.

        :return: A tuple containing (mean_reward, mean_timesteps, success_rate).
        """
        total_episodes_collected = 0

        eval_rewards = []
        eval_timesteps = []
        eval_success = 0

        current_states, infos = self._env.reset(seed=self.seed)

        current_episode_rewards = np.zeros(self.num_envs)
        current_episode_timesteps = np.zeros(self.num_envs, dtype=int)

        while total_episodes_collected < self._episodes_per_evaluation:
            actions = self._ppo_agent.select_action_inference(current_states)

            next_states, rewards, dones, truncs, infos = self._env.step(actions)

            current_episode_timesteps += 1

            for i in range(self.num_envs):
                current_episode_rewards[i] += rewards[i]

                if dones[i] or truncs[i]:
                    total_episodes_collected += 1

                    eval_rewards.append(current_episode_rewards[i])
                    eval_timesteps.append(current_episode_timesteps[i])

                    if (
                        dones[i] and not truncs[i]
                    ):  # Only count non-truncated as success
                        eval_success += 1

                    # Reset this env's trackers
                    current_episode_rewards[i] = 0
                    current_episode_timesteps[i] = 0

                    if total_episodes_collected >= self._episodes_per_evaluation:
                        break

            if total_episodes_collected >= self._episodes_per_evaluation:
                break

            current_states = next_states

        return (
            np.mean(eval_rewards) if eval_rewards else 0,
            np.mean(eval_timesteps) if eval_timesteps else 0,
            eval_success / total_episodes_collected
            if total_episodes_collected > 0
            else 0,
        )
