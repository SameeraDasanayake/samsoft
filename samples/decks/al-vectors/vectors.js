// A/L Combined Maths: vectors on an i, j grid. Drag the arrow heads (snaps to whole numbers). 3D cover in three.js.
import { viewer, THREE } from '../engine/v3d.js';
const $ = s => document.querySelector(s);
const C = { a: '#2f6bdb', b: '#e8590c', r: '#138a44', chalk: '#121826', dim: '#6c7488', grid: 'rgba(18,24,38,.08)', axis: 'rgba(18,24,38,.42)' };
const fmt = n => (Math.round(n * 100) / 100).toString().replace('-', '−');
const ij = (x, y) => `${fmt(x)}i ${y < 0 ? '−' : '+'} ${fmt(Math.abs(y))}j`;

// a grid plane with draggable points; world units are whole numbers
function plane(id, o) {
  const c = $('#' + id), x = c.getContext('2d'); c.classList.add('nodrag');
  const h = o.handles; let W = 0, H = 0, k = 1, drag = null;
  const P = (wx, wy) => [W / 2 + (wx - (o.cx || 0)) * k, H / 2 - (wy - (o.cy || 0)) * k];
  const Q = (px, py) => [(px - W / 2) / k + (o.cx || 0), -(py - H / 2) / k + (o.cy || 0)];
  function draw() {
    x.clearRect(0, 0, W, H);
    const [x0, y1] = Q(0, 0), [x1, y0] = Q(W, H);
    x.lineWidth = 1; x.strokeStyle = C.grid;
    for (let g = Math.ceil(x0); g <= x1; g++) { x.beginPath(); x.moveTo(...P(g, y0)); x.lineTo(...P(g, y1)); x.stroke(); }
    for (let g = Math.ceil(y0); g <= y1; g++) { x.beginPath(); x.moveTo(...P(x0, g)); x.lineTo(...P(x1, g)); x.stroke(); }
    x.strokeStyle = C.axis; x.lineWidth = 2; x.beginPath(); x.moveTo(...P(x0, 0)); x.lineTo(...P(x1, 0)); x.moveTo(...P(0, y0)); x.lineTo(...P(0, y1)); x.stroke();
    x.font = '600 18px "JetBrains Mono", monospace'; x.fillStyle = C.dim; x.fillText('O', ...P(-.45, -.45));
    o.draw(x, P, h);
    Object.entries(h).forEach(([n, v]) => { if (o.fixed && o.fixed.includes(n)) return; x.fillStyle = 'rgba(236,230,214,.18)'; x.beginPath(); x.arc(...P(...v), 16, 0, 7); x.fill(); });
  }
  function fit() { W = c.offsetWidth; H = c.offsetHeight; c.width = W * 2; c.height = H * 2; x.setTransform(2, 0, 0, 2, 0, 0); k = Math.min(W / (2 * o.rx), H / (2 * o.ry)); draw(); }
  const at = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
  c.addEventListener('pointerdown', e => { const [px, py] = at(e); let best = 30;
    Object.entries(h).forEach(([n, v]) => { if (o.fixed && o.fixed.includes(n)) return; const [hx, hy] = P(...v), d = Math.hypot(hx - px, hy - py); if (d < best) { best = d; drag = n; } });
    if (drag) { c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  c.addEventListener('pointermove', e => { if (!drag) return; const [wx, wy] = Q(...at(e)); const nx = Math.round(wx), ny = Math.round(wy);
    if (nx === 0 && ny === 0 && !o.allowZero) return; if (nx !== h[drag][0] || ny !== h[drag][1]) { h[drag] = [nx, ny]; draw(); o.change && o.change(h); } });
  addEventListener('pointerup', () => drag = null);
  new ResizeObserver(fit).observe(c);
  o.change && o.change(h);
  return { redraw() { draw(); o.change && o.change(h); } };
}
function arrow(x, P, from, to, col, label, w = 4) {
  const [ax, ay] = P(...from), [bx, by] = P(...to), ang = Math.atan2(by - ay, bx - ax), L = Math.hypot(bx - ax, by - ay);
  if (L < 2) return;
  x.strokeStyle = x.fillStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx - 14 * Math.cos(ang), by - 14 * Math.sin(ang)); x.stroke();
  x.beginPath(); x.moveTo(bx, by); x.lineTo(bx - 22 * Math.cos(ang - .38), by - 22 * Math.sin(ang - .38)); x.lineTo(bx - 22 * Math.cos(ang + .38), by - 22 * Math.sin(ang + .38)); x.closePath(); x.fill();
  if (label) { x.font = 'italic 800 30px "Abhaya Libre", serif'; const mx = (ax + bx) / 2 - 22 * Math.sin(ang), my = (ay + by) / 2 + 22 * Math.cos(ang) * -1; x.textAlign = 'center'; x.fillText(label, mx, my + 10); x.textAlign = 'left'; }
}
const dash = (x, P, a, b, col) => { x.setLineDash([7, 7]); x.strokeStyle = col; x.lineWidth = 2; x.beginPath(); x.moveTo(...P(...a)); x.lineTo(...P(...b)); x.stroke(); x.setLineDash([]); };

/* 3 components */
plane('c-comp', { rx: 7, ry: 5.5, cx: 2, cy: 1.5, handles: { a: [4, 3] },
  draw(x, P, h) { const [ax, ay] = h.a; dash(x, P, [ax, 0], [ax, ay], C.dim); dash(x, P, [0, ay], [ax, ay], C.dim);
    arrow(x, P, [0, 0], [ax, 0], 'rgba(121,168,255,.55)', '', 3); arrow(x, P, [0, 0], [0, ay], 'rgba(255,138,91,.6)', '', 3); arrow(x, P, [0, 0], h.a, C.a, 'a', 5);
    x.font = '600 20px "JetBrains Mono", monospace'; x.fillStyle = C.a; x.textAlign = 'center'; x.fillText(fmt(ax) + 'i', ...P(ax / 2, -.6)); x.fillStyle = C.b; x.fillText(fmt(ay) + 'j', ...P(-.7, ay / 2)); x.textAlign = 'left'; },
  change(h) { const [ax, ay] = h.a, m = Math.hypot(ax, ay), t = Math.atan2(ay, ax) * 180 / Math.PI, o = n => document.querySelector(`#t-comp [data-o="${n}"]`);
    o('a').textContent = ij(ax, ay); o('m').textContent = Number.isInteger(m) ? fmt(m) : `√${ax * ax + ay * ay} ≈ ${fmt(m)}`; o('t').textContent = fmt(t) + '°';
    o('u').textContent = Number.isInteger(m) ? `${fmt(ax)}/${m} i ${ay < 0 ? '−' : '+'} ${fmt(Math.abs(ay))}/${m} j` : `(${ij(ax, ay)}) / √${ax * ax + ay * ay}`; } });

/* 4 addition: triangle both ways = parallelogram */
plane('c-add', { rx: 7, ry: 5.5, cx: 2.5, cy: 2, handles: { a: [4, 1], b: [1, 3] },
  draw(x, P, h) { const [a, b] = [h.a, h.b], s = [a[0] + b[0], a[1] + b[1]];
    arrow(x, P, a, s, 'rgba(255,138,91,.5)', '', 3); arrow(x, P, b, s, 'rgba(121,168,255,.5)', '', 3);
    arrow(x, P, [0, 0], s, C.r, 'a + b', 5); arrow(x, P, [0, 0], a, C.a, 'a', 5); arrow(x, P, [0, 0], b, C.b, 'b', 5); },
  change(h) { const s = [h.a[0] + h.b[0], h.a[1] + h.b[1]]; $('#o-add').innerHTML = `a = ${ij(...h.a)}<br>b = ${ij(...h.b)}<br><span style="color:${C.r}">a + b = ${ij(...s)}</span>`; } });

/* 5 λa and a − b */
{
  const lam = $('#lam');
  const pl = plane('c-scale', { rx: 5.5, ry: 4.5, cx: 2, cy: 1.5, handles: { a: [2, 1], b: [1, 2] },
    draw(x, P, h) { const L = +lam.value, a = h.a, b = h.b, la = [a[0] * L, a[1] * L], d = [a[0] - b[0], a[1] - b[1]];
      arrow(x, P, [0, 0], la, 'rgba(111,208,140,.85)', 'λa', 7); arrow(x, P, [0, 0], a, C.a, 'a', 4);
      arrow(x, P, [0, 0], b, C.b, 'b', 4); arrow(x, P, b, a, C.chalk, 'a − b', 3); },
    change(h) { const L = +lam.value, a = h.a, b = h.b; $('#lamO').textContent = fmt(L);
      $('#o-scale').innerHTML = `λa = ${ij(a[0] * L, a[1] * L)}<br>a − b = ${ij(a[0] - b[0], a[1] - b[1])}`; } });
  lam.addEventListener('input', () => pl.redraw());
}

/* 6 position vectors and the section formula */
{
  const r = $('#ratio');
  const pl = plane('c-pos', { rx: 7, ry: 5.5, cx: 2.5, cy: 2, handles: { A: [-1, 3], B: [5, 1] },
    draw(x, P, h) { const m = +r.value, n = 1, A = h.A, B = h.B, p = [(n * A[0] + m * B[0]) / (m + n), (n * A[1] + m * B[1]) / (m + n)];
      arrow(x, P, [0, 0], A, C.a, 'a', 4); arrow(x, P, [0, 0], B, C.b, 'b', 4); arrow(x, P, A, B, C.chalk, 'b − a', 3);
      const shown = document.querySelector('#ratio').closest('.slider').classList.contains('hide');
      if (!shown) { arrow(x, P, [0, 0], p, C.r, 'p', 3); x.fillStyle = C.r; x.beginPath(); x.arc(...P(...p), 7, 0, 7); x.fill(); }
      x.font = '800 26px "Abhaya Libre", serif'; x.fillStyle = C.chalk; x.fillText('A', P(...A)[0] + 14, P(...A)[1] - 10); x.fillText('B', P(...B)[0] + 14, P(...B)[1] - 10); if (!shown) x.fillText('P', P(...p)[0] + 12, P(...p)[1] + 26); },
    change() { $('#ratioO').textContent = r.value + ' : 1'; } });
  r.addEventListener('input', () => pl.redraw());
  new MutationObserver(() => pl.redraw()).observe(r.closest('.slider'), { attributes: true });
}

/* 7 scalar product */
plane('c-dot', { rx: 7, ry: 5.5, cx: 1.5, cy: 1.5, handles: { a: [4, 1], b: [-1, 4] },
  draw(x, P, h) { const a = h.a, b = h.b, ta = Math.atan2(a[1], a[0]), tb = Math.atan2(b[1], b[0]); let d = tb - ta; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const dot = a[0] * b[0] + a[1] * b[1], O = P(0, 0);
    x.strokeStyle = dot === 0 ? C.r : C.chalk; x.lineWidth = 2; x.beginPath(); x.arc(...O, 54, -ta, -(ta + d), d > 0); x.stroke();
    if (dot === 0) { const u = [Math.cos(ta), Math.sin(ta)], v = [Math.cos(tb), Math.sin(tb)], s = .45; x.strokeStyle = C.r; x.lineWidth = 3; x.beginPath(); x.moveTo(...P(u[0] * s, u[1] * s)); x.lineTo(...P((u[0] + v[0]) * s, (u[1] + v[1]) * s)); x.lineTo(...P(v[0] * s, v[1] * s)); x.stroke(); }
    arrow(x, P, [0, 0], a, C.a, 'a', 5); arrow(x, P, [0, 0], b, C.b, 'b', 5); },
  change(h) { const a = h.a, b = h.b, dot = a[0] * b[0] + a[1] * b[1], th = Math.acos(dot / (Math.hypot(...a) * Math.hypot(...b))) * 180 / Math.PI;
    const el = $('#o-dot'); el.classList.toggle('perp', dot === 0);
    el.innerHTML = `a·b = ${fmt(a[0])}×${fmt(b[0])} + ${fmt(a[1])}×${fmt(b[1])} = ${fmt(dot)}<small>θ = ${fmt(th)}°</small>`; } });

/* 1 cover: the triangle law in 3D arrows over a faint grid */
{
  const v = viewer($('#v-cover'), { env: .4, cam: [-1.5, 4.5, 11], fov: 32, target: [2.3, 1, 0] });
  v.controls.enableZoom = false;
  const g = new THREE.GridHelper(14, 14, 0x3b4740, 0x26302a); g.position.set(1.5, -.01, .5); v.root.add(g);
  const arrows = new THREE.Group(); v.root.add(arrows);
  const mk = (from, to, col, r = .07) => { const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to), d = b.clone().sub(a), L = d.length(), grp = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color: col, roughness: .35, metalness: .1 });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L - .45, 20), m); shaft.position.y = (L - .45) / 2; grp.add(shaft);
    const head = new THREE.Mesh(new THREE.ConeGeometry(r * 3, .45, 24), m); head.position.y = L - .225; grp.add(head);
    grp.position.copy(a); grp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); arrows.add(grp); return grp; };
  const A = [0, 0, 0], B = [4, .6, .8], S = [5, 3.4, -.6];
  mk(A, B, 0x4f86e8); mk(B, S, 0xe0663a); mk(A, S, 0x3fae66, .09);
  [A, B, S].forEach(p => { const s = new THREE.Mesh(new THREE.SphereGeometry(.12, 20, 10), new THREE.MeshStandardMaterial({ color: 0xd8d2c2 })); s.position.set(...p); v.root.add(s); });
  v.fit(arrows, 1.15); v.onFrame((dt, t) => { v.root.rotation.y = Math.sin(t * .25) * .35; });
}
