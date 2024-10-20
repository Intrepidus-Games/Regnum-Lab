REGNUMLAB.addEvent("update", update)

const boxes = 50
var list = [];

const box1 = REGNUMLAB.scene.createBox();
const box2 = REGNUMLAB.scene.createBox("box", new THREE.Vector3(.3, .3, .3), 0xFF0000);
box2.position.z = 1;
box2.position.x = 2;

for (let i=0; i<boxes; i++)
{
    const box = REGNUMLAB.scene.createBox("box", new THREE.Vector3(.3, .3, .3), 0xFF0000);
    list.push(box);
    box.position.z = 1 + Math.sin(performance.now())/50;
    box.position.x = 2;
    rotateAround(box, box1.position, new THREE.Vector3(0,0,i*50), false);
}

function update(deltaTime)
{
    box2.position.z += Math.sin(performance.now() * 1/120)/50;
    box1.rotation.z += Math.sin(0.5*deltaTime);
    //console.error("hi");
    rotateAround(box2, box1.position, new THREE.Vector3(0,0,1), false);
    for (let i=0; i<boxes; i++)
    {
        const box = list[i];
        rotateAround(box, box1.position, new THREE.Vector3(0,0,1), false);
        box.position.z += Math.sin(performance.now()  * 1/120)/50;
    }
}