// O/L Maths: solids. Exact geometry (these are mathematical shapes, built to their formulas).
import { viewer, THREE, tween } from '../engine/v3d.js';
const $ = s => document.querySelector(s);
const C = { cyl: 0xe0582e, cone: 0x16927f, sph: 0xdf9b16, prism: 0x3466cf, pyr: 0x45993f, water: 0x2f7fd0 };
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: .02, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, ...o });
function solid(geo, color, o) {
  const g = new THREE.Group(), m = new THREE.Mesh(geo, mat(color, o)); g.add(m);
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), new THREE.LineBasicMaterial({ color: 0xece6d6, transparent: true, opacity: .6 })));
  return g;
}
const SH = {
  cyl: () => solid(new THREE.CylinderGeometry(1, 1, 2, 96), C.cyl),
  cone: () => solid(new THREE.ConeGeometry(1, 2, 96), C.cone),
  sph: () => solid(new THREE.SphereGeometry(1.05, 64, 32), C.sph),
  prism: () => { const s = new THREE.Shape([new THREE.Vector2(-1, -.9), new THREE.Vector2(1, -.9), new THREE.Vector2(-1, .9)]);
    const g = new THREE.ExtrudeGeometry(s, { depth: 2, bevelEnabled: false }); g.translate(0, 0, -1); g.rotateY(Math.PI / 2.6); return solid(g, C.prism); },
  pyr: () => { const g = new THREE.ConeGeometry(1.3, 2, 4); g.rotateY(Math.PI / 4); return solid(g, C.pyr); }
};
const once = (id, f) => { let done = false; const el = $('#' + id); const s = el.closest('.slide'); s.addEventListener('slide:enter', () => { if (!done) { done = true; f(el); } }); if (s.classList.contains('on')) { done = true; f(el); } };

/* 1 cover */
once('v-cover', el => {
  const v = viewer(el, { env: .45, cam: [0, 2.2, 11], fov: 32 });
  const items = [['cyl', -1.3, .9, 0], ['cone', 1.4, 1.1, -1], ['sph', .2, -1.4, .8], ['prism', -1.9, -1.7, -1.4], ['pyr', 2.1, -1.5, -.2]];
  const objs = items.map(([k, x, y, z], i) => { const o = SH[k](); o.position.set(x, y, z); o.rotation.set(.3 * i, i, .15 * i); v.root.add(o); return o; });
  v.controls.enableZoom = false;
  v.onFrame((dt, t) => objs.forEach((o, i) => { o.rotation.y += dt * (.15 + i * .03); o.position.y += Math.sin(t * .8 + i) * .0015; }));
});

/* 2 family with names */
once('v-family', el => {
  const v = viewer(el, { env: .45, cam: [0, 2.2, 12.2], fov: 30 });
  const names = { cyl: ['Cylinder', 'සිලින්ඩරය'], prism: ['Triangular prism', 'ත්‍රිකෝණාකාර ප්‍රිස්මය'], cone: ['Cone', 'කේතුව'], pyr: ['Square pyramid', 'සමචතුරස්‍රාකාර පාද පිරමීඩය'], sph: ['Sphere', 'ගෝලය'] };
  const objs = Object.keys(names).map((k, i) => {
    const o = SH[k](); o.position.set((i - 2) * 3.4, 0, 0); v.root.add(o);
    v.label({ pos: [(i - 2) * 3.4, -1.75, 0], en: names[k][0], si: names[k][1], side: 'up', depth: 99 });
    return o;
  });
  v.labels.forEach(L => L.el.classList.add('up'));
  v.controls.enableZoom = false; v.controls.target.set(0, -.3, 0);
  v.onFrame(dt => objs.forEach(o => o.rotation.y += dt * .3));
});

/* 3 the cylinder opens into its net */
once('v-net', el => {
  const v = viewer(el, { env: .45, cam: [0, 1.2, 15.5], fov: 34, target: [0, .5, 0] });
  const r = 1.2, h = 2.4, g = new THREE.Group(); g.position.y = -h / 2 + .2; v.root.add(g);
  const wg = new THREE.PlaneGeometry(2 * Math.PI * r, h, 160, 1);
  const wall = new THREE.Mesh(wg, mat(C.cyl, { side: THREE.DoubleSide })); g.add(wall);
  const edge = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xece6d6 })); g.add(edge);
  const disc = (up) => {
    const p = new THREE.Group(); p.position.set(0, up ? h : 0, r);
    const d = solid(new THREE.CircleGeometry(r, 96), C.cone, { side: THREE.DoubleSide }); d.rotation.x = -Math.PI / 2; d.position.z = -r; p.add(d); g.add(p); return p;
  };
  const top = disc(true), bot = disc(false);
  const pos = wg.attributes.position, W = 2 * Math.PI * r, N = 161;
  const Lr = v.label({ pos: [0, 0, 0], en: 'length = 2πr', si: 'දිග = 2πr' }), Lh = v.label({ pos: [0, 0, 0], en: 'h', si: 'h' });
  function set(t) {
    const R = r / Math.max(1e-4, 1 - t), pts = [];
    for (let i = 0; i < pos.count; i++) {
      const s = (i % N) / (N - 1) * W - W / 2, y = i < N ? h : 0, ph = s / R;
      pos.setXYZ(i, R * Math.sin(ph), y, r - R * (1 - Math.cos(ph)));
    }
    pos.needsUpdate = true; wg.computeVertexNormals();
    for (let i = 0; i < N; i++) pts.push(new THREE.Vector3().fromBufferAttribute(pos, i));
    for (let i = 2 * N - 1; i >= N; i--) pts.push(new THREE.Vector3().fromBufferAttribute(pos, i));
    edge.geometry.setFromPoints(pts);
    top.rotation.x = t * Math.PI / 2; bot.rotation.x = -t * Math.PI / 2;
    const yo = g.position.y;
    Lr.pos = [W * .28, yo - .02, r + .01]; Lh.pos = [W / 2 + .05, yo + h / 2, r]; Lr.hidden = Lh.hidden = t < .97;
    Lr.depth = Lh.depth = 99;
    $('#openOut').textContent = Math.round(t * 100) + '%';
  }
  $('#open').addEventListener('input', e => set(+e.target.value)); set(0);
  v.controls.enableZoom = false;
  // the label positions are in root space; set() keeps them in step
});

/* 4 total surface area calculator + a cylinder in proportion */
once('v-tsa', el => {
  const v = viewer(el, { env: .45, cam: [0, 3, 9], fov: 30 });
  const cyl = solid(new THREE.CylinderGeometry(1, 1, 1, 96), C.cyl); v.root.add(cyl);
  const tr = $('#tr'), th = $('#th');
  const f = x => x.toLocaleString('en-US', { maximumFractionDigits: 2 });
  function set() {
    const r = +tr.value, h = +th.value, pi = 22 / 7;
    $('#trO').textContent = r; $('#thO').textContent = h;
    document.querySelectorAll('.vr').forEach(e => e.textContent = r); document.querySelectorAll('.vh').forEach(e => e.textContent = h);
    const a = 2 * pi * r * r, b = 2 * pi * r * h;
    $('#c1').textContent = f(a) + ' cm²'; $('#c2').textContent = f(b) + ' cm²'; $('#c3').textContent = f(a + b) + ' cm²';
    const k = 3.2 / Math.max(2 * r, h); cyl.scale.set(r * k, h * k, r * k);
  }
  tr.addEventListener('input', set); th.addEventListener('input', set); set();
  v.controls.enableZoom = false; v.onFrame(dt => cyl.rotation.y += dt * .3);
});

/* 6 prism built from 1 cm slices */
once('v-prism', el => {
  const v = viewer(el, { env: .45, cam: [4.2, 2.6, 5.6], fov: 34 });
  const u = .32, sh = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(6 * u, 0), new THREE.Vector2(0, 4 * u)]);
  const slice = new THREE.ExtrudeGeometry(sh, { depth: u * .94, bevelEnabled: false });
  const g = new THREE.Group(); g.position.set(-3 * u, -2 * u, 0); v.root.add(g);
  const slices = Array.from({ length: 12 }, (_, i) => { const s = solid(slice, i % 2 ? 0x2953ad : C.prism); s.position.z = -i * u; g.add(s); return s; });
  const front = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: 0xff8a5b, side: THREE.DoubleSide })); front.position.z = u * .95; g.add(front);
  v.label({ obj: front, en: 'A = 12 cm²', si: 'A = 12 cm²', depth: 99 });
  v.controls.target.set(0, 0, -1.6); v.controls.enableZoom = false;
  const pl = $('#pl');
  function set() { const l = +pl.value; slices.forEach((s, i) => s.visible = i < l); $('#plO').textContent = l; $('#pv').textContent = 12 * l; }
  pl.addEventListener('input', set); set();
});

/* 7 three cones of water fill the cylinder */
once('v-cone', el => {
  const v = viewer(el, { env: .45, cam: [0, 3.4, 14], fov: 32 });
  const r = 1.3, h = 3;
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 96, 1, true), mat(0xdfe8f0, { transparent: true, opacity: .07, depthWrite: false, side: THREE.DoubleSide }));
  cyl.position.set(-1.6, h / 2 - 1.5, 0); v.root.add(cyl);
  const rim = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(r, r, h, 96), 25), new THREE.LineBasicMaterial({ color: 0xece6d6, transparent: true, opacity: .7 }));
  rim.position.copy(cyl.position); v.root.add(rim);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(r * .985, r * .985, 1, 96), mat(C.water, { transparent: true, opacity: .82 }));
  water.position.set(-1.6, -1.5, 0); water.scale.y = .0001; v.root.add(water);
  const coneG = new THREE.ConeGeometry(r, h, 96); coneG.rotateX(Math.PI); // point down, open top up
  const cone = solid(coneG, C.cone); const home = new THREE.Vector3(2.1, h / 2 - 1.5, 0); cone.position.copy(home); v.root.add(cone);
  let k = 0, busy = false;
  const setLevel = f => { water.scale.y = Math.max(.0001, f * h); water.position.y = -1.5 + f * h / 2; };
  $('#pour').addEventListener('click', async () => {
    if (busy || k >= 3) return; busy = true;
    const a = home.clone(), b = new THREE.Vector3(-.1, h + .2, 0);
    await tween(700, x => { cone.position.lerpVectors(a, b, x); cone.rotation.z = x * 1.9; });
    const f0 = k / 3, f1 = (k + 1) / 3;
    await tween(900, x => setLevel(f0 + (f1 - f0) * x));
    k++; $('#fill').textContent = k;
    await tween(700, x => { cone.position.lerpVectors(b, a, x); cone.rotation.z = (1 - x) * 1.9; });
    busy = false;
  });
  $('#empty').addEventListener('click', () => { if (busy) return; k = 0; setLevel(0); $('#fill').textContent = 0; });
  v.controls.enableZoom = false; v.controls.target.set(.2, 1.1, 0);
});

/* 8 sphere inside its cylinder */
once('v-sphere', el => {
  const v = viewer(el, { env: .3, exposure: .78, cam: [0, 2.4, 9.5], fov: 32 });
  const r = 1.6;
  const s = solid(new THREE.SphereGeometry(r, 64, 32), 0xc98a12, { roughness: .62 }); v.root.add(s);
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2 * r, 96, 1, true), mat(0xdfe8f0, { transparent: true, opacity: .07, depthWrite: false, side: THREE.DoubleSide })); v.root.add(cyl);
  v.root.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(r, r, 2 * r, 96), 25), new THREE.LineBasicMaterial({ color: 0xece6d6, transparent: true, opacity: .75 })));
  const rl = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, r, 8), new THREE.MeshBasicMaterial({ color: 0xece6d6, depthTest: false })); rl.rotation.z = Math.PI / 2; rl.position.x = r / 2; rl.position.z = r * .02; rl.renderOrder = 5; v.root.add(rl);
  v.label({ pos: [r / 2, .05, 0], en: 'r', si: 'r', side: 'up', depth: 99 }); v.labels[0].el.classList.add('up');
  v.label({ pos: [r + .05, r * .55, 0], en: '2r', si: '2r', depth: 99 });
  v.controls.enableZoom = false; v.onFrame(dt => s.rotation.y += dt * .3);
});

/* 5 the water tank, drawn to the question's sizes (r 70 cm, h 100 cm) */
once('v-tank', el => {
  const v = viewer(el, { env: .45, cam: [0, 2, 6.2], fov: 30 });
  const k = 1 / 60, r = 70 * k, h = 100 * k;
  const t = solid(new THREE.CylinderGeometry(r, r, h, 96), 0x6f8796, { metalness: .35, roughness: .45 }); v.root.add(t);
  v.label({ pos: [r / 2, h / 2 + .02, 0], en: 'r = 70 cm', si: 'r = 70 cm', side: 'up', depth: 99 });
  v.label({ pos: [r + .05, 0, 0], en: 'h = 1 m', si: 'h = 1 m', depth: 99 });
  const rl = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, h / 2 + .01, 0), new THREE.Vector3(r, h / 2 + .01, 0)]), new THREE.LineBasicMaterial({ color: 0xff8a5b }));
  v.root.add(rl); v.controls.enableZoom = false;
});
