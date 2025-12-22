#!/usr/bin/env python3
"""
picc_rl.llm.llm_handler
-----------------------
Handles interactions with Large Language Models (LLMs) via LangChain.
Decoupled from Flask to allow offline usage.
"""

import logging
from typing import Dict, Any, List, Optional
from langchain_ollama.chat_models import ChatOllama
from pydantic import BaseModel, Field, ValidationError

log = logging.getLogger(__name__)


def format_curriculum_history(training_progress: List[Dict]) -> str:
    """
    Converts the JSON training progress into a readable string for the LLM.
    """
    history = []

    if not training_progress:
        return "No previous stages completed (Initial Stage)."

    for idx, entry in enumerate(training_progress):
        params = entry.get("curriculum_params") or entry.get("user_config", {})
        if isinstance(params, dict) and "objects" in params:
            grid_str = f"{params.get('width')}x{params.get('height')}"
            obj_str = ", ".join(
                [f"{k}:{v}" for k, v in params["objects"].items() if v > 0]
            )
            config_desc = f"Grid: {grid_str}, Objects: [{obj_str}]"
        else:
            config_desc = str(params)

        # Format Metrics
        success = entry.get("final_eval_success", 0.0)
        reward = entry.get("final_eval_reward", 0.0)
        steps = entry.get("final_eval_timesteps", 0)

        stage_str = (
            f"Stage {idx + 1}:\n"
            f"  - Config: {config_desc}\n"
            f"  - Result: Success={success:.2f}, Reward={reward:.1f}, Steps={steps:.1f}"
        )
        history.append(stage_str)

    return "\n\n".join(history)


class LLMConnectionConfig(BaseModel):
    model: str
    base_url: str
    temperature: float
    num_ctx: int


class PipelineStep(BaseModel):
    name: str
    prompt: str


class PromptConfig(BaseModel):
    system_prompt: str
    initial_pipeline: List[PipelineStep]
    continuous_pipeline: List[PipelineStep]


class LLMSettings(BaseModel):
    connection: LLMConnectionConfig
    prompts: PromptConfig


class CurriculumParameters(BaseModel):
    reasoning: str = Field(description="Explanation of the design choices.")
    width: int = Field(ge=6, le=15, description="Grid width.")
    height: int = Field(ge=6, le=15, description="Grid height.")
    objects: Dict[str, int] = Field(description="Map of object names to counts.")

class LLMHandler:
    def __init__(self, settings: Optional[Dict] = None):
        """
        Initialize the LLM Handler.
        :param settings: Optional dictionary matching LLMSettings schema.
                         If None, attempts to load from Flask current_app.
        """
        raw_config = settings

        # Fallback: Try to load from Flask if no explicit config provided
        if raw_config is None:
            try:
                from flask import current_app

                # This checks if we are actually in an app context
                if current_app:
                    raw_config = current_app.config.get("LLM_SETTINGS", {})
            except ImportError:
                pass  # Flask not installed/available
            except RuntimeError:
                pass  # Running outside app context

        if raw_config is None:
            raise ValueError(
                "LLMHandler requires configuration. Pass 'settings' dict explicitly "
                "or run within a Flask application context."
            )

        try:
            self.conf = LLMSettings(**raw_config)
        except ValidationError as e:
            log.error(f"Invalid LLM Config: {e}")
            raise e

        conn = self.conf.connection
        log.info(f"Initializing LLM: {conn.model} @ {conn.base_url}")

        self._chat = ChatOllama(
            model=conn.model,
            base_url=conn.base_url,
            temperature=conn.temperature,
            num_ctx=conn.num_ctx,
        )
        self._structured = self._chat.with_structured_output(CurriculumParameters)

    def _select_pipeline(self, current_stage: int) -> List[PipelineStep]:
        """Selects pipeline based on stage number."""
        prompts = self.conf.prompts

        if current_stage == 1:
            log.info("LLM Mode: Initial (Stage 1)")
            return prompts.initial_pipeline

        log.info(f"LLM Mode: Continuous (Stage {current_stage})")
        return prompts.continuous_pipeline

    def generate_curriculum(self, context_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the appropriate pipeline.
        """
        msgs = [("system", self.conf.prompts.system_prompt.format(**context_data))]

        # Select pipeline based on stage
        current_stage = context_data.get("current_stage", 1)
        pipeline = self._select_pipeline(current_stage)

        # Run CoT steps
        for step in pipeline[:-1]:
            log.debug(f"Executing LLM Step: {step.name}")
            user_msg = step.prompt.format(**context_data)
            msgs.append(("human", user_msg))

            resp = self._chat.invoke(msgs)
            msgs.append(("ai", resp.content))

        # Run Final JSON step
        final_step = pipeline[-1]
        log.debug(f"Executing Final LLM Step: {final_step.name}")

        user_msg = final_step.prompt.format(**context_data)
        msgs.append(("human", user_msg))

        res = self._structured.invoke(msgs)
        return res.model_dump()
