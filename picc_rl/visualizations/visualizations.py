#!/usr/bin/env python3

"""
picc-rl.learning.visualizations
-----------------

Contains helper functions to generate visualizations
for each condition.
"""

import seaborn as sns
import matplotlib.pyplot as plt


def none(training_progress, graph_loc) -> None:

    return None


def reward(training_progress, graph_loc) -> float:
    """
    creates a graph and visual for reward condition.

    :param training_progress: training progress dict from database
    :returns: visual and file location of image
    """
    create_graph(
        [entry["final_eval_reward"] for entry in training_progress],
        graph_loc,
    )

    # Get the final performance value from the last list
    final_performance = training_progress[-1]["final_eval_reward"]
    visual = f"During the previous training phase the robot achieved a performance of: {final_performance:.2f} (higher is better)"

    return visual


def timestep(training_progress, graph_loc) -> float:
    """
    creates a graph and visual for timestep condition.

    :param training_progress: training progress dict from database
    :returns: visual and file location of image
    """
    create_graph(
        [entry["final_eval_timesteps"] for entry in training_progress],
        graph_loc,
    )
    
    # Get the final performance value from the last list
    final_performance = training_progress[-1]["final_eval_timesteps"]
    visual = f"During the previous training phase the robot achieved a performance of: {final_performance:.2f} (lower is better)"

    return visual


def create_graph(y, graph_loc) -> None:
    """
    creates a graph of evaluation progress.

    :param data: data to graph
    :param graph_loc: where to store the graph

    :return: file location of image
    """
    x = range(1, len(y) + 1)
    sns.lineplot(x=x, y=y, marker="o", linestyle="-")

    plt.xlim(min(x), max(x))

    # Updated labels for better clarity
    plt.xlabel("Training Iteration")
    plt.ylabel("Performance")
    plt.title("Robot Performance Per Cirriculum Stage")

    plt.savefig(graph_loc)

    plt.clf()
