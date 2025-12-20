#!/bin/sh

#
# run_full_pipeline.sh
#
# Orchestrates a three-stage reinforcement learning data processing pipeline:
#
#   1. OFFLINE TRAINING:
#      Runs 'run_offline_training.py' using an initial YAML config. This
#      outputs a consolidated 'experiment_results.json' file.
#
#   2. AUGMENT TRAINING:
#      Dynamically injects the path of the JSON file from Step 1 into a
#      template 'augment_config.yaml' using 'yq'. This script then
#      saves the results as multiple per-user '.npz' files.
#
#   3. AVERAGE RESULTS:
#      Feeds all the '.npz' files from Step 2 into 'average_npz_files.py',
#      saving a final 'averaged_run.npz' file.
#
# REQUIREMENTS:
#   - 'yq': This script requires 'yq' to dynamically modify YAML configs.
#     (Install via: brew install yq / sudo apt-get install yq)
#
# USAGE:
#   Place this script in your 'experiments' or 'scripts' directory, one
#   level below the project root.
#
#   From that directory, simply run:
#   ./run_full_pipeline.sh
#
#   All paths in the "Configuration" section below are relative to the
#   project root.
#
# Primarily written by Google's Gemini 2.5 pro
#

# Exit immediately if any command fails
set -e
# Exit if any command in a pipeline fails
set -o pipefail

export PYTHONUNBUFFERED=1

# --- Configuration ---
# Paths are now relative to the project root (one directory up)
PROJECT_ROOT=".."
OFFLINE_CONFIG="experiments/offline_config.yaml"
AUGMENT_CONFIG_TEMPLATE="experiments/augment_config.yaml"
AUGMENT_CONFIG_FINAL="experiments/augment_config_generated.yaml"
FINAL_AVERAGE_NPZ="final_averaged_run.npz"

# --- Helper Function ---
log() {
  echo "--- [PIPELINE] $1 ---"
}

# --- Check for 'yq' (tool for editing YAML in bash) ---
if ! command -v yq &> /dev/null; then
    log "ERROR: 'yq' is not installed."
    log "Please install it to edit YAML configs (e.g., 'brew install yq' or 'sudo apt-get install yq')"
    exit 1
fi

# --- Run Offline Training ---
log "Running offline training..."

OFFLINE_OUTPUT=$(PYTHONPATH=$PYTHONPATH:$PROJECT_ROOT python3 -u -m picc_rl.utils.run_offline_training --config "$OFFLINE_CONFIG" 2>&1 | tee /dev/tty)

# Extract the JSON path from the output
JSON_PATH=$(echo "$OFFLINE_OUTPUT" | grep "Consolidated JSON results saved to:" | awk -F': ' '{print $2}' | xargs)

if [ -z "$JSON_PATH" ]; then
    log "ERROR: Could not find JSON output path from offline training."
    exit 1
fi

log "Offline training complete. JSON at: $JSON_PATH"

# --- Generate Config & Run Augment Training ---
log "Generating config for augment training..."

# Use 'yq' to add the JSON path into the YAML template
# Note the syntax:
# - 'e' is for "evaluate" (modify in-place)
# - We use shell-style double quotes for the expression
# - We pass the shell variable $JSON_PATH directly into the expression
yq e ".experiment_results_paths = [\"$JSON_PATH\"]" \
   "$AUGMENT_CONFIG_TEMPLATE" > "$AUGMENT_CONFIG_FINAL"

log "Running augment training..."

AUGMENT_OUTPUT=$(PYTHONPATH=$PYTHONPATH:$PROJECT_ROOT python3 -u -m picc_rl.utils.augment_training --config "$AUGMENT_CONFIG_FINAL" 2>&1 | tee /dev/tty)

# Extract the output directory path
AUGMENT_DIR=$(echo "$AUGMENT_OUTPUT" | grep "Results saved in" | awk -F' in ' '{print $2}' | xargs)

if [ -z "$AUGMENT_DIR" ]; then
    log "ERROR: Could not find output directory from augment training."
    exit 1
fi
log "Augment training complete. NPZ files in: $AUGMENT_DIR"


# --- Run NPZ Averaging ---
log "Running NPZ averaging..."

PYTHONPATH=$PYTHONPATH:$PROJECT_ROOT python3 -u -m picc_rl.utils.average_npz_files \
    --inputs "$AUGMENT_DIR"/*.npz \
    --output "$FINAL_AVERAGE_NPZ"

log "--- PIPELINE COMPLETE ---"
log "Final averaged data saved to: $FINAL_AVERAGE_NPZ"
