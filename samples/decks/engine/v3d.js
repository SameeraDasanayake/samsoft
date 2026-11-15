// Samsoft Decks 3D viewer (three.js r160). One viewer per .v3d element; it only renders while its slide is on.
// Colours follow the house rule: ACES tone mapping at .95 exposure, no washed-out whites.
import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { DRACOLoader } from './vendor/DRACOLoader.js';
const draco = new DRACOLoader().setDecoderPath(new URL('./vendor/draco/', import.meta.url).href);
const gltf = new GLTFLoader().setDRACOLoader(draco);

// Opened straight from disk (file://), the browser blocks fetch. tools/deckpack/pack.mjs then embeds the models,
// textures and the Draco decoder as base64 (window.__ASSETS, window.__DRACO), and these helpers use them.
const A = globalThis.__ASSETS || {}, D = globalThis.__DRACO;
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0)).buffer;
if (D) draco._loadLibrary = name => Promise.resolve(name.endsWith('.wasm') ? b64(D.wasm) : D.wrapper);
const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
// url of an image: a data: URL when embedded, else the file itself
export function asset(url) { const k = url.split('/').pop(); return A[k] ? `data:${MIME[k.split('.').pop()]};base64,${A[k]}` : url; }

export { THREE };

export function viewer(el, o = {}) {
  const slide = el.closest('.slide');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure ?? .95;
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(o.fov ?? 35, 1, .01, 5000);
  camera.position.set(...(o.cam ?? [3, 2, 4]));
  if (o.env !== false) {
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(renderer), .04).texture;
    scene.environmentIntensity = o.env ?? .9;
  }
  if (o.lights !== false) {
    const key = new THREE.DirectionalLight(0xfff4e6, 1.6); key.position.set(4, 6, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xcfe3ff, .7); rim.position.set(-5, 3, -4); scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x1a1f1c, .35));
  }
  const root = new THREE.Group(); scene.add(root);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = .08; controls.enablePan = o.pan ?? false;
  controls.autoRotate = !!o.spin; controls.autoRotateSpeed = o.spinSpeed ?? .8;
  controls.target.set(...(o.target ?? [0, 0, 0]));
  // a touch stops the slow turn, so the teacher keeps the angle they chose
  renderer.domElement.addEventListener('pointerdown', () => { controls.autoRotate = false; });

  const labels = [], frameFns = []; let running = false, raf = 0, last = performance.now();

  function size() {
    const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(size).observe(el); size();

  const v = new THREE.Vector3(), c = new THREE.Vector3(), tmp = new THREE.Vector3();
  function placeLabels() {
    if (!labels.length) return;
    const w = el.clientWidth, h = el.clientHeight;
    const sph = new THREE.Sphere(); new THREE.Box3().setFromObject(root).getBoundingSphere(sph);
    const dc = camera.position.distanceTo(sph.center);
    for (const L of labels) {
      if (L.obj) { L.obj.getWorldPosition(v); if (L.off) v.add(tmp.set(...L.off)); } else v.set(...L.pos).applyMatrix4(root.matrixWorld);
      const back = camera.position.distanceTo(v) > dc + sph.radius * (L.depth ?? .12);
      c.copy(v).project(camera);
      const off = !!(c.z > 1 || back || L.hidden);
      L.el.classList.toggle('hid', off);
      L.el.style.left = ((c.x + 1) / 2 * w) + 'px'; L.el.style.top = ((1 - c.y) / 2 * h) + 'px';
    }
  }

  function tick(t) {
    if (!running) return; raf = requestAnimationFrame(tick);
    const dt = Math.min(.05, (t - last) / 1000); last = t;
    for (const f of frameFns) f(dt, t / 1000);
    controls.update(); renderer.render(scene, camera); placeLabels();
  }
  function start() { if (running) return; running = true; last = performance.now(); size(); raf = requestAnimationFrame(tick); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  if (slide) {
    slide.addEventListener('slide:enter', start); slide.addEventListener('slide:leave', stop);
    if (slide.classList.contains('on')) start();
  } else start();

  const api = {
    THREE, scene, camera, renderer, controls, root, el, start, stop,
    onFrame(f) { frameFns.push(f); return api; },
    // label: { pos:[x,y,z] (in root space) | obj, en, si, side:'r'|'l' }
    label(L) {
      const d = document.createElement('div'); d.className = 'lbl ' + (L.off || L.side === 'up' ? 'up' : (L.side || 'r'));
      d.innerHTML = `<span lang="en">${L.en}</span><span lang="si">${L.si ?? L.en}</span>`;
      el.appendChild(d); L.el = d; labels.push(L); return L;
    },
    clearLabels() { labels.splice(0).forEach(L => L.el.remove()); },
    // frame the camera on an object (or the whole root) from the current direction
    fit(obj = root, k = 1.25, precise = false) {
      const s = new THREE.Sphere(); new THREE.Box3().setFromObject(obj, precise).getBoundingSphere(s);
      const dir = camera.position.clone().sub(controls.target).normalize();
      size(); const vh = THREE.MathUtils.degToRad(camera.fov / 2), hh = Math.atan(Math.tan(vh) * camera.aspect);
      const dist = s.radius * k / Math.sin(Math.min(vh, hh));
      controls.target.copy(s.center); camera.position.copy(s.center).addScaledVector(dir, dist);
      controls.minDistance = dist * .35; controls.maxDistance = dist * 2.2; camera.near = dist / 100; camera.far = dist * 20; camera.updateProjectionMatrix();
      return s;
    },
    async load(url) {
      const loading = document.createElement('div'); loading.className = 'loading'; loading.textContent = 'LOADING'; el.appendChild(loading);
      const k = url.split('/').pop(), g = A[k] ? await gltf.parseAsync(b64(A[k]), '') : await gltf.loadAsync(url); loading.remove();
      // house colour rule (same as the SANDS t3d.js): no washed-out whites, slightly richer colours
      const hsl = {};
      g.scene.traverse(o => { if (!o.isMesh) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach(mt => {
        if (!mt || mt.userData.deep) return; mt.userData.deep = 1; mt.envMapIntensity = .45;
        if (mt.color && !mt.map) { mt.color.getHSL(hsl); if (hsl.l > .22) mt.color.setHSL(hsl.h, Math.min(1, hsl.s * 1.2), .22 + (hsl.l - .22) * .78); }
      }); });
      root.add(g.scene); return g;
    }
  };
  el._v = api; api.labels = labels;
  return api;
}

// small helper: tween a number with ease-in-out, returns a promise
export function tween(ms, fn) {
  return new Promise(res => {
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / ms); fn(k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2); k < 1 ? requestAnimationFrame(step) : res(); };
    requestAnimationFrame(step);
  });
}
