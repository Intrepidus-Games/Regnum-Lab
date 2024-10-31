
/* 
  //-------------------------//
  MOVE RELATED
  //-------------------------//
*/
function moveObject(obj, vector = new THREE.Vector3)
{
  obj.position.x = vector.x;
  obj.position.y = vector.y;
  obj.position.z = vector.z;
}
function addVectorPositionObject(obj, vector = new THREE.Vector3)
{
  obj.position.x += vector.x;
  obj.position.y += vector.y;
  obj.position.z += vector.z;
}

/* 
  //-------------------------//
  ROTATION RELATED
  //-------------------------//
*/
function lookAt(look, at)
{
  const direction = new THREE.Vector3();
  at.getWorldPosition(direction);
  look.quaternion.copy(at.quaternion); // Copy the camera's rotation directly
}

function faceTarget(obj, pos) {
  // Calculate direction from camera to target
  const direction = new THREE.Vector3();
  direction.subVectors(pos, obj.position).normalize();
  
  // Calculate the up vector, which we want to maintain as (0, 1, 0) for a standard look
  const up = new THREE.Vector3(0, 1, 0);
  
  // Create a quaternion based on the camera's direction and up vector
  const lookAtQuaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
  
  // Apply the quaternion to the camera
  obj.quaternion.copy(lookAtQuaternion);
}
function deg2rad(degrees)
{
  return degrees * (Math.PI/180);
}
function rad2deg(radians)
{
  return degrees * (180/Math.PI);
}
function rotateObject(obj, vector = new THREE.Vector3)
{
  obj.rotation.x = vector.x;
  obj.rotation.y = vector.y;
  obj.rotation.z = vector.z;
}
function addRotateObject(obj, vector = new THREE.Vector3)
{
  obj.rotation.x += vector.x;
  obj.rotation.y += vector.y;
  obj.rotation.z += vector.z;
}
function vector2rad(vector)
{
  return new THREE.Vector3(deg2rad(vector.x),deg2rad(vector.y),deg2rad(vector.z));
}
/*
function rotateAround(obj, pivotPoint = new THREE.Vector3, rotation = new THREE.Vector3, up)
{
  //const p = obj.position;
  // Calculate the current offset from the pivot point
  const offset = obj.position.clone().sub(pivotPoint);

  // Create a rotation quaternion
  const angle = 0.01; // Rotation speed
  const quaternion = new THREE.Quaternion().setFromAxisAngle(rotation, angle); // Rotate around Y-axis

  // Rotate the offset
  const newOffset = offset.applyQuaternion(quaternion);

  // Update the cube's position
  obj.position.copy(pivotPoint).add(newOffset);
  obj.lookAt(pivotPoint);
  if (up == null) {up = rotation}
  obj.up.set(up.x,up.y,up.z);
}*/
function rotateAround(obj, pivotPoint = new THREE.Vector3(), rotationAxis  = new THREE.Vector3(), rotate=true) {
  // Calculate the current offset from the pivot point (distance between camera and pivot)
  const offset = obj.position.clone().sub(pivotPoint);

  // Calculate the radius (distance) from the pivot point
  const radius = offset.length(); // Keep this constant

  // Create a rotation quaternion
  const angle = 0.01; // Rotation speed
  const quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle); // Rotate around the specified axis

  // Rotate the offset
  const newOffset = offset.applyQuaternion(quaternion);

  // Re-normalize the offset to maintain the original radius (fixed distance from pivot)
  newOffset.setLength(radius);

  // Update the camera's position to maintain the same distance from the pivot
  obj.position.copy(pivotPoint).add(newOffset);

  if (rotate)
  {
    
    // Calculate the direction the camera should face (from camera to pivot)
    const direction = pivotPoint.clone().sub(obj.position).normalize();

    // Create a new quaternion that represents this direction and apply it to the camera
    const up = new THREE.Vector3(0, 0, 1); // Keep the up vector consistent
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1), // Default camera forward direction
        direction // New direction towards the pivot point
    );

    obj.quaternion.copy(targetQuaternion); // Apply the rotation to the camera
    obj.up.copy(up); // Ensure the up vector remains correct
  }
}

/* 
  //-------------------------//
  COLOR RELATED
  //-------------------------//
*/
/*
function rgbaToHex(r, g, b, a) {
  const toHex = (x) => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
  };

  // Convert RGBA to HEX with alpha as a separate hex value
  const hex = `0x${toHex(r)}${toHex(g)}${toHex(b)}`;//${toHex(a * 255)}`; // Alpha as a value from 0-255
  return hex;
}
  */

function rgbaToHex(r, g, b) {
  // Create a new THREE.Color object
  const color = new THREE.Color();

  // Set the color using RGBA values (0-1 range for each channel)
  color.setRGB(r / 255, g / 255, b / 255); // Normalize RGB values to [0, 1]

  // Optionally, you can set the alpha value if needed

  // Convert to HEX
  const hex = color.getHexString(); // This returns the hex representation
  return color;
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
function clamp(x, min, max) 
{
  return Math.min(Math.max(x, min), max);
};
