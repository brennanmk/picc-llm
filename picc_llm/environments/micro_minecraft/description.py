"""
picc_llm.environments.micro_minecraft.description
-------------------------------------------------
Plain-text game description for MicroMinecraft. No heavy dependencies —
safe to import anywhere (test scripts, LLM prompts, etc.).

This is the single source of truth for game mechanics text. Update here
when the game changes and both the LLM prompt and the webapp will stay in sync.
"""

# One sentence per mechanic, ordered by dependency chain.
# These are shown to the LLM as the game primer.
GAME_INSTRUCTIONS = [
    "The robot's goal is to craft a Pogo Stick at the crafting table.",
    "Crafting the Pogo Stick requires: 2 Wood (from TREE objects), 1 Stone (from ROCK objects), and 1 Iron.",
    "To get Iron, the robot must unlock the CHEST. Iron is found directly inside the chest.",
    "To unlock the CHEST, the robot needs 1 Key (from KEY objects) in its inventory.",
    "The robot can collect Key Fragments, Trees, and Rocks in any order, "
    "but must unlock the CHEST before it can craft the Pogo Stick.",
]

# Strict dependency note — surfaced separately so prompts can emphasise it.
DEPENDENCY_NOTE = (
    "STRICT DEPENDENCY: KEY must be collected before CHEST can be unlocked. "
    "TREE and ROCK can be collected at any point but are required before crafting."
)

# Valid object names the environment understands.
VALID_OBJECTS = ["TREE", "ROCK", "KEY", "CHEST"]

# Available reward tiers and their meaning.
REWARD_TIERS = {
    "none":   "no reward for collecting this object (sparse signal).",
    "small":  "small reward (~0.25× base value).",
    "medium": "medium reward (~1× base value).",
    "large":  "large reward (~4× base value).",
}

# How to specify a stage config for this env (shown to LLM in prompts).
PARAM_FORMAT = (
    "Specify each stage as: width (int 6–15), height (int 6–15), "
    "objects (map of object name → integer count), "
    "rewards (map of object name → tier string)."
)

# Hint for the first stage of a curriculum.
STAGE_1_HINT = (
    "Stage 1 must contain EXACTLY ONE object type: KEY (count=1). "
    "Grid: 6×6 to 8×8. Give KEY a large reward. All other objects: count 0, reward none."
)

# Rules for progression across stages.
PROGRESSION_RULES = [
    "Introduce AT MOST ONE new object type per stage.",
    "Respect the dependency chain: never add CHEST without KEY, never add TREE/ROCK without enough grid space.",
    "High success (>0.7): increase difficulty (larger grid, sparser rewards, or one new object type).",
    "Moderate success (0.3–0.7): mild increase (same objects, slightly larger grid or sparser rewards).",
    "Low success (<0.3): simplify (keep or shrink grid, increase reward density, do NOT add new objects).",
    "Grid size should grow gradually: start 6×6–8×8, end at 12×12–15×15.",
]
