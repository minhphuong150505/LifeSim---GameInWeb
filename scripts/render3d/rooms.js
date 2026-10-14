import {
  THREE,
  model,
  makeStage,
  bone,
  box,
  rbox,
  cyl,
  sphere,
  canvasPlane,
  load,
  mat,
} from './lib.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { mascot } from './mascot.js';

const CH = (n) => `/chars/character-${n}.glb`;
const H = 0.8; // approx. character height in world units

/** Furniture Kit model scaled uniformly to a target height. */
async function furn(name, height) {
  const g = await load(`/furn/${name}.glb`);
  const o = SkeletonUtils.clone(g.scene);
  o.traverse((m) => {
    if (m.isMesh) {
      m.castShadow = m.receiveShadow = true;
    }
  });
  const b = new THREE.Box3().setFromObject(o);
  const s = height / (b.max.y - b.min.y);
  o.scale.setScalar(s);
  const wrap = new THREE.Group();
  wrap.add(o);
  o.position.y = -b.min.y * s;
  return wrap;
}

function rotateArm(c, name, ops) {
  const b = bone(c, name);
  for (let i = 0; i < ops.length; i += 2) b['rotate' + ops[i].toUpperCase()](ops[i + 1]);
}

function tintHead(c, color) {
  c.traverse((o) => {
    if (o.isMesh && o.name.includes('head')) o.material.color = new THREE.Color(color);
  });
}

function boneVerts(c, boneName) {
  const pts = [];
  c.traverse((m) => {
    if (!m.isSkinnedMesh) return;
    const bi = m.skeleton.bones.findIndex((b) => b.name === boneName);
    const idx = m.geometry.attributes.skinIndex,
      wts = m.geometry.attributes.skinWeight,
      pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let w = 0;
      for (let k = 0; k < 4; k++) if (idx.getComponent(i, k) === bi) w += wts.getComponent(i, k);
      if (w > 0.5) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        m.applyBoneTransform(i, v);
        v.applyMatrix4(m.matrixWorld);
        pts.push(v);
      }
    }
  });
  return pts;
}

function worldPos(obj) {
  obj.updateWorldMatrix(true, false);
  return new THREE.Vector3().setFromMatrixPosition(obj.matrixWorld);
}

function floor(scene, color, size = 12, lines = '#c99b6c') {
  const p = canvasPlane(
    size,
    size,
    (g, w, h) => {
      g.fillStyle = color;
      g.fillRect(0, 0, w, h);
      g.strokeStyle = lines;
      g.globalAlpha = 0.35;
      g.lineWidth = 2;
      for (let y = 0; y < h; y += h / 24) {
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(w, y);
        g.stroke();
      }
    },
    1024,
  );
  p.material.transparent = false;
  p.rotation.x = -Math.PI / 2;
  p.receiveShadow = true;
  scene.add(p);
}

function wall(scene, w, h, color, pos, rotY = 0) {
  const m = box(w, h, 0.08, color);
  m.position.set(...pos);
  m.position.y = h / 2;
  m.rotation.y = rotY;
  m.castShadow = false;
  scene.add(m);
  return m;
}

function label(
  text,
  w,
  h,
  { bg = '#fff', fg = '#1F3A5F', font = 'bold 64px Verdana', radius = 24, border, px = 512 } = {},
) {
  return canvasPlane(
    w,
    h,
    (g, cw, ch) => {
      g.fillStyle = bg;
      g.beginPath();
      g.roundRect(4, 4, cw - 8, ch - 8, radius);
      g.fill();
      if (border) {
        g.strokeStyle = border;
        g.lineWidth = 10;
        g.stroke();
      }
      g.fillStyle = fg;
      g.font = font;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      const lines = String(text).split('\n');
      lines.forEach((l, i) =>
        g.fillText(
          l,
          cw / 2,
          ch / 2 + (i - (lines.length - 1) / 2) * parseInt(font.match(/(\d+)px/)[1]) * 1.25,
        ),
      );
    },
    px,
  );
}

/** Screen-space hotspot (in %) centred on a world point. */
function spot(st, p, w, h, dx = 0, dy = 0) {
  const v = p.clone().project(st.camera);
  const cx = (v.x + 1) * 50 + dx,
    cy = (1 - v.y) * 50 + dy;
  return { x: +(cx - w / 2).toFixed(1), y: +(cy - h / 2).toFixed(1), w, h };
}

// ---------------------------------------------------------------- classroom
export async function classroom() {
  const st = makeStage(1080, { bg: 0xfce6cf });
  const { scene, camera } = st;
  floor(scene, '#e6c39b');
  // back wall with a door opening on the right
  wall(scene, 4.2, 2.6, 0xfbe3c8, [-1.1, 0, -2]);
  wall(scene, 1.0, 2.6, 0xfbe3c8, [2.6, 0, -2]);
  const lintel = box(1.0, 0.6, 0.08, 0xfbe3c8);
  lintel.position.set(1.6, 2.3, -2);
  scene.add(lintel);
  const frame = box(1.08, 0.08, 0.14, 0x7a5c43);
  frame.position.set(1.6, 2.0, -2);
  scene.add(frame);
  for (const x of [1.08, 2.12]) {
    const f = box(0.08, 2.0, 0.14, 0x7a5c43);
    f.position.set(x, 1.0, -2);
    scene.add(f);
  }
  wall(scene, 4, 2.6, 0xdde7ee, [1.6, 0, -3.2]); // hallway
  const hallFloor = box(1.2, 0.02, 1.3, 0xc5d2db);
  hallFloor.position.set(1.6, 0.01, -2.6);
  scene.add(hallFloor);
  const hallSign = label('HÀNH LANG', 0.9, 0.2, {
    bg: '#ffffff00',
    fg: '#5B7386',
    font: 'bold 70px Verdana',
  });
  hallSign.position.set(1.6, 1.75, -3.15);
  scene.add(hallSign);
  // AED cabinet on the hallway wall
  const cab = rbox(0.62, 0.72, 0.18, 0.05, 0xffffff);
  cab.position.set(1.6, 1.12, -3.08);
  scene.add(cab);
  const cabFrame = rbox(0.66, 0.76, 0.12, 0.05, 0x2e7d32);
  cabFrame.position.set(1.6, 1.12, -3.12);
  scene.add(cabFrame);
  const aed = await furnLike('/chars/aid-defibrillator-green.glb', 0.34);
  aed.position.set(1.6, 1.0, -2.98);
  scene.add(aed);
  const aedLbl = label('AED', 0.4, 0.14, {
    bg: '#2E7D32',
    fg: '#fff',
    font: 'bold 90px Verdana',
    radius: 16,
  });
  aedLbl.position.set(1.6, 1.36, -2.98);
  scene.add(aedLbl);
  // blackboard + window
  const board = box(1.9, 1.0, 0.06, 0x8d6e4f);
  board.position.set(-1.6, 1.55, -1.95);
  scene.add(board);
  const slate = canvasPlane(
    1.78,
    0.88,
    (g, w, h) => {
      g.fillStyle = '#2F5D50';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#EAF4EE';
      g.font = 'bold 54px Verdana';
      g.textAlign = 'center';
      g.fillText('Sinh học – Tiết 3', w / 2, h * 0.4);
      g.globalAlpha = 0.7;
      g.fillRect(w * 0.2, h * 0.58, w * 0.6, 6);
      g.fillRect(w * 0.2, h * 0.72, w * 0.4, 6);
    },
    768,
  );
  slate.material.transparent = false;
  slate.position.set(-1.6, 1.55, -1.91);
  scene.add(slate);
  const win = canvasPlane(
    0.8,
    0.9,
    (g, w, h) => {
      g.fillStyle = '#8D6E4F';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#BFE3F7';
      g.fillRect(14, 14, w - 28, h - 28);
      g.fillStyle = '#FFE082';
      g.beginPath();
      g.arc(w * 0.72, h * 0.25, 22, 0, 7);
      g.fill();
      g.fillStyle = '#8D6E4F';
      g.fillRect(w / 2 - 6, 0, 12, h);
      g.fillRect(0, h / 2 - 6, w, 12);
    },
    256,
  );
  win.material.transparent = false;
  win.position.set(0.25, 1.6, -1.95);
  scene.add(win);
  // desks and chairs
  for (const [x, z] of [
    [-2.0, -1.1],
    [-0.9, -1.1],
    [-2.3, 0.1],
  ]) {
    const d = await furn('desk', 0.5);
    d.position.set(x, 0, z);
    scene.add(d);
    const ch = await furn('chairDesk', 0.45);
    ch.position.set(x + 0.15, 0, z + 0.45);
    ch.rotation.y = Math.PI;
    scene.add(ch);
  }
  const books = box(0.3, 0.06, 0.2, 0xe53935);
  books.position.set(-2.0, 0.53, -1.1);
  scene.add(books);
  // fallen chair next to the victim
  const fallen = await furn('chair', 0.5);
  fallen.position.set(1.75, 0.2, 0.2);
  fallen.rotation.set(0, 0.6, Math.PI / 2);
  scene.add(fallen);
  // shocked classmate in the back
  const mate = await model(CH('female-b'), { anim: 'idle', t: 0.2 });
  rotateArm(mate, 'arm-right', ['z', -1.6]);
  rotateArm(mate, 'arm-left', ['z', 1.6]);
  mate.position.set(-0.55, 0, -0.75);
  mate.rotation.y = 0.5;
  scene.add(mate);
  // victim lying on the back, pale/blue face
  const v = await model(CH('male-e'), { anim: 'die', t: 0.999 });
  v.rotation.y = 0.5;
  v.position.set(0.3, 0, 0.75);
  v.scale.setScalar(1.9);
  scene.add(v);
  tintHead(v, 0xc9bdf0);
  camera.position.set(0.2, 4.1, 4.6);
  camera.lookAt(0.2, 0.55, -0.7);
  scene.updateMatrixWorld(true);
  const head = worldPos(bone(v, 'head')),
    torso = worldPos(bone(v, 'torso')),
    legL = worldPos(bone(v, 'leg-left')),
    legR = worldPos(bone(v, 'leg-right'));
  const legs = legL.clone().add(legR).multiplyScalar(0.5);
  const png = st.render();
  return {
    png,
    info: JSON.stringify({
      head: spot(st, head, 14, 14, -3, 0),
      torso: spot(st, torso, 15, 14),
      legs: spot(st, legs, 17, 13, 6, 0),
      aed: st.rectOf([cabFrame], 1.5),
    }),
  };
}

async function furnLike(path, height) {
  const g = await load(path);
  const o = SkeletonUtils.clone(g.scene);
  o.traverse((m) => {
    if (m.isMesh) m.castShadow = true;
  });
  const b = new THREE.Box3().setFromObject(o);
  const s = height / (b.max.y - b.min.y);
  o.scale.setScalar(s);
  const w = new THREE.Group();
  w.add(o);
  o.position.y = -b.min.y * s;
  return w;
}

// ---------------------------------------------------------------- canteen
export async function canteen() {
  const st = makeStage(1080, { bg: 0xffe9d2 });
  const { scene, camera } = st;
  floor(scene, '#efd3b1', 12, '#d8b48b');
  wall(scene, 8, 2.6, 0xffe9d2, [0, 0, -2]);
  // serving counter
  const counter = rbox(4.2, 0.62, 0.6, 0.05, 0xc98b5b);
  counter.position.set(0.9, 0.31, -1.55);
  scene.add(counter);
  const top = box(4.3, 0.06, 0.7, 0xa66e43);
  top.position.set(0.9, 0.65, -1.55);
  scene.add(top);
  const tray = box(0.8, 0.05, 0.35, 0xb0bec5);
  tray.position.set(2.0, 0.7, -1.55);
  scene.add(tray);
  for (let i = 0; i < 3; i++) {
    const mb = sphere(0.07, 0x8d5a3a);
    mb.position.set(1.78 + i * 0.22, 0.79, -1.55);
    scene.add(mb);
  }
  const jug = cyl(0.12, 0.12, 0.3, 0xffc107);
  jug.position.set(0.0, 0.83, -1.6);
  scene.add(jug);
  // menu board + awning
  const menu = label('CĂNG TIN\nThịt viên xiên 10k\nBánh mì 15k', 1.3, 0.75, {
    bg: '#1F3A5F',
    fg: '#fff',
    font: 'bold 96px Verdana',
    px: 1024,
  });
  menu.position.set(-1.45, 1.75, -1.95);
  scene.add(menu);
  const awn = canvasPlane(
    3.4,
    0.45,
    (g, w, h) => {
      for (let i = 0; i < 10; i++) {
        g.fillStyle = i % 2 ? '#fff' : '#E53935';
        g.fillRect((i * w) / 10, 0, w / 10, h);
      }
    },
    512,
  );
  awn.material.transparent = false;
  awn.position.set(1.0, 2.05, -1.9);
  scene.add(awn);
  // tables
  const t1 = await furn('table', 0.42);
  t1.position.set(-1.25, 0, 0.55);
  scene.add(t1);
  const t2 = await furn('table', 0.42);
  t2.position.set(1.7, 0, -0.35);
  scene.add(t2);
  const c1 = await furn('chair', 0.46);
  c1.position.set(-1.25, 0, -0.1);
  scene.add(c1);
  // plate + meatball skewer on the front-left table (clue)
  const plate = cyl(0.26, 0.2, 0.03, 0xffffff);
  plate.position.set(-1.25, 0.44, 0.6);
  scene.add(plate);
  const stick = cyl(0.012, 0.012, 0.7, 0xc8a165);
  stick.rotation.set(0, 0.3, Math.PI / 2);
  stick.position.set(-1.22, 0.5, 0.62);
  scene.add(stick);
  for (let i = 0; i < 2; i++) {
    const mb = sphere(0.075, 0x8d5a3a);
    mb.position.set(-1.38 + i * 0.17, 0.52, 0.66 - i * 0.05);
    scene.add(mb);
  }
  const drink = cyl(0.07, 0.06, 0.2, 0xffe082);
  drink.position.set(-0.98, 0.52, 0.45);
  scene.add(drink);
  // friend sitting at the back table
  const friend = await model(CH('male-d'), { anim: 'sit', t: 0.5 });
  friend.position.set(1.7, 0.02, -0.85);
  scene.add(friend);
  // choking student: both hands at the throat, face red → purple
  const v = await model(CH('female-c'), { anim: 'idle', t: 0.4 });
  rotateArm(v, 'arm-right', ['y', 1.35, 'z', -0.55]);
  rotateArm(v, 'arm-left', ['y', -1.35, 'z', 0.55]);
  bone(v, 'head').rotateX(-0.18);
  tintHead(v, 0xf2b6cf);
  v.position.set(0.15, 0, 0.75);
  v.scale.setScalar(1.15);
  scene.add(v);
  // silent speech bubble
  const bubble = canvasPlane(
    0.62,
    0.46,
    (g, w, h) => {
      g.fillStyle = '#fff';
      g.strokeStyle = '#1F3A5F';
      g.lineWidth = 12;
      g.beginPath();
      g.roundRect(10, 10, w - 20, h * 0.72, 40);
      g.fill();
      g.stroke();
      g.beginPath();
      g.moveTo(w * 0.22, h * 0.72);
      g.lineTo(w * 0.12, h * 0.97);
      g.lineTo(w * 0.4, h * 0.74);
      g.fill();
      g.fillStyle = '#90A4AE';
      for (let i = 0; i < 3; i++) {
        g.beginPath();
        g.arc(w * (0.32 + i * 0.18), h * 0.38, 22, 0, 7);
        g.fill();
      }
      g.strokeStyle = '#E53935';
      g.lineWidth = 20;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(w * 0.2, h * 0.6);
      g.lineTo(w * 0.8, h * 0.15);
      g.stroke();
    },
    512,
  );
  bubble.position.set(0.95, 1.45, 0.75);
  scene.add(bubble);
  camera.position.set(0.1, 2.6, 5.4);
  camera.lookAt(0.1, 0.75, -0.3);
  scene.updateMatrixWorld(true);
  const head = worldPos(bone(v, 'head'));
  const torso = worldPos(bone(v, 'torso'));
  const png = st.render();
  return {
    png,
    info: JSON.stringify({
      face: spot(st, head.clone().add(new THREE.Vector3(0, 0.22, 0)), 20, 15),
      hands: spot(st, torso.clone().add(new THREE.Vector3(0, 0.12, 0.1)), 22, 11),
      bubble: st.rectOf([bubble], 0.5),
      skewer: st.rectOf([plate, stick], 1.5),
    }),
  };
}

// ---------------------------------------------------------------- lab
export async function lab() {
  const st = makeStage(1080, { bg: 0xe3eef3 });
  const { scene, camera } = st;
  floor(scene, '#b8c7cf', 12, '#9fb1ba');
  wall(scene, 8, 2.6, 0xe3eef3, [0, 0, -2]);
  // bench along the back wall
  const bench = box(5, 0.7, 0.8, 0x90a4ae);
  bench.position.set(0, 0.35, -1.55);
  scene.add(bench);
  const benchTop = box(5.1, 0.06, 0.9, 0x37474f);
  benchTop.position.set(0, 0.73, -1.55);
  scene.add(benchTop);
  // shelf with glassware
  const shelf = box(2.2, 0.05, 0.3, 0x8d6e4f);
  shelf.position.set(-1.3, 1.85, -1.85);
  scene.add(shelf);
  const glass = (c) => mat(c, { transparent: true, opacity: 0.75, roughness: 0.2 });
  [
    [0xb3e5fc, -2.1],
    [0xc8e6c9, -1.6],
    [0xffe0b2, -1.1],
    [0xe1bee7, -0.6],
  ].forEach(([c, x], i) => {
    const m =
      i % 2
        ? new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 20), glass(c))
        : new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.3, 20), glass(c));
    m.position.set(x, 2.02, -1.85);
    scene.add(m);
  });
  const sign = label('PHÒNG THÍ NGHIỆM\nCẩn thận: nước nóng!', 1.9, 0.5, {
    fg: '#1F3A5F',
    font: 'bold 80px Verdana',
    border: '#B0BEC5',
    px: 1024,
  });
  sign.position.set(0.45, 1.75, -1.95);
  scene.add(sign);
  // sink + tap on the right of the bench
  const sink = box(0.8, 0.08, 0.55, 0xcfd8dc);
  sink.position.set(1.75, 0.78, -1.5);
  scene.add(sink);
  const basin = box(0.64, 0.04, 0.4, 0xeceff1);
  basin.position.set(1.75, 0.83, -1.5);
  scene.add(basin);
  const pipe = cyl(0.035, 0.035, 0.45, 0x90a4ae);
  pipe.position.set(1.75, 1.05, -1.75);
  scene.add(pipe);
  const spout = cyl(0.03, 0.03, 0.25, 0x90a4ae);
  spout.rotation.x = Math.PI / 2;
  spout.position.set(1.75, 1.27, -1.64);
  scene.add(spout);
  const knob = box(0.1, 0.05, 0.05, 0x1e88e5);
  knob.position.set(1.75, 1.2, -1.75);
  scene.add(knob);
  const stream = cyl(0.015, 0.015, 0.4, 0x64b5f6, { transparent: true, opacity: 0.8 });
  stream.position.set(1.75, 1.05, -1.52);
  scene.add(stream);
  // tipped kettle, spilled water and steam
  const kettle = new THREE.Group();
  kettle.add(cyl(0.2, 0.24, 0.36, 0xeceff1, { metalness: 0.3, roughness: 0.35 }));
  const lid = cyl(0.12, 0.16, 0.06, 0x37474f);
  lid.position.y = 0.2;
  kettle.add(lid);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.03, 10, 24, Math.PI),
    mat(0x37474f),
  );
  handle.position.set(0, 0.2, 0);
  kettle.add(handle);
  const spoutK = cyl(0.03, 0.06, 0.24, 0xeceff1);
  spoutK.rotation.z = -1.0;
  spoutK.position.set(0.25, 0.04, 0);
  kettle.add(spoutK);
  kettle.rotation.set(0.2, -0.4, -1.45);
  kettle.position.set(-1.1, 0.98, -1.4);
  scene.add(kettle);
  const puddle = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 32),
    mat(0x81d4fa, { transparent: true, opacity: 0.7, roughness: 0.1 }),
  );
  puddle.rotation.x = -Math.PI / 2;
  puddle.scale.set(1.5, 0.8, 1);
  puddle.position.set(-0.6, 0.765, -1.35);
  scene.add(puddle);
  const steam = new THREE.Group();
  for (const [x, y, r] of [
    [-1.2, 1.3, 0.09],
    [-1.05, 1.45, 0.11],
    [-0.7, 1.15, 0.08],
    [-0.55, 1.32, 0.1],
    [-1.3, 1.55, 0.08],
  ]) {
    const s = sphere(r, 0xffffff, { transparent: true, opacity: 0.75 });
    s.position.set(x, y, -1.3);
    s.castShadow = false;
    steam.add(s);
  }
  scene.add(steam);
  const film = cyl(0.08, 0.08, 0.4, 0xfff8e1);
  film.rotation.z = Math.PI / 2;
  film.position.set(0.5, 0.85, -1.3);
  scene.add(film);
  // student on a stool, burnt right arm stretched out sideways
  camera.position.set(-0.1, 2.3, 4.4);
  camera.lookAt(-0.1, 0.9, -0.5);
  const stool = cyl(0.2, 0.16, 0.4, 0x607d8b);
  stool.position.set(0.95, 0.2, 0.0);
  scene.add(stool);
  const v = await model(CH('male-a'), { anim: 'idle', t: 0.4 });
  rotateArm(v, 'arm-right', ['z', -0.7]);
  bone(v, 'head').rotateZ(-0.12);
  v.position.set(0.3, 0, 0.9);
  v.rotation.y = 0.2;
  v.scale.setScalar(2.1);
  scene.add(v);
  scene.updateMatrixWorld(true);
  const arm = boneVerts(v, 'arm-right');
  const shoulder = worldPos(bone(v, 'arm-right'));
  const far = arm.reduce(
    (a, p) => (p.distanceTo(shoulder) > a.distanceTo(shoulder) ? p : a),
    shoulder,
  );
  const armBox = new THREE.Box3().setFromPoints(arm);
  const armSize = armBox.getSize(new THREE.Vector3());
  const center = armBox.getCenter(new THREE.Vector3());
  const along = (t) => {
    const p = shoulder.clone().lerp(far, t);
    const axis = far.clone().sub(shoulder).normalize();
    const off = center.clone().sub(shoulder);
    return p.add(off.sub(axis.clone().multiplyScalar(off.dot(axis))));
  };
  const thick = shoulder.distanceTo(far) * 0.36;
  const len = shoulder.distanceTo(far);
  const burnC = along(0.52);
  // Burn and watch are drawn as camera-facing decals on the arm so they stay readable.
  const toCam = camera.position.clone();
  const decal = (w, h, draw, at) => {
    const d = canvasPlane(w, h, draw, 256);
    d.material.depthTest = true;
    const p = at.clone();
    const n = toCam.clone().sub(p).normalize();
    p.addScaledVector(n, thick * 0.75);
    d.position.copy(p);
    d.lookAt(toCam);
    scene.add(d);
    return d;
  };
  const patch = decal(
    len * 0.62,
    len * 0.5,
    (g, w, h) => {
      const grd = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
      grd.addColorStop(0, 'rgba(229,57,53,0.95)');
      grd.addColorStop(0.75, 'rgba(239,83,80,0.85)');
      grd.addColorStop(1, 'rgba(239,83,80,0)');
      g.fillStyle = grd;
      g.beginPath();
      g.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, 7);
      g.fill();
      g.fillStyle = '#FFE9E0';
      g.strokeStyle = '#F8A99A';
      g.lineWidth = 6;
      for (const [x, y, r] of [
        [0.36, 0.42, 0.13],
        [0.62, 0.38, 0.1],
        [0.52, 0.66, 0.08],
      ]) {
        g.beginPath();
        g.arc(w * x, h * y, w * r, 0, 7);
        g.fill();
        g.stroke();
      }
    },
    along(0.42),
  );
  const watch = decal(
    len * 0.5,
    len * 0.5,
    (g, w, h) => {
      g.fillStyle = '#1F3A5F';
      g.fillRect(w * 0.3, 0, w * 0.4, h);
      g.beginPath();
      g.arc(w / 2, h / 2, w * 0.36, 0, 7);
      g.fill();
      g.fillStyle = '#fff';
      g.beginPath();
      g.arc(w / 2, h / 2, w * 0.27, 0, 7);
      g.fill();
      g.strokeStyle = '#1F3A5F';
      g.lineWidth = 10;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(w / 2, h / 2);
      g.lineTo(w / 2, h * 0.32);
      g.moveTo(w / 2, h / 2);
      g.lineTo(w * 0.63, h * 0.58);
      g.stroke();
    },
    along(0.8),
  );
  const pain = new THREE.Group();
  for (const [x, a] of [
    [-0.08, 0.3],
    [0, 0],
    [0.08, -0.3],
  ]) {
    const m = box(0.02, 0.1, 0.02, 0xe53935);
    m.position.set(x, 0.17, 0);
    m.rotation.z = a;
    pain.add(m);
  }
  pain.position.copy(patch.position).add(new THREE.Vector3(0, len * 0.35, 0));
  scene.add(pain);
  scene.updateMatrixWorld(true);
  const png = st.render();
  return {
    png,
    info: JSON.stringify({
      kettle: st.rectOf([kettle, steam], 1),
      arm: st.rectOf([patch], 1),
      watch: st.rectOf([watch], 1),
      stool: st.rectOf([stool], 0),
      tap: st.rectOf([pipe, spout, sink], 1),
    }),
  };
}
