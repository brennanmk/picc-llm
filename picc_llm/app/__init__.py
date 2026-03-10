#!/usr/bin/env python3

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from picc_llm.app.config import Config
import logging
from celery import Celery

app = Flask(
    __name__,
)
CORS(app)
app.config.from_object(Config)

app.logger.setLevel(logging.INFO)
app.logger.propagate = False

db = SQLAlchemy(app)

def make_celery(app):
    """
    Configures and creates the Celery application, linking it
    to the Flask app context.
    """
    celery = Celery(
        app.import_name,
        broker=app.config['CELERY_BROKER_URL'],
        backend=app.config['CELERY_RESULT_BACKEND']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

celery_app = make_celery(app)

from picc_llm.app.views import *
from picc_llm.app import tasks
