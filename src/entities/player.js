import * as THREE from "three";

export function createPlayer() {

  const group = new THREE.Group();

  // -------------------------------------------------
  // Load Player Spritesheet
  // -------------------------------------------------

  const texture = new THREE.TextureLoader().load(
    "./assets/player/spritesheet.png"
  );

  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  const columns = 4;
  const rows = 4;

  texture.repeat.set(1 / columns, 1 / rows);
  texture.offset.set(0, 1 - 1 / rows);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(4, 8);

  const sprite = new THREE.Mesh(geometry, material);
  sprite.position.y = 4;

  group.add(sprite);

  // -------------------------------------------------
  // Shadow
  // -------------------------------------------------

  const shadowTexture = new THREE.TextureLoader().load(
    "./assets/player/shadow.png"
  );

  shadowTexture.magFilter = THREE.NearestFilter;
  shadowTexture.minFilter = THREE.NearestFilter;

  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.75
  });

  const shadowGeometry = new THREE.PlaneGeometry(4.5, 9);

  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);

  shadow.rotation.z = (-Math.PI / 2) + 1;
  shadow.position.y = 4; // small offset to prevent z-fighting
  shadow.position.x = 2; // small offset to prevent z-fighting
  shadow.position.z = 1; // small offset to prevent z-fighting

  group.add(shadow);

  // -------------------------------------------------
  // Animation State
  // -------------------------------------------------

  let currentFrame = 0;
  let currentRow = 2;
  let frameTimer = 0;

  const frameDuration = 0.15;
  let facing = "right";

  function setRow(row) {
    currentRow = row;
  }

  function updateUV() {
    texture.offset.x = currentFrame / columns;
    texture.offset.y = 1 - (currentRow + 1) / rows;
  }

  group.updateAnimation = function(delta, velocity) {

    const isMoving = velocity.lengthSq() > 0;

    if (velocity.x < -0.01) facing = "left";
    if (velocity.x >  0.01) facing = "right";

    if (!isMoving) {

      if (facing === "left") setRow(0);
      else setRow(2);

      currentFrame = 0;

      // subtle idle shadow
      shadow.scale.set(1, 1, 1);

    } else {

      if (facing === "left") setRow(1);
      else setRow(3);

      frameTimer += delta;

      if (frameTimer >= frameDuration) {
        frameTimer = 0;
        currentFrame = (currentFrame + 1) % columns;
      }

      // subtle squash while moving
      shadow.scale.set(1.1, 1, 1.1);
    }

    updateUV();
  };

  return group;
}
