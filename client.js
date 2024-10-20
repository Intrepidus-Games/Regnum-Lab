REGNUMLAB.addEvent("update", update)

const box1 = REGNUMLAB.scene.createBox();
const box2 = REGNUMLAB.scene.createBox("box", new THREE.Vector3(.3, .3, .3), 0xFF0000);
box2.position.z = 2;
box2.position.x = 2;
function update(deltaTime)
{
    //box.position.z += Math.sin(1*deltaTime);
    //box1.rotation.z += Math.sin(5*deltaTime);
    //console.error("hi");
    rotateAround(box2, box1.position, new THREE.Vector3(0,0,1));
}