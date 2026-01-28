// physicsWorker.js
import { updateEnemyMovement } from "./systems/enemyMovement.js";

let pool = null;
let next;

self.onmessage = (e) => {
  const { type, data } = e.data;

  if (type === "INIT") {
    // Reconstruct the pool object using the shared buffer
    const { maxEnemies, sharedBuffer } = data;

    next = new Int32Array(maxEnemies);
    
    // We recreate the TypedArray views on the SAME memory
    let offset = 0;
    const FLOAT32_BYTES = 4;
    const UINT8_BYTES = 1;

    pool = {
      maxEnemies,
      posX: new Float32Array(sharedBuffer, offset, maxEnemies),
      posZ: (offset += FLOAT32_BYTES * maxEnemies, new Float32Array(sharedBuffer, offset, maxEnemies)),
      hp: (offset += FLOAT32_BYTES * maxEnemies, new Float32Array(sharedBuffer, offset, maxEnemies)),
      animTime: (offset += FLOAT32_BYTES * maxEnemies, new Float32Array(sharedBuffer, offset, maxEnemies)),
      velX: (offset += FLOAT32_BYTES * maxEnemies, new Float32Array(sharedBuffer, offset, maxEnemies)),
      velZ: (offset += FLOAT32_BYTES * maxEnemies, new Float32Array(sharedBuffer, offset, maxEnemies)),
      active: (offset += FLOAT32_BYTES * maxEnemies, new Uint8Array(sharedBuffer, offset, maxEnemies)),
      facing: (offset += UINT8_BYTES * maxEnemies, new Uint8Array(sharedBuffer, offset, maxEnemies)),
      frameIndex: (offset += UINT8_BYTES * maxEnemies, new Uint8Array(sharedBuffer, offset, maxEnemies)),
    };
  }

  if (type === "UPDATE") {
    const { delta, playerPos } = data;
    if (!pool) return;

    // Run the high-performance logic on the background thread
    updateEnemyMovement(pool, playerPos, delta, next);

    // Tell the main thread we are done
    self.postMessage({ type: "TICK_COMPLETE" });
  }
};