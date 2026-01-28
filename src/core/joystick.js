export function setupJoystick(input) {
  const container = document.createElement('div');
  container.id = "joystick-zone";
  // Added background color for debugging; change to transparent once it works!
  container.style.cssText = `
    position: fixed; /* Changed from absolute to fixed */
    top: 0; left: 0;
    width: 100%; height: 100%;
    touch-action: none;
    z-index: 9999; /* Overkill, but safe */
    pointer-events: auto;
    /* background: rgba(255,0,0,0.1); */ // Uncomment this to see the touch zone!
  `;

  const base = document.createElement('div');
  base.style.cssText = `
    position: absolute;
    width: 120px; height: 120px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    display: none;
    pointer-events: none; /* Let touches pass through to container */
  `;

  const stick = document.createElement('div');
  stick.style.cssText = `
    position: absolute;
    top: 35px; left: 35px;
    width: 50px; height: 50px;
    background: white;
    border-radius: 50%;
    pointer-events: none;
  `;

  base.appendChild(stick);
  container.appendChild(base);
  document.body.appendChild(container);

  let active = false;
  let startX = 0;
  let startY = 0;

  container.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Stop scrolling/zooming
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;

    base.style.display = 'block';
    base.style.left = `${startX - 60}px`;
    base.style.top = `${startY - 60}px`;
    active = true;
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    if (!active) return;
    const touch = e.touches[0];
    
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;

    const maxRadius = 60;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxRadius) {
      dx *= maxRadius / distance;
      dy *= maxRadius / distance;
    }

    stick.style.transform = `translate(${dx}px, ${dy}px)`;
    
    // Send to input system
    input.setJoystick(dx / maxRadius, dy / maxRadius);
  }, { passive: false });

  container.addEventListener('touchend', () => {
    active = false;
    base.style.display = 'none';
    input.setJoystick(0, 0);
  });
}