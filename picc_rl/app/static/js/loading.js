const progressText = document.getElementById('progress-text');

const max_requests = 100;
var requests_count = 0;

function check_progress() {
    // Safety break to prevent infinite loops
    if (max_requests <= requests_count) {
        window.location.href = error_url;
        return; // Stop execution
    }
    requests_count++;

    fetch(loading_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Sending an empty JSON object
    })
    .then(response => {
        if (!response.ok) {
            // Handle server errors (e.g., status 500)
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON response from the server
        return response.json();
    })
    .then(data => {
        // Update the text with the current progress percentage
        const progress = data.current_progress || 0; // Default to 0 if null
        if (progressText) {
             progressText.textContent = `${progress}%`;
        }

        // Check if the process is finished
        if (data.in_progress) {
            // If still in progress, wait and check again
            setTimeout(check_progress, 2500);
        } else {
            // If not in progress, the task is done. Redirect.
            if (progressText) {
                progressText.textContent = 'Complete';
            }
            // A short delay so the user can see the "Complete!" message
            setTimeout(() => {
                window.location.href = environment_url;
            }, 500);
        }
    })
    .catch(error => {
        console.error(`Error during progress check:`, error);
        setTimeout(check_progress, 5000);
    });
}

// Start the first progress check
check_progress();
