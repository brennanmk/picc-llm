#!/usr/bin/env python3

"""
picc_llm.utils.training_utils
-----------------------------
Shared utilities for training scripts (curriculum, baseline)
"""

import os
import importlib
import requests
from typing import List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class CumulativeMetrics:
    """cumulative metrics across training."""

    rewards: List[float]
    timesteps: List[float]
    successes: List[float]
    x_axis_episodes: List[int]
    x_axis_timesteps: List[int]

    cumulative_episodes: int = 0
    cumulative_timesteps: int = 0

    def __init__(self):
        self.rewards = []
        self.timesteps = []
        self.successes = []
        self.x_axis_episodes = []
        self.x_axis_timesteps = []
        self.cumulative_episodes = 0
        self.cumulative_timesteps = 0


def process_training_iteration(
    train_result: Tuple,
    metrics: CumulativeMetrics,
    episodes_per_iter: int
) -> str:
    """
    Process the output from Trainer.train_model() and update cumulative metrics.

    This handles the common pattern of extracting target evaluation metrics
    and updating tracking arrays. Works correctly when train_until_stable
    generates multiple evaluation points.

    :param train_result: 13-item tuple from Trainer.train_model()
    :param metrics: CumulativeMetrics object to update in-place
    :param episodes_per_iter: Episodes per iteration from config
    :return: Summary string of the last evaluation
    """

    (
        train_rewards, train_timesteps, train_successes,
        stage_eval_rewards, stage_eval_timesteps, stage_eval_successes,
        stage_max_reward,
        target_eval_rewards, target_eval_timesteps, target_eval_successes,
        target_max_reward,
        iterations_taken, checkpoint_path
    ) = train_result

    last_summary = ""

    # Process each evaluation point
    for i in range(len(target_eval_rewards)):
        metrics.rewards.append(target_eval_rewards[i])
        metrics.timesteps.append(target_eval_timesteps[i])
        metrics.successes.append(target_eval_successes[i])

        metrics.cumulative_episodes += episodes_per_iter
        metrics.x_axis_episodes.append(metrics.cumulative_episodes)

        step_cost = train_timesteps[i] * episodes_per_iter
        metrics.cumulative_timesteps += step_cost
        metrics.x_axis_timesteps.append(int(metrics.cumulative_timesteps))

        last_summary = (
            f"Success: {target_eval_successes[i]*100:.1f}%, "
            f"Reward: {target_eval_rewards[i]:.1f}"
        )

    return last_summary



def check_convergence(
    rewards: List[float],
    target_max_reward: float,
    threshold: float,
    window: int,
    delta: float,
) -> bool:
    """
    Returns True if training has converged: the rolling average over the last
    `window` rewards is >= `threshold * target_max_reward` and the range
    within that window is <= `delta`.

    :param rewards: Full reward history so far
    :param target_max_reward: Maximum achievable reward for the task
    :param threshold: Fraction of max reward required to consider converged (0-1)
    :param window: Number of recent reward points to consider
    :param delta: Maximum reward range within the window to consider stable
    :return: True if converged
    """
    if len(rewards) < window:
        return False
    recent = rewards[-window:]
    avg = sum(recent) / len(recent)
    if avg < threshold * target_max_reward:
        return False
    return (max(recent) - min(recent)) <= delta


def load_environment_class(env: str, env_path: Optional[str] = None):
    """
    Load the environment class from string or module path.

    :param env: Environment name or class
    :param env_path: Optional module path for custom environments
    :return: Environment class
    """

    if env_path is None:
        return env
    else:
        return importlib.import_module(env_path).envs[env]


def create_experiment_directory(
    base_path: str,
    experiment_name: str
) -> str:
    """
    Create a unique timestamped directory for experiment results.

    :param base_path: Base directory for all experiments
    :param experiment_name: Name of this experiment
    :return: Path to created directory
    """

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    dir_name = f"{experiment_name}_{timestamp}"
    save_path = os.path.join(base_path, dir_name)
    os.makedirs(save_path, exist_ok=True)

    return save_path


def create_model_directory(
    save_path: str,
    session_id: str
) -> Tuple[str, str]:
    """
    Create directory for model checkpoints.

    :param save_path: Base save path for experiment
    :param session_id: Unique session identifier
    :return: Tuple of (model_dir, model_path)
    """

    model_dir = os.path.join(save_path, "models", f"session_{session_id}")
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "model.pt")

    return model_dir, model_path



def send_completion_notification(
    webhook_url: Optional[str],
    experiment_name: str,
    save_path: str,
    additional_info: Optional[str] = None
):
    """
    Send a completion notification to a webhook URL.

    :param webhook_url: URL to POST notification to (None to skip)
    :param experiment_name: Name of the experiment
    :param save_path: Path where results were saved
    :param additional_info: Optional additional information to include
    """

    if not webhook_url:
        return

    try:
        message = f"Training complete: {experiment_name}\nResults: {save_path}"
        if additional_info:
            message += f"\n{additional_info}"

        requests.post(webhook_url, data=message.encode("utf-8"))
        print("\nCompletion notification sent")

    except requests.exceptions.RequestException as e:
        print(f"\nWarning: Failed to send notification: {e}")
