#!/usr/bin/env python3

"""
picc_rl.utils.training_utils
-----------------------------
Shared utilities for training scripts (PPO, offline, augment)
"""

import os
import importlib
import requests
from typing import List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class CumulativeMetrics:
    """Cumulative metrics across training."""
    
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
    
    :param train_result: 11-item tuple from Trainer.train_model()
    :param metrics: CumulativeMetrics object to update in-place
    :param episodes_per_iter: Episodes per iteration from config
    :return: Summary string of the last evaluation
    """
    
    (
        train_rewards, train_timesteps, train_successes,
        stage_eval_rewards, stage_eval_timesteps, stage_eval_successes,
        target_eval_rewards, target_eval_timesteps, target_eval_successes,
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
        metrics.cumulative_timesteps += int(step_cost)
        metrics.x_axis_timesteps.append(int(metrics.cumulative_timesteps))
        
        last_summary = (
            f"Success: {target_eval_successes[i]*100:.1f}%, "
            f"Reward: {target_eval_rewards[i]:.1f}"
        )
    
    return last_summary


def process_training_iteration_to_dict(
    train_result: Tuple,
    trackers: dict,
    cumulative_episodes: int,
    cumulative_timesteps: int,
    episodes_per_iter: int
) -> Tuple[int, int]:
    """
    Process training iteration and update dictionary-based trackers.
    
    Similar to process_training_iteration but works with dict trackers
    instead of CumulativeMetrics object. Returns updated counters.
    
    :param train_result: 11-item tuple from Trainer.train_model()
    :param trackers: Dictionary with 'reward', 'timestep', 'success', 'x_axis_episodes', 'x_axis_timesteps' keys
    :param cumulative_episodes: Current episode count
    :param cumulative_timesteps: Current timestep count
    :param episodes_per_iter: Episodes per iteration
    :return: Tuple of (updated_cumulative_episodes, updated_cumulative_timesteps)
    """
    
    (
        train_rewards, train_timesteps, train_successes,
        stage_eval_rewards, stage_eval_timesteps, stage_eval_successes,
        target_eval_rewards, target_eval_timesteps, target_eval_successes,
        iterations_taken, checkpoint_path
    ) = train_result
    
    # Extend trackers with target evaluation metrics
    trackers["reward"].extend(target_eval_rewards)
    trackers["success"].extend(target_eval_successes)
    trackers["timestep"].extend(target_eval_timesteps)
    
    num_points = len(target_eval_rewards)
    
    for i in range(num_points):
        cumulative_episodes += episodes_per_iter
        trackers["x_axis_episodes"].append(cumulative_episodes)
        
        steps_this_iter = train_timesteps[i] * episodes_per_iter
        cumulative_timesteps += int(steps_this_iter)
        trackers["x_axis_timesteps"].append(cumulative_timesteps)
    
    return cumulative_episodes, cumulative_timesteps


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
