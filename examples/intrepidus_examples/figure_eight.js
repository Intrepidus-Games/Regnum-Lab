/*

    REGNUM LAB CLIENT

    const sphere = REGNUMLAB.scene.createSphere("water", new THREE.Vector3(0.1, 16, 16), 0x0077ff);

*/

REGNUMLAB.addEvent("update", update)

const speed = 30;
const radius = 1;
const width = 2;

const shapeSize = 0.3;

const box = REGNUMLAB.scene.createBox("box", new THREE.Vector3(shapeSize, shapeSize, shapeSize), 0x0077ff);

function update(deltaTime)
{
    time = performance.now()/1000;
    box.position.x = radius * Math.sin(time*speed/2);
    box.position.z = radius * Math.sin(time*speed);
}