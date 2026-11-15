// Solar system deck: textured planets (Solar System Scope 2k maps), sizes from real mean radii.
import { viewer, THREE, asset } from '../engine/v3d.js';

const TX = '../models/planets/';
const tl = new THREE.TextureLoader(), cache = {};
const tex = f => cache[f] || (cache[f] = Object.assign(tl.load(asset(TX + f)), { colorSpace: THREE.SRGBColorSpace, anisotropy: 8 }));
const $ = s => document.querySelector(s);

// mean radius in Earth radii, orbital period in years, axial tilt in degrees
const P = {
  mercury: { r: .383, T: .241, tilt: .03, map: '2k_mercury.jpg', en: 'Mercury', si: 'බුධ' },
  venus:   { r: .949, T: .615, tilt: 177.4, map: '2k_venus_atmosphere.jpg', en: 'Venus', si: 'සිකුරු' },
  earth:   { r: 1,    T: 1,    tilt: 23.4, map: '2k_earth_daymap.jpg', en: 'Earth', si: 'පෘථිවිය' },
  mars:    { r: .532, T: 1.88, tilt: 25.2, map: '2k_mars.jpg', en: 'Mars', si: 'අඟහරු' },
  jupiter: { r: 10.97, T: 11.86, tilt: 3.1, map: '2k_jupiter.jpg', en: 'Jupiter', si: 'බ්‍රහස්පති' },
  saturn:  { r: 9.14, T: 29.46, tilt: 26.7, map: '2k_saturn.jpg', en: 'Saturn', si: 'සෙනසුරු' },
  uranus:  { r: 3.98, T: 84.0, tilt: 97.8, map: '2k_uranus.jpg', en: 'Uranus', si: 'යුරේනස්' },
  neptune: { r: 3.86, T: 164.8, tilt: 28.3, map: '2k_neptune.jpg', en: 'Neptune', si: 'නෙප්චූන්' }
};
const ORDER = Object.keys(P);

// a planet: tilt group > spin mesh (+ clouds for Earth, rings for Saturn)
function planet(name, R = 1, seg = 96) {
  const p = P[name], tilt = new THREE.Group(), spin = new THREE.Group();
  tilt.rotation.z = THREE.MathUtils.degToRad(p.tilt); tilt.add(spin);
  const m = new THREE.Mesh(new THREE.SphereGeometry(R, seg, seg / 2),
    new THREE.MeshStandardMaterial({ map: tex(p.map), roughness: 1, metalness: 0 }));
  spin.add(m);
  if (name === 'earth') {
    const cl = new THREE.Mesh(new THREE.SphereGeometry(R * 1.008, seg, seg / 2),
      new THREE.MeshStandardMaterial({ alphaMap: tex('2k_earth_clouds.jpg'), color: 0xe9eef2, transparent: true, depthWrite: false, roughness: 1 }));
    cl.name = 'clouds'; spin.add(cl);
  }
  if (name === 'saturn') tilt.add(rings(R));
  tilt.userData = { spin, name };
  return tilt;
}
function rings(R) {
  const inner = R * 1.24, outer = R * 2.27, g = new THREE.RingGeometry(inner, outer, 160, 1);
  const pos = g.attributes.position, uv = g.attributes.uv, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); uv.setXY(i, (v.length() - inner) / (outer - inner), .5); }
  const t = tex('2k_saturn_ring_alpha.png');
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: t, alphaMap: t, color: 0xd9c9a6, transparent: true, side: THREE.DoubleSide, roughness: 1, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; return m;
}
function sun(R) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(R, 96, 48), new THREE.MeshBasicMaterial({ map: tex('2k_sun.jpg'), color: 0xffd9a0 })));
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  const gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,186,90,.75)'); gr.addColorStop(.42, 'rgba(255,150,50,.3)'); gr.addColorStop(.7, 'rgba(255,130,40,.07)'); gr.addColorStop(1, 'rgba(255,120,30,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthWrite: false, transparent: true, toneMapped: false }));
  glow.scale.setScalar(R * 3.4); g.add(glow);
  return g;
}
const spinAll = (o, w) => (dt) => { o.userData.spin.rotation.y += w * dt; const cl = o.userData.spin.getObjectByName('clouds'); if (cl) cl.rotation.y += w * .25 * dt; };
function starfield(v, k = .5) {
  const t = tex('2k_stars_milky_way.jpg');
  const s = new THREE.Mesh(new THREE.SphereGeometry(900, 64, 32), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, color: new THREE.Color(k, k, k), depthWrite: false }));
  v.scene.add(s);
}
// Sri Lanka (7.87 N, 80.77 E) on a sphere made by THREE.SphereGeometry with an equirectangular map
function latLon(lat, lon, R) {
  const phi = (lon + 180) / 360 * Math.PI * 2, th = (90 - lat) * Math.PI / 180;
  return new THREE.Vector3(-R * Math.cos(phi) * Math.sin(th), R * Math.cos(th), R * Math.sin(phi) * Math.sin(th));
}
const once = (id, f) => { let done = false; const el = $('#' + id); el.closest('.slide').addEventListener('slide:enter', () => { if (!done) { done = true; f(el); } }); if (el.closest('.slide').classList.contains('on')) { done = true; f(el); } };

/* 1 cover: the Earth with the Sun light from the left, Moon behind, stars */
once('v-cover', el => {
  const v = viewer(el, { env: false, lights: false, cam: [0, 0, 9], fov: 30 });
  starfield(v, .42);
  const sunL = new THREE.DirectionalLight(0xfff1dd, 3.1); sunL.position.set(-8, 2.5, 5); v.scene.add(sunL);
  v.scene.add(new THREE.AmbientLight(0x30405a, .25));
  const e = planet('earth', 2.1, 128); e.position.set(3.3, -.2, 0); e.userData.spin.rotation.y = 2.55; v.root.add(e);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(.42, 64, 32), new THREE.MeshStandardMaterial({ map: tex('2k_moon.jpg'), roughness: 1 }));
  moon.position.set(6.4, 1.9, -6); v.root.add(moon);
  v.controls.target.set(1.6, 0, 0); v.controls.enableZoom = false;
  v.controls.minPolarAngle = Math.PI * .35; v.controls.maxPolarAngle = Math.PI * .65; v.controls.minAzimuthAngle = -.5; v.controls.maxAzimuthAngle = .5;
  v.onFrame(spinAll(e, .08));
});

/* 2 the Sun */
once('v-sun', el => {
  const v = viewer(el, { env: false, lights: false, cam: [0, 0, 15], fov: 30 });
  const s = sun(2.4); v.root.add(s); v.controls.enableZoom = false;
  v.onFrame(dt => { s.children[0].rotation.y += .05 * dt; });
});

/* 3 orbits (not to scale) */
once('v-orbits', el => {
  const v = viewer(el, { env: false, lights: false, cam: [0, 33, 47], fov: 34, target: [0, -4, 0] });
  v.scene.add(new THREE.PointLight(0xfff0dc, 3.2, 0, 0)); v.scene.add(new THREE.AmbientLight(0x5a6a80, .18));
  v.root.add(sun(2.4));
  const dist = [4.6, 6.4, 8.4, 10.4, 14.6, 19.0, 23.0, 26.6], size = [.32, .52, .55, .4, 1.35, 1.12, .78, .76];
  const ps = ORDER.map((n, i) => {
    const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 180 }, (_, k) => new THREE.Vector3(Math.cos(k / 180 * 6.2832) * dist[i], 0, Math.sin(k / 180 * 6.2832) * dist[i]))),
      new THREE.LineBasicMaterial({ color: 0xece6d6, transparent: true, opacity: .16 }));
    v.root.add(line);
    const p = planet(n, size[i], 48); const a = i * 2.1 + .6; p.userData.a = a; p.userData.d = dist[i];
    p.position.set(Math.cos(a) * dist[i], 0, Math.sin(a) * dist[i]); v.root.add(p);
    v.label({ obj: p, off: [0, size[i] + .35, 0], en: P[n].en, si: P[n].si, depth: 99 });
    return p;
  });
  v.controls.minDistance = 22; v.controls.maxDistance = 70;
  v.onFrame(dt => ps.forEach((p, i) => {
    const pp = P[ORDER[i]]; p.userData.a -= .55 / Math.sqrt(pp.T * 3) * dt;
    p.position.set(Math.cos(p.userData.a) * p.userData.d, 0, Math.sin(p.userData.a) * p.userData.d);
    p.userData.spin.rotation.y += .4 * dt;
  }));
});

/* 4 real sizes in a row, the edge of the Sun at the left */
once('v-sizes', el => {
  const v = viewer(el, { env: false, lights: false, cam: [0, 0, 135], fov: 28 });
  const L = new THREE.DirectionalLight(0xfff1dd, 2.8); L.position.set(-60, 12, 70); v.scene.add(L); v.scene.add(new THREE.AmbientLight(0x50607a, .3));
  const s = sun(109); s.children[1].scale.setScalar(109 * 2.3); s.position.set(-171, 0, 0); v.root.add(s);
  let x = -52; const gap = 1.8;
  ORDER.forEach((n, i) => {
    const R = P[n].r, w = n === 'saturn' ? R * 2.27 : R;
    x += w; const p = planet(n, R, 96); p.position.set(x, -1, 0); v.root.add(p);
    if (n === 'saturn') p.rotation.x = .38;
    // the four small planets: labels alternate below / above so they never overlap
    const up = i < 4 && i % 2 === 1;
    v.label({ pos: [x, up ? -1 + R + 1.2 : -1 - Math.max(R, 1) - 1.6, 0], en: P[n].en, si: P[n].si, depth: 999, side: up ? 'up' : 'r' });
    x += w + (i < 3 ? 3.2 : gap);
  });
  v.controls.enableRotate = false; v.controls.enableZoom = false;
  v.camera.position.set(0, 0, 135); v.controls.target.set(0, 0, 0);
  v.onFrame(dt => v.root.children.forEach(c => c.userData.spin && (c.userData.spin.rotation.y += .12 * dt)));
});

/* 5 facts: click a row to show that planet */
once('v-fact', el => {
  const v = viewer(el, { env: false, lights: false, cam: [0, 0, 7.5], fov: 30 });
  const L = new THREE.DirectionalLight(0xfff1dd, 3); L.position.set(-5, 2, 5); v.scene.add(L); v.scene.add(new THREE.AmbientLight(0x50607a, .25));
  let cur = null;
  function show(n) {
    if (cur) v.root.remove(cur);
    cur = planet(n, n === 'saturn' ? 1.0 : 1.5, 96); if (n === 'saturn') cur.rotation.x = .35; v.root.add(cur);
    document.querySelectorAll('.facts tbody tr').forEach((tr, i) => tr.classList.toggle('sel', ORDER[i] === n));
  }
  document.querySelectorAll('.facts tbody tr').forEach((tr, i) => tr.addEventListener('click', () => show(ORDER[i])));
  show('earth'); v.controls.enableZoom = false;
  v.onFrame(dt => cur && (cur.userData.spin.rotation.y += .25 * dt));
});

/* 6 rotation: hour slider turns the Earth so Sri Lanka faces the Sun at 12:00 */
once('v-earth', el => {
  const v = viewer(el, { env: false, lights: false, cam: [0, .5, 6.2], fov: 30 });
  const sunDir = new THREE.Vector3(1, .1, 1.3).normalize();
  const L = new THREE.DirectionalLight(0xfff1dd, 3.2); L.position.copy(sunDir).multiplyScalar(10); v.scene.add(L);
  v.scene.add(new THREE.AmbientLight(0x3a4a66, .12));
  const e = planet('earth', 1.6, 128); e.rotation.set(0, 0, 0);
  e.quaternion.setFromAxisAngle(sunDir, THREE.MathUtils.degToRad(23.4)); v.root.add(e);
  const axis = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 4.2, 8), new THREE.MeshBasicMaterial({ color: 0xece6d6, transparent: true, opacity: .5 })); e.add(axis);
  const pin = new THREE.Mesh(new THREE.SphereGeometry(.045, 16, 8), new THREE.MeshBasicMaterial({ color: 0xf4b942 }));
  pin.position.copy(latLon(7.87, 80.77, 1.61)); e.userData.spin.add(pin);
  v.label({ obj: pin, en: 'Sri Lanka', si: 'ශ්‍රී ලංකාව', depth: .3 });
  // spin angle that puts Sri Lanka nearest the Sun = local noon
  const w = new THREE.Vector3(); let noon = 0, best = -9;
  for (let k = 0; k < 720; k++) { const a = k / 720 * Math.PI * 2; e.userData.spin.rotation.y = a; e.updateMatrixWorld(true); pin.getWorldPosition(w); const d = w.normalize().dot(sunDir); if (d > best) { best = d; noon = a; } }
  const hour = $('#hour'), out = $('#hourOut'), dn = $('#dn');
  function set() {
    const h = +hour.value; e.userData.spin.rotation.y = noon + (h - 12) / 24 * Math.PI * 2;
    out.textContent = String(Math.floor(h) % 24).padStart(2, '0') + ':' + String(Math.round((h % 1) * 60)).padStart(2, '0');
    const hh = h % 24;
    const st = hh >= 5.5 && hh < 6.5 ? ['Sunrise', 'හිරු උදාව'] : hh >= 17.5 && hh < 18.5 ? ['Sunset', 'හිරු බැසීම'] : hh >= 6.5 && hh < 17.5 ? ['Day', 'දවල්'] : ['Night', 'රාත්‍රිය'];
    dn.innerHTML = `<span lang="en">${st[0]}</span><span lang="si">${st[1]}</span>`;
  }
  hour.addEventListener('input', set); set(); v.controls.enableZoom = false;
  v.onFrame(dt => { const cl = e.userData.spin.getObjectByName('clouds'); cl.rotation.y += .01 * dt; });
});

/* 7 one year: the Earth goes round the Sun, the day counter runs to 365 */
once('v-year', el => {
  const v = viewer(el, { env: false, lights: false, cam: [0, 10.5, 15.5], fov: 34 });
  v.scene.add(new THREE.PointLight(0xfff0dc, 3, 0, 0)); v.scene.add(new THREE.AmbientLight(0x50607a, .15));
  v.root.add(sun(1.3)); const R = 5.4;
  v.root.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 200 }, (_, k) => new THREE.Vector3(Math.cos(k / 200 * 6.2832) * R, 0, Math.sin(k / 200 * 6.2832) * R))),
    new THREE.LineBasicMaterial({ color: 0xece6d6, transparent: true, opacity: .25 })));
  const e = planet('earth', .42, 64); v.root.add(e);
  v.label({ obj: e, off: [0, .7, 0], en: 'Earth', si: 'පෘථිවිය', depth: 99 });
  const out = $('#dayN'); let d = 0;
  v.controls.enableZoom = false;
  v.onFrame(dt => {
    d = (d + dt * 30) % 365.25; const a = -d / 365.25 * Math.PI * 2;
    e.position.set(Math.cos(a) * R, 0, Math.sin(a) * R); e.userData.spin.rotation.y += dt * 6;
    out.textContent = Math.floor(d);
  });
});

/* 8 Moon phase as seen from the Earth: the light turns with the days after new moon */
once('v-moon', el => {
  const v = viewer(el, { env: false, lights: false, cam: [0, 0, 7], fov: 30 });
  const L = new THREE.DirectionalLight(0xfff4e8, 3.2); v.scene.add(L); v.scene.add(new THREE.AmbientLight(0x6070a0, .06));
  const m = new THREE.Mesh(new THREE.SphereGeometry(1.7, 128, 64), new THREE.MeshStandardMaterial({ map: tex('2k_moon.jpg'), roughness: 1 }));
  m.rotation.y = -Math.PI / 2; v.root.add(m);
  const s = $('#mday'), out = $('#mdayOut'), ph = $('#phase');
  const names = [[1, 'New moon', 'අමාවක'], [6.4, 'Waxing crescent', 'පුර පක්ෂය'], [8.4, 'First quarter', 'පුර අටවක'], [13.8, 'Waxing gibbous', 'පුර පක්ෂය'],
    [15.8, 'Full moon · Poya', 'පුර පසළොස්වක · පොහොය'], [21.1, 'Waning gibbous', 'අව පක්ෂය'], [23.1, 'Last quarter', 'අව අටවක'], [28.5, 'Waning crescent', 'අව පක්ෂය'], [99, 'New moon', 'අමාවක']];
  function set() {
    const d = +s.value, a = d / 29.53 * Math.PI * 2;
    L.position.set(Math.sin(a) * 10, 0, -Math.cos(a) * 10);
    out.textContent = d.toFixed(d % 1 ? 2 : 0).replace(/\.?0+$/, '') || '0';
    const n = names.find(x => d < x[0]);
    ph.innerHTML = `<span lang="en">${n[1]}</span><span lang="si">${n[2]}</span>`;
  }
  s.addEventListener('input', set); set(); v.controls.enableZoom = false; v.controls.enableRotate = false;
});

/* 10 summary: Saturn */
once('v-end', el => {
  const v = viewer(el, { env: false, lights: false, cam: [0, 1.6, 8], fov: 30 });
  const L = new THREE.DirectionalLight(0xfff1dd, 3); L.position.set(-6, 3, 4); v.scene.add(L); v.scene.add(new THREE.AmbientLight(0x50607a, .2));
  const s = planet('saturn', 1.25, 96); s.rotation.x = .3; v.root.add(s); v.controls.enableZoom = false;
  v.onFrame(dt => { s.userData.spin.rotation.y += .2 * dt; });
});
