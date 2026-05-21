#!/usr/bin/env python3
"""
generate_configs.py
-------------------
Generates one YAML config file per (env × llm × condition) combination.

2 envs × 5 LLMs × 4 conditions = 40 config files, each running num_sessions times.

Each config is a self-contained CurriculumConfig for train_curriculum.py.
Run all experiments in parallel:

    parallel python -m picc_llm.utils.train_curriculum --config {} \
        ::: examples/configs/**/*.yaml

Or on SLURM (array job):

    sbatch --array=0-39 run_experiment.sh
"""

import argparse
import os
import yaml

# ---------------------------------------------------------------------------
# LLM definitions — update model IDs and base_url per provider
# ---------------------------------------------------------------------------

LLMS = {
    "qwen3-32b": {
        "model": "qwen/qwen3-32b:nitro",
        "base_url": "https://openrouter.ai/api/v1",
        "api_key": "${OPENROUTER_API_KEY}",
        "temperature": 0.7,
    },
    "minimax": {
        "model": "minimax/minimax-m2.7",
        "base_url": "https://openrouter.ai/api/v1",
        "api_key": "${OPENROUTER_API_KEY}",
        "temperature": 0.7,
    },
    "gpt-oss": {
        "model": "openai/gpt-oss-120b",
        "base_url": "https://openrouter.ai/api/v1",
        "api_key": "${OPENROUTER_API_KEY}",
        "temperature": 0.7,
    },
    "gemma-4": {
        "model": "google/gemma-4-31b-it",
        "base_url": "https://openrouter.ai/api/v1",
        "api_key": "${OPENROUTER_API_KEY}",
        "temperature": 0.7,
    },
    "deepseek-v4": {
        "model": "deepseek/deepseek-v4-pro",
        "base_url": "https://openrouter.ai/api/v1",
        "api_key": "${OPENROUTER_API_KEY}",
        "temperature": 0.7,
    },
}

# ---------------------------------------------------------------------------
# Conditions
# ---------------------------------------------------------------------------

CONDITIONS = {
    "no_feedback": {
        "mode": "llm_full",
        "feedback_metrics": None,
    },
    "reward": {
        "mode": "llm_interactive",
        "feedback_metrics": ["reward"],
    },
    "timestep": {
        "mode": "llm_interactive",
        "feedback_metrics": ["timestep"],
    },
    "both": {
        "mode": "llm_interactive",
        "feedback_metrics": ["reward", "timestep"],
    },
}

# ---------------------------------------------------------------------------
# Per-environment definitions
# ---------------------------------------------------------------------------

ENVS = {
    "minecraft": {
        "env": "minecraft",
        "env_config": {
            "grid": {"height": 10, "width": 10},
            "lidar": {"range": 5, "beams": 8},
        },
        "training_config": {
            "episodes_per_iteration": 200,
            "episodes_per_evaluation": 50,
            "max_episode_len": 500,
            "num_parallel_envs": 10,
            "update_frequency": 1600,
            "lr_actor": 0.0003,
            "lr_critic": 0.001,
            "gamma": 0.99,
            "K_epochs": 20,
            "eps_clip": 0.2,
            "ent_coef": 0.01,
            "max_grad_norm": 0.5,
            "train_mode": "fixed",
            "eval_mode": "fixed",
            "train_until_stable": True,
            "stability_delta_threshold": 5.0,
            "stability_check_window": 5,
            "min_stability_iterations": 3,
            "max_stability_training_iterations": 20,
        },
    },
    "fetch": {
        "env": "fetch",
        "env_config": {},
        "training_config": {
            "episodes_per_iteration": 200,
            "episodes_per_evaluation": 50,
            "max_episode_len": 200,   # FetchPickAndPlace-v3 default is 50; env uses 200
            "num_parallel_envs": 10,
            "update_frequency": 1600,
            "lr_actor": 0.0003,
            "lr_critic": 0.001,
            "gamma": 0.99,
            "K_epochs": 20,
            "eps_clip": 0.2,
            "ent_coef": 0.01,
            "max_grad_norm": 0.5,
            "train_mode": "fixed",
            "eval_mode": "fixed",
            "train_until_stable": True,
            "stability_delta_threshold": 5.0,
            "stability_check_window": 5,
            "min_stability_iterations": 3,
            "max_stability_training_iterations": 20,
        },
    },
}

TOTAL_STAGES = 5
RUNS_PER_LLM_CONDITION = 15


def build_config(env_name: str, llm_name: str, condition_name: str, num_sessions: int) -> dict:
    env_def = ENVS[env_name]
    llm = LLMS[llm_name]
    cond = CONDITIONS[condition_name]

    cfg = {
        "experiment_name": f"{env_name}_{llm_name}_{condition_name}",
        "test_storage": f"experiments/results/{env_name}",
        "number_of_procs": 1,

        "env": env_def["env"],
        "env_config": env_def["env_config"],

        "mode": cond["mode"],
        "total_stages": TOTAL_STAGES,
        "num_sessions": num_sessions,
        "runs_per_session": 1,
        "seeds": list(range(num_sessions)),

        "curriculum_training_config": env_def["training_config"],

        "llm_settings": {
            "connection": {
                "model": llm["model"],
                "base_url": llm["base_url"],
                "api_key": llm["api_key"],
                "temperature": llm["temperature"],
            }
            # prompts are auto-injected from DEFAULT_PROMPTS by train_curriculum.py
        },
    }

    if cond["feedback_metrics"] is not None:
        cfg["feedback_metrics"] = cond["feedback_metrics"]

    return cfg


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out-dir",
        default="examples/configs",
        help="Root directory to write config files into (default: examples/configs)",
    )
    parser.add_argument(
        "--runs",
        type=int,
        default=RUNS_PER_LLM_CONDITION,
        help=f"Sessions per LLM×condition (default: {RUNS_PER_LLM_CONDITION})",
    )
    parser.add_argument(
        "--envs",
        nargs="+",
        default=list(ENVS.keys()),
        choices=list(ENVS.keys()),
        help="Which envs to generate configs for (default: all)",
    )
    args = parser.parse_args()

    total = 0
    for env_name in args.envs:
        env_dir = os.path.join(args.out_dir, env_name)
        os.makedirs(env_dir, exist_ok=True)
        for llm_name in LLMS:
            for condition_name in CONDITIONS:
                cfg = build_config(env_name, llm_name, condition_name, args.runs)
                filename = f"{llm_name}_{condition_name}.yaml"
                path = os.path.join(env_dir, filename)
                with open(path, "w") as f:
                    yaml.dump(cfg, f, indent=2, sort_keys=False, allow_unicode=True)
                total += 1

    print(f"Generated {total} config files in: {args.out_dir}/")
    print()
    print("Run all in parallel with GNU parallel:")
    print(f"  parallel python -m picc_llm.utils.train_curriculum --config {{}} :::")
    print(f"  {args.out_dir}/**/*.yaml")


if __name__ == "__main__":
    main()
