#!/usr/bin/env python3

"""
picc_llm.environments.schemas
-------------------

Definitions of schemas shared between environments.
"""

from typing import Dict, List, Any
import gymnasium as gym
import abc
from enum import Enum


class TrainingMode(str, Enum):
    """
    Defines how the environment config should be handled during reset.
    """

    FIXED = "fixed"  # Always use the specific provided config
    RANDOM = "random"  # Ignore config, generate completely random
    AUGMENTED = "augmented"  # Use config as a template, populate emptiness randomly


class PiccEnv(gym.Env, abc.ABC):
    """
    An abstract base class for all environments in this study.

    It enforces that all concrete environment classes provide the necessary
    assets (instructions, primers, etc.) as class-level attributes or methods.
    """

    @staticmethod
    @abc.abstractmethod
    def get_instructions() -> List[str]:
        """A list of instruction strings for the environment."""
        raise NotImplementedError

    @staticmethod
    @abc.abstractmethod
    def get_configurable_objects() -> List[str]:
        """A list of configurable objects for the environment."""
        raise NotImplementedError

    @staticmethod
    @abc.abstractmethod
    def get_primer_text() -> Dict[str, str]:
        """A dictionary of HTML strings for the primer page."""
        raise NotImplementedError

    @staticmethod
    @abc.abstractmethod
    def get_primer_template() -> str:
        """Jinja2 template string for rendering the primer."""
        raise NotImplementedError

    @staticmethod
    @abc.abstractmethod
    def get_object_image_map() -> Dict[int, str]:
        """Returns a map of object enum values to base64 image strings."""
        raise NotImplementedError

    @staticmethod
    @abc.abstractmethod
    def get_object_enum_map() -> Dict[str, int]:
        """Returns a map of object enum names to int values"""
        raise NotImplementedError

    @staticmethod
    @abc.abstractmethod
    def get_primer_image_map() -> Dict[str, str]:
        """Returns a map of keywords to base64 image strings for the primer."""
        raise NotImplementedError

    @abc.abstractmethod
    def augment_template(self, template_grid: List[List[int]]) -> List[List[int]]:
        """
        Takes a sparse 'template' grid (geometry/walls) and returns a fully
        populated grid configuration with objects/agents spawned.
        """
        raise NotImplementedError

    @classmethod
    @abc.abstractmethod
    def generate_from_params(
        cls, width: int, height: int, object_counts: Dict[str, int]
    ) -> List[List[int]]:
        """
        Generates a specific grid instance based on curriculum parameters.

        :param width: Grid width
        :param height: Grid height
        :param object_counts: Dictionary mapping Object Names to Quantities (e.g. {'TREE': 5})
        """
        raise NotImplementedError

    @classmethod
    @abc.abstractmethod
    def get_max_limits(cls, config: Dict[str, Any]) -> Dict[str, int]:
        """
        Returns maximum allowed counts for each configurable object type.

        :param config: Environment configuration dictionary
        :return: Dictionary mapping object names (e.g., 'TREE') to max counts
        """
        raise NotImplementedError

    @classmethod
    @abc.abstractmethod
    def get_max_episode_reward(cls, object_counts: Dict[str, int]) -> float:
        """
        Returns the maximum reward achievable in a single episode for a given
        stage configuration. Used to normalize reward into a proportion metric.

        :param object_counts: Dictionary mapping object names to quantities
        :return: Maximum possible reward for the configuration
        """
        raise NotImplementedError
