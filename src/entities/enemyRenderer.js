import * as THREE from "three";

export function createEnemyRenderer(scene, pool) {
  const columns = 2;
  const rows = 2;
  
  const texture = new THREE.TextureLoader().load("./assets/enemies/apparition.png");
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  
  const geometry = new THREE.PlaneGeometry(4, 8);
  const materials = [];
  const meshes = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const spriteGeometry = geometry.clone();
      const uvs = spriteGeometry.attributes.uv.array;
      const uStep = 1 / columns;
      const vStep = 1 / rows;
      
      for (let i = 0; i < uvs.length; i += 2) {
        uvs[i] = col * uStep + uvs[i] * uStep;
        uvs[i + 1] = (rows - row - 1) * vStep + (1 - uvs[i + 1]) * vStep;
      }
      
      spriteGeometry.attributes.uv.needsUpdate = true;
      
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        // THE FIX: Allow the sprite to be visible when flipped
        side: THREE.DoubleSide 
      });
      
      const mesh = new THREE.InstancedMesh(spriteGeometry, material, pool.maxEnemies);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.visible = false; 
      scene.add(mesh);
      
      materials.push(material);
      meshes.push(mesh);
    }
  }
  
  const dummy = new THREE.Object3D();
  const instanceCounts = new Array(meshes.length).fill(0);
  const instanceMatrices = meshes.map(mesh => {
    const matrices = [];
    for (let i = 0; i < pool.maxEnemies; i++) {
      matrices.push(new THREE.Matrix4());
    }
    return matrices;
  });

  function update(delta, camera) {
    instanceCounts.fill(0);
    
    // Safety check for camera position
    const playerX = camera ? camera.position.x : 0;

    for (let i = 0; i < pool.maxEnemies; i++) {
      if (pool.active[i] === 0) continue;
      
      const spriteIndex = pool.frameIndex[i] % (columns * rows);
      const instanceIndex = instanceCounts[spriteIndex];
      
      dummy.position.set(pool.posX[i], 4, pool.posZ[i]);
      
      // if (camera) {
      //   dummy.lookAt(camera.position);
      // }
      
      // Flip X scale based on position relative to player
      const flip = pool.posX[i] > playerX ? -1 : 1;
      dummy.scale.set(flip, 1, 1);
      
      dummy.updateMatrix();
      
      instanceMatrices[spriteIndex][instanceIndex].copy(dummy.matrix);
      instanceCounts[spriteIndex]++;
    }
    
    for (let spriteIndex = 0; spriteIndex < meshes.length; spriteIndex++) {
      const mesh = meshes[spriteIndex];
      const count = instanceCounts[spriteIndex];
      
      if (count > 0) {
        mesh.visible = true;
        for (let i = 0; i < count; i++) {
          mesh.setMatrixAt(i, instanceMatrices[spriteIndex][i]);
        }
        mesh.instanceMatrix.needsUpdate = true;
        mesh.count = count;
      } else {
        mesh.visible = false;
      }
    }
  }

  return { update };
}