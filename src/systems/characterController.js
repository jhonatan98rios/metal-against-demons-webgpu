import * as THREE from "three";

export function createCharacterController(object, input) {
  const velocity = new THREE.Vector3();
  const speed = 20;

  return {
    update(delta) {
      // Get combined input from Keyboard + Joystick
      const axis = input.getAxis();
      
      velocity.set(axis.x, 0, axis.z);

      if (velocity.lengthSq() > 0) {
        // Handle diagonal speed boost by normalizing
        if (velocity.length() > 1) velocity.normalize();
        
        object.position.addScaledVector(velocity, speed * delta);
      }

      // ... keep your clamping logic here ...
      return velocity.clone();
    }
  };
}