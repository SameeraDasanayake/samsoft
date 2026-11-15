// O/L Science: the heart. Models: heart.glb (outside, neshallads, CC BY) and heart-cut.glb (cut-away with a heartbeat
// animation, jalmer, CC BY). The cut-away's own texture had wrong blue / white patches, so it is shown in one muscle colour;
// blood colour is shown with the moving marker and the diagrams instead. Label points were picked on the front view and
// checked against the valve bones in the model.
import { viewer, THREE, tween } from '../engine/v3d.js';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const M = '../models/heart/';
const once = (id, f) => { let done = false; const el = $('#' + id); const s = el.closest('.slide'); s.addEventListener('slide:enter', () => { if (!done) { done = true; f(el); } }); if (s.classList.contains('on')) { done = true; f(el); } };
const lang = () => document.documentElement.dataset.lang === 'si' ? 'si' : 'en';
const BLUE = 0x5b8cff, RED = 0xf0505c;

async function outer(v) { await v.load(M + 'heart.glb'); v.fit(v.root, 1.02); }
async function cut(v) {
  const g = await v.load(M + 'heart-cut.glb');
  g.scene.traverse(o => { if (!o.isMesh) return; o.frustumCulled = false; const m = o.material; m.color.set('#9a3b36'); m.roughness = .5; m.metalness = 0; m.needsUpdate = true; });
  const mixer = new THREE.AnimationMixer(g.scene), act = mixer.clipAction(g.animations[0]); act.play(); mixer.setTime(0);
  // bounds of a skinned mesh need the bones posed first
  g.scene.updateMatrixWorld(true); g.scene.traverse(o => { if (o.isSkinnedMesh) o.skeleton.update(); });
  v.fit(v.root, .88, true);
  return { g, mixer, act, dur: g.animations[0].duration };
}

/* points in the cut-away model (root space, front view) */
const P = {
  ra: [-0.0362, 0.1013, -0.0229], rv: [-0.0285, 0.0449, -0.0032], la: [0.0263, 0.1115, -0.0178], lv: [0.0303, 0.0426, 0.0105], sep: [0.007, 0.0513, 0.0205],
  tri: [-0.0286, 0.0658, 0.005], bi: [0.025, 0.0828, 0.0084], biTip: [0.025, 0.0751, 0.0034], pvv: [-0.0112, 0.086, 0.0134], aov: [0.0085, 0.08, 0.012],
  svc: [-0.0387, 0.1397, 0.0054], ivc: [-0.0362, 0.0206, -0.0109], ao: [0.0033, 0.1536, 0.0102], pa: [0.0284, 0.1391, 0.0105], pv: [0.0464, 0.1058, -0.0035]
};

/* 1 cover */
once('v-cover', async el => {
  const v = viewer(el, { cam: [-.9, .25, 3], fov: 30, spin: true, spinSpeed: .6 });
  await outer(v); v.controls.enableZoom = false;
});

/* 2 outside, labelled */
once('v-outside', async el => {
  const v = viewer(el, { cam: [0, 0, 3], fov: 30 });
  await outer(v);
  const L = [
    [[0.0823, 0.6431, 0.0975], 'Aorta', 'මහා ධමනිය', 'r'], [[0.3585, 0.3889, 0.1962], 'Pulmonary artery', 'පුප්ඵුසීය ධමනිය', 'r'],
    [[-0.3024, 0.6926, 0.2424], 'Superior vena cava', 'ඌර්ධ්ව මහා ශිරාව', 'l'], [[-0.4531, 0.1974, 0.2558], 'Right atrium', 'දකුණු කර්ණිකාව', 'l'],
    [[-0.2903, -0.1738, 0.4193], 'Right ventricle', 'දකුණු කෝෂිකාව', 'l'], [[0.3041, -0.389, 0.2683], 'Left ventricle', 'වම් කෝෂිකාව', 'r'],
    [[-0.0026, -0.549, 0.3371], 'Coronary artery', 'කිරීටක ධමනිය', 'l']
  ];
  L.forEach(([pos, en, si, side]) => v.label({ pos, en, si, side, depth: .5 }));
  v.fit(v.root, .95);
});

/* 3 inside: three label sets */
once('v-inside', async el => {
  const v = viewer(el, { cam: [0, 0, 3], fov: 30 });
  await cut(v);
  const S = {
    ch: [['ra', 'Right atrium', 'දකුණු කර්ණිකාව', 'l'], ['rv', 'Right ventricle', 'දකුණු කෝෂිකාව', 'l'], ['la', 'Left atrium', 'වම් කර්ණිකාව', 'r'],
      ['lv', 'Left ventricle', 'වම් කෝෂිකාව', 'r'], ['sep', 'Middle wall', 'මැද බිත්තිය', 'up']],
    va: [['tri', 'Tricuspid valve', 'ත්‍රිතුණ්ඩ කපාටය', 'l'], ['pvv', 'Semilunar valve (pulmonary)', 'අර්ධචන්ද්‍රාකාර කපාටය (පුප්ඵුසීය)', 'l'],
      ['aov', 'Semilunar valve (aortic)', 'අර්ධචන්ද්‍රාකාර කපාටය (මහා ධමනිය)', 'r'], ['biTip', 'Bicuspid valve', 'ද්විතුණ්ඩ කපාටය', 'r']],
    ve: [['svc', 'Superior vena cava', 'ඌර්ධ්ව මහා ශිරාව', 'l'], ['ivc', 'Inferior vena cava', 'අධෝ මහා ශිරාව', 'l'], ['ao', 'Aorta', 'මහා ධමනිය', 'up'],
      ['pa', 'Pulmonary artery', 'පුප්ඵුසීය ධමනිය', 'r'], ['pv', 'Pulmonary veins', 'පුප්ඵුසීය ශිරා', 'r']]
  };
  const sets = {};
  for (const k in S) sets[k] = S[k].map(([p, en, si, side]) => v.label({ pos: P[p], en, si, side, depth: .6 }));
  // the valves sit close together: that set moves the camera in
  const home = { p: v.camera.position.clone(), t: v.controls.target.clone() };
  const vc = ['tri', 'bi', 'pvv', 'aov'].reduce((a, n) => a.add(new THREE.Vector3(...P[n])), new THREE.Vector3()).multiplyScalar(.25);
  const near = { t: vc, p: vc.clone().add(home.p.clone().sub(home.t).multiplyScalar(.72)) };
  let at = home, job = 0;
  const fly = to => { if (to === at) return; const from = { p: v.camera.position.clone(), t: v.controls.target.clone() }, my = ++job; at = to;
    tween(700, k => { if (my !== job) return; v.camera.position.lerpVectors(from.p, to.p, k); v.controls.target.lerpVectors(from.t, to.t, k); }); };
  const show = k => {
    fly(k === 'va' ? near : home);
    for (const s in sets) sets[s].forEach(L => L.hidden = s !== k);
    $$('#set button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
    $$('.sets .set').forEach(d => d.classList.toggle('on', d.dataset.k === k));
  };
  showLabels = show; show(curSet);
});
// the text panels switch even before the model has loaded
let curSet = 'ch', showLabels = null;
$('#set').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; curSet = b.dataset.k;
  if (showLabels) showLabels(curSet);
  else { $$('#set button').forEach(x => x.setAttribute('aria-pressed', x === b)); $$('.sets .set').forEach(d => d.classList.toggle('on', d.dataset.k === curSet)); } });

/* 4 path of blood: a glowing drop moves through the cut-away, step by step */
const ROUTE = [
  [['svc', 'ra'], 'Right atrium', 'දකුණු කර්ණිකාව', BLUE], [['ra', 'tri', 'rv'], 'Right ventricle', 'දකුණු කෝෂිකාව', BLUE],
  [['rv', 'pvv'], 'Semilunar valve', 'අර්ධචන්ද්‍රාකාර කපාටය', BLUE], [['pvv', 'pa'], 'To the lungs', 'පෙනහළු වෙත', BLUE],
  [['pv', 'la'], 'Left atrium', 'වම් කර්ණිකාව', RED], [['la', 'bi', 'lv'], 'Left ventricle', 'වම් කෝෂිකාව', RED],
  [['lv', 'aov'], 'Semilunar valve', 'අර්ධචන්ද්‍රාකාර කපාටය', RED], [['aov', 'ao'], 'To the body', 'සිරුර වෙත', RED]
];
{
  const items = $$('#path li'), slide = $('#path').closest('.slide');
  let k = 0, timer = 0, go = () => {};
  const mark = i => items.forEach(li => li.classList.toggle('on', +li.dataset.k === i));
  const show = i => { k = i; mark(i); go(i); };
  const run = () => { clearInterval(timer); timer = setInterval(() => show((k + 1) % ROUTE.length), 3600); };
  items.forEach(li => li.addEventListener('click', () => { clearInterval(timer); show(+li.dataset.k); }));
  slide.addEventListener('slide:enter', () => { show(0); run(); });
  slide.addEventListener('slide:leave', () => clearInterval(timer));
  mark(0);

  once('v-path', async el => {
    const v = viewer(el, { cam: [0, 0, 3], fov: 30 });
    await cut(v);
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.95)'); gr.addColorStop(.5, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    const mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), color: BLUE, depthTest: false, transparent: true, toneMapped: false });
    const drop = new THREE.Sprite(mat); drop.renderOrder = 10; drop.scale.setScalar(.02); v.root.add(drop);
    const tag = v.label({ obj: drop, en: '', si: '', side: 'r', depth: 9 });
    let job = 0;
    go = async i => {
      const [pts, en, si, col] = ROUTE[i], my = ++job;
      mat.color.setHex(col);
      tag.el.innerHTML = `<span lang="en">${en}</span><span lang="si">${si}</span>`; tag.hidden = true;
      const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...P[p])), false, 'centripetal');
      await tween(1500, t => { if (my === job) drop.position.copy(curve.getPoint(t)); });
      if (my === job) tag.hidden = false;
    };
    v.onFrame((dt, t) => drop.scale.setScalar(.019 + .004 * Math.sin(t * 6)));
    go(k);
  });
}

/* 5 double circulation: SVG text follows the language */
const svgText = () => $$('[data-svg-en]').forEach(t => t.textContent = lang() === 'si' ? t.dataset.svgSi : t.dataset.svgEn);
addEventListener('deck:lang', svgText); svgText();

/* 6 heartbeat: the rate slider sets the speed of the beating model */
{
  let rate = 72;
  const read = () => {
    $('#bpmO').textContent = rate;
    $('#perMin').innerHTML = (rate * 70 / 1000).toFixed(1) + '<small>L / min</small>';
    const [en, si, nen, nsi] = rate < 60 ? ['Slow', 'මන්දගාමී', 'sleep, trained athletes', 'නින්දේදී, පුහුණු ක්‍රීඩකයින්']
      : rate <= 100 ? ['Normal', 'සාමාන්‍ය', 'adult at rest: 60 – 100', 'විවේකයේ සිටින වැඩිහිටියෙක්: 60 – 100']
      : ['Fast', 'වේගවත්', 'exercise, fever, fear', 'ව්‍යායාම, උණ, බිය'];
    $('#state').innerHTML = `<span lang="en">${en}</span><span lang="si">${si}</span>`;
    $('#stateNote').innerHTML = `<span lang="en">${nen}</span><span lang="si">${nsi}</span>`;
  };
  $('#bpm').addEventListener('input', e => { rate = +e.target.value; read(); }); read();
  once('v-beat', async el => {
    const v = viewer(el, { cam: [-1.1, .35, 2.8], fov: 30 });
    const h = await cut(v);
    v.onFrame(dt => h.mixer.update(dt * rate / 60 * h.dur));
  });
}

/* 10 the heart again */
once('v-end', async el => {
  const v = viewer(el, { cam: [.9, .2, 3], fov: 30, spin: true, spinSpeed: .5 });
  await outer(v); v.controls.enableZoom = false;
});
