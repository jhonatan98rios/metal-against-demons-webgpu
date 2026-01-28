import * as THREE from "three";

export function createGround() {
  const width = 1000;
  const height = 1000;
  const segments = 512;

  const loader = new THREE.TextureLoader();
  
  const texture = loader.load("./assets/world/sand.jpg");
  
  const displacementMap = loader.load("./assets/world/sand.png");

  // Configuração de repetição para AMBAS as texturas
  [texture, displacementMap].forEach(t => {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.repeat.set(10, 10); // Devem ser iguais
    t.anisotropy = 8;
  });

  const geometry = new THREE.PlaneGeometry(width, height, segments, segments);

  const material = new THREE.MeshStandardMaterial({
    color: 0xe2c6a3,
    map: texture,
    displacementMap: displacementMap, 
    displacementScale: 5, // Cuidado: 12 pode ser muito alto dependendo da luz
    bumpMap: displacementMap, // Usar a mesma imagem como bump ajuda no sombreamento
    bumpScale: 5,
    roughness: 0.8,
    metalness: 0
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  return ground;
}