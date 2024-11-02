/*

    REGNUM LAB CLIENT

    const sphere = REGNUMLAB.scene.createSphere("water", new THREE.Vector3(0.1, 16, 16), 0x0077ff);

*/

REGNUMLAB.addEvent("update", update)

const Spring = new Vector2Spring(100, 0.5);

const speed = 30;
const radius = 1;
const width = 2;
const shapeSize = 0.25;

const box = REGNUMLAB.scene.createPrimative("box", Shapes.Box,new THREE.Vector3(shapeSize, shapeSize, shapeSize), 0x0077ff);

function update(deltaTime)
{
    time = performance.now()/1000;

    if (time < 0.5)
    {
        Spring.push(new THREE.Vector2(
            radius * Math.sin(time*speed/2),
            radius * Math.sin(time*speed)
        ));
    }
    else
    {
        Spring.push(new THREE.Vector2());
    }

    Spring.update(deltaTime);

    const springPosition = Spring.getPosition();
    box.position.x = springPosition.x;
    box.position.z = springPosition.y;
}