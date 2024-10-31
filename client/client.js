/*

    REGNUM LAB CLIENT

    const sphere = REGNUMLAB.scene.createSphere("water", new THREE.Vector3(0.1, 16, 16), 0x0077ff);

*/

REGNUMLAB.addEvent("update", update)

const box = REGNUMLAB.scene.createBox("box", new THREE.Vector3(0.5, 0.5, 0.5), 0x0077ff);

function update(deltaTime)
{
    box.position.x = 50 * Math.sin(deltaTime*50) * deltaTime;
}