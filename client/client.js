REGNUMLAB.addEvent("update", update)

//const box1 = REGNUMLAB.scene.createBox("box", new THREE.Vector3(0.3, 0.3, 0.3), 0x00FF00);
const box2 = REGNUMLAB.scene.createBox("box", new THREE.Vector3(0.3, 0.3, 0.3), 0x00FF00);
box2.position.x = 1;


const dotProduct = box1.position.dot(box2.position);
console.log(dotProduct);

function update(deltaTime)
{
    rotateAround(box2, new THREE.Vector3, new THREE.Vector3(0,1,1), true);
}