#!/usr/bin/env python3
"""
prompt_tester.py
----------------
Test LLM curriculum prompts without running full training.

Runs the LLM through the real pipeline (same LLMHandler used in experiments)
with simulated training results as feedback.

Usage:
    # Full curriculum (all stages upfront), minecraft:
    python examples/prompt_tester.py --env minecraft

    # Interactive (stage-by-stage with feedback), fetch:
    python examples/prompt_tester.py --env fetch --mode interactive

    # Show the system prompt before running:
    python examples/prompt_tester.py --env minecraft --show-prompt

    # Show full message history:
    python examples/prompt_tester.py --env fetch --show-messages

    # Override stages or model:
    python examples/prompt_tester.py --env minecraft --stages 3 --model openai/gpt-oss-120b
"""

import argparse
import importlib
import os
import sys
import random

# ---------------------------------------------------------------------------
# Simulated training results
# ---------------------------------------------------------------------------

# Predefined fake result sequences per env — mimics realistic learning curves.
# Each tuple is (success_rate, avg_reward, avg_timesteps).
_SIMULATED_RESULTS = {
    "minecraft": [
        (0.72, 3.8, 120),   # stage 1: easy, agent learns quickly
        (0.55, 5.2, 180),   # stage 2: harder, still progressing
        (0.38, 4.9, 250),   # stage 3: more objects, struggling
        (0.21, 3.1, 310),   # stage 4: near full task, low success
        (0.15, 2.8, 380),   # stage 5: full task
    ],
    "fetch": [
        (0.68, 4.1, 40),    # stage 1: push on table, easy
        (0.51, 3.7, 65),    # stage 2: farther goal
        (0.33, 3.2, 95),    # stage 3: lifting introduced
        (0.20, 2.5, 130),   # stage 4: higher goals
        (0.14, 1.9, 160),   # stage 5: full task
    ],
}


def simulate_results(env: str, stage: int, total_stages: int) -> dict:
    """Return plausible fake training metrics for a given stage."""
    results = _SIMULATED_RESULTS.get(env, _SIMULATED_RESULTS["minecraft"])
    idx = min(stage - 1, len(results) - 1)
    success, reward, steps = results[idx]
    # Small jitter so repeated runs look slightly different
    rng = random.Random(stage * 17 + hash(env) % 100)
    success = max(0.0, min(1.0, success + rng.uniform(-0.05, 0.05)))
    reward  = max(0.0, reward  + rng.uniform(-0.3, 0.3))
    steps   = max(1,   int(steps + rng.randint(-10, 10)))
    return {
        "final_eval_success":    round(success, 2),
        "final_eval_reward":     round(reward, 2),
        "final_eval_timesteps":  steps,
        "curriculum_params":     None,   # filled in by the tester
    }


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------

SEP_WIDTH = 70

def sep(title: str = "", char: str = "="):
    if title:
        pad = (SEP_WIDTH - len(title) - 2) // 2
        print(f"\n{char * pad} {title} {char * (SEP_WIDTH - pad - len(title) - 2)}")
    else:
        print(char * SEP_WIDTH)


def print_stage(stage_num: int, params: dict):
    sep(f"STAGE {stage_num}", char="-")
    for k, v in params.items():
        print(f"  {k:<18}: {v}")


def print_feedback(results: dict):
    print(f"  [feedback] success={results['final_eval_success']:.2f}  "
          f"reward={results['final_eval_reward']:.2f}  "
          f"steps={results['final_eval_timesteps']}")


# ---------------------------------------------------------------------------
# Core test runners
# ---------------------------------------------------------------------------

def run_full(llm, env: str, total_stages: int, show_messages: bool):
    """Generate entire curriculum in one shot."""
    sep("LLM_FULL MODE")
    print(f"  Generating {total_stages}-stage curriculum for env='{env}'...\n")

    context = {"current_stage": 1, "total_stages": total_stages}
    stages = llm.generate_full_curriculum(context)

    for i, stage in enumerate(stages, 1):
        print_stage(i, dict(stage))

    sep("TOKEN USAGE")
    for k, v in llm.last_token_usage.items():
        print(f"  {k}: {v}")


def run_interactive(llm, env: str, total_stages: int, show_messages: bool,
                    feedback_metrics: list):
    """Generate one stage at a time, feeding back simulated results."""
    sep("LLM_INTERACTIVE MODE")
    print(f"  env='{env}'  stages={total_stages}  "
          f"feedback={feedback_metrics or 'both'}\n")

    from picc_llm.llm.llm_handler import format_curriculum_history
    history = []
    total_tokens = {"input_tokens": 0, "output_tokens": 0, "total_tokens": 0}

    for stage in range(1, total_stages + 1):
        context = {
            "current_stage": stage,
            "total_stages":  total_stages,
            "context":       format_curriculum_history(history, feedback_metrics),
        }
        params = llm.generate_curriculum(context)

        # Accumulate token usage
        for k in total_tokens:
            total_tokens[k] += llm.last_token_usage.get(k, 0)

        # Print what the LLM decided
        print_stage(stage, dict(params))

        # Simulate training and record for next stage
        results = simulate_results(env, stage, total_stages)
        results["curriculum_params"] = {
            k: v for k, v in params.items() if k != "reasoning"
        }
        print_feedback(results)
        history.append(results)

    sep("TOKEN USAGE (total)")
    for k, v in total_tokens.items():
        print(f"  {k}: {v}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Test LLM curriculum prompts with simulated training feedback.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--env", default="minecraft", choices=["minecraft", "fetch"],
                        help="Environment to test (default: minecraft)")
    parser.add_argument("--mode", default="full", choices=["full", "interactive"],
                        help="Prompt mode: 'full' (all stages upfront) or 'interactive' (default: full)")
    parser.add_argument("--stages", type=int, default=5,
                        help="Number of curriculum stages (default: 5)")
    parser.add_argument("--model", default="openai/gpt-oss-120b",
                        help="LLM model string (default: openai/gpt-oss-120b)")
    parser.add_argument("--temperature", type=float, default=0.7)
    parser.add_argument("--base-url", default="https://openrouter.ai/api/v1")
    parser.add_argument("--feedback", nargs="+", choices=["reward", "timestep"],
                        default=["reward", "timestep"],
                        help="Which metrics to reveal in interactive mode (default: both)")
    parser.add_argument("--show-prompt", action="store_true",
                        help="Print the system prompt before running")
    parser.add_argument("--show-messages", action="store_true",
                        help="(reserved) print full message traces")
    args = parser.parse_args()

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("ERROR: OPENROUTER_API_KEY environment variable not set.", file=sys.stderr)
        sys.exit(1)

    # Build prompts from the env's description module
    description = importlib.import_module(
        f"picc_llm.environments.{'micro_minecraft' if args.env == 'minecraft' else args.env}.description"
    )
    from picc_llm.llm.prompts import build_prompts
    prompts = build_prompts(description)

    if args.show_prompt:
        sep("SYSTEM PROMPT")
        # Format with dummy values so {current_stage}/{total_stages} don't blow up
        print(prompts["system_prompt"].format(current_stage=1, total_stages=args.stages))

    settings = {
        "connection": {
            "model":       args.model,
            "base_url":    args.base_url,
            "api_key":     api_key,
            "temperature": args.temperature,
        },
        "prompts": prompts,
    }

    sep("CONFIG")
    print(f"  env        : {args.env}")
    print(f"  mode       : {args.mode}")
    print(f"  model      : {args.model}")
    print(f"  stages     : {args.stages}")
    print(f"  temperature: {args.temperature}")

    from picc_llm.llm.llm_handler import LLMHandler
    llm = LLMHandler(settings=settings)

    if args.mode == "full":
        run_full(llm, args.env, args.stages, args.show_messages)
    else:
        run_interactive(llm, args.env, args.stages, args.show_messages, args.feedback)


if __name__ == "__main__":
    main()
