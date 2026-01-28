import * as THREE from "three";

import { createRenderer } from "./core/renderer.js";
import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { setupLighting } from "./core/lighting.js";

import { createGround } from "./world/ground.js";
import { createRoad } from "./world/road.js";

import { createPlayer } from "./entities/player.js";

import { createInput } from "./systems/input.js";
import { createFollowCamera } from "./systems/followCamera.js";
import { createCharacterController } from "./systems/characterController.js";

import { createEnemyPool } from "./entities/enemyPool.js";
import { createEnemyRenderer } from "./entities/enemyRenderer.js";

import { createFPSCounter } from "./systems/fpsCounter.js";


if (!navigator.gpu) {
  document.body.innerHTML = "<h1>WebGPU not supported</h1>";
  throw new Error("WebGPU not supported");
}

// Initialize the FPS counter
const fpsCounter = createFPSCounter();

const renderer = await createRenderer();
const scene = createScene();
const camera = createCamera();

setupLighting(scene);

scene.add(createGround());
scene.add(createRoad());

const player = createPlayer();
const followCamera = createFollowCamera(camera, player, {
  minX: -100,
  maxX: 100,
  minZ: -100,
  maxZ: 100,
  smoothing: 0.08
});
scene.add(player);

// Systems
const input = createInput();
const controller = createCharacterController(player, input);

const clock = new THREE.Clock();

// Get the query string from the URL
const urlParams = new URLSearchParams(window.location.search);

// Look for 'enemies', default to 100 if it's not in the URL
const MAX_ENEMIES = parseInt(urlParams.get('enemies')) || 1_000;

const enemyPool = createEnemyPool(MAX_ENEMIES);
const enemyRenderer = createEnemyRenderer(scene, enemyPool);
enemyPool.spawnHorde(MAX_ENEMIES, 100, 100, 500);

const physicsWorker = new Worker(new URL('./physicsWorker.js', import.meta.url), { type: 'module' });

// Initialize the worker with our SharedArrayBuffer
physicsWorker.postMessage({
  type: "INIT",
  data: {
    maxEnemies: enemyPool.maxEnemies,
    sharedBuffer: enemyPool.sharedBuffer
  }
});


function animate() {

  const delta = clock.getDelta();

  // Update FPS display
  fpsCounter.update();

  const velocity = controller.update(delta);
  player.updateAnimation(delta, velocity);

  // 2. Request Physics Update (Background Thread)
  // We send the player position so the worker knows where to swarm
  physicsWorker.postMessage({
    type: "UPDATE",
    data: {
      delta,
      playerPos: { 
        position: { x: player.position.x, z: player.position.z } 
      }
    }
  });

  followCamera.update();
  enemyRenderer.update(delta, camera, player);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
