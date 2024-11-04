/*
    REGNUM LAB CLIENT
    Basic SpaceShip | An Input Example
*/

// RegnumLab Defaults
REGNUMLAB.addEvent("update", update)
REGNUMLAB.scene.defaultCameraMovement = false;


// Settings
//const Spring = new Vector2Spring(
//    70, // Stiffness
//    15 // Damping
//);
const shapeSize = 0.05;

const strafeSpeed = 1;
const throttleSpeed = 1;
const thrustSpeed = 1;


const pitchSpeed = 1;
const yawSpeed = 1;
const rollSpeed = 1;

const gravity = 9.807;

const velocityClamp = new THREE.Vector3(10,10,10);
const rotationVelocityClamp = new THREE.Vector3(10,10,10);

const box = REGNUMLAB.scene.createPrimative("box", Shapes.Box,new THREE.Vector3().addScalar(shapeSize), 0x0077ff);

REGNUMLAB.scene.weldCameraTo(box);
REGNUMLAB.scene.camera.rotation.set(deg2rad(90),0,0);
REGNUMLAB.scene.camera.position.set(0,-1,0);

// Values
//let currentThrust = 0;

let currentVelocity = new THREE.Vector3();
let currentRotationVelocity = new THREE.Vector3();

// Input Mapping
// Create our thrusters action & link our thrustChanged function to it
const thrustersActions = new InputAction(InputTriggerMethod.None, InputValueType.Float, [
    new Input("space", {negate: false}),
    new Input("control", {negate: true})
], null);
const throttleActions = new InputAction(InputTriggerMethod.None, InputValueType.Float, [
    new Input("w", {negate: false}),
    new Input("s", {negate: true})
], null);
const strafeActions = new InputAction(InputTriggerMethod.None, InputValueType.Float, [
    new Input("d", {negate: false}),
    new Input("a", {negate: true})
], null);

const rollActions = new InputAction(InputTriggerMethod.None, InputValueType.Float, [
    new Input("e", {negate: false}),
    new Input("q", {negate: true})
], null);
const pitchActions = new InputAction(InputTriggerMethod.None, InputValueType.Float, [
    new Input("arrowdown", {negate: false}),
    new Input("arrowup", {negate: true})
], null);
const yawActions = new InputAction(InputTriggerMethod.None, InputValueType.Float, [
    new Input("arrowleft", {negate: false}),
    new Input("arrowright", {negate: true})
], null);
const spaceShipInputMapping = new InputMapping([
    thrustersActions, 
    throttleActions, 
    strafeActions, 
    rollActions, 
    pitchActions,
    yawActions
]); // Create the input mapping & add our actions
REGNUMLAB.scene.inputManager.addInputMapping(spaceShipInputMapping); // Add Mapping to the regnum scene



function update(deltaTime)
{
    //if (thrustersActions.isBeingTriggered())
    //{
    //    //currentThrust += thrustersActions.getValue() * thrustSpeed;
    //}

    // Thrust, throttle, strafe
    currentVelocity.add(new THREE.Vector3(
        (strafeActions.getValue() * strafeSpeed * deltaTime) / 500,
        (throttleActions.getValue() * throttleSpeed * deltaTime) / 500,
        (thrustersActions.getValue() * thrustSpeed * deltaTime) / 500
    ));
    currentVelocity = clampVector3(currentVelocity, -velocityClamp, velocityClamp);
    //console.log(currentVelocity);
    // Roll
    currentRotationVelocity.add(new THREE.Vector3(
        (pitchActions.getValue() * pitchSpeed * deltaTime) / 500,
        (rollActions.getValue() * rollSpeed * deltaTime) / 500,
        (yawActions.getValue() * yawSpeed * deltaTime) / 500,
    ));
    currentRotationVelocity = clampVector3(currentRotationVelocity, -rotationVelocityClamp, rotationVelocityClamp);

    currentVelocity.multiplyScalar(.9999);
    currentRotationVelocity.multiplyScalar(.9999);

    //box.position.add(currentVelocity);
    box.translateX(currentVelocity.x);
    box.translateY(currentVelocity.y);
    box.translateZ(currentVelocity.z);
    box.rotation.x += currentRotationVelocity.x;
    box.rotation.y += currentRotationVelocity.y;
    box.rotation.z += currentRotationVelocity.z;
    

    //if (currentVelocity.length() > 0 || currentVelocity.length() < 0) {console.log(currentVelocity);}
}