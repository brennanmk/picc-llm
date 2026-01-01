#!/usr/bin/env python3

"""
picc_rl.app.tasks
=================

This module defines Celery background tasks for the ``picc-rl`` application.
It handles long-running processes such as AI curriculum generation and
Reinforcement Learning training to prevent blocking the main Flask application thread.
"""

from picc_rl.app import celery_app, db, app
from picc_rl.app.learning_handler import LearningHandler

from picc_rl.llm.llm_handler import (
    LLMHandler,
    format_curriculum_history,
    CurriculumParameters,
)

log = app.logger


@celery_app.task
def generate_curriculum_task(user_index: int) -> None:
    """
    Background task to generate curriculum parameters.

    This task retrieves the user's training history from the database, formats it
    into a context string, and queries the configured Large Language Model (LLM)
    to generate the parameters for the next training stage (e.g., grid size, object counts).

    If the application is running in **Debug Mode** (``APP_DEBUG_MODE=True``),
    the LLM query is skipped, and a default configuration is generated using the

    :param int user_index: The unique integer identifier for the user (primary key).
    :return: None

    :raises Exception: Catches general exceptions during the generation process.
                       On failure, logs the error and resets the user's ``in_progress`` status
                       so they are not locked out of the interface.
    """
    with app.app_context():
        log.debug(f"User {user_index}: Starting AI generation task.")
        try:
            handler = LearningHandler(user_index)
            model = handler.learner

            current_stage = len(model.training_progress) + 1
            total_stages = app.config.get("TRAINING_ITERATIONS_PER_CONDITION", 5)

            if app.config.get("APP_DEBUG_MODE", False):
                log.info(f"User {user_index}: Debug Mode ON. Skipping LLM generation.")

                debug_config = CurriculumParameters(
                    reasoning="[DEBUG] Auto-generated placeholder config.",
                    width=10,
                    height=10,
                    objects={},
                )

                params = debug_config.model_dump()

            else:
                history_str = format_curriculum_history(model.training_progress)

                context_data = {
                    "context": history_str,
                    "current_stage": current_stage,
                    "total_stages": total_stages,
                }

                llm = LLMHandler()
                params = llm.generate_curriculum(context_data)

            handler.learner.active_environment_config = params
            handler.learner.in_progress = False
            db.session.commit()

            log.debug(
                f"User {user_index}: AI generation complete (Debug={app.config.get('APP_DEBUG_MODE')})."
            )

        except Exception as e:
            log.error(f"AI Task Failed for User {user_index}: {e}", exc_info=True)

            handler = LearningHandler(user_index)
            if handler.learner:
                handler.learner.in_progress = False
                db.session.commit()


@celery_app.task
def run_training_task(user_index: int, user_params) -> None:
    """
    Background task to execute the Reinforcement Learning training loop.

    Handler determines base_params internally from learner state or config.

    :param user_index: The unique integer identifier for the user.
    :param user_params: Curriculum/stage parameters (any format).
    """
    log.debug(f"Celery task for user {user_index}: Starting training.")

    try:
        handler = LearningHandler(user_index)

        if not handler.complete and handler.trainer is not None:
            # Handler gets base_params internally
            handler.train(user_params)
            log.debug(
                f"Celery task for user {user_index}: Training finished successfully."
            )
        else:
            log.warning(
                f"Celery task for user {user_index}: Aborted. Handler complete or trainer is None."
            )

    except Exception as e:
        failure_handler = LearningHandler(user_index)
        if failure_handler.learner:
            failure_handler.learner.failure_state = True
            db.session.commit()

        log.error(
            f"Celery task for user {user_index}: Critical training error: {e}",
            exc_info=True,
        )
        raise
