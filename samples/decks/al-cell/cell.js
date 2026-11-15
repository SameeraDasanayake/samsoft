// A/L Biology: the cell. Model: animalcellCOLOR2 (montanna, after Lauri Purhonen, CC BY). The organelles were unnamed
// in the source; they were named from renders (tools/blender/cell/export.py) and re-coloured here in textbook colours.
// Label points are found by casting a ray onto the named part, so they always sit on the visible surface.
import { viewer, THREE, tween } from '../engine/v3d.js';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const once = (id, f) => { let done = false; const el = $('#' + id); const s = el.closest('.slide'); s.addEventListener('slide:enter', () => { if (!done) { done = true; f(el); } }); if (s.classList.contains('on')) { done = true; f(el); } };
const lang = () => document.documentElement.dataset.lang === 'si' ? 'si' : 'en';

const COL = { membrane: '#b65a3a', cytoplasm: '#7a8f73', nucleus: '#6a3c9e', nucleoplasm: '#c4588c', nucleolus: '#3346c0', pores: '#e2a93e',
  rough_er: '#3a49aa', ribosomes: '#d42c46', smooth_er: '#6378c4', golgi: '#b0338c', mito: '#d0602c', cristae: '#eba046',
  lysosomes: '#d8b42e', centrioles: '#3fae9e', vesicles: '#d9509f' };
const SEE = { cytoplasm: .5, nucleoplasm: .42 };          // see-through parts (the cut faces)
const DEEP = ['cytoplasm', 'nucleoplasm', 'membrane'];       // ignored when testing if a point is visible from above

async function cell(v) {
  const g = await v.load('../models/cell/cell.glb');
  const parts = {};
  g.scene.traverse(o => {
    if (!o.isMesh) return;
    let p = o; while (p && !COL[p.name]) p = p.parent; const n = p ? p.name : 'x';
    const m = new THREE.MeshStandardMaterial({ color: COL[n] ?? '#888', roughness: .48, metalness: 0, envMapIntensity: .45, side: THREE.DoubleSide });
    if (SEE[n]) { m.transparent = true; m.opacity = SEE[n]; m.depthWrite = false; }
    if (n === 'membrane') m.side = THREE.FrontSide;
    o.material = m; o.userData.part = n; (parts[n] ??= []).push(o);
  });
  g.scene.getObjectByName('cytoplasm')?.traverse(o => { if (o.isMesh) o.renderOrder = 2; });
  g.scene.getObjectByName('nucleoplasm')?.traverse(o => { if (o.isMesh) o.renderOrder = 3; });
  v.root.updateMatrixWorld(true);
  const all = Object.values(parts).flat(), solid = all.filter(o => !DEEP.includes(o.userData.part));
  const ray = new THREE.Raycaster();
  // point on part n near (x, z), seen from above; or along a given ray (o, d)
  const at = (n, x, z, o, d) => {
    if (o) { // both faces count here: the ray may start inside the cell
      const sides = parts[n].map(m => m.material.side); parts[n].forEach(m => m.material.side = THREE.DoubleSide);
      ray.set(new THREE.Vector3(...o), new THREE.Vector3(...d).normalize()); const h = ray.intersectObjects(parts[n], false)[0];
      parts[n].forEach((m, i) => m.material.side = sides[i]); return h ? h.point.toArray() : null; }
    for (let r = 0; r <= .4; r += .02) for (let a = 0; a < 6.28; a += r ? .4 : 7) {
      ray.set(new THREE.Vector3(x + r * Math.cos(a), 6, z + r * Math.sin(a)), new THREE.Vector3(0, -1, 0));
      const pool = DEEP.includes(n) ? all : solid, h = ray.intersectObjects(pool, false)[0];
      if (h && h.object.userData.part === n) return h.point.toArray();
    }
    return null;
  };
  return { g, parts, at };
}

/* organelles: anchor (x, z from above, or a ray), names, text, membranes */
const O = [
  ['membrane', { o: [.9, -.6, 9], d: [0, 0, -1] }, 'Plasma membrane', 'ප්ලාස්ම පටලය', 1, 'l',
    'A phospholipid bilayer with proteins (fluid mosaic model). It is <b>selectively permeable</b>: it controls what enters and leaves the cell.',
    'ප්‍රෝටීන සහිත ෆොස්ෆොලිපිඩ ද්විස්තරයකි (තරල මොසෙයික ආකෘතිය). එය <b>වරණීය පාරගම්‍ය</b> වේ: සෛලයට ඇතුළු වන සහ පිට වන දෑ පාලනය කරයි.'],
  ['cytoplasm', [1.3, -.9], 'Cytoplasm', 'සෛල ප්ලාස්මය', null, 'r',
    'Jelly-like <b>cytosol</b> holding the organelles and the cytoskeleton. Many reactions of metabolism, such as <b>glycolysis</b>, happen here.',
    'ඉන්ද්‍රියිකා සහ සෛල සැකිල්ල දරන ජෙලි වැනි <b>සෛල තරලය</b>. <b>ග්ලයිකොලිසිසය</b> වැනි බොහෝ පරිවෘත්තීය ප්‍රතික්‍රියා මෙහි සිදු වේ.'],
  ['nucleus', [-.75, -1.0], 'Nucleus', 'න්‍යෂ්ටිය', 2, 'r',
    'Holds the DNA as <b>chromatin</b> and controls the cell. Wrapped in the <b>nuclear envelope</b>, a double membrane joined to the rough ER.',
    'DNA <b>ක්‍රොමැටින්</b> ලෙස දරා සිටිමින් සෛලය පාලනය කරයි. රළු ER වලට සම්බන්ධ ද්විත්ව පටලයක් වන <b>න්‍යෂ්ටික ආවරණයෙන්</b> වට වී ඇත.'],
  ['pores', [-.15, -1.45], 'Nuclear pores', 'න්‍යෂ්ටික සිදුරු', null, 'r',
    'Openings through the envelope. <b>mRNA</b> and ribosome subunits go out; proteins such as DNA polymerase come in.',
    'න්‍යෂ්ටික ආවරණය හරහා ඇති විවර. <b>mRNA</b> සහ රයිබොසෝම උප ඒකක පිටතට යයි; DNA පොලිමරේස් වැනි ප්‍රෝටීන ඇතුළට පැමිණේ.'],
  ['nucleolus', [-.37, -.63], 'Nucleolus', 'න්‍යෂ්ටිකාව', 0, 'r',
    'A dense region inside the nucleus, with no membrane. It makes <b>rRNA</b> and builds the ribosome subunits.',
    'න්‍යෂ්ටිය තුළ ඇති, පටලයක් නැති ඝන ප්‍රදේශයකි. එය <b>rRNA</b> නිපදවා රයිබොසෝම උප ඒකක තනයි.'],
  ['rough_er', [-1.85, -.4], 'Rough ER', 'රළු අන්තඃප්ලාස්මීය ජාලිකාව', 1, 'l',
    'Flattened sacs (<b>cisternae</b>) studded with ribosomes. Makes proteins for secretion and for membranes, and carries them to the Golgi.',
    'රයිබොසෝම සහිත පැතලි මලු (<b>සිස්ටර්නී</b>). ස්‍රාවය සඳහා සහ පටල සඳහා ප්‍රෝටීන සාදා ඒවා ගොල්ගි සංකීර්ණය වෙත ගෙන යයි.'],
  ['ribosomes', [1.2, -.3], 'Ribosomes', 'රයිබොසෝම', 0, 'l',
    'rRNA + protein, no membrane. <b>80S</b> in the cytoplasm of eukaryotes, free or on the rough ER. The site of <b>protein synthesis</b>.',
    'rRNA + ප්‍රෝටීන, පටල රහිතයි. සුන්‍යෂ්ටික සෛලවල <b>80S</b> වර්ගයයි; නිදහස්ව හෝ රළු ER මත පිහිටයි. <b>ප්‍රෝටීන සංශ්ලේෂණය</b> සිදු වන ස්ථානයයි.'],
  ['smooth_er', [-2.1, 1.3], 'Smooth ER', 'සිනිඳු අන්තඃප්ලාස්මීය ජාලිකාව', 1, 'l',
    'Tubes with no ribosomes. Makes <b>lipids and steroids</b>, breaks down toxins (liver cells), stores Ca²⁺ (muscle cells).',
    'රයිබොසෝම නැති නාල ජාලයකි. <b>ලිපිඩ සහ ස්ටෙරොයිඩ</b> සාදයි, විෂ ද්‍රව්‍ය බිඳ දමයි (අක්මා සෛල), Ca²⁺ ගබඩා කරයි (පේශි සෛල).'],
  ['golgi', [1.14, 1.8], 'Golgi apparatus', 'ගොල්ගි සංකීර්ණය', 1, 'r',
    'A stack of flattened sacs. <b>Modifies, sorts and packs</b> proteins into vesicles, and makes lysosomes.',
    'පැතලි මලු ගොඩකි. ප්‍රෝටීන <b>වෙනස් කර, වර්ග කර, ආශයිකාවලට ඇසුරුම් කරයි</b>; ලයිසොසෝම ද සාදයි.'],
  ['mito', [-.4, 3.05], 'Mitochondrion', 'මයිටොකොන්ඩ්‍රියාව', 2, 'r',
    'Double membrane; the inner one folds into <b>cristae</b>. The site of <b>aerobic respiration</b> that makes most of the cell’s ATP.',
    'ද්විත්ව පටල සහිතයි; අභ්‍යන්තර පටලය නැමී <b>ක්‍රිස්ටී</b> සාදයි. සෛලයේ ATP වලින් වැඩි කොටස නිපදවන <b>ස්වායු ශ්වසනය</b> සිදු වන ස්ථානයයි.'],
  ['lysosomes', [1.96, -.04], 'Lysosome', 'ලයිසොසෝමය', 1, 'r',
    'A sac of <b>hydrolytic enzymes</b> made by the Golgi. Digests food particles, worn-out organelles and bacteria.',
    'ගොල්ගි සංකීර්ණයෙන් සෑදෙන, <b>ජල විච්ඡේදක එන්සයිම</b> සහිත මල්ලකි. ආහාර අංශු, දිරාගිය ඉන්ද්‍රියිකා සහ බැක්ටීරියා ජීර්ණය කරයි.'],
  ['centrioles', [-1.0, 2.56], 'Centrioles', 'සෙන්ට්‍රියෝල', 0, 'l',
    'A pair at right angles; each is <b>nine triplets</b> of microtubules. They help form the <b>spindle</b> in cell division. Absent in most plant cells.',
    'එකිනෙකට සෘජු කෝණව පිහිටි යුගලයකි; එක් එක්කක් ක්ෂුද්‍ර නාලිකා <b>ත්‍රිත්ව නවයකින්</b> සෑදී ඇත. සෛල විභාජනයේදී <b>තර්කුව</b> සෑදීමට උදව් වේ. බොහෝ ශාක සෛලවල නැත.']
];
const MEM = { 2: ['Double membrane', 'ද්විත්ව පටල'], 1: ['Single membrane', 'තනි පටල'], 0: ['No membrane', 'පටල රහිත'] };

// aim the camera at c from distance r, keeping the current direction
const focus = (v, c, r) => {
  const dir = v.camera.position.clone().sub(v.controls.target).normalize();
  v.controls.target.copy(c); v.camera.position.copy(c).addScaledVector(dir, r);
  v.camera.near = r / 100; v.camera.far = r * 30; v.camera.updateProjectionMatrix(); v.controls.minDistance = r * .35; v.controls.maxDistance = r * 2.5;
};

/* 1 cover */
once('v-cover', async el => {
  const v = viewer(el, { cam: [-2.2, 5.2, 6.8], fov: 30, spin: true, spinSpeed: .5 });
  await cell(v); v.fit(v.root, .95); v.controls.enableZoom = false;
});

/* 3 explore: pick an organelle */
{
  let cur = 'nucleus', pick = null;
  const desc = n => {
    const o = O.find(x => x[0] === n); const [, , en, si, mem, , den, dsi] = o;
    $('#oname').innerHTML = `<span lang="en">${en}</span><span lang="si">${si}</span>`;
    $('#otext').innerHTML = `<span lang="en">${den}</span><span lang="si">${dsi}</span>`;
    $('#omem').innerHTML = mem == null ? '' : `<span lang="en">${MEM[mem][0]}</span><span lang="si">${MEM[mem][1]}</span>`;
    $('#omem').dataset.m = mem ?? '';
    $$('#orgs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === n));
  };
  $('#orgs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cur = b.dataset.k; desc(cur); pick && pick(cur); });
  desc(cur);

  once('v-explore', async el => {
    const v = viewer(el, { cam: [0, 5.2, 6.4], fov: 30 });
    const c = await cell(v); v.fit(v.root, .74);
    const home = { p: v.camera.position.clone(), t: v.controls.target.clone() };
    const P = {}; O.forEach(([n, a]) => { const fix = Array.isArray(a) ? c.at(n, a[0], a[1]) : c.at(n, 0, 0, a.o, a.d); P[n] = fix; });
    const tag = v.label({ pos: [0, 0, 0], en: '', si: '', side: 'r', depth: 9 });
    let job = 0, glow = [];
    v.onFrame((dt, t) => { const k = .28 + .22 * Math.sin(t * 4); glow.forEach(m => m.emissiveIntensity = k); });
    pick = n => {
      const o = O.find(x => x[0] === n), my = ++job;
      glow.forEach(m => m.emissive.set(0)); glow = [];
      const list = n === 'mito' ? [...c.parts.mito, ...c.parts.cristae] : n === 'nucleus' ? c.parts.nucleus : c.parts[n];
      if (!['cytoplasm', 'membrane'].includes(n)) list.forEach(m => { m.material.emissive.set(COL[n]); glow.push(m.material); });
      tag.pos = P[n]; tag.side = o[5]; tag.el.className = 'lbl ' + o[5];
      tag.el.innerHTML = `<span lang="en">${o[2]}</span><span lang="si">${o[3]}</span>`; tag.hidden = true;
      const wide = ['membrane', 'cytoplasm'].includes(n);
      const t = wide ? home.t.clone() : new THREE.Vector3(...P[n]);
      const p = wide ? home.p.clone() : t.clone().add(home.p.clone().sub(home.t).multiplyScalar(n === 'rough_er' || n === 'nucleus' ? .55 : .42));
      const from = { p: v.camera.position.clone(), t: v.controls.target.clone() };
      tween(800, k => { if (my !== job) return; v.camera.position.lerpVectors(from.p, p, k); v.controls.target.lerpVectors(from.t, t, k); })
        .then(() => { if (my === job) tag.hidden = false; });
    };
    v.controls.maxDistance *= 1.2; v.controls.minDistance *= .3;
    pick(cur);
  });
}

/* 4 nucleus close-up */
once('v-nuc', async el => {
  const v = viewer(el, { cam: [.4, 4.2, 5], fov: 30 });
  const c = await cell(v);
  const s = new THREE.Box3().setFromObject(c.parts.nucleus[0]).getBoundingSphere(new THREE.Sphere());
  focus(v, s.center.clone().add(new THREE.Vector3(0, .25, .3)), 6.4);
  [['nucleus', -1.15, -.75, 'Nuclear envelope', 'න්‍යෂ්ටික ආවරණය', 'l'], ['pores', .3, -1.25, 'Nuclear pore', 'න්‍යෂ්ටික සිදුර', 'r'],
   ['nucleolus', -.37, -.63, 'Nucleolus', 'න්‍යෂ්ටිකාව', 'r'], ['nucleoplasm', .1, -.3, 'Chromatin', 'ක්‍රොමැටින්', 'r'],
   ['rough_er', -1.7, .35, 'Rough ER (joined to the envelope)', 'රළු ER (ආවරණයට සම්බන්ධයි)', 'r']]
    .forEach(([n, x, z, en, si, side]) => { const pos = c.at(n, x, z); if (pos) v.label({ pos, en, si, side, depth: 9 }); });
});

/* 5 secretion: one protein from the rough ER to the outside */
const ROUTE = [['Ribosome on rough ER', 'රළු ER මත රයිබොසෝමය'], ['Inside the ER', 'ER තුළ'], ['Transport vesicle', 'ප්‍රවාහන ආශයිකාව'],
  ['Golgi apparatus', 'ගොල්ගි සංකීර්ණය'], ['Secretory vesicle', 'ස්‍රාවී ආශයිකාව'], ['Exocytosis', 'Exocytosis']];
{
  const items = $$('#sec li'), slide = $('#sec').closest('.slide');
  let k = 0, timer = 0, go = () => {};
  const mark = i => items.forEach(li => li.classList.toggle('on', +li.dataset.k === i));
  const show = i => { k = i; mark(i); go(i); };
  const run = () => { clearInterval(timer); timer = setInterval(() => show((k + 1) % ROUTE.length), 3400); };
  items.forEach(li => li.addEventListener('click', () => { clearInterval(timer); show(+li.dataset.k); }));
  slide.addEventListener('slide:enter', () => { show(0); run(); });
  slide.addEventListener('slide:leave', () => clearInterval(timer));
  mark(0);

  once('v-sec', async el => {
    const v = viewer(el, { cam: [.9, 6.6, 3.4], fov: 30 });
    const c = await cell(v);
    // stops picked on the model: ribosome on the outer ER arm, ER lumen, gap, cis Golgi, trans Golgi, membrane
    const rib = c.at('ribosomes', -.55, 1.15), er = c.at('rough_er', -.3, 1.2), gc = c.at('golgi', .62, 1.32), gt = c.at('golgi', 1.55, 2.3);
    const out = new THREE.Vector3(.55, 0, .65).normalize();
    const mem = c.at('membrane', 0, 0, [gt[0], gt[1] - .08, gt[2]], out.toArray()) ?? [2, -.05, 2.6];
    const V = (a, dy = 0) => new THREE.Vector3(a[0], a[1] + dy, a[2]);
    const mid = (a, b, dy) => V(a).lerp(V(b), .5).add(new THREE.Vector3(0, dy, 0));
    const legs = [[V(rib, .06), V(rib, .02)], [V(rib, .02), V(er, -.02)], [V(er, .02), mid(er, gc, .15), V(gc, .06)], [V(gc, .06), mid(gc, gt, .12), V(gt, .06)],
      [V(gt, .06), mid(gt, mem, .12), V(mem, .02).addScaledVector(out, -.14)], [V(mem, .02).addScaledVector(out, -.14), V(mem, .02).addScaledVector(out, .3)]];
    focus(v, V(rib).add(V(gc)).add(V(gt)).add(V(mem)).multiplyScalar(.25), 5.6);
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d');
    const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(95,207,140,.9)'); gr.addColorStop(.5, 'rgba(95,207,140,.45)'); gr.addColorStop(1, 'rgba(95,207,140,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    x.beginPath(); x.arc(64, 64, 22, 0, 7); x.fillStyle = '#f4fff8'; x.fill(); x.lineWidth = 6; x.strokeStyle = '#0d1a12'; x.stroke();
    const mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), color: 0xffffff, depthTest: false, transparent: true, toneMapped: false });
    const dot = new THREE.Sprite(mat); dot.renderOrder = 10; dot.scale.setScalar(.4); v.root.add(dot);
    const tag = v.label({ obj: dot, en: '', si: '', side: 'r', depth: 9 });
    let my = 0;
    go = async i => {
      const id = ++my, [en, si] = ROUTE[i];
      tag.el.innerHTML = `<span lang="en">${en}</span><span lang="si">${si}</span>`; tag.hidden = true;
      const curve = new THREE.CatmullRomCurve3(legs[i], false, 'centripetal');
      if (legs[i].length === 2) curve.points.splice(1, 0, legs[i][0].clone().lerp(legs[i][1], .5));
      await tween(1500, t => { if (id === my) dot.position.copy(curve.getPoint(t)); });
      if (id === my) tag.hidden = false;
    };
    v.onFrame((dt, t) => dot.scale.setScalar(.36 + .05 * Math.sin(t * 5)));
    go(k);
  });
}

/* 6 mitochondrion close-up */
once('v-mito', async el => {
  const v = viewer(el, { cam: [.2, 6, 2.6], fov: 26 });
  const c = await cell(v);
  const s = new THREE.Box3(); c.parts.cristae.forEach(m => s.expandByObject(m));
  focus(v, s.getCenter(new THREE.Vector3()), 2.3);
  [['mito', -.75, 3.05, 'Outer membrane', 'බාහිර පටලය', 'l'], ['cristae', -.3, 3.2, 'Cristae (inner membrane)', 'ක්‍රිස්ටී (අභ්‍යන්තර පටලය)', 'r']]
    .forEach(([n, x, z, en, si, side]) => { const pos = c.at(n, x, z); if (pos) v.label({ pos, en, si, side, depth: 9 }); });
  const m = c.at('cristae', -.45, 3.15); if (m) v.label({ pos: [m[0] - .02, m[1] - .05, m[2] + .12], en: 'Matrix', si: 'න්‍යාසය', side: 'l', depth: 9 });
});

/* 10 the cell again */
once('v-end', async el => {
  const v = viewer(el, { cam: [2.4, 5, 6.6], fov: 30, spin: true, spinSpeed: .5 });
  await cell(v); v.fit(v.root, .74); v.controls.enableZoom = false;
});

/* SVG text follows the language */
const svgText = () => $$('[data-svg-en]').forEach(t => t.textContent = lang() === 'si' ? t.dataset.svgSi : t.dataset.svgEn);
addEventListener('deck:lang', svgText); svgText();
