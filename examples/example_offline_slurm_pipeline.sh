#!/bin/bash

# ==============================================================================
# This script runs curriculum training with automatic aggregation.
# No longer needs separate offline/augment/averaging steps.
#
# Requires a run config file sourced via the RUN_CONFIG environment variable:
#   RUN_CONFIG=/path/to/run_config.sh sbatch --array=0-N slurm_pipeline.sh
#
# The run config defines:
#   CONFIGS      - array of config file paths (one entry per experiment)
#   NUM_CHUNKS   - how many chunks to split each config into (1 = no chunking)
#   OUTPUT_BASE  - base directory for chunked output
#
# Array sizing:
#   Total tasks = ${#CONFIGS[@]} * NUM_CHUNKS
#   e.g. 2 configs, 3 chunks -> --array=0-5
#        2 configs, 1 chunk  -> --array=0-1
# ==============================================================================

# --- Slurm Configuration ---
#SBATCH --job-name=picc-llm-curriculum
#SBATCH --output=logs/picc-llm-curriculum_%A_%a.log
#SBATCH --time=32:00:00
#SBATCH --partition=batch,mpi,preempt
#SBATCH --requeue
#SBATCH --cpus-per-task=96
#SBATCH --mem=96G

echo "Job ID: $SLURM_JOB_ID, Array Task ID: ${SLURM_ARRAY_TASK_ID:-N/A}"
echo "Running on node: $(hostname)"
echo "Started at: $(date)"

# --- Environment Setup ---
mkdir -p logs

module load miniforge/24.11.2-py312
source activate picc

export PYTHONUNBUFFERED=1

# --- Project Setup ---
cd ~/picc-llm
export PYTHONPATH=$PYTHONPATH:$(pwd)

set -e
set -o pipefail

# --- Helper Function ---
log() {
  echo "=== [SLURM PIPELINE] $1 ==="
}

# --- Load Run Config ---
if [ -z "$RUN_CONFIG" ]; then
    log "ERROR: RUN_CONFIG environment variable is not set."
    log "Usage: RUN_CONFIG=/path/to/run_config.sh sbatch --array=0-N slurm_pipeline.sh"
    exit 1
fi

if [ ! -f "$RUN_CONFIG" ]; then
    log "ERROR: Run config file not found: $RUN_CONFIG"
    exit 1
fi

source "$RUN_CONFIG"
log "Loaded run config: $RUN_CONFIG"

# --- Validate Run Config ---
if [ -z "${CONFIGS+x}" ] || [ ${#CONFIGS[@]} -eq 0 ]; then
    log "ERROR: CONFIGS array is not defined or empty in $RUN_CONFIG"
    exit 1
fi

NUM_CHUNKS=${NUM_CHUNKS:-1}
NUM_CONFIGS=${#CONFIGS[@]}
TASK_ID=${SLURM_ARRAY_TASK_ID:-0}

# --- Resolve Config Index and Chunk Index ---
CONFIG_IDX=$((TASK_ID / NUM_CHUNKS))
CHUNK_IDX=$((TASK_ID % NUM_CHUNKS))

if [ "$CONFIG_IDX" -ge "$NUM_CONFIGS" ]; then
    log "ERROR: CONFIG_IDX=$CONFIG_IDX out of range (only $NUM_CONFIGS configs defined)"
    log "Expected array size: $((NUM_CONFIGS * NUM_CHUNKS)) (${NUM_CONFIGS} configs x ${NUM_CHUNKS} chunks)"
    exit 1
fi

CURRICULUM_CONFIG="${CONFIGS[$CONFIG_IDX]}"

# --- Prerequisite Check ---
if [ ! -f "$CURRICULUM_CONFIG" ]; then
    log "ERROR: Config file not found: $CURRICULUM_CONFIG"
    exit 1
fi

log "Config [$CONFIG_IDX]: $CURRICULUM_CONFIG"

# --- Set thread counts from config ---
NUM_PROCS=$(python3 -c "import yaml; print(yaml.safe_load(open('$CURRICULUM_CONFIG'))['number_of_procs'])")
CORES_PER_MODEL=$((SLURM_CPUS_PER_TASK / NUM_PROCS))
if [ $CORES_PER_MODEL -lt 1 ]; then
    CORES_PER_MODEL=1
fi

export OMP_NUM_THREADS=$CORES_PER_MODEL
export MKL_NUM_THREADS=$CORES_PER_MODEL
log "Allocating $CORES_PER_MODEL cores per worker ($NUM_PROCS workers, $SLURM_CPUS_PER_TASK CPUs total)"

# --- Chunking Configuration ---
CHUNK_ARGS=""
if [ "$NUM_CHUNKS" -gt 1 ]; then
    EXPERIMENT_NAME=$(python3 -c "import yaml; print(yaml.safe_load(open('$CURRICULUM_CONFIG'))['experiment_name'])")
    JOB_STAMP=${SLURM_ARRAY_JOB_ID:-${SLURM_JOB_ID:-$(date +%Y%m%d_%H%M%S)}}
    OUTPUT_DIR="${OUTPUT_BASE:-/tmp/picc-llm-results}/${EXPERIMENT_NAME}_${JOB_STAMP}"
    CHUNK_ARGS="--num-chunks $NUM_CHUNKS --chunk-index $CHUNK_IDX --output-dir $OUTPUT_DIR"
    log "Chunked mode: chunk $((CHUNK_IDX + 1))/$NUM_CHUNKS -> $OUTPUT_DIR"
fi

# --- Run Curriculum Training ---
log "Running curriculum training..."

TMPOUT=$(mktemp)
set +e
python3 -u -m picc_llm.utils.train_curriculum --config "$CURRICULUM_CONFIG" $CHUNK_ARGS 2>&1 | tee "$TMPOUT"
TRAINING_EXIT_CODE=${PIPESTATUS[0]}
set -e

if [ $TRAINING_EXIT_CODE -ne 0 ]; then
    log "ERROR: train_curriculum failed with exit code $TRAINING_EXIT_CODE."
    rm -f "$TMPOUT"
    exit 1
fi

# Extract output directory from training output
if [ -z "$OUTPUT_DIR" ]; then
    OUTPUT_DIR=$(grep "Results saved to:" "$TMPOUT" | tail -1 | awk -F': ' '{print $2}' | xargs)
fi
rm -f "$TMPOUT"

if [ -z "$OUTPUT_DIR" ]; then
    log "ERROR: Could not find output directory from training."
    exit 1
fi

log "Training complete. Results in: $OUTPUT_DIR"

# --- Check for Aggregated Output ---
AGGREGATED_FILES=$(find "$OUTPUT_DIR" -name "*_aggregated.npz" 2>/dev/null || true)

if [ -n "$AGGREGATED_FILES" ]; then
    log "Found aggregated results:"
    echo "$AGGREGATED_FILES" | while read -r file; do
        echo "  - $file"
    done
else
    log "No aggregated files found (runs_per_session may be 1, or chunked mode requires separate aggregation)"
fi

# --- Pipeline Complete ---
log "PIPELINE COMPLETE"
log "Output directory: $OUTPUT_DIR"

echo "Finished at: $(date)"

# ==============================================================================
# CHUNKED AGGREGATION
#
# In chunked mode each task writes NPZ files into the shared OUTPUT_DIR.
# After ALL array tasks finish, aggregate as a dependent job:
#
#   JOB_ID=$(RUN_CONFIG=/path/to/run_config.sh sbatch --parsable --array=0-5 slurm_pipeline.sh)
#   sbatch --dependency=afterok:$JOB_ID aggregate_job.sh
#
# Where aggregate_job.sh runs:
#   python3 -m picc_llm.utils.aggregate $OUTPUT_DIR --suffix data
# ==============================================================================
