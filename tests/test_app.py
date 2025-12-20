#!/usr/bin/env python3

"""
This is no so much as a unit test as it is a way to test the webapp
with minimal views.
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from picc_rl.environments.micro_minecraft.micro_minecraft import MicroMinecraft
from picc_rl.environments.micro_minecraft.micro_minecraft import instructions
import time
from datetime import datetime

app = Flask(
    __name__,
    template_folder="../picc_rl/app/templates",
    static_folder="../picc_rl/app/static",
)

CORS(app)


@app.route("/environment", methods=["GET", "POST"])
@app.route("/", methods=["GET", "POST"])
def environment():

    if request.method == "POST":
        data = request.get_json()
        print(data)

        if "user_config" in data:
            env = MicroMinecraft()
            conf = env.decode_config(data["user_config"])
            print(env.reset(conf))
        return "", 200

    env = MicroMinecraft()
    env.reset()
    ascii_conf = env.encode_config()
    print(ascii_conf)
    return render_template(
        "environment.html",
        config=ascii_conf,
        blocking_char="🧱",
        instructions=instructions,
        visual="The player has not undergone any training yet.",
        timestamp=datetime.now().isoformat(),
    )


@app.route("/pre_study_questionnaire", methods=["GET", "POST"])
def pre_study_questionnaire():
    """
    post study questionnaire view for user study
    """
    return render_template(
        "survey.html",
        survey_type="pre_study_questionnaire",
    )


@app.route("/post_study_questionnaire", methods=["GET", "POST"])
def post_study_questionnaire():
    """
    post study questionnaire view for user study
    """
    if request.method == "POST":
        data = request.get_json()
        print(data)
    return render_template(
        "survey.html",
        survey_type="post_study_questionnaire",
    )


@app.route("/compensation", methods=["GET", "POST"])
def compensation():
    """
    Consent view for user study
    """

    return render_template(
        "survey.html",
        survey_type="compensation",
    )


@app.route("/consent", methods=["GET", "POST"])
def consent():
    """
    Consent view for user study
    """
    if request.method == "POST":
        data = request.get_json()
        print(data)

    return render_template(
        "survey.html",
        survey_type="consent",
    )


@app.errorhandler(404)
@app.route("/error")
def error(*args):

    return render_template("error.html")


@app.route("/unsynced")
def unsynced(*args):

    return render_template("error.html")


@app.route("/in-progress", methods=["GET"])
def in_progress():
    time.sleep(5)
    return jsonify({"done": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0")
