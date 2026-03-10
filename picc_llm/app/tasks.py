#!/usr/bin/env python3

"""
picc_llm.app.tasks
------------------

This module contains celery background task for training and generation.
"""

from picc_llm.app import celery_app, db, app
from picc_llm.app.learning_handler import LearningHandler
from picc_llm.llm.llm_handler import LLMHandler, format_curriculum_history

log = app.logger


@celery_app.task
def generate_curriculum_task(user_index: int):
    """
    Background task to generate curriculum params via LLM.
    Uses history from DB to provide context.
    """
    with app.app_context():
        log.debug(f"User {user_index}: Starting AI generation task.")
        try:
            handler = LearningHandler(user_index)
            model = handler.learner

            # Determine stage (0 completed -> Stage 1)
            current_stage = len(model.training_progress) + 1
            total_stages = app.config.get("TRAINING_ITERATIONS_PER_CONDITION", 5)

            # Compile Context
            history_str = format_curriculum_history(model.training_progress)

            context_data = {
                "context": history_str,
                "current_stage": current_stage,
                "total_stages": total_stages,
            }

            # Execute (skip LLM in debug mode)
            if app.config.get("APP_DEBUG_MODE", False):
                log.info(f"User {user_index}: Debug mode — using default curriculum config.")
                params = {
                    "width": 8,
                    "height": 8,
                    "objects": {"TREE": 3, "ROCK": 2, "KEY_FRAGMENT": 1, "CHEST": 1},
                    "rewards": {"TREE": "small", "ROCK": "small", "KEY_FRAGMENT": "medium", "CHEST": "medium"},
                    "reasoning": "Debug mode default configuration.",
                }
            else:
                llm = LLMHandler()
                params = llm.generate_curriculum(context_data)

            # Save
            handler.learner.active_environment_config = params
            handler.learner.in_progress = False
            db.session.commit()

        except Exception as e:
            log.error(f"AI Task Failed: {e}", exc_info=True)
            handler = LearningHandler(user_index)
            if handler.learner:
                handler.learner.in_progress = False
                handler.learner.failure_state = True
                db.session.commit()


@celery_app.task
def run_training_task(user_index: int, curriculum_params: dict):
    """Celery task to run the training in the background.

    This task is triggered by the web app when a user submits their
    curriculum design parameters (e.g., object counts, grid size).

    :param user_index: The index (primary key) of the user.
    :param curriculum_params: A dictionary containing the user's submitted
                              curriculum parameters (e.g. {'width': 10, 'objects': {...}})
    :raises Exception: Re-raises any exception caught during the
                       training process after logging it and
                       setting the user's learner to a failure state.
    """
    log.debug(
        f"Celery task for user {user_index}: Starting training with curriculum parameters."
    )
    try:
        handler = LearningHandler(user_index)
        if not handler.complete and handler.trainer is not None:
            # We explicitly pass the params dict
            handler.train(curriculum_params)
            log.debug(f"Celery task for user {user_index}: Training finished.")
        else:
            log.warning(
                f"Celery task for user {user_index}: Could not start (handler complete or trainer is None)."
            )
    except Exception as e:
        failure_handler = LearningHandler(user_index)
        if failure_handler.learner:
            failure_handler.learner.failure_state = True
            db.session.commit()
        log.error(
            f"Celery task for user {user_index}: An error occurred during training: {e}",
            exc_info=True,
        )
        raise
