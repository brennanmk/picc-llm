#!/usr/bin/env python3

"""
picc_llm.environments.wrappers
-----------------------------

Custom wrappers for PICC environments.
"""

import gymnasium as gym
import copy
import numpy as np
from typing import Optional, Tuple
from .schemas import TrainingMode


class ConfigResetWrapper(gym.Wrapper):
    """
    A wrapper that manages how configurations are passed to the environment reset.
    It supports Fixed, Random, and Augmented modes.
    """

    def __init__(self, env):
        super().__init__(env)
        self._config_to_use = None
        self._mode = TrainingMode.RANDOM

    def set_config(self, config):
        """
        Stores the config (or template) to be used for Fixed/Augmented modes.
        """
        self._config_to_use = copy.deepcopy(config)

    def set_mode(self, mode: TrainingMode):
        """Sets the operating mode for the next reset."""
        self._mode = mode

    def set_rewards(self, rewards: dict):
        """Passes reward tier overrides to the underlying environment."""
        self.env.unwrapped.set_reward_tiers(rewards)

    def reset(
        self, *, seed: Optional[int] = None, options: Optional[dict] = None
    ) -> Tuple[np.ndarray, dict]:
        """
        Overrides the standard reset to inject configuration logic.
        """
        config_to_pass = None

        if self._mode == TrainingMode.FIXED:
            if self._config_to_use is not None:
                config_to_pass = copy.deepcopy(self._config_to_use)

        elif self._mode == TrainingMode.AUGMENTED:
            if self._config_to_use is not None:
                # Delegate to the Env's logic
                config_to_pass = self.env.unwrapped.augment_template(
                    copy.deepcopy(self._config_to_use)
                )
            else:
                raise ValueError(
                    "Configuration Error: TrainingMode.AUGMENTED requires a template configuration."
                )

        elif self._mode == TrainingMode.RANDOM:
            config_to_pass = None

        return self.env.reset(config=config_to_pass, seed=seed, options=options)
