export function createEnemyPool(maxEnemies) {

  const FLOAT32_BYTES = 4;
  const UINT8_BYTES = 1;

  const floatSectionBytes = FLOAT32_BYTES * maxEnemies * 6; // posX, posZ, hp, animTime, velX, velZ
  const uintSectionBytes  = UINT8_BYTES  * maxEnemies * 3;  // active, facing, frameIndex

  const totalBytes = floatSectionBytes + uintSectionBytes;

  const sharedBuffer = new SharedArrayBuffer(totalBytes);

  let offset = 0;

  // -------------------------
  // Float32 section
  // -------------------------

  const posX = new Float32Array(sharedBuffer, offset, maxEnemies);
  offset += FLOAT32_BYTES * maxEnemies;

  const posZ = new Float32Array(sharedBuffer, offset, maxEnemies);
  offset += FLOAT32_BYTES * maxEnemies;

  const hp = new Float32Array(sharedBuffer, offset, maxEnemies);
  offset += FLOAT32_BYTES * maxEnemies;

  const animTime = new Float32Array(sharedBuffer, offset, maxEnemies);
  offset += FLOAT32_BYTES * maxEnemies;

  const velX = new Float32Array(sharedBuffer, offset, maxEnemies);
  offset += FLOAT32_BYTES * maxEnemies;

  const velZ = new Float32Array(sharedBuffer, offset, maxEnemies);
  offset += FLOAT32_BYTES * maxEnemies;

  // -------------------------
  // Uint8 section
  // -------------------------

  const active = new Uint8Array(sharedBuffer, offset, maxEnemies);
  offset += UINT8_BYTES * maxEnemies;

  const facing = new Uint8Array(sharedBuffer, offset, maxEnemies);
  offset += UINT8_BYTES * maxEnemies;

  const frameIndex = new Uint8Array(sharedBuffer, offset, maxEnemies);
  offset += UINT8_BYTES * maxEnemies;

  // -------------------------
  // Spawn / Despawn
  // -------------------------

  function spawn(x, z, health = 100, direction = 0) {

    for (let i = 0; i < maxEnemies; i++) {

      if (active[i] === 0) {

        posX[i] = x;
        posZ[i] = z;
        hp[i]   = health;

        facing[i] = direction;
        frameIndex[i] = 0;
        animTime[i] = 0;

        active[i] = 1;

        return i;
      }
    }

    return -1;
  }

  function spawnHorde(count, centerX, centerZ, radius) {
    let spawned = 0;
    for (let i = 0; i < maxEnemies && spawned < count; i++) {
      if (active[i] === 0) {
        const x = centerX + (Math.random() - 0.5) * radius * 2;
        const z = centerZ + (Math.random() - 0.5) * radius * 2;
        
        // Use the existing spawn logic
        spawn(x, z, 100, Math.floor(Math.random() * 2));
        spawned++;
      }
    }
  }

  function despawn(index) {
    active[index] = 0;
  }

  return {
    maxEnemies,
    sharedBuffer,

    posX,
    posZ,
    hp,
    animTime,

    velX,
    velZ,

    active,
    facing,
    frameIndex,

    spawn,
    spawnHorde,
    despawn
  };
}
