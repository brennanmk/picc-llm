#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

VENV_PATH="/opt/venv"
DEPS_INSTALLED_MARKER="$VENV_PATH/deps_installed.marker"
LOCK_FILE="$VENV_PATH/install.lock"

# Check if the marker file exists.
# If not, acquire a lock and perform the installation, lock is because
# both worker and webapp share a cached venv to prevent redundant
# downloads.
if [ ! -f "$DEPS_INSTALLED_MARKER" ]; then
    echo "Dependencies not yet installed. Acquiring install lock..."
    
    (
        flock -x 200
        
        if [ ! -f "$DEPS_INSTALLED_MARKER" ]; then
            echo "Lock acquired. This container will install dependencies."
            echo "First time setup: Creating virtual environment..."
            
            python3 -m venv "$VENV_PATH"
            
            source "$VENV_PATH/bin/activate"
            echo "Python virtual environment activated for install."

            pip install --upgrade pip
            cd /picc_llm/
            find . -name "requirements.txt" -print0 | while IFS= read -r -d $'\0' file; do
                echo "Found requirements: $file"
                pip install -r "$file"
            done

            echo "Finished installing Python dependencies."
            
            # Create the marker file to signal completion
            touch "$DEPS_INSTALLED_MARKER"
            echo "Created marker file."
        else
            echo "Lock acquired, but dependencies were already installed by another container. Skipping."
        fi
        
    ) 200>"$LOCK_FILE"
    
    echo "Venv setup is complete."
else
    echo "Dependencies already installed. Skipping setup."
fi

echo "Activating virtual environment."
source "$VENV_PATH/bin/activate"

echo "Python virtual environment is active."

cd /picc_llm/
echo "Changed working directory to /picc_llm/"

echo "Waiting for database to come alive..."
until nc -z db 3306; do
  sleep 1
done
echo "Database connected"

DB_LOCK_FILE="$VENV_PATH/db_setup.lock"
(
    flock -x 201
    if [[ "${RESET_DB:-}" =~ ^(true|1|yes)$ ]]; then
      python3 -m picc_llm.app.utils.db_utils --mode 'reset'
    else
      python3 -m picc_llm.app.utils.db_utils --mode 'create_if_empty'
    fi
) 201>"$DB_LOCK_FILE"

echo "Database configured"

exec "$@"
