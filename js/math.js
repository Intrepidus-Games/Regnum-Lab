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
function rotateAround(obj, pivotPoint = new THREE.Vector3(), rotationAxis  = new THREE.Vector3()) {
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