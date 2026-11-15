// A/L ICT: computer networks. Models: rack.glb, netdev.glb, router4g.glb (own Blender builds). Topologies on canvas.
import { viewer, THREE } from '../engine/v3d.js';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const M = '../models/pc/';
const once = (id, f) => { let done = false; const el = $('#' + id); const s = el.closest('.slide'); s.addEventListener('slide:enter', () => { if (!done) { done = true; f(el); } }); if (s.classList.contains('on')) { done = true; f(el); } };
const centre = (o, root) => root.worldToLocal(new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()));
const only = (scene, keep) => scene.children.slice().forEach(c => { c.visible = keep.some(k => c.name === k || c.name.startsWith(k + '_')); });
// netdev.glb: each part is a group named like 'Utp', with children '..._all'; find top-level part groups
function parts(scene) { const out = {}; scene.traverse(o => { if (o.name && !o.name.endsWith('_all') && o !== scene) out[o.name] = out[o.name] || o; }); return out; }

once('v-cover', async el => { const v = viewer(el, { cam: [1.6, 1.0, 2.4], fov: 30, spin: true, spinSpeed: .5 }); await v.load(M + 'rack.glb'); v.fit(v.root, .9); v.controls.enableZoom = false; });

/* 3 cables: UTP, coax, fibre */
once('v-media', async el => {
  const v = viewer(el, { cam: [0, .5, .42], fov: 30 });
  const g = await v.load(M + 'netdev.glb'), P = parts(g.scene);
  const keep = ['Utp', 'Coax', 'Fibre'];
  Object.entries(P).forEach(([n, o]) => { if (/^(Sw|Rt|Ont|Nic)/.test(n) && o.parent) o.parent.remove(o); });
  v.fit(v.root, .8); v.controls.enableZoom = false;
  const L = { Utp: ['Twisted pair (UTP)', 'ඇඹරි යුගල (UTP)'], Coax: ['Coaxial', 'සමක්ෂක'], Fibre: ['Optical fibre', 'ප්‍රකාශ තන්තු'] };
  keep.forEach(k => P[k] && v.label({ pos: centre(P[k], v.root).toArray(), en: L[k][0], si: L[k][1], depth: 9 }));
  v.fit(v.root, .62);
});

/* 4 devices */
once('v-dev', async el => {
  const v = viewer(el, { cam: [0, .5, .7], fov: 30 });
  const g = await v.load(M + 'netdev.glb'), P = parts(g.scene);
  Object.entries(P).forEach(([n, o]) => { if (/^(Utp|Coax|Fibre)/.test(n) && o.parent) o.parent.remove(o); });
  v.fit(v.root, 1.08); v.controls.enableZoom = false;
  const L = { Nic: ['Network card (NIC)', 'ජාල කාඩ්පත (NIC)', 'l'], Sw_case: ['Switch', 'ස්විචය'], Rt: ['Router', 'රවුටරය'], Ont: ['ONT (fibre modem)', 'ONT (තන්තු මොඩමය)'] };
  Object.entries(L).forEach(([k, [en, si, side]]) => P[k] && v.label({ pos: centre(P[k], v.root).toArray(), en, si, side, depth: 9 }));
});

/* 10 the 4G router */
once('v-end', async el => { const v = viewer(el, { cam: [.3, .35, .45], fov: 30, spin: true, spinSpeed: .6, env: .3, exposure: .8 }); await v.load(M + 'router4g.glb'); v.fit(v.root, .95); v.controls.enableZoom = false; });

/* 5 topologies on canvas */
{
  const c = $('#c-topo'), x = c.getContext('2d'); let W = 0, H = 0, kind = 'star', cut = false;
  const DESC = {
    bus: ['One shared backbone cable with terminators. Cheap, but a break in the backbone stops everyone.', 'ටර්මිනේටර සහිත එක් පොදු ප්‍රධාන රැහැනක්. ලාභදායී, නමුත් ප්‍රධාන රැහැන කැඩුණොත් සියල්ල නවතී.'],
    star: ['Every node has its own cable to a central switch. One broken cable affects only that node.', 'සෑම නෝඩයකටම මධ්‍ය ස්විචයට වෙනම රැහැනක් ඇත. රැහැනක් කැඩුණොත් බලපාන්නේ එම නෝඩයට පමණි.'],
    ring: ['Each node joins the next in a closed loop. Data goes round; one break can stop the ring.', 'සෑම නෝඩයක්ම ඊළඟ එකට සම්බන්ධ වී සංවෘත වළල්ලක් සාදයි. එක් කැඩීමකින් වළල්ල නැවතිය හැක.'],
    mesh: ['Every node links to every other. Many paths, so very reliable, but many cables.', 'සෑම නෝඩයක්ම අනෙක් සෑම එකකටම සම්බන්ධයි. මාර්ග බොහොමයක් ඇති නිසා ඉතා විශ්වාසදායී, නමුත් රැහැන් බොහොමයක්.']
  };
  function nodes() {
    const n = 6, cx = W / 2, cy = H / 2, R = Math.min(W, H) * .34;
    if (kind === 'bus') return Array.from({ length: n }, (_, i) => [W * .14 + i * W * .144, cy + (i % 2 ? 110 : -110)]);
    return Array.from({ length: n }, (_, i) => [cx + R * Math.cos(i / n * 6.283 - 1.571), cy + R * Math.sin(i / n * 6.283 - 1.571)]);
  }
  function links(N) {
    const L = [];
    if (kind === 'bus') N.forEach((p, i) => L.push([p, [p[0], H / 2], i === 2]));
    if (kind === 'star') N.forEach((p, i) => L.push([p, [W / 2, H / 2], i === 1]));
    if (kind === 'ring') N.forEach((p, i) => L.push([p, N[(i + 1) % N.length], i === 0]));
    if (kind === 'mesh') N.forEach((p, i) => N.forEach((q, j) => { if (j > i) L.push([p, q, i === 0 && j === 1]); }));
    return L;
  }
  function down(i, N) { if (!cut) return false; if (kind === 'bus') return true; if (kind === 'star') return i === 1; if (kind === 'ring') return true; return false; }
  function draw() {
    x.clearRect(0, 0, W, H); const N = nodes(), L = links(N);
    if (kind === 'bus') { x.strokeStyle = '#ece6d6'; x.lineWidth = 6; x.beginPath(); x.moveTo(W * .08, H / 2); x.lineTo(W * .45, H / 2); x.moveTo(W * .5, H / 2); x.lineTo(W * .92, H / 2); if (!cut) { x.moveTo(W * .44, H / 2); x.lineTo(W * .51, H / 2); } x.stroke();
      x.fillStyle = '#ece6d6'; [W * .08, W * .92].forEach(t => x.fillRect(t - 6, H / 2 - 16, 12, 32)); }
    L.forEach(([p, q, isCut]) => { if (cut && isCut && kind !== 'bus') { x.strokeStyle = '#ff6b6b'; x.setLineDash([6, 8]); } else { x.strokeStyle = 'rgba(236,230,214,.7)'; x.setLineDash([]); }
      x.lineWidth = 3; x.beginPath(); x.moveTo(...p); x.lineTo(...q); x.stroke(); x.setLineDash([]); });
    if (kind === 'star') { x.fillStyle = '#2fd3b4'; x.fillRect(W / 2 - 44, H / 2 - 26, 88, 52); x.fillStyle = '#06201b'; x.font = '700 18px "JetBrains Mono", monospace'; x.textAlign = 'center'; x.fillText('SWITCH', W / 2, H / 2 + 6); }
    N.forEach((p, i) => { const off = down(i, N); x.fillStyle = off ? '#3a2324' : '#18221d'; x.strokeStyle = off ? '#ff6b6b' : '#2fd3b4'; x.lineWidth = 3;
      x.fillRect(p[0] - 34, p[1] - 24, 68, 48); x.strokeRect(p[0] - 34, p[1] - 24, 68, 48);
      x.fillStyle = off ? '#ff6b6b' : '#ece6d6'; x.font = '700 18px "JetBrains Mono", monospace'; x.textAlign = 'center'; x.fillText('PC' + (i + 1), p[0], p[1] + 6); });
    const n = 6, cables = kind === 'mesh' ? n * (n - 1) / 2 : kind === 'bus' ? n + 1 : n;
    const lang = document.documentElement.dataset.lang;
    $('#tcount').innerHTML = `${cables}<small>${lang === 'si' ? 'රැහැන්' : 'cables'}${kind === 'mesh' ? ' = n(n − 1)/2' : ''}</small>`;
    $('#tdesc').innerHTML = `<span lang="en">${DESC[kind][0]}</span><span lang="si">${DESC[kind][1]}</span>`;
    $$('#tsel button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === kind));
  }
  function fit() { W = c.offsetWidth; H = c.offsetHeight; c.width = W * 2; c.height = H * 2; x.setTransform(2, 0, 0, 2, 0, 0); draw(); }
  $$('#tsel button').forEach(b => b.addEventListener('click', () => { kind = b.dataset.t; cut = false; draw(); }));
  $('#tbreak').addEventListener('click', () => { cut = true; draw(); }); $('#tfix').addEventListener('click', () => { cut = false; draw(); });
  new ResizeObserver(fit).observe(c); addEventListener('deck:lang', draw);
}

/* 7 octets → bits */
{
  const ins = $$('#oct input'), bits = $('#bits');
  function draw() {
    bits.innerHTML = ins.map(i => { let v = Math.max(0, Math.min(255, Math.round(+i.value || 0))); if (+i.value !== v) i.value = v;
      return '<div class="o">' + v.toString(2).padStart(8, '0').split('').map(b => `<span class="${b === '1' ? 'on' : ''}">${b}</span>`).join('') + [128, 64, 32, 16, 8, 4, 2, 1].map(p => `<em>${p}</em>`).join('') + '</div>'; }).join('');
  }
  ins.forEach(i => i.addEventListener('input', draw)); draw();
}

/* 8 subnet */
{
  const ip = [192, 168, 10, 77], pre = $('#pre'), bar = $('#maskbar');
  const o = n => $(`#sub [data-o="${n}"]`);
  function draw() {
    const n = +pre.value, mask = n === 0 ? 0 : (~0 << (32 - n)) >>> 0, ipn = ip.reduce((a, b) => (a << 8 | b) >>> 0, 0);
    const net = (ipn & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, dq = v => [24, 16, 8, 0].map(s => (v >>> s) & 255).join('.');
    $('#preO').textContent = '/' + n; o('mask').textContent = dq(mask); o('net').textContent = dq(net); o('bc').textContent = dq(bc);
    o('hosts').textContent = (2 ** (32 - n) - 2).toLocaleString('en-US');
    bar.innerHTML = Array.from({ length: 32 }, (_, i) => `<span class="${i < n ? 'n' : ''}"></span>`).join('');
  }
  pre.addEventListener('input', draw); draw();
}
