/*
 * @file environment.js
 * @description Manages the Curriculum Design Dashboard.
 * Handles form inputs, preview generation requests, submission, and error reporting.
 */

const currentPageName = 'study';
const idleTimeoutInSeconds = 60;
const syncInterval = 1000;
let done = false;
let timerInterval;

// Constants for Enum Values (populated from HTML script tag)
const EDGE_VALUE = ObjectEnum.EDGE ? ObjectEnum.EDGE.toString() : "-1";
const EMPTY_VALUE = ObjectEnum.EMPTY_SPACE ? ObjectEnum.EMPTY_SPACE.toString() : "0";

TimeMe.initialize({
    currentPageName,
    idleTimeoutInSeconds,
});

// =========================================================
// STARTUP LOGIC
// =========================================================
window.onload = function() {
    const isValidConfig = (
        typeof initialConfig !== 'undefined' && 
        initialConfig !== null && 
        !Array.isArray(initialConfig) &&
        initialConfig.hasOwnProperty('width') &&
        initialConfig.hasOwnProperty('objects')
    );

    if (isValidConfig) {
        console.log("Loading AI Configuration:", initialConfig);

        if (initialConfig.width) document.getElementById('conf-width').value = initialConfig.width;
        if (initialConfig.height) document.getElementById('conf-height').value = initialConfig.height;
        
        document.querySelectorAll('.obj-counter').forEach(el => el.value = 0);
        
        for (const [name, count] of Object.entries(initialConfig.objects)) {
            let input = document.querySelector(`.obj-counter[data-name="${name}"]`);
            
            if (!input) input = document.querySelector(`.obj-counter[data-name="${name.toUpperCase()}"]`);
            
            if (input) input.value = count;
        }
        
        requestPreview();
        
        timerInterval = setInterval(syncWithServer, syncInterval);

    } else {
        const errorMsg = "Invalid Configuration State: Backend did not provide valid AI Parameters.";
        const context = { receivedConfig: initialConfig };
        
        console.error(errorMsg, context);
        
        if (typeof client_error_url !== 'undefined') {
            const payload = { message: errorMsg, context: context };
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon(client_error_url, blob);
        }

        alert("A system error occurred while loading the curriculum. We have logged the issue.");
        window.location.href = error_url;
    }
};

/**
 * Collects form data and requests a generated grid from the server.
 */
function requestPreview() {
    const widthInput = document.getElementById('conf-width');
    const heightInput = document.getElementById('conf-height');
    
    let width = parseInt(widthInput.value) || 10;
    let height = parseInt(heightInput.value) || 10;
    
    // Safety Clamps (Matches backend logic)
    if (width < 5) width = 5; if (width > 20) width = 20;
    if (height < 5) height = 5; if (height > 20) height = 20;

    const objects = {};
    document.querySelectorAll('.obj-counter').forEach(input => {
        const count = parseInt(input.value);
        if (count > 0) {
            objects[input.getAttribute('data-name')] = count;
        }
    });

    const payload = { 
        width: width, 
        height: height, 
        objects: objects 
    };

    fetch(preview_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            renderGrid(data.grid);
        } else {
            console.error("Preview Error:", data.message);
            // We don't necessarily crash here, user can try adjusting inputs
        }
    })
    .catch(error => {
        console.error('Network Error during preview:', error);
    });
}

/**
 * Renders the 2D grid array into the preview container.
 * @param {Array<Array<number>>} gridConfig 
 */
function renderGrid(gridConfig) {
    const container = document.getElementById('container');
    container.innerHTML = ''; 

    if (!gridConfig || gridConfig.length === 0) return;

    const rows = gridConfig.length;
    const cols = gridConfig[0].length;

    // Update CSS Grid Layout
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cellVal = gridConfig[i][j].toString();
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('env-cell');
            
            // Render Content (Images)
            if (cellVal !== EMPTY_VALUE) {
                const img = document.createElement('img');
                // Use backend map, fallback to empty string to avoid broken image icons
                img.src = enumToImage[cellVal] || ''; 
                img.classList.add('cell-image');
                cellDiv.appendChild(img);
            }

            // Render Walls/Edges
            if (cellVal === EDGE_VALUE) {
                cellDiv.classList.add('blocked');
            }

            container.appendChild(cellDiv);
        }
    }
}

/**
 * Submits the current parameters to start training.
 * Sends the parameters dictionary, NOT the grid array.
 */
function submitCurriculum() {
    done = true;
    clearInterval(timerInterval);

    const width = parseInt(document.getElementById('conf-width').value);
    const height = parseInt(document.getElementById('conf-height').value);
    
    const objects = {};
    document.querySelectorAll('.obj-counter').forEach(input => {
        const count = parseInt(input.value);
        if (count > 0) {
            objects[input.getAttribute('data-name')] = count;
        }
    });

    const elapsedTime = TimeMe.getTimeOnCurrentPageInSeconds();
    
    // Construct payload matching the backend's expectation
    const data = { 
        elapsed_time: elapsedTime,
        curriculum_params: {
            width: width,
            height: height,
            objects: objects
        },
        timestamp: Date.now()
    };

    // Use sendBeacon for reliability on navigation
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon(environment_url, blob);

    // Redirect to loading screen
    window.location.href = loading_url;
}

// --- Sync & Utility Functions ---

function sendData(data, url = environment_url) {
    data['timestamp'] = Date.now();
    return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (!response.ok) { window.location.href = unsynced_url; }
            return response;
        })
        .catch((error) => { console.error(error); throw error; });
}

function syncWithServer() {
    if (!done) {
        const elapsedTime = TimeMe.getTimeOnCurrentPageInSeconds();
        sendData({ elapsed_time: elapsedTime });
    }
}

window.addEventListener('visibilitychange', () => {
    if (!done) {
        const elapsedTime = TimeMe.getTimeOnCurrentPageInSeconds();
        sendData({ elapsed_time: elapsedTime });
    }
});
