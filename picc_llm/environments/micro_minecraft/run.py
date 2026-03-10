#!/usr/bin/env python3

"""
picc_llm.environments.micro_minecraft.run
-------------------------------------

Script for manually testing the MicroMinecraft environment.
"""

from .env import MicroMinecraft, Action

if __name__ == "__main__":
    env = MicroMinecraft(max_episode_len=200)
    obs, info = env.reset()

    terminated = False
    truncated = False
    total_reward = 0

    while True:
        env.render()
        action_input = input("Action (w,a,d,b,c,u,k) or q to quit: ").lower()

        selected_action = None
        if action_input == "w":
            selected_action = Action.FORWARD.value
        elif action_input == "a":
            selected_action = Action.LEFT.value
        elif action_input == "d":
            selected_action = Action.RIGHT.value
        elif action_input == "b":
            selected_action = Action.BREAK.value
        elif action_input == "c":
            selected_action = Action.CRAFT_POGO.value
        elif action_input == "u":
            selected_action = Action.UNLOCK.value
        elif action_input == "k":
            selected_action = Action.CRAFT_KEY.value
        elif action_input == "q":
            break
        else:
            print("Invalid action.")
            continue

        obs, reward, terminated, truncated, info = env.step(selected_action)
        total_reward += reward

        print(
            f"Action: {Action(selected_action).name}, Reward: {reward}, Terminated: {terminated}, Truncated: {truncated}"
        )

        if terminated or truncated:
            print(f"Episode Finished! Total Reward: {total_reward}")
            print("--- RESETTING ENVIRONMENT ---")
            obs, info = env.reset()
            total_reward = 0
            
    env.close()
