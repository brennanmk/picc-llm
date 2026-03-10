#!/usr/bin/env python3
"""
picc_llm.utils.test_llm_prompt
------------------------------
Quick CLI tool to test the LLM curriculum prompt without running the full app.

Usage examples:
    # Stage 1 (no history)
    python -m picc_llm.utils.test_llm_prompt

    # Stage 3 with two fake previous stages
    python -m picc_llm.utils.test_llm_prompt --stage 3 --add-history --add-history

    # Override model or temperature
    python -m picc_llm.utils.test_llm_prompt --model openai/gpt-oss-20b --temperature 0.3

Requires GROQ_API_KEY in environment (or .env.docker).
"""

import argparse
import json
import os
import sys
from dotenv import load_dotenv

# Try loading from deploy/.env.docker so you don't need to set env vars manually
_repo_root = os.path.join(os.path.dirname(__file__), "..", "..")
load_dotenv(os.path.join(_repo_root, "deploy", ".env.docker"))
load_dotenv(os.path.join(_repo_root, ".env.local"))  # local overrides

from picc_llm.llm.llm_handler import LLMHandler, LLMSettings, format_curriculum_history

# A bank of fake stage results to use when simulating history
_FAKE_STAGES = [
    {
        "curriculum_params": {"width": 8, "height": 8, "objects": {"KEY_FRAGMENT": 1}},
        "final_eval_success": 0.85,
        "final_eval_reward": 22.5,
        "final_eval_timesteps": 48.0,
    },
    {
        "curriculum_params": {"width": 9, "height": 9, "objects": {"KEY_FRAGMENT": 1, "CHEST": 1}},
        "final_eval_success": 0.60,
        "final_eval_reward": 35.0,
        "final_eval_timesteps": 120.0,
    },
    {
        "curriculum_params": {"width": 10, "height": 10, "objects": {"TREE": 2, "KEY_FRAGMENT": 1, "CHEST": 1}},
        "final_eval_success": 0.40,
        "final_eval_reward": 55.0,
        "final_eval_timesteps": 210.0,
    },
    {
        "curriculum_params": {"width": 10, "height": 10, "objects": {"TREE": 2, "ROCK": 1, "KEY_FRAGMENT": 1, "CHEST": 1}},
        "final_eval_success": 0.25,
        "final_eval_reward": 70.0,
        "final_eval_timesteps": 380.0,
    },
]


def build_settings(model: str, temperature: float) -> dict:
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        print("ERROR: GROQ_API_KEY not set. Add it to deploy/.env.docker or export it.", file=sys.stderr)
        sys.exit(1)

    from picc_llm.llm.prompts import DEFAULT_PROMPTS
    prompts = DEFAULT_PROMPTS

    return {
        "connection": {"model": model, "api_key": api_key, "temperature": temperature},
        "prompts": prompts,
    }


def main():
    parser = argparse.ArgumentParser(description="Test LLM curriculum prompt.")
    parser.add_argument("--stage", type=int, default=1, help="Current stage number (default: 1)")
    parser.add_argument("--total-stages", type=int, default=5, help="Total stages in curriculum (default: 5)")
    parser.add_argument(
        "--history",
        type=int,
        default=0,
        metavar="N",
        help="Number of fake completed stages to include in history (default: 0).",
    )
    parser.add_argument(
        "--model",
        default=os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b"),
        help="Model ID (default: GROQ_MODEL env var or openai/gpt-oss-120b)",
    )
    parser.add_argument("--temperature", type=float, default=0.7)
    args = parser.parse_args()

    history_count = args.history
    history = _FAKE_STAGES[:history_count]

    if history_count != args.stage - 1:
        print(
            f"NOTE: --stage {args.stage} implies {args.stage - 1} completed stage(s), "
            f"but --history {history_count} given. Using {history_count} history entries."
        )

    print(f"\n{'='*60}")
    print(f"  Model:   {args.model}")
    print(f"  Stage:   {args.stage} / {args.total_stages}")
    print(f"  History: {history_count} stage(s)")
    print(f"{'='*60}\n")

    if history:
        print("--- Simulated History ---")
        print(format_curriculum_history(history))
        print()

    settings = build_settings(args.model, args.temperature)
    llm = LLMHandler(settings=settings)

    context_data = {
        "context": format_curriculum_history(history),
        "current_stage": args.stage,
        "total_stages": args.total_stages,
    }

    print("Querying LLM...\n")
    result = llm.generate_curriculum(context_data)

    print("--- Result ---")
    print(json.dumps(result, indent=2))

    usage = getattr(llm, "last_token_usage", None)
    if usage and usage["total_tokens"] > 0:
        total = usage["total_tokens"]
        # Estimate a full 5-stage run: stages get progressively larger due to
        # growing history, so approximate with a linear ramp from this stage size.
        avg_stage_tokens = total  # conservative: assume all stages cost ~this much
        tokens_per_user = avg_stage_tokens * args.total_stages
        users_per_million = 1_000_000 / tokens_per_user

        print(f"\n--- Token Usage (this call) ---")
        print(f"  Input:   {usage['input_tokens']:,}")
        print(f"  Output:  {usage['output_tokens']:,}")
        print(f"  Total:   {total:,}")
        print(f"\n--- Cost Extrapolation ---")
        print(f"  Est. tokens/user ({args.total_stages} stages): ~{tokens_per_user:,}  (assumes all stages cost ~{total:,})")
        print(f"  Est. users per 1M tokens:                   ~{users_per_million:.1f}")


if __name__ == "__main__":
    main()
