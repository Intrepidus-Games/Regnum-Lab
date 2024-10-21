// CONSOLE
// resizing
const consoleElement = document.getElementById("console");
const consoleCursorArea = consoleElement.getElementsByTagName("cursorarea")[0];
const scene = document.getElementById("scene");

let originalHeight = consoleElement.offsetHeight;

let isDragging = false;
let startY;
let startHeight;

function updateScrollBar()
{
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

consoleCursorArea.addEventListener("mousedown", (e) => {
    isDragging = true;
    startY = e.clientY; // Current mouse Y position
    startHeight = consoleElement.offsetHeight; // Current height of the console
    e.preventDefault(); // Prevent text selection
});
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // Calculate the new height based on mouse movement
        
        const newHeight = startHeight - (e.clientY - startY);
        //console.log(originalHeight);
        // Set a minimum height to prevent collapsing
        if (newHeight > originalHeight && newHeight < window.innerHeight) { // Set minimum height to 100px
            consoleElement.style.height = `${newHeight}px`;
        }
        else if (newHeight < originalHeight) {
            consoleElement.style.height = `${originalHeight}px`;
        }
        else if (newHeight > window.innerHeight)
        {
            consoleElement.style.height = `${window.innerHeight}px`;
        }

        scene.style.height = `calc(100% - ${consoleElement.style.height})`

        // now redraw scene to match new size
        REGNUMLAB.scene.onWindowResize()
        updateScrollBar()
    }
});
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// LOGGING
const consoleDiv = document.getElementById('console-dump');
    
// Store the original console methods
const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    custom: 0
};

function logWithStyle(message, type) {
    const log = document.createElement('p');
    
    switch (type) {
        case originalConsole.log:
            log.style.color = `var(--console-log)`
            break;
        case originalConsole.warn:
            log.style.color = `var(--console-warn)`
            break;
        case originalConsole.error:
            log.style.color = `var(--console-error)`
            break;
        case originalConsole.custom:
            log.style.color = `var(--console-custom)`
            break;
        default:
            styles = 'color: black;';
    }

    if (typeof message === "object" && !Array.isArray(message) && message != null)
    {
        let isFirst = true;
        let items = ""
        for (const [key, value] of Object.entries(message)) {
            if (isFirst)
            {
                isFirst = false;
                items += `${key}: ${value}`;
            } else { items += `, ${key}: ${value}`; }
            
        }
        log.innerHTML = `{${items}}`;
    }
    else
    {
        log.innerHTML = message;
    }
    consoleDiv.appendChild(log);
    updateScrollBar();
}

// Function to capture console messages
function captureConsole() {
    console.log = function (message) {
        logWithStyle(message, originalConsole.log);
        originalConsole.log.apply(console, arguments); // Call original console.log
    };

    console.warn = function (message) {
        logWithStyle(message, originalConsole.warn);
        originalConsole.warn.apply(console, arguments); // Call original console.warn
    };

    console.error = function (message) {
        logWithStyle(message, originalConsole.error);
        //originalConsole.error.apply(console, arguments); // Call original console.error
    };

    window.onerror = function(message, source, lineno, colno, error) {
        logWithStyle(`${message}  |  ${source}:${lineno}:${colno}`, originalConsole.error);
    };
}

// Start capturing console messages
captureConsole();

logWithStyle(
`
Welcome to Regnum Lab.<br>
Real time game engine viewer, prototype all your game math in one stop.
`, originalConsole.custom)