#!/usr/bin/env python3
"""
picc_llm.llm.llm_handler
-----------------------
Handles interactions with LLMs via LangChain + ChatOpenAI.
Supports any OpenAI-compatible endpoint: OpenRouter, Ollama, native OpenAI, etc.
"""

import logging
from typing import Dict, Any, List, Optional

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field, ValidationError, model_validator

log = logging.getLogger(__name__)


def format_curriculum_history(
    training_progress: List[Dict],
    feedback_metrics: Optional[List[str]] = None,
) -> str:
    """
    Converts training progress into a readable string for the LLM.

    :param training_progress: List of stage history dicts.
    :param feedback_metrics: Which metrics to reveal to the LLM.
        Subset of ["reward", "timestep"]. None = both (backward compat).
        Success rate is always included as it is not condition-specific.
    """
    if not training_progress:
        return "No previous stages completed (Initial Stage)."

    if feedback_metrics is None:
        feedback_metrics = ["reward", "timestep"]

    history = []
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

        success = entry.get("final_eval_success", 0.0)

        parts = [
            f"Stage {idx + 1}:",
            f"  - Config: {config_desc}",
            f"  - Success rate: {success:.2f}",
        ]

        if "reward" in feedback_metrics:
            reward = entry.get("final_eval_reward", 0.0)
            parts.append(f"  - Reward: {reward:.1f} (higher is better)")

        if "timestep" in feedback_metrics:
            steps = entry.get("final_eval_timesteps", 0)
            parts.append(f"  - Steps taken: {steps:.1f} (lower is better)")

        history.append("\n".join(parts))

    return "\n\n".join(history)


# ---------------------------------------------------------------------------
# Config schemas
# ---------------------------------------------------------------------------

class LLMConnectionConfig(BaseModel):
    model: str
    api_key: str
    temperature: float = 0.7
    base_url: Optional[str] = None


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


# ---------------------------------------------------------------------------
# Output schemas
# ---------------------------------------------------------------------------

class CurriculumParameters(BaseModel):
    model_config = {"extra": "ignore"}

    width: Optional[int] = Field(default=None, ge=6, le=15, description="Grid width (grid-based envs only).")
    height: Optional[int] = Field(default=None, ge=6, le=15, description="Grid height (grid-based envs only).")
    objects: Dict[str, Any] = Field(description="Map of parameter names to values (int counts or float params).")
    rewards: Dict[str, str] = Field(
        description="Map of parameter/subtask names to reward tiers (none/small/medium/large)."
    )


class CurriculumStage(BaseModel):
    model_config = {"extra": "ignore"}

    width: Optional[int] = Field(default=None, ge=6, le=15, description="Grid width (grid-based envs only).")
    height: Optional[int] = Field(default=None, ge=6, le=15, description="Grid height (grid-based envs only).")
    objects: Dict[str, Any] = Field(description="Map of parameter names to values (int counts or float params).")
    rewards: Dict[str, str] = Field(
        description="Map of parameter/subtask names to reward tiers (none/small/medium/large)."
    )


class FullCurriculumParameters(BaseModel):
    model_config = {"extra": "ignore"}

    stages: List[CurriculumStage] = Field(
        description="Ordered list of curriculum stage configurations."
    )

    @model_validator(mode="before")
    @classmethod
    def normalise_stages_key(cls, values):
        # Some models use "curriculum" instead of "stages"
        if isinstance(values, dict) and "stages" not in values:
            for alias in ("curriculum", "stages_list", "curriculum_stages"):
                if alias in values:
                    values["stages"] = values.pop(alias)
                    break
        return values


# ---------------------------------------------------------------------------
# Main handler
# ---------------------------------------------------------------------------

class LLMHandler:
    def __init__(self, settings: Optional[Dict] = None):
        """
        Initialize the LLM Handler.

        :param settings: Dict matching LLMSettings schema. If None, loads from
                         Flask current_app.config["LLM_SETTINGS"].
        """
        raw_config = settings

        if raw_config is None:
            try:
                from flask import current_app
                if current_app:
                    raw_config = current_app.config.get("LLM_SETTINGS", {})
            except (ImportError, RuntimeError):
                pass

        if raw_config is None:
            raise ValueError(
                "LLMHandler requires configuration. Pass 'settings' dict explicitly "
                "or run within a Flask application context."
            )

        try:
            self.conf = LLMSettings(**raw_config)
        except ValidationError as e:
            log.error(f"Invalid LLM Config: {e}")
            raise

        conn = self.conf.connection
        log.info(f"Initializing LLM: {conn.model} (base_url={conn.base_url or 'default'})")

        self._chat = ChatOpenAI(
            model=conn.model,
            api_key=conn.api_key,
            temperature=conn.temperature,
            base_url=conn.base_url,
        )
        self._structured = self._chat.with_structured_output(
            CurriculumParameters, method="json_mode", include_raw=True
        )
        if self.conf.prompts.full_curriculum_pipeline:
            self._structured_full = self._chat.with_structured_output(
                FullCurriculumParameters, method="json_mode", include_raw=True
            )

        self.last_token_usage: Dict[str, int] = {}
        self.last_conversation: List[Dict[str, str]] = []

    def _select_pipeline(self, current_stage: int) -> List[PipelineStep]:
        prompts = self.conf.prompts
        if current_stage == 1:
            log.info("LLM Mode: Initial (Stage 1)")
            return prompts.initial_pipeline
        log.info(f"LLM Mode: Continuous (Stage {current_stage})")
        return prompts.continuous_pipeline

    def generate_curriculum(self, context_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the pipeline for a single stage.
        Token usage is accumulated into self.last_token_usage.
        """
        msgs = [("system", self.conf.prompts.system_prompt.format(**context_data))]

        current_stage = context_data.get("current_stage", 1)
        pipeline = self._select_pipeline(current_stage)

        input_tokens = output_tokens = 0

        def _accumulate(response) -> None:
            nonlocal input_tokens, output_tokens
            usage = getattr(response, "usage_metadata", None)
            if usage:
                input_tokens += usage.get("input_tokens", 0)
                output_tokens += usage.get("output_tokens", 0)

        for step in pipeline[:-1]:
            log.debug(f"Executing LLM Step: {step.name}")
            msgs.append(("human", step.prompt.format(**context_data)))
            resp = self._chat.invoke(msgs)
            _accumulate(resp)
            msgs.append(("ai", resp.content))

        final_step = pipeline[-1]
        log.debug(f"Executing Final LLM Step: {final_step.name}")
        msgs.append(("human", final_step.prompt.format(**context_data)))

        raw = self._structured.invoke(msgs)
        _accumulate(raw["raw"])

        self.last_token_usage = {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": input_tokens + output_tokens,
        }
        self.last_conversation = [
            {"role": role, "content": content} for role, content in msgs
        ]

        if raw["parsed"] is None:
            raise ValueError(
                f"LLM returned unparseable response: {raw.get('parsing_error')}"
            )

        return raw["parsed"].model_dump()

    def generate_full_curriculum(self, context_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate an entire curriculum (all stages) in a single LLM call.
        Requires full_curriculum_pipeline to be set in prompts config.
        """
        if not self.conf.prompts.full_curriculum_pipeline:
            raise ValueError(
                "LLM prompts config missing 'full_curriculum_pipeline'. "
                "Required for llm_full mode."
            )

        msgs = [("system", self.conf.prompts.system_prompt.format(**context_data))]
        pipeline = self.conf.prompts.full_curriculum_pipeline

        input_tokens = output_tokens = 0

        def _accumulate(response) -> None:
            nonlocal input_tokens, output_tokens
            usage = getattr(response, "usage_metadata", None)
            if usage:
                input_tokens += usage.get("input_tokens", 0)
                output_tokens += usage.get("output_tokens", 0)

        for step in pipeline[:-1]:
            log.debug(f"Executing LLM Step: {step.name}")
            msgs.append(("human", step.prompt.format(**context_data)))
            resp = self._chat.invoke(msgs)
            _accumulate(resp)
            msgs.append(("ai", resp.content))

        final_step = pipeline[-1]
        log.debug(f"Executing Final LLM Step: {final_step.name}")
        msgs.append(("human", final_step.prompt.format(**context_data)))

        raw = self._structured_full.invoke(msgs)
        _accumulate(raw["raw"])

        self.last_token_usage = {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": input_tokens + output_tokens,
        }
        self.last_conversation = [
            {"role": role, "content": content} for role, content in msgs
        ]

        if raw["parsed"] is None:
            raw_content = getattr(raw.get("raw"), "content", raw.get("raw"))
            raise ValueError(
                f"LLM returned unparseable response.\n"
                f"  parsing_error : {raw.get('parsing_error')}\n"
                f"  raw content   : {str(raw_content)[:500]}"
            )

        return [stage.model_dump() for stage in raw["parsed"].stages]
