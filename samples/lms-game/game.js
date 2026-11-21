// SITHUMINA WORLD - a sample "Game World" LMS (Samsoft, 2026-11-21): the class LMS as a small top-down 2D game. The student walks a village
// (Kenney Tiny Town tiles, CC0) to the Lesson School, the Exam Hall, the Cinema (recordings), the Playground (games), the Wardrobe Shop and the
// Hall of Fame; lessons unlock like levels; XP, levels, coins, daily quests; the coins dress the student's own pixel character (sprite.js).
// Demo only: everything is kept in this browser (localStorage). Sinhala by default, ?lang=en for English.
import { drawKid, LOOK0, OUT } from './sprite.js';
import { CLASS, LESSONS, PAPER, PAPERS_OLD, VIDEOS, NOTICES, LEADERS, QUESTS, SHOP } from './data.js';

// ---------------------------------------------------------------- language + saved state
const qs = new URLSearchParams(location.search);
let lang = qs.get('lang') || (() => { try { return localStorage.getItem('sp-gw-lang'); } catch { return null; } })() || 'si';
const L = (pair) => (Array.isArray(pair) ? pair[lang === 'en' ? 1 : 0] : pair);
const t = (si, en) => (lang === 'en' ? en : si);
const KEY = 'sp-gw-v1';
const today = () => new Date().toISOString().slice(0, 10);
const fresh = () => ({ name: '', xp: 620, coins: 180, look: { ...LOOK0 }, owned: ['s-blue', 'h-black', 'h-short', 'c-none'], stars: { 1: 3, 2: 2 }, best: null, quests: {}, qday: today(), chest: null, x: null, y: null });
let S = (() => { try { return { ...fresh(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return fresh(); } })();
if (S.qday !== today()) { S.quests = {}; S.qday = today(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private window */ } };
const LVL = 250, level = () => Math.floor(S.xp / LVL) + 1, lvlPct = () => (S.xp % LVL) / LVL * 100;
const nameOf = () => S.name || t('සඳුනි', 'Sanduni');

// ---------------------------------------------------------------- the pictures
const img = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
const [TOWN, DUNG] = await Promise.all([img('assets/town.png'), img('assets/dungeon.png')]);
let KID = drawKid(S.look);

// ---------------------------------------------------------------- the world: 46 x 32 tiles of 16 px
const W = 46, H = 32, TS = 16;
const ground = new Int16Array(W * H).fill(0), obj = new Int16Array(W * H).fill(-1), solid = new Uint8Array(W * H), sheetOf = new Uint8Array(W * H); // sheetOf 1 = dungeon
const at = (x, y) => y * W + x, inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
for (let i = 0; i < W * H; i++) ground[i] = rnd() < .07 ? 1 : rnd() < .025 ? 2 : 0;
// the paths: a mask, then each cell picks its edge tile from its neighbours (dirt with grass rims; stepping stones for the walks)
const dirt = new Uint8Array(W * H), stones = new Uint8Array(W * H);
const rect = (m, x0, y0, x1, y1) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inside(x, y)) m[at(x, y)] = 1; };
rect(dirt, 19, 13, 27, 19);                  // the plaza round the well
rect(dirt, 4, 15, 45, 16); rect(dirt, 22, 8, 24, 30); // the main roads
[[8, 9, 8, 14], [36, 9, 36, 14], [9, 17, 9, 21], [36, 17, 36, 21]].forEach(([a, b, c, d]) => rect(stones, a, b, c, d)); // the walks to the doors
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = at(x, y); if (stones[i] && !dirt[i]) { ground[i] = 43; continue; } if (!dirt[i]) continue;
  const n = (dx, dy) => !inside(x + dx, y + dy) || dirt[at(x + dx, y + dy)], u = n(0, -1), d = n(0, 1), l = n(-1, 0), r = n(1, 0);
  ground[i] = !u ? (!l ? 12 : !r ? 14 : 13) : !d ? (!l ? 36 : !r ? 38 : 37) : !l ? 24 : !r ? 26 : 25;
}
const put = (x, y, tile, block = true, dung = false) => { if (!inside(x, y)) return; obj[at(x, y)] = tile; sheetOf[at(x, y)] = dung ? 1 : 0; if (block) solid[at(x, y)] = 1; };
// a house: 2 roof rows (the gable over the door), 2 wall rows (planks / stone over the window + door row)
const PLACES = [];
function house(x, y, w, roof, wall, id, name, icon, color) {
  const R = roof === 'red' ? [52, 53, 54, 64, 65, 66, 67] : [48, 49, 50, 60, 61, 62, 63], V = wall === 'wood' ? [72, 73, 75, 84, 86] : [76, 77, 79, 88, 90];
  const door = x + Math.floor(w / 2);
  for (let i = 0; i < w; i++) { const cx = x + i, e = i === 0 ? 0 : i === w - 1 ? 2 : 1;
    put(cx, y, R[e]); put(cx, y + 1, cx === door ? R[6] : R[3 + e]); put(cx, y + 2, V[e]); put(cx, y + 3, cx === door ? V[4] : (i === 1 || i === w - 2) ? V[3] : V[1]); }
  PLACES.push({ id, name, icon, color, x: door, y: y + 4, bx: x, by: y, w });
}
house(18, 3, 9, 'red', 'wood', 'school', ['පාඩම් පාසල', 'Lesson School'], '📚', '#e4594b');
house(5, 5, 7, 'gray', 'stone', 'exam', ['විභාග ශාලාව', 'Exam Hall'], '📝', '#3d8bdf');
house(33, 5, 7, 'gray', 'wood', 'cinema', ['Recordings සිනමාව', 'Recordings Cinema'], '🎬', '#7a5cff');
house(6, 22, 7, 'red', 'wood', 'shop', ['ඇඳුම් කඩේ', 'Wardrobe Shop'], '👕', '#e0407e');
house(33, 22, 7, 'red', 'stone', 'fame', ['ජයග්‍රාහී ශාලාව', 'Hall of Fame'], '🏆', '#c98a12');
// the playground: a fence round it (open at the top), targets, the coach
const PG = [16, 22, 30, 29];
for (let x = PG[0]; x <= PG[2]; x++) { if (x < 21 || x > 25) put(x, PG[1], x === PG[0] ? 44 : x === PG[2] ? 46 : 45); put(x, PG[3], x === PG[0] ? 68 : x === PG[2] ? 70 : 69); }
for (let y = PG[1] + 1; y < PG[3]; y++) { put(PG[0], y, 56); put(PG[2], y, 58); }
[[19, 25], [27, 25], [19, 27], [27, 27]].forEach(([x, y]) => put(x, y, 95));
PLACES.push({ id: 'games', name: ['ක්‍රීඩා පිටිය', 'Playground'], icon: '🎮', color: '#3fae3a', x: 23, y: 24, label: [23, 22.2] });
// the well in the plaza, the notice board, the daily chest, trees, bushes, flowers
put(23, 15, 92); put(23, 16, 104);
put(20, 14, 83); PLACES.push({ id: 'notice', name: ['දැන්වීම් පුවරුව', 'Notice board'], icon: '📌', x: 20, y: 15, small: true });
put(27, 8, 89, true, true); PLACES.push({ id: 'chest', name: ['දිනපතා තෑගි පෙට්ටිය', 'Daily gift chest'], icon: '🎁', x: 27, y: 9, small: true });
for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) {
  const edge = x < 2 || y < 2 || x > W - 3 || y > H - 3; if (!edge || dirt[at(x, y)]) continue; put(x, y, 19);   // (Kenney's dense forest tile: it joins its neighbours)
}
[[3, 11], [13, 4], [14, 11], [30, 4], [42, 11], [31, 12], [12, 19], [40, 19], [4, 27], [14, 27], [32, 28], [42, 27], [28, 12], [17, 10], [3, 19], [43, 19]].forEach(([x, y], i) => { if (obj[at(x, y)] >= 0) return; if (i % 4 === 3 && obj[at(x, y - 1)] < 0) { put(x, y - 1, 3, false); put(x, y, 15); } else put(x, y, [27, 5, 27][i % 3]); });
[[16, 13], [29, 13], [15, 18], [30, 18], [12, 8], [41, 8], [26, 20], [20, 20]].forEach(([x, y]) => { if (obj[at(x, y)] < 0) put(x, y, 5); });
[[11, 13], [40, 13], [18, 29], [28, 29], [13, 21], [41, 23]].forEach(([x, y]) => { if (obj[at(x, y)] < 0) put(x, y, 29, false); });
put(14, 24, 94); put(41, 26, 94);
// people: the teacher by the well (the quests), the coach in the playground, classmates walking about (Kenney Tiny Dungeon)
const NPCS = [
  { id: 'teacher', tile: 99, x: 21.5, y: 17, name: CLASS.teacher, say: () => t('ආයුබෝවන් දරුවෝ! අද quests ඉවර කරලා XP ගන්න.', 'Hello! Finish today\'s quests and earn XP.') },
  { id: 'coach', tile: 112, x: 23, y: 26.5, name: ['ක්‍රීඩා ගුරුතුමා', 'Coach'], say: () => t('Games ගහලා coins එකතු කරමු!', 'Play the games and collect coins!') },
  { id: 'kid', tile: 85, x: 12, y: 15.5, name: ['කවිඳු', 'Kavindu'], walk: [8, 18], say: () => t('මට 1480 XP! ඔයාට අල්ලන්න පුළුවන්ද? 😄', 'I have 1480 XP! Can you catch me? 😄') },
  { id: 'kid2', tile: 88, x: 33, y: 15.5, name: ['නෙත්මි', 'Nethmi'], walk: [28, 41], say: () => t('භාග පීසා game එක නියමයි 🍕', 'The fraction pizza is so fun 🍕') },
  { id: 'kid3', tile: 98, x: 23, y: 11, name: ['සහන්', 'Sahan'], walkY: [9, 13], say: () => t('Model Paper 07 කළාද?', 'Did you do Model Paper 07?') }];
NPCS.forEach((n) => { n.hx = n.x; n.hy = n.y; n.dir = 1; });

// ---------------------------------------------------------------- the player
const P = { x: (S.x ?? 23) * TS, y: (S.y ?? 19.5) * TS, dir: 0, f: 0, t: 0, moving: false };
const blocked = (px, py) => { const r = 5; for (const [dx, dy] of [[-r, -2], [r, -2], [-r, 5], [r, 5]]) { const cx = Math.floor((px + dx) / TS), cy = Math.floor((py + dy) / TS); if (!inside(cx, cy) || solid[at(cx, cy)]) return true; } return false; };

// ---------------------------------------------------------------- input: keys, the touch stick, tap to walk
const keys = new Set(); let stick = null, target = null;
addEventListener('keydown', (e) => { if (/input|textarea/i.test(e.target.tagName)) return; const k = e.key.toLowerCase();
  if (k === 'escape') { if (!$panel.hidden) closePanel(); return; }
  if (!$panel.hidden || !started) return;
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) { keys.add(k); target = null; e.preventDefault(); }
  if ((k === 'e' || k === 'enter' || k === ' ') && near) { e.preventDefault(); act(near); } });
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
const touch = matchMedia('(pointer: coarse)').matches;
const $joy = document.getElementById('joy'), $act = document.getElementById('act');
$joy.addEventListener('pointerdown', (e) => { $joy.setPointerCapture(e.pointerId); stick = { x: 0, y: 0 }; moveStick(e); });
$joy.addEventListener('pointermove', (e) => { if (stick) moveStick(e); });
$joy.addEventListener('pointerup', () => { stick = null; $joy.firstElementChild.style.transform = ''; });
function moveStick(e) { const r = $joy.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2, l = Math.min(1, Math.hypot(dx, dy) / 45), a = Math.atan2(dy, dx);
  stick = { x: Math.cos(a) * l, y: Math.sin(a) * l }; target = null; $joy.firstElementChild.style.transform = `translate(${Math.cos(a) * l * 36}px, ${Math.sin(a) * l * 36}px)`; }
$act.onclick = () => { if (near) act(near); };
const cv = document.getElementById('world'), g = cv.getContext('2d');
cv.addEventListener('pointerdown', (e) => { if (!started || !$panel.hidden) return; const wx = (e.clientX * dpr) / Z + cam.x, wy = (e.clientY * dpr) / Z + cam.y;
  const hit = [...PLACES, ...NPCS].find((p) => Math.hypot((p.x + .5) * TS - wx, (p.y + .5) * TS - wy) < 18 && Math.hypot((p.x + .5) * TS - P.x, (p.y + .5) * TS - P.y) < 26); if (hit) { act(hit); return; }
  target = { x: wx, y: wy }; });

// ---------------------------------------------------------------- the loop
let Z = 3, dpr = 1, cam = { x: 0, y: 0 }, near = null, started = false, last = performance.now(), clock = 0;
function size() { dpr = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; const N = innerWidth < 700 ? 12 : 27; Z = dpr * Math.max(2, Math.round(Math.min(innerWidth / (TS * N), innerHeight / (TS * N * .62)))); g.imageSmoothingEnabled = false; }
addEventListener('resize', size); size();
function step(dt) {
  clock += dt;
  let vx = 0, vy = 0;
  if ($panel.hidden && started) {
    if (keys.has('a') || keys.has('arrowleft')) vx -= 1; if (keys.has('d') || keys.has('arrowright')) vx += 1; if (keys.has('w') || keys.has('arrowup')) vy -= 1; if (keys.has('s') || keys.has('arrowdown')) vy += 1;
    if (stick) { vx = stick.x; vy = stick.y; }
    if (target && !vx && !vy) { const dx = target.x - P.x, dy = target.y - P.y, d = Math.hypot(dx, dy); if (d < 3) target = null; else { vx = dx / d; vy = dy / d; } }
  }
  const len = Math.hypot(vx, vy); P.moving = len > .1;
  if (P.moving) { const sp = 78 * dt / Math.max(1, len); const nx = P.x + vx * sp, ny = P.y + vy * sp; let moved = false;
    if (!blocked(nx, P.y)) { P.x = nx; moved = true; } if (!blocked(P.x, ny)) { P.y = ny; moved = true; } if (!moved) target = null;
    P.dir = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 1 : 2) : (vy < 0 ? 3 : 0); P.t += dt; P.f = 1 + (Math.floor(P.t * 7) % 2); } else P.f = 0;
  NPCS.forEach((n) => { if (n.walk) { n.x += n.dir * dt * 1.1; if (n.x > n.walk[1] || n.x < n.walk[0]) n.dir *= -1; } if (n.walkY) { n.y += n.dir * dt * 1.1; if (n.y > n.walkY[1] || n.y < n.walkY[0]) n.dir *= -1; } });
  // what is near: a door, a sign, a person
  const cand = [...PLACES, ...NPCS].map((p) => ({ p, d: Math.hypot((p.x + .5) * TS - P.x, (p.y + .5) * TS - P.y) })).filter((q) => q.d < 22).sort((a, b) => a.d - b.d)[0]?.p || null;
  if (cand !== near) { near = cand; showPrompt(); }
  if (Math.floor(clock * 2) !== Math.floor((clock - dt) * 2)) { S.x = P.x / TS; S.y = P.y / TS; save(); }
}
function draw() {
  const vw = cv.width / Z, vh = cv.height / Z;
  cam.x = Math.max(0, Math.min(W * TS - vw, P.x - vw / 2)); cam.y = Math.max(0, Math.min(H * TS - vh, P.y - vh / 2));
  if (W * TS < vw) cam.x = (W * TS - vw) / 2; if (H * TS < vh) cam.y = (H * TS - vh) / 2;
  g.setTransform(Z, 0, 0, Z, -Math.round(cam.x * Z), -Math.round(cam.y * Z)); g.fillStyle = '#4f9a3c'; g.fillRect(cam.x - 2, cam.y - 2, vw + 4, vh + 4);
  const x0 = Math.max(0, Math.floor(cam.x / TS)), y0 = Math.max(0, Math.floor(cam.y / TS)), x1 = Math.min(W - 1, Math.ceil((cam.x + vw) / TS)), y1 = Math.min(H - 1, Math.ceil((cam.y + vh) / TS));
  const tile = (sheet, i, x, y) => g.drawImage(sheet, (i % 12) * TS, Math.floor(i / 12) * TS, TS, TS, x, y, TS, TS);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) tile(TOWN, ground[at(x, y)], x * TS, y * TS);
  // the things and the people, back to front
  const ents = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const o = obj[at(x, y)]; if (o >= 0) ents.push({ y: y * TS + 15, d: () => tile(sheetOf[at(x, y)] ? DUNG : TOWN, o, x * TS, y * TS) }); }
  NPCS.forEach((n) => ents.push({ y: n.y * TS + 15, d: () => { const bob = Math.round(Math.sin(clock * 4 + n.hx) * .6); g.save(); if (n.dir < 0 && (n.walk || n.walkY)) { g.translate(Math.round(n.x * TS) * 2 + TS, 0); g.scale(-1, 1); }
    g.drawImage(DUNG, (n.tile % 12) * TS, Math.floor(n.tile / 12) * TS, TS, TS, Math.round(n.x * TS), Math.round(n.y * TS) + bob, TS, TS); g.restore(); } }));
  ents.push({ y: P.y + 6, d: () => { g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(Math.round(P.x), Math.round(P.y) + 7, 5, 2, 0, 0, 7); g.fill();
    g.drawImage(KID, P.f * 16, P.dir * 16, 16, 16, Math.round(P.x) - 8, Math.round(P.y) - 9, 16, 16); } });
  ents.sort((a, b) => a.y - b.y).forEach((e) => e.d());
  // names over the buildings, a bouncing marker over the quest giver
  g.setTransform(1, 0, 0, 1, 0, 0);
  const sx = (wx) => (wx - cam.x) * Z, sy = (wy) => (wy - cam.y) * Z, fs = Math.max(13, Math.round(Z * (innerWidth < 700 ? 6.4 : 5.4)));
  g.textAlign = 'center'; g.lineJoin = 'round';
  PLACES.filter((p) => !p.small).forEach((p) => { const lx = p.label ? p.label[0] : p.bx + p.w / 2, ly = p.label ? p.label[1] : p.by;
    const X = sx((p.label ? lx + .5 : lx) * TS), Y = sy(ly * TS) - Z * 3; g.font = `800 ${fs}px "Baloo 2", "Noto Sans Sinhala", sans-serif`; const txt = `${p.icon} ${L(p.name)}`, w = g.measureText(txt).width + fs;
    g.fillStyle = OUT; roundRect(X - w / 2, Y - fs * .95, w, fs * 1.45, fs * .4); g.fill(); g.fillStyle = p.color; roundRect(X - w / 2 + 3, Y - fs * .95 + 3, w - 6, fs * 1.45 - 6, fs * .3); g.fill();
    g.fillStyle = '#fff'; g.fillText(txt, X, Y + fs * .2); });
  const tq = NPCS[0], tqd = QUESTS.some((q) => !S.quests[q.id]); if (tqd) { const X = sx(tq.x * TS + 8), Y = sy(tq.y * TS) - Z * 6 + Math.sin(clock * 5) * Z * 1.5; g.font = `800 ${fs * 2}px "Baloo 2", sans-serif`; g.lineWidth = Z * 1.6; g.strokeStyle = OUT; g.strokeText('!', X, Y); g.fillStyle = '#ffc23a'; g.fillText('!', X, Y); }
  if (target) { const X = sx(target.x), Y = sy(target.y); g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.ellipse(X, Y, Z * 4, Z * 2, 0, 0, 7); g.stroke(); }
  drawMini();
}
function roundRect(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function loop(now) { const dt = Math.min(.05, (now - last) / 1000); last = now; step(dt); draw(); requestAnimationFrame(loop); }

// ---------------------------------------------------------------- the minimap
let mini = null, miniBase = null;
function drawMini() { if (!mini) return; const m = mini.getContext('2d'), sw = mini.width / W, sh = mini.height / H;
  if (!miniBase) { miniBase = document.createElement('canvas'); miniBase.width = mini.width; miniBase.height = mini.height; const b = miniBase.getContext('2d');
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = at(x, y), o = obj[i]; b.fillStyle = o >= 48 && o < 92 ? '#9b5a4a' : o >= 0 && o < 30 ? '#2f7a34' : ground[i] >= 12 && ground[i] < 43 ? '#e8b273' : ground[i] === 43 ? '#cfd6dc' : '#6cbf4e'; b.fillRect(x * sw, y * sh, sw + .5, sh + .5); }
    PLACES.filter((p) => !p.small).forEach((p) => { b.fillStyle = p.color; b.fillRect(p.x * sw - 2, (p.y - 1) * sh - 2, 5, 5); }); }
  m.drawImage(miniBase, 0, 0); m.fillStyle = '#fff'; m.strokeStyle = OUT; m.lineWidth = 2; m.beginPath(); m.arc(P.x / TS * sw, P.y / TS * sh, 4, 0, 7); m.fill(); m.stroke(); }

// ---------------------------------------------------------------- the HUD
const $hud = document.getElementById('hud'), $prompt = document.getElementById('prompt'), $panel = document.getElementById('panel'), $toast = document.getElementById('toast');
function face(c, look = S.look) { const k = drawKid(look), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, c.width, c.height); x.drawImage(k, 0, 0, 16, 16, 0, 0, c.width, c.height); }
function hud() {
  const qDone = QUESTS.filter((q) => S.quests[q.id]).length;
  $hud.innerHTML = `<div class="me" data-h="me"><canvas width="32" height="32"></canvas><span class="lvl">${level()}</span><div><b>${esc(nameOf())}</b><small>${t('Level', 'Level')} ${level()} · ${S.xp % LVL}/${LVL} XP</small><div class="xp"><i style="width:${lvlPct()}%"></i></div></div></div>
    <div class="tr"><div class="chip" title="Coins"><span class="ico">🪙</span>${S.coins}</div><button class="chip ib" data-h="quests" title="${t('Quests', 'Quests')}">🎯${qDone < QUESTS.length ? `<em>${QUESTS.length - qDone}</em>` : ''}</button><button class="chip ib" data-h="fame" title="${t('Leaderboard', 'Leaderboard')}">🏆</button><button class="chip ib" data-h="menu" title="Menu">☰</button></div>
    <div class="questbox"><h4><span>${t('අද Quests', "TODAY'S QUESTS")}</span><span>${qDone}/${QUESTS.length}</span></h4><ul>${QUESTS.map((q) => `<li class="${S.quests[q.id] ? 'ok' : ''}"><i>${S.quests[q.id] ? '✓' : ''}</i><span>${esc(L(q.t))}</span><small>+${q.xp} XP</small></li>`).join('')}</ul></div>
    <canvas id="mini" width="184" height="128"></canvas>`;
  face($hud.querySelector('.me canvas')); mini = $hud.querySelector('#mini'); miniBase = null;
  $hud.querySelectorAll('[data-h]').forEach((b) => { b.onclick = () => { const h = b.dataset.h; if (h === 'quests') questsPanel(); if (h === 'fame') famePanel(); if (h === 'menu') menuPanel(); if (h === 'me') shopPanel(); }; });
}
function showPrompt() { if (!near || !$panel.hidden) { $prompt.hidden = true; $act.hidden = true; return; }
  const verb = near.tile ? t('කතා කරන්න', 'Talk') : near.id === 'chest' ? t('විවෘත කරන්න', 'Open') : near.id === 'notice' ? t('කියවන්න', 'Read') : t('ඇතුළට යන්න', 'Go in');
  $prompt.innerHTML = `<span>${near.icon || '💬'} ${esc(L(near.name))}</span><kbd>${touch ? '👆' : 'E'}</kbd><span class="note">${verb}</span>`; $prompt.hidden = false; $act.hidden = !touch; }
function toast(msg) { $toast.textContent = msg; $toast.hidden = false; clearTimeout($toast._t); $toast._t = setTimeout(() => { $toast.hidden = true; }, 2300); }
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let beepCtx = null; function beep(f = 880, d = .08, type = 'square', v = .04) { try { beepCtx ||= new AudioContext(); const o = beepCtx.createOscillator(), gn = beepCtx.createGain(); o.type = type; o.frequency.value = f; gn.gain.value = v; o.connect(gn); gn.connect(beepCtx.destination); o.start(); gn.gain.exponentialRampToValueAtTime(.0001, beepCtx.currentTime + d); o.stop(beepCtx.currentTime + d); } catch { /* none */ } }
const chime = () => { beep(660, .1); setTimeout(() => beep(880, .1), 90); setTimeout(() => beep(1320, .16), 180); };
function gain(xp, coins = 0, why = '') { const lv = level(); S.xp += xp; S.coins += coins; save(); hud(); chime();
  toast(`${why ? why + ' · ' : ''}+${xp} XP${coins ? ` · +${coins} 🪙` : ''}`);
  if (level() > lv) setTimeout(() => { toast(t(`🎉 Level ${level()} ට ආවා!`, `🎉 You reached level ${level()}!`)); beep(523, .12); setTimeout(() => beep(784, .12), 120); setTimeout(() => beep(1046, .25), 240); }, 1400); }
function quest(id) { if (S.quests[id]) return; const q = QUESTS.find((x) => x.id === id); S.quests[id] = 1; save(); gain(q.xp, q.coins, '🎯 ' + L(q.t)); }

// ---------------------------------------------------------------- panels
function panel(color, icon, title, sub, html, { sm = false, onClose = null } = {}) {
  $panel.innerHTML = `<div class="win${sm ? ' sm' : ''}"><div class="rib" style="--c:${color}"><span class="ri">${icon}</span><h2>${title}${sub ? `<small>${sub}</small>` : ''}</h2><button class="x" type="button" aria-label="Close">✕</button></div><div class="body">${html}</div></div>`;
  $panel.hidden = false; $prompt.hidden = true; $act.hidden = true; keys.clear(); target = null; $panel._close = onClose;
  $panel.querySelector('.x').onclick = closePanel; $panel.onclick = (e) => { if (e.target === $panel) closePanel(); };
  return $panel.querySelector('.body');
}
function closePanel() { const f = $panel._close; $panel._close = null; $panel.hidden = true; $panel.innerHTML = ''; clearInterval($panel._iv); f?.(); showPrompt(); }
function act(p) {
  beep(520, .05);
  if (p.tile) { if (p.id === 'teacher') { quest('talk'); questsPanel(p.say()); } else if (p.id === 'coach') gamesPanel(p.say()); else { panel('#3d8bdf', '💬', L(p.name), '', `<p class="qtext" style="margin:0">${esc(p.say())}</p>`, { sm: true }); } return; }
  ({ school: lessonsPanel, exam: papersPanel, cinema: videosPanel, shop: shopPanel, fame: famePanel, games: () => gamesPanel(), notice: noticesPanel, chest: chestOpen })[p.id]?.();
}

// ---- the Lesson School: a level path
function lessonsPanel() {
  const done = (id) => (S.stars[id] || 0) > 0, open = (id) => id === 1 || done(id - 1);
  const narrow = innerWidth < 640, pos = narrow ? LESSONS.map((_, i) => [i % 2 ? 70 : 30, 88 - i * 11]) : LESSONS.map((_, i) => [15 + (i % 4) * 23.3, i < 4 ? 72 : 28]).map(([x, y], i) => (i >= 4 ? [100 - x, y] : [x, y]));
  const b = panel('#e4594b', '📚', L(['පාඩම් පාසල', 'Lesson School']), L(['පාඩම් ඉවර කරද්දී ඊළඟ level එක විවෘත වෙනවා', 'Finish a lesson to open the next level']),
    `<div class="path" style="${narrow ? 'height:640px' : ''}"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M${pos.map(([x, y]) => `${x} ${y}`).join(' L')}" fill="none" stroke="#e8b273" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="stroke-width:26px"/><path d="M${pos.map(([x, y]) => `${x} ${y}`).join(' L')}" fill="none" stroke="#3b2733" stroke-dasharray="2 10" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:4px;opacity:.35"/></svg>
      ${LESSONS.map((l, i) => { const st = S.stars[l.id] || 0, cls = st ? 'done' : open(l.id) ? 'now' : 'lock'; return `<div class="node ${cls}" style="left:${pos[i][0]}%;top:calc(${pos[i][1]}% - 46px)"><div class="st">${st ? '★'.repeat(st) + '☆'.repeat(3 - st) : ''}</div><button type="button" data-l="${l.id}" ${cls === 'lock' ? 'disabled' : ''}>${cls === 'lock' ? '🔒' : l.ic}</button><b>${l.id}. ${esc(L(l.t))}</b></div>`; }).join('')}</div>
     <p class="note" style="margin-top:10px">${t('★ = පුහුණු ප්‍රශ්න වලින් ලකුණු. ⭐⭐⭐ ගන්න ආයෙත් කරන්න පුළුවන්.', '★ = your score in the practice. Play again any time for ⭐⭐⭐.')}</p>`);
  b.querySelectorAll('[data-l]').forEach((x) => { x.onclick = () => lessonCard(LESSONS.find((l) => l.id === +x.dataset.l)); });
}
function lessonCard(l) {
  const b = panel('#e4594b', l.ic, `${l.id}. ${L(l.t)}`, L(['පාඩම', 'Lesson']), `<div class="lcard"><ul>${l.pts.map((p, i) => `<li data-n="${i + 1}">${esc(L(p))}</li>`).join('')}</ul>
    <div class="row">${l.sim ? `<button class="btn b" data-a="sim">🧪 ${t('Simulation එක කරන්න', 'Try the simulation')}</button>` : ''}<button class="btn g" data-a="go">▶ ${t('පුහුණු ප්‍රශ්න 3', 'Practice: 3 questions')}</button><button class="btn w" data-a="back">← ${t('පාඩම් සිතියම', 'Lesson map')}</button></div></div>`);
  b.querySelector('[data-a=go]').onclick = () => quiz(l.qs, { color: '#e4594b', icon: l.ic, title: `${l.id}. ${L(l.t)}`, done: (sc) => { const st = sc === 3 ? 3 : sc === 2 ? 2 : sc ? 1 : 0; const was = S.stars[l.id] || 0;
    if (st > was) S.stars[l.id] = st; save(); if (st) quest('lesson'); return { stars: st, xp: st * 20, coins: st * 5, next: () => lessonsPanel() }; } });
  b.querySelector('[data-a=back]').onclick = lessonsPanel; b.querySelector('[data-a=sim]')?.addEventListener('click', () => (l.sim === 'pizza' ? pizzaSim(l) : clockSim(l)));
}
// one question at a time; options light up; a result screen with stars and the reward
function quiz(list, { color, icon, title, mins = 0, done }) {
  let i = 0, score = 0, picks = [], left = mins * 60;
  const b = panel(color, icon, title, '', '');
  const show = () => { const q = list[i];
    b.innerHTML = `<div class="qhead"><div class="dots">${list.map((_, k) => `<i class="${k < i ? (picks[k] === list[k].a ? 'ok' : 'no') : k === i ? 'on' : ''}"></i>`).join('')}</div>${mins ? `<span class="timer">${fmt(left)}</span>` : `<span>${i + 1} / ${list.length}</span>`}</div>
      <div class="qtext">${esc(L(q.q))}</div><div class="opts">${q.o.map((o, k) => `<button class="opt" data-k="${k}"><span>${'ABCD'[k]}</span>${esc(L(o))}</button>`).join('')}</div>`;
    b.querySelectorAll('.opt').forEach((x) => { x.onclick = () => { if (b._lock) return; b._lock = true; const k = +x.dataset.k; picks[i] = k; const ok = k === q.a; if (ok) score++;
      x.classList.add(ok ? 'ok' : 'no'); if (!ok) b.querySelector(`.opt[data-k="${q.a}"]`).classList.add('ok'); beep(ok ? 988 : 196, ok ? .12 : .22, ok ? 'square' : 'sawtooth');
      setTimeout(() => { b._lock = false; i++; if (i < list.length) show(); else finish(); }, ok ? 650 : 1200); }; }); };
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  if (mins) $panel._iv = setInterval(() => { left--; const tm = b.querySelector('.timer'); if (tm) { tm.textContent = fmt(Math.max(0, left)); tm.classList.toggle('low', left < 60); } if (left <= 0) { clearInterval($panel._iv); finish(); } }, 1000);
  const finish = () => { clearInterval($panel._iv); const r = done(score, picks);
    b.innerHTML = `<div class="res"><div class="stars">${[0, 1, 2].map((k) => `<span class="${k < r.stars ? '' : 'off'}">⭐</span>`).join('')}</div><div class="big">${score} / ${list.length}</div>
      ${r.extra || ''}<div class="rew"><span>+${r.xp} XP</span>${r.coins ? `<span>+${r.coins} 🪙</span>` : ''}</div>${r.review || ''}<div class="row" style="justify-content:center;margin-top:6px"><button class="btn g" data-a="next">${t('හරි', 'Continue')} ▶</button></div></div>`;
    if (r.xp) gain(r.xp, r.coins); b.querySelector('[data-a=next]').onclick = r.next || closePanel; };
  show();
}
// ---- simulations: fraction pizza, the clock
function pizzaSim(l) {
  const goals = [[3, 4], [1, 2], [5, 8], [1, 4]]; let gi = 0, sel = new Set();
  const b = panel('#3d8bdf', '🍕', L(['භාග පීසා · Simulation', 'Fraction pizza · simulation']), L(['පීසා කෑලි ඔබලා භාගය හදන්න', 'Tap the slices to make the fraction']), '');
  const draw = () => { const [n, d] = goals[gi], need = n * 8 / d;
    const slices = [...Array(8)].map((_, k) => { const a0 = k / 8 * Math.PI * 2 - Math.PI / 2, a1 = (k + 1) / 8 * Math.PI * 2 - Math.PI / 2, r = 46; const p = `M50 50 L${50 + r * Math.cos(a0)} ${50 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${50 + r * Math.cos(a1)} ${50 + r * Math.sin(a1)} Z`;
      const on = sel.has(k); return `<path d="${p}" data-s="${k}" fill="${on ? '#f4b942' : '#f7e3b5'}" stroke="#3b2733" stroke-width="1.6" style="cursor:pointer"/>${on ? [...Array(3)].map((_, j) => { const a = (a0 + a1) / 2 + (j - 1) * .18, rr = 18 + j * 9; return `<circle cx="${50 + rr * Math.cos(a)}" cy="${50 + rr * Math.sin(a)}" r="3.2" fill="#d9442f" stroke="#3b2733" stroke-width=".8" pointer-events="none"/>`; }).join('') : ''}`; }).join('');
    b.innerHTML = `<div class="sim"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="49" fill="#c97f45" stroke="#3b2733" stroke-width="2"/>${slices}</svg>
      <div style="display:grid;gap:12px"><div class="goal">${t('හදන්න:', 'Make:')} <b>${n}/${d}</b></div><div class="goal" style="font-size:18px">${t('තෝරපු කෑලි', 'Slices picked')}: <b>${sel.size}/8</b></div>
      <div class="fb" data-fb></div><div class="row"><button class="btn g" data-a="chk">✔ ${t('බලන්න', 'Check')}</button><button class="btn w" data-a="clr">${t('මකන්න', 'Clear')}</button></div><p class="note">${t('ඉඟිය: හරය 4 නම්, කෑලි 8 කොටස් 4කට බෙදන්න (කොටසකට කෑලි 2).', 'Hint: if the bottom is 4, split the 8 slices into 4 groups (2 slices each).')}</p></div></div>`;
    b.querySelectorAll('[data-s]').forEach((s) => { s.onclick = () => { const k = +s.dataset.s; sel.has(k) ? sel.delete(k) : sel.add(k); beep(700 + sel.size * 40, .05); draw(); }; });
    b.querySelector('[data-a=clr]').onclick = () => { sel.clear(); draw(); };
    b.querySelector('[data-a=chk]').onclick = () => { const fb = b.querySelector('[data-fb]'); if (sel.size === need) { fb.className = 'fb ok'; fb.textContent = t(`නියමයි! ${n}/${d} = කෑලි 8න් ${need}යි.`, `Great! ${n}/${d} = ${need} of 8 slices.`); chime();
      setTimeout(() => { gi++; sel.clear(); if (gi < goals.length) draw(); else { gain(30, 10, t('🍕 Simulation ඉවරයි', '🍕 Simulation done')); lessonCard(l); } }, 1200); } else { fb.className = 'fb no'; fb.textContent = t(`තව ටිකක්: ${n}/${d} ට කෑලි ${need}ක් ඕනේ.`, `Not yet: ${n}/${d} needs ${need} slices.`); beep(196, .2, 'sawtooth'); } }; };
  draw();
}
function clockSim(l) {
  const goals = [[3, 45], [7, 30], [10, 15], [2, 50]]; let gi = 0, mins = 0;
  const b = panel('#3d8bdf', '⏰', L(['ඔරලෝසුව · Simulation', 'The clock · simulation']), L(['දිග කටුව ඇදලා වේලාව හදන්න', 'Drag the long hand to set the time']), '');
  const hourOf = () => Math.floor(mins / 60) % 12 || 12, mm = () => mins % 60;
  const draw = () => { const [gh, gm] = goals[gi], ma = mm() / 60 * 360, ha = ((mins / 60) % 12) / 12 * 360;
    b.innerHTML = `<div class="sim"><svg viewBox="0 0 100 100" data-clock><circle cx="50" cy="50" r="47" fill="#fff6e4" stroke="#3b2733" stroke-width="3"/><circle cx="50" cy="50" r="42" fill="#fff" stroke="#e8b273" stroke-width="2"/>
      ${[...Array(12)].map((_, k) => { const a = (k + 1) / 12 * Math.PI * 2 - Math.PI / 2; return `<text x="${50 + 34 * Math.cos(a)}" y="${50 + 34 * Math.sin(a) + 3.5}" text-anchor="middle" font-size="9" font-weight="800" font-family="Baloo 2" fill="#3b2733">${k + 1}</text>`; }).join('')}
      ${[...Array(60)].map((_, k) => { const a = k / 60 * Math.PI * 2, r0 = k % 5 ? 40 : 38; return `<line x1="${50 + r0 * Math.sin(a)}" y1="${50 - r0 * Math.cos(a)}" x2="${50 + 42 * Math.sin(a)}" y2="${50 - 42 * Math.cos(a)}" stroke="#3b2733" stroke-width="${k % 5 ? .5 : 1.2}"/>`; }).join('')}
      <line x1="50" y1="50" x2="50" y2="28" stroke="#3b2733" stroke-width="4.5" stroke-linecap="round" transform="rotate(${ha} 50 50)"/>
      <line x1="50" y1="50" x2="50" y2="14" stroke="#e4594b" stroke-width="3" stroke-linecap="round" transform="rotate(${ma} 50 50)" style="cursor:grab"/><circle cx="50" cy="50" r="3.5" fill="#3b2733"/></svg>
      <div style="display:grid;gap:12px"><div class="goal">${t('වේලාව හදන්න:', 'Set the time:')} <b>${gh}:${String(gm).padStart(2, '0')}</b></div><div class="goal" style="font-size:18px">${t('දැන් ඔරලෝසුවේ', 'The clock shows')}: <b>${hourOf()}:${String(mm()).padStart(2, '0')}</b></div>
      <div class="fb" data-fb></div><div class="row"><button class="btn g" data-a="chk">✔ ${t('බලන්න', 'Check')}</button></div><p class="note">${t('දිග (රතු) කටුව ඇදලා කරකවන්න. කොට කටුව තනියම යනවා - ඇත්ත ඔරලෝසුවක වගේ.', 'Drag the long (red) hand round. The short hand moves by itself - like a real clock.')}</p></div></div>`;
    const svg = b.querySelector('[data-clock]'); let drag = false, prev = mm();
    const angle = (e) => { const r = svg.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2; return (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360; };
    svg.onpointerdown = (e) => { drag = true; svg.setPointerCapture(e.pointerId); };
    svg.onpointermove = (e) => { if (!drag) return; const m = Math.round(angle(e) / 6 / 5) * 5 % 60; if (m === prev) return; let d = m - prev; if (d > 30) d -= 60; if (d < -30) d += 60; mins = (mins + d + 720) % 720; prev = m; beep(1200, .02); draw2(); };
    svg.onpointerup = () => { drag = false; };
    const draw2 = () => { const ma2 = mm() / 60 * 360, ha2 = ((mins / 60) % 12) / 12 * 360, ls = svg.querySelectorAll('line[transform]'); ls[0].setAttribute('transform', `rotate(${ha2} 50 50)`); ls[1].setAttribute('transform', `rotate(${ma2} 50 50)`);
      b.querySelectorAll('.goal b')[1].textContent = `${hourOf()}:${String(mm()).padStart(2, '0')}`; };
    b.querySelector('[data-a=chk]').onclick = () => { const fb = b.querySelector('[data-fb]'); if (hourOf() === gh && mm() === gm) { fb.className = 'fb ok'; fb.textContent = t('හරියටම හරි! 🎉', 'Exactly right! 🎉'); chime();
      setTimeout(() => { gi++; if (gi < goals.length) draw(); else { gain(30, 10, t('⏰ Simulation ඉවරයි', '⏰ Simulation done')); lessonCard(l); } }, 1100); } else { fb.className = 'fb no'; fb.textContent = mm() !== gm ? t('දිග කටුව බලන්න.', 'Check the long hand.') : t('කොට කටුව බලන්න - තව වට කරකවන්න.', 'Check the short hand - turn round again.'); beep(196, .2, 'sawtooth'); } }; };
  draw();
}
// ---- the Exam Hall
function papersPanel() {
  const b = panel('#3d8bdf', '📝', L(['විභාග ශාලාව', 'Exam Hall']), L(['කාලය සහිත Model Papers · ලකුණු සහ පන්තියේ ස්ථානය', 'Timed model papers · marks and class rank']),
    `<div class="cards"><div class="card"><span class="tag">🆕 ${t('මේ සතියේ', 'This week')}</span><h3>${esc(L(PAPER.t))}</h3><p class="note">${t(`ප්‍රශ්න ${PAPER.qs.length} · විනාඩි ${PAPER.mins}`, `${PAPER.qs.length} questions · ${PAPER.mins} minutes`)}${S.best != null ? ` · ${t('හොඳම', 'Best')}: ${S.best}/${PAPER.qs.length}` : ''}</p><button class="btn g" data-a="go">▶ ${t('පටන් ගන්න', 'Start')}</button></div>
      ${PAPERS_OLD.map((p) => `<div class="card"><span class="tag">✔ ${t('කළා', 'Done')}</span><h3>${esc(L(p.t))}</h3><p class="note">${t('ලකුණු', 'Marks')}: <b>${p.score}</b> · ${t('පන්තියේ', 'Class rank')} #${p.rank}</p></div>`).join('')}
      <div class="card lock"><span class="tag">🔒 ${t('ලබන සතියේ', 'Next week')}</span><h3>Model Paper 08</h3><p class="note">${t('සෙනසුරාදා විවෘත වෙනවා', 'Opens on Saturday')}</p></div></div>`);
  b.querySelector('[data-a=go]').onclick = () => quiz(PAPER.qs, { color: '#3d8bdf', icon: '📝', title: L(PAPER.t), mins: PAPER.mins, done: (sc, picks) => {
    S.best = Math.max(S.best ?? 0, sc); save(); quest('paper'); const rank = [42, 30, 24, 19, 15, 12, 9, 6, 4, 2, 1][sc];
    return { stars: sc >= 9 ? 3 : sc >= 7 ? 2 : sc >= 4 ? 1 : 0, xp: sc * 8, coins: sc * 2, extra: `<div class="goal" style="font-size:18px">🏅 ${t(`පන්තියේ ${rank} වැනි ස්ථානය (සිසුන් 42)`, `Class rank #${rank} of 42`)}</div>`,
      review: `<div style="width:100%;text-align:left;margin-top:6px"><b>${t('ප්‍රශ්නයෙන් ප්‍රශ්නයට', 'Question by question')}</b>${PAPER.qs.map((q, k) => `<div class="note" style="padding:4px 0;border-bottom:1px dashed #e0cfae">${picks[k] === q.a ? '✅' : '❌'} ${k + 1}. ${esc(L(q.q))} → <b>${esc(L(q.o[q.a]))}</b></div>`).join('')}</div>`, next: papersPanel }; } });
}
// ---- the Cinema (recordings: open only for paid months; the student's name floats over the video)
function videosPanel() {
  const b = panel('#7a5cff', '🎬', L(['Recordings සිනමාව', 'Recordings Cinema']), L(['ගාස්තු ගෙවූ මාසවල පාඩම් නැවත බලන්න', 'Watch again the lessons of the months you paid']),
    VIDEOS.map((m, mi) => `<div class="month">📅 ${esc(L(m.m))} <span class="pd ${m.paid ? '' : 'no'}">${m.paid ? t('ගෙව්වා ✔', 'Paid ✔') : t('ගෙවන්න තියෙනවා', 'Not paid')}</span></div><div class="cards" style="margin-bottom:12px">${m.list.map(([tt, d], k) => `<div class="card ${m.paid ? '' : 'lock'}"><div class="thumb" style="${m.paid ? '' : 'filter:grayscale(1) brightness(.8)'}">${m.paid ? '▶' : '🔒'}<small>${d}</small></div><h3>${esc(L(tt))}</h3>${m.paid ? `<button class="btn b" data-v="${mi}-${k}">▶ ${t('බලන්න', 'Watch')}</button>` : `<p class="note">${t('ගාස්තු ගෙවූ පසු විවෘත වෙනවා', 'Opens when the fee is paid')}</p>`}</div>`).join('')}</div>`).join(''));
  b.querySelectorAll('[data-v]').forEach((x) => { x.onclick = () => { const [mi, k] = x.dataset.v.split('-').map(Number), [tt, d] = VIDEOS[mi].list[k];
    const pb = panel('#7a5cff', '🎬', L(tt), `${L(VIDEOS[mi].m)} · ${d}`, `<div class="player"><button class="pl">▶</button><span class="wm">${esc(nameOf())} · 077 123 4567</span></div><p class="note" style="margin-top:10px">${t('Demo එකක්: ඇත්ත LMS එකේ ගුරුතුමියගේ YouTube (unlisted) video එක මෙතන play වෙනවා. සිසුවාගේ නම video එක උඩ පාවෙන නිසා share කරන්න බෑ.', "Demo: in the real LMS the teacher's YouTube (unlisted) video plays here. The student's name floats over it, so it can't be shared.")}</p><div class="row" style="margin-top:10px"><button class="btn w" data-a="back">← ${t('Recordings', 'Recordings')}</button></div>`);
    const wm = pb.querySelector('.wm'), mv = () => { wm.style.left = `${5 + Math.random() * 55}%`; wm.style.top = `${8 + Math.random() * 78}%`; }; mv(); $panel._iv = setInterval(mv, 2200);
    pb.querySelector('[data-a=back]').onclick = videosPanel; pb.querySelector('.pl').onclick = (e) => { e.target.textContent = '⏸'; toast(t('🎬 Demo video එකක්', '🎬 A demo video')); }; }; });
}
// ---- the Playground: two games
function gamesPanel(hello) {
  const b = panel('#3fae3a', '🎮', L(['ක්‍රීඩා පිටිය', 'Playground']), hello || L(['සෙල්ලම් කරමින් ඉගෙන ගන්න', 'Learn while you play']),
    `<div class="cards"><div class="card"><div class="thumb" style="background:linear-gradient(135deg,#e0407e,#ffb21e)">🧠</div><h3>${t('ගළපන්න', 'Match it')}</h3><p class="note">${t('සමාන පද යුගල හොයන්න', 'Find the pairs of words that mean the same')}</p><button class="btn g" data-g="match">▶ ${t('Play', 'Play')}</button></div>
      <div class="card"><div class="thumb" style="background:linear-gradient(135deg,#3d8bdf,#5be0c8)">⚡</div><h3>${t('වේගවත් ගණිතය', 'Quick maths')}</h3><p class="note">${t('තත්පර 30න් පුළුවන් තරම් උත්තර', 'As many answers as you can in 30 seconds')}</p><button class="btn g" data-g="math">▶ ${t('Play', 'Play')}</button></div>
      <div class="card lock"><div class="thumb" style="filter:grayscale(1)">🧩</div><h3>${t('පිළිවෙළට තබන්න', 'Put in order')}</h3><p class="note">${t('Level 5 දී විවෘත වෙනවා', 'Opens at level 5')}</p></div></div>`);
  b.querySelector('[data-g=match]').onclick = matchGame; b.querySelector('[data-g=math]').onclick = mathGame;
}
function matchGame() {
  const pairs = lang === 'en' ? [['big', 'large'], ['fast', 'quick'], ['happy', 'glad'], ['small', 'tiny'], ['begin', 'start'], ['shut', 'close']] : [['ලස්සන', 'සුන්දර'], ['ජලය', 'වතුර'], ['සූර්යයා', 'ඉර'], ['නිවස', 'ගෙදර'], ['ගස', 'රුක'], ['සඳ', 'චන්ද්‍රයා']];
  const cards = pairs.flatMap((p, i) => p.map((w) => ({ w, i }))).sort(() => Math.random() - .5); let sel = null, found = 0, tries = 0;
  const b = panel('#e0407e', '🧠', t('ගළපන්න', 'Match it'), t('එකම අර්ථය තියෙන වචන දෙක ඔබන්න', 'Tap two words that mean the same'), `<div class="mgrid">${cards.map((c, k) => `<button class="tile" data-k="${k}">${esc(c.w)}</button>`).join('')}</div><p class="note" style="margin-top:10px" data-s></p>`);
  b.querySelectorAll('.tile').forEach((x) => { x.onclick = () => { const k = +x.dataset.k; if (x.classList.contains('done') || sel === k) return; beep(700, .04);
    if (sel == null) { sel = k; x.classList.add('sel'); return; } const a = b.querySelector(`[data-k="${sel}"]`); tries++;
    if (cards[sel].i === cards[k].i) { a.classList.add('done'); x.classList.add('done'); found++; beep(1046, .1); if (found === pairs.length) { const st = tries <= 8 ? 3 : tries <= 11 ? 2 : 1; quest('game'); setTimeout(() => { gain(st * 10, st * 5, t('🧠 ගළපන්න', '🧠 Match it')); gamesPanel(); }, 500); } }
    else { a.classList.add('bad'); x.classList.add('bad'); beep(196, .15, 'sawtooth'); setTimeout(() => { a.classList.remove('bad', 'sel'); x.classList.remove('bad'); }, 400); }
    if (cards[sel]?.i !== cards[k]?.i || true) { b.querySelectorAll('.sel').forEach((s) => s.classList.remove('sel')); sel = null; } b.querySelector('[data-s]').textContent = t(`උත්සාහ ${tries} · හම්බුණු ${found}/${pairs.length}`, `Tries ${tries} · found ${found}/${pairs.length}`); }; });
}
function mathGame() {
  let left = 30, score = 0, q;
  const make = () => { const o = '+-×'[Math.floor(Math.random() * 3)]; let a, c; if (o === '×') { a = 2 + Math.floor(Math.random() * 8); c = 2 + Math.floor(Math.random() * 8); } else { a = 10 + Math.floor(Math.random() * 60); c = 2 + Math.floor(Math.random() * 30); if (o === '-' && c > a) [a, c] = [c, a]; }
    const ans = o === '+' ? a + c : o === '-' ? a - c : a * c, opts = new Set([ans]); while (opts.size < 4) opts.add(ans + Math.floor(Math.random() * 11) - 5); return { s: `${a} ${o} ${c}`, ans, opts: [...opts].sort(() => Math.random() - .5) }; };
  const b = panel('#3d8bdf', '⚡', t('වේගවත් ගණිතය', 'Quick maths'), '', '');
  const show = () => { q = make(); b.innerHTML = `<div class="qhead"><span>⭐ ${score}</span><span class="timer ${left < 10 ? 'low' : ''}">00:${String(left).padStart(2, '0')}</span></div><div class="mathq">${q.s} = ?</div><div class="opts">${q.opts.map((o) => `<button class="opt" data-v="${o}"><span>${'ABCD'[q.opts.indexOf(o)]}</span>${o}</button>`).join('')}</div>`;
    b.querySelectorAll('.opt').forEach((x) => { x.onclick = () => { if (+x.dataset.v === q.ans) { score++; beep(988, .07); } else beep(196, .15, 'sawtooth'); show(); }; }); };
  show(); $panel._iv = setInterval(() => { left--; const tm = b.querySelector('.timer'); if (tm) { tm.textContent = `00:${String(Math.max(0, left)).padStart(2, '0')}`; tm.classList.toggle('low', left < 10); }
    if (left <= 0) { clearInterval($panel._iv); quest('game'); b.innerHTML = `<div class="res"><div class="big">${score}</div><p class="goal" style="font-size:18px">${t('නිවැරදි උත්තර', 'correct answers')}</p><div class="rew"><span>+${score * 3} XP</span><span>+${score} 🪙</span></div><div class="row" style="justify-content:center"><button class="btn g" data-a="ok">${t('හරි', 'Continue')} ▶</button></div></div>`; gain(score * 3, score); b.querySelector('[data-a=ok]').onclick = gamesPanel; } }, 1000);
}
// ---- the Wardrobe Shop: the coins dress the character
function shopPanel() {
  let tab = 'shirt';
  const b = panel('#e0407e', '👕', L(['ඇඳුම් කඩේ', 'Wardrobe Shop']), L(['Coins වලින් ඔබේ character එක ලස්සන කරන්න', 'Dress your character with your coins']), '');
  const slot = (s) => (s === 'long' ? 'hair' : s);
  const draw = () => { b.innerHTML = `<div class="shop"><div class="mirror"><canvas width="64" height="64"></canvas><b>${esc(nameOf())}</b><span class="chip" style="height:36px">🪙 ${S.coins}</span></div>
    <div><div class="row" style="margin-bottom:10px">${[['shirt', t('Shirts', 'Shirts')], ['hair', t('කොණ්ඩය', 'Hair')], ['hat', t('Caps', 'Caps')]].map(([k, n]) => `<button class="btn ${tab === k ? '' : 'w'}" data-t="${k}">${n}</button>`).join('')}</div>
    <div class="items">${SHOP.filter((it) => slot(it[1]) === tab).map(([id, s, v, price, si, en]) => { const own = S.owned.includes(id), on = S.look[s] === v && own;
      const sw = s === 'long' ? `<span class="sw" style="background:${S.look.hair};border-radius:${v ? '10px 10px 4px 4px' : '50%'}"></span>` : `<span class="sw" style="background:${v || 'repeating-linear-gradient(45deg,#fff 0 4px,#eee 4px 8px)'}"></span>`;
      return `<button class="item ${on ? 'on' : ''}" data-i="${id}">${sw}${esc(lang === 'en' ? en : si)}<small>${on ? t('ඇඳලා ✔', 'Wearing ✔') : own ? t('ඔබේ', 'Yours') : `🪙 ${price}`}</small></button>`; }).join('')}</div></div></div>`;
    face(b.querySelector('.mirror canvas'));
    b.querySelectorAll('[data-t]').forEach((x) => { x.onclick = () => { tab = x.dataset.t; draw(); }; });
    b.querySelectorAll('[data-i]').forEach((x) => { x.onclick = () => { const it = SHOP.find((s) => s[0] === x.dataset.i), [id, s, v, price] = it;
      if (!S.owned.includes(id)) { if (S.coins < price) { toast(t('🪙 Coins මදි - quests සහ games වලින් එකතු කරන්න', '🪙 Not enough coins - earn them in quests and games')); beep(196, .2, 'sawtooth'); return; } S.coins -= price; S.owned.push(id); toast(t('🛍️ ගත්තා!', '🛍️ Bought!')); chime(); }
      S.look[s] = v; save(); KID = drawKid(S.look); hud(); draw(); }; }); };
  draw();
}
// ---- Hall of Fame, quests, notices, the chest, the menu
function famePanel() {
  const me = [nameOf(), nameOf(), S.xp], list = [...LEADERS, me].sort((a, b) => b[2] - a[2]);
  panel('#c98a12', '🏆', L(['ජයග්‍රාහී ශාලාව', 'Hall of Fame']), L(['මේ සතියේ leaderboard · වැඩිම XP', "This week's leaderboard · most XP"]),
    `<ul class="lb">${list.map((r, i) => `<li class="${r === me ? 'me2' : ''}"><em>${i + 1}</em><span>${esc(lang === 'en' ? r[1] : r[0])}${r === me ? ` (${t('ඔබ', 'you')})` : ''}</span><span>${r[2]} XP</span></li>`).join('')}</ul><p class="note">${t('🎁 සතියේ ජයග්‍රාහකයාට ගුරුතුමියගෙන් තෑග්ගක් (ගුරුතුමියගේ නීති අනුව).', "🎁 This week's winner gets a gift from Miss (her own rules).")}</p>`, { sm: true });
}
function questsPanel(hello) {
  panel('#e4594b', '🎯', L(['අද Quests', "Today's quests"]), hello || L(['හැම දවසකම අලුත් quests', 'New quests every day']),
    `<ul class="lb">${QUESTS.map((q) => `<li class="${S.quests[q.id] ? 'me2' : ''}"><em>${S.quests[q.id] ? '✔' : '🎯'}</em><span>${esc(L(q.t))}</span><span>+${q.xp} XP${q.coins ? ` · ${q.coins}🪙` : ''}</span></li>`).join('')}</ul><p class="note">${t('ඉඟිය: පාඩම් පාසලට, විභාග ශාලාවට සහ ක්‍රීඩා පිටියට යන්න.', 'Hint: visit the Lesson School, the Exam Hall and the Playground.')}</p>`, { sm: true });
}
function noticesPanel() { panel('#c97f45', '📌', L(['දැන්වීම් පුවරුව', 'Notice board']), CLASS.teacher[lang === 'en' ? 1 : 0], NOTICES.map(([h, p]) => `<div class="card" style="margin-bottom:10px"><h3>📢 ${esc(L(h))}</h3><p>${esc(L(p))}</p></div>`).join(''), { sm: true }); }
function chestOpen() { if (S.chest === today()) { toast(t('🎁 අද තෑග්ග ගත්තා. හෙට එන්න!', '🎁 Already opened today. Come back tomorrow!')); return; } S.chest = today(); save(); gain(15, 25, t('🎁 දිනපතා තෑග්ග', '🎁 Daily gift')); }
function menuPanel() {
  const b = panel('#3b2733', '☰', 'Menu', `${L(CLASS.name)} · ${L(CLASS.grade)}`,
    `<div style="display:grid;gap:10px"><button class="btn w" data-m="lang">🌐 ${lang === 'en' ? 'සිංහල' : 'English'}</button><button class="btn w" data-m="me">👕 ${t('මගේ character එක', 'My character')}</button>
      <a class="btn b" href="../lms-basic/index.html?pkg=advanced&role=teacher" target="_blank" rel="noopener">👩‍🏫 ${t('ගුරු Admin පැත්ත (demo)', 'Teacher admin side (demo)')} ↗</a>
      <button class="btn w" data-m="reset">↺ ${t('Demo එක මුල ඉඳන්', 'Restart the demo')}</button>
      <p class="note">${t('මේ Samsoft ගේ Game World LMS sample එකක්. ඔබේ පන්තියේ නම, logo එක, පාට, විෂය සහ පාඩම් වලට හදලා දෙනවා.', "This is Samsoft's Game World LMS sample. Yours is made with your class name, logo, colours, subject and lessons.")} <a href="https://samsoft.lk/lms" style="color:var(--blue);font-weight:800">samsoft.lk/lms</a></p></div>`, { sm: true });
  b.querySelector('[data-m=lang]').onclick = () => { lang = lang === 'en' ? 'si' : 'en'; try { localStorage.setItem('sp-gw-lang', lang); } catch { /* none */ } document.documentElement.lang = lang; closePanel(); hud(); };
  b.querySelector('[data-m=me]').onclick = shopPanel; b.querySelector('[data-m=reset]').onclick = () => { S = fresh(); save(); KID = drawKid(S.look); P.x = 23 * TS; P.y = 19.5 * TS; closePanel(); hud(); titleScreen(); };
}

// ---------------------------------------------------------------- the title screen
function titleScreen() {
  const $t = document.getElementById('title'); started = false; $hud.hidden = true; $joy.hidden = true; $act.hidden = true; $prompt.hidden = true;
  $t.innerHTML = `<div class="tcard"><button class="btn w lang" data-a="lang" style="min-height:34px;font-size:13px;padding:0 10px">🌐 ${lang === 'en' ? 'සිංහල' : 'English'}</button><div class="logo">${esc(L(CLASS.name))}</div><div class="sub">${esc(L(CLASS.teacher))} · ${esc(L(CLASS.grade))}</div>
    <div class="who"><canvas width="32" height="32"></canvas><input data-a="name" maxlength="16" value="${esc(nameOf())}" aria-label="name"></div>
    <div class="row"><button class="btn g" data-a="go" style="min-height:52px;font-size:20px;padding:0 30px">▶ ${t('ලෝකයට යන්න', 'Enter the world')}</button></div>
    <div class="keys">${touch ? t('Joystick එකෙන් ඇවිදින්න · 👆 බොත්තමෙන් ඇතුළට යන්න', 'Walk with the joystick · 👆 to go in') : t('WASD / ඊතල ඇවිදින්න · E ඇතුළට යන්න · ක්ලික් කරලා යන්නත් පුළුවන්', 'WASD / arrows to walk · E to go in · or click where to go')}</div>
    <p class="note" style="margin-top:8px">Samsoft · Game World LMS sample</p></div>`;
  $t.hidden = false; face($t.querySelector('canvas'));
  $t.querySelector('[data-a=lang]').onclick = () => { lang = lang === 'en' ? 'si' : 'en'; try { localStorage.setItem('sp-gw-lang', lang); } catch { /* none */ } titleScreen(); };
  const go = () => { const v = $t.querySelector('[data-a=name]').value.trim(); S.name = v === t('සඳුනි', 'Sanduni') ? '' : v; save(); $t.hidden = true; started = true; $hud.hidden = false; $joy.hidden = !touch; hud(); showPrompt(); chime(); toast(t(`👋 ආයුබෝවන් ${nameOf()}! ගුරුතුමිය ළඟට යන්න (!).`, `👋 Hello ${nameOf()}! Go to Miss (!).`)); };
  $t.querySelector('[data-a=go]').onclick = go; $t.querySelector('[data-a=name]').onkeydown = (e) => { if (e.key === 'Enter') go(); };
}
document.documentElement.lang = lang;
await document.fonts.ready.catch(() => {});
titleScreen(); requestAnimationFrame(loop);
window.gw = { S, P, PLACES, NPCS, act, get near() { return near; } }; // (tests)
