#!/bin/bash

#SBATCH --job-name=picc-rl-array
#SBATCH --output=logs/picc-rl_%A_%a.log
#SBATCH --error=logs/picc-rl_%A_%a.log
#SBATCH --time=1:30:00
#SBATCH --ntasks=1
#SBATCH --partition=batch
#SBATCH --cpus-per-task=32
#SBATCH --mem=32G
#SBATCH --gres=gpu:1
#SBATCH --constraint=a100
#SBATCH --array=1

echo "Job Array ID: $SLURM_ARRAY_JOB_ID, Task ID: $SLURM_ARRAY_TASK_ID"
echo "Running on node: $(hostname)"
echo "CUDA Devices visible to job: $CUDA_VISIBLE_DEVICES"
echo "Started at: $(date)"

SCRIPT_DIR=$(pwd) 
mkdir -p "${SCRIPT_DIR}/logs"

module load miniforge/24.11.2-py312
source activate picc

echo "Starting Ollama server in the background..."
ollama serve &
OLLAMA_PID=$!

trap "echo 'Cleaning up Ollama server (PID: $OLLAMA_PID)...'; kill $OLLAMA_PID" EXIT

echo "Waiting for Ollama server to be ready..."
until curl -s http://127.0.0.1:11434 > /dev/null; do
    echo -n "."
    sleep 1
done
echo "Ollama server is ready."

export LLM_MODEL="qwen:7b"
echo "Using LLM Model: $LLM_MODEL"

echo "Pulling the 'qwen' model (if not already present)..."
ollama pull $LLM_MODEL
echo "llm model is ready."

CORES_PER_MODEL=$((SLURM_CPUS_PER_TASK / 10))
export OMP_NUM_THREADS=$CORES_PER_MODEL
export MKL_NUM_THREADS=$CORES_PER_MODEL

cd ~/picc-rl

CONFIG_FILE="/cluster/home/bmille12/tests/${SLURM_ARRAY_TASK_ID}.json"
echo "Using configuration file: ${CONFIG_FILE}"

python3 -m picc_llm.utils.train_ppo_llm --config "${CONFIG_FILE}"

echo "Finished at: $(date)"
