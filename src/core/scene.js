import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd7c1a0);
  scene.fog = new THREE.Fog(0xd7c1a0, 0, 300);
  return scene;
}
