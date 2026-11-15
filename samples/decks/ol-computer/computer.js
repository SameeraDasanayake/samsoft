// O/L ICT: the computer system. Models: pc.glb, cpu.glb (built in Blender, part names kept in the file).
import { viewer, THREE } from '../engine/v3d.js';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const M = '../models/pc/';
const once = (id, f) => { let done = false; const el = $('#' + id); const s = el.closest('.slide'); s.addEventListener('slide:enter', () => { if (!done) { done = true; f(el); } }); if (s.classList.contains('on')) { done = true; f(el); } };
const centre = (o, root) => { const b = new THREE.Box3().setFromObject(o); const c = b.getCenter(new THREE.Vector3()); return root.worldToLocal(c); };

const SIDE = { Cooler: 'l', SSD: 'l', PSU: 'l', NVMe: 'l' };
const PARTS = {
  Motherboard: ['Motherboard', 'මවු පුවරුව'], Cooler: ['CPU + cooler', 'CPU + සිසිලනය'], RAM_1: ['RAM', 'RAM'],
  GPU: ['Graphics card', 'චිත්‍රක පත'], PSU: ['Power supply unit', 'බල සැපයුම් ඒකකය'], HDD: ['Hard disk', 'දෘඪ තැටිය'],
  SSD: ['SSD', 'SSD'], NVMe: ['NVMe SSD', 'NVMe SSD'], Fan_front_1: ['Cooling fan', 'සිසිලන පංකාව']
};

async function pc(v) { const g = await v.load(M + 'pc.glb'); v.fit(v.root, 1.05); return g.scene; }

/* 1 cover */
once('v-cover', async el => {
  const v = viewer(el, { cam: [-2.2, 1.1, 3], fov: 30, spin: true, spinSpeed: .6 });
  await pc(v); v.controls.enableZoom = false;
});

/* 3 inside: labels on the main parts */
once('v-inside', async el => {
  const v = viewer(el, { cam: [-2.6, .7, 1.6], fov: 30 });
  const s = await pc(v);
  const glass = s.getObjectByName('Glass'); if (glass) glass.visible = false;
  const mid = centre(s, v.root);
  for (const [n, [en, si]] of Object.entries(PARTS)) {
    const o = s.getObjectByName(n); if (!o) continue;
    const c = centre(o, v.root); v.label({ pos: c.toArray(), en, si, side: SIDE[n] || 'r', depth: .35 });
  }
  v.fit(v.root, .95);
});

/* 4 exploded view: parts move away from the motherboard, the case fades */
once('v-explode', async el => {
  const v = viewer(el, { cam: [-2.6, 1.2, 2.2], fov: 30 });
  const s = await pc(v);
  const mb = s.getObjectByName('Motherboard'), mbc = centre(mb, v.root);
  const box = new THREE.Box3().setFromObject(s), size = box.getSize(new THREE.Vector3()).length();
  const move = ['Cooler', 'CPU', 'RAM_1', 'RAM_2', 'GPU', 'PSU', 'HDD', 'SSD', 'NVMe', 'Fan_front_1', 'Fan_front_2', 'Fan_front_3', 'Fan_rear', 'Fan_top_1', 'Fan_top_2']
    .map(n => s.getObjectByName(n)).filter(Boolean).map(o => {
      const d = centre(o, v.root).sub(mbc); const home = o.position.clone();
      // in the parent's space: push straight off the board plane + a little outward
      const dirW = d.clone().normalize();
      const p = o.parent; const a = p.worldToLocal(v.root.localToWorld(mbc.clone().add(dirW))).sub(p.worldToLocal(v.root.localToWorld(mbc.clone())));
      return { o, home, dir: a.normalize() };
    });
  const fade = ['Case', 'Glass'].map(n => s.getObjectByName(n)).filter(Boolean);
  const mats = []; fade.forEach(o => o.traverse(m => { if (m.material) { m.material = m.material.clone(); m.material.transparent = true; mats.push([m.material, m.material.opacity]); } }));
  const cables = s.children.length ? ['Cables_24pin', 'Cables_EPS', 'Cables_GPU', 'Cables_SATA', 'Cables_front'].map(n => s.getObjectByName(n)).filter(Boolean) : [];
  const parentScale = new THREE.Vector3(); s.getWorldScale(parentScale);
  function set(t) {
    move.forEach(m => m.o.position.copy(m.home).addScaledVector(m.dir, t * size * .2 / (m.o.parent.getWorldScale(new THREE.Vector3()).x || 1)));
    mats.forEach(([m, o0]) => { m.opacity = o0 * (1 - Math.min(1, t * 2.5)); m.depthWrite = t < .2; });
    fade.forEach(o => o.visible = t < .4); cables.forEach(o => o.visible = t < .05);
    $('#exO').textContent = Math.round(t * 100) + '%';
  }
  $('#ex').addEventListener('input', e => set(+e.target.value)); set(0);
  v.fit(v.root, 1.25);
});

/* 5 the CPU: lift the heat spreader to see the die (cores, cache, graphics, memory controller) */
once('v-cpu', async el => {
  const v = viewer(el, { cam: [1.3, 2.4, 2.2], fov: 30, env: .3, exposure: .85 });
  const g = await v.load(M + 'cpu.glb'); v.fit(v.root, .95);
  const S = g.scene, get = n => S.getObjectByName(n);
  const ihs = get('Cpu_ihs'), paste = get('Cpu_paste'), plate = get('Sock_plate'), lever = get('Sock_lever');
  const size = new THREE.Box3().setFromObject(S).getSize(new THREE.Vector3()).length();
  const home = ihs ? ihs.position.clone() : null, ws = new THREE.Vector3();
  const die = { Cpu_cores: ['Cores', 'හර (cores)', 'l'], Cpu_cache: ['Cache memory', 'නිහිත මතකය', 'l'], Cpu_gpu: ['Graphics', 'චිත්‍රක ඒකකය', 'r'], Cpu_mem: ['Memory controller', 'මතක පාලකය', 'r'] };
  const dieL = Object.entries(die).map(([n, [en, si, side]]) => { const o = get(n); return o && v.label({ pos: centre(o, v.root).toArray(), en, si, side, depth: 9 }); }).filter(Boolean);
  const ihsL = ihs && v.label({ obj: ihs, en: 'Heat spreader (lid)', si: 'තාප විසරකය (ආවරණය)', depth: .6, side: 'l' });
  const sockL = plate && v.label({ pos: centre(plate, v.root).toArray(), en: 'Socket', si: 'කෙවෙනිය', depth: .6, side: 'l' });
  function set(t) {
    if (ihs) { ihs.getWorldScale(ws); ihs.position.copy(home); ihs.position.y += t * size * .35 / (ws.y || 1); }
    if (plate) plate.visible = t < .05; if (lever) lever.visible = t < .05; if (paste) paste.visible = t < .3;
    dieL.forEach(L => L.hidden = t < .6); if (sockL) sockL.hidden = t > .05;
    document.querySelector('#lidO').textContent = Math.round(t * 100) + '%';
  }
  document.querySelector('#lid').addEventListener('input', e => set(+e.target.value)); set(0);
  v.controls.enableZoom = false;
});

/* 8 a RAM stick from the PC model */
once('v-ram', async el => {
  const v = viewer(el, { cam: [0, .9, 3], fov: 28, spin: true, spinSpeed: .7 });
  const g = await v.load(M + 'pc.glb');
  const ram = g.scene.getObjectByName('RAM_1');
  v.root.remove(g.scene);
  if (ram) { const w = new THREE.Group(); ram.updateWorldMatrix(true, false); const c = ram.clone(); c.applyMatrix4(ram.matrixWorld); c.position.set(0, 0, 0);
    w.add(c); w.rotation.z = -Math.PI / 2; v.root.add(w); w.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(w); w.position.sub(b.getCenter(new THREE.Vector3())); }
  v.fit(v.root, .9); v.controls.enableZoom = false;
});

/* 10 the PC again */
once('v-end', async el => {
  const v = viewer(el, { cam: [-2.2, 1, 2.8], fov: 30, spin: true, spinSpeed: .5 });
  await pc(v); v.controls.enableZoom = false;
});

/* 6 machine cycle: click a step, or it runs by itself while the slide is on */
{
  const btn = $$('#ring button'), ex = $$('.explain .ex'); let k = 0, timer = 0;
  const show = i => { k = i; btn.forEach(b => b.classList.toggle('on', +b.dataset.k === i)); ex.forEach(e => e.classList.toggle('on', +e.dataset.k === i)); };
  btn.forEach(b => b.addEventListener('click', () => { clearInterval(timer); show(+b.dataset.k); }));
  const s = $('#ring').closest('.slide');
  s.addEventListener('slide:enter', () => { show(0); clearInterval(timer); timer = setInterval(() => show((k + 1) % 4), 3200); });
  s.addEventListener('slide:leave', () => clearInterval(timer));
  show(0);
}
