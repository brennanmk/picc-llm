#!/usr/bin/env python3

"""
picc_rl.environments.micro_minecraft.env
-------------------------------------

This module contains the gynasium environment
for the Micro-Minecraft grid world.

Based on implementation provided by Jivko Sinapov

Gemini helped to clean up some of the functions.
"""

import copy
import gymnasium as gym
import numpy as np
from enum import Enum
from typing import Dict, List, Optional, Tuple
from numba import jit

from ..schemas import PiccEnv
from .config import MicroMinecraftConfig


class Object(Enum):
    """
    Objects in the environment
    """

    EDGE = -1
    EMPTY_SPACE = 0
    TREE = 1
    ROCK = 2
    CRAFT_TABLE = 3
    CHEST = 4
    AGENT = 5
    IRON_ORE = 6
    FURNACE = 7
    KEY_FRAGMENT = 8


class Action(Enum):
    """
    Actions agent can take
    """

    FORWARD = 0
    RIGHT = 1
    LEFT = 2
    BREAK = 3
    CRAFT_POGO = 4
    UNLOCK = 5
    SMELT = 6
    CRAFT_KEY = 7


LIDAR_DETECTABLE_OBJECTS = [
    Object.TREE,
    Object.ROCK,
    Object.CRAFT_TABLE,
    Object.EDGE,
    Object.CHEST,
    Object.IRON_ORE,
    Object.FURNACE,
    Object.KEY_FRAGMENT,
]

# This needs to be imported AFTER we define Object
from .content import (
    _INSTRUCTIONS,
    _PRIMER_TEXT,
    _OBJECT_IMAGE_MAP,
    _PRIMER_IMAGE_MAP,
    _PRIMER_TEMPLATE,
)


@jit(nopython=True)
def _generate_lidar(
    agent_x: int,
    agent_y: int,
    agent_orientation_angle: float,
    number_of_beams: int,
    lidar_angle_increment: float,
    lidar_range: int,
    width: int,
    height: int,
    grid: np.ndarray,
    lidar_detectable_values: np.ndarray,
    empty_space_value: int,
    edge_value: int,
) -> np.ndarray:
    """
    Numba-jitted function to calculate lidar readings.
    """
    num_obj_types_detectable = len(lidar_detectable_values)

    lidar_readings_flat = np.zeros(
        (number_of_beams * num_obj_types_detectable), dtype=np.float32
    )

    for i in range(number_of_beams):
        current_beam_angle_relative_to_world_x = agent_orientation_angle + (
            i * lidar_angle_increment
        )
        beam_hits_per_type = np.zeros(num_obj_types_detectable, dtype=np.float32)

        for r in range(1, lidar_range + 1):
            beam_hit_x_coord = int(
                agent_x + np.round(r * np.cos(current_beam_angle_relative_to_world_x))
            )
            beam_hit_y_coord = int(
                agent_y - np.round(r * np.sin(current_beam_angle_relative_to_world_x))
            )

            obj_at_hit_location_value = empty_space_value
            detected_object_value = -99  # Use a non-object value

            # Check if the calculated beam hit coordinate is within grid bounds
            if 0 <= beam_hit_x_coord < width and 0 <= beam_hit_y_coord < height:
                obj_at_hit_location_value = grid[beam_hit_y_coord, beam_hit_x_coord]
            else:
                # If out of bounds, it's an EDGE hit.
                detected_object_value = edge_value
                # Calculate sensor value for max range
                sensor_value = (lidar_range - r + 1) / lidar_range

                # Find the index of the detected object
                idx_in_lidar_list = -1
                for k in range(num_obj_types_detectable):
                    if lidar_detectable_values[k] == detected_object_value:
                        idx_in_lidar_list = k
                        break

                if idx_in_lidar_list != -1:
                    beam_hits_per_type[idx_in_lidar_list] = sensor_value
                break  # Beam stops at the edge

            if obj_at_hit_location_value != empty_space_value:
                detected_object_value = obj_at_hit_location_value

                # Find the index of the detected object (Numba-optimized loop)
                idx_in_lidar_list = -1
                for k in range(num_obj_types_detectable):
                    if lidar_detectable_values[k] == detected_object_value:
                        idx_in_lidar_list = k
                        break

                if idx_in_lidar_list != -1:
                    # For detected objects, use 'r' from the loop as the distance
                    sensor_value = (lidar_range - r + 1) / lidar_range
                    beam_hits_per_type[idx_in_lidar_list] = sensor_value
                    break  # Beam stops at the first detected object

        # Assign this beam's hits to the correct slice in the flat array
        start_idx = i * num_obj_types_detectable
        end_idx = (i + 1) * num_obj_types_detectable
        lidar_readings_flat[start_idx:end_idx] = beam_hits_per_type

    return lidar_readings_flat


class MicroMinecraft(PiccEnv):
    """
    MicroMinecraft gym environment.

    :raises: exception if config is invalid
    """

    def __init__(
        self, random_generator: np.random.Generator = np.random.default_rng(), **kwargs
    ) -> None:
        config = MicroMinecraftConfig.model_validate(kwargs)

        self._random_generator = random_generator

        self._height = config.grid.height
        self._width = config.grid.width
        self._number_of_beams = config.lidar.beams
        self._lidar_angle_increment = 2 * np.pi / self._number_of_beams
        self._lidar_range = config.lidar.range
        
        # Defaults used only for legacy randomization
        self._default_trees = config.grid.number_of_trees
        self._default_rocks = config.grid.number_of_rocks

        self._empty_space_value = Object.EMPTY_SPACE.value
        self._edge_value = Object.EDGE.value

        self._lidar_detectable_values = np.array(
            [o.value for o in LIDAR_DETECTABLE_OBJECTS], dtype=np.int32
        )

        self._dir_to_math_angle = {
            "N": np.pi / 2,
            "E": 0.0,
            "S": -np.pi / 2,
            "W": np.pi,
        }

        self._grid = None
        self._agent_x = None
        self._agent_y = None
        self._agent_dir = None
        self._inventory = None
        self.action_space = gym.spaces.Discrete(len(Action))

        self.observation_space = gym.spaces.Tuple(
            (
                gym.spaces.Box(
                    low=0.0,
                    high=1.0,
                    shape=((self._number_of_beams * len(LIDAR_DETECTABLE_OBJECTS)),),
                    dtype=np.float32,
                ),
                gym.spaces.Discrete(50),  # wood (increased max)
                gym.spaces.Discrete(50),  # stone (increased max)
                gym.spaces.Discrete(2),  # num of keys (0 or 1)
                gym.spaces.Discrete(2),  # num of iron (0 or 1)
                gym.spaces.Discrete(2),  # num of pickaxe (0 or 1)
                gym.spaces.Discrete(2),  # num of iron_ore (0 or 1)
                gym.spaces.Discrete(3),  # num of key_fragments (0, 1, or 2)
            )
        )

    @classmethod
    def get_configurable_objects(cls) -> Dict[str, int]:
        """
        Returns items with value > 0, excluding the Agent (usually auto-placed 1).
        """
        return {m.name: m.value for m in Object if m.value > 0 and m != Object.AGENT}

    @classmethod
    def generate_from_params(
        cls, width: int, height: int, object_counts: Dict[str, int]
    ) -> List[List[int]]:
        """
        Generates a grid layout based on curriculum parameters.
        Uses np.full for robustness against Enum value changes.
        """
        grid = np.full((height, width), Object.EMPTY_SPACE.value, dtype=int)

        objects_to_place = []

        objects_to_place.append(Object.AGENT.value)

        config_map = cls.get_configurable_objects()
        for obj_name, count in object_counts.items():
            if obj_name in config_map:
                val = config_map[obj_name]
                objects_to_place.extend([val] * int(count))

        total_cells = width * height
        if len(objects_to_place) > total_cells:
            raise ValueError(
                f"Too many objects ({len(objects_to_place)}) for grid size ({total_cells})"
            )

        rng = np.random.default_rng()

        all_coords = [(r, c) for r in range(height) for c in range(width)]
        rng.shuffle(all_coords)

        for i, obj_val in enumerate(objects_to_place):
            r, c = all_coords[i]
            grid[r][c] = obj_val

        return grid.tolist()

    @staticmethod
    def get_instructions() -> List[str]:
        """
        returns instructions string
        """
        return _INSTRUCTIONS

    @staticmethod
    def get_primer_text() -> Dict[str, str]:
        """
        returns primer text
        """
        return _PRIMER_TEXT

    @staticmethod
    def get_primer_template() -> str:
        """
        returns primer template
        """
        return _PRIMER_TEMPLATE

    @staticmethod
    def get_object_image_map() -> Dict[int, str]:
        """
        returns map of objects to images
        """
        return _OBJECT_IMAGE_MAP

    @staticmethod
    def get_object_enum_map() -> Dict[str, int]:
        """
        Returns map of object names to values.
        """
        return {member.name: member.value for member in Object}

    @staticmethod
    def get_primer_image_map() -> Dict[str, str]:
        """
        returns map of images used by primer
        """
        return _PRIMER_IMAGE_MAP

    @property
    def random_generator(self) -> tuple[int, int]:
        return self._random_generator

    @random_generator.setter
    def random_generator(self, generator: np.random.Generator) -> None:
        """
        In case for some reason you need to update the random generator during
        an experiment.
        """

        self._random_generator = generator

    def reset(
        self, config=None, *, seed: Optional[int] = None, options: Optional[dict] = None
    ) -> Tuple[np.ndarray, dict]:
        """
        reset the environment. 
        
        If 'config' is provided (e.g. from CurriculumWrapper), it sets the grid directly.
        If 'config' is None, it falls back to internal default randomization.
        """
        if config is not None:
            # We assume config is a list of lists here (generated by generate_from_params)
            self._grid = np.array(copy.deepcopy(config), dtype=int)
            self._height, self._width = self._grid.shape

            y_coord, x_coord = np.where(self._grid == Object.AGENT.value)

            if len(y_coord) > 0 and len(x_coord) > 0:
                self._agent_x = x_coord[0]
                self._agent_y = y_coord[0]
                # Clear agent from grid array so it doesn't collide with itself
                self._grid[self._agent_y][self._agent_x] = Object.EMPTY_SPACE.value
            else:
                # Fallback if agent missing in config
                self._agent_y, self._agent_x = 0, 0
            
            self._agent_dir = "N"
        else:
            self._grid = np.array(self._randomize_configuration(), dtype=int)

        self._inventory = dict(
            [
                ("wood", 0),
                ("stone", 0),
                ("pogo", 0),
                ("key", 0),
                ("iron", 0),
                ("pickaxe", 0),
                ("iron_ore", 0),
                ("key_fragment", 0),
            ]
        )

        return self._generate_observation(), {}

    def step(self, action):
        """
        Take action and return observation
        """
        reward = 0
        done = False

        # The action is an integer, compare with Enum.value
        if action == Action.LEFT.value:  # turn left
            if self._agent_dir == "N":
                self._agent_dir = "W"
            elif self._agent_dir == "W":
                self._agent_dir = "S"
            elif self._agent_dir == "S":
                self._agent_dir = "E"
            elif self._agent_dir == "E":
                self._agent_dir = "N"
        elif action == Action.RIGHT.value:  # turn right
            if self._agent_dir == "N":
                self._agent_dir = "E"
            elif self._agent_dir == "W":
                self._agent_dir = "N"
            elif self._agent_dir == "S":
                self._agent_dir = "W"
            elif self._agent_dir == "E":
                self._agent_dir = "S"
        elif action == Action.FORWARD.value:  # go forward
            target_x, target_y = self._get_new_pos()
            if (
                0 <= target_x < self._width
                and 0 <= target_y < self._height
                and self._grid[target_y][target_x] == Object.EMPTY_SPACE.value
            ):
                self._agent_x = target_x
                self._agent_y = target_y
        elif action == Action.BREAK.value:  # use / break block
            target_x, target_y = self._get_new_pos()
            if 0 <= target_x < self._width and 0 <= target_y < self._height:
                cell_value = self._grid[target_y][target_x]
                if cell_value == Object.TREE.value:
                    self._grid[target_y][target_x] = Object.EMPTY_SPACE.value
                    self._inventory["wood"] += 1
                    if self._inventory["wood"] <= 2:
                        reward = 25
                elif cell_value == Object.ROCK.value:
                    self._grid[target_y][target_x] = Object.EMPTY_SPACE.value
                    self._inventory["stone"] += 1
                    if self._inventory["stone"] == 1:
                        reward = 25
                elif cell_value == Object.KEY_FRAGMENT.value:
                    self._grid[target_y][target_x] = Object.EMPTY_SPACE.value
                    self._inventory["key_fragment"] += 1
                    reward = 25
                elif cell_value == Object.IRON_ORE.value:
                    if self._inventory["pickaxe"] >= 1:
                        self._grid[target_y][target_x] = Object.EMPTY_SPACE.value
                        self._inventory["iron_ore"] += 1
                        reward = 25
        elif action == Action.CRAFT_POGO.value:
            target_x, target_y = (
                self._get_new_pos()
            )  # Agent must be in front of craft table
            if (
                0 <= target_x < self._width
                and 0 <= target_y < self._height
                and self._grid[target_y][target_x] == Object.CRAFT_TABLE.value
            ):
                if (
                    self._inventory["wood"] >= 2
                    and self._inventory["iron"] >= 1
                    and self._inventory["stone"] >= 1
                ):
                    self._inventory["pogo"] += 1
                    self._inventory["wood"] -= 2
                    self._inventory["stone"] -= 1
                    self._inventory["iron"] -= 1
                    done = True
                    reward = 200
        elif action == Action.UNLOCK.value:
            target_x, target_y = self._get_new_pos()
            if (
                0 <= target_x < self._width
                and 0 <= target_y < self._height
                and self._grid[target_y][target_x] == Object.CHEST.value
                and self._inventory["key"] >= 1
            ):
                self._inventory["key"] -= 1
                self._inventory["pickaxe"] += 1  # Get pickaxe from chest
                self._grid[target_y][target_x] = Object.EMPTY_SPACE.value
                reward = 25
        elif action == Action.SMELT.value:
            target_x, target_y = (
                self._get_new_pos()
            )  # Agent must be in front of furnace
            if (
                0 <= target_x < self._width
                and 0 <= target_y < self._height
                and self._grid[target_y][target_x] == Object.FURNACE.value
            ):
                if self._inventory["iron_ore"] >= 1:
                    self._inventory["iron_ore"] -= 1
                    self._inventory["iron"] += 1
                    reward = 25
        elif action == Action.CRAFT_KEY.value:
            target_x, target_y = (
                self._get_new_pos()
            )  # Agent must be in front of craft table
            if (
                0 <= target_x < self._width
                and 0 <= target_y < self._height
                and self._grid[target_y][target_x] == Object.CRAFT_TABLE.value
            ):
                if self._inventory["key_fragment"] >= 2:
                    self._inventory["key_fragment"] -= 2
                    self._inventory["key"] += 1
                    reward = 25

        truncated = False

        return self._generate_observation(), reward, done, truncated, {}

    def render(self):
        """
        Display text based repr of env
        """
        out_str = ""
        for i in range(self._height):
            row_str = []
            for j in range(self._width):
                if self._agent_x == j and self._agent_y == i:
                    if self._agent_dir == "N":
                        char = "^"
                    elif self._agent_dir == "S":
                        char = "v"
                    elif self._agent_dir == "E":
                        char = ">"
                    elif self._agent_dir == "W":
                        char = "<"
                    else:
                        char = "?"  # Should not happen
                else:
                    cell_value = self._grid[i][j]
                    if cell_value == Object.TREE.value:
                        char = "T"
                    elif cell_value == Object.ROCK.value:
                        char = "R"
                    elif cell_value == Object.CRAFT_TABLE.value:
                        char = "C"
                    elif cell_value == Object.EMPTY_SPACE.value:
                        char = " "
                    elif cell_value == Object.EDGE.value:
                        char = "#"
                    elif cell_value == Object.CHEST.value:
                        char = "U"
                    elif cell_value == Object.IRON_ORE.value:
                        char = "I"
                    elif cell_value == Object.FURNACE.value:
                        char = "F"
                    elif cell_value == Object.KEY_FRAGMENT.value:
                        char = "k"
                    else:
                        char = "?"  # Unknown object
                row_str.append(char)
            out_str += " ".join(row_str) + "\n"
        out_str += "\ninventory:\t" + str(self._inventory)
        print(out_str)

    def encode_config(self):
        """
        Encodes the current environment configuration into a list of lists,
        including the agent's position.
        Returns a deepcopy to prevent external modification of the internal grid.
        """
        try:
            if self._grid is None:
                return []

            encoded_grid = copy.deepcopy(self._grid)

            h = len(encoded_grid)
            w = len(encoded_grid[0])
            if (
                self._agent_y is not None
                and self._agent_x is not None
                and 0 <= self._agent_y < h
                and 0 <= self._agent_x < w
            ):
                encoded_grid[self._agent_y][self._agent_x] = Object.AGENT.value

            return encoded_grid.tolist()  # Convert numpy array back to list for JSON
        except Exception as e:
            print("Error in encode_config:", e)
            raise

    def decode_config(self, raw_grid):
        """
        Convert raw enum-based grid (from frontend) back into numpy array for environment logic.
        """
        cleaned = [
            [int(cell) if str(cell).strip() != "" else 0 for cell in row]
            for row in raw_grid
        ]
        return np.array(cleaned, dtype=int)

    def close(self):
        """
        Cleanup... Not really needed
        """

        pass

    def get_raw_grid(self):
        """
        Returns the raw enum grid used for rendering.
        """

        return copy.deepcopy(self._grid)

    def _get_new_pos(self):
        target_x, target_y = self._agent_x, self._agent_y
        if self._agent_dir == "N":
            target_y -= 1
        elif self._agent_dir == "W":
            target_x -= 1
        elif self._agent_dir == "E":
            target_x += 1
        elif self._agent_dir == "S":
            target_y += 1
        return target_x, target_y

    def _generate_observation(self) -> tuple:
        """
        generate an observation, simulate lidar measurement
        This method now acts as a wrapper for the JIT-compiled function.
        """
        agent_orientation_angle = self._dir_to_math_angle[self._agent_dir]

        lidar_obs = _generate_lidar(
            self._agent_x,
            self._agent_y,
            agent_orientation_angle,
            self._number_of_beams,
            self._lidar_angle_increment,
            self._lidar_range,
            self._width,
            self._height,
            self._grid,
            self._lidar_detectable_values,
            self._empty_space_value,
            self._edge_value,
        )

        return (
            lidar_obs,
            self._inventory["wood"],
            self._inventory["stone"],
            self._inventory["key"],
            self._inventory["iron"],
            self._inventory["pickaxe"],
            self._inventory["iron_ore"],
            self._inventory["key_fragment"],
        )

    def _randomize_configuration(self) -> list:
        """
        Legacy internal generator using __init__ defaults.
        Useful for testing environment without a wrapper.
        """
        # Map init defaults to a params dict and reuse the static logic
        params = {
            "TREE": self._default_trees,
            "ROCK": self._default_rocks,
            "CRAFT_TABLE": 1,
            "CHEST": 1,
            "IRON_ORE": 1,
            "FURNACE": 1,
            "KEY_FRAGMENT": 2,
        }
        return self.generate_from_params(self._width, self._height, params)
