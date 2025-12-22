#!/usr/bin/env python3

"""
picc_rl.environments.schemas
-------------------

Definitions of schemas shared between environments.
"""

from typing import Dict, List
import gymnasium as gym
import abc


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

    @classmethod
    @abc.abstractmethod
    def get_configurable_objects(cls) -> Dict[str, int]:
        """
        Returns a dictionary of {Name: EnumValue} for objects that
        the user is allowed to configure (usually values > 0).
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
