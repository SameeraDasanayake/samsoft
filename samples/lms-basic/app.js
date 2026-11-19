/* Samsoft sample LMS (Basic package). Design demo: everything runs in the browser with sample data. */
(function () {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const root = document.documentElement, q = new URLSearchParams(location.search);
  const L = (si, en) => `<span lang="si">${si}</span><span lang="en">${en}</span>`;
  const lang = () => root.dataset.lang;

  /* ---------- sample data ---------- */
  const REC = [
    { id: 'r1', t: ['ජාල සහ අන්තර්ජාලය · 1 කොටස', 'Networks and the Internet · Part 1'], d: '2026-12-14', len: '58:20', k: 'theory', m: 'dec', p: 64, c: ['#4b51d6', '#22c3ee'] },
    { id: 'r2', t: ['IP ලිපින සහ උපජාල', 'IP addresses and subnets'], d: '2026-12-10', len: '1:02:10', k: 'theory', m: 'dec', p: 100, c: ['#7c3aed', '#4b51d6'] },
    { id: 'r3', t: ['2026 Model Paper සාකච්ඡාව', '2026 model paper discussion'], d: '2026-12-07', len: '1:24:45', k: 'paper', m: 'dec', p: 30, c: ['#0f766e', '#22c3ee'] },
    { id: 'r4', t: ['Python · if සහ loops', 'Python · if and loops'], d: '2026-12-03', len: '45:12', k: 'practical', m: 'dec', p: 0, c: ['#ca8a04', '#f97316'] },
    { id: 'r5', t: ['දත්ත සන්නිවේදනය', 'Data communication'], d: '2026-11-30', len: '55:03', k: 'theory', m: 'nov', p: 100, c: ['#2563eb', '#7c3aed'] },
    { id: 'r6', t: ['Spreadsheet සූත්‍ර', 'Spreadsheet formulas'], d: '2026-11-23', len: '49:40', k: 'practical', m: 'nov', p: 100, c: ['#16a34a', '#0ea5e9'] },
    { id: 'r7', t: ['ජාල ස්ථලකය · Revision', 'Network topologies · revision'], d: '2027-01-04', len: '—', k: 'theory', m: 'jan', p: 0, c: ['#64748b', '#334155'] },
    { id: 'r8', t: ['Paper 01 සාකච්ඡාව', 'Paper 01 discussion'], d: '2027-01-08', len: '—', k: 'paper', m: 'jan', p: 0, c: ['#64748b', '#334155'] }
  ];
  const PAID = { nov: true, dec: true, jan: false };
  const NOTES = [
    { t: ['ජාල සහ අන්තර්ජාලය · Tute', 'Networks and the Internet · Tute'], k: 'tute', s: '2.4 MB', n: 12, d: '2026-12-14' },
    { t: ['IP ලිපින · අභ්‍යාස පත්‍රිකාව', 'IP addresses · worksheet'], k: 'tute', s: '860 KB', n: 4, d: '2026-12-10' },
    { t: ['2026 Model Paper · ප්‍රශ්න පත්‍රය', '2026 model paper · questions'], k: 'paper', s: '1.8 MB', n: 8, d: '2026-12-07' },
    { t: ['2026 Model Paper · පිළිතුරු', '2026 model paper · answers'], k: 'paper', s: '1.1 MB', n: 6, d: '2026-12-07' },
    { t: ['Python සූත්‍ර කාඩ්පත', 'Python cheat sheet'], k: 'other', s: '420 KB', n: 2, d: '2026-12-03' },
    { t: ['දත්ත සන්නිවේදනය · Tute', 'Data communication · Tute'], k: 'tute', s: '2.1 MB', n: 10, d: '2026-11-30' },
    { t: ['Spreadsheet practical ගොනුව', 'Spreadsheet practical file'], k: 'other', s: '96 KB', n: 0, d: '2026-11-23', x: 'XLSX' },
    { t: ['2025 O/L ICT · Past paper', '2025 O/L ICT · past paper'], k: 'paper', s: '2.9 MB', n: 12, d: '2026-11-20' }
  ];
  const NEWS = [
    { pin: true, unread: true, d: '12 Dec', t: ['ජනවාරි 4 සිට 2027 Revision පන්තිය', '2027 revision class from 4 January'], b: ['සතියකට දින දෙකක්. Revision පන්තියට ලියාපදිංචි වීමට ගුරුතුමාට WhatsApp කරන්න.', 'Two days a week. WhatsApp the teacher to join the revision class.'] },
    { unread: true, d: '10 Dec', t: ['IP ලිපින recording එක upload කළා', 'The IP addresses recording is up'], b: ['පන්තියට සහභාගී නොවූ අය අද රෑ 10ට පෙර බලන්න.', 'If you missed class, watch it before 10 pm tonight.'] },
    { d: '05 Dec', t: ['දෙසැම්බර් 25 පන්ති නොපැවැත්වේ', 'No class on 25 December'], b: ['නත්තල් නිවාඩුව. ඊළඟ පන්තිය දෙසැම්බර් 27.', 'Christmas holiday. The next class is on 27 December.'] },
    { d: '28 Nov', t: ['Practical ලැබ් එක සඳහා USB එකක් රැගෙන එන්න', 'Bring a USB drive to the practical lab'], b: ['ඉරිදා Python practical එකට.', 'For the Sunday Python practical.'] }
  ];
  const WEEK = [['ඉරි', 'Sun', 'Theory', '8.00 – 11.00', true], ['සඳු', 'Mon', '', ''], ['අඟ', 'Tue', '', ''], ['බදා', 'Wed', 'Paper class', '7.30 – 9.30 · Zoom'], ['බ්‍රහ', 'Thu', '', ''], ['සිකු', 'Fri', '', ''], ['සෙන', 'Sat', 'Practical', '2.00 – 4.00']];

  /* ---------- language / theme ---------- */
  function setLang(l) { root.dataset.lang = l; root.lang = l; $('#q').placeholder = l === 'si' ? 'පාඩම්, සටහන් සොයන්න…' : 'Search lessons, notes…'; }
  setLang(q.get('lang') === 'en' ? 'en' : 'si');
  try { if (localStorage.getItem('kj-theme') === 'dark') root.dataset.theme = 'dark'; } catch (e) {}
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    const k = a.dataset.act;
    if (k === 'lang') setLang(lang() === 'si' ? 'en' : 'si');
    if (k === 'theme') { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('kj-theme', root.dataset.theme); } catch (x) {} }
    if (k === 'logout') { $('#app').hidden = true; $('#login').hidden = false; }
  });

  /* ---------- toast ---------- */
  let tt; function toast(h) { const t = $('#toast'); t.innerHTML = h; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2600); }

  /* ---------- login ---------- */
  $('#eye').onclick = () => { const p = $('#pw'); p.type = p.type === 'password' ? 'text' : 'password'; };
  $('#loginForm').addEventListener('submit', e => {
    e.preventDefault(); const b = e.target.querySelector('.btn'); b.classList.add('busy');
    setTimeout(() => { b.classList.remove('busy'); $('#login').hidden = true; $('#app').hidden = false; show(q.get('v') || 'home'); boot(); }, 650);
  });
  if (q.get('v')) { $('#login').hidden = true; $('#app').hidden = false; }

  /* ---------- views ---------- */
  function show(v) {
    if (!$('#v-' + v)) v = 'home';
    $$('.view').forEach(x => x.classList.toggle('on', x.id === 'v-' + v));
    $$('[data-v]').forEach(x => x.classList.toggle('on', x.dataset.v === v));
    $('.main').scrollTo?.(0, 0); window.scrollTo(0, 0);
    if (v === 'home') boot();
  }
  document.addEventListener('click', e => { const a = e.target.closest('[data-v]'); if (a) { e.preventDefault(); show(a.dataset.v); } });

  /* ---------- home ---------- */
  let booted = false;
  function boot() {
    const watched = Math.round(REC.filter(r => r.p === 100).length / REC.filter(r => r.m !== 'jan').length * 100);
    const C = 2 * Math.PI * 50, ring = $('#ringVal');
    ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C;
    requestAnimationFrame(() => requestAnimationFrame(() => { ring.style.strokeDashoffset = C * (1 - watched / 100); }));
    countUp($('#ringTxt'), watched, '%');
    $$('[data-count]').forEach(b => countUp(b, +b.dataset.count, ''));
    if (booted) return; booted = true;
  }
  function countUp(el, to, suf) { const t0 = performance.now(); const f = n => { const k = Math.min(1, (n - t0) / 900); el.textContent = Math.round(to * (1 - (1 - k) ** 3)) + suf; if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }

  const thumb = (r, big) => `<div class="thumb${big ? ' big' : ''}" style="--c1:${r.c[0]};--c2:${r.c[1]}"><span class="tl">${L(r.t[0], r.t[1])}</span><span class="len">${r.len}</span>${r.p > 0 && r.p < 100 ? `<i class="pbar"><b style="width:${r.p}%"></b></i>` : ''}${r.p === 100 ? '<em class="done">✓</em>' : ''}</div>`;
  $('#cw').innerHTML = REC.filter(r => r.p > 0 && r.p < 100).map(r => `<button class="cw-item" data-play="${r.id}">${thumb(r)}<span><b>${L(r.t[0], r.t[1])}</b><small>${r.p}% · ${r.len}</small></span></button>`).join('');
  $('#week').innerHTML = WEEK.map(([si, en, k, tm, today]) => `<div class="day${k ? ' has' : ''}${today ? ' today' : ''}"><small>${L(si, en)}</small>${k ? `<b>${k}</b><span>${tm}</span>` : '<span class="free">—</span>'}</div>`).join('');

  /* countdown to the next Sunday 8.00 am */
  function nextClass() { const n = new Date(), t = new Date(n); t.setHours(8, 0, 0, 0); t.setDate(n.getDate() + ((7 - n.getDay()) % 7)); if (t <= n) t.setDate(t.getDate() + 7); return t; }
  const tgt = nextClass();
  function tick() { let s = Math.max(0, (tgt - new Date()) / 1000 | 0); const d = s / 86400 | 0; s %= 86400; const h = s / 3600 | 0; s %= 3600; const m = s / 60 | 0; s %= 60;
    $('#cdSide').innerHTML = [[d, 'දින', 'd'], [h, 'පැය', 'h'], [m, 'මි', 'm'], [s, 'තත්', 's']].map(([v, a, b]) => `<span><b>${String(v).padStart(2, '0')}</b>${L(a, b)}</span>`).join(''); }
  tick(); setInterval(tick, 1000);

  /* ---------- recordings ---------- */
  let recF = 'all';
  function drawRec() {
    const s = ($('#q').value || '').toLowerCase();
    const list = REC.filter(r => (recF === 'all' || r.k === recF) && (!s || (r.t[0] + r.t[1]).toLowerCase().includes(s)));
    $('#recs').innerHTML = list.map(r => { const locked = !PAID[r.m];
      return `<article class="rec glass${locked ? ' locked' : ''}" data-${locked ? 'lock' : 'play'}="${r.id}">${thumb(r, true)}${locked ? `<div class="lockov"><i>🔒</i>${L('ජනවාරි ගාස්තුව ගෙවූ පසු විවෘත වේ', 'Opens after the January fee')}</div>` : '<span class="playic">▶</span>'}
      <div class="rec-t"><b>${L(r.t[0], r.t[1])}</b><small>${r.d} · ${r.k === 'paper' ? L('Paper සාකච්ඡාව', 'Paper class') : r.k === 'practical' ? 'Practical' : 'Theory'}</small></div></article>`; }).join('') ||
      `<p class="empty">${L('කිසිවක් හමු නොවීය.', 'Nothing found.')}</p>`;
  }
  $$('#recTabs button').forEach(b => b.onclick = () => { recF = b.dataset.f; $$('#recTabs button').forEach(x => x.setAttribute('aria-pressed', x === b)); drawRec(); });
  drawRec();

  /* ---------- notes ---------- */
  let noteF = 'all';
  function drawNotes() {
    const s = ($('#q').value || '').toLowerCase();
    $('#notes').innerHTML = NOTES.filter(n => (noteF === 'all' || n.k === noteF) && (!s || (n.t[0] + n.t[1]).toLowerCase().includes(s))).map((n, i) => `
      <article class="note glass"><span class="ft ${n.x ? 'x' : n.k}">${n.x || 'PDF'}</span><div><b>${L(n.t[0], n.t[1])}</b><small>${n.d} · ${n.s}${n.n ? ' · ' + L(`පිටු ${n.n}`, `${n.n} pages`) : ''}</small></div>
      <button class="dl" data-dl="${i}" title="Download">↓</button></article>`).join('') || `<p class="empty">${L('කිසිවක් හමු නොවීය.', 'Nothing found.')}</p>`;
  }
  $$('#noteTabs button').forEach(b => b.onclick = () => { noteF = b.dataset.f; $$('#noteTabs button').forEach(x => x.setAttribute('aria-pressed', x === b)); drawNotes(); });
  drawNotes();
  document.addEventListener('click', e => { const d = e.target.closest('[data-dl]'); if (!d) return;
    d.classList.add('ok'); d.textContent = '✓'; toast(L('ආදර්ශ LMS: සැබෑ පද්ධතියේ PDF එක බාගත වේ.', 'Sample LMS: on a real system the PDF downloads.')); });

  /* ---------- search box works on the open view ---------- */
  $('#q').addEventListener('input', () => { const v = $('.view.on').id; if (v === 'v-rec') drawRec(); else if (v === 'v-notes') drawNotes(); else if ($('#q').value.length > 1) { show('rec'); drawRec(); } });

  /* ---------- notices ---------- */
  function drawNews() {
    const un = NEWS.filter(n => n.unread).length;
    $('#newsBadge').textContent = un; $('#newsBadge').hidden = !un; $('#bellDot').hidden = !un;
    const item = (n, i) => `<article class="nw glass${n.unread ? ' un' : ''}" data-read="${i}"><time>${n.d}</time><div><b>${n.pin ? '📌 ' : ''}${L(n.t[0], n.t[1])}</b><p>${L(n.b[0], n.b[1])}</p></div>${n.unread ? `<em>${L('අලුත්', 'New')}</em>` : ''}</article>`;
    $('#news').innerHTML = NEWS.map(item).join('');
    $('#newsMini').innerHTML = NEWS.slice(0, 3).map((n, i) => `<div class="nm${n.unread ? ' un' : ''}" data-read="${i}"><i></i><span><b>${L(n.t[0], n.t[1])}</b><small>${n.d}</small></span></div>`).join('');
  }
  document.addEventListener('click', e => { const r = e.target.closest('[data-read]'); if (!r) return; NEWS[+r.dataset.read].unread = false; drawNews(); });
  $('#readAll').onclick = () => { NEWS.forEach(n => n.unread = false); drawNews(); };
  drawNews();

  /* ---------- fees ---------- */
  $('#fees').innerHTML = [['ජනවාරි 2027', 'January 2027', false], ['දෙසැම්බර් 2026', 'December 2026', true], ['නොවැම්බර් 2026', 'November 2026', true], ['ඔක්තෝබර් 2026', 'October 2026', true]]
    .map(([si, en, p]) => `<div class="fee"><span>${L(si, en)}</span><b>Rs. 2,200</b><em class="${p ? 'ok' : 'due'}">${p ? L('ගෙවා ඇත', 'Paid') : L('ගෙවීමට ඇත', 'Due')}</em></div>`).join('');

  /* ---------- player ---------- */
  let playing = false, pos = 0, timer = 0, speed = 1, cur = null;
  const total = 3500;
  const fmt = s => `${String(s / 60 | 0).padStart(2, '0')}:${String(s % 60 | 0).padStart(2, '0')}`;
  function open(id) { cur = REC.find(r => r.id === id); if (!cur) return;
    pos = Math.round(total * (cur.p === 100 ? 0 : cur.p / 100));
    $('#screen').style.setProperty('--c1', cur.c[0]); $('#screen').style.setProperty('--c2', cur.c[1]);
    $('#scTitle').innerHTML = L(cur.t[0], cur.t[1]); $('#pTitle').innerHTML = L(cur.t[0], cur.t[1]); $('#pMeta').textContent = `${cur.d} · ${cur.len}`;
    $('#player').hidden = false; upd(); }
  function upd() { $('#progVal').style.width = (pos / total * 100) + '%'; $('#tm').textContent = `${fmt(pos)} / 58:20`; $('#pp').textContent = playing ? '❚❚' : '▶'; $('#bigplay').hidden = playing; }
  function play(on) { playing = on; clearInterval(timer); if (on) timer = setInterval(() => { pos = Math.min(total, pos + speed); upd(); }, 50); upd(); }
  function close() { play(false); $('#player').hidden = true; }
  document.addEventListener('click', e => {
    const p = e.target.closest('[data-play]'); if (p) { open(p.dataset.play); return; }
    const l = e.target.closest('[data-lock]'); if (l) toast(L('🔒 මෙම recording එක ජනවාරි ගාස්තුව ගෙවූ පසු විවෘත වේ.', '🔒 This recording opens after the January fee is paid.'));
  });
  $('#bigplay').onclick = () => play(true); $('#pp').onclick = () => play(!playing);
  $('#spd').onclick = () => { speed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1; $('#spd').textContent = speed + 'x'; };
  $('#prog').onclick = e => { const b = $('#prog').getBoundingClientRect(); pos = Math.round((e.clientX - b.left) / b.width * total); upd(); };
  $('#closeP').onclick = close; $('#player').addEventListener('click', e => { if (e.target.id === 'player') close(); });
  addEventListener('keydown', e => { if (!$('#player').hidden && e.key === 'Escape') close(); });
  /* the watermark moves around so a screen recording always shows who it belongs to */
  setInterval(() => { const w = $('#wm'); w.style.left = (8 + Math.random() * 60) + '%'; w.style.top = (10 + Math.random() * 60) + '%'; }, 4000);

  if (q.get('v')) { show(q.get('v')); boot(); }
})();
