// systems/input.js
export function createInput() {
  const keys = {};
  // New: Store a normalized direction vector
  const joystickVector = { x: 0, z: 0 };

  window.addEventListener("keydown", e => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });

  return {
    isDown(key) {
      return !!keys[key.toLowerCase()];
    },
    // Set by our joystick UI
    setJoystick(x, z) {
      joystickVector.x = x;
      joystickVector.z = z;
    },
    getAxis() {
      let x = 0;
      let z = 0;

      // Keyboard support
      if (this.isDown("w") || this.isDown("arrowup")) z -= 1;
      if (this.isDown("s") || this.isDown("arrowdown")) z += 1;
      if (this.isDown("a") || this.isDown("arrowleft")) x -= 1;
      if (this.isDown("d") || this.isDown("arrowright")) x += 1;

      // Use Joystick if keyboard is idle
      if (x === 0 && z === 0) {
        x = joystickVector.x;
        z = joystickVector.z;
      }

      return { x, z };
    }
  };
}