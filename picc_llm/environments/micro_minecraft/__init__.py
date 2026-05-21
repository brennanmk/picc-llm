"""
picc_llm.environments.micro_minecraft
------------------------------------

This package contains the Micro-Minecraft gymnasium environment.

It exposes the main class `MicroMinecraft` and the helper enums
`Object` and `Action`.
"""

__all__ = ["MicroMinecraft", "Object"]


def __getattr__(name):
    if name in ("MicroMinecraft", "Object"):
        from .env import MicroMinecraft, Object
        globals().update({"MicroMinecraft": MicroMinecraft, "Object": Object})
        return globals()[name]
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
