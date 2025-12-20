# PICC-RL

## Introduction

PICC-RL is a project exploring interactive curriculum learning. This codebase contains a web application aimed at making interactive curriculum learning studies easy to set up and run.

---

## Getting Started

First, set up your project by following the instructions in the **Configuration** section below.

Once configured, there are two primary ways to use this project:
1.  **Run the Web Application** using Docker Compose (recommended) or a manual Python setup.
2.  **Run Experiments** on your local machine or a Slurm cluster.

See the relevant sections below for detailed instructions.

---

## Configuration

Configuration for this project is handled in two places: environment variables for secrets and deployment-specific settings, and a Python file for stable, application-level settings.

### Environment Variables (.env)
Sensitive data and environment-specific settings (like database credentials and file paths) are managed with `.env` files. We provide examples in the `examples/` directory.

* **For Docker:** Copy `examples/.env.docker.example` to `deploy/.env.docker`, you can also create a `docker/.env` file following `examples/.env.example` to set resource limits.
* **For Manual Setup:** Copy `examples/.env.local.example` to `.env.local` in the project root.

After copying the appropriate file, open it and fill in the required values.

### Application Configuration (config.py)
Less frequently changed settings, such as the order of experiments presented in the web application, are defined directly in the file `picc_rl/app/config.py`. You can edit this file to change these stable, application-level configurations.

---

## Running the Web Application

This repository can serve a web application for interacting with and visualizing the learning process.

### Running with Docker Compose (Recommended)
The Docker environment is the recommended way to run the web application for demonstration or production use.

1.  **Configure your environment** as described in the Configuration section.
2.  **Start the services** from the root of the project.
    ```bash
    docker compose up -d
    ```
3.  Once started, navigate to `http://localhost:8000` in your web browser.

### nginx config
This webapp can also make use of nginx. An example of this, shown
in the `deploy` directory is used to provide two optional pages,
maintenance and complete.

The inclusion of these two pages through nginx is so that even if the
webapp crashes, we can show something to users. We can also easily
mark the study as completed or down for maitenance manually.

When running with Docker, you can put the site into "Maintenance Mode"
or "Study Complete Mode" by creating a file. This is handled by the
Nginx container.

Turn ON Maintenance Mode (Shows a 503 page):
`touch deploy/nginx/static/maintenance_on`

Turn OFF Maintenance Mode:
`rm deploy/nginx/static/maintenance_on`

Turn OFF the Study (Shows the "Study Complete" page):
`touch deploy/nginx/static/complete_on`

Turn ON the Study:
`rm deploy/nginx/static/complete_on`


### Manual Setup for Web App & Experiments
This section contains instructions for installing and running PICC-RL manually. A manual setup is **required** for running experiments locally.

1.  **Configuration**: Set up your `.env.local` file as described in the Configuration section.
2.  **Environment Setup**: You can set up your Python environment using Nix, Conda, or a standard `venv`.
    * **Nix**: If you are running Nix, this repository includes a `shell.nix` file. We recommend using `direnv` to automatically load the environment.
    * **Conda**: If you prefer using Conda, note that this is a two-step process.
        1.  Load your Conda installation. On some shared systems, this is done via a module command (the exact command may vary):
            ```bash
            module load miniforge/24.11.2-py312
            ```
        2.  Create the base environment from the `environment.yml` file. This creates an environment named `picc`.
            ```bash
            conda env create -f environment.yml
            ```
        3.  Activate your new environment:
            ```bash
            conda activate picc
            ```
        4.  Install the remaining dependencies using Pip:
            ```bash
            pip install -r requirements.txt
            ```
    * **venv**: Create and source a virtual environment (`python3 -m venv .venv`, `source .venv/bin/activate`), then install dependencies with `pip install -r requirements.txt`.
3.  **Running the Web Application**: With your environment activated, start the development server.
    ```bash
    python3 -m flask --app picc_rl/app run
    ```

---

## Running Experiments

You can also use this codebase to run machine learning experiments. This requires a **Manual Setup** (see above).

### On a Local Machine
To run a single experiment for testing or debugging, you can directly execute the training script.

1.  Ensure your manual environment is set up and your virtual environment is activated.
2.  Run the training script using the following command, pointing to a configuration file:
    ```bash
    python3 -m picc_rl.utils.train_ppo.py --config path/to/your/config.json
    ```
    An example experiment configuration file is provided at `examples/example_config.json`. We recommend you copy and modify it for your experiments.

### On a Slurm Cluster
For larger experiments, you can use the example Slurm script to submit jobs to an HPC cluster.

1.  **Copy the example script**:
    ```bash
    cp examples/example_job.slurm submit_my_job.slurm
    ```
2.  **Edit the script `submit_my_job.slurm`**: You **must** change the `#SBATCH` directives (like `--account`, `--partition`) to match your cluster's configuration. You should also ensure the `python3 -m ...` command inside the script points to your desired experiment configuration.
3.  **Submit the job** to the Slurm scheduler:
    ```bash
    sbatch submit_my_job.slurm
    ```

---
This `README.md` was written with help from Google's Gemini.
