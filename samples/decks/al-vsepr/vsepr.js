// A/L Chemistry: VSEPR shapes. Ball-and-stick molecules built from exact directions and real bond angles.
import { viewer, THREE } from '../engine/v3d.js';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const V = (x, y, z) => new THREE.Vector3(x, y, z).normalize();
const deg = d => d * Math.PI / 180;

// colours follow the CPK idea, deepened so nothing turns into a white blob
const EL = { H: [0xb8b3aa, .26], C: [0x4b5157, .42], N: [0x3c5fd8, .4], O: [0xd8402e, .38], F: [0x5f9f32, .32], Cl: [0x23914a, .38],
  Br: [0xa33a2c, .42], Be: [0x9fbf3a, .4], B: [0xd99a8c, .4], P: [0xe2801e, .44], S: [0xe0b92a, .44], Xe: [0x3d97a8, .5] };

const sixD = [V(1, 0, 0), V(-1, 0, 0), V(0, 1, 0), V(0, -1, 0), V(0, 0, 1), V(0, 0, -1)];
const eq = k => V(Math.cos(deg(90 + 120 * k)), 0, Math.sin(deg(90 + 120 * k)));
const tet = [V(0, 1, 0), ...[0, 1, 2].map(k => { const a = deg(120 * k + 90); return V(.9428 * Math.cos(a), -1 / 3, .9428 * Math.sin(a)); })];
// three bonds round a downward axis with a given bond angle (NH3: 107°)
function pyramid(angle) { const c2 = (Math.cos(deg(angle)) + .5) / 1.5, c = Math.sqrt(c2), s = Math.sqrt(1 - c2);
  return [0, 1, 2].map(k => { const a = deg(120 * k + 90); return V(s * Math.cos(a), -c, s * Math.sin(a)); }); }

const MOL = {
  BeCl2: { c: 'Be', b: [['Cl', V(1, 0, 0)], ['Cl', V(-1, 0, 0)]], lp: [], arcs: [[0, 1, '180°']] },
  BF3: { c: 'B', b: [0, 1, 2].map(k => ['F', V(Math.cos(deg(90 + 120 * k)), Math.sin(deg(90 + 120 * k)), 0)]), lp: [], arcs: [[1, 2, '120°']] },
  CH4: { c: 'C', b: tet.map(d => ['H', d]), lp: [], arcs: [[0, 1, '109.5°']] },
  PCl5: { c: 'P', b: [['Cl', V(0, 1, 0)], ['Cl', V(0, -1, 0)], ...[0, 1, 2].map(k => ['Cl', eq(k)])], lp: [], arcs: [[0, 2, '90°'], [2, 3, '120°']] },
  SF6: { c: 'S', b: sixD.map(d => ['F', d]), lp: [], arcs: [[0, 2, '90°']] },
  NH3: { c: 'N', b: pyramid(107).map(d => ['H', d]), lp: [V(0, 1, 0)], arcs: [[0, 1, '107°']] },
  H2O: { c: 'O', b: [['H', V(Math.sin(deg(52.25)), -Math.cos(deg(52.25)), 0)], ['H', V(-Math.sin(deg(52.25)), -Math.cos(deg(52.25)), 0)]],
    lp: [V(0, Math.cos(deg(57.5)), Math.sin(deg(57.5))), V(0, Math.cos(deg(57.5)), -Math.sin(deg(57.5)))], arcs: [[0, 1, '104.5°']] },
  SF4: { c: 'S', b: [['F', V(0, 1, 0)], ['F', V(0, -1, 0)], ['F', eq(1)], ['F', eq(2)]], lp: [eq(0)], arcs: [] },
  ClF3: { c: 'Cl', b: [['F', V(0, 1, 0)], ['F', V(0, -1, 0)], ['F', eq(0)]], lp: [eq(1), eq(2)], arcs: [] },
  XeF2: { c: 'Xe', b: [['F', V(0, 1, 0)], ['F', V(0, -1, 0)]], lp: [eq(0), eq(1), eq(2)], arcs: [] },
  BrF5: { c: 'Br', b: [V(0, 1, 0), V(1, 0, 0), V(-1, 0, 0), V(0, 0, 1), V(0, 0, -1)].map(d => ['F', d]), lp: [V(0, -1, 0)], arcs: [] },
  XeF4: { c: 'Xe', b: [V(1, 0, 0), V(-1, 0, 0), V(0, 0, 1), V(0, 0, -1)].map(d => ['F', d]), lp: [V(0, 1, 0), V(0, -1, 0)], arcs: [[0, 2, '90°']] }
};

const mat = c => new THREE.MeshStandardMaterial({ color: c, roughness: .42, metalness: .05 });
const bondMat = new THREE.MeshStandardMaterial({ color: 0x9aa39c, roughness: .5 });
const lpMat = new THREE.MeshStandardMaterial({ color: 0xe8c45a, roughness: .6, transparent: true, opacity: .42, depthWrite: false });
const UP = new THREE.Vector3(0, 1, 0);

function build(key, v, o = {}) {
  const m = MOL[key], g = new THREE.Group(), [cc, cr] = EL[m.c];
  g.add(new THREE.Mesh(new THREE.SphereGeometry(cr, 48, 24), mat(cc)));
  const L = o.len || 1.45;
  m.b.forEach(([e, d]) => {
    const [col, r] = EL[e], len = e === 'H' ? L * .78 : L;
    const a = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 20), mat(col)); a.position.copy(d).multiplyScalar(len); g.add(a);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(.075, .075, len, 16), bondMat); b.position.copy(d).multiplyScalar(len / 2); b.quaternion.setFromUnitVectors(UP, d); g.add(b);
  });
  m.lp.forEach(d => {
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), lpMat); lobe.scale.set(.3, .62, .3); lobe.position.copy(d).multiplyScalar(.78); lobe.quaternion.setFromUnitVectors(UP, d); g.add(lobe);
    [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(.055, 12, 8), mat(0x2a2f2c)); const side = new THREE.Vector3(1, 0, 0).applyQuaternion(lobe.quaternion); e.position.copy(d).multiplyScalar(.95).addScaledVector(side, .09 * s); g.add(e); });
  });
  if (o.arcs !== false) m.arcs.forEach(([i, j, txt]) => {
    const a = m.b[i][1], b = m.b[j][1], R = .62, pts = [];
    for (let k = 0; k <= 32; k++) pts.push(new THREE.Vector3().copy(a).lerp(b, k / 32).normalize().multiplyScalar(R));
    if (a.dot(b) < -.99) { pts.length = 0; for (let k = 0; k <= 32; k++) { const t = Math.PI * k / 32; pts.push(new THREE.Vector3(Math.cos(t) * R, Math.sin(t) * R, 0)); } }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xa6d854, depthTest: false })));
    const mid = pts[16].clone().normalize().multiplyScalar(R + .32);
    if (v) { const holder = new THREE.Object3D(); holder.position.copy(mid); g.add(holder); v.label({ obj: holder, en: txt, si: txt, depth: 9, side: 'up' }); }
  });
  return g;
}
const once = (id, f) => { let done = false; const el = $('#' + id); const s = el.closest('.slide'); s.addEventListener('slide:enter', () => { if (!done) { done = true; f(el); } }); if (s.classList.contains('on')) { done = true; f(el); } };
const view = (el, cam = [2.7, 2, 6.6]) => { const v = viewer(el, { env: .3, exposure: .88, cam, fov: 32 }); v.controls.enableZoom = false; return v; };

once('v-cover', el => { const v = view(el, [2.4, 1.8, 5.6]); const m = build('SF6', null, { arcs: false }); v.root.add(m); v.onFrame(dt => { m.rotation.y += dt * .25; m.rotation.x += dt * .08; }); });

/* 2 four "balloons" round a centre: the pairs push apart into a tetrahedron */
once('v-idea', el => {
  const v = view(el, [2.2, 1.6, 5.8]); const g = new THREE.Group(); v.root.add(g);
  g.add(new THREE.Mesh(new THREE.SphereGeometry(.34, 40, 20), mat(0x4b5157)));
  tet.forEach(d => { const lobe = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20), lpMat.clone()); lobe.material.opacity = .55; lobe.scale.set(.34, .7, .34); lobe.position.copy(d).multiplyScalar(.85); lobe.quaternion.setFromUnitVectors(UP, d); g.add(lobe); });
  v.onFrame(dt => g.rotation.y += dt * .3);
});

/* 4 explorer */
once('v-explore', el => {
  const v = view(el); let cur = null;
  const D = { 2: ['BeCl2', 'linear', 'රේඛීය', '180°', 'BeCl₂'], 3: ['BF3', 'trigonal planar', 'තලීය ත්‍රිකෝණාකාර', '120°', 'BF₃'], 4: ['CH4', 'tetrahedral', 'චතුස්තලීය', '109.5°', 'CH₄'],
    5: ['PCl5', 'trigonal bipyramidal', 'ත්‍රිකෝණාකාර ද්විපිරමීඩාකාර', '90°, 120°', 'PCl₅'], 6: ['SF6', 'octahedral', 'අෂ්ටතලීය', '90°', 'SF₆'] };
  function show(n) {
    if (cur) v.root.remove(cur); v.clearLabels(); const d = D[n]; cur = build(d[0], v); v.root.add(cur);
    const f = k => $(`#info [data-f="${k}"]`);
    f('n').textContent = n; f('shape').innerHTML = `<span lang="en">${d[1]}</span><span lang="si">${d[2]}</span>`; f('ang').textContent = d[3]; f('ex').textContent = d[4];
    $$('#pick button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.n === n));
  }
  $$('#pick button').forEach(b => b.addEventListener('click', () => show(+b.dataset.n))); show(4);
});

/* 5 CH4, NH3, H2O side by side */
once('v-trio', el => {
  const v = view(el, [0, 1.1, 8.4]); const ms = ['CH4', 'NH3', 'H2O'].map((k, i) => { const m = build(k, v); m.position.x = (i - 1) * 4.3; v.root.add(m); return m; });
  v.controls.enableRotate = false; v.onFrame(dt => ms.forEach(m => m.rotation.y = Math.sin(performance.now() / 2600) * .5));
});

/* 6, 7 families with a picker */
function family(id, pick, nameEl, names, first) {
  once(id, el => {
    const v = view(el); let cur = null;
    function show(k) { if (cur) v.root.remove(cur); v.clearLabels(); cur = build(k, v); v.root.add(cur);
      $(nameEl).innerHTML = `<span lang="en">${names[k][0]}</span><span lang="si">${names[k][1]}</span>`;
      $$(pick + ' button').forEach(b => b.setAttribute('aria-pressed', b.dataset.m === k)); }
    $$(pick + ' button').forEach(b => b.addEventListener('click', () => show(b.dataset.m))); show(first);
    v.onFrame(dt => cur && (cur.rotation.y += dt * .2));
  });
}
family('v-five', '#pick5', '#name5', { PCl5: ['trigonal bipyramidal', 'ත්‍රිකෝණාකාර ද්විපිරමීඩාකාර'], SF4: ['see-saw', 'සී-සෝ හැඩය'], ClF3: ['T-shaped', 'T හැඩය'], XeF2: ['linear', 'රේඛීය'] }, 'SF4');
family('v-six', '#pick6', '#name6', { SF6: ['octahedral', 'අෂ්ටතලීය'], BrF5: ['square pyramidal', 'සමචතුරස්‍ර පිරමීඩාකාර'], XeF4: ['square planar', 'සමචතුරස්‍ර තලීය'] }, 'XeF4');

once('v-end', el => { const v = view(el, [2.4, 2.8, 6.8]); const m = build('XeF4', null, { arcs: false }); v.root.add(m); v.onFrame(dt => m.rotation.y += dt * .25); });
