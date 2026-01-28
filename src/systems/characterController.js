import * as THREE from "three";
import { WorldBounds } from "../world/worldBounds.js";

export function createCharacterController(object, input) {

  const velocity = new THREE.Vector3();
  const speed = 20;

  return {

    update(delta) {

      velocity.set(0, 0, 0);

      if (input.isDown("w")) velocity.z -= 1;
      if (input.isDown("s")) velocity.z += 1;
      if (input.isDown("a")) velocity.x -= 1;
      if (input.isDown("d")) velocity.x += 1;

      if (velocity.lengthSq() > 0) {
        velocity.normalize();
        object.position.addScaledVector(velocity, speed * delta);
      }

      // Clamp player
      object.position.x = THREE.MathUtils.clamp(
        object.position.x,
        WorldBounds.minX,
        WorldBounds.maxX
      );

      object.position.z = THREE.MathUtils.clamp(
        object.position.z,
        WorldBounds.minZ,
        WorldBounds.maxZ
      );

      return velocity.clone();
    }

  };
}
