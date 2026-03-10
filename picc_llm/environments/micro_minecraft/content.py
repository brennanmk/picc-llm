"""
picc_llm.environments.micro_minecraft.content
---------------------------------------------

This module holds all the static content for the Micro-Minecraft environment,
including primer text, instructions, and image asset maps. Used by the webapp.
"""

import os

from .env import Object
from ..utils import get_image_map

_ASSETS_PATH = os.path.join(os.path.dirname(__file__), "assets")

# assets are from https://www.svgrepo.com
_OBJECT_FILENAME_MAP = {
    Object.EMPTY_SPACE.value: "empty_space.png",
    Object.TREE.value: "tree.png",
    Object.ROCK.value: "rock.png",
    Object.CRAFT_TABLE.value: "craft_table.png",
    Object.KEY_FRAGMENT.value: "key.png",
    Object.CHEST.value: "chest.png",
    Object.AGENT.value: "agent.png",
    Object.EDGE.value: "edge.png",
}


_PRIMER_FILENAME_MAP = {
    "interface": "interface.png",
    "agent": "agent.png",
    "tree": "tree.png",
    "rock": "rock.png",
    "craft_table": "craft_table.png",
    "blocking": "blocking.png",
    "train": "train.png",
    "timestep": "timestep.png",
    "reward": "reward.png",
    "key": "key.png",
    "chest": "chest.png",
}

_OBJECT_IMAGE_MAP = get_image_map(_OBJECT_FILENAME_MAP, _ASSETS_PATH)
_PRIMER_IMAGE_MAP = get_image_map(_PRIMER_FILENAME_MAP, _ASSETS_PATH)

_INSTRUCTIONS = [
    f"The robot's <img src='{_OBJECT_IMAGE_MAP.get(Object.AGENT.value)}' style='height: 1em; vertical-align: middle;'/> goal is to craft a pogostick at the <b>crafting table</b> <img src='{_OBJECT_IMAGE_MAP.get(Object.CRAFT_TABLE.value)}' style='height: 1em; vertical-align: middle;'/>.",
    f"Crafting the pogostick requires: 2 <b>wood</b> (from <b>trees</b> <img src='{_OBJECT_IMAGE_MAP.get(Object.TREE.value)}' style='height: 1em; vertical-align: middle;'/>), 1 <b>stone</b> (from <b>rocks</b> <img src='{_OBJECT_IMAGE_MAP.get(Object.ROCK.value)}' style='height: 1em; vertical-align: middle;'/>), and 1 <b>iron</b>.",
    f"To get <b>iron</b>, the robot must unlock the <b>chest</b> <img src='{_OBJECT_IMAGE_MAP.get(Object.CHEST.value)}' style='height: 1em; vertical-align: middle;'/>. Iron is found directly inside.",
    f"To unlock the <b>chest</b>, the robot needs 1 <b>key fragment</b> <img src='{_OBJECT_IMAGE_MAP.get(Object.KEY_FRAGMENT.value)}' style='height: 1em; vertical-align: middle;'/> found on the grid.",
    f"The robot <img src='{_OBJECT_IMAGE_MAP.get(Object.AGENT.value)}' style='height: 1em; vertical-align: middle;'/> can collect the key fragment, trees, and rocks in any order, but must unlock the chest before crafting the pogostick.",
    f"Click cells <img src='{_OBJECT_IMAGE_MAP.get(Object.EDGE.value)}' style='height: 1em; vertical-align: middle;'/> to block/unblock them.",
]

_PRIMER_TEMPLATE = """
    {{ primer_text['none']|safe }}
    <br>
    {% if vis_type == 'reward' %}
        {{ primer_text['reward']|safe }}
    {% elif vis_type == 'timestep' %}
        {{ primer_text['timestep']|safe }}
    {% endif %}
"""

_PRIMER_TEXT = {
    "none": f"""
        <p>
        In the next portion of this study, you will be greeted with the following interface:
        </p>
        <figure>
          <img src="{_PRIMER_IMAGE_MAP.get("interface")}" />
          <figcaption>Example of study interface.</figcaption>
        </figure>
        <p>
        Your goal is to utilize this interface to train a virtual robot (<img src="{_PRIMER_IMAGE_MAP.get("agent")}" style="height: 16px; width: 16px; object-fit: contain; display: inline;" />)
        to complete a gathering and crafting task.
        </p>
        <p>
        The final goal is to craft a <b>pogo stick</b>. This is done at the <b>crafting station</b> (<img src="{_PRIMER_IMAGE_MAP.get("craft_table")}" style="height: 16px; width: 16px; object-fit: contain; display: inline;" />)
        and requires three ingredients: 2 <b>wood</b>, 1 <b>stone</b>, and 1 <b>iron</b>.
        </p>
        <p>
        The robot can get <b>wood</b> by breaking <b>trees</b> (<img src="{_PRIMER_IMAGE_MAP.get("tree")}" style="height: 16px; width: 16px; object-fit: contain; display: inline;" />)
        and <b>stone</b> by breaking <b>rocks</b> (<img src="{_PRIMER_IMAGE_MAP.get("rock")}" style="height: 16px; width: 16px; object-fit: contain; display: inline;" />).
        These can be collected at any time.
        </p>
        
        <p>
        To get <b>iron</b>, the robot must unlock the <b>chest</b> (<img src="{_PRIMER_IMAGE_MAP.get("chest")}" style="height: 16px; width: 16px; object-fit: contain; display: inline;" />). Iron is found directly inside.
        </p>
        <p>
        To unlock the <b>chest</b>, the robot needs 1 <b>key fragment</b> (<img src="{_PRIMER_IMAGE_MAP.get("key")}" style="height: 16px; width: 16px; object-fit: contain; display: inline;" />) found on the grid.
        </p>
        <p>
        Therefore, the robot must complete a chain of dependencies:
        <ol>
            <li>Collect 1 key fragment.</li>
            <li>Use the key fragment to unlock the chest and get iron.</li>
            <li>Collect 2 trees (for wood) and 1 rock (for stone).</li>
            <li>Use the wood, stone, and iron at the crafting station to make the pogo stick.</li>
        </ol>
        Note: Step 3 (collecting wood/stone) can happen at any time before step 4.
        </p>
        <p>
        Similar to how you may teach a child a topic like reading by first starting with the ABCs, you will create a curriculum to train the robot to complete its task.
        </p>
        <p>
        Clicking cells on the grid will block them off, preventing the robot from accessing them. Clicking a cell a second time will unblock it.
        </p>
        <figure>
          <img src="{_PRIMER_IMAGE_MAP.get("blocking")}" />
          <figcaption>Example study interface with a cell blocked off.</figcaption>
        </figure>
        <p>
        By blocking off cells in the grid, you can choose a subset of the task for the robot to learn from. This will allow you to design curricula. Throughout this study, you will have the chance to design a 5-stage curriculum.
        </p>
        <p>
        Once you are happy with the cells that you have chosen to block off, you can select the train button at the bottom of the screen to begin training the agent.
        </p>
        <figure>
          <img src="{_PRIMER_IMAGE_MAP.get("train")}" />
          <figcaption>Button to start training.</figcaption>
        </figure>
        <p>
        Once training is complete, you will be allowed to design the next stage in your curriculum. You will do this a total of 5 times.
        </p>
    """,
    "timestep": f"""
        <p>
        To aid you in generating curricula, you will also be provided with a
        performance metric. This performance metric is indicative of how successful the
        robot is in completing its task. The lower the number, the better the performance.
        This metric will be displayed both textually and on a graph. The textual
        representation shows the performance achieved during the last
        training stage whereas the graphical shows the performance achieved across all
        training stages.
        <p>
        <figure>
          <img src="{_PRIMER_IMAGE_MAP.get("timestep")}" />
          <figcaption>Example of training progress metrics.</figcaption>
        </figure>
    """,
    "reward": f"""
        <p>
        To aid you in generating curricula, you will also be provided with a
        performance metric. This performance metric is indicative of how successful the
        robot is in completing its task. The higher the number, the better the performance.
        This metric will be displayed both textually and on a graph. The textual
        representation shows the performance achieved during the last
        training stage whereas the graphical shows the performance achieved across all
        training stages.
        <p>
        <figure>
          <img src="{_PRIMER_IMAGE_MAP.get("reward")}" />
          <figcaption>Example of training progress metrics.</figcaption>
        </figure>
    """,
}
