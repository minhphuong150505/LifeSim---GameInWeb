import { THREE, model, bone, rbox, box, canvasPlane, bbox } from './lib.js';
const texLoader = new THREE.TextureLoader();
export async function mascot({ anim = 'idle', t = 0.3 } = {}) {
  const c = await model('/chars/character-female-e.glb', { anim, t });
  const tex = await texLoader.loadAsync('/chars/Textures/colormap-mascot.png');
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  c.traverse((o) => {
    if (o.isMesh) {
      o.material.map = tex;
      o.material.needsUpdate = true;
    }
  });
  c.updateMatrixWorld(true);
  const b = bbox(c);
  const H = b.max.y - b.min.y;
  const torso = bone(c, 'torso');
  const tp = new THREE.Vector3();
  torso.getWorldPosition(tp);
  // Red first-aid backpack with a white cross, attached to the torso bone.
  const pack = new THREE.Group();
  const body = rbox(0.42 * H, 0.46 * H, 0.2 * H, 0.05 * H, 0xd32f2f);
  pack.add(body);
  const lid = rbox(0.44 * H, 0.12 * H, 0.22 * H, 0.04 * H, 0xb71c1c);
  lid.position.y = 0.2 * H;
  pack.add(lid);
  const cross = canvasPlane(
    0.2 * H,
    0.2 * H,
    (g, w, h) => {
      g.fillStyle = '#fff';
      g.beginPath();
      g.arc(w / 2, h / 2, w / 2, 0, 7);
      g.fill();
      g.fillStyle = '#E53935';
      g.fillRect(w * 0.4, h * 0.2, w * 0.2, h * 0.6);
      g.fillRect(w * 0.2, h * 0.4, w * 0.6, h * 0.2);
    },
    128,
  );
  cross.position.set(0, -0.02 * H, -0.105 * H);
  cross.rotation.y = Math.PI;
  pack.add(cross);
  for (const sx of [-1, 1]) {
    const strap = box(0.05 * H, 0.42 * H, 0.04 * H, 0x8e1c1c);
    strap.position.set(sx * 0.13 * H, 0, 0.12 * H);
    pack.add(strap);
  }
  pack.position.set(tp.x, tp.y + 0.05 * H, b.min.z - 0.02 * H);
  c.add(pack);
  c.updateMatrixWorld(true);
  torso.attach(pack);
  return { c, H, b };
}
