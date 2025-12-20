#!/usr/bin/env python3

"""
picc_rl.app.utils.app_utils
-----------------

Helper functions for webapp

These functions are not central to learning, but also do not really belong in
views.
"""

from picc_rl.visualizations import visualizations
from picc_rl.environments import ENVIRONMENTS
from picc_rl.app import app, db
from picc_rl.app.models import Learning
import numpy as np
from datetime import datetime
import os
from picc_rl.app.models import (
    User,
)

import base64
from io import BytesIO
from PIL import Image


def generate_conditions(user_index: int) -> list:
    """
    Generates conditions for participant, samples with weights from
    available envs / vis conditions

    We use env configs to tell us which environments are valid for the study.

    :param user_index: index of user to add cond for
    :return: list of new conditions
    """

    environment_count = {env: 0 for env in ENVIRONMENTS if env in app.config["ENV_CONFIGS"]}
    visualization_count = {vis: 0 for vis in visualizations}
    # lets figure out the freq's of previous conditions
    for entry in Learning.query.all():
        visualization_count[entry.visualization_type] += 1
        environment_count[entry.environment] += 1

    conditions = []
    for _ in range(app.config["NUMBER_OF_EXPERIMENTS_PER_PARTICIPANT"]):
        environment = weighted_selection(environment_count)

        visual = weighted_selection(visualization_count)

        condition_dir_name = f"{user_index}_{environment}_{visual}"
        model_storage_path = os.path.join(
            app.config["MODEL_STORAGE_DIR"], condition_dir_name
        )

        learning = Learning(
            user_index=user_index,
            environment=environment,
            visualization_type=visual,
            elapsed_time={"previous": 0.0, "total": 0.0},
            training_progress=[],
            active_environment_config=None,
            active_visualization=(
                "The robot has not been trained at all yet."
                if visual != "none"
                else None
            ),
            graph_location=(
                os.path.join(
                    app.config["GRAPH_STORAGE_DIR"],
                    f"{user_index}_{environment}_{visual}.png",
                )
                if visual != "none"
                else None
            ),
            model_location=os.path.join(model_storage_path, "latest.pt"),
            in_progress=False,
            complete=False,
        )

        conditions.append(learning)

        # we do not want repeat vis or environments
        del visualization_count[visual]
        del environment_count[environment]

    return conditions


def elapsed_time(user_index: int, elapsed_time: float, timestamp: datetime) -> None:
    """
    Updates user time elapsed, tracking time is hard... we have a few failsafes.
    We update timing data on a interval, this gives us a live view of how long participants
    are taking. This ensures that if they accidently close the student and later reopen it
    we can maintain consistant timing data. We also send timing data when the page is closed,
    this is not gaurenteed to work as javascript is awful. Finally we send timing data on page
    submit.

    :param user_index: index to update db / trainers
    :param elapsed_time: how much additional time has elapsed

    :return: None
    """
    app.logger.debug(f"Adding time for {user_index}: {elapsed_time}")

    user = User.query.filter_by(user_index=user_index).first()

    entry = Learning.query.filter_by(
        learning_id=(user.experiment_order)[0]
    ).first()

    json_elapsed_time = entry.elapsed_time

    if (
        "latest_timestamp" in json_elapsed_time
        and json_elapsed_time["latest_timestamp"] > timestamp
    ):
        return False

    new_elapsed_time = {}

    new_elapsed_time["latest_timestamp"] = timestamp
    new_elapsed_time["previous"] = elapsed_time

    # If the new elapsed time is smaller than the old it means the session was reset.
    if elapsed_time < json_elapsed_time["previous"]:
        new_elapsed_time["total"] = json_elapsed_time["total"] + elapsed_time
    else:
        new_elapsed_time["total"] = json_elapsed_time["total"] + (
            elapsed_time - json_elapsed_time["previous"]
        )

    entry.elapsed_time = new_elapsed_time
    db.session.commit()

    return True


def in_progress(user_index: int) -> tuple[bool, float, bool]:
    """
    Checks if learning is in progress for user and its failure state.

    :param user_index: index to update db / trainers
    :return: (in_progress, current_progress, failure_state)
    """
    user = User.query.filter_by(user_index=user_index).first()

    # If user has no more experiments, they are done.
    if not user or not user.experiment_order:
        return False, 0.0, False

    entry = Learning.query.filter_by(
        learning_id=(user.experiment_order)[0]
    ).first()

    return entry.in_progress, entry.progress_current, entry.failure_state

def visualization_type(user_index: int) -> str:
    """
    Gets visualization type for user

    :param user_index: index to update db / trainers

    :return: visualization type
    """

    user = User.query.filter_by(user_index=user_index).first()

    entry = Learning.query.filter_by(
        learning_id=(user.experiment_order)[0]
    ).first()

    return entry.visualization_type


def image_to_base64(image_path: str) -> bytes:
    """Converts a PIL Image to a base64 encoded string. This was vibe coded.

    :param image_path: path of image relative to the module to turn to base 64
    :return: base64 representation of image used for flask
    """
    buffered = BytesIO()
    image = Image.open(image_path)
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str


def weighted_selection(item_counts: dict) -> any:
    """
    Creates a probability distribution from a dictionary of item counts,
    where the probability of each item is inversely proportional to its count.
    Selects a random item according to this prob distritubtion

    :param item_counts: dict containing counts of each item
    :return: which item is selected
    """

    items = list(item_counts.keys())
    counts = np.array(list(item_counts.values()))

    adjusted_counts = counts + 1

    inverse_counts = 1 / adjusted_counts
    probabilities = inverse_counts / np.sum(inverse_counts)

    choice = np.random.choice(
        items,
        p=probabilities,
    )

    return choice
