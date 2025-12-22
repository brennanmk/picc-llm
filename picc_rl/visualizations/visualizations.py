#!/usr/bin/env python3

"""
picc_rl.visualizations.visualizations
=====================================

This module provides the visualization logic for the different experimental conditions
in the user study. It translates the raw training metrics stored in the database
into user-facing graphs (saved as images) and textual summaries.

.. module:: visualizations
   :synopsis: Helper functions to generate graphs and text summaries for user feedback.
"""

import seaborn as sns
import matplotlib.pyplot as plt
from typing import List, Dict, Any

sns.set_theme(style="whitegrid")


def none(training_progress: List[Dict[str, Any]], graph_loc: str) -> None:
    """
    Handler for the 'None' condition.

    :param training_progress: The full history of training stages (unused).
    :param graph_loc: The target filesystem path for the graph (unused).
    :return: None
    """
    return None


def reward(training_progress: List[Dict[str, Any]], graph_loc: str) -> str:
    """
    Generates a performance graph based on the **Target Task Reward**.

    :param training_progress: A list of dictionaries, where each dictionary represents
                              a completed training stage and contains keys like
                              ``target_eval_reward``.
    :param graph_loc: The absolute filesystem path where the .png image should be saved.
    :return: A formatted string summarizing the agent's final performance on the target task.
    :raises KeyError: If the ``target_eval_reward`` key is missing from any history entry.
    :raises IndexError: If the reward list is empty.
    """
    y_values = [entry["target_eval_reward"][-1] for entry in training_progress]

    create_graph(
        y=y_values,
        graph_loc=graph_loc,
        ylabel="Avg. Reward (Target Task)",
        title="Agent Performance on Final Goal"
    )

    final_performance = y_values[-1]
    
    visual = (
        f"During the previous training phase the robot achieved a target performance of: "
        f"{final_performance:.2f} (higher is better)"
    )

    return visual


def timestep(training_progress: List[Dict[str, Any]], graph_loc: str) -> str:
    """
    Generates an efficiency graph based on **Current Stage Timesteps**.

    :param training_progress: A list of dictionaries, where each dictionary represents
                              a completed training stage and contains keys like
                              ``stage_eval_timesteps``.
    :param graph_loc: The absolute filesystem path where the .png image should be saved.
    :return: A formatted string summarizing the agent's efficiency (average steps taken).
    :raises KeyError: If the ``stage_eval_timesteps`` key is missing from any history entry.
    :raises IndexError: If the timestep list is empty.
    """
    y_values = [entry["stage_eval_timesteps"][-1] for entry in training_progress]

    create_graph(
        y=y_values,
        graph_loc=graph_loc,
        ylabel="Avg. Timesteps (Current Task)",
        title="Agent Efficiency on Current Lesson"
    )
    
    final_performance = y_values[-1]
    
    visual = (
        f"During the previous training phase the robot solved your task in an average of: "
        f"{final_performance:.2f} steps (lower is better)"
    )

    return visual


def create_graph(
    y: List[float], 
    graph_loc: str, 
    ylabel: str = "Performance", 
    title: str = "Robot Performance Per Curriculum Stage"
) -> None:
    """
    Helper function to render and save a Seaborn line plot.

    :param y: A list of float values to plot on the Y-axis. The X-axis is automatically
              generated as a range from 1 to ``len(y)``.
    :param graph_loc: The target filesystem path where the image will be saved.
    :param ylabel: The label text for the Y-axis. Defaults to "Performance".
    :param title: The title text for the chart. Defaults to "Robot Performance Per Curriculum Stage".
    :return: None
    :raises Exception: Propagates any IOErrors or Matplotlib errors encountered during saving.
    """
    if not y:
        return

    plt.figure(figsize=(8, 6))
    x = range(1, len(y) + 1)
    
    sns.lineplot(x=x, y=y, marker="o", linestyle="-", linewidth=2.5, color="#4c72b0")

    from matplotlib.ticker import MaxNLocator
    plt.gca().xaxis.set_major_locator(MaxNLocator(integer=True))

    plt.xlim(min(x) - 0.5, max(x) + 0.5)
    plt.xlabel("Training Stage", fontsize=12)
    plt.ylabel(ylabel, fontsize=12)
    plt.title(title, fontsize=14, fontweight='bold')
    plt.grid(True, linestyle='--', alpha=0.7)

    try:
        plt.savefig(graph_loc, bbox_inches='tight', dpi=100)
    except Exception as e:
        print(f"Error saving visualization to {graph_loc}: {e}")
        raise e
    finally:
        plt.close()
        plt.clf()
