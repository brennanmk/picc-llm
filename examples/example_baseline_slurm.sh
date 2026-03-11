#!/bin/bash

#SBATCH --job-name=picc-llm-baseline
#SBATCH --output=logs/picc-llm-baseline_%A_%a.log
#SBATCH --error=logs/picc-llm-baseline_%A_%a.log
#SBATCH --time=1:30:00
#SBATCH --ntasks=1
#SBATCH --partition=batch
#SBATCH --cpus-per-task=32
#SBATCH --mem=32G
#SBATCH --array=1

echo "Job Array ID: $SLURM_ARRAY_JOB_ID, Task ID: $SLURM_ARRAY_TASK_ID"
echo "Running on node: $(hostname)"
echo "Started at: $(date)"

SCRIPT_DIR=$(pwd)
mkdir -p "${SCRIPT_DIR}/logs"

module load miniforge/24.11.2-py312

source activate picc

CORES_PER_MODEL=$((SLURM_CPUS_PER_TASK / 10))

export OMP_NUM_THREADS=$CORES_PER_MODEL
export MKL_NUM_THREADS=$CORES_PER_MODEL

cd ~/picc-llm

CONFIG_FILE="configs/baseline/${SLURM_ARRAY_TASK_ID}.yaml"
echo "Using configuration file: ${CONFIG_FILE}"

python3 -m picc_llm.utils.train_baseline --config "${CONFIG_FILE}"

echo "Finished at: $(date)"
