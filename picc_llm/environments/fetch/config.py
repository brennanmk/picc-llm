"""
picc_llm.environments.fetch.config
------------------------------------
Pydantic config model for FetchPickAndPlace curriculum parameters.
"""

from pydantic import BaseModel, Field


class FetchConfig(BaseModel):
    """Curriculum difficulty parameters for FetchPickAndPlace."""

    # Max goal height above table (0 = on table, 0.45 = full air range)
    goal_height: float = Field(default=0.45, ge=0.0, le=0.45)
    # Max horizontal distance of goal from block's start position
    goal_distance: float = Field(default=0.15, ge=0.01, le=0.15)
    # Randomness in block starting position (0 = deterministic start)
    object_noise: float = Field(default=0.1, ge=0.0, le=0.15)
