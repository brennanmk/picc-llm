"""
picc_llm.llm.prompts
--------------------
Domain-agnostic prompt factory. Builds prompts from any environment's
description module so mechanics stay in sync automatically.

Each env's description module must expose:
    GAME_INSTRUCTIONS   list[str]       — ordered mechanics sentences
    DEPENDENCY_NOTE     str             — hard constraints
    VALID_OBJECTS       list[str]       — configurable param/object names
    REWARD_TIERS        dict[str, str]  — tier name → description
    PARAM_FORMAT        str             — how to format a stage config
    STAGE_1_HINT        str             — what stage 1 should look like
    PROGRESSION_RULES   list[str]       — per-stage progression guidance
"""

import types
from typing import Union


def build_prompts(description: Union[types.ModuleType, object]) -> dict:
    """
    Build a DEFAULT_PROMPTS-compatible dict from an env description module.
    """
    instructions = "\n".join(
        f"  {i+1}. {line}" for i, line in enumerate(description.GAME_INSTRUCTIONS)
    )
    valid = ", ".join(description.VALID_OBJECTS)
    tiers = "\n".join(f"  - {k}: {v}" for k, v in description.REWARD_TIERS.items())

    system_prompt = (
        "You are an expert Curriculum Designer for Reinforcement Learning agents.\n"
        "GAME DESCRIPTION:\n"
        f"{instructions}\n"
        f"{description.DEPENDENCY_NOTE}\n"
        "REWARD TIERS: You may assign a reward tier to each parameter or object. "
        "Available tiers:\n"
        f"{tiers}\n"
        f"OUTPUT FORMAT: {description.PARAM_FORMAT}\n"
        "ROLE: Design a sequential curriculum (Stage {{current_stage}} of {{total_stages}}).\n"
    )

    initial_pipeline = [
        {
            "name": "plan",
            "prompt": (
                "Design a {total_stages}-stage curriculum roadmap for this environment. "
                "Explain your reasoning: what skills should the agent learn first, "
                "and how should each stage build on the previous one?"
            ),
        },
        {
            "name": "generate",
            "prompt": (
                "Generate the configuration for STAGE 1 based on your plan. "
                f"{description.PARAM_FORMAT}"
            ),
        },
    ]

    continuous_pipeline = [
        {
            "name": "analyze_history",
            "prompt": (
                "Review the Curriculum History:\n"
                "{context}\n\n"
                "Analyze the agent's performance and decide on the configuration for "
                "Stage {current_stage}. Explain your reasoning."
            ),
        },
        {
            "name": "generate",
            "prompt": (
                "Generate the configuration for Stage {current_stage} based on your analysis. "
                f"Use only [{valid}] as parameter names. "
                f"{description.PARAM_FORMAT}"
            ),
        },
    ]

    full_curriculum_pipeline = [
        {
            "name": "plan",
            "prompt": (
                "Design a complete {total_stages}-stage curriculum for this environment. "
                "Explain your reasoning: what skills should the agent learn at each stage, "
                "and how does difficulty progress across the curriculum?"
            ),
        },
        {
            "name": "generate",
            "prompt": (
                "Generate the complete curriculum as an ordered list of {total_stages} stage "
                "configurations based on your plan. "
                f"Use only [{valid}] as parameter names. "
                f"{description.PARAM_FORMAT}"
            ),
        },
    ]

    return {
        "system_prompt": system_prompt,
        "initial_pipeline": initial_pipeline,
        "continuous_pipeline": continuous_pipeline,
        "full_curriculum_pipeline": full_curriculum_pipeline,
    }


# Backward-compatible default (MicroMinecraft)
def _default_prompts():
    from picc_llm.environments.micro_minecraft.description import (
        GAME_INSTRUCTIONS, DEPENDENCY_NOTE, VALID_OBJECTS, REWARD_TIERS,
        PARAM_FORMAT, STAGE_1_HINT, PROGRESSION_RULES,
    )
    import types
    d = types.SimpleNamespace(
        GAME_INSTRUCTIONS=GAME_INSTRUCTIONS,
        DEPENDENCY_NOTE=DEPENDENCY_NOTE,
        VALID_OBJECTS=VALID_OBJECTS,
        REWARD_TIERS=REWARD_TIERS,
        PARAM_FORMAT=PARAM_FORMAT,
        STAGE_1_HINT=STAGE_1_HINT,
        PROGRESSION_RULES=PROGRESSION_RULES,
    )
    return build_prompts(d)


DEFAULT_PROMPTS = _default_prompts()
