export function createFPSCounter() {
  const fpsUI = document.createElement("div");
  
  // Styling the overlay
  Object.assign(fpsUI.style, {
    position: "fixed",
    top: "10px",
    left: "10px",
    color: "#00ff00",
    fontFamily: "monospace",
    fontSize: "16px",
    zIndex: "100",
    background: "rgba(0, 0, 0, 0.6)",
    padding: "6px 10px",
    borderRadius: "4px",
    pointerEvents: "none",
    border: "1px solid #004400"
  });
  
  document.body.appendChild(fpsUI);

  let frameCount = 0;
  let lastTime = performance.now();

  return {
    update() {
      frameCount++;
      const currentTime = performance.now();

      // Update the UI once every second
      if (currentTime >= lastTime + 1000) {
        fpsUI.innerText = `FPS: ${frameCount}`;
        
        // Dynamic color: Green for good, Red for "oh no"
        fpsUI.style.color = frameCount >= 55 ? "#00ff00" : frameCount >= 30 ? "#ffff00" : "#ff0000";
        
        frameCount = 0;
        lastTime = currentTime;
      }
    }
  };
}