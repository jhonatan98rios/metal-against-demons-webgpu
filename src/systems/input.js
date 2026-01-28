export function createInput() {

  const keys = {};

  window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });

  return {
    isDown(key) {
      return !!keys[key.toLowerCase()];
    }
  };
}
