#!/usr/bin/env python3

"""
picc_rl.environments.wrappers
-----------------------------

Wrappers for Gymnasium environments to handle curriculum generation.
"""

import gymnasium as gym
import copy
import numpy as np
from typing import Dict, Any, Optional, Tuple

class ConfigResetWrapper(gym.Wrapper):
    """
    Wraps a PiccEnv to handle dynamic environment generation.
    
    This wrapper intercepts reset calls. If `curriculum_params` have been set
    via `set_curriculum_params`, it uses the environment's static generator 
    to create a fresh grid layout and passes it to the environment's reset method.
    """

    def __init__(self, env: gym.Env):
        super().__init__(env)
        self.curriculum_params = {}

    def set_curriculum_params(self, params: Dict[str, Any]):
        """
        Updates the parameters used for generation (e.g. width, height, object counts).
        """
        self.curriculum_params = copy.deepcopy(params)

    def reset(
        self, *, seed: Optional[int] = None, options: Optional[dict] = None
    ) -> Tuple[np.ndarray, dict]:
        """
        Overrides reset to inject a procedurally generated grid based on current params.
        """
        config_to_pass = None
        
        if self.curriculum_params:
            w = self.curriculum_params.get('width', 10)
            h = self.curriculum_params.get('height', 10)
            objects = self.curriculum_params.get('objects', {})
            config_to_pass = self.unwrapped.__class__.generate_from_params(w, h, objects)
        
        return self.env.reset(config=config_to_pass, seed=seed, options=options)
