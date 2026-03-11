#!/usr/bin/env python3
"""
picc_llm.llm.llm_handler
-----------------------
Handles interactions with Large Language Models (LLMs) via LangChain.
Decoupled from Flask to allow offline usage.
"""

import logging
from typing import Dict, Any, List, Optional
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field, ValidationError

log = logging.getLogger(__name__)


def format_curriculum_history(training_progress: List[Dict]) -> str:
    """
    Converts the JSON training progress into a readable string for the LLM.
    """
    history = []

    # Check if training_progress exists/is not empty
    if not training_progress:
        return "No previous stages completed (Initial Stage)."

    for idx, entry in enumerate(training_progress):
        # (Rest of logic remains exactly the same)
        params = entry.get("curriculum_params") or entry.get("user_config", {})
        # Format configuration description
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


# --- Config Schemas ---
class LLMConnectionConfig(BaseModel):
    model: str
    api_key: str
    temperature: float


class PipelineStep(BaseModel):
    name: str
    prompt: str


class PromptConfig(BaseModel):
    system_prompt: str
    initial_pipeline: List[PipelineStep]
    continuous_pipeline: List[PipelineStep]
    full_curriculum_pipeline: Optional[List[PipelineStep]] = None


class LLMSettings(BaseModel):
    connection: LLMConnectionConfig
    prompts: PromptConfig


# --- Output Schema ---
class CurriculumParameters(BaseModel):
    reasoning: str = Field(description="Explanation of the design choices.")
    width: int = Field(ge=6, le=15, description="Grid width.")
    height: int = Field(ge=6, le=15, description="Grid height.")
    objects: Dict[str, int] = Field(description="Map of object names to counts.")
    rewards: Dict[str, str] = Field(description="Map of object names to reward tiers (none/small/medium/large).")


class CurriculumStage(BaseModel):
    """A single stage within a full curriculum."""
    reasoning: str = Field(description="Explanation of the design choices for this stage.")
    width: int = Field(ge=6, le=15, description="Grid width.")
    height: int = Field(ge=6, le=15, description="Grid height.")
    objects: Dict[str, int] = Field(description="Map of object names to counts.")
    rewards: Dict[str, str] = Field(description="Map of object names to reward tiers (none/small/medium/large).")


class FullCurriculumParameters(BaseModel):
    """Output schema for generating an entire curriculum in one shot."""
    overall_reasoning: str = Field(description="High-level explanation of the full curriculum design strategy.")
    stages: List[CurriculumStage] = Field(description="Ordered list of curriculum stage configurations.")


# --- Main Handler ---
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
        log.info(f"Initializing LLM: {conn.model} (Groq)")

        self._chat = ChatGroq(
            model=conn.model,
            api_key=conn.api_key,
            temperature=conn.temperature,
        )
        self._structured = self._chat.with_structured_output(CurriculumParameters)
        if self.conf.prompts.full_curriculum_pipeline:
            self._structured_full = self._chat.with_structured_output(FullCurriculumParameters)

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
        Token usage for the call is stored in self.last_token_usage after each invocation.
        """
        msgs = [("system", self.conf.prompts.system_prompt.format(**context_data))]

        # Select pipeline based on stage
        current_stage = context_data.get("current_stage", 1)
        pipeline = self._select_pipeline(current_stage)

        input_tokens = 0
        output_tokens = 0

        def _accumulate(response) -> None:
            nonlocal input_tokens, output_tokens
            usage = getattr(response, "usage_metadata", None)
            if usage:
                input_tokens += usage.get("input_tokens", 0)
                output_tokens += usage.get("output_tokens", 0)

        # Run CoT steps
        for step in pipeline[:-1]:
            log.debug(f"Executing LLM Step: {step.name}")
            user_msg = step.prompt.format(**context_data)
            msgs.append(("human", user_msg))

            resp = self._chat.invoke(msgs)
            _accumulate(resp)
            msgs.append(("ai", resp.content))

        # Run Final JSON step
        final_step = pipeline[-1]
        log.debug(f"Executing Final LLM Step: {final_step.name}")

        user_msg = final_step.prompt.format(**context_data)
        msgs.append(("human", user_msg))

        res = self._structured.invoke(msgs)
        _accumulate(res)

        self.last_token_usage = {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": input_tokens + output_tokens,
        }

        return res.model_dump()

    def generate_full_curriculum(self, context_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate an entire curriculum (all stages) in a single LLM call.

        Uses the ``full_curriculum_pipeline`` from prompts config.

        :param context_data: Dict with keys ``current_stage`` (always 1),
                             ``total_stages`` (int).
        :return: List of dicts, each with keys: width, height, objects, rewards, reasoning.
        """
        if not self.conf.prompts.full_curriculum_pipeline:
            raise ValueError(
                "LLM prompts config missing 'full_curriculum_pipeline'. "
                "Required for llm_full mode."
            )

        msgs = [("system", self.conf.prompts.system_prompt.format(**context_data))]
        pipeline = self.conf.prompts.full_curriculum_pipeline

        input_tokens = 0
        output_tokens = 0

        def _accumulate(response) -> None:
            nonlocal input_tokens, output_tokens
            usage = getattr(response, "usage_metadata", None)
            if usage:
                input_tokens += usage.get("input_tokens", 0)
                output_tokens += usage.get("output_tokens", 0)

        # Run CoT steps (all but last)
        for step in pipeline[:-1]:
            log.debug(f"Executing LLM Step: {step.name}")
            user_msg = step.prompt.format(**context_data)
            msgs.append(("human", user_msg))

            resp = self._chat.invoke(msgs)
            _accumulate(resp)
            msgs.append(("ai", resp.content))

        # Run final structured output step
        final_step = pipeline[-1]
        log.debug(f"Executing Final LLM Step: {final_step.name}")

        user_msg = final_step.prompt.format(**context_data)
        msgs.append(("human", user_msg))

        res = self._structured_full.invoke(msgs)
        _accumulate(res)

        self.last_token_usage = {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": input_tokens + output_tokens,
        }

        return [stage.model_dump() for stage in res.stages]
