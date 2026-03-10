#!/usr/bin/env python3

"""
picc_llm.app.config
-------------------

Config for flask application
"""

from os import environ
from dotenv import load_dotenv
from picc_llm.llm.prompts import DEFAULT_PROMPTS

load_dotenv(".env.local")


class Config:
    """Flask config variables."""

    # If in debugging mode, training will occur offline.
    APP_DEBUG_MODE = environ.get("APP_DEBUG_MODE", "").lower() == "true"

    # General
    SECRET_KEY = environ.get("SECRET_KEY")

    # Celery
    CELERY_BROKER_URL = environ.get("CERELY_BROKER_URL")
    CELERY_RESULT_BACKEND = environ.get("CELERY_RESULT_BACKEND")

    # Database config options
    MYSQL_HOST = environ.get("MYSQL_HOST")
    MYSQL_PORT = environ.get("MYSQL_PORT", None)
    MYSQL_NAME = environ.get("MYSQL_DATABASE")
    MYSQL_USER = environ.get("MYSQL_USER")
    MYSQL_PASSWORD = environ.get("MYSQL_PASSWORD")

    port_str = f":{MYSQL_PORT}" if MYSQL_PORT is not None else ""
    SQLALCHEMY_DATABASE_URI = (
        f"mysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}{port_str}/{MYSQL_NAME}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Dictates which views to show in what order.
    ORDER = environ.get(
        "PICC_ORDER",
        "pre_study_questionnaire primer environment post_study_questionnaire compensation complete",
    )
    ORDER = [order for order in ORDER.split(" ") if order != ""]

    # Other study options
    TRAINING_ITERATIONS_PER_CONDITION = 5
    NUMBER_OF_EXPERIMENTS_PER_PARTICIPANT = 1

    RESET_ENV_CONFIG_ON_ITERATION = True

    TRAINING_CONFIG = {
        "episodes_per_evaluation": 5,
        "episodes_per_iteration": 25,
        "max_stability_training_iterations": 20,
        "train_until_stable": True,
        "train_mode": "fixed",
        "stability_delta_threshold": 5.0,
        "stability_check_window": 3,
        "update_frequency": 1600,
        "lr_actor": 0.0001,
        "lr_critic": 0.001,
        "gamma": 0.99,
        "K_epochs": 10,
        "eps_clip": 0.2,
    }

    # Storage options
    MODEL_STORAGE_DIR = environ.get("MODEL_STORAGE_DIR")
    GRAPH_STORAGE_DIR = environ.get("GRAPH_STORAGE_DIR")

    # Configurations unique to each environment all environments to be
    # used in the study must be listed here even if the config dict is
    # empty.
    ENV_CONFIGS = {
        "minecraft": {
            "max_episode_len": 500,
            "grid": {"height": 15, "width": 15},
            "lidar": {"range": 8},
        }
    }

    # For the most part this can be left alone, it is just relatead to
    # configuration of the style of the survey
    SURVEY_THEME_JSON = {
        "themeName": "doubleborder",
        "isPanelless": True,
        "cssVariables": {
            "--sjs-corner-radius": "4px",
            "--sjs-base-unit": "8px",
            "--sjs-shadow-small": "0px 0px 0px 2px rgba(0, 0, 0, 0.07)",
            "--sjs-shadow-inner": "0px 0px 0px 2px rgba(0, 0, 0, 0.1)",
            "--sjs-border-default": "rgba(0, 0, 0, 0.1)",
            "--sjs-border-light": "rgba(0, 0, 0, 0.1)",
            "--sjs-general-backcolor-dim-light": "rgba(255, 255, 255, 1)",
            "--sjs-general-backcolor-dim-dark": "rgba(237, 237, 237, 1)",
            "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
            "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
            "--sjs-general-dim-forecolor": "rgba(0, 0, 0, 0.91)",
            "--sjs-general-dim-forecolor-light": "rgba(0, 0, 0, 0.45)",
            "--sjs-secondary-backcolor": "rgba(255, 152, 20, 1)",
            "--sjs-secondary-backcolor-light": "rgba(255, 152, 20, 0.1)",
            "--sjs-secondary-backcolor-semi-light": "rgba(255, 152, 20, 0.25)",
            "--sjs-secondary-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-secondary-forecolor-light": "rgba(255, 255, 255, 0.25)",
            "--sjs-shadow-small-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.07)",
            "--sjs-shadow-medium": "0px 0px 0px 2px rgba(0, 0, 0, 0.08),0px 2px 6px 0px rgba(0, 0, 0, 0.04)",
            "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.08)",
            "--sjs-shadow-inner-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.1)",
            "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
            "--sjs-special-red-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-special-green": "rgba(25, 179, 148, 1)",
            "--sjs-special-green-light": "rgba(25, 179, 148, 0.1)",
            "--sjs-special-green-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-special-blue": "rgba(67, 127, 217, 1)",
            "--sjs-special-blue-light": "rgba(67, 127, 217, 0.1)",
            "--sjs-special-blue-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
            "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
            "--sjs-special-yellow-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-article-font-xx-large-textDecoration": "none",
            "--sjs-article-font-xx-large-fontWeight": "700",
            "--sjs-article-font-xx-large-fontStyle": "normal",
            "--sjs-article-font-xx-large-fontStretch": "normal",
            "--sjs-article-font-xx-large-letterSpacing": "0",
            "--sjs-article-font-xx-large-lineHeight": "64px",
            "--sjs-article-font-xx-large-paragraphIndent": "0px",
            "--sjs-article-font-xx-large-textCase": "none",
            "--sjs-article-font-x-large-textDecoration": "none",
            "--sjs-article-font-x-large-fontWeight": "700",
            "--sjs-article-font-x-large-fontStyle": "normal",
            "--sjs-article-font-x-large-fontStretch": "normal",
            "--sjs-article-font-x-large-letterSpacing": "0",
            "--sjs-article-font-x-large-lineHeight": "56px",
            "--sjs-article-font-x-large-paragraphIndent": "0px",
            "--sjs-article-font-x-large-textCase": "none",
            "--sjs-article-font-large-textDecoration": "none",
            "--sjs-article-font-large-fontWeight": "700",
            "--sjs-article-font-large-fontStyle": "normal",
            "--sjs-article-font-large-fontStretch": "normal",
            "--sjs-article-font-large-letterSpacing": "0",
            "--sjs-article-font-large-lineHeight": "40px",
            "--sjs-article-font-large-paragraphIndent": "0px",
            "--sjs-article-font-large-textCase": "none",
            "--sjs-article-font-medium-textDecoration": "none",
            "--sjs-article-font-medium-fontWeight": "700",
            "--sjs-article-font-medium-fontStyle": "normal",
            "--sjs-article-font-medium-fontStretch": "normal",
            "--sjs-article-font-medium-letterSpacing": "0",
            "--sjs-article-font-medium-lineHeight": "32px",
            "--sjs-article-font-medium-paragraphIndent": "0px",
            "--sjs-article-font-medium-textCase": "none",
            "--sjs-article-font-default-textDecoration": "none",
            "--sjs-article-font-default-fontWeight": "400",
            "--sjs-article-font-default-fontStyle": "normal",
            "--sjs-article-font-default-fontStretch": "normal",
            "--sjs-article-font-default-letterSpacing": "0",
            "--sjs-article-font-default-lineHeight": "28px",
            "--sjs-article-font-default-paragraphIndent": "0px",
            "--sjs-article-font-default-textCase": "none",
            "--sjs-general-backcolor-dim": "rgba(245, 245, 245, 1)",
            "--sjs-primary-backcolor": "#212121",
            "--sjs-primary-backcolor-dark": "rgba(62, 83, 115, 1)",
            "--sjs-primary-backcolor-light": "rgba(76, 100, 137, 0.1)",
            "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)",
        },
    }

    # Consent form (written in html)
    CONSENT_HTML = """
    <p>
    Title of the study: Interactive Curriculum Generation
    <br>
    Student Principle Investigator: Brennan Miller-Klugman
    <br>
    Faculty Advisor: Jivko Sinapov
    <p>
    You are being asked to volunteer in a research study. Please find below
    information about this research for you to carefully consider when deciding
    about whether or not to participate. Please ask questions about any of the
    information you do not understand before you decide whether to participate.
    <p>
    <b>What is this study about?</b>
    <br>
    Researchers at Tufts University are conducting a study on curriculum learning
    using a human-generated curriculum. The purpose of the research is to
    investigate if humans can interactively design an effective curriculum to teach
    an agent. The aforementioned agent refers to a reinforcement learning model
    that you will train to solve a task. You are being asked to participate because
    we require a large sample size to strengthen our analysis. You are one of 40
    participants to take part in this study. Your participation in the study is
    expected to last 20 minutes.
    <p>
    <b>What will happen during this research?</b>
    <br>
    If you agree to be in this research, your participation will include training an
    agent to complete a resource collection and crafting task. You will be randomly
    assigned to one of three conditions. The difference between these conditions is
    the type of data regarding the agent's training progress that will be provided.
    The first condition is provided no information regarding the agent's training
    progress. The second condition is provided a value, displayed both textually and
    on a graph, representing the average number of timesteps the agent took during
    its evaluation. The third group is provided a value, displayed both textually
    and on a graph, representing the average reward the agent achieved during its
    evaluation. You will first answer a pre-questionnaire that gauges your
    familiarity with robots, video game experience, and reinforcement learning. This
    questionnaire has no influence on your participation in the study. You will then
    be shown a quick tutorial on how to use the interface. After this, you will
    start the main task which consists of selecting cells on a 2-dimensional grid to
    vary the complexity of an agent's task depending on its training progress. After
    the main task, you will fill out a post-questionnaire regarding your experience
    in the study.
    <p>
    <b>What will you do to protect my privacy?</b>
    <br>
    The results of the study may be published. No identifiable information will be
    included in any publications. The identifiable data recorded in this study will
    include your email address (collected only so we can email you a gift card as
    compensation for participation). The data will only be accessed by the research
    team. Measures will be taken to protect your privacy and confidentiality.
    Despite taking steps to protect your privacy, we can never fully guarantee your
    privacy will be protected. Individuals and organizations responsible for
    conducting or monitoring this research may be permitted access to and inspect
    the research records. This includes Tufts Social, Behavioral & Educational
    Research Institutional Review Board (Tufts SBER IRB). The information collected
    as part of this research will not be used or distributed for future research
    studies, even if all your identifiers are removed. This study will use a
    Tufts-hosted database to store your data. If you decide later that you would
    like your data withdrawn from the study, you will have to email the PI with your
    assigned user ID number which was issued when you registered for the study.
    Withdrawal will not be possible after publication. Your email address will be
    deleted after the study has concluded. We will not collect other personal
    information such as name, location, IP address, or any other piece of sensitive
    data.
    <p>
    <b>What are the risks or discomforts associated with this research?</b>
    <br>
    There are no risks or discomforts associated with this research. This research
    may have risks or discomforts that are unknown at this time. If in the future we
    become aware of any additional risks or discomforts that may affect you, we will
    tell you.

    The risk of confidentiality loss will be minimized by storing participant data in
    secure platforms and by using codes to separate data from identifiers.
    <p>
    <b>How might I benefit from this research?</b>
    <br>
    There may be no personal benefit from your participation but the knowledge
    received may be of value to humanity.
    <p>
    <b>What is the compensation for the research?</b>
    <br>
    An Amazon Gift card valued at $5 will be issued to you after completion of the
    study. There will be no cost to you.
    <p>
    <b>What will happen if I choose not to participate?</b>
    <br>
    It is your choice to participate in this research study. Participation is voluntary.
    <p>
    <b>Is my participation voluntary, and can I withdraw?</b>
    <br>
    Taking part in this research study is your decision. Your participation in this
    study is voluntary. You do not have to take part in this study; you can stop at
    any time. You have the right to choose not to participate in any study activity
    or completely withdraw from continued participation at any point in this study
    without penalty/consequences/loss of benefits to which you are otherwise
    entitled. If you withdraw from the study your data be discarded. If you decide
    that you would like your data withdrawn from the study, you will need to email
    the PI at the address below, along with your user ID that was issued
    upon registration. Withdrawal will not be possible after publication.
    <p>
    <b>Can I be removed from the research without my OK?</b>
    <br>
    We can remove you from the research study without your approval. The reasons we
    would do this include intentionally neglecting the assigned tasks.
    <p>
    <b>Who do I talk to if I have questions?</b>
    <br>
    If you have questions, or concerns, or have experienced a research-related injury,
    contact the research team at brennan.miller_klugman@tufts.edu
    <p>
    An Institutional Review Board (“IRB”) is overseeing this research. An IRB is a
    group of people who perform independent review of research studies to ensure the
    rights and welfare of participants are protected. If you have questions about
    your rights or wish to speak with someone other than the research team, you may
    contact:
    <br>
    <ul style='list-style-type: none;'>
    <li>Tufts Social, Behavioral, and Educational Research IRB</li>
    <li>75 Kneeland Street</li>
    <li>Boston, MA 02111</li>
    <li>617.627.8804</li>
    <li>SBER@tufts.edu</li>
    </ul>
    <b>Statement of Consent</b>
    <br>
    Participants under the age of 18 cannot participate and are not eligible for
    this study. I have read and considered the information presented in this form. I
    confirm that I understand the purpose of the research and study procedures. I
    understand that I may email questions at any time to
    brennan.miller_klugman@tufts.edu and can withdraw my participation before
    publication without prejudice.
    </p>
    """

    # Questionnaire configuration, allows questions to be added /
    # removed without modifying anything but this file. Adding new
    # questionnaires entirely (eg. a mid-study-questionnaire) will
    # require further changes to views.
    QUESTIONNAIRES = {
        "primer": {
            "title": "PRIMER",
            "elements": [
                {
                    "type": "html",
                    "html": "",
                }
            ],
            "showQuestionNumbers": "off",
            "completeText": "Continue",
        },
        "pre_study_questionnaire": {
            "title": "Pre-Study Questionnaire",
            "elements": [
                {
                    "type": "rating",
                    "name": "video_games",
                    "title": "How much prior experience do you have with video games?",
                    "isRequired": True,
                    "minRateDescription": "I have little to no experience",
                    "maxRateDescription": "I have extensive experience",
                },
                {
                    "type": "boolean",
                    "name": "robotics",
                    "title": "Have you programmed a robot before?",
                    "isRequired": True,
                    "valueTrue": "Yes",
                    "valueFalse": "No",
                    "renderAs": "radio",
                },
                {
                    "type": "boolean",
                    "name": "ai",
                    "title": "Have you taken a class on, or had other experiences with Ariticial Intelligence?",
                    "isRequired": True,
                    "valueTrue": "Yes",
                    "valueFalse": "No",
                    "renderAs": "radio",
                },
                {
                    "type": "boolean",
                    "name": "ml",
                    "title": "Have you taken a class on, or had other experiences with Machine Learning?",
                    "isRequired": True,
                    "valueTrue": "Yes",
                    "valueFalse": "No",
                    "renderAs": "radio",
                },
                {
                    "type": "boolean",
                    "name": "rl",
                    "title": "Have you taken a class on, or had other experience with Reinforcement Learning?",
                    "isRequired": True,
                    "valueTrue": "Yes",
                    "valueFalse": "No",
                    "renderAs": "radio",
                },
            ],
            "showQuestionNumbers": "off",
            "completeText": "Submit",
        },
        "consent": {
            "title": "Informed Consent",
            "elements": [
                {"type": "html", "html": CONSENT_HTML},
                {
                    "type": "text",
                    "name": "name",
                    "title": "Please enter your full name to consent.",
                    "isRequired": True,
                },
                {
                    "type": "boolean",
                    "name": "consent",
                    "title": "I have read the above information and voluntarily consent to participate in this study.",
                    "isRequired": True,
                    "labelTrue": "I Agree",
                    "valueTrue": True,
                    "valueFalse": False,
                },
            ],
            "completeText": "Agree and Continue",
            "showQuestionNumbers": "off",
        },
        # --- COMPENSATION FORM ---
        "compensation": {
            "title": "COMPENSATION",
            "elements": [
                {
                    "type": "html",
                    "html": "<p>Please provide the email address at which you would like to recieve your compensation for participation in the study.</p>",
                },
                {
                    "type": "text",
                    "name": "email",
                    "title": "Email Address:",
                    "isRequired": True,
                },
            ],
            "showQuestionNumbers": "off",
            "completeText": "Submit",
        },
        "post_study_questionnaire": {
            "title": "Post-Study Questionnaire",
            "elements": [
                {
                    "type": "rating",
                    "name": "performance",
                    "title": "I think that the robot learned how to complete the task successfully.",
                    "isRequired": True,
                    "minRateDescription": "Strongly Disagree",
                    "maxRateDescription": "Strongly Agree",
                },
                {
                    "type": "comment",
                    "name": "decision",
                    "title": "How did you go about deciding which spaces to block off?",
                    "isRequired": True,
                    "autoGrow": True,
                    "allowResize": False,
                },
                {
                    "type": "comment",
                    "name": "additional_info",
                    "title": "Is there any additional information that was not given that would have helped you train the robot?",
                    "isRequired": True,
                    "autoGrow": True,
                    "allowResize": False,
                },
            ],
            "showQuestionNumbers": "off",
            "completeText": "Submit",
        },
    }

    LLM_SETTINGS = {
            "connection": {
                "model": environ.get("GROQ_MODEL", "openai/gpt-oss-120b"),
                "api_key": environ.get("GROQ_API_KEY", ""),
                "temperature": 0.7,
            },
            "prompts": DEFAULT_PROMPTS,
        }
