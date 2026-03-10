#!/usr/bin/env python3

"""
average_npz_results.py
--------------------
Loads multiple .npz run data files, which must contain 'x_axis_episode',
'x_axis_timestep', 'reward', 'timestep', and 'success'.

It interpolates all runs onto a common, linear 'x_axis_episode'
and saves a new .npz file containing the combined 2D arrays for all runs,
plus 1D arrays for both 'x_axis_episode' (linear) and 'x_axis_timestep' (averaged).

Output format matches 'picc_llm.utils.train_ppo':
- 'x_axis_episode': 1D array of shape (num_points,) [Linear]
- 'x_axis_timestep': 1D array of shape (num_points,) [Averaged]
- 'reward': A 2D array of shape (num_runs, num_points)
- 'timestep': A 2D array of shape (num_runs, num_points)
- 'success': A 2D array of shape (num_runs, num_points)
"""

import argparse
import numpy as np
from typing import List, Dict, Tuple


def load_and_interpolate_runs(
    file_paths: List[str], num_points: int
) -> Tuple[np.ndarray, Dict[str, np.ndarray], int]:
    """
    Loads all .npz files, interpolates them onto a common x_axis_episode.

    :param file_paths: List of paths to .npz files.
    :param num_points: Number of points for the common x-axis.
    :return: A tuple containing:
             - common_x_axis: The new primary x-axis (episodes, 1D array)
             - interpolated_data: Dict mapping metric -> 2D array (runs x num_points)
             - num_runs: The number of valid files processed.
    """
    if not file_paths:
        print("Error: No input files provided.")
        return np.array([]), {}, 0

    primary_x_key = "x_axis_episode"
    secondary_x_key = "x_axis_timestep"
    print(f"Using '{primary_x_key}' as the primary interpolation axis.")

    print(f"Processing {len(file_paths)} files...")

    raw_runs = []
    min_x, max_x = np.inf, -np.inf

    for fpath in file_paths:
        try:
            with np.load(fpath) as data:
                # Squeeze to handle potential 1xN arrays
                primary_x = np.squeeze(data[primary_x_key])
                secondary_x = np.squeeze(data[secondary_x_key])
                reward = np.squeeze(data["reward"])
                timestep = np.squeeze(data["timestep"])
                success = np.squeeze(data["success"])

                if not (
                    primary_x.shape == secondary_x.shape
                    == reward.shape
                    == timestep.shape
                    == success.shape
                ):
                    print(
                        f"Warning: Skipping {fpath}. Data shapes mismatch."
                    )
                    continue

                # Fix for non-monotonic primary x-axis
                if not np.all(np.diff(primary_x) >= 0):
                    print(f"Warning: Non-monotonic {primary_x_key} in {fpath}. Sorting...")
                    sort_indices = np.argsort(primary_x)
                    primary_x = primary_x[sort_indices]
                    secondary_x = secondary_x[sort_indices]
                    reward = reward[sort_indices]
                    timestep = timestep[sort_indices]
                    success = success[sort_indices]

                raw_runs.append(
                    {
                        "primary_x": primary_x,
                        "secondary_x": secondary_x,
                        "reward": reward,
                        "timestep": timestep,
                        "success": success,
                    }
                )
                min_x = min(min_x, primary_x.min())
                max_x = max(max_x, primary_x.max())

        except Exception as e:
            print(f"Warning: Could not load or parse {fpath}. Error: {e}")

    num_runs = len(raw_runs)
    if num_runs == 0:
        print("Error: No valid run data could be loaded.")
        return np.array([]), {}, 0

    print(f"Loaded {num_runs} valid runs.")
    print(f"Creating common {primary_x_key} from {min_x} to {max_x} with {num_points} points.")

    # Create the common primary x-axis
    common_x_axis = np.linspace(min_x, max_x, num_points)

    interpolated_data = {
        secondary_x_key: [],  # We now interpolate the secondary axis too
        "reward": [],
        "timestep": [],
        "success": [],
    }

    # Interpolate each run onto the common x-axis
    for run in raw_runs:
        try:
            interp_secondary_x = np.interp(
                common_x_axis, run["primary_x"], run["secondary_x"]
            )
            interp_reward = np.interp(
                common_x_axis, run["primary_x"], run["reward"]
            )
            interp_timestep = np.interp(
                common_x_axis, run["primary_x"], run["timestep"]
            )
            interp_success = np.interp(
                common_x_axis, run["primary_x"], run["success"]
            )

            interpolated_data[secondary_x_key].append(interp_secondary_x)
            interpolated_data["reward"].append(interp_reward)
            interpolated_data["timestep"].append(interp_timestep)
            interpolated_data["success"].append(interp_success)
        except Exception as e:
            print(f"Warning: Failed to interpolate run. Error: {e}")
            num_runs -= 1  # Decrement count if interpolation fails

    # Convert lists of 1D arrays to 2D arrays (runs x num_points)
    for key in interpolated_data:
        interpolated_data[key] = np.array(interpolated_data[key])

    return common_x_axis, interpolated_data, num_runs


def save_combined_arrays(
    output_path: str,
    x_axis_episode: np.ndarray,
    data_matrices: Dict[str, np.ndarray],
    num_runs: int,
):
    """
    Saves the combined, interpolated 2D arrays to a new .npz file,
    matching the format of 'train_ppo.py'.

    :param output_path: Path to save the new .npz file.
    :param x_axis_episode: The common primary x-axis (episodes, 1D array).
    :param data_matrices: Dict mapping metric -> 2D array (runs x num_points).
    :param num_runs: The number of valid runs processed.
    """
    if num_runs == 0:
        print("No data to save.")
        return

    print(f"Saving combined 2D arrays for {num_runs} runs...")

    secondary_x_key = "x_axis_timestep"
    
    # The secondary x-axis is a 2D matrix; we average it to get a 1D representation
    avg_secondary_x = np.mean(data_matrices[secondary_x_key], axis=0)

    data_to_save = {
        "x_axis_episode": x_axis_episode, # The primary, linear axis
        "x_axis_timestep": avg_secondary_x, # The averaged, interpolated axis
        "reward": data_matrices.get("reward", np.array([])),
        "timestep": data_matrices.get("timestep", np.array([])),
        "success": data_matrices.get("success", np.array([]))
    }

    if data_to_save["reward"].size == 0:
        print("Warning: No 'reward' data to save.")
    
    try:
        np.savez(output_path, **data_to_save)
        print(f"Successfully saved combined data to {output_path}")
    except Exception as e:
        print(f"Error: Failed to save .npz file to {output_path}. Error: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Combine multiple .npz run files into a single 2D-array .npz file."
    )
    parser.add_argument(
        "-i",
        "--inputs",
        required=True,
        nargs="+",
        help="One or more input .npz files to combine.",
    )
    parser.add_argument(
        "-o",
        "--output",
        required=True,
        help="Path to save the output .npz file (e.g., 'combined_results.npz').",
    )
    parser.add_argument(
        "-n",
        "--num-points",
        type=int,
        default=500,
        help="Number of points for interpolation (default: 500).",
    )
    
    args = parser.parse_args()

    file_paths = args.inputs

    common_x_axis, interpolated_data, num_runs = load_and_interpolate_runs(
        file_paths, args.num_points
    )

    if num_runs > 0:
        save_combined_arrays(
            args.output, common_x_axis, interpolated_data, num_runs
        )
