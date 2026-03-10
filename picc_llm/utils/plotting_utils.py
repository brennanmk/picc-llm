#!/usr/bin/env python3

"""
picc_llm.utils.plotting_utils
----------------------------

Centralized plotting function for experiment results.
"""

import matplotlib.pyplot as plt
import numpy as np
from typing import List, Dict, Any

# Set a consistent style for all plots
plt.style.use("seaborn-v0_8-darkgrid")


def plot_comparison(
    data_sources: List[Dict[str, Any]],
    metric_name: str,
    save_path: str,
    title: str,
    xaxis_name: str = "episode",
    **kwargs,  # To accept any other arguments
) -> None:
    """
    Generates a comparison plot from a list of data sources.

    This function creates a new figure, plots all data sources,
    styles the plot, and saves it to a file.

    :param data_sources: List of data dictionaries. Each dict should have
                         'x', 'y_mean', 'y_err', and 'label'.
                         'y_mean' can be 1D (aggregated) or 2D (raw).
    :param metric_name: The display name of the metric (e.g., "Average Reward").
    :param save_path: The full file path to save the resulting plot.
    :param title: The title for the plot.
    :param xaxis_name: The name for the x-axis label ('episode' or 'timestep').
    """
    fig, ax = plt.subplots(1, 1, figsize=(12, 8))

    for data in data_sources:
        x = data.get("x")
        y_data = data.get("y_mean")
        y_error = data.get("y_err")
        label = data.get("label", "Data")

        if x is None or y_data is None:
            print(f"Warning: Skipping data for '{label}' due to missing 'x' or 'y_mean'.")
            continue

        mean_to_plot = y_data
        std_to_plot = y_error

        # --- Handle Raw (2D) vs. Aggregated (1D) Data ---
        if y_data.ndim == 2:
            # This is raw 2D data (e.g., [trials, num_points])
            # Calculate mean and std dev across the trials (axis 0)
            mean_to_plot = np.mean(y_data, axis=0)
            std_to_plot = np.std(y_data, axis=0)
        
        # --- Length Mismatch Check ---
        if len(x) != len(mean_to_plot):
            print(
                f"Warning: Mismatch in x ({x.shape}) and y ({mean_to_plot.shape}) "
                f"for label '{label}'. Truncating to shortest length."
            )
            min_len = min(len(x), len(mean_to_plot))
            x = x[:min_len]
            mean_to_plot = mean_to_plot[:min_len]
            if std_to_plot is not None and std_to_plot.ndim > 0:
                 std_to_plot = std_to_plot[:min_len]

        # --- Plotting ---
        ax.plot(x, mean_to_plot, label=label, linewidth=2)
        
        if std_to_plot is not None:
            # Plot the shaded error (std dev or sem) region
            ax.fill_between(
                x,
                mean_to_plot - std_to_plot,
                mean_to_plot + std_to_plot,
                alpha=0.2,
            )

    # --- Style and Save ---
    ax.set_title(title, fontsize=16)
    
    xlabel = "Timesteps" if xaxis_name == "timestep" else "Episodes"
    ax.set_xlabel(xlabel.capitalize(), fontsize=12)

    ax.set_ylabel(metric_name, fontsize=12)
    ax.legend(fontsize=10)
    ax.grid(True, which="both", linestyle="--", linewidth=0.5)
    
    plt.tight_layout()
    plt.savefig(save_path)
    plt.close(fig)
    
    print(f"\nPlot successfully generated and saved to:\n{save_path}")
