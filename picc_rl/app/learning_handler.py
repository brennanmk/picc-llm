#!/usr/bin/env python3

"""
picc_rl.app.learning_handler
============================

Unified learning handler - gets base_params internally rather than as parameter.

.. module:: learning_handler
   :synopsis: Logic for handling RL training progression and state management.
"""

from picc_rl.visualizations import visualizations
from picc_rl.learning.trainer import Trainer
from picc_rl.environments import ENVIRONMENTS
from picc_rl.app import app, db
from picc_rl.app.models import User, Learning

from sqlalchemy.orm.attributes import flag_modified

import os
from typing import Dict, Any, Tuple, Optional


class LearningHandler:
    """
    Manages the learning session for a specific user.
    
    Handler is responsible for determining both user_params (curriculum)
    and base_params (target) from available sources.
    """

    def __init__(self, user_index: int) -> None:
        """Initialize the LearningHandler, loading state from the database."""
        self.trainer = None
        self.learner = None
        self.user_index = user_index
        self.complete = False

        app.logger.debug(f"User: {user_index} is requesting a learning handler...")

        user = User.query.filter_by(user_index=user_index).first()

        json_experiment_order = user.experiment_order
        json_step_order = user.step_order

        model = Learning.query.filter_by(learning_id=json_experiment_order[0]).first()

        if not model:
            app.logger.error(
                f"User {user_index}: FATAL: Could not find Learning model."
            )
            raise ValueError(f"Learning model not found for user {user_index}.")

        if model.failure_state:
            app.logger.error(
                f"User {user_index}: Attempted to initialize a LearningHandler for a failed training session."
            )
            raise ValueError(
                f"Training session for user {user_index} is in a failed state and cannot be continued."
            )

        self.environment = model.environment
        training_progress_list = model.training_progress

        if (
            len(training_progress_list)
            >= app.config["TRAINING_ITERATIONS_PER_CONDITION"]
        ):
            app.logger.debug(
                f"User {user_index} completed iteration of training, progressing"
            )

            model.complete = True
            del json_experiment_order[0]

            user.experiment_order = json_experiment_order
            flag_modified(user, "experiment_order")

            if len(json_experiment_order) == 0:
                app.logger.debug(f"User {user_index} has completed experimentation.")
                del json_step_order[0]

                user.step_order = json_step_order
                flag_modified(user, "step_order")

                self.complete = True

            db.session.commit()

        elif not model.complete:
            try:
                env_config = app.config["ENV_CONFIGS"][self.environment]
            except KeyError:
                env_config = {}

            checkpoint_dir = os.path.dirname(model.model_location)
            self.trainer = Trainer(
                env=model.environment,
                save_path=model.model_location, 
                load_path=model.model_location,
                checkpoint_dir=checkpoint_dir,
                training_iteration_start=len(training_progress_list),
                env_config=env_config,
                **app.config["TRAINING_CONFIG"],
            )
            self.learner = model

    def set_in_progress(self) -> None:
        """Marks the current learning session as 'in progress' in the database."""
        if self.learner.in_progress:
            app.logger.error(
                f"User {self.user_index} tried to set training in progress but already in progress"
            )
            return
        self.learner.in_progress = True
        self.learner.current_progress = 0
        db.session.commit()

    def _extract_object_counts(self, params: Any) -> Optional[Dict[str, int]]:
        """
        Extract object_counts from various parameter formats.
        
        :param params: Parameters in any supported format
        :return: Object counts dictionary or None
        """
        if params is None:
            return None
        
        if not isinstance(params, dict):
            return None
            
        if "objects" in params:
            return params["objects"]
        
        if "width" in params or "height" in params:
            objects = {
                k: v for k, v in params.items() 
                if k not in ["width", "height", "reasoning"]
            }
            return objects if objects else None
        
        return params

    def _get_base_params(self) -> Any:
        """
        Determine base_params (target config) from available sources.
        
        Priority:
        1. learner.active_environment_config (if stored)
        2. app.config["TARGET_ENV_CONFIG"] (default)
        
        :return: Base params in original format
        """
        # Check if we have an active config stored
        if self.learner and self.learner.active_environment_config:
            return self.learner.active_environment_config
        
        # Fall back to configured target
        return app.config.get("TARGET_ENV_CONFIG")

    def train(self, user_params: Any) -> None:
        """
        Executes a single iteration of training.
        
        Handler determines base_params internally from learner state or config.
        
        :param user_params: Curriculum/stage parameters (any format)
        """

        def update_progress(current: float):
            """Internal callback to update database progress during training loop."""
            self.learner.progress_current = current
            db.session.commit()

        app.logger.debug(f"User {self.user_index} started training.")

        # Store user_params for visualization/history
        self.learner.active_environment_config = user_params
        
        # Handler determines base_params (not passed as parameter)
        base_params = self._get_base_params()
        
        # Extract object counts for trainer
        user_object_counts = self._extract_object_counts(user_params)
        base_object_counts = self._extract_object_counts(base_params)
        
        app.logger.debug(f"User {self.user_index}: user_object_counts={user_object_counts}")
        app.logger.debug(f"User {self.user_index}: base_object_counts={base_object_counts}")

        (
            train_reward,
            train_timesteps,
            train_success,
            stage_eval_rewards,
            stage_eval_timesteps,
            stage_eval_success,
            target_eval_rewards,
            target_eval_timesteps,
            target_eval_successes,
            iterations_taken,
            checkpoint_path,
        ) = self.trainer.train_model(
            object_counts=user_object_counts,
            target_object_counts=base_object_counts,
            progress_callback=update_progress,
        )

        json_training_progress = self.learner.training_progress

        training_progress = {
            "user_params": user_params,
            "base_params": base_params,
            "train_reward": train_reward,
            "train_timesteps": train_timesteps,
            "train_success": train_success,
            
            "stage_eval_reward": stage_eval_rewards,
            "stage_eval_timesteps": stage_eval_timesteps,
            "stage_eval_success": stage_eval_success,
            
            "target_eval_reward": target_eval_rewards,
            "target_eval_timesteps": target_eval_timesteps,
            "target_eval_success": target_eval_successes,
            
            "visualization": self.learner.active_visualization,
            "iterations_taken": iterations_taken,
            "model_path": checkpoint_path,
            "training_config": app.config["TRAINING_CONFIG"],
        }

        json_training_progress.append(training_progress)

        self.learner.training_progress = json_training_progress
        flag_modified(self.learner, "training_progress")

        visual = visualizations[self.learner.visualization_type](
            json_training_progress, self.learner.graph_location
        )

        self.learner.active_visualization = visual
        self.learner.in_progress = False

        if app.config["RESET_ENV_CONFIG_ON_ITERATION"]:
            self.learner.active_environment_config = None
        
        db.session.commit()

    def generate_environment(self) -> Tuple[Optional[str], str, str, Any]:
        """
        Retrieves the current environment configuration and metadata for the frontend.
        """
        json_active_config = self.learner.active_environment_config
        
        return (
            self.learner.active_visualization,
            self.learner.graph_location,
            ENVIRONMENTS[self.learner.environment].get_instructions(),
            json_active_config, 
        )

    def save_for_offline_training(self, user_params: Any) -> None:
        """
        Saves a training job specification to the database without executing training.
        Used for DEBUG mode.
        
        :param user_params: Curriculum/stage parameters (any format)
        """
        
        # Handler determines base_params
        base_params = self._get_base_params()
        
        job_package = {
            "model_location": self.learner.model_location,
            "checkpoint_dir": os.path.dirname(self.learner.model_location),
            "user_params": user_params,
            "base_params": base_params,
            "train_reward": [],
            "train_timesteps": [],
            "train_success": [],
            "stage_eval_reward": [],
            "stage_eval_timesteps": [],
            "stage_eval_success": [],
            "target_eval_reward": [],
            "target_eval_timesteps": [],
            "target_eval_success": [],
            "visualization": self.learner.active_visualization,
            "iterations_taken": 0,
            "model_path": None,
            "training_config": app.config["TRAINING_CONFIG"],
        }

        json_training_progress = self.learner.training_progress
        json_training_progress.append(job_package)
        self.learner.training_progress = json_training_progress
        flag_modified(self.learner, "training_progress")

        self.learner.active_visualization = None
        self.learner.in_progress = False
        
        if app.config["RESET_ENV_CONFIG_ON_ITERATION"]:
            self.learner.active_environment_config = None
        
        db.session.commit()
