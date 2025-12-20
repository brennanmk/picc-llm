#!/usr/bin/env python3

"""
picc_rl.learning.trainer
--------------------------

Module for trainer class responsible for training agent

Gemini helped with doc strings and parallelization refactor
"""

from picc_rl.environments import ENVIRONMENTS
from picc_rl.learning.ppo import PPO
from picc_rl.environments.schemas import TrainingMode
from picc_rl.environments.wrappers import ConfigResetWrapper

from pydantic import BaseModel, ValidationError
from gymnasium import wrappers
from gymnasium.vector import SyncVectorEnv
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
    min_stability_reward: int = 10
    max_stability_training_iterations: int = 100
    num_parallel_envs: int = 10

    load_critic: bool = True
    load_optimizer: bool = True


class Trainer:
    """
    This class is responsible for training and evaluating PPO models
    using parallel vectorized environments.
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
        try:
            validated_kwargs = TrainerKwargs(**kwargs)
        except ValidationError as e:
            raise ValidationError(f"Invalid kwargs: {e}")

        self.num_envs = validated_kwargs.num_parallel_envs
        self.default_env_config = env_config
        self.env_name_or_class = env
        self.max_episode_len = validated_kwargs.max_episode_len

        self._min_lr_fraction = validated_kwargs.min_lr_fraction
        self._min_ent_fraction = validated_kwargs.min_ent_fraction
        self._decay_lr = validated_kwargs.decay_lr
        self._decay_ent = validated_kwargs.decay_ent
        self._target_episodes = validated_kwargs.target_episodes
        self._total_episodes_completed = validated_kwargs.training_episode_start

        def make_env():
            """Factory function for creating and wrapping environments."""

            def _init():
                base_env = (
                    ENVIRONMENTS[self.env_name_or_class](**self.default_env_config)
                    if isinstance(self.env_name_or_class, str)
                    else self.env_name_or_class(**self.default_env_config)
                )

                # ConfigResetWrapper handles set_config and set_curriculum_params calls
                env = ConfigResetWrapper(base_env)

                if self.max_episode_len:
                    env = wrappers.TimeLimit(
                        env, max_episode_steps=self.max_episode_len
                    )

                flattened_env = wrappers.FlattenObservation(env)
                return flattened_env

            return _init

        self._env = SyncVectorEnv([make_env() for _ in range(self.num_envs)])

        if seed is not None:
            torch.manual_seed(seed)
            np.random.seed(seed)

        self.seed = seed

        self._unwrapped_env = self._env.envs[0].env.env.env

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
        self._min_stability_reward = validated_kwargs.min_stability_reward
        self._max_stability_training_iterations = (
            validated_kwargs.max_stability_training_iterations
        )

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

    def _try_decay(self, current_session_episodes: int):
        """
        Calculates and applies the decayed learning rate based on global progress.
        """
        if not (
            self._decay_lr
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

        lr_fraction = (
            self._min_lr_fraction + (1.0 - self._min_lr_fraction) * progress_remaining
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

    def _apply_curriculum(self, params: Optional[Dict[str, Any]]):
        """
        Applies the curriculum parameters to the parallel environments.
        This forces the environment to regenerate its layout based on these params.
        """
        if params is None:
            return

        if not isinstance(params, dict):
            # Strict type checking: We only support curriculum params (Dict) now.
            raise ValueError(f"Trainer expects dictionary params, got {type(params)}")

        self._env.call("set_curriculum_params", params)

    def train_model(
        self,
        curriculum_params: Dict[str, Any],
        base_params: Optional[Dict[str, Any]] = None,
        progress_callback: Optional[Callable[[int], None]] = None,
    ) -> Tuple:
        """Main training loop for the PPO agent."""

        training_iterations = (
            self._max_stability_training_iterations if self._train_until_stable else 1
        )

        eval_reward_history = deque(maxlen=self._stability_check_window)
        all_train_rewards = []
        all_train_timesteps = []
        all_train_successes = []
        all_train_eval_rewards = []
        all_train_eval_timesteps = []
        all_train_eval_successes = []

        iterations_taken = 0

        for _ in range(training_iterations):
            iterations_taken += 1

            iteration_progress_callback = (
                progress_callback if not self._train_until_stable else None
            )

            # Apply user curriculum parameters
            self._apply_curriculum(curriculum_params)

            (
                current_train_reward,
                current_train_timesteps,
                current_train_success,
            ) = self._train_iteration(progress_callback=iteration_progress_callback)

            self._total_episodes_completed += self._episodes_per_iteration

            all_train_rewards.append(current_train_reward)
            all_train_timesteps.append(current_train_timesteps)
            all_train_successes.append(current_train_success)

            # Apply base/comparison curriculum if provided
            if base_params is not None:
                self._apply_curriculum(base_params)

            (
                eval_reward_mean,
                eval_timesteps_mean,
                eval_success,
            ) = self._evaluate_model()

            all_train_eval_rewards.append(eval_reward_mean)
            all_train_eval_timesteps.append(eval_timesteps_mean)
            all_train_eval_successes.append(eval_success)

            if self._train_until_stable:
                if progress_callback:
                    progress = int(
                        (iterations_taken / self._max_stability_training_iterations)
                        * 100
                    )
                    progress_callback(min(progress, 100))

                eval_reward_history.append(eval_reward_mean)
                current_window_mean = sum(eval_reward_history) / len(
                    eval_reward_history
                )

                if len(eval_reward_history) == self._stability_check_window:
                    current_delta = max(eval_reward_history) - min(eval_reward_history)
                    is_stable = current_delta < self._stability_delta_threshold
                    is_performing = current_window_mean > self._min_stability_reward

                    if is_stable and is_performing:
                        print(
                            f"Stable (Delta: {current_delta}) and Performing (Mean: {current_window_mean}). Advancing."
                        )
                        break
            else:
                break

        # Final Evaluation
        if base_params is not None:
            self._apply_curriculum(base_params)

        (
            final_eval_reward_mean,
            final_eval_timesteps_mean,
            final_eval_success_rate,
        ) = self._evaluate_model()

        self._ppo_agent.buffer.clear()

        self._ppo_agent.save(self._save_path)

        if self._checkpoint_dir:
            checkpoint_path = os.path.join(
                self._checkpoint_dir, f"model_iter_{self._training_iteration}.pt"
            )
            self._ppo_agent.save(checkpoint_path)
        else:
            checkpoint_path = None

        self._training_iteration += 1

        return (
            all_train_rewards,
            all_train_timesteps,
            all_train_successes,
            all_train_eval_rewards,
            all_train_eval_timesteps,
            all_train_eval_successes,
            final_eval_reward_mean,
            final_eval_timesteps_mean,
            final_eval_success_rate,
            iterations_taken,
            checkpoint_path,
        )

    def generate_environment(self) -> List:
        """Helper function to generate a random environment configuration.

        Kept for potential API compatibility, but curriculum generation happens
        inside environment reset logic.

        :return: The encoded environment configuration (or empty).
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

            for i in range(self.num_envs):
                is_terminal = dones[i] or truncs[i]

                # Add to buffer
                self._ppo_agent.buffer.states.append(
                    torch.from_numpy(current_states[i]).to(self._ppo_agent.device)
                )
                self._ppo_agent.buffer.actions.append(actions[i])
                self._ppo_agent.buffer.logprobs.append(log_probs[i])
                self._ppo_agent.buffer.state_values.append(state_values[i])
                self._ppo_agent.buffer.rewards.append(rewards[i])
                self._ppo_agent.buffer.is_terminals.append(is_terminal)

                # Update trackers
                current_episode_rewards[i] += rewards[i]
                global_time_steps += 1

                # Check if this env is done
                if is_terminal:
                    total_episodes_collected += 1

                    ep_rewards.append(current_episode_rewards[i])
                    ep_timesteps.append(current_episode_timesteps[i])

                    if (
                        dones[i] and not truncs[i]
                    ):  # Only count non-truncated as success
                        ep_success += 1

                    # Reset this env's trackers
                    current_episode_rewards[i] = 0
                    current_episode_timesteps[i] = 0

                    if progress_callback:
                        progress = int(
                            (total_episodes_collected / self._episodes_per_iteration)
                            * 100
                        )
                        progress_callback(progress)

                # Update policy
                if len(self._ppo_agent.buffer.rewards) >= self._update_frequency:
                    self._try_decay(total_episodes_collected)
                    self._ppo_agent.update()
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
