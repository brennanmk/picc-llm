#!/usr/bin/env python3

"""
picc_rl.app.models
-------------------

Module containing sqlalchemy database models
"""

from datetime import datetime

from picc_rl.app import db, app


class User(db.Model):
    """User Model for storing user related details"""

    __tablename__ = "user"
    user_index = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), nullable=False, unique=True)
    registered_on = db.Column(db.DateTime, nullable=False)
    step_order = db.Column(db.JSON, nullable=False)
    experiment_order = db.Column(db.JSON, nullable=True)

    def __init__(self, user_id):
        self.user_id = user_id
        self.step_order = app.config["ORDER"]
        self.registered_on = datetime.now()


class Learning(db.Model):
    """Model for storing user learning info"""

    __tablename__ = "learning"

    learning_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_index = db.Column(db.Integer, nullable=False)
    environment = db.Column(db.String(255), nullable=False)
    visualization_type = db.Column(db.String(255), nullable=False)
    elapsed_time = db.Column(db.JSON, nullable=False)
    training_progress = db.Column(db.JSON, nullable=False)
    active_visualization = db.Column(db.String(255), nullable=True)
    active_environment_config = db.Column(db.JSON, nullable=True)
    model_location = db.Column(db.String(255), nullable=False)
    graph_location = db.Column(db.String(255), nullable=True)
    in_progress = db.Column(db.Boolean, nullable=False)
    progress_current = db.Column(db.Integer, default=0, nullable=False)
    failure_state = db.Column(db.Boolean, default=False, nullable=False)
    complete = db.Column(db.Boolean, nullable=False)


class Consent(db.Model):
    """Consent table stores consent form results for each user"""

    __tablename__ = "consent"

    consent_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    consented = db.Column(db.Boolean, nullable=False)
    completion_date = db.Column(db.DateTime, nullable=False)
    user_index = db.Column(db.Integer, nullable=False)

    def __init__(self, name, consented, user_index):
        self.name = name
        self.completion_date = datetime.now()
        self.consented = consented
        self.user_index = user_index


class Compensation(db.Model):
    """comp table stores emails from participants who have completed the study"""

    __tablename__ = "compensation"

    compensation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False)
    user_index = db.Column(db.Integer, nullable=False)


class PreQuestionnaire(db.Model):
    """Questionnaire Model for storing user questionnaire responses"""

    __tablename__ = "pre_questionnaire"

    questionnaire_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_index = db.Column(db.Integer, nullable=False)
    response = db.Column(db.JSON, nullable=False)


class PostQuestionnaire(db.Model):
    """Questionnaire Model for storing user questionnaire responses"""

    __tablename__ = "post_questionnaire"

    questionnaire_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_index = db.Column(db.Integer, nullable=False)
    response = db.Column(db.JSON, nullable=False)
