#!/bin/bash

#SBATCH --job-name=picc-rl-array
#SBATCH --output=logs/picc-rl_%A_%a.log
#SBATCH --error=logs/picc-rl_%A_%a.log
#SBATCH --time=1:30:00
#SBATCH --ntasks=1
#SBATCH --partition=batch
#SBATCH --cpus-per-task=32
#SBATCH --mem=32G
#SBATCH --array=1

echo "Job Array ID: $SLURM_ARRAY_JOB_ID, Task ID: $SLURM_ARRAY_TASK_ID"
echo "Running on node: $(hostname)"
echo "Script location: ${SCRIPT_DIR}"
echo "Started at: $(date)"

mkdir -p "${SCRIPT_DIR}/logs"

module load miniforge/24.11.2-py312

source activate picc

CORES_PER_MODEL=$((SLURM_CPUS_PER_TASK / 10))

export OMP_NUM_THREADS=$CORES_PER_MODEL
export MKL_NUM_THREADS=$CORES_PER_MODEL

cd ~/picc-rl

CONFIG_FILE="/cluster/home/bmille12/tests/${SLURM_ARRAY_TASK_ID}.yaml"
echo "Using configuration file: ${CONFIG_FILE}"

python3 -m picc_llm.utils.train_ppo --config "${CONFIG_FILE}"

echo "Finished at: $(date)"
