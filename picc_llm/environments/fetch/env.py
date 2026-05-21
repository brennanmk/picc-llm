#!/usr/bin/env python3

"""
picc_llm.environments.fetch.env
---------------------------------

Curriculum wrapper around FetchPickAndPlace-v3 (gymnasium-robotics / MuJoCo).

Curriculum is controlled via two levers:
  1. Config params (goal_height, goal_distance, object_noise) — difficulty of the scene.
  2. Reward tiers (reach, grasp, lift, place) — intermediate shaping bonuses.

Observation: flat 31-dim array (25 robot obs + 3 achieved_goal + 3 desired_goal).
Action:      continuous Box(-1, 1, shape=(4,)) — [dx, dy, dz, gripper].
"""

import numpy as np
from typing import Dict, List, Optional, Any, Tuple
from gymnasium import spaces

from ..schemas import PiccEnv
from .config import FetchConfig


# Fallback table height if height_offset is not accessible from the inner env.
_DEFAULT_HEIGHT_OFFSET = 0.425


class FetchPickAndPlace(PiccEnv):
    """
    FetchPickAndPlace-v3 wrapped for PICC curriculum experiments.

    Subtask chain:  reach → grasp → lift (if goal_height > 0) → place
    Config params:  goal_height, goal_distance, object_noise
    Reward subtasks: reach, grasp, lift, place
    """

    # Base reward magnitudes for tier scaling
    _REWARD_REACH = 1.0
    _REWARD_GRASP = 2.0
    _REWARD_LIFT = 3.0
    _REWARD_PLACE = 10.0

    _REWARD_TIER_MULTIPLIERS = {"none": 0.0, "small": 0.25, "medium": 1.0, "large": 4.0}

    # Thresholds for subtask detection (metres)
    _REACH_THRESHOLD = 0.05
    _GRASP_Z_THRESHOLD = 0.02   # object must rise above height_offset by this to count as grasped
    _LIFT_THRESHOLD = 0.06
    _SUCCESS_THRESHOLD = 0.05

    # Small always-on dense guidance (scaled so bonuses dominate)
    _DENSE_SCALE = 0.1

    # Obs slice indices within the 25-dim "observation" vector from FetchPickAndPlace-v3
    # (grip_pos[0:3], object_pos[3:6], object_rel_pos[6:9], gripper_state[9:11], ...)
    _OBS_GRIP_POS = slice(0, 3)
    _OBS_OBJ_POS = slice(3, 6)
    _OBS_GRIPPER_STATE = slice(9, 11)

    def __init__(self):
        try:
            import gymnasium_robotics  # noqa: F401 — registers envs as side-effect
        except ImportError as exc:
            raise ImportError(
                "gymnasium-robotics is required. "
                "Install with: pip install mujoco 'gymnasium-robotics>=1.2'"
            ) from exc

        import gymnasium
        self._inner = gymnasium.make(
            "FetchPickAndPlace-v3", reward_type="dense", max_episode_steps=200
        )

        # Flatten the Dict observation space → flat Box
        inner_obs = self._inner.observation_space
        obs_dim = sum(
            inner_obs[k].shape[0] for k in ("observation", "achieved_goal", "desired_goal")
        )
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(obs_dim,), dtype=np.float32
        )
        self.action_space = self._inner.action_space

        # Curriculum config (defaults = full-task / max difficulty)
        self._goal_height = 0.45
        self._goal_distance = 0.15
        self._object_noise = 0.1

        # Effective rewards (default: sparse intermediate, always-on terminal)
        self._eff_reward_reach = 0.0
        self._eff_reward_grasp = 0.0
        self._eff_reward_lift = 0.0
        self._eff_reward_place = self._REWARD_PLACE

        # Episode subtask tracking
        self._reached = False
        self._grasped = False
        self._lifted = False
        self._placed = False

    # ------------------------------------------------------------------ #
    #  Core gym interface                                                   #
    # ------------------------------------------------------------------ #

    def reset(self, config=None, seed=None, options=None):
        if config is not None:
            self._apply_config(config)

        # Propagate curriculum difficulty to inner env before it resets
        inner = self._inner.unwrapped
        inner.target_range = self._goal_distance
        inner.obj_range = max(self._object_noise, 1e-3)
        inner.target_in_the_air = self._goal_height > 0.05

        obs, info = self._inner.reset(seed=seed)

        # Clamp sampled goal to curriculum height constraint
        height_offset = getattr(inner, "height_offset", _DEFAULT_HEIGHT_OFFSET)
        if not inner.target_in_the_air:
            inner.goal[2] = height_offset
        else:
            inner.goal[2] = np.clip(
                inner.goal[2],
                height_offset,
                height_offset + self._goal_height,
            )
        obs["desired_goal"] = inner.goal.copy()

        self._reached = False
        self._grasped = False
        self._lifted = False
        self._placed = False

        return self._flatten_obs(obs), info

    def step(self, action):
        obs, _, terminated, truncated, info = self._inner.step(action)
        reward = self._compute_shaped_reward(obs)

        dist = float(np.linalg.norm(obs["achieved_goal"] - obs["desired_goal"]))
        if dist < self._SUCCESS_THRESHOLD:
            terminated = True

        return self._flatten_obs(obs), reward, terminated, truncated, info

    def close(self):
        self._inner.close()

    # ------------------------------------------------------------------ #
    #  Reward computation                                                   #
    # ------------------------------------------------------------------ #

    def _compute_shaped_reward(self, obs_dict: Dict) -> float:
        robot_obs = obs_dict["observation"]
        grip_pos = robot_obs[self._OBS_GRIP_POS]
        object_pos = robot_obs[self._OBS_OBJ_POS]
        gripper_state = robot_obs[self._OBS_GRIPPER_STATE]
        goal = obs_dict["desired_goal"]

        inner = self._inner.unwrapped
        height_offset = getattr(inner, "height_offset", _DEFAULT_HEIGHT_OFFSET)

        reward = 0.0

        # Always-on dense guidance: negative distance object→goal
        dist_obj_goal = float(np.linalg.norm(object_pos - goal))
        reward -= self._DENSE_SCALE * dist_obj_goal

        # One-time subtask bonuses
        dist_grip_obj = float(np.linalg.norm(grip_pos - object_pos))

        if not self._reached and dist_grip_obj < self._REACH_THRESHOLD:
            reward += self._eff_reward_reach
            self._reached = True

        gripper_closed = float(np.sum(gripper_state)) < 0.055
        if (
            not self._grasped
            and self._reached
            and gripper_closed
            and object_pos[2] > height_offset + self._GRASP_Z_THRESHOLD
        ):
            reward += self._eff_reward_grasp
            self._grasped = True

        if not self._lifted and object_pos[2] > height_offset + self._LIFT_THRESHOLD:
            reward += self._eff_reward_lift
            self._lifted = True

        if not self._placed and dist_obj_goal < self._SUCCESS_THRESHOLD:
            reward += self._eff_reward_place
            self._placed = True

        return reward

    # ------------------------------------------------------------------ #
    #  Curriculum API                                                       #
    # ------------------------------------------------------------------ #

    def _apply_config(self, config: Dict) -> None:
        if not isinstance(config, dict):
            return
        self._goal_height = float(config.get("goal_height", 0.45))
        self._goal_distance = float(config.get("goal_distance", 0.15))
        self._object_noise = float(config.get("object_noise", 0.1))

    def set_reward_tiers(self, rewards: Dict[str, str]) -> None:
        """
        Set per-subtask reward magnitudes via tier strings.
        Resets intermediate rewards to sparse (0); terminal place reward is always on.
        """
        self._eff_reward_reach = 0.0
        self._eff_reward_grasp = 0.0
        self._eff_reward_lift = 0.0
        self._eff_reward_place = self._REWARD_PLACE  # always given at full value by default

        for subtask, tier in rewards.items():
            mult = self._REWARD_TIER_MULTIPLIERS.get(
                tier.lower() if isinstance(tier, str) else "medium", 1.0
            )
            if subtask == "reach":
                self._eff_reward_reach = self._REWARD_REACH * mult
            elif subtask == "grasp":
                self._eff_reward_grasp = self._REWARD_GRASP * mult
            elif subtask == "lift":
                self._eff_reward_lift = self._REWARD_LIFT * mult
            elif subtask == "place":
                self._eff_reward_place = self._REWARD_PLACE * mult

    def decode_config(self, raw_config) -> Dict:
        return FetchConfig.model_validate(raw_config).model_dump()

    def augment_template(self, template_config) -> Dict:
        # Fetch already randomizes goal/object positions on every reset within the
        # configured bounds — returning the template unchanged is sufficient.
        return template_config

    # ------------------------------------------------------------------ #
    #  PiccEnv class methods                                               #
    # ------------------------------------------------------------------ #

    @classmethod
    def generate_from_params(
        cls, width: int, height: int, object_counts: Dict
    ) -> Dict:
        """
        For Fetch, 'object_counts' is a float-param dict, not integer object counts.
        width/height are ignored.
        """
        return {
            "goal_height": float(object_counts.get("goal_height", 0.45)),
            "goal_distance": float(object_counts.get("goal_distance", 0.15)),
            "object_noise": float(object_counts.get("object_noise", 0.1)),
        }

    @classmethod
    def get_max_limits(cls, config: Dict[str, Any]) -> Dict[str, float]:
        """Full-task (hardest) config — used as the target eval configuration."""
        return {"goal_height": 0.45, "goal_distance": 0.15, "object_noise": 0.1}

    @classmethod
    def get_max_episode_reward(
        cls,
        object_counts: Dict,
        reward_tiers: Optional[Dict[str, str]] = None,
    ) -> float:
        """
        Max achievable episode reward: sum of reachable subtask bonuses + terminal reward.
        The small dense guidance signal is excluded (always-on, negligible relative to bonuses).
        """

        def eff(base: float, name: str) -> float:
            if reward_tiers is None:
                return 0.0
            tier = reward_tiers.get(name, "none")
            mult = cls._REWARD_TIER_MULTIPLIERS.get(
                tier.lower() if isinstance(tier, str) else "none", 0.0
            )
            return base * mult

        goal_height = float(object_counts.get("goal_height", 0.45))

        max_reward = 0.0
        max_reward += eff(cls._REWARD_REACH, "reach")
        max_reward += eff(cls._REWARD_GRASP, "grasp")
        if goal_height > 0.05:
            max_reward += eff(cls._REWARD_LIFT, "lift")
        max_reward += cls._REWARD_PLACE  # always given at full value (like CRAFT_POGO)
        return max_reward

    @classmethod
    def get_configurable_objects(cls) -> Dict[str, float]:
        return {"goal_height": 0.45, "goal_distance": 0.15, "object_noise": 0.1}

    # ------------------------------------------------------------------ #
    #  Webapp-only stubs (not needed for experiment stack)                  #
    # ------------------------------------------------------------------ #

    @staticmethod
    def get_instructions() -> List[str]:
        from .description import GAME_INSTRUCTIONS
        return GAME_INSTRUCTIONS

    @staticmethod
    def get_primer_text() -> Dict[str, str]:
        return {}

    @staticmethod
    def get_primer_template() -> str:
        return ""

    @staticmethod
    def get_object_image_map() -> Dict[int, str]:
        return {}

    @staticmethod
    def get_object_enum_map() -> Dict[str, int]:
        return {}

    @staticmethod
    def get_primer_image_map() -> Dict[str, str]:
        return {}

    # ------------------------------------------------------------------ #
    #  Helpers                                                              #
    # ------------------------------------------------------------------ #

    def _flatten_obs(self, obs_dict: Dict) -> np.ndarray:
        return np.concatenate([
            obs_dict["observation"],
            obs_dict["achieved_goal"],
            obs_dict["desired_goal"],
        ]).astype(np.float32)
