import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
export { THREE };
const loader = new GLTFLoader();
const cache = new Map();
export async function load(path) {
  if (!cache.has(path)) cache.set(path, loader.loadAsync(path));
  return cache.get(path);
}
/** Clone a model; optionally pose it with an animation frozen at `t` (0..1 of clip). */
export async function model(path, { anim, t = 0.5 } = {}) {
  const g = await load(path);
  const obj = SkeletonUtils.clone(g.scene);
  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      o.material = o.material.clone();
    }
  });
  if (anim) {
    const clip = g.animations.find((a) => a.name === anim);
    const mixer = new THREE.AnimationMixer(obj);
    const action = mixer.clipAction(clip);
    action.play();
    mixer.setTime(clip.duration * t);
  }
  return obj;
}
export function bone(obj, name) {
  return obj.getObjectByName(name);
}
export function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...extra });
}
export function box(w, h, d, color, extra) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, extra));
  m.castShadow = m.receiveShadow = true;
  return m;
}
export function rbox(w, h, d, r, color, extra) {
  const shape = new THREE.Shape();
  const x = -w / 2,
    y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d - 2 * r * 0.5,
    bevelEnabled: true,
    bevelSize: r * 0.5,
    bevelThickness: r * 0.5,
    bevelSegments: 4,
    curveSegments: 8,
  });
  geo.center();
  const m = new THREE.Mesh(geo, mat(color, extra));
  m.castShadow = m.receiveShadow = true;
  return m;
}
export function cyl(rt, rb, h, color, extra, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color, extra));
  m.castShadow = m.receiveShadow = true;
  return m;
}
export function sphere(r, color, extra) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat(color, extra));
  m.castShadow = true;
  return m;
}
/** Plane with canvas-drawn texture (signs, boards, bubbles). */
export function canvasPlane(w, h, draw, px = 512) {
  const c = document.createElement('canvas');
  c.width = px;
  c.height = Math.round((px * h) / w);
  draw(c.getContext('2d'), c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.9 }),
  );
}
export function bbox(obj) {
  return new THREE.Box3().setFromObject(obj);
}

export function makeStage(size = 1080, { alpha = false, bg = 0xfff1e0 } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(size, size);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  if (!alpha) scene.background = new THREE.Color(bg);
  scene.add(new THREE.HemisphereLight(0xfff6ef, 0xb58a6a, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(4, 9, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 0.5, far: 30 });
  sun.shadow.bias = -0.0005;
  sun.shadow.radius = 4;
  scene.add(sun);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  return {
    renderer,
    scene,
    camera,
    sun,
    render() {
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/png');
    },
    /** Screen-space % rectangle covering the given objects (for clue hotspots). */
    rectOf(objs, pad = 0) {
      const b = new THREE.Box3();
      for (const o of [].concat(objs)) b.expandByObject(o);
      const pts = [];
      for (const x of [b.min.x, b.max.x])
        for (const y of [b.min.y, b.max.y])
          for (const z of [b.min.z, b.max.z]) pts.push(new THREE.Vector3(x, y, z).project(camera));
      const xs = pts.map((p) => (p.x + 1) * 50),
        ys = pts.map((p) => (1 - p.y) * 50);
      const x0 = Math.min(...xs) - pad,
        x1 = Math.max(...xs) + pad,
        y0 = Math.min(...ys) - pad,
        y1 = Math.max(...ys) + pad;
      return {
        x: +x0.toFixed(1),
        y: +y0.toFixed(1),
        w: +(x1 - x0).toFixed(1),
        h: +(y1 - y0).toFixed(1),
      };
    },
  };
}
