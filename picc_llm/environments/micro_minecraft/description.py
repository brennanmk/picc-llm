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
    "To unlock the CHEST, the robot needs 1 Key Fragment (from KEY_FRAGMENT objects) in its inventory.",
    "The robot can collect Key Fragments, Trees, and Rocks in any order, "
    "but must unlock the CHEST before it can craft the Pogo Stick.",
]

# Strict dependency note — surfaced separately so prompts can emphasise it.
DEPENDENCY_NOTE = (
    "STRICT DEPENDENCY: KEY_FRAGMENT must be collected before CHEST can be unlocked. "
    "TREE and ROCK can be collected at any point but are required before crafting."
)

# Valid object names the environment understands.
VALID_OBJECTS = ["TREE", "ROCK", "KEY_FRAGMENT", "CHEST"]

# Available reward tiers and their meaning.
REWARD_TIERS = {
    "none":   "no reward for collecting this object (sparse signal).",
    "small":  "small reward (~0.25× base value).",
    "medium": "medium reward (~1× base value).",
    "large":  "large reward (~4× base value).",
}
