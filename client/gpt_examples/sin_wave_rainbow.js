REGNUMLAB.addEvent("update", update)

const boxes = 100
var list = [];

const radius = 2; // Base distance from the center
const heightAmplitude = 1.5; // Controls how high the sine wave moves up/down
const waveFrequency = 0.2; // Controls how often the wave repeats (frequency)
const spiralFactor = 0.01; // Controls how tight the spiral is
const speed = 0.001; // Speed of the overall movement

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

        // Spiral movement: The angle continuously increases with time
        const angle = i * (Math.PI / boxes) + time * 2; // Spiraling effect
        const spiralRadius = radius + i * spiralFactor; // Expanding spiral radius over time

        // X-Y spiral positioning
        box.position.x = Math.cos(angle) * spiralRadius;
        box.position.y = Math.sin(angle) * spiralRadius;

        // Sinusoidal Z positioning for wave effect
        box.position.z = Math.sin(i * waveFrequency + time * 5) * heightAmplitude;

        // Color change effect (shifting colors over time)
        const colorHue = ((i * 0.03) + (time * 20)) % 1; // Hue changes over time
        const color = new THREE.Color().setHSL(colorHue, 1, 0.5); // Convert to HSL for smooth gradient
        box.material.color.set(color);

        // Make each box face the next box to mimic snake behavior
        if (i < boxes - 1) {
            box.lookAt(list[i + 1].position);
        }
    }
}