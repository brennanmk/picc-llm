#!/usr/bin/env python3

"""
picc_llm.utils.plot_results
-------------------

A command-line utility to gather and plot experiment results
from aggregated .npz files.
"""

import numpy as np
import argparse
import os
from datetime import datetime

from picc_llm.utils.plotting_utils import plot_comparison

ANALYSIS_STORAGE = "analysis_plots"


def generate_plot(files, labels, metric, output, xaxis_choice):
    """
    Core logic to gather data from specified NPZ files and generate a plot.
    If 'split_index' is present in the file, it splits the line into
    Curriculum vs Augmented segments.

    Handles both 1D arrays (single run) and 2D arrays (multiple runs).
    """
    data_sources = []

    if files:
        for file_path, label in zip(files, labels):
            try:
                data = np.load(file_path)

                xaxis_key = f"x_axis_{xaxis_choice}"
                if xaxis_key not in data:
                    print(f"Warning: '{xaxis_key}' not found in {file_path}. Skipping.")
                    continue
                x_axis = data[xaxis_key]

                if metric in data:
                    y_data = data[metric]

                    # Handle both 1D and 2D data
                    y_data = np.atleast_2d(y_data)

                    # If data is 1D (shape like (N,)), atleast_2d makes it (1, N)
                    # If data is already 2D (runs, points), keep as is
                    if y_data.shape[0] == 1 or len(y_data.shape) == 1:
                        # Single run case - squeeze back to 1D for mean
                        y_mean = np.squeeze(y_data)
                        y_err = None
                    else:
                        # Multiple runs case - compute mean and std
                        y_mean = np.mean(y_data, axis=0)
                        y_std = np.std(y_data, axis=0)
                        y_err = y_std  # Can also use y_std / np.sqrt(y_data.shape[0]) for SEM

                    # Check for split_index to visualize curriculum vs augmentation
                    if 'split_index' in data:
                        split_idx = int(data['split_index'])

                        # Handle invalid or disabled split_index
                        if split_idx <= 0 or split_idx >= len(x_axis):
                            print(f"Info: split_index={split_idx} is invalid for {file_path}. Treating as continuous.")
                        else:
                            # Split the data at split_idx
                            # Curriculum: up to and including split point
                            data_sources.append({
                                'x': x_axis[:split_idx+1],
                                'y_mean': y_mean[:split_idx+1],
                                'y_err': y_err[:split_idx+1] if y_err is not None else None,
                                'label': f"{label} (Curriculum)"
                            })

                            # Augmented: from split point to end
                            data_sources.append({
                                'x': x_axis[split_idx:],
                                'y_mean': y_mean[split_idx:],
                                'y_err': y_err[split_idx:] if y_err is not None else None,
                                'label': f"{label} (Augmented)"
                            })
                            continue

                    # Treat as single continuous line if no valid split found
                    data_sources.append({
                        'x': x_axis,
                        'y_mean': y_mean,
                        'y_err': y_err,
                        'label': label
                    })
                else:
                    print(f"Warning: Metric '{metric}' not found in {file_path}. Skipping.")

            except Exception as e:
                print(f"Warning: Could not load or process {file_path}: {e}. Skipping.")
                import traceback
                traceback.print_exc()

    if not data_sources:
        print("No valid data could be loaded. Exiting.")
        return

    metric_map = {"reward": "Average Reward", "timestep": "Average Timesteps", "success": "Success Rate"}
    metric_name = metric_map.get(metric, metric.capitalize())

    if output:
        save_path = output
    else:
        os.makedirs(ANALYSIS_STORAGE, exist_ok=True)
        date_string = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
        # Sanitize label string for filename
        safe_labels = "_vs_".join(
            source['label'].replace(" ", "_").replace("(", "").replace(")", "")
            for source in data_sources
        )
        # Truncate if filename gets too long
        if len(safe_labels) > 50:
            safe_labels = safe_labels[:50] + "_etc"

        save_path = os.path.join(ANALYSIS_STORAGE, f"{metric}_{safe_labels}_{date_string}.png")

    plot_comparison(
        data_sources=data_sources,
        metric_name=metric_name,
        save_path=save_path,
        title=f"Comparison of {metric_name}",
        xaxis_name=xaxis_choice.capitalize()
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="plot_results",
        description="Plot experiment results from .npz files."
    )

    parser.add_argument("--files", nargs='+', required=True, help="Space-separated paths to 'data.npz' files to plot.")
    parser.add_argument("--labels", nargs='+', required=True, help="Space-separated labels for each file, in the same order.")
    
    parser.add_argument("--metric", choices=["reward", "timestep", "success"], default="success", help="The metric to plot.")
    parser.add_argument("--output", default=None, help="Optional: The file name for the output plot.")
    
    parser.add_argument(
        "--xaxis",
        choices=["episode", "timestep"],
        default="episode",
        help="The x-axis to plot against (default: 'episode')."
    )

    args = parser.parse_args()

    if len(args.files) != len(args.labels):
        parser.error("The number of --files must match the number of --labels.")

    generate_plot(
        files=args.files,
        labels=args.labels,
        metric=args.metric,
        output=args.output,
        xaxis_choice=args.xaxis
    )
