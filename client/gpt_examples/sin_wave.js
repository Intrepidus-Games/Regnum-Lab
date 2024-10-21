REGNUMLAB.addEvent("update", update)

const boxes = 70
var list = [];

const box1 = REGNUMLAB.scene.createBox();

const radius = 2; // Distance from pivot point
const angleStep = (2 * Math.PI) / boxes; // Step angle to evenly space boxes in a circle
const waveFrequency = 0.5; // Controls the frequency of the wave
const waveAmplitude = 2; // Controls the height of the wave
const speed = 0.002; // Speed of the wave movement

for (let i=0; i<boxes; i++)
{
    const box = REGNUMLAB.scene.createBox("box", new THREE.Vector3(.3, .3, .3), 0xFF0000);
    list.push(box);
    // Calculate the angle for each box around the pivot (on the X-Y plane)
    const angle = i * angleStep;

    // Circular X-Y positioning (rotating around the pivot)
    box.position.x = Math.cos(angle) * radius;
    box.position.y = Math.sin(angle) * radius;

    // Sinusoidal Z positioning (wave effect)
    box.position.z = Math.sin(i * 0.5) * 2; // The multiplier controls wave height and frequency
}

function update(deltaTime)
{
    //box2.position.z += Math.sin(performance.now() * 1/120)/50;
    box1.rotation.z += 0.5*deltaTime;
    const time = performance.now() * speed; // Time factor for smooth movement
    //console.error("hi");
    //rotateAround(box2, box1.position, new THREE.Vector3(0,0,1), false);
    for (let i=0; i<boxes; i++)
    {
        const box = list[i];
        //rotateAround(box, box1.position, new THREE.Vector3(0,0,1), false);
       //box.position.z += Math.sin(performance.now() * i * 1/120)/50;

       // Calculate the angle for each box around the pivot (on the X-Y plane)
       const angle = i * (2 * Math.PI / boxes) + time; // Animate the rotation with time

       // Circular X-Y positioning (rotating around the pivot)
       box.position.x = Math.cos(angle) * radius;
       box.position.y = Math.sin(angle) * radius;

       // Sinusoidal Z positioning (wave effect) with time-based animation
       // The time factor introduces motion, creating the snake-like movement
       box.position.z = Math.sin(i * waveFrequency + time) * waveAmplitude;
    }
}