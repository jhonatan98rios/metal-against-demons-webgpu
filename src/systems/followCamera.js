import * as THREE from "three";

export function createFollowCamera(camera, target, options = {}) {

  const {
    offset = new THREE.Vector3(0, 35, 60),
    smoothing = 0.08
  } = options;

  const desiredPosition = new THREE.Vector3();

  return {

    update() {

      // Desired position
      desiredPosition.copy(target.position).add(offset);

      // Smooth follow
      camera.position.lerp(desiredPosition, smoothing);

      // Always look at player
      camera.lookAt(target.position);
    }

  };
}
