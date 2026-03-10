"""
picc_llm.llm.prompts
--------------------
Default LLM prompt configuration. Builds the system prompt from the
environment's description module so mechanics stay in sync automatically.
"""

from picc_llm.environments.micro_minecraft.description import (
    GAME_INSTRUCTIONS,
    DEPENDENCY_NOTE,
    VALID_OBJECTS,
    REWARD_TIERS,
)

def _build_system_prompt() -> str:
    instructions = "\n".join(f"  {i+1}. {line}" for i, line in enumerate(GAME_INSTRUCTIONS))
    valid = ", ".join(VALID_OBJECTS)
    tiers = "\n".join(f"  - {k}: {v}" for k, v in REWARD_TIERS.items())
    return (
        "You are an expert Curriculum Designer for Reinforcement Learning agents.\n"
        "GAME DESCRIPTION:\n"
        f"{instructions}\n"
        f"{DEPENDENCY_NOTE}\n"
        f"VALID OBJECTS: {valid}. Do not use any other object names.\n"
        "REWARD DESIGN: Assign reward tiers to objects to shape learning.\n"
        f"{tiers}\n"
        "  - The terminal reward for crafting the Pogo Stick is always given at full value.\n"
        "  - If an object is present, give it a non-none reward unless you deliberately want sparse signal.\n"
        "ROLE: Design a sequential curriculum (Stage {current_stage} of {total_stages}).\n"
    )


DEFAULT_PROMPTS = {
    "system_prompt": _build_system_prompt(),

    "initial_pipeline": [
        {
            "name": "plan",
            "prompt": (
                "Design a 5-stage curriculum roadmap. Follow these rules strictly:\n"
                "  1. Stage 1 must contain EXACTLY ONE object type. "
                "Choose the object that is first in the dependency chain (KEY_FRAGMENT).\n"
                "  2. Each subsequent stage introduces AT MOST ONE new object type.\n"
                "  3. Respect dependency ordering from the game description: never place an object "
                "that depends on another without including that dependency.\n"
                "  4. Use dense rewards (large/medium) in early stages to guide the agent, "
                "reducing reward density in later stages as the agent becomes more capable.\n"
                "  5. Grid size should start small (6x6–8x8) and grow gradually toward 12x12–15x15.\n\n"
                "Now outline your specific plan and explain your reasoning."
            )
        },
        {
            "name": "generate",
            "prompt": (
                "Generate the configuration for STAGE 1 based on your plan. "
                "Stage 1 must have exactly one object type: KEY_FRAGMENT. "
                "Grid: 6x6 to 8x8. Give KEY_FRAGMENT a large reward. "
                "Set all other objects to count 0 and reward none."
            )
        }
    ],

    "continuous_pipeline": [
        {
            "name": "analyze_history",
            "prompt": (
                "Review the Curriculum History:\n"
                "{context}\n\n"
                "Analyze the agent's performance and decide on the next stage. Follow these rules:\n"
                "  - Introduce AT MOST ONE new object type compared to the previous stage.\n"
                "  - Respect the dependency chain from the game description: never place an object "
                "that depends on another without also including that dependency.\n"
                "  - High success: increase difficulty (larger grid, sparser rewards, or one new object type).\n"
                "  - Moderate success: mild increase (same objects, slightly larger grid or sparser rewards).\n"
                "  - Low success: simplify (keep or shrink grid, increase reward density, do NOT add new object types).\n"
                "  - If the user modified the previous config, adapt to their preference.\n"
                "Explain your decision."
            )
        },
        {
            "name": "generate",
            "prompt": (
                "Generate the configuration for Stage {current_stage} based on your analysis. "
                f"Use only {', '.join(VALID_OBJECTS)} as object names. "
                "Provide counts and reward tiers (none/small/medium/large) for each. "
                "Any object present in the environment should have a non-none reward unless you "
                "deliberately want sparse signal for that object."
            )
        }
    ]
}
