# PICC-LLM

## Introduction

PICC-RL is a project exploring interactive curriculum learning with an LLM. This codebase contains a web application aimed at making interactive curriculum learning studies easy to set up and run.

---

## Getting Started

First, set up your project by following the instructions in the **Configuration** section below.

Once configured, there are two primary ways to use this project:
1.  **Run the Web Application** using Docker Compose (recommended) or a manual Python setup.
2.  **Run Experiments** on your local machine or a Slurm cluster.

See the relevant sections below for detailed instructions.

---

## Configuration

Configuration is handled in two layers:
1.  **Environment Variables (`.env`)**: For secrets, database credentials, resource limits, and deployment-specific flags.
2.  **Application Config (`config.py`)**: For stable application settings like survey content, LLM prompts, and training hyperparameters.

### 1. Environment Variables (.env)

Sensitive data and environment-specific settings are managed via `.env` files. We provide templates in the `examples/` directory.

#### For Docker Users
1.  **Main Config:** Copy `examples/.env.docker.example` to `deploy/.env.docker`.
2.  **Resource Limits:** Create a `docker/.env` file (see `examples/.env.example`) to set container limits.

**Key Environment Variables:**

| Variable | Description | Example |
| :--- | :--- | :--- |
| `APP_DEBUG_MODE` | If `true`, runs in debug mode (skips LLM generation, offline training). | `false` |
| `SECRET_KEY` | Flask session secret. | `super-secret-key` |
| `MYSQL_HOST` | Database hostname. | `db` (docker) or `localhost` |
| `MYSQL_PASSWORD` | Database password. | `password` |
| `OLLAMA_HOST` | URL for the LLM service. | `http://ollama:11434` |
| `OLLAMA_MODEL` | LLM model to use. | `llama3.1` |
| `CPU_SET` | (Docker Only) CPU cores assigned to containers. | `0-8` |
| `MEM_LIMIT` | (Docker Only) Memory limit for containers. | `32g` |

#### For Manual Setup
Copy `examples/.env.local.example` to `.env.local` in the project root and fill in the values.

### 2. Application Configuration (config.py)
Stable settings that rarely change across deployments are defined in `picc_rl/app/config.py`.

You can modify this file to change:
* **Survey Content:** Edit the `QUESTIONNAIRES` dictionary to modify questions or HTML content.
* **LLM Prompts:** Adjust `LLM_SETTINGS` to tune the system prompts or chain-of-thought pipelines.
* **Training Hyperparameters:** Modify `TRAINING_CONFIG` (e.g., learning rates, gamma, updates).
* **Study Order:** Change `ORDER` to rearrange the sequence of views (e.g., swapping pre/post questionnaires).

---

## Running the Web Application

### Running with Docker Compose (Recommended)
The Docker environment is the recommended way to run the web application for demonstration or production use.

1.  **Configure your environment** as described above.
2.  **Start the services** from the root of the project.
    ```bash
    docker compose up -d
    ```
3.  Once started, navigate to `http://localhost:8000` in your web browser.

#### Nginx Configuration & Maintenance Modes
The Docker setup includes an Nginx proxy that serves the application. You can manually trigger "Maintenance" or "Study Complete" pages by creating specific files in the `deploy/nginx/static/` directory. This is useful for gracefully shutting down the study without crashing the server.

* **Turn ON Maintenance Mode** (503 Page):
    `touch deploy/nginx/static/maintenance_on`
* **Turn OFF Maintenance Mode:**
    `rm deploy/nginx/static/maintenance_on`
* **End the Study** (Study Complete Page):
    `touch deploy/nginx/static/complete_on`
* **Restart the Study:**
    `rm deploy/nginx/static/complete_on`

### Manual Setup for Web App & Experiments
A manual setup is **required** if you plan to run experiments locally or develop on the codebase.

1.  **Configuration**: Set up your `.env.local` file.
2.  **Environment Setup**:
    * **Nix**: Use `direnv allow` (if installed) or `nix-shell`.
    * **Conda**:
        ```bash
        conda env create -f environment.yml
        conda activate picc
        pip install -r requirements.txt
        ```
    * **venv**:
        ```bash
        python3 -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
        ```
3.  **Run the App**:
    ```bash
    python3 -m flask --app picc_rl/app run
    ```

---

## Running Experiments

You can use this codebase to run automated RL experiments, using the same AI Architect logic as the web app.

### On a Local Machine
To run a single experiment or baseline training run:

1.  Ensure your environment is active.
2.  Run the training script with a configuration file:
    ```bash
    python3 -m picc_rl.utils.train_ppo --config examples/automated_curriculum.yaml
    ```

### On a Slurm Cluster
For large-scale data collection:

1.  **Copy the example script**:
    ```bash
    cp examples/example_job.slurm submit_my_job.slurm
    ```
2.  **Edit the script**: Update `#SBATCH` directives (partition, account, time) and ensure the command points to your config file.
3.  **Submit**:
    ```bash
    sbatch submit_my_job.slurm
    ```

---
*This README.md was written with help from Google's Gemini.*
