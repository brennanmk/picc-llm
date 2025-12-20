"""
picc_rl.environments.micro_minecraft
------------------------------------

This package contains the Micro-Minecraft gymnasium environment.

It exposes the main class `MicroMinecraft` and the helper enums
`Object` and `Action`.
"""

from .env import MicroMinecraft, Object

__all__ = ["MicroMinecraft", "Object"]
