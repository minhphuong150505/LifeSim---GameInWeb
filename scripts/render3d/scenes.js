import { THREE, model, makeStage, bbox, bone } from './lib.js';
import { mascot } from './mascot.js';
import { classroom, canteen, lab } from './rooms.js';
const CH = (n) => `/chars/character-${n}.glb`;
const POSES = {
  hero: { anim: 'idle', t: 0.3, rotY: 0.35, arms: { 'arm-right': ['z', -2.0] } },
  happy: {
    anim: 'idle',
    t: 0.3,
    rotY: 0.2,
    arms: { 'arm-right': ['z', -1.3], 'arm-left': ['z', 1.3] },
  },
  worried: {
    anim: 'idle',
    t: 0.3,
    rotY: 0.25,
    arms: { 'arm-right': ['z', -1.9, 'y', 0.6], 'arm-left': ['z', 1.9, 'y', -0.6] },
    head: ['x', 0.15],
  },
  thinking: {
    anim: 'idle',
    t: 0.3,
    rotY: -0.3,
    arms: { 'arm-left': ['y', -1.2, 'z', 0.9] },
    head: ['z', 0.12],
  },
};
async function poster(name) {
  const st = makeStage(900, { alpha: true });
  const p = POSES[name];
  const { c } = await mascot({ anim: p.anim, t: p.t });
  for (const [k, ops] of Object.entries(p.arms))
    for (let i = 0; i < ops.length; i += 2) bone(c, k)['rotate' + ops[i].toUpperCase()](ops[i + 1]);
  if (p.head) bone(c, 'head')['rotate' + p.head[0].toUpperCase()](p.head[1]);
  c.rotation.y = p.rotY;
  st.scene.add(c);
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 40),
    new THREE.MeshBasicMaterial({ color: 0x1f3a5f, transparent: true, opacity: 0.12 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  st.scene.add(shadow);
  st.camera.fov = 26;
  st.camera.updateProjectionMatrix();
  st.camera.position.set(0, 1.0, 4.2);
  st.camera.lookAt(0, 0.5, 0);
  return { png: st.render() };
}
const AV_BG = ['#FFE0DC', '#FFF1C9', '#DDEBFF', '#DFF3E3'];
const ALL = [
  'female-a',
  'female-b',
  'female-c',
  'female-d',
  'female-e',
  'female-f',
  'male-a',
  'male-b',
  'male-c',
  'male-d',
  'male-e',
  'male-f',
];
window.SCENES = {
  posterHero: () => poster('hero'),
  posterHappy: () => poster('happy'),
  posterWorried: () => poster('worried'),
  posterThinking: () => poster('thinking'),
  ...Object.fromEntries(
    ALL.map((n, i) => [
      `avatar${i + 1}`,
      async () => {
        const st = makeStage(512, { alpha: true });
        const c =
          n === 'female-e'
            ? (await mascot({ anim: 'idle', t: 0.3 })).c
            : await model(CH(n), { anim: 'idle', t: 0.3 });
        c.rotation.y = 0.3;
        st.scene.add(c);
        st.camera.fov = 22;
        st.camera.updateProjectionMatrix();
        st.camera.position.set(0, 0.95, 2.6);
        st.camera.lookAt(0, 0.6, 0);
        return { png: st.render() };
      },
    ]),
  ),

  classroom,
  canteen,
  lab,
  async dieTop() {
    const st = makeStage(800);
    const c = await model(CH('male-a'), { anim: 'die', t: 0.999 });
    st.scene.add(c);
    st.camera.position.set(0, 3, 0.01);
    st.camera.lookAt(0, 0, 0);
    return { png: st.render() };
  },
  async boneTest() {
    const st = makeStage(1200, { alpha: true });
    const tests = [
      { 'arm-right': ['z', 1.2], 'arm-left': ['z', -1.2] },
      { 'arm-right': ['z', -1.2], 'arm-left': ['z', 1.2] },
      { 'arm-right': ['y', 1.3], 'arm-left': ['y', -1.3] },
      { 'arm-right': ['y', -1.3], 'arm-left': ['y', 1.3] },
      { 'arm-right': ['x', 1.2], 'arm-left': ['x', 1.2] },
      { 'arm-right': ['x', -1.2], 'arm-left': ['x', -1.2] },
    ];
    for (let i = 0; i < tests.length; i++) {
      const { c } = await mascot({ anim: 'idle', t: 0.3 });
      for (const [k, v] of Object.entries(tests[i]))
        for (let q = 0; q < v.length; q += 2) bone(c, k)['rotate' + v[q].toUpperCase()](v[q + 1]);
      c.rotation.y = 0.0;
      c.position.set((i % 3) * 1.5 - 1.5, i < 3 ? 1.0 : -0.7, 0);
      st.scene.add(c);
    }
    st.camera.position.set(0, 0.5, 7);
    st.camera.lookAt(0, 0.4, 0);
    return { png: st.render() };
  },
  async mascotTest() {
    const st = makeStage(1200, { alpha: true });
    const views = [
      [0.3, 'emote-yes', 0.2],
      [0.3, 'emote-yes', 0.5],
      [0.3, 'interact-right', 0.5],
      [Math.PI / 2, 'die', 0.99],
    ];
    for (let i = 0; i < views.length; i++) {
      const { c } = await mascot({ anim: views[i][1], t: views[i][2] });
      c.rotation.y = views[i][0];
      c.position.set((i % 2) * 1.6 - 0.8, i < 2 ? 1.1 : -0.6, 0);
      st.scene.add(c);
    }
    st.camera.position.set(0, 0.6, 7);
    st.camera.lookAt(0, 0.5, 0);
    return { png: st.render() };
  },
  async lineup() {
    const st = makeStage(1600);
    const names = [
      'female-a',
      'female-b',
      'female-c',
      'female-d',
      'female-e',
      'female-f',
      'male-a',
      'male-b',
      'male-c',
      'male-d',
      'male-e',
      'male-f',
    ];
    for (let i = 0; i < names.length; i++) {
      const c = await model(CH(names[i]), { anim: 'idle', t: 0.1 });
      c.position.set((i % 6) * 1.1 - 2.75, i < 6 ? 1.3 : 0, 0);
      st.scene.add(c);
      if (i === 0) window.BB = bbox(c);
    }
    st.camera.position.set(0, 1.3, 9);
    st.camera.lookAt(0, 1.0, 0);
    return { png: st.render(), info: JSON.stringify(window.BB) };
  },
};
window.READY = true;
