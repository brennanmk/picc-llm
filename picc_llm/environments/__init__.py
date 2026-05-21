def __getattr__(name):
    if name == "MicroMinecraft":
        from .micro_minecraft.env import MicroMinecraft
        globals()["MicroMinecraft"] = MicroMinecraft
        return MicroMinecraft
    if name == "FetchPickAndPlace":
        from .fetch.env import FetchPickAndPlace
        globals()["FetchPickAndPlace"] = FetchPickAndPlace
        return FetchPickAndPlace
    if name == "ENVIRONMENTS":
        from .micro_minecraft.env import MicroMinecraft
        from .fetch.env import FetchPickAndPlace
        env_map = {"minecraft": MicroMinecraft, "fetch": FetchPickAndPlace}
        globals()["ENVIRONMENTS"] = env_map
        return env_map
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
