

/* 
  //-------------------------//
  MOVE RELATED
  //-------------------------//
*/
function moveObject(obj, vector = new THREE.Vector3)
{
  obj.position.x = vector.x;
  obj.position.y = vector.y;
  obj.position.z = vector.z;
}
function addVectorPositionObject(obj, vector = new THREE.Vector3)
{
  obj.position.x += vector.x;
  obj.position.y += vector.y;
  obj.position.z += vector.z;
}

/* 
  //-------------------------//
  ROTATION RELATED
  //-------------------------//
*/
function lookAt(look, at)
{
  const direction = new THREE.Vector3();
  at.getWorldPosition(direction);
  look.quaternion.copy(at.quaternion); // Copy the camera's rotation directly
}

function faceTarget(obj, pos) {
  // Calculate direction from camera to target
  const direction = new THREE.Vector3();
  direction.subVectors(pos, obj.position).normalize();
  
  // Calculate the up vector, which we want to maintain as (0, 1, 0) for a standard look
  const up = new THREE.Vector3(0, 1, 0);
  
  // Create a quaternion based on the camera's direction and up vector
  const lookAtQuaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
  
  // Apply the quaternion to the camera
  obj.quaternion.copy(lookAtQuaternion);
}
function deg2rad(degrees)
{
  return degrees * (Math.PI/180);
}
function rad2deg(radians)
{
  return degrees * (180/Math.PI);
}
function rotateObject(obj, vector = new THREE.Vector3)
{
  obj.rotation.x = vector.x;
  obj.rotation.y = vector.y;
  obj.rotation.z = vector.z;
}
function addRotateObject(obj, vector = new THREE.Vector3)
{
  obj.rotation.x += vector.x;
  obj.rotation.y += vector.y;
  obj.rotation.z += vector.z;
}
function vector2rad(vector)
{
  return new THREE.Vector3(deg2rad(vector.x),deg2rad(vector.y),deg2rad(vector.z));
}
/*
function rotateAround(obj, pivotPoint = new THREE.Vector3, rotation = new THREE.Vector3, up)
{
  //const p = obj.position;
  // Calculate the current offset from the pivot point
  const offset = obj.position.clone().sub(pivotPoint);

  // Create a rotation quaternion
  const angle = 0.01; // Rotation speed
  const quaternion = new THREE.Quaternion().setFromAxisAngle(rotation, angle); // Rotate around Y-axis

  // Rotate the offset
  const newOffset = offset.applyQuaternion(quaternion);

  // Update the cube's position
  obj.position.copy(pivotPoint).add(newOffset);
  obj.lookAt(pivotPoint);
  if (up == null) {up = rotation}
  obj.up.set(up.x,up.y,up.z);
}*/
function rotateAround(obj, pivotPoint = new THREE.Vector3(), rotationAxis  = new THREE.Vector3(), rotate=true) {
  // Calculate the current offset from the pivot point (distance between camera and pivot)
  const offset = obj.position.clone().sub(pivotPoint);

  // Calculate the radius (distance) from the pivot point
  const radius = offset.length(); // Keep this constant

  // Create a rotation quaternion
  const angle = 0.01; // Rotation speed
  const quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle); // Rotate around the specified axis

  // Rotate the offset
  const newOffset = offset.applyQuaternion(quaternion);

  // Re-normalize the offset to maintain the original radius (fixed distance from pivot)
  newOffset.setLength(radius);

  // Update the camera's position to maintain the same distance from the pivot
  obj.position.copy(pivotPoint).add(newOffset);

  if (rotate)
  {
    
    // Calculate the direction the camera should face (from camera to pivot)
    const direction = pivotPoint.clone().sub(obj.position).normalize();

    // Create a new quaternion that represents this direction and apply it to the camera
    const up = new THREE.Vector3(0, 0, 1); // Keep the up vector consistent
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1), // Default camera forward direction
        direction // New direction towards the pivot point
    );

    obj.quaternion.copy(targetQuaternion); // Apply the rotation to the camera
    obj.up.copy(up); // Ensure the up vector remains correct
  }
}

/* 
  //-------------------------//
  COLOR RELATED
  //-------------------------//
*/
/*
function rgbaToHex(r, g, b, a) {
  const toHex = (x) => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
  };

  // Convert RGBA to HEX with alpha as a separate hex value
  const hex = `0x${toHex(r)}${toHex(g)}${toHex(b)}`;//${toHex(a * 255)}`; // Alpha as a value from 0-255
  return hex;
}
  */

function rgbaToHex(r, g, b) {
  // Create a new THREE.Color object
  const color = new THREE.Color();

  // Set the color using RGBA values (0-1 range for each channel)
  color.setRGB(r / 255, g / 255, b / 255); // Normalize RGB values to [0, 1]

  // Optionally, you can set the alpha value if needed

  // Convert to HEX
  const hex = color.getHexString(); // This returns the hex representation
  return color;
}


class RegnumSceneObject
{
    constructor(name, object)
    {
        this.name = name
        this.object = object;
        this.lookAtCameraEnabled = false
    }

    lookAtCamera(enabled)
    {
        this.lookAtCameraEnabled = enabled;
    }
}

class RegnumScene
{
    constructor()
    {
        this.scene = null;
        this.renderer = null;
        this.camera = null;

        this.canvas = null;

        // mouse
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };

        this.sceneList = [];

        this.fonts = {
            "NunitoSansRegular": null
        }
    }

    init()
    {
        this.canvas = document.getElementById("scene");

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.canvas.offsetWidth / this.canvas.offsetHeight,
            0.1,
            1000
        );
    
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
    
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);

        this.canvas.appendChild(this.renderer.domElement);

        // Camera Defaults
        this.camera.position.y = -5;
        this.camera.position.z = 5;
        this.camera.rotation.x = deg2rad(45);



        // Create scene defaults

        // Load Fonts
        this.loadFonts(()=>{
            const x = this.createTextLabel("x", "x", 0xff000d, true);
            this.createLine("origin", [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(2,0,0)
            ], 0xff000d);

            const y = this.createTextLabel("y", "y", 0x22ba00, true);
            this.createLine("origin", [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0,2,0)
            ], 0x22ba00);
            const z = this.createTextLabel("z", "z", 0x0800ff, true);
            this.createLine("origin", [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0,0,2)
            ], 0x0800ff);
            x.position.x = 2;
            y.position.y = 2;
            z.position.z = 2;
        });
        
        window.addEventListener("resize", ()=>{this.onWindowResize()})
        this.renderer.domElement.addEventListener("mousedown", ()=>{ this.isDragging=true; })
        this.renderer.domElement.addEventListener("mouseup", ()=>{  this.isDragging=false; })
        this.renderer.domElement.addEventListener("mouseout", ()=>{ this.isDragging=false; })
        this.renderer.domElement.addEventListener("mousemove", (e)=>{ this.mouseMove(e); })
    }

    loadFonts(callback)
    {
        // Create the font loader
        const fontLoader = new THREE.FontLoader();

        // Load the font and store it in the "fonts" object
        fontLoader.load('fonts/Nunito Sans 10pt_Regular.json', (font) => {
            // Assuming 'this.fonts' is an object to store loaded fonts
            this.fonts = this.fonts || {}; // Initialize if not already present
            this.fonts["NunitoSansRegular"] = font;

            console.log("Font loaded:", font);
            if (callback) callback();
        });
    }

    mouseMove(event)
    {
        // If the mouse is being dragged
        if (this.isDragging) {
            const deltaMove = {
                x: event.clientX - this.previousMousePosition.x,
                y: event.clientY - this.previousMousePosition.y
            };
        
            // Example: Rotate the object based on mouse movement
            const rotationSpeed = 1;
            rotateAround(this.camera, new THREE.Vector3(0,0,0), new THREE.Vector3(-deltaMove.y/2, 0,-deltaMove.x/2));
        }
        
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    onWindowResize()
    {

        this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    }

    getNameCountIn(array, string)
    {
        let count = 0;
        for (let obj of array) {
            if (obj.namee.startsWith(string)) {count++;}
        }
        return count;
    }
    
    doSceneUpdate(deltaTime)
    {
        for (let obj of this.sceneList) {
            if (obj.lookAtCameraEnabled)
            {
                //bj.object.lookAt(this.camera.position);
                lookAt(obj.object, this.camera);
            }
        }
    }

    addToScene(name, obj)
    {
        this.scene.add(obj);
        let objName = name;
        if (this.sceneList[name] != null)
        {
            const count = this.getNameCountIn(this.sceneList, name);
            objName = name+(count+1);
            //this.sceneList[name+(count+1)] = obj;
        } 
        const object = new RegnumSceneObject(objName, obj);
        this.sceneList.push(object);
        return object;
        //console.log(this.sceneList);
    }

    createPlane(name="plane", vector=new THREE.Vector2(1,1), color=0x353738)
    {
        const geometry = new THREE.PlaneGeometry( vector.x, vector.y );
        const material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        //plane.rotation.x = 90;

        this.addToScene(name, plane);

        return plane;
    }
    createBox(name="box", vector=new THREE.Vector2(1,1, 1), color=0x484359)
    {
        const geometry = new THREE.BoxGeometry( vector.x, vector.y, vector.z );
        const material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        //plane.rotation.x = 90;

        this.addToScene(name, plane);

        return plane;
    }
    createSphere(name="sphere", vector=new THREE.Vector2(1,1, 1), color=0x484359)
    {
        const geometry = new THREE.SphereGeometry( vector.x, vector.y, vector.z );
        const material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        //plane.rotation.x = 90;

        this.addToScene(name, plane);

        return plane;
    }
    createLine(name="line", points=[new THREE.Vector3( - 10, 0, 0 ), new THREE.Vector3( 0, 10, 0 ), new THREE.Vector3( 10, 0, 0 )], color=0xbddbf0)
    {
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.MeshBasicMaterial( {color: color} );
        const line = new THREE.Line( geometry, material );

        this.addToScene(name, line);
    }
    createTextLabel(name = "text", text = "text", color = 0xbddbf0, lookAtCamera = false) {
        // Create the text geometry after the font is loaded
        const textGeometry = new THREE.TextGeometry(text, {
            font: this.fonts["NunitoSansRegular"],
            size: 0.5,
            height: 0.01,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        });

        // Create the material for the text
        const textMaterial = new THREE.MeshBasicMaterial({ color: color });
        
        // Create the mesh
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Add the text mesh to the scene
        const object = this.addToScene(name, textMesh);
        object.lookAtCamera(lookAtCamera);
        return textMesh;
    }
}

class SignalFloat
{
    constructor()
    {
        this.subscribers = []
    }
    subscribe(caller)
    {
        this.subscribers.push(caller);
    }
    fire(float)
    {
        this.subscribers.forEach((subscriber)=>{
            subscriber(float);
        })
    }
}

class RegnumStats
{
    constructor()
    {
        this.deltaTime = performance.now();
        this.lastUpdate = null;
        this.fps = document.getElementById("regnum-fps");
        this.statUpdateInterval = 0.5;
        this.lastStatUpdate = 0;

        //this.update();
    }

    update()
    {
        const now = performance.now();
        const secNow = now/1000;
        this.deltaTime = (now - this.lastUpdate)/1000;
        this.lastUpdate = now;

        if (secNow - this.lastStatUpdate > this.statUpdateInterval)
        {
            this.lastStatUpdate = secNow;
            this.updateFpsStat();
        }

        return this.deltaTime;
    }

    updateFpsStat()
    {
        this.fps.textContent = `FPS ${Math.round(1/this.deltaTime)}`
    }
}

class RegnumLab
{
    constructor()
    {
        this.events = {
            "update": new SignalFloat()
        }
        this.scene = new RegnumScene();
        this.stats = new RegnumStats();
        this.defaults();
    }

    init()
    {
        this.scene.init();

        //this.scene.createPlane("plane", 5, 5);
        //this.scene.createBox("box", 5, 5);

        //this.scene.createLine();
    }

    animate(deltaTime) 
    {
        this.scene.doSceneUpdate(this.stats.deltaTime);
        this.events["update"].fire(this.stats.deltaTime);
        //this.stats.fps.textContent = "FPS 120";

        //rotateAround(this.scene.camera, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1));

        this.scene.renderer.render(this.scene.scene, this.scene.camera);
        requestAnimationFrame(()=>{ this.animate(this.stats.update()); });
    }

    defaults()
    {
        this.init();
        this.animate();
    }

    addEvent(event, caller)
    {
        if (this.events[event] != null)
        {
            this.events[event].subscribe(caller);
        }
        else
        {
            console.error(`The event: '${event} does not exist.'`);
        }
    }
}

const REGNUMLAB = new RegnumLab();



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