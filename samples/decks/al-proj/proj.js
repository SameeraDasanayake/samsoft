// A/L Physics: projectile motion. Graphs on canvas (exact physics, g = 10 m/s²), 3D cover in three.js.
import { viewer, THREE } from '../engine/v3d.js';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const css = getComputedStyle(document.body);
const COL = { acc: (css.getPropertyValue('--accent') || '#0b8a44').trim(), chalk: '#121826', chalk2: '#3d4659', dim: '#6c7488', line: 'rgba(18,24,38,.12)', line2: 'rgba(18,24,38,.28)', ok: '#138a44', blue: '#1f6fd1', coral: '#e8590c' };
const FONT = '600 22px "JetBrains Mono", monospace';
const rad = d => d * Math.PI / 180;
const lang = () => document.documentElement.dataset.lang;

// a canvas that keeps its pixel size in step with its box (the stage is scaled with a transform, so use offset sizes)
function surface(id, draw) {
  const c = $('#' + id), x = c.getContext('2d'); let W = 0, H = 0;
  function fit() { W = c.offsetWidth; H = c.offsetHeight; c.width = W * 2; c.height = H * 2; x.setTransform(2, 0, 0, 2, 0, 0); draw(x, W, H); }
  new ResizeObserver(fit).observe(c); addEventListener('deck:lang', fit);
  return { x, get W() { return W; }, get H() { return H; }, redraw: () => draw(x, W, H) };
}
// world → screen mapper with margins, equal scale on both axes
function frame(W, H, xmax, ymax, m = { l: 70, r: 30, t: 30, b: 60 }) {
  const k = Math.min((W - m.l - m.r) / xmax, (H - m.t - m.b) / ymax);
  return { k, X: x => m.l + x * k, Y: y => H - m.b - y * k, m };
}
function axes(x, F, W, H, xmax, ymax, step, lx = 'x / m', ly = 'y / m') {
  x.lineWidth = 1; x.strokeStyle = COL.line; x.font = '500 16px "JetBrains Mono", monospace'; x.fillStyle = COL.dim;
  for (let g = 0; g <= xmax + 1e-6; g += step) { x.beginPath(); x.moveTo(F.X(g), F.Y(0)); x.lineTo(F.X(g), F.Y(ymax)); x.stroke(); x.textAlign = 'center'; x.fillText(+g.toFixed(1), F.X(g), F.Y(0) + 26); }
  for (let g = step; g <= ymax + 1e-6; g += step) { x.beginPath(); x.moveTo(F.X(0), F.Y(g)); x.lineTo(F.X(xmax), F.Y(g)); x.stroke(); x.textAlign = 'right'; x.fillText(+g.toFixed(1), F.X(0) - 10, F.Y(g) + 5); }
  x.strokeStyle = COL.line2; x.lineWidth = 2; x.beginPath(); x.moveTo(F.X(0), F.Y(ymax)); x.lineTo(F.X(0), F.Y(0)); x.lineTo(F.X(xmax), F.Y(0)); x.stroke();
  x.fillStyle = COL.chalk2; x.textAlign = 'right'; x.fillText(lx, F.X(xmax), F.Y(0) + 50); x.textAlign = 'left'; x.fillText(ly, F.X(0) + 8, F.Y(ymax) + 4);
}
const nice = v => { const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return (n <= 1.5 ? 1 : n <= 3 ? 2 : n <= 7 ? 5 : 10) * p; };
function path(u, th, g) { const T = 2 * u * Math.sin(rad(th)) / g; return { T, H: (u * Math.sin(rad(th))) ** 2 / (2 * g), R: u * u * Math.sin(rad(2 * th)) / g, at: t => [u * Math.cos(rad(th)) * t, u * Math.sin(rad(th)) * t - g * t * t / 2] }; }
const onSlide = (id, f) => { const s = $('#' + id).closest('.slide'); s.addEventListener('slide:enter', () => f(true)); s.addEventListener('slide:leave', () => f(false)); if (s.classList.contains('on')) f(true); };

/* 2 strobe: dots every 0.1 s, with their shadows on both axes */
{
  const P = path(14, 52, 10); let shown = 0, timer = 0;
  const S = surface('c-strobe', (x, W, H) => {
    x.clearRect(0, 0, W, H); const F = frame(W, H, 20, 10, { l: 90, r: 30, t: 30, b: 70 });
    axes(x, F, W, H, 20, 10, 2);
    const n = Math.floor(P.T / .1);
    for (let i = 0; i <= Math.min(n, shown); i++) {
      const [px, py] = P.at(i * .1);
      x.fillStyle = COL.dim; x.beginPath(); x.arc(F.X(px), F.Y(0), 4, 0, 7); x.fill(); x.beginPath(); x.arc(F.X(0), F.Y(py), 4, 0, 7); x.fill();
      x.strokeStyle = 'rgba(236,230,214,.08)'; x.setLineDash([3, 5]); x.beginPath(); x.moveTo(F.X(px), F.Y(py)); x.lineTo(F.X(px), F.Y(0)); x.moveTo(F.X(px), F.Y(py)); x.lineTo(F.X(0), F.Y(py)); x.stroke(); x.setLineDash([]);
      x.fillStyle = COL.acc; x.beginPath(); x.arc(F.X(px), F.Y(py), 8, 0, 7); x.fill();
    }
  });
  onSlide('c-strobe', on => { clearInterval(timer); if (!on) return; shown = 0; timer = setInterval(() => { shown++; if (shown > 30) shown = 0; S.redraw(); }, 120); });
}

/* 3 components of u (u = 20 m/s) */
{
  const a = $('#ang');
  const S = surface('c-comp', (x, W, H) => {
    x.clearRect(0, 0, W, H); const th = +a.value, u = 20, ux = u * Math.cos(rad(th)), uy = u * Math.sin(rad(th));
    const F = frame(W, H, 22, 22, { l: 60, r: 40, t: 40, b: 60 }), O = [F.X(0), F.Y(0)];
    const arrow = (x1, y1, col, w) => { const x0 = O[0], y0 = O[1], ang = Math.atan2(y1 - y0, x1 - x0); x.strokeStyle = x.fillStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); x.beginPath(); x.moveTo(x1, y1); x.lineTo(x1 - 22 * Math.cos(ang - .35), y1 - 22 * Math.sin(ang - .35)); x.lineTo(x1 - 22 * Math.cos(ang + .35), y1 - 22 * Math.sin(ang + .35)); x.fill(); };
    x.strokeStyle = COL.line2; x.lineWidth = 2; x.beginPath(); x.moveTo(F.X(0), F.Y(21)); x.lineTo(...O); x.lineTo(F.X(21), F.Y(0)); x.stroke();
    x.setLineDash([8, 8]); x.strokeStyle = COL.dim; x.lineWidth = 2; x.beginPath(); x.moveTo(F.X(ux), F.Y(0)); x.lineTo(F.X(ux), F.Y(uy)); x.lineTo(F.X(0), F.Y(uy)); x.stroke(); x.setLineDash([]);
    arrow(F.X(ux), F.Y(0), COL.blue, 5); arrow(F.X(0), F.Y(uy), COL.coral, 5); arrow(F.X(ux), F.Y(uy), COL.acc, 6);
    x.strokeStyle = COL.chalk2; x.lineWidth = 2; x.beginPath(); x.arc(...O, 70, -rad(th), 0); x.stroke();
    x.font = 'italic 700 28px "Abhaya Libre", serif'; x.fillStyle = COL.chalk; x.fillText('θ', O[0] + 80 * Math.cos(rad(th / 2)) + 4, O[1] - 80 * Math.sin(rad(th / 2)) + 10);
    x.font = FONT; x.fillStyle = COL.acc; x.fillText('u = 20 m/s', F.X(ux * .5) + 14, F.Y(uy * .5) - 14);
    x.fillStyle = COL.blue; x.textAlign = 'center'; x.fillText('u cos θ = ' + ux.toFixed(1), F.X(ux / 2), F.Y(0) + 36);
    x.fillStyle = COL.coral; x.textAlign = 'left'; x.save(); x.translate(F.X(0) - 18, F.Y(uy / 2)); x.rotate(-Math.PI / 2); x.textAlign = 'center'; x.fillText('u sin θ = ' + uy.toFixed(1), 0, 0); x.restore();
    $('#angO').textContent = th + '°';
  });
  a.addEventListener('input', S.redraw);
}

/* 6 simulator */
{
  let g = 10, trails = [], ball = null, raf = 0;
  const su = $('#su'), sa = $('#sa');
  const S = surface('c-sim', (x, W, H) => {
    x.clearRect(0, 0, W, H);
    const all = trails.concat(ball ? [ball.p] : []).concat([{ ...path(+su.value, +sa.value, g) }]);
    const xm = Math.max(10, ...all.map(p => p.R)) * 1.08, ym = Math.max(xm * .35, ...all.map(p => p.H)) * 1.15;
    const F = frame(W, H, xm, ym, { l: 80, r: 30, t: 30, b: 70 }); axes(x, F, W, H, xm, ym, nice(xm / 6));
    trails.forEach((p, i) => { x.strokeStyle = i === trails.length - 1 && !ball ? COL.acc : 'rgba(247,212,76,.35)'; x.lineWidth = 3; x.beginPath(); for (let t = 0; t <= p.T + 1e-9; t += p.T / 120) { const [a, b] = p.at(t); t ? x.lineTo(F.X(a), F.Y(b)) : x.moveTo(F.X(a), F.Y(b)); } x.stroke(); });
    if (ball) { const p = ball.p; x.strokeStyle = COL.acc; x.lineWidth = 3; x.beginPath(); for (let t = 0; t <= ball.t; t += p.T / 120) { const [a, b] = p.at(t); t ? x.lineTo(F.X(a), F.Y(b)) : x.moveTo(F.X(a), F.Y(b)); } x.stroke();
      const [a, b] = p.at(ball.t); x.fillStyle = COL.chalk; x.beginPath(); x.arc(F.X(a), F.Y(Math.max(0, b)), 10, 0, 7); x.fill(); }
  });
  function stats() {
    const p = path(+su.value, +sa.value, g); $('#suO').textContent = su.value; $('#saO').textContent = sa.value + '°';
    $('#rT').textContent = p.T.toFixed(2) + ' s'; $('#rH').textContent = p.H.toFixed(1) + ' m'; $('#rR').textContent = p.R.toFixed(1) + ' m'; S.redraw();
  }
  [su, sa].forEach(e => e.addEventListener('input', stats));
  $$('#gsel button').forEach(b => b.addEventListener('click', () => { g = +b.dataset.g; $$('#gsel button').forEach(o => o.setAttribute('aria-pressed', o === b)); trails = []; stats(); }));
  $('#fire').addEventListener('click', () => {
    cancelAnimationFrame(raf); const p = path(+su.value, +sa.value, g); ball = { p, t: 0 }; const t0 = performance.now(), dur = Math.min(3200, Math.max(1200, p.T * 600));
    const step = now => { ball.t = Math.min(p.T, (now - t0) / dur * p.T); S.redraw(); if (ball.t < p.T) raf = requestAnimationFrame(step); else { trails.push(p); ball = null; S.redraw(); } };
    raf = requestAnimationFrame(step);
  });
  $('#clear').addEventListener('click', () => { trails = []; ball = null; S.redraw(); });
  stats();
}

/* 7 angles 15..75 at u = 20 */
{
  const S = surface('c-best', (x, W, H) => {
    x.clearRect(0, 0, W, H); const F = frame(W, H, 44, 22, { l: 80, r: 30, t: 30, b: 70 }); axes(x, F, W, H, 44, 20, 5);
    [15, 30, 45, 60, 75].forEach(a => { const p = path(20, a, 10); const hot = a === 45;
      x.strokeStyle = hot ? COL.acc : a === 30 || a === 60 ? COL.blue : 'rgba(236,230,214,.45)'; x.lineWidth = hot ? 5 : 3;
      x.beginPath(); for (let t = 0; t <= p.T + 1e-9; t += p.T / 120) { const [u, v] = p.at(t); t ? x.lineTo(F.X(u), F.Y(v)) : x.moveTo(F.X(u), F.Y(v)); } x.stroke();
      const [tx, ty] = p.at(p.T / 2); x.font = FONT; x.fillStyle = x.strokeStyle; x.textAlign = 'center'; x.fillText(a + '°', F.X(tx), F.Y(ty) - 12); });
    x.fillStyle = COL.acc; x.beginPath(); x.arc(F.X(40), F.Y(0), 8, 0, 7); x.fill(); x.font = FONT; x.textAlign = 'center'; x.textAlign = 'right'; x.fillText('Rmax = u²/g = 40 m', F.X(44), F.Y(18.5));
  });
}

/* 1 cover: a fan of real trajectories over a ground grid, a ball flying the 45° path */
{
  const el = $('#v-cover');
  const v = viewer(el, { env: .4, cam: [-26, 9, 40], fov: 34, target: [-2, 7, 0] });
  v.controls.enableZoom = false; v.controls.enableRotate = true; v.controls.minPolarAngle = .9; v.controls.maxPolarAngle = 1.55;
  const grid = new THREE.GridHelper(80, 40, 0x3a463f, 0x253029); grid.position.set(20, 0, 0); v.root.add(grid);
  const angs = [20, 35, 45, 55, 70];
  angs.forEach((a, i) => {
    const p = path(20, a, 10), pts = []; for (let k = 0; k <= 80; k++) { const [x, y] = p.at(p.T * k / 80); pts.push(new THREE.Vector3(x, y, (i - 2) * 2.2)); }
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, a === 45 ? .16 : .09, 10), new THREE.MeshStandardMaterial({ color: a === 45 ? 0xf7d44c : 0x6e7f76, roughness: .5, emissive: a === 45 ? 0x3a2c00 : 0 }));
    v.root.add(tube);
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(.55, 32, 16), new THREE.MeshStandardMaterial({ color: 0xece6d6, roughness: .4 })); v.root.add(ball);
  const p45 = path(20, 45, 10); let t = 0;
  v.onFrame(dt => { t = (t + dt * .9) % (p45.T + .8); const [x, y] = p45.at(Math.min(t, p45.T)); ball.position.set(x, Math.max(.55, y + .55), 0); });
}

/* 5 one path with T, H and R marked (u = 20, θ = 50°) */
{
  const S = surface('c-thr', (x, W, H) => {
    x.clearRect(0, 0, W, H); const p = path(20, 50, 10), F = frame(W, H, 42, 16, { l: 40, r: 40, t: 20, b: 50 });
    x.strokeStyle = COL.line2; x.lineWidth = 2; x.beginPath(); x.moveTo(F.X(0), F.Y(0)); x.lineTo(F.X(42), F.Y(0)); x.stroke();
    x.strokeStyle = COL.acc; x.lineWidth = 4; x.beginPath(); for (let t = 0; t <= p.T + 1e-9; t += p.T / 120) { const [a, b] = p.at(t); t ? x.lineTo(F.X(a), F.Y(b)) : x.moveTo(F.X(a), F.Y(b)); } x.stroke();
    const dim = (x1, y1, x2, y2, txt, side) => { x.strokeStyle = COL.chalk2; x.fillStyle = COL.chalk2; x.lineWidth = 2; x.setLineDash([6, 6]); x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke(); x.setLineDash([]);
      x.font = 'italic 700 30px "Abhaya Libre", serif'; x.textAlign = 'center'; x.fillText(txt, (x1 + x2) / 2 + (side || 0), (y1 + y2) / 2 + (side ? 10 : -10)); };
    dim(F.X(p.R / 2), F.Y(0), F.X(p.R / 2), F.Y(p.H), 'H', 26);
    dim(F.X(0), F.Y(0) + 26, F.X(p.R), F.Y(0) + 26, '', 0); x.fillText('R', F.X(p.R / 2), F.Y(0) + 46);
    x.font = '600 20px "JetBrains Mono", monospace'; x.fillStyle = COL.dim; x.textAlign = 'left'; x.fillText('t = 0', F.X(0) + 6, F.Y(0) - 12); x.textAlign = 'right'; x.fillText('t = T', F.X(p.R) - 6, F.Y(0) - 12);
  });
}
