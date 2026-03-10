#!/usr/bin/env python3

"""
picc_llm.learning.ppo
-------------------

PPO implementation, based off (and mostly consisting) of code from
https://github.com/nikhilbarhate99/PPO-PyTorch.

Added ability to handle gymnasium parallel batches.
Removed support for continous actions (not uses in our deployment).
"""

import torch
import torch.nn as nn
from torch.distributions import Categorical
import numpy as np
import os


class RolloutBuffer:
    def __init__(self):
        self.actions = []
        self.states = []
        self.logprobs = []
        self.rewards = []
        self.state_values = []
        self.is_terminals = []

    def clear(self):
        del self.actions[:]
        del self.states[:]
        del self.logprobs[:]
        del self.rewards[:]
        del self.state_values[:]
        del self.is_terminals[:]


class ActorCritic(nn.Module):
    def __init__(
        self,
        state_dim,
        action_dim,
        device,
    ):
        super(ActorCritic, self).__init__()

        self.device = device

        self.actor = nn.Sequential(
            nn.Linear(state_dim, 64),
            nn.Tanh(),
            nn.Linear(64, 64),
            nn.Tanh(),
            nn.Linear(64, action_dim),
            nn.Softmax(dim=-1),
        )
        # critic
        self.critic = nn.Sequential(
            nn.Linear(state_dim, 64),
            nn.Tanh(),
            nn.Linear(64, 64),
            nn.Tanh(),
            nn.Linear(64, 1),
        )

    def forward(self):
        raise NotImplementedError

    def act(self, state):
        action_probs = self.actor(state)
        dist = Categorical(action_probs)

        action = dist.sample()
        action_logprob = dist.log_prob(action)
        state_val = self.critic(state)

        return action.detach(), action_logprob.detach(), state_val.detach()

    def evaluate(self, state, action):
        action_probs = self.actor(state)
        dist = Categorical(action_probs)
        action_logprobs = dist.log_prob(action)
        dist_entropy = dist.entropy()
        state_values = self.critic(state)

        return action_logprobs, state_values, dist_entropy

    def reset_critic_weights(self):
        for layer in self.critic:
            if hasattr(layer, "reset_parameters"):
                layer.reset_parameters()


class PPO:
    def __init__(
        self,
        state_dim,
        action_dim,
        lr_actor,
        lr_critic,
        gamma,
        K_epochs,
        eps_clip,
        ent_coef,
        max_grad_norm,
        use_gpu,
    ):
        self.device = torch.device("cpu")
        if use_gpu and torch.cuda.is_available():
            self.device = torch.device("cuda:0")
            torch.cuda.empty_cache()
        else:
            # If we are running on HPC we can set OMP_NUM_THREADS in the batch script.
            num_cpus = os.environ.get("OMP_NUM_THREADS", None)
            if num_cpus:
                torch.set_num_threads(int(num_cpus))

        self.initial_lr_actor = lr_actor
        self.initial_lr_critic = lr_critic
        self.initial_ent_coef = ent_coef

        self.gamma = gamma
        self.eps_clip = eps_clip
        self.K_epochs = K_epochs
        self.ent_coef = ent_coef
        self.max_grad_norm = max_grad_norm

        self.buffer = RolloutBuffer()

        self.policy = ActorCritic(
            state_dim,
            action_dim,
            self.device,
        ).to(self.device)
        self.optimizer = torch.optim.Adam(
            [
                {"params": self.policy.actor.parameters(), "lr": lr_actor},
                {"params": self.policy.critic.parameters(), "lr": lr_critic},
            ]
        )

        self.policy_old = ActorCritic(
            state_dim,
            action_dim,
            self.device,
        ).to(self.device)
        self.policy_old.load_state_dict(self.policy.state_dict())

        self.MseLoss = nn.MSELoss()

    def decay(self, lr_rate: float, ent_rate: float):
        """
        Decays the learning rate of both actor and critic by the given rate.
        :param lr_rate: A float between 0.0 and 1.0 (1.0 = original LR, 0.0 = 0 LR)
        :param decay_entropy:  A float between 0.0 and 1.0 
        """
        # Group 0 is Actor
        self.optimizer.param_groups[0]["lr"] = self.initial_lr_actor * lr_rate
        # Group 1 is Critic
        self.optimizer.param_groups[1]["lr"] = self.initial_lr_critic * lr_rate

        self.ent_coef = self.initial_ent_coef * ent_rate

    def _act_batch(self, state):
        """Internal method to get action, logprob, and value for a batch."""
        # state is (batch_size, state_dim)
        state_tensor = torch.from_numpy(state).to(self.device).float()
        with torch.no_grad():
            action, action_logprob, state_val = self.policy_old.act(state_tensor)
        return action, action_logprob, state_val

    def select_action(self, state):
        """Selects actions for a batch of states (for training)."""
        # state is (num_envs, state_dim)
        state = np.array(state, dtype=np.float32)

        action, action_logprob, state_val = self._act_batch(state)

        # Return the numpy array of actions, not a single item
        return action.detach().cpu().numpy()

    def select_action_inference(self, state):
        """Selects greedy actions for a batch of states (for evaluation)."""
        state = np.array(state, dtype=np.float32)
        if state.ndim == 1:
            # Handle a single state if it ever comes in
            state = np.expand_dims(state, axis=0)

        state_tensor = torch.from_numpy(state).to(self.device).float()

        with torch.no_grad():
            action, _, _ = self.policy_old.act(state_tensor)

        # Return the numpy array of actions
        return action.detach().cpu().numpy()

    def update(self):
        # Monte Carlo estimate of returns
        rewards = []
        discounted_reward = 0
        for reward, is_terminal in zip(
            reversed(self.buffer.rewards), reversed(self.buffer.is_terminals)
        ):
            if is_terminal:
                discounted_reward = 0
            discounted_reward = reward + (self.gamma * discounted_reward)
            rewards.insert(0, discounted_reward)

        # Normalizing the rewards
        rewards = torch.tensor(rewards, dtype=torch.float32).to(self.device)
        rewards = (rewards - rewards.mean()) / (rewards.std() + 1e-7)

        # convert list to tensor
        old_states = (
            torch.squeeze(torch.stack(self.buffer.states, dim=0))
            .detach()
            .to(self.device)
            .float()
        )

        old_actions = (
            torch.squeeze(torch.stack(self.buffer.actions, dim=0))
            .detach()
            .to(self.device)
        )
        old_logprobs = (
            torch.squeeze(torch.stack(self.buffer.logprobs, dim=0))
            .detach()
            .to(self.device)
        )
        old_state_values = (
            torch.squeeze(torch.stack(self.buffer.state_values, dim=0))
            .detach()
            .to(self.device)
        )

        # calculate advantages
        advantages = rewards.detach() - old_state_values.detach()

        # normalize advantages (add a small epsilon to ensure we are not dividing by 0)
        advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)

        # Optimize policy for K epochs
        for _ in range(self.K_epochs):
            # Evaluating old actions and values
            logprobs, state_values, dist_entropy = self.policy.evaluate(
                old_states, old_actions
            )

            # match state_values tensor dimensions with rewards tensor
            state_values = torch.squeeze(state_values)

            # Finding the ratio (pi_theta / pi_theta__old)
            ratios = torch.exp(logprobs - old_logprobs.detach())

            # Finding Surrogate Loss
            surr1 = ratios * advantages
            surr2 = (
                torch.clamp(ratios, 1 - self.eps_clip, 1 + self.eps_clip) * advantages
            )

            # final loss of clipped objective PPO
            loss = (
                -torch.min(surr1, surr2)
                + 0.5 * self.MseLoss(state_values, rewards)
                - self.ent_coef * dist_entropy
            )

            # take gradient step
            self.optimizer.zero_grad()
            loss.mean().backward()

            torch.nn.utils.clip_grad_norm_(self.policy.parameters(), self.max_grad_norm)

            self.optimizer.step()

        # Copy new weights into old policy
        self.policy_old.load_state_dict(self.policy.state_dict())

        # clear buffer
        self.buffer.clear()

    def save(self, checkpoint_path):
        """
        Saves the state of the policy and the optimizer.
        """
        os.makedirs(os.path.dirname(checkpoint_path), exist_ok=True)

        checkpoint = {
            "policy_state_dict": self.policy_old.state_dict(),
            "optimizer_state_dict": self.optimizer.state_dict(),
        }

        torch.save(checkpoint, checkpoint_path)

    def load(self, checkpoint_path, load_critic=True, load_optimizer=True):
        """
        Loads the state for the policy and optimizer.

        :param checkpoint_path: Path to the .pt file
        :param load_critic: If False, critic weights are reset to random (Transfer Learning).
        :param load_optimizer: If False, optimizer is reset (Transfer Learning).
        """
        checkpoint = torch.load(
            checkpoint_path, map_location=lambda storage, loc: storage
        )

        policy_state = checkpoint["policy_state_dict"]

        if not load_critic:
            policy_state = {
                k: v for k, v in policy_state.items() if not k.startswith("critic")
            }
            self.policy.load_state_dict(policy_state, strict=False)
            self.policy.reset_critic_weights()
        else:
            self.policy.load_state_dict(policy_state)

        if load_optimizer:
            self.optimizer.load_state_dict(checkpoint["optimizer_state_dict"])

        self.policy_old.load_state_dict(self.policy.state_dict())
