import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer.js";

export async function createRenderer() {

  const renderer = new WebGPURenderer({ antialias: true });

  await renderer.init();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  return renderer;
}
