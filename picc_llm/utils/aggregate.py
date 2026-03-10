#!/usr/bin/env python3

"""
picc_llm.utils.aggregate
========================

Aggregate multiple session NPZ files into a single file with 2D arrays
(num_sessions x timesteps) for plotting mean/CI across users or runs.

Usage:
    python -m picc_llm.utils.aggregate /path/to/experiment_dir
    python -m picc_llm.utils.aggregate /path/to/experiment_dir --suffix curriculum
    python -m picc_llm.utils.aggregate /path/to/experiment_dir --output my_aggregated.npz
"""

import argparse
import glob
import os
from typing import Dict, List, Optional

import numpy as np

from picc_llm.utils.training_utils import CumulativeMetrics


def load_and_interpolate(npz_paths: List[str]) -> Optional[Dict[str, np.ndarray]]:
    """Load NPZ files and interpolate all to a common episode x-axis.

    Returns dict with 2D arrays (num_runs x timesteps) and common axes,
    or None if fewer than 2 files could be loaded.
    """

    all_metrics = []
    split_indices = []

    for npz_path in npz_paths:
        if not os.path.exists(npz_path):
            print(f"  Warning: {npz_path} not found, skipping")
            continue

        try:
            data = np.load(npz_path)

            metrics = CumulativeMetrics()
            metrics.rewards = list(data["reward"])
            metrics.timesteps = list(data["timestep"])
            metrics.successes = list(data["success"])
            metrics.x_axis_episodes = list(data["x_axis_episode"])
            metrics.x_axis_timesteps = list(data["x_axis_timestep"])

            all_metrics.append(metrics)

            if "split_index" in data:
                split_indices.append(int(data["split_index"]))

        except Exception as e:
            print(f"  Warning: Could not load {npz_path}: {e}")

    if len(all_metrics) < 2:
        print("  Not enough valid files to aggregate")
        return None

    run_lengths = [len(m.rewards) for m in all_metrics]
    print(f"  Run lengths: {run_lengths}")

    min_episode = max(m.x_axis_episodes[0] for m in all_metrics)
    max_episode = min(m.x_axis_episodes[-1] for m in all_metrics)

    target_points = int(np.median(run_lengths))
    print(f"  Interpolating to {target_points} points (episode range: {min_episode}-{max_episode})")

    common_x_episodes = np.linspace(min_episode, max_episode, target_points)

    interpolated_rewards = []
    interpolated_timesteps = []
    interpolated_successes = []
    interpolated_x_timesteps = []

    for m in all_metrics:
        x_eps = np.array(m.x_axis_episodes)
        x_ts = np.array(m.x_axis_timesteps)

        interpolated_rewards.append(np.interp(common_x_episodes, x_eps, np.array(m.rewards)))
        interpolated_timesteps.append(np.interp(common_x_episodes, x_eps, np.array(m.timesteps)))
        interpolated_successes.append(np.interp(common_x_episodes, x_eps, np.array(m.successes)))
        interpolated_x_timesteps.append(np.interp(common_x_episodes, x_eps, x_ts))

    # Compute split index from median fraction
    split_index = None
    if split_indices:
        split_fractions = []
        for i, m in enumerate(all_metrics):
            if i < len(split_indices):
                total_eps = m.x_axis_episodes[-1] - m.x_axis_episodes[0]
                si = split_indices[i]
                split_ep = (
                    m.x_axis_episodes[si]
                    if si < len(m.x_axis_episodes)
                    else m.x_axis_episodes[-1]
                )
                fraction = (
                    (split_ep - m.x_axis_episodes[0]) / total_eps
                    if total_eps > 0
                    else 0
                )
                split_fractions.append(fraction)

        if split_fractions:
            split_index = int(np.median(split_fractions) * target_points)

    return {
        "reward": np.array(interpolated_rewards),
        "timestep": np.array(interpolated_timesteps),
        "success": np.array(interpolated_successes),
        "x_axis_episode": common_x_episodes,
        "x_axis_timestep": np.mean(np.array(interpolated_x_timesteps), axis=0),
        "split_index": split_index,
    }


def aggregate_directory(
    directory: str, suffix: str = "data", output: str = "aggregated.npz"
):
    """Find all session NPZ files in a directory and aggregate them."""

    pattern = os.path.join(directory, f"session_*_{suffix}.npz")
    npz_paths = sorted(glob.glob(pattern))

    if not npz_paths:
        print(f"No files matching {pattern}")
        return

    print(f"Found {len(npz_paths)} files to aggregate:")
    for p in npz_paths:
        print(f"  {os.path.basename(p)}")

    data = load_and_interpolate(npz_paths)
    if data is None:
        return

    output_path = os.path.join(directory, output)
    split_index = data["split_index"]

    np.savez(
        output_path,
        reward=data["reward"],
        timestep=data["timestep"],
        success=data["success"],
        x_axis_episode=data["x_axis_episode"],
        x_axis_timestep=data["x_axis_timestep"],
        split_index=split_index if split_index is not None else -1,
    )

    print(f"\nSaved: {output_path}")
    print(f"  Shape: {data['reward'].shape} (sessions x timesteps)")
    if split_index is not None:
        print(f"  Split index: {split_index}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Aggregate session NPZ files into a single file"
    )
    parser.add_argument("directory", help="Path to experiment output directory")
    parser.add_argument(
        "--suffix",
        default="data",
        help="NPZ file suffix to match (default: data -> session_*_data.npz)",
    )
    parser.add_argument(
        "--output",
        default="aggregated.npz",
        help="Output filename (default: aggregated.npz)",
    )
    args = parser.parse_args()

    aggregate_directory(args.directory, args.suffix, args.output)
