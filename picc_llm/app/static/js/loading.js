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
        const progress = data.current_progress || 0;
        if (progressText) {
            progressText.textContent = progress > 0 ? `${progress}%` : 'Working...';
        }

        if (data.in_progress) {
            setTimeout(check_progress, 2500);
        } else {
            if (progressText) {
                progressText.textContent = 'Complete';
            }
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
