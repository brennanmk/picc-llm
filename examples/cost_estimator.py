#!/usr/bin/env python3
"""
cost_estimator.py
-----------------
Runs sample LLM calls and estimates total experiment cost.

Loads a config produced by generate_configs.py, fires a few real LLM calls
with synthetic context data, measures actual token usage, and extrapolates
to the full experiment (all sessions × all stages).

Pricing is fetched live from the OpenRouter /api/v1/models endpoint when
an OPENROUTER_API_KEY is available, with a hardcoded fallback table.

Usage:
    # Estimate cost for one config:
    OPENROUTER_API_KEY=... python examples/cost_estimator.py \\
        --config examples/configs/claude-opus-4-7_both.yaml

    # Estimate across all 16 configs:
    OPENROUTER_API_KEY=... python examples/cost_estimator.py \\
        --config examples/configs/

    # Override session/stage counts:
    python examples/cost_estimator.py --config ... \\
        --num-sessions 15 --total-stages 5

    # Use a custom price (USD per 1M tokens) if not on OpenRouter:
    python examples/cost_estimator.py --config ... \\
        --input-price 3.00 --output-price 15.00
"""

import argparse
import json
import os
import re
import sys
import yaml

from pathlib import Path

# ---------------------------------------------------------------------------
# Fallback pricing table (USD per 1M tokens, as of May 2026)
# Keys match OpenRouter model IDs used in generate_configs.py
# ---------------------------------------------------------------------------

FALLBACK_PRICES = {
    "anthropic/claude-opus-4-7":  {"input": 15.00, "output": 75.00},
    "google/gemma-3-27b-it":      {"input":  0.10, "output":  0.20},
    "deepseek/deepseek-r1":       {"input":  0.55, "output":  2.19},
    "openai/gpt-4o-mini":         {"input":  0.15, "output":  0.60},
}


# ---------------------------------------------------------------------------
# Pricing fetch
# ---------------------------------------------------------------------------

def fetch_openrouter_prices(api_key: str) -> dict:
    """Return {model_id: {input: $/1M, output: $/1M}} from OpenRouter API."""
    try:
        import urllib.request
        req = urllib.request.Request(
            "https://openrouter.ai/api/v1/models",
            headers={"Authorization": f"Bearer {api_key}"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        prices = {}
        for m in data.get("data", []):
            mid = m.get("id", "")
            p = m.get("pricing", {})
            try:
                # OpenRouter returns price per token; convert to per 1M
                prices[mid] = {
                    "input":  float(p.get("prompt", 0)) * 1_000_000,
                    "output": float(p.get("completion", 0)) * 1_000_000,
                }
            except (TypeError, ValueError):
                continue
        return prices
    except Exception as e:
        print(f"  [warning] Could not fetch OpenRouter prices: {e}", file=sys.stderr)
        return {}


def get_price(model: str, live_prices: dict, override_input=None, override_output=None):
    """Return (input_per_1M, output_per_1M) for a model."""
    if override_input is not None and override_output is not None:
        return override_input, override_output
    p = live_prices.get(model) or FALLBACK_PRICES.get(model)
    if p is None:
        return None, None
    return p["input"], p["output"]


# ---------------------------------------------------------------------------
# Config loading
# ---------------------------------------------------------------------------

def resolve_env_vars(obj):
    if isinstance(obj, dict):
        return {k: resolve_env_vars(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [resolve_env_vars(v) for v in obj]
    if isinstance(obj, str):
        return re.sub(
            r"\$\{(\w+)\}",
            lambda m: os.environ.get(m.group(1), m.group(0)),
            obj,
        )
    return obj


def load_config(path: str) -> dict:
    with open(path) as f:
        cfg = yaml.safe_load(f)
    return resolve_env_vars(cfg)


def collect_configs(path: str) -> list[tuple[str, dict]]:
    p = Path(path)
    if p.is_dir():
        yamls = sorted(p.glob("*.yaml"))
        if not yamls:
            print(f"No YAML files found in {path}", file=sys.stderr)
            sys.exit(1)
        return [(str(y), load_config(str(y))) for y in yamls]
    return [(str(p), load_config(str(p)))]


# ---------------------------------------------------------------------------
# Synthetic context data
# ---------------------------------------------------------------------------

SAMPLE_HISTORY_ENTRY = {
    "curriculum_params": {"width": 8, "height": 8, "objects": {"TREE": 2, "ROCK": 1, "KEY": 1, "CHEST": 1}},
    "final_eval_success": 0.62,
    "final_eval_reward": 45.5,
    "final_eval_timesteps": 210.0,
}


def make_context(stage: int, total_stages: int, feedback_metrics=None) -> dict:
    from picc_llm.llm.llm_handler import format_curriculum_history
    history = [SAMPLE_HISTORY_ENTRY] * (stage - 1)
    return {
        "current_stage": stage,
        "total_stages": total_stages,
        "context": format_curriculum_history(history, feedback_metrics=feedback_metrics),
    }


# ---------------------------------------------------------------------------
# Sample runner
# ---------------------------------------------------------------------------

def sample_calls(cfg: dict, sample_stages: list[int]) -> dict:
    """
    Run real LLM calls at each sample stage and return token usage per stage.
    Returns {"stage_N": {"input": int, "output": int, "total": int}, ...}
    """
    from picc_llm.llm.llm_handler import LLMHandler
    from picc_llm.llm.prompts import DEFAULT_PROMPTS

    mode = cfg.get("mode", "llm_interactive")
    llm_raw = cfg.get("llm_settings", {})
    if "prompts" not in llm_raw:
        llm_raw = dict(llm_raw, prompts=DEFAULT_PROMPTS)

    feedback_metrics = cfg.get("feedback_metrics")
    total_stages = cfg.get("total_stages", 5)

    llm = LLMHandler(settings=llm_raw)
    results = {}

    for stage in sample_stages:
        ctx = make_context(stage, total_stages, feedback_metrics)
        label = f"stage_{stage}"

        try:
            if mode == "llm_full":
                llm.generate_full_curriculum(ctx)
            else:
                llm.generate_curriculum(ctx)
        except Exception as e:
            print(f"    [parse error, tokens still counted] {e}", file=sys.stderr)

        usage = llm.last_token_usage
        results[label] = {
            "input":  usage.get("input_tokens", 0),
            "output": usage.get("output_tokens", 0),
            "total":  usage.get("total_tokens", 0),
        }
        print(f"    stage {stage}: {results[label]['input']} in / {results[label]['output']} out")

    return results


# ---------------------------------------------------------------------------
# Cost projection
# ---------------------------------------------------------------------------

def project_cost(
    mode: str,
    sample_usage: dict,
    num_sessions: int,
    total_stages: int,
    sampled_stages: list[int],
    input_price: float,
    output_price: float,
) -> dict:
    """
    Extrapolate from sample token usage to full experiment cost.

    For llm_interactive: each session makes total_stages calls.
      We linearly interpolate between sampled stages for a per-stage estimate.
    For llm_full: each session makes 1 call.
    """
    usages = [sample_usage[f"stage_{s}"] for s in sampled_stages if f"stage_{s}" in sample_usage]
    if not usages:
        return {}

    avg_input  = sum(u["input"]  for u in usages) / len(usages)
    avg_output = sum(u["output"] for u in usages) / len(usages)

    if mode == "llm_full":
        total_calls = num_sessions
    else:
        total_calls = num_sessions * total_stages

    total_input  = avg_input  * total_calls
    total_output = avg_output * total_calls

    cost = (total_input * input_price + total_output * output_price) / 1_000_000

    return {
        "total_calls":    total_calls,
        "avg_input_tok":  int(avg_input),
        "avg_output_tok": int(avg_output),
        "total_input_tok":  int(total_input),
        "total_output_tok": int(total_output),
        "estimated_cost_usd": round(cost, 4),
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def print_sep(title="", char="=", width=70):
    if title:
        pad = (width - len(title) - 2) // 2
        print(f"\n{char * pad} {title} {char * pad}")
    else:
        print(char * width)


def process_config(
    config_path: str,
    cfg: dict,
    live_prices: dict,
    sample_stages: list[int],
    args,
) -> dict | None:
    model = cfg.get("llm_settings", {}).get("connection", {}).get("model", "unknown")
    mode  = cfg.get("mode", "llm_interactive")
    num_sessions  = args.num_sessions  or cfg.get("num_sessions",  15)
    total_stages  = args.total_stages  or cfg.get("total_stages",  5)
    experiment    = cfg.get("experiment_name", Path(config_path).stem)

    print_sep(experiment)
    print(f"  Model       : {model}")
    print(f"  Mode        : {mode}")
    print(f"  Sessions    : {num_sessions}")
    print(f"  Stages      : {total_stages}")

    # Pricing
    in_price, out_price = get_price(
        model, live_prices,
        override_input=args.input_price,
        override_output=args.output_price,
    )
    if in_price is None:
        print(f"  [warning] No price data for {model} — use --input-price / --output-price")
    else:
        print(f"  Price       : ${in_price:.2f} in / ${out_price:.2f} out per 1M tokens")

    # Sample calls
    print(f"\n  Running sample call(s)...")
    try:
        usage = sample_calls(cfg, sample_stages)
    except Exception as e:
        print(f"  ERROR during LLM call: {e}", file=sys.stderr)
        import traceback; traceback.print_exc()
        return None

    if in_price is None:
        return None

    proj = project_cost(
        mode=mode,
        sample_usage=usage,
        num_sessions=num_sessions,
        total_stages=total_stages,
        sampled_stages=sample_stages,
        input_price=in_price,
        output_price=out_price,
    )

    print(f"\n  Projection ({proj['total_calls']} total calls):")
    print(f"    Avg tokens/call : {proj['avg_input_tok']} in / {proj['avg_output_tok']} out")
    print(f"    Total tokens    : {proj['total_input_tok']:,} in / {proj['total_output_tok']:,} out")
    print(f"    Estimated cost  : ${proj['estimated_cost_usd']:.4f} USD")

    return {
        "experiment": experiment,
        "model": model,
        "mode": mode,
        **proj,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Estimate OpenRouter experiment cost from sample LLM calls.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--config", required=True,
                        help="Path to a config YAML or directory of YAMLs")
    parser.add_argument("--num-sessions", type=int, default=None,
                        help="Override num_sessions from config")
    parser.add_argument("--total-stages", type=int, default=None,
                        help="Override total_stages from config")
    parser.add_argument("--sample-stages", default="1,3",
                        help="Comma-separated stage numbers to sample (default: 1,3)")
    parser.add_argument("--input-price", type=float, default=None,
                        help="Input token price USD/1M (overrides lookup)")
    parser.add_argument("--output-price", type=float, default=None,
                        help="Output token price USD/1M (overrides lookup)")
    args = parser.parse_args()

    sample_stages = [int(s.strip()) for s in args.sample_stages.split(",")]

    # Fetch live prices if possible
    api_key = os.environ.get("OPENROUTER_API_KEY")
    live_prices = {}
    if api_key and args.input_price is None:
        print("Fetching live prices from OpenRouter...")
        live_prices = fetch_openrouter_prices(api_key)
        if live_prices:
            print(f"  Got pricing for {len(live_prices)} models.\n")

    configs = collect_configs(args.config)
    print(f"Found {len(configs)} config(s). Sampling stages: {sample_stages}\n")

    summaries = []
    for config_path, cfg in configs:
        result = process_config(config_path, cfg, live_prices, sample_stages, args)
        if result:
            summaries.append(result)

    if len(summaries) > 1:
        print_sep("TOTAL ESTIMATE", char="=")
        total_cost = sum(s["estimated_cost_usd"] for s in summaries)
        total_calls = sum(s["total_calls"] for s in summaries)
        print(f"  Configs   : {len(summaries)}")
        print(f"  Total calls: {total_calls:,}")
        print(f"  Total cost : ${total_cost:.4f} USD")
        print()
        print(f"  Per experiment:")
        for s in summaries:
            print(f"    {s['experiment']:<50} ${s['estimated_cost_usd']:.4f}")


if __name__ == "__main__":
    main()
