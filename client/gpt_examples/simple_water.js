REGNUMLAB.addEvent("update", update)

let spheres = [];
let sphereGridSize = 25;  // Number of spheres in a row/column
let waveSpeed = 0.01;
let waveSize = 0.5;

for (let i = 0; i < sphereGridSize; i++) {
    for (let j = 0; j < sphereGridSize; j++) {
        const sphere = REGNUMLAB.scene.createSphere("water", new THREE.Vector3(0.1, 16, 16), 0x0077ff);;
        sphere.position.set(i - sphereGridSize / 2, j - sphereGridSize / 2, 0);  // Set on the XY plane (X, Y, Z)
        spheres.push(sphere);
    }
}

function update(deltaTime)
{
    let time = performance.now() * waveSpeed;

    // Update each sphere's position to simulate wave effect in the XY plane
    spheres.forEach((sphere, index) => {
        const row = Math.floor(index / sphereGridSize);
        const col = index % sphereGridSize;
        const distance = Math.sqrt(row * row + col * col);

        // Simulate a ripple using sine waves (affect Z position now)
        sphere.position.z = Math.sin(distance + time) * waveSize;
    });
}