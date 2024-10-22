REGNUMLAB.addEvent("update", update)

const boxes = 100
var list = [];

const baseRadius = 2; // Base radius for the spiral
const heightStep = 0.05; // How much the height changes per box
const speed = 0.002; // Speed of the overall movement

// Create boxes
for (let i = 0; i < boxes; i++) {
    const box = REGNUMLAB.scene.createBox("box", new THREE.Vector3(0.3, 0.3, 0.3), 0x00FF00);
    list.push(box);
}

function update(deltaTime)
{
    const time = performance.now() * speed; // Time factor for smooth movement

    for (let i = 0; i < boxes; i++) {
        const box = list[i];

        // Spiral movement: The angle and position changes with time
        const angle = i * (Math.PI / 10) + time * 2; // Creates smooth rotation
        const currentRadius = baseRadius + Math.sin(time * 0.5) * 0.5; // Dynamic radius that changes over time

        // X-Y spiral positioning (with rotation effect)
        box.position.x = Math.cos(angle) * currentRadius;
        box.position.y = Math.sin(angle) * currentRadius;

        // Z positioning (corkscrew effect)
        box.position.z = i * heightStep + Math.sin(time + i * 0.1) * 0.5; // Upward corkscrew movement

        // Color change effect (shifting colors over time)
        const colorHue = (i * 0.05 + time * 0.1) % 1; // Smooth hue change over time
        const color = new THREE.Color().setHSL(colorHue, 1, 0.5);
        box.material.color.set(color);

        // Optionally make the boxes face the origin for a dynamic effect
        box.lookAt(new THREE.Vector3(0, 0, i * heightStep));
    }
}