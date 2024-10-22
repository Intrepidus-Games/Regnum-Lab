REGNUMLAB.addEvent("update", update)

// Smoke particles array
const particles = [];
const particleCount = 1000;

// Create smoke particles using cubes (boxes)
function createParticle() {
    const particle = REGNUMLAB.scene.createBox("box", new THREE.Vector3(0.1, 0.1, 0.1), 0x8a8a8a);

     // Initial position
     particle.position.set(
        (Math.random() - 0.5) * 2, // X
        (Math.random() - 0.5) * 2, // Y
        (Math.random() - 0.5) * 2  // Z
      );

      // Random velocity for each particle
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.03 + 0.02, // Upward with more force
        (Math.random() - 0.5) * 0.02
      );

      // Random rotation speed
      particle.rotationSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );

      // Store particle
      particles.push(particle);
  }

// Initialize particles
for (let i = 0; i < particleCount; i++) {
  createParticle();
}

function update(deltaTime)
{
    
    // Update each particle
    particles.forEach(particle => {
        // Update position
        particle.position.add(particle.velocity);

        // Apply rotation for more dynamic movement
        particle.rotation.x += particle.rotationSpeed.x;
        particle.rotation.y += particle.rotationSpeed.y;
        particle.rotation.z += particle.rotationSpeed.z;

        // Gradually increase size, fade out, and change color from dark to light
        particle.scale.addScalar(0.002);
        particle.material.opacity -= 0.003;
        particle.material.color.lerp(new THREE.Color(0x999999), 0.01); // Gradually lightening

        // Reset particle if it's invisible or too far
        if (particle.material.opacity <= 0 || particle.position.y > 3) {
          particle.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          );
          particle.scale.set(1, 1, 1);
          particle.material.opacity = 0.7;
          particle.material.color.set(0x555555); // Reset color to dark gray
          particle.velocity.set(
            (Math.random() - 0.5) * 0.02,
            Math.random() * 0.03 + 0.02,
            (Math.random() - 0.5) * 0.02
          );
        }
      });

    
}