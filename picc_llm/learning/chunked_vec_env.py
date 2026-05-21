#!/usr/bin/env python3

"""
picc_llm.learning.chunked_vec_env
---------------------------------

A drop-in replacement for SyncVectorEnv that splits N envs across P worker
processes, each running SyncVectorEnv(N // P) internally.
"""

import multiprocessing as mp
import numpy as np
from enum import IntEnum
from gymnasium.vector import SyncVectorEnv


class _Cmd(IntEnum):
    STEP = 0
    RESET = 1
    CALL = 2
    CLOSE = 3


def _worker(conn, env_fns):
    """
    Worker process: owns a SyncVectorEnv built from env_fns.
    Listens for commands on conn, sends back results.
    """
    vec = SyncVectorEnv(env_fns)

    try:
        while True:
            cmd, payload = conn.recv()

            if cmd == _Cmd.STEP:
                obs, rewards, dones, truncs, infos = vec.step(payload)
                conn.send((obs, rewards, dones, truncs))

            elif cmd == _Cmd.RESET:
                seed, options = payload
                obs, infos = vec.reset(seed=seed, options=options)
                conn.send(obs)

            elif cmd == _Cmd.CALL:
                method, args, kwargs = payload
                results = vec.call(method, *args, **kwargs)
                conn.send(results)

            elif cmd == _Cmd.CLOSE:
                break

    finally:
        vec.close()
        conn.close()


class ChunkedVecEnv:
    """
    Splits a list of env factory functions across n_workers parallel processes,
    each hosting a SyncVectorEnv. Implements the subset of the gymnasium
    VectorEnv API used by the Trainer: reset(), step(), call(), close().

    Parameters
    ----------
    env_fns : list of callables
        Factory functions, one per env (same as SyncVectorEnv).
    n_workers : int
        Number of worker processes. Should evenly divide len(env_fns).
        Default 4; benchmark shows this is optimal for MicroMinecraft on
        typical desktop CPUs.
    """

    def __init__(self, env_fns, n_workers=4):
        n = len(env_fns)
        if n % n_workers != 0:
            raise ValueError(
                f"n_workers={n_workers} must evenly divide len(env_fns)={n}"
            )

        self.num_envs = n
        self._n_workers = n_workers
        self._chunk = n // n_workers

        # Build one reference env to expose space metadata
        _ref = env_fns[0]()
        self.single_observation_space = _ref.observation_space
        self.single_action_space = _ref.action_space
        _ref.close()

        # Chunk env_fns and start workers
        self._conns = []
        self._procs = []
        for i in range(n_workers):
            chunk_fns = env_fns[i * self._chunk : (i + 1) * self._chunk]
            parent_conn, child_conn = mp.Pipe()
            proc = mp.Process(
                target=_worker,
                args=(child_conn, chunk_fns),
                daemon=True,
            )
            proc.start()
            child_conn.close()  # only parent end used in main process
            self._conns.append(parent_conn)
            self._procs.append(proc)

    def reset(self, *, seed=None, options=None):
        for conn in self._conns:
            conn.send((_Cmd.RESET, (seed, options)))
        chunks = [conn.recv() for conn in self._conns]
        return np.concatenate(chunks, axis=0), {}

    def step(self, actions):
        # Scatter chunked actions
        for i, conn in enumerate(self._conns):
            conn.send((_Cmd.STEP, actions[i * self._chunk : (i + 1) * self._chunk]))
        # Gather and concatenate
        obs_list, rew_list, don_list, tru_list = [], [], [], []
        for conn in self._conns:
            obs, rew, don, tru = conn.recv()
            obs_list.append(obs)
            rew_list.append(rew)
            don_list.append(don)
            tru_list.append(tru)
        return (
            np.concatenate(obs_list, axis=0),
            np.concatenate(rew_list, axis=0),
            np.concatenate(don_list, axis=0),
            np.concatenate(tru_list, axis=0),
            {},
        )

    def call(self, method, *args, **kwargs):
        """Forward a method call to every env in every worker."""
        for conn in self._conns:
            conn.send((_Cmd.CALL, (method, args, kwargs)))
        results = []
        for conn in self._conns:
            results.extend(conn.recv())
        return results

    def close(self):
        for conn in self._conns:
            try:
                conn.send((_Cmd.CLOSE, None))
            except BrokenPipeError:
                pass
        for proc in self._procs:
            proc.join(timeout=5)
            if proc.is_alive():
                proc.terminate()
        for conn in self._conns:
            conn.close()

    def __del__(self):
        try:
            self.close()
        except Exception:
            pass
