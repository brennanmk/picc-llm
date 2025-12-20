#!/usr/bin/env python3

"""
picc_rl.app.views
------------------

This module contains views for the picc-rl
study web app.
"""

import copy
import os
import uuid
from datetime import datetime
from functools import wraps

from flask import (
    current_app,
    jsonify,
    make_response,
    redirect,
    render_template,
    render_template_string,
    request,
    session,
    url_for,
    send_from_directory,
)
from sqlalchemy.orm.attributes import flag_modified

from picc_rl.app import app, db
from picc_rl.app.learning_handler import LearningHandler
from picc_rl.app.models import (
    Compensation,
    Consent,
    PostQuestionnaire,
    PreQuestionnaire,
    User,
)
from picc_rl.app.utils.app_utils import (
    elapsed_time,
    generate_conditions,
    image_to_base64,
    in_progress,
    visualization_type,
)
from picc_rl.environments import ENVIRONMENTS

# Tasks for background processing
from picc_rl.app.tasks import run_training_task, generate_curriculum_task

# =================================================================== #
#                               Setup                                 #
# =================================================================== #

# A mapping of survey type to the related database model
SURVEY_HANDLERS = {
    "consent": lambda data, user_index: Consent(
        name=data.get("name"),
        consented=bool(data.get("consent")),
        user_index=user_index,
    ),
    "compensation": lambda data, user_index: Compensation(
        email=data.get("email"),
        user_index=user_index,
    ),
    "pre_study_questionnaire": lambda data, user_index: PreQuestionnaire(
        user_index=user_index, response=data
    ),
    "post_study_questionnaire": lambda data, user_index: PostQuestionnaire(
        user_index=user_index, response=data
    ),
}

# =================================================================== #
#                        Helpers & Decorators                         #
# =================================================================== #


def redirect_step(user):
    """
    A little helper function to handle redirects
    """
    json_step_order = user.step_order
    redir = json_step_order[0]
    return redirect(url_for(redir))


def next_step(user):
    """
    moves the user to the next step in the study
    """
    json_step_order = user.step_order
    del json_step_order[0]
    return json_step_order


def _handle_survey(survey_type):
    """
    Generic handler for processing and rendering survey pages.
    """
    data_handler = SURVEY_HANDLERS.get(survey_type)
    if not data_handler:
        app.logger.error(f"No survey handler found for type: {survey_type}")
        return redirect(url_for("error"))

    if request.method == "POST":
        data = request.get_json()
        user_index = session["user_index"]
        user = User.query.filter_by(user_index=user_index).first()

        db_object = data_handler(data, user_index)

        user.step_order = next_step(user)
        flag_modified(user, "step_order")
        db.session.add(db_object)
        db.session.commit()

        return redirect_step(user)

    questionnaire_data = current_app.config["QUESTIONNAIRES"].get(survey_type, {})
    theme_data = current_app.config["SURVEY_THEME_JSON"]

    return render_template(
        "survey.html",
        survey_type=survey_type,
        questionnaire_data=questionnaire_data,
        theme_data=theme_data,
    )


def verify_user(step):
    """
    Decorator used to verify user has a valid session ID
    bounces them around if they are in the wrong place / are not logged in
    """

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # check if session has an index number
            if "user_index" in session:
                # They have something, lets make sure that it is real
                user_index = session["user_index"]
                user = User.query.filter_by(user_index=user_index).first()
                # They have a session user index but it does not line up with the database, something wierd is going on
                if not user:
                    app.logger.error(
                        f"User attempted to connected with invalid user index: {user_index}"
                    )
                    del session["user_index"]
                    return make_response(redirect(url_for("error")))

                # Lets make sure they are on the right step, if not lets move them along
                redir = user.step_order[0]

                if redir != step:
                    app.logger.debug(
                        f"User: {user_index}, tried to access incorrect step: {step}, redirecting to {redir}"
                    )
                    return redirect(url_for(redir))

                # they are in the right place, we do not need to redirect the request
                app.logger.debug(f"{user_index} verified to access step: {step}")
                return f(*args, **kwargs)

            # user does not have a session token, send them to log in (unless they are already there)
            app.logger.debug(
                f"User attempted to access {step} but does not posess a session token"
            )
            return redirect(url_for("login")) if step != "login" else f(*args, **kwargs)

        return decorated_function

    return decorator


# =================================================================== #
#                        Application Routes                           #
# =================================================================== #

# ------------------------------------------------------------------- #
#                        Authentication Routes                        #
# ------------------------------------------------------------------- #


@app.route("/", methods=["GET", "POST"])
@verify_user("login")
def login():
    """
    Endpoint to login in and get JWT, if user is not in DB yet, add it.
    """
    if request.method == "POST":
        data = request.form
        if "signin" in data:
            uid = request.form.get("uid")
            user = User.query.filter_by(user_id=uid).first()
            if not user:
                return render_template(
                    "login.html", error="Invalid UID, please try again."
                )
            response = redirect_step(user)

        if "register" in data:
            try:
                user_id = str(uuid.uuid4())
                user = User(user_id=user_id)
                db.session.add(user)
                db.session.flush()

                conditions = generate_conditions(user.user_index)
                db.session.add_all(conditions)
                db.session.commit()

                user.experiment_order = [
                    condition.learning_id for condition in conditions
                ]
                db.session.commit()
                app.logger.debug(f"Added new user: {user_id}")
                response = render_template("uid.html", uid=user_id)

            except Exception as e:
                app.logger.error(
                    f"Could not make new user: {user_id}, an expetion has occured: {e}"
                )
                return redirect(url_for("error"))

        # User has either logged in or registered, we have init a response and now we give them a web token
        session["user_index"] = user.user_index
        return response

    return render_template("login.html")


# ------------------------------------------------------------------- #
#                            Survey Routes                            #
# ------------------------------------------------------------------- #


@app.route("/primer", methods=["GET", "POST"])
@verify_user("primer")
def primer():
    """
    Primer view for user study.

    This uses the survey template, but is a little more complicated
    because it dynamically creates the primer content from a jinja
    template. With a little extra abstraction this could be conbined
    with the handle_survey function, but since this is a special case
    we will avoid the added complexity.
    """
    user_index = session["user_index"]

    if request.method == "POST":
        user = User.query.filter_by(user_index=user_index).first()
        user.step_order = next_step(user)
        flag_modified(user, "step_order")
        db.session.commit()
        return redirect_step(user)

    handler = LearningHandler(user_index)
    env_name = handler.environment
    vis_type = visualization_type(user_index)

    env = ENVIRONMENTS[env_name]
    env_primer_text = env.get_primer_text()
    env_primer_template = env.get_primer_template()

    final_html = render_template_string(
        env_primer_template, primer_text=env_primer_text, vis_type=vis_type
    )

    questionnaire_data = copy.deepcopy(current_app.config["QUESTIONNAIRES"]["primer"])
    questionnaire_data["elements"][0]["html"] = final_html
    theme_data = current_app.config["SURVEY_THEME_JSON"]

    return render_template(
        "survey.html",
        survey_type="primer",
        questionnaire_data=questionnaire_data,
        theme_data=theme_data,
    )


@app.route("/consent", methods=["GET", "POST"])
@verify_user("consent")
def consent():
    """Consent view for user study"""
    return _handle_survey("consent")


@app.route("/compensation", methods=["GET", "POST"])
@verify_user("compensation")
def compensation():
    """Compensation view for user study"""
    return _handle_survey("compensation")


@app.route("/prestudyquestionnaire", methods=["GET", "POST"])
@verify_user("pre_study_questionnaire")
def pre_study_questionnaire():
    """Pre-study questionnaire view for user study"""
    return _handle_survey("pre_study_questionnaire")


@app.route("/poststudyquestionnaire", methods=["GET", "POST"])
@verify_user("post_study_questionnaire")
def post_study_questionnaire():
    """Post-study questionnaire view for user study"""
    return _handle_survey("post_study_questionnaire")


# ------------------------------------------------------------------- #
#                          Core Study Routes                          #
# ------------------------------------------------------------------- #


@app.route("/study", methods=["GET", "POST"])
@verify_user("environment")
def environment():
    """
    Place RL experiment view. Handles both displaying the environment (GET)
    and submitting data for training (POST).
    """
    user_index = session["user_index"]

    if request.method == "GET":
        app.logger.debug(
            f"User {user_index}: Accessed environment view with GET request."
        )
        
        # 1. Check if background task is running (Training or AI Generation)
        user_in_progress, _, _ = in_progress(user_index)
        if user_in_progress:
            app.logger.debug(
                f"User {user_index}: Task in progress. Redirecting to loading."
            )
            return redirect(url_for("loading"))

        learning_handler = LearningHandler(user_index)

        # 2. Check if Experiment is complete
        if learning_handler.complete:
            app.logger.debug(
                f"User {user_index}: Experiment complete. Redirecting to next step."
            )
            user = User.query.filter_by(user_index=user_index).first()
            return redirect_step(user)

        # 3. AUTOMATIC AI GENERATION (Pre-flight)
        # If no active config exists, trigger AI generation before showing UI.
        if learning_handler.learner.active_environment_config is None:
            app.logger.info(
                f"User {user_index}: No active config found. Auto-triggering AI generation."
            )
            
            # Lock the user state
            learning_handler.set_in_progress()
            
            # Fire the background task
            generate_curriculum_task.delay(user_index)
            
            # Redirect to loading to wait for AI
            return redirect(url_for("loading"))

        # 4. Render Interface
        # At this point, active_environment_config is populated
        visualization, graph_location, instructions, active_config = (
            learning_handler.generate_environment()
        )

        env = ENVIRONMENTS[learning_handler.environment]
        object_image_map = env.get_object_image_map()
        object_enum_map = env.get_object_enum_map()
        configurable_objects = env.get_configurable_objects()
        
        return render_template(
            "environment.html",
            config=active_config, # Contains AI params & reasoning
            visualization=visualization,
            graph=(
                image_to_base64(graph_location)
                if graph_location and os.path.exists(graph_location)
                else None
            ),
            instructions=instructions,
            timestamp=datetime.now().isoformat(),
            enum_image_map=object_image_map,
            object_enum_map=object_enum_map,
            configurable_objects=configurable_objects
        )

    if request.method == "POST":
        data = request.get_json()
        app.logger.debug(f"User {user_index}: Received POST data in environment view.")

        timestamp = data["timestamp"]
        elapsed = data["elapsed_time"]
        if not elapsed_time(user_index, elapsed, timestamp):
            app.logger.error(
                f"Could not update time for: {user_index}, newer session is available."
            )
            return "", 404

        # Updated to check for 'curriculum_params' instead of 'user_config'
        if "curriculum_params" in data:
            curriculum_params = data["curriculum_params"]
            learning_handler = LearningHandler(user_index)

            # Check if we are in debug/offline mode, if so we only need to save
            if current_app.config.get("APP_DEBUG_MODE", False):
                app.logger.debug(
                    f"User {user_index}: App in debug mode. Queuing job in database."
                )
                learning_handler.save_for_offline_training(curriculum_params)
                return "", 200  # Return success, page will reload to next step

            else:
                app.logger.debug(
                    f"User {user_index}: Curriculum params received. Enqueuing training task."
                )
                learning_handler.set_in_progress()

                run_training_task.delay(user_index, curriculum_params)

                return "", 202

        app.logger.debug(f"User {user_index}: Time sync successful.")
        return "", 200


@app.route("/preview", methods=["POST"])
@verify_user("environment")
def preview_environment():
    """
    Generates a single instance of the environment based on
    user-defined curriculum parameters.
    """
    user_index = session["user_index"]
    data = request.get_json()

    width = int(data.get("width", 10))
    height = int(data.get("height", 10))
    object_counts = data.get("objects", {})

    handler = LearningHandler(user_index)
    env_class = ENVIRONMENTS[handler.environment]

    try:
        grid_layout = env_class.generate_from_params(width, height, object_counts)

        return jsonify({"grid": grid_layout, "status": "success"})

    except ValueError as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    except Exception as e:
        app.logger.error(f"Preview generation failed: {e}")
        return jsonify({"status": "error", "message": "Generation failed"}), 500


@app.route("/loading", methods=["POST", "GET"])
@verify_user("environment")
def loading():
    """
    Handles loading page display (GET) and progress polling (POST).
    Redirects to error page if a failure state is detected.
    """
    user_index = session["user_index"]

    progress, current_progress, has_failed = in_progress(user_index)

    if has_failed:
        return redirect(url_for("error"))

    if request.method == "POST":
        return jsonify(
            {
                "in_progress": progress,
                "current_progress": current_progress,
            }
        )

    return render_template("loading.html")


@app.route("/report_client_error", methods=["POST"])
@verify_user("environment")
def report_client_error():
    """
    Endpoint for the frontend to report critical state failures.
    Logs the error and marks the user's learner as failed.
    """
    user_index = session["user_index"]
    data = request.get_json() or {}
    
    error_msg = data.get("message", "Unknown Client Error")
    context = data.get("context", {})

    app.logger.error(
        f"CRITICAL CLIENT ERROR (User {user_index}): {error_msg} | Context: {context}",
        exc_info=True
    )

    # Mark the user as failed in the DB so they don't get stuck in a loop
    try:
        handler = LearningHandler(user_index)
        if handler.learner:
            handler.learner.failure_state = True
            handler.learner.in_progress = False
            db.session.commit()
            app.logger.info(f"User {user_index} marked as FAILED due to client report.")
    except Exception as e:
        app.logger.error(f"Failed to update user state after client error: {e}")

    return "", 200


# ------------------------------------------------------------------- #
#                        Static & Error Routes                        #
# ------------------------------------------------------------------- #


@app.route("/favicon.ico")
def favicon():
    """
    Serves the favicon
    """
    return send_from_directory(
        os.path.join(app.root_path, "static"),
        "images/favicon.ico",
        mimetype="image/vnd.microsoft.icon",
    )


@app.route("/complete", methods=["GET"])
@verify_user("complete")
def complete():
    """
    study complete view for user study
    """
    return render_template("complete.html")


@app.route("/unsynced", methods=["GET", "POST"])
def unsynced():
    """
    User has expirment running in two tabs at once.
    """
    return render_template("unsync.html")


@app.route("/error", methods=["GET", "POST"])
def error():
    """
    A generic error page that can be navigated to directly.
    """
    return render_template("error.html")


@app.errorhandler(500)
def handle_500_error(e):
    """
    Handles unhandled 500 internal server errors.
    """
    app.logger.error(f"Internal Server Error: {e}", exc_info=True)
    return render_template("error.html"), 500


@app.errorhandler(404)
def handle_404_error(e):
    """
    Catches 404 errors and redirects to the login page.
    """
    return redirect(url_for("login"))
