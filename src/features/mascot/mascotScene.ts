import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { assets } from '../../data/assets';

/**
 * Interactive 3D mascot: Kenney "Mini Characters" model (CC0) recoloured to the
 * LifeSim palette, with a first-aid backpack built from primitives.
 * Drag to turn her around; tap to make her wave.
 */
export type MascotHandle = { wave: () => void; dispose: () => void };

type Options = { reducedMotion: boolean; onReady: () => void; onError: () => void };

const DRAG_SPEED = 0.012;
const WAVE_SEC = 1.4;
const IDLE_YAW = 0.35;

function backpack(height: number): THREE.Group {
  const red = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.6 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x8e1c1c, roughness: 0.7 });
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.42 * height, 0.46 * height, 0.2 * height),
    red,
  );
  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(0.44 * height, 0.12 * height, 0.22 * height),
    dark,
  );
  lid.position.y = 0.2 * height;
  g.add(body, lid);
  // White disc with a red cross on the back of the bag.
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(64, 64, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E53935';
    ctx.fillRect(51, 26, 26, 76);
    ctx.fillRect(26, 51, 76, 26);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const badge = new THREE.Mesh(
    new THREE.PlaneGeometry(0.2 * height, 0.2 * height),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true }),
  );
  badge.position.set(0, -0.02 * height, -0.101 * height);
  badge.rotation.y = Math.PI;
  g.add(badge);
  for (const side of [-1, 1]) {
    const strap = new THREE.Mesh(
      new THREE.BoxGeometry(0.05 * height, 0.42 * height, 0.04 * height),
      dark,
    );
    strap.position.set(side * 0.13 * height, 0, 0.12 * height);
    g.add(strap);
  }
  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  return g;
}

export function createMascot(container: HTMLElement, opts: Options): MascotHandle {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.domElement.style.touchAction = 'pan-y';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff6ef, 0xb58a6a, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(3, 6, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(0.45, 40),
    new THREE.ShadowMaterial({ opacity: 0.18 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 1.0, 4.2);
  camera.lookAt(0, 0.5, 0);

  const pivot = new THREE.Group();
  pivot.rotation.y = IDLE_YAW;
  scene.add(pivot);

  let mixer: THREE.AnimationMixer | null = null;
  let armRight: THREE.Object3D | null = null;
  const armRest = new THREE.Quaternion();
  let waveLeft = 0;
  let disposed = false;
  let visible = true;
  let frame = 0;
  const clock = new THREE.Clock();

  // The model references `Textures/colormap.png`; swap in the recoloured mascot palette.
  const manager = new THREE.LoadingManager();
  manager.setURLModifier((url) =>
    url.endsWith('colormap.png') ? assets.models.mascotColormap : url,
  );
  new GLTFLoader(manager).load(
    assets.models.mascot,
    (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      model.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.castShadow = true;
          const m = o.material as THREE.MeshStandardMaterial;
          if (m.map) m.map.magFilter = THREE.NearestFilter;
        }
      });
      pivot.add(model);
      mixer = new THREE.AnimationMixer(model);
      const idle = gltf.animations.find((a) => a.name === 'idle');
      if (idle) mixer.clipAction(idle).play();
      mixer.update(0.3);
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const height = box.max.y - box.min.y;
      // Frame the camera on the model so she fills the container.
      const fit = (height * 0.62) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(0, box.min.y + height * 0.85, fit);
      camera.lookAt(0, box.min.y + height * 0.48, 0);
      ground.scale.setScalar(height * 0.9);
      const torso = model.getObjectByName('torso');
      armRight = model.getObjectByName('arm-right') ?? null;
      if (armRight) armRest.copy(armRight.quaternion);
      if (torso) {
        const pack = backpack(height);
        const p = new THREE.Vector3();
        torso.getWorldPosition(p);
        pack.position.set(p.x, p.y + 0.05 * height, box.min.z - 0.02 * height);
        pivot.add(pack);
        torso.attach(pack);
      }
      opts.onReady();
      render();
    },
    undefined,
    () => !disposed && opts.onError(),
  );

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  function render() {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!opts.reducedMotion) mixer?.update(dt);
    if (armRight && waveLeft > 0) {
      // Raise the right arm and wave it while the timer runs.
      waveLeft = Math.max(0, waveLeft - dt);
      const t = WAVE_SEC - waveLeft;
      armRight.quaternion.copy(armRest);
      if (waveLeft > 0) armRight.rotateZ(-1.9 - Math.sin(t * 14) * 0.35);
    }
    renderer.render(scene, camera);
  }

  const loop = () => {
    frame = 0;
    if (disposed) return;
    render();
    if (visible && !opts.reducedMotion) frame = requestAnimationFrame(loop);
  };

  // Pause when off-screen or when the tab is hidden to save battery.
  const io = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting) && !document.hidden;
    if (visible && !frame && !opts.reducedMotion) frame = requestAnimationFrame(loop);
  });
  io.observe(container);
  const onVisibility = () => {
    visible = !document.hidden;
    if (visible && !frame && !opts.reducedMotion) frame = requestAnimationFrame(loop);
  };
  document.addEventListener('visibilitychange', onVisibility);

  // Drag to rotate around the vertical axis.
  let dragX: number | null = null;
  let dragDistance = 0;
  const el = renderer.domElement;
  const onDown = (e: PointerEvent) => {
    dragX = e.clientX;
    dragDistance = 0;
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (dragX === null) return;
    pivot.rotation.y += (e.clientX - dragX) * DRAG_SPEED;
    dragDistance += Math.abs(e.clientX - dragX);
    dragX = e.clientX;
    if (opts.reducedMotion) render();
  };
  const onUp = () => {
    // A tap (no real drag) makes her wave.
    if (dragX !== null && dragDistance < 6) handle.wave();
    dragX = null;
  };
  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onUp);
  frame = requestAnimationFrame(loop);

  const handle: MascotHandle = {
    wave() {
      waveLeft = WAVE_SEC;
      if (opts.reducedMotion) {
        waveLeft = 0;
        render();
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            (m as THREE.MeshStandardMaterial).map?.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      el.remove();
    },
  };
  return handle;
}
