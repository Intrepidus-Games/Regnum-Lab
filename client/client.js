/*

    REGNUM LAB CLIENT

    const sphere = REGNUMLAB.scene.createSphere("water", new THREE.Vector3(0.1, 16, 16), 0x0077ff);

*/

REGNUMLAB.addEvent("update", update)

let tornado = [];
const speed = 45;
const height = 3.2; 
const radius = 1;
const segments = 1000;

function createTornado() {
    for (let i = 0; i < segments; i++) {
        const z = height - Math.random() * height;

        const scaledRadius = radius * (z / height) + (Math.random() * 0.5 - 0.25);
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * scaledRadius;

        const x = (r * Math.cos(angle)) + (Math.random() * 0.1 - 0.05);
        const y = (r * Math.sin(angle)) + (Math.random() * 0.1 - 0.05);

        const grayValue = Math.max(0.3 + Math.random() - 0.7, 0.3);
        const color = new THREE.Color(grayValue, grayValue, grayValue);

        const mesh = Math.random() < 0.5 ? 
            REGNUMLAB.scene.createSphere("sphere", new THREE.Vector3(0.05, 8, 8), color): 
            REGNUMLAB.scene.createBox("box", new THREE.Vector3(0.05, 0.05, 0.05), color);
        mesh.position.set(x, y, z);
        tornado.push(mesh);
    }
}

createTornado();

function update(deltaTime)
{
    tornado.forEach((mesh)=>{
        rotateAround(mesh, new THREE.Vector3, new THREE.Vector3(0,0,Math.random() * speed*100 * deltaTime), false);
    })
}