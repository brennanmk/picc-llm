"""
picc_rl.environments.micro_minecraft.config
---------------------------------------------

This module holds pydantic models used for config validation
"""

from pydantic import BaseModel, Field, model_validator
from typing import Optional


class GridConfig(BaseModel):
    """Pydantic model for grid-related configuration."""

    height: int = 10
    width: int = 10
    number_of_trees: Optional[int] = None
    number_of_rocks: Optional[int] = None

    @model_validator(mode="after")
    def compute_object_defaults(self) -> "GridConfig":
        """Compute default object counts based on grid size if not provided."""
        if self.number_of_trees is None:
            self.number_of_trees = max(int(self.width * self.height / 20), 1)
        if self.number_of_rocks is None:
            self.number_of_rocks = max(int(self.width * self.height / 40), 1)
        return self


class LidarConfig(BaseModel):
    """Pydantic model for lidar-related configuration."""

    beams: int = 8
    range: Optional[int] = None


class MicroMinecraftConfig(BaseModel):
    """Top-level environment configuration model."""

    grid: GridConfig = Field(default_factory=GridConfig)
    lidar: LidarConfig = Field(default_factory=LidarConfig)
    max_episode_len: Optional[int] = 500

    @model_validator(mode="after")
    def compute_lidar_range(self) -> "MicroMinecraftConfig":
        """Compute default lidar range based on grid size if not provided."""
        if self.lidar.range is None:
            max_dimension = max(self.grid.height, self.grid.width)
            self.lidar.range = max_dimension // 2
        return self
