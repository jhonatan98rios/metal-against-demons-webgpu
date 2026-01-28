import * as THREE from "three";

export function setupLighting(scene) {

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(-20, 50, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);

  scene.add(sun);
}
