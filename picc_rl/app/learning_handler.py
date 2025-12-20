#!/usr/bin/env python3

"""
picc_rl.app.learning_handler
-------------------------------------

module containing logic to handle progression of place study. Mostly related to
maintaining a list of trainers.
"""

from picc_rl.visualizations import visualizations
from picc_rl.learning.trainer import Trainer
from picc_rl.environments import ENVIRONMENTS
from picc_rl.app import app, db
from picc_rl.app.models import User, Learning

from sqlalchemy.orm.attributes import flag_modified

import os
from typing import Dict, Any


class LearningHandler:
    def __init__(self, user_index: int) -> None:
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

    def set_in_progress(self):
        """Marks user as in progress."""
        if self.learner.in_progress:
            app.logger.error(
                f"User {self.user_index} tried to set training in progress but already in progress"
            )
            return
        self.learner.in_progress = True
        self.learner.current_progress = 0
        db.session.commit()

    def train(self, curriculum_params: Dict[str, Any]) -> None:
        """
        Train a user's model for one iteration using the provided curriculum parameters.
        
        :param curriculum_params: Dictionary defining the environment generation rules.
        """

        def update_progress(current: float):
            """Callback function to update the database with training progress."""
            self.learner.progress_current = current
            db.session.commit()

        app.logger.debug(f"User {self.user_index} started training with curriculum.")

        # Store the active parameters
        self.learner.active_environment_config = curriculum_params

        (
            train_reward,
            train_timesteps,
            train_success,
            train_eval_rewards,
            train_eval_timesteps,
            train_eval_success,
            final_eval_reward,
            final_eval_timesteps,
            final_eval_success,
            iterations_taken,
            checkpoint_path,
        ) = self.trainer.train_model(
            curriculum_params=curriculum_params,
            base_params=None, # Optional: pass a baseline curriculum here if needed
            progress_callback=update_progress,
        )

        json_training_progress = self.learner.training_progress

        training_progress = {
            "curriculum_params": curriculum_params,
            "train_reward": train_reward,
            "train_timesteps": train_timesteps,
            "train_success": train_success,
            "train_eval_reward": train_eval_rewards,
            "train_eval_timesteps": train_eval_timesteps,
            "train_eval_success": train_eval_success,
            "final_eval_reward": final_eval_reward,
            "final_eval_timesteps": final_eval_timesteps,
            "final_eval_success": final_eval_success,
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

    def generate_environment(self) -> tuple:
        """
        Returns the environment setup data. 
        In Curriculum mode, this primarily returns the instructions and stored params.
        """
        json_active_config = self.learner.active_environment_config
        
        # We assume the frontend handles the "preview" generation based on these params
        # or defaults if None are present.
        
        return (
            self.learner.active_visualization,
            self.learner.graph_location,
            ENVIRONMENTS[self.learner.environment].get_instructions(),
            json_active_config, 
        )

    def save_for_offline_training(self, curriculum_params: Dict[str, Any]) -> None:
        """
        Saves a full training job specification directly to the
        database without actually doing any training (Debug Mode).
        """
        job_package = {
            "model_location": self.learner.model_location,
            "checkpoint_dir": os.path.dirname(self.learner.model_location),
            "curriculum_params": curriculum_params,
            "base_params": self.learner.active_environment_config,
            "train_reward": [],
            "train_timesteps": [],
            "train_success": [],
            "eval_reward": [],
            "eval_timesteps": [],
            "eval_success": [],
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
