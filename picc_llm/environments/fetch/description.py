"""
picc_llm.environments.fetch.description
----------------------------------------
Plain-text description of FetchPickAndPlace for LLM prompts.
"""

GAME_INSTRUCTIONS = [
    "The robot arm's goal is to pick up a block and place it at the target position.",
    "The target position may be on the table (goal_height=0) or in the air (goal_height>0).",
    "The robot must reach the block, grasp it, lift it if the goal is elevated, then place it at the target.",
    "goal_height controls the max height of the target above the table: 0.0=table level, 0.45=full air range.",
    "goal_distance controls how far the target can be from the block's starting position: 0.05=nearby, 0.15=full range.",
    "object_noise controls randomness in the block's starting position: 0.0=fixed, 0.1=fully random.",
]

DEPENDENCY_NOTE = (
    "STRICT DEPENDENCY: The robot must grasp the block before it can lift or place it. "
    "If goal_height=0, lift is not required. All tasks require reach → grasp → place at minimum."
)

# These are the curriculum parameters the LLM controls (float values, not integer counts).
VALID_OBJECTS = ["goal_height", "goal_distance", "object_noise"]

# Subtasks the LLM can assign reward tiers to.
REWARD_SUBTASKS = ["reach", "grasp", "lift", "place"]

REWARD_TIERS = {
    "none":   "no reward for this subtask (sparse signal).",
    "small":  "small reward (~0.25× base value).",
    "medium": "medium reward (~1× base value).",
    "large":  "large reward (~4× base value).",
}

# How to specify a stage config for this env (shown to LLM in prompts).
PARAM_FORMAT = (
    "Specify each stage as: objects (map of param name → float value), "
    "rewards (map of subtask name → tier string). "
    "Valid param names: goal_height (0.0–0.45), goal_distance (0.01–0.15), object_noise (0.0–0.15). "
    "Valid reward subtask names: reach, grasp, lift, place. "
    "Do NOT include width or height — they are not used for this environment."
)

# Hint for the first stage of a curriculum.
STAGE_1_HINT = (
    "Stage 1: set goal_height=0.0 (goal on table, no lifting needed), "
    "goal_distance=0.05 (very close), object_noise=0.0 (fixed start). "
    "Give reach and grasp large rewards. lift: none (not needed). place: large."
)

# Rules for progression across stages.
PROGRESSION_RULES = [
    "Increase goal_distance gradually as the agent succeeds (max 0.15).",
    "Only introduce goal_height > 0 once the agent reliably grasps and pushes on the table.",
    "Increase object_noise gradually to improve generalization.",
    "High success (>0.7): increase difficulty (raise goal_height, goal_distance, or object_noise).",
    "Moderate success (0.3–0.7): mild increase in one parameter only.",
    "Low success (<0.3): reduce difficulty — lower goal_height or goal_distance, increase reward density.",
    "The place reward is always the terminal signal; use reach/grasp/lift tiers to shape intermediate behaviour.",
]
