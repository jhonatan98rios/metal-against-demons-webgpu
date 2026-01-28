import * as THREE from "three";

export function createRoad() {

  const width = 30;
  const height = 2000;
  const texture = new THREE.TextureLoader().load(
    "./assets/world/road.jpg"
  );

  texture.anisotropy = 8;

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  texture.repeat.set(1, 50); // Adjust to your plane size

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    map: texture,
    roughness: 0.9,
    metalness: 0
  });

  const road = new THREE.Mesh(geometry, material);
  road.rotation.x = -Math.PI / 2;

  road.position.x = 30;
  road.position.y = 0.1;
  road.receiveShadow = true;

  return road;
}
