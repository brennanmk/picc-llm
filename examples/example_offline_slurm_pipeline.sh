#!/bin/bash

# --- Slurm Configuration ---
#SBATCH --job-name=picc-rl-pipeline
#SBATCH --output=logs/picc-rl-pipeline_%j.log  # Using %j for Job ID
#SBATCH --error=logs/picc-rl-pipeline_%j.log   # Using %j for Job ID
#SBATCH --time=5:00:00                     
#SBATCH --ntasks=1
#SBATCH --partition=batch
#SBATCH --cpus-per-task=32                 
#SBATCH --mem=32G

echo "Job ID: $SLURM_JOB_ID"
echo "Running on node: $(hostname)"
echo "Started at: $(date)"

# --- Environment Setup ---
mkdir -p logs # Ensure log directory exists

module load miniforge/24.11.2-py312
source activate picc

# Set thread counts based on your example script.
# This is likely for the 'augment_training' step which runs in parallel.
CORES_PER_MODEL=$((SLURM_CPUS_PER_TASK / 10))
if [ $CORES_PER_MODEL -lt 1 ]; then
    CORES_PER_MODEL=1
fi

export OMP_NUM_THREADS=$CORES_PER_MODEL
export MKL_NUM_THREADS=$CORES_PER_MODEL
export PYTHONUNBUFFERED=1

# --- Project Setup ---
# Go to the project root, as in your example
cd /cluster/tufts/sinapovlab/bmille12/picc-rl

# Add project root to PYTHONPATH so 'import picc_rl' works
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Exit immediately if any command fails
set -e
set -o pipefail

# --- Configuration (Paths relative to project root) ---
OFFLINE_CONFIG="/cluster/tufts/sinapovlab/bmille12/picc_tests/offline_config_${TASK_ID}.yaml"
AUGMENT_CONFIG_TEMPLATE="/cluster/tufts/sinapovlab/bmille12/picc_tests/augment_config_template_${TASK_ID}.yaml"
AUGMENT_CONFIG_FINAL="/cluster/tufts/sinapovlab/bmille12/picc_tests/augment_config_generated_${TASK_ID}.yaml"
FINAL_AVERAGE_NPZ="/cluster/tufts/sinapovlab/bmille12/picc_tests/final_averaged_run_${TASK_ID}.npz"

# --- Helper Function ---
log() {
  echo "--- [SLURM PIPELINE] $1 ---"
}

# --- Prerequisite Check ---
if ! command -v yq &> /dev/null; then
    log "ERROR: 'yq' is not installed or loaded."
    log "Please ensure 'yq' is in your path (e.g., 'module load yq')"
    exit 1
fi

if [ ! -f "$OFFLINE_CONFIG" ]; then
    log "ERROR: Input config file not found: $OFFLINE_CONFIG"
    exit 1
fi
log "Using input config: $OFFLINE_CONFIG"


# --- Run Offline Training ---
log "Running offline training..."
OFFLINE_OUTPUT=$(python3 -u -m picc_rl.utils.run_offline_training --config "$OFFLINE_CONFIG" 2>&1)
echo "$OFFLINE_OUTPUT"

JSON_PATH=$(echo "$OFFLINE_OUTPUT" | grep "Consolidated JSON results saved to:" | awk -F': ' '{print $2}' | xargs)

if [ -z "$JSON_PATH" ]; then
    log "ERROR: Could not find JSON output path from offline training."
    exit 1
fi
log "Offline training complete. JSON at: $JSON_PATH"


# --- Generate Config & Run Augment Training ---
log "Generating config for augment training..."
yq ".experiment_results_paths = [\"$JSON_PATH\"]" \
   "$AUGMENT_CONFIG_TEMPLATE" > "$AUGMENT_CONFIG_FINAL"

log "Running augment training (this may take a while)..."
AUGMENT_OUTPUT=$(python3 -u -m picc_rl.utils.augment_training --config "$AUGMENT_CONFIG_FINAL" 2>&1)
echo "$AUGMENT_OUTPUT"

AUGMENT_DIR=$(echo "$AUGMENT_OUTPUT" | grep "Results saved in" | awk -F' in ' '{print $2}' | xargs)

if [ -z "$AUGMENT_DIR" ]; then
    log "ERROR: Could not find output directory from augment training."
    exit 1
fi
log "Augment training complete. NPZ files in: $AUGMENT_DIR"


# --- Run NPZ Averaging ---
log "Running NPZ averaging..."
python3 -u -m picc_rl.utils.average_npz_results \
    --inputs "$AUGMENT_DIR"/*.npz \
    --output "$FINAL_AVERAGE_NPZ"

log "--- PIPELINE COMPLETE ---"
log "Final averaged data saved to: $FINAL_AVERAGE_NPZ"

echo "Finished at: $(date)"
