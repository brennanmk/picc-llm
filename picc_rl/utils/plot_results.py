#!/usr/bin/env python3

"""
picc_rl.utils.plot_results
-------------------

A command-line utility to gather and plot experiment results
from aggregated .npz files.
"""

import numpy as np
import argparse
import os
from datetime import datetime

from picc_rl.utils.plotting_utils import plot_comparison

ANALYSIS_STORAGE = "analysis_plots"


def generate_plot(files, labels, metric, output, xaxis_choice):
    """
    Core logic to gather data from specified NPZ files and generate a plot.
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
                    # This is a raw file (1D or 2D)
                    # plotting_utils will handle calculating mean/std if it's 2D
                    y_data = data[metric]
                    data_sources.append({
                        'x': x_axis,
                        'y_mean': y_data,  # Pass raw data
                        'y_err': None,     # plotting_utils will calc error if 2D
                        'label': label
                    })
                else:
                    print(f"Warning: Metric '{metric}' not found in {file_path}. Skipping.")
            
            except Exception as e:
                print(f"Warning: Could not load or process {file_path}: {e}. Skipping.")

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
        safe_labels = "_vs_".join(source['label'].replace(" ", "_") for source in data_sources)
        save_path = os.path.join(ANALYSIS_STORAGE, f"{metric}_{safe_labels}_{date_string}.png")

    plot_comparison(
        data_sources=data_sources,
        metric_name=metric_name,
        save_path=save_path,
        title=f"Comparison of {metric_name}",
        xaxis_name=xaxis_choice.capitalize() # Use the choice for the axis name
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
