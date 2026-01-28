// Configuration for the grid
const cellSize = 10;
const gridWidth = 200; // Total width of game area / cellSize
const gridHeight = 200;
const totalCells = gridWidth * gridHeight;

// Pre-allocate memory outside the update function to avoid GC
const head = new Int32Array(totalCells);

export function updateEnemyMovement(pool, player, delta, next) {
  const speed = 15.0;
  const separationDist = 5;
  const separationForce = 0.1;
  const invCellSize = 1 / cellSize;

  // 1. RESET GRID (O(totalCells))
  head.fill(-1);

  // 2. FILL GRID (O(N))
  for (let i = 0; i < pool.maxEnemies; i++) {
    if (pool.active[i] === 0) continue;

    // Map 3D coordinates to a 2D grid index
    // Adding an offset (100) to keep indices positive if enemies go negative
    const cx = Math.floor((pool.posX[i] + 1000) * invCellSize) % gridWidth;
    const cz = Math.floor((pool.posZ[i] + 1000) * invCellSize) % gridHeight;
    const cellIdx = cx + cz * gridWidth;

    // Linked list logic: the new index points to the old head
    next[i] = head[cellIdx];
    head[cellIdx] = i;
  }

  // 3. UPDATE POSITION AND SEPARATION
  for (let i = 0; i < pool.maxEnemies; i++) {
    if (pool.active[i] === 0) continue;

    // --- COHESION ---
    const dx = player.position.x - pool.posX[i];
    const dz = player.position.z - pool.posZ[i];
    const distSq = dx * dx + dz * dz;

    if (distSq > 0.01) {
      const dist = Math.sqrt(distSq);
      pool.velX[i] += (dx / dist) * speed * delta;
      pool.velZ[i] += (dz / dist) * speed * delta;
    }

    // --- SEPARATION (O(N * neighbors)) ---
    const cx = Math.floor((pool.posX[i] + 1000) * invCellSize) % gridWidth;
    const cz = Math.floor((pool.posZ[i] + 1000) * invCellSize) % gridHeight;

    for (let ox = -1; ox <= 1; ox++) {
      for (let oz = -1; oz <= 1; oz++) {
        const nx = (cx + ox + gridWidth) % gridWidth;
        const nz = (cz + oz + gridHeight) % gridHeight;
        const cellIdx = nx + nz * gridWidth;

        let j = head[cellIdx];
        while (j !== -1) {
          if (i !== j) {
            const sepX = pool.posX[i] - pool.posX[j];
            const sepZ = pool.posZ[i] - pool.posZ[j];
            const dSq = sepX * sepX + sepZ * sepZ;

            if (dSq < separationDist * separationDist) {
              const distance = Math.sqrt(dSq) || 1;
              pool.velX[i] += (sepX / distance) * separationForce;
              pool.velZ[i] += (sepZ / distance) * separationForce;
            }
          }
          j = next[j]; // Move to next ghost in this cell
        }
      }
    }

    // 4. INTEGRATE
    pool.velX[i] *= 0.95;
    pool.velZ[i] *= 0.95;
    pool.posX[i] += pool.velX[i] * delta;
    pool.posZ[i] += pool.velZ[i] * delta;
  }
}