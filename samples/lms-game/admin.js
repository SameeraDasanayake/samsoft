// SITHUMINA WORLD - the teacher's side of the Game World LMS sample (Samsoft, 2026-11-21).
// Same world, same look as the game (game.css / sprite.js / data.js): the students and their pixel characters, the lesson path
// (what unlocks when), daily quests and events, the wardrobe shop prices, model paper results, recordings, fees and notices.
// Demo only: made-up students, everything kept in this browser (localStorage). A notice posted here shows on the game's notice board.
import { drawKid, LOOK0 } from './sprite.js';
import { CLASS, LESSONS, PAPER, VIDEOS, NOTICES, LEADERS, QUESTS, SHOP } from './data.js';

// ---------------------------------------------------------------- language + saved settings
const qs = new URLSearchParams(location.search);
let lang = qs.get('lang') || (() => { try { return localStorage.getItem('sp-gw-lang'); } catch { return null; } })() || 'si';
const L = (pair) => (Array.isArray(pair) ? pair[lang === 'en' ? 1 : 0] : pair);
const t = (si, en) => (lang === 'en' ? en : si);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const num = (n) => Number(n).toLocaleString('en-US');
const KEY = 'sp-gw-admin-v1', NKEY = 'sp-gw-notices';
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private window */ } };
const fresh = () => ({
  paid: {}, bonus: {}, lock: {}, rule: {}, lxp: {}, quests: Object.fromEntries(QUESTS.map((q) => [q.id, { xp: q.xp, coins: q.coins, on: true }])),
  event: { on: false, kind: 'xp2' }, chest: { xp: 15, coins: 25 }, shop: Object.fromEntries(SHOP.map((s) => [s[0], { price: s[3], on: true }])), fee: 1500,
});
let A = { ...fresh(), ...load(KEY, {}) };
const save = () => store(KEY, A);
let myNotices = load(NKEY, []);

// ---------------------------------------------------------------- made-up students (the same every visit)
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const NAMES = [...LEADERS.map(([si, en]) => [si, en]), ['සඳුනි', 'Sanduni'], ['මිනුලි', 'Minuli'], ['යසිරු', 'Yasiru'], ['සෙනුරි', 'Senuri'], ['තිසර', 'Thisara'], ['ඉසුරු', 'Isuru'],
  ['නිම්සරා', 'Nimsara'], ['හසිනි', 'Hasini'], ['ලක්ෂාන්', 'Lakshan'], ['ඕෂන්', 'Oshan'], ['දුල්මි', 'Dulmi'], ['ශෙනාලි', 'Shenali'], ['කසුන්', 'Kasun'], ['ප්‍රවීන්', 'Praveen'],
  ['සචිනි', 'Sachini'], ['රශ්මි', 'Rashmi'], ['විනුක', 'Vinuka'], ['සනුජ', 'Sanuja'], ['ඉමාෂා', 'Imasha'], ['දේවින්', 'Devin'], ['හිමාෂ', 'Himasha'], ['තරුෂි', 'Tharushi'],
  ['ගිම්හාන', 'Gimhana'], ['සසිඳු', 'Sasindu'], ['නුවන්', 'Nuwan'], ['අමායා', 'Amaya'], ['චමෝද්', 'Chamod']];
const GIRLS = new Set(['Nethmi', 'Dinithi', 'Oshadhi', 'Thenuli', 'Hiruni', 'Sanduni', 'Minuli', 'Senuri', 'Nimsara', 'Hasini', 'Dulmi', 'Shenali', 'Sachini', 'Rashmi', 'Imasha', 'Himasha', 'Tharushi', 'Amaya']);
const SKINS = ['#c98a5e', '#b87a4e', '#d9a074', '#a86b44'];
const shirts = SHOP.filter((s) => s[1] === 'shirt').map((s) => s[2]), hats = SHOP.filter((s) => s[1] === 'hat').map((s) => s[2]);
const ST = NAMES.map((n, i) => {
  const xp = i < LEADERS.length ? LEADERS[i][2] : Math.round(120 + rnd() * 420), girl = GIRLS.has(n[1]);
  const done = Math.min(LESSONS.length, Math.max(1, Math.round(xp / 190 + rnd())));
  const stars = Object.fromEntries(LESSONS.slice(0, done).map((l) => [l.id, 1 + Math.floor(rnd() * 3)]));
  return { id: 's' + i, sn: 'SW-2027-' + String(101 + i).padStart(4, '0'), n, xp, coins: Math.round(xp * .12 + rnd() * 60), stars, paper: Math.min(10, Math.max(3, Math.round(4 + (xp / 1500) * 5 + rnd() * 2))),
    seen: i < 5 ? 0 : pick([0, 0, 0, 1, 1, 2, 4, 6]), paidOld: rnd() > .06, paid: rnd() > .22 || i < 5, ph: '07' + pick(['1', '2', '5', '6', '7', '8']) + ' ' + String(100 + Math.floor(rnd() * 899)) + ' ' + String(1000 + Math.floor(rnd() * 8999)),
    look: { skin: pick(SKINS), hair: pick(['#2b1d1a', '#2b1d1a', '#6b3e22']), shirt: pick(shirts), long: girl, hat: rnd() > .65 ? pick(hats.filter(Boolean)) : null } };
});
const lvlOf = (xp) => Math.floor(xp / 250) + 1;
const xpOf = (s) => s.xp + (A.bonus[s.id]?.xp || 0), coinsOf = (s) => s.coins + (A.bonus[s.id]?.coins || 0);
const isPaid = (s) => (s.id in A.paid ? A.paid[s.id] : s.paid);
const byXp = () => [...ST].sort((a, b) => xpOf(b) - xpOf(a));
const starStr = (n) => '★'.repeat(n) + `<s>${'★'.repeat(3 - n)}</s>`;

// the face of a character (front, standing) on a small canvas
const kidCache = new Map();
function kid(look, size = 48) {
  const k = JSON.stringify(look); if (!kidCache.has(k)) kidCache.set(k, drawKid({ ...LOOK0, ...look }));
  const c = document.createElement('canvas'); c.width = size; c.height = size; c.className = 'kid';
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(kidCache.get(k), 0, 0, 16, 16, 0, 0, size, size); return c;
}
const kidSlot = (look, size) => `<canvas class="kid" data-look='${esc(JSON.stringify(look))}' data-size="${size || 48}"></canvas>`;
const paintKids = (root) => root.querySelectorAll('canvas[data-look]').forEach((c) => { const k = kid(JSON.parse(c.dataset.look), +c.dataset.size); c.replaceWith(k); k.className = c.className; k.style.cssText = c.style.cssText; });

// ---------------------------------------------------------------- small helpers
const $main = document.getElementById('main'), $nav = document.getElementById('nav'), $drawer = document.getElementById('drawer'), $toast = document.getElementById('toast');
let toastT = 0;
function toast(msg) { $toast.textContent = msg; $toast.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { $toast.hidden = true; }, 2400); }
const win = (c, icon, title, sub, body, extra = '') => `<section class="win" style="--c:${c}"><div class="rib"><span class="ri">${icon}</span><h2>${title}${sub ? `<small>${sub}</small>` : ''}</h2>${extra}</div><div class="body">${body}</div></section>`;
const stat = (c, icon, big, small) => `<div class="stat" style="--c:${c}"><i>${icon}</i><span><b>${big}</b><small>${small}</small></span></div>`;
const bar = (pct, cls = '') => `<div class="bar ${cls}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
const wa = (s, text) => `https://wa.me/?text=${encodeURIComponent(text)}`;

// ---------------------------------------------------------------- the pages
const PAGES = [
  { id: 'home', icon: '🏠', t: ['ගම් පුවරුව', 'Village board'] },
  { id: 'kids', icon: '👦', t: ['සිසුන්', 'Students'] },
  { id: 'world', icon: '🗺️', t: ['ලෝකය සහ පාඩම්', 'World & lessons'] },
  { id: 'quests', icon: '🎯', t: ['Quests සහ events', 'Quests & events'] },
  { id: 'shop', icon: '👕', t: ['ඇඳුම් කඩේ', 'Wardrobe shop'] },
  { id: 'results', icon: '📝', t: ['Papers සහ recordings', 'Papers & recordings'] },
  { id: 'fees', icon: '💰', t: ['ගාස්තු', 'Fees'] },
  { id: 'qr', icon: '🎫', t: ['QR කාඩ් සහ පැමිණීම', 'QR cards & attendance'] },
  { id: 'notices', icon: '📌', t: ['දැන්වීම්', 'Notices'] },
];
let page = (location.hash || '#home').slice(1); if (!PAGES.some((p) => p.id === page)) page = 'home';
let filter = 'all', query = '';

function top() {
  const me = kid({ skin: '#c98a5e', hair: '#2b1d1a', shirt: '#e0407e', long: true }, 34);
  document.getElementById('top').innerHTML = `<div class="logo"><i>🏰</i><span><b>${esc(L(CLASS.name))}</b><small>${esc(L(CLASS.grade))}</small></span></div>
    <span class="tag">👩‍🏫 ${t('ගුරු ADMIN', 'TEACHER ADMIN')}</span><span class="sp"></span>
    <button class="btn w sm" data-a="lang">🌐 ${lang === 'en' ? 'සිංහල' : 'English'}</button>
    <a class="btn g sm" href="index.html">🎮 ${t('සිසු පැත්ත (game)', 'Student side (game)')}</a>
    <span class="me" id="meChip">${esc(L(CLASS.teacher))}</span>`;
  document.getElementById('meChip').prepend(me);
  document.querySelector('[data-a=lang]').onclick = () => { lang = lang === 'en' ? 'si' : 'en'; try { localStorage.setItem('sp-gw-lang', lang); } catch { /* none */ } document.documentElement.lang = lang; render(); };
  document.getElementById('demo').textContent = t('SAMPLE · මේ Game World LMS එකේ ගුරු පැත්තේ demo එකක්. සිසුන් කල්පිතයි; ඔබ කරන වෙනස්කම් මේ browser එකේ විතරක් save වෙනවා.',
    'SAMPLE · The teacher side of the Game World LMS. The students are made up; your changes are saved in this browser only.');
}
function nav() {
  const unpaid = ST.filter((s) => !isPaid(s)).length;
  $nav.innerHTML = PAGES.map((p) => `<button data-p="${p.id}" aria-current="${p.id === page}"><i>${p.icon}</i>${esc(L(p.t))}${p.id === 'fees' && unpaid ? `<em>${unpaid}</em>` : ''}</button>`).join('')
    + `<p class="note">${t('ගුරුතුමිය මෙතනින් ලෝකය පාලනය කරනවා: පාඩම්, quests, ත්‍යාග, ගාස්තු.', 'Miss runs the world from here: lessons, quests, rewards, fees.')}</p>`;
}
$nav.onclick = (e) => { const b = e.target.closest('[data-p]'); if (!b) return; page = b.dataset.p; history.replaceState(null, '', '#' + page); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); };

// 🏠 the village board
function home() {
  const unpaid = ST.filter((s) => !isPaid(s)), today = ST.filter((s) => s.seen === 0).length, away = ST.filter((s) => s.seen >= 4);
  const weekXp = ST.reduce((a, s) => a + Math.round(xpOf(s) * .16), 0);
  const visits = [['📚', ['පාඩම් පාසල', 'Lesson School'], '#e4594b', 64], ['📝', ['විභාග ශාලාව', 'Exam Hall'], '#3d8bdf', 31], ['🎬', ['Recordings සිනමාව', 'Recordings Cinema'], '#7a5cff', 22],
    ['🎮', ['ක්‍රීඩා පිටිය', 'Playground'], '#3fae3a', 48], ['👕', ['ඇඳුම් කඩේ', 'Wardrobe Shop'], '#e0407e', 19], ['🏆', ['ජයග්‍රාහී ශාලාව', 'Hall of Fame'], '#c98a12', 27]];
  const max = Math.max(...visits.map((v) => v[3]));
  return `<div class="grid g4">${stat('#5ab7e8', '👦', ST.length, t('සිසුන්', 'students'))}${stat('#6cbf4e', '🟢', today, t('අද ලෝකයට ආවා', 'in the world today'))}
      ${stat('#ffc23a', '⭐', num(weekXp), t('මේ සතියේ XP', 'XP this week'))}${stat('#e4594b', '💰', `${ST.length - unpaid.length}/${ST.length}`, t('දෙසැම්බර් ගාස්තු ගෙවා', 'paid for December'))}</div>
    ${win('#3fae3a', '🗺️', t('අද ගමේ ගිය තැන්', 'Where they went today'), t('ගොඩනැගිලි වලට ගිය වාර', 'Visits to each building'), `<div class="village">${visits.map(([ic, n, c, v]) => `<div class="place" style="--c:${c}"><span class="roof"></span><b>${ic} ${esc(L(n))}</b><big>${v}</big>${bar(v / max * 100)}</div>`).join('')}</div>`)}
    <div class="grid g2">
      ${win('#c98a12', '🏆', t('සතියේ ජයග්‍රාහකයෝ', 'Stars of the week'), t('වැඩිම XP', 'Most XP'), `<div class="rows">${byXp().slice(0, 5).map((s, i) => `<div class="row"><b style="width:22px">${['🥇', '🥈', '🥉', '4', '5'][i]}</b>${kidSlot(s.look, 36)}<span class="grow"><b>${esc(L(s.n))}</b><small>Level ${lvlOf(xpOf(s))}</small></span><span class="pill gold">${num(xpOf(s))} XP</span></div>`).join('')}</div>`)}
      ${win('#e4594b', '🔔', t('ඔබේ අවධානයට', 'Needs your attention'), '', `<div class="rows">
        <div class="row"><span style="font-size:22px">💰</span><span class="grow"><b>${t(`ගාස්තු නොගෙවූ සිසුන් ${unpaid.length}ක්`, `${unpaid.length} students have not paid`)}</b><small>${t('ඔවුන්ට දෙසැම්බර් recordings පේන්නේ නැහැ', 'They cannot see the December recordings')}</small></span><button class="btn sm" data-go="fees">${t('බලන්න', 'Open')}</button></div>
        <div class="row"><span style="font-size:22px">💤</span><span class="grow"><b>${t(`දවස් 4+ ලෝකයට නාපු අය ${away.length}ක්`, `${away.length} have not come in 4+ days`)}</b><small>${away.slice(0, 4).map((s) => esc(L(s.n))).join(', ')}</small></span><button class="btn sm" data-go="kids">${t('බලන්න', 'Open')}</button></div>
        <div class="row"><span style="font-size:22px">📝</span><span class="grow"><b>${t('Model Paper 07: ප්‍රශ්න 2ක් අමාරුයි', 'Model Paper 07: two questions were hard')}</b><small>${t('ප්‍රශ්න 3 සහ 7, නිවැරදි 50% ට අඩුයි', 'Q3 and Q7, under 50% correct')}</small></span><button class="btn sm" data-go="results">${t('බලන්න', 'Open')}</button></div>
        <div class="row"><span style="font-size:22px">${A.event.on ? '⚡' : '🎉'}</span><span class="grow"><b>${A.event.on ? t('XP x2 සතිය දැන් ක්‍රියාත්මකයි', 'XP x2 week is on') : t('Event එකක් පටන් ගන්න', 'Start an event')}</b><small>${t('Model paper සතියට XP දෙගුණයක් දෙන්න', 'Double XP for the model paper week')}</small></span><button class="btn sm" data-go="quests">${t('බලන්න', 'Open')}</button></div>
      </div>`)}
    </div>`;
}

// 👦 students
function kids() {
  const list = byXp().filter((s) => (filter === 'unpaid' ? !isPaid(s) : filter === 'away' ? s.seen >= 4 : true) && (!query || (s.n[0] + ' ' + s.n[1]).toLowerCase().includes(query.toLowerCase())));
  const seen = (s) => (s.seen === 0 ? t('අද', 'today') : t(`දවස් ${s.seen}කට කලින්`, `${s.seen} day${s.seen > 1 ? 's' : ''} ago`));
  return win('#3d8bdf', '👦', t('සිසුන් සහ ඔවුන්ගේ characters', 'Students and their characters'), t(`සිසුන් ${ST.length} · character එක ක්ලික් කරලා විස්තර බලන්න`, `${ST.length} students · click a character for details`),
    `<div class="tools"><input class="inp" id="q" placeholder="${t('නමකින් හොයන්න…', 'Search a name…')}" value="${esc(query)}">
      <div class="seg">${[['all', t('හැමෝම', 'All')], ['unpaid', t('නොගෙවූ', 'Unpaid')], ['away', t('දවස් 4+ නාපු', 'Away 4+ days')]].map(([k, l]) => `<button data-f="${k}" aria-pressed="${filter === k}">${l}</button>`).join('')}</div>
      <span class="sp" style="flex:1"></span><button class="btn g" data-a="add">＋ ${t('අලුත් සිසුවෙක්', 'New student')}</button></div>
    <div class="kids">${list.map((s) => { const x = xpOf(s); return `<button class="kidc" data-kid="${s.id}"><span class="hd">${kidSlot(s.look, 54)}<span><b>${esc(L(s.n))}</b><small>${seen(s)}</small></span><span class="lv" style="margin-left:auto">${lvlOf(x)}</span></span>
      ${bar((x % 250) / 250 * 100)}<span class="meta"><span class="pill gold">⭐ ${num(x)}</span><span class="pill">🪙 ${coinsOf(s)}</span><span class="pill ${isPaid(s) ? 'ok' : 'no'}">${isPaid(s) ? t('ගෙවා', 'Paid') : t('නොගෙවූ', 'Unpaid')}</span></span></button>`; }).join('') || `<p class="note">${t('කවුරුත් නැහැ.', 'Nobody here.')}</p>`}</div>`);
}
function kidDrawer(id) {
  const s = ST.find((x) => x.id === id); if (!s) return; const x = xpOf(s);
  const stars = LESSONS.map((l) => `<div class="row"><span style="font-size:20px">${l.ic}</span><span class="grow"><b>${esc(L(l.t))}</b></span><span class="stars">${s.stars[l.id] ? starStr(s.stars[l.id]) : `<span class="mut">🔒 ${t('තවම නැහැ', 'not yet')}</span>`}</span></div>`).join('');
  const msg = t(`ආයුබෝවන්! ${L(s.n)} ගේ සතියේ වාර්තාව (${L(CLASS.name)}): Level ${lvlOf(x)}, XP ${num(x)}, Model Paper 07: ${s.paper}/10. - ${L(CLASS.teacher)}`,
    `Hello! ${L(s.n)}'s weekly report (${L(CLASS.name)}): Level ${lvlOf(x)}, ${num(x)} XP, Model Paper 07: ${s.paper}/10. - ${L(CLASS.teacher)}`);
  $drawer.innerHTML = `<div class="scrim" data-close="1"><section class="win" style="--c:#3d8bdf"><div class="rib"><span class="ri">👦</span><h2>${esc(L(s.n))}<small>${t('දෙමාපිය අංකය', 'Parent')} · ${s.ph}</small></h2><button class="x" data-close="1">✕</button></div>
    <div class="body"><div class="hero">${kidSlot(s.look, 112)}<div style="flex:1;min-width:220px"><div class="grid g3" style="gap:10px">${stat('#ffc23a', '⭐', num(x), 'XP')}${stat('#e4594b', '🎖️', lvlOf(x), 'Level')}${stat('#6cbf4e', '🪙', coinsOf(s), 'coins')}</div>
      <p class="note" style="margin-top:10px">${t('ඊළඟ level එකට', 'To the next level')}: ${250 - (x % 250)} XP</p>${bar((x % 250) / 250 * 100, 'gold')}</div></div>
      <div class="grid g2" style="margin-top:16px"><div><h3>📚 ${t('පාඩම් සහ stars', 'Lessons and stars')}</h3><div class="rows">${stars}</div></div>
      <div><h3>🎁 ${t('ත්‍යාගයක් දෙන්න', 'Give a reward')}</h3><div class="rows"><div class="row" style="flex-wrap:wrap"><button class="btn sm" data-bonus="xp" data-v="50">＋50 XP</button><button class="btn sm" data-bonus="xp" data-v="100">＋100 XP</button><button class="btn sm g" data-bonus="coins" data-v="20">＋20 🪙</button><button class="btn sm g" data-bonus="coins" data-v="50">＋50 🪙</button></div>
        <p class="note">${t('XP සහ coins කෙලින්ම සිසුවාගේ character එකට එකතු වෙනවා.', "The XP and coins go straight to the student's character.")}</p></div>
        <h3 style="margin-top:14px">💰 ${t('දෙසැම්බර් ගාස්තුව', 'December fee')}</h3><div class="row"><span class="grow"><b>${t('රු.', 'Rs.')} ${num(A.fee)}</b><small>${isPaid(s) ? t('ගෙවා ඇත', 'Paid') : t('තවම ගෙවලා නැහැ', 'Not paid yet')}</small></span><button class="btn sm ${isPaid(s) ? 'w' : 'g'}" data-pay="${s.id}">${isPaid(s) ? t('නොගෙවූ ලෙස', 'Mark unpaid') : '✓ ' + t('ගෙවූ ලෙස', 'Mark paid')}</button></div>
        <h3 style="margin-top:14px">📝 Model Paper 07</h3><div class="row"><span class="grow"><b>${s.paper} / ${PAPER.qs.length}</b>${bar(s.paper / PAPER.qs.length * 100, 'blue')}</span></div>
        <a class="btn b" style="margin-top:14px;width:100%" target="_blank" rel="noopener" href="${wa(s, msg)}">💬 ${t('දෙමාපියන්ට WhatsApp වාර්තාව', 'WhatsApp report to the parent')}</a></div></div></div></section></div>`;
  $drawer.hidden = false; paintKids($drawer);
  $drawer.onclick = (e) => {
    if (e.target.dataset.close) { $drawer.hidden = true; return; }
    const b = e.target.closest('[data-bonus]'); if (b) { const o = (A.bonus[s.id] ||= { xp: 0, coins: 0 }); o[b.dataset.bonus] += +b.dataset.v; save(); toast(`🎁 ${L(s.n)}: +${b.dataset.v} ${b.dataset.bonus === 'xp' ? 'XP' : '🪙'}`); kidDrawer(id); render(false); return; }
    const p = e.target.closest('[data-pay]'); if (p) { A.paid[s.id] = !isPaid(s); save(); toast(isPaid(s) ? t('✓ ගෙවූ ලෙස සටහන් කළා. Recordings විවෘත වුණා.', '✓ Marked paid. Recordings are open.') : t('නොගෙවූ ලෙස සටහන් කළා.', 'Marked unpaid.')); kidDrawer(id); render(false); }
  };
}

// 🗺️ the lesson path
const RULES = [['open', ['හැමෝටම විවෘතයි', 'Open to all']], ['s1', ['කලින් පාඩමට ⭐1+', 'Previous lesson ⭐1+']], ['s2', ['කලින් පාඩමට ⭐2+', 'Previous lesson ⭐2+']], ['s3', ['කලින් පාඩමට ⭐3', 'Previous lesson ⭐3']], ['paid', ['ගාස්තු ගෙවූ අයට පමණි', 'Paid students only']]];
function world() {
  return win('#e4594b', '🗺️', t('ලෝකය සහ පාඩම් පාර', 'The world and the lesson path'), t('පාඩම් game levels වගේ unlock වෙන්නේ මෙතන දාන නීති අනුව', 'Lessons unlock like game levels, by the rules you set here'),
    `<div class="path">${LESSONS.map((l, i) => {
      const done = ST.filter((s) => s.stars[l.id]).length, locked = !!A.lock[l.id], rule = A.rule[l.id] || (i === 0 ? 'open' : 's2'), xp = A.lxp[l.id] ?? 50;
      return `<div class="lvl ${locked ? 'locked' : ''}"><span class="node">${locked ? '🔒' : l.ic}<em>${i + 1}</em></span>
        <span class="info"><b>${esc(L(l.t))}</b><small class="note">${t(`ප්‍රශ්න ${l.qs.length}ක් · ${done}/${ST.length} සිසුන් ඉවර කළා`, `${l.qs.length} questions · ${done}/${ST.length} students finished`)}${l.sim ? ' · ' + t('Simulation එකක් ඇතුළත්', 'with a simulation') : ''}</small>${bar(done / ST.length * 100)}</span>
        <span class="ctrl"><select class="inp" data-rule="${l.id}" aria-label="unlock rule">${RULES.map(([k, n]) => `<option value="${k}" ${k === rule ? 'selected' : ''}>${esc(L(n))}</option>`).join('')}</select>
          <span class="price">⭐ <input class="inp" type="number" min="0" step="10" value="${xp}" data-lxp="${l.id}" aria-label="XP"> XP</span>
          <button class="btn sm ${locked ? 'g' : 'w'}" data-lock="${l.id}">${locked ? '🔓 ' + t('විවෘත කරන්න', 'Open') : '🔒 ' + t('වහන්න', 'Lock')}</button></span></div>`;
    }).join('')}</div>
    <div class="tools" style="margin:14px 0 0"><button class="btn g" data-a="addlesson">＋ ${t('අලුත් පාඩමක් (level එකක්)', 'New lesson (a level)')}</button><span class="note">${t('පාඩමක: සටහන් කරුණු, ප්‍රශ්න, simulation එකක්, XP සහ unlock නීතිය.', 'A lesson has notes, questions, an optional simulation, XP and an unlock rule.')}</span></div>`);
}

// 🎯 quests, events, the daily chest
function quests() {
  return `<div class="grid g2">${win('#e4594b', '🎯', t('දිනපතා quests', 'Daily quests'), t('හැම දවසකම අලුතෙන්. XP සහ coins ඔබම තීරණය කරන්න.', 'New every day. You decide the XP and coins.'),
      `<div class="rows">${QUESTS.map((q) => { const c = A.quests[q.id]; return `<div class="row" style="flex-wrap:wrap"><span style="font-size:20px">🎯</span><span class="grow"><b>${esc(L(q.t))}</b><small>${t(`අද සිසුන් ${Math.round(ST.length * (q.id === 'talk' ? .7 : q.id === 'lesson' ? .55 : q.id === 'game' ? .6 : .3))}ක් ඉවර කළා`, `${Math.round(ST.length * (q.id === 'talk' ? .7 : q.id === 'lesson' ? .55 : q.id === 'game' ? .6 : .3))} students finished today`)}</small></span>
        <span class="price">⭐<input class="inp" type="number" min="0" step="5" value="${c.xp}" data-qxp="${q.id}" aria-label="XP"></span><span class="price">🪙<input class="inp" type="number" min="0" step="5" value="${c.coins}" data-qco="${q.id}" aria-label="coins"></span>
        <button class="tog" data-qon="${q.id}" aria-pressed="${c.on}" aria-label="on"></button></div>`; }).join('')}</div>
      <button class="btn g" style="margin-top:12px" data-a="addquest">＋ ${t('අලුත් quest එකක්', 'New quest')}</button>`)}
    <div class="grid">${win('#7a5cff', '⚡', t('Events', 'Events'), t('විභාගයට කලින් සිසුන්ව උනන්දු කරන්න', 'Get them going before the exam'),
      `<div class="rows">${[['xp2', '⚡', ['XP x2 සතිය', 'XP x2 week'], ['හැම quest එකකටම XP දෙගුණයක්', 'Double XP for every quest']], ['paper', '📝', ['Model Paper මැරතන්', 'Model paper marathon'], ['දවසට paper එකක් කළොත් විශේෂ cap එකක්', 'A paper a day wins a special cap']], ['shop', '🛍️', ['කඩේ 50% sale', 'Shop 50% sale'], ['ඇඳුම් ඔක්කොම භාගෙට', 'All clothes at half price']]].map(([k, ic, n, d]) => `<div class="row"><span style="font-size:22px">${ic}</span><span class="grow"><b>${esc(L(n))}</b><small>${esc(L(d))}</small></span><button class="tog" data-ev="${k}" aria-pressed="${A.event.on && A.event.kind === k}" aria-label="on"></button></div>`).join('')}</div>`)}
    ${win('#c98a12', '🎁', t('දිනපතා තෑගි පෙට්ටිය', 'Daily gift chest'), t('ගමේ තියෙන පෙට්ටිය දවසකට එක පාරක්', 'The chest in the village, once a day'),
      `<div class="row"><span style="font-size:26px">🎁</span><span class="grow"><b>${t('තෑග්ග', 'Reward')}</b></span><span class="price">⭐<input class="inp" type="number" min="0" step="5" value="${A.chest.xp}" data-chest="xp" aria-label="XP"></span><span class="price">🪙<input class="inp" type="number" min="0" step="5" value="${A.chest.coins}" data-chest="coins" aria-label="coins"></span></div>`)}</div></div>`;
}

// 👕 the wardrobe shop
function shop() {
  const slotName = { shirt: ['Shirt', 'Shirt'], hair: ['කොණ්ඩේ පාට', 'Hair colour'], long: ['කොණ්ඩේ හැඩය', 'Hair style'], hat: ['Cap', 'Cap'] };
  return win('#e0407e', '👕', t('ඇඳුම් කඩේ', 'Wardrobe shop'), t('සිසුන් coins වලින් ගන්න දේවල්. මිල සහ on/off ඔබම.', 'What students buy with coins. You set the prices and what is on sale.'),
    `<div class="shop">${SHOP.map(([id, slot, val, , si, en]) => { const c = A.shop[id], look = { ...LOOK0, [slot === 'long' ? 'long' : slot]: val, long: slot === 'long' ? val : true };
      const bought = Math.round(ST.length * (c.price === 0 ? 1 : 30 / (c.price + 20)) * .9);
      return `<div class="item ${c.on ? '' : 'off'}"><span class="hd">${kidSlot(look, 56)}<span><b>${esc(lang === 'en' ? en : si)}</b><br><small class="note">${esc(L(slotName[slot]))}${typeof val === 'string' ? ` <span class="sw" style="background:${val}"></span>` : ''}</small></span></span>
        <span class="note">${t(`සිසුන් ${bought}ක් ගත්තා`, `${bought} students own it`)}</span>
        <span class="price" style="justify-content:space-between">🪙 <input class="inp" type="number" min="0" step="5" value="${c.price}" data-price="${id}" aria-label="price"><button class="tog" data-son="${id}" aria-pressed="${c.on}" aria-label="on sale"></button></span></div>`; }).join('')}</div>
    <div class="tools" style="margin:14px 0 0"><button class="btn g" data-a="additem">＋ ${t('අලුත් ඇඳුමක්', 'New item')}</button><span class="note">${t('ඔබේ පන්තියේ පාසල් ඇඳුම, ජර්සි, cap එක වගේ දේවල් දාන්නත් පුළුවන්.', 'You can add your own class t-shirt, jersey or cap too.')}</span></div>`);
}

// 📝 papers + recordings
function results() {
  const scores = ST.map((s) => s.paper), avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const pct = [82, 74, 46, 88, 91, 69, 43, 85, 71, 64];
  const views = [[34, 29], [33, 31], [21, 12]];
  return `<div class="grid g4">${stat('#3d8bdf', '📝', `${avg.toFixed(1)}/${PAPER.qs.length}`, t('පන්තියේ සාමාන්‍යය', 'Class average'))}${stat('#ffc23a', '🥇', `${Math.max(...scores)}/${PAPER.qs.length}`, t('ඉහළම ලකුණ', 'Top mark'))}${stat('#6cbf4e', '✅', `${ST.length - 3}/${ST.length}`, t('Paper එක කළා', 'Did the paper'))}${stat('#e4594b', '⏱️', `${PAPER.mins} min`, t('කාලය', 'Time limit'))}</div>
    <div class="grid g2">${win('#3d8bdf', '📝', esc(L(PAPER.t)), t('ප්‍රශ්නයෙන් ප්‍රශ්නයට නිවැරදි ප්‍රතිශතය', 'Correct answers, question by question'),
      `<div class="qbars">${PAPER.qs.map((q, i) => `<div class="qb"><span class="n">${i + 1}</span><span class="t"><span>${esc(L(q.q))}</span>${bar(pct[i], pct[i] < 50 ? 'red' : '')}</span><span class="r">${pct[i]}%</span></div>`).join('')}</div>
      <p class="note" style="margin-top:10px">${t('රතු = පන්තියේ බාගයකටත් වඩා වැරදුණා. ඊළඟ පන්තියේ ඒවා නැවත කරන්න.', 'Red = more than half the class got it wrong. Go over them in the next class.')}</p>
      <button class="btn g" style="margin-top:12px" data-a="newpaper">＋ ${t('අලුත් paper එකක්', 'New paper')}</button>`)}
    ${win('#7a5cff', '🎬', t('Recordings සිනමාව', 'Recordings Cinema'), t('මාසෙට අනුව · ගාස්තු ගෙවූ අයට පමණි', 'By month · paid students only'),
      `<div class="rows">${VIDEOS.map((v, mi) => v.list.map(([n, d], k) => `<div class="row"><span style="font-size:20px">🎬</span><span class="grow"><b>${esc(L(n))}</b><small>${esc(L(v.m))} · ${d}</small></span><span class="pill blue">👁 ${views[mi][k]}</span><span class="pill ${mi === 2 ? 'gold' : 'ok'}">${mi === 2 ? t('අලුත්', 'New') : t('විවෘත', 'Open')}</span></div>`).join('')).join('')}</div>
      <button class="btn b" style="margin-top:12px" data-a="upload">⬆ ${t('Recording එකක් දාන්න (YouTube unlisted link)', 'Add a recording (YouTube unlisted link)')}</button>
      <p class="note" style="margin-top:8px">${t('Video එක උඩ සිසුවාගේ නම පාවෙනවා: share කරන්න අමාරුයි.', "The student's name floats over the video: hard to share.")}</p>`)}</div>`;
}

// 💰 fees
function fees() {
  const paid = ST.filter(isPaid), un = ST.filter((s) => !isPaid(s));
  const remind = (s) => t(`ආයුබෝවන්! ${L(s.n)} ගේ දෙසැම්බර් පන්ති ගාස්තුව රු. ${num(A.fee)} තවම ලැබිලා නැහැ. ගෙවූ පසු recordings විවෘත වෙනවා. ස්තූතියි! - ${L(CLASS.teacher)}`,
    `Hello! ${L(s.n)}'s December class fee of Rs. ${num(A.fee)} has not come in yet. The recordings open once it is paid. Thank you! - ${L(CLASS.teacher)}`);
  return `<div class="grid g4">${stat('#6cbf4e', '💰', `${t('රු.', 'Rs.')} ${num(paid.length * A.fee)}`, t('දෙසැම්බර් ලැබුණු', 'Collected in December'))}${stat('#e4594b', '⏳', `${t('රු.', 'Rs.')} ${num(un.length * A.fee)}`, t('තව ලැබෙන්න', 'Still to come'))}
      ${stat('#5ab7e8', '✅', `${paid.length}/${ST.length}`, t('ගෙවූ සිසුන්', 'Students paid'))}<div class="stat" style="--c:#ffc23a"><i>🏷️</i><span><small>${t('මාසික ගාස්තුව', 'Monthly fee')}</small><span class="price">${t('රු.', 'Rs.')}<input class="inp" type="number" min="0" step="100" value="${A.fee}" data-a="fee" aria-label="fee"></span></span></div></div>
    <div class="grid g2">${win('#e4594b', '⏳', t(`නොගෙවූ (${un.length})`, `Unpaid (${un.length})`), t('එක click එකෙන් WhatsApp මතක් කිරීම', 'One-click WhatsApp reminder'),
      `<div class="rows">${un.map((s) => `<div class="row" style="flex-wrap:wrap">${kidSlot(s.look, 36)}<span class="grow"><b>${esc(L(s.n))}</b><small>${s.ph}</small></span><a class="btn sm b" target="_blank" rel="noopener" href="${wa(s, remind(s))}">💬 ${t('මතක් කරන්න', 'Remind')}</a><button class="btn sm g" data-pay="${s.id}">✓ ${t('ගෙවූ', 'Paid')}</button></div>`).join('') || `<p class="note">🎉 ${t('හැමෝම ගෙවලා!', 'Everyone has paid!')}</p>`}</div>`)}
    ${win('#3fae3a', '✅', t(`ගෙවූ (${paid.length})`, `Paid (${paid.length})`), t('ගෙවූ අයට recordings සහ අලුත් පාඩම් විවෘතයි', 'Paid students get the recordings and new lessons'),
      `<div class="rows">${paid.map((s) => `<div class="row">${kidSlot(s.look, 36)}<span class="grow"><b>${esc(L(s.n))}</b><small>${s.ph}</small></span><span class="pill ok">✓ ${t('රු.', 'Rs.')} ${num(A.fee)}</span><button class="btn sm w" data-pay="${s.id}">↺</button></div>`).join('')}</div>`)}</div>`;
}

// 📌 notices (shared with the game's notice board)
function notices() {
  const all = [...myNotices.map((n, i) => ({ ...n, mine: i })), ...NOTICES.map(([h, p]) => ({ h, p }))];
  return `<div class="grid g2">${win('#c97f45', '📌', t('අලුත් දැන්වීමක්', 'New notice'), t('ගමේ දැන්වීම් පුවරුවේ එවෙලේම පේනවා', 'Shows on the village notice board at once'),
      `<label class="note" for="nh">${t('මාතෘකාව', 'Title')}</label><input class="inp" id="nh" style="width:100%;margin:4px 0 10px" maxlength="60" placeholder="${t('උදා: ඉරිදා අමතර පන්තියක්', 'e.g. An extra class on Sunday')}">
      <label class="note" for="np">${t('විස්තරය', 'Details')}</label><textarea class="inp" id="np" maxlength="240" style="margin-top:4px" placeholder="${t('දිනය, වෙලාව, ගෙනෙන්න ඕන දේවල්…', 'Date, time, what to bring…')}"></textarea>
      <div class="tools" style="margin:12px 0 0"><button class="btn g" data-a="post">📌 ${t('පුවරුවට දාන්න', 'Post it')}</button><a class="btn w" href="index.html">🎮 ${t('Game එකේ බලන්න', 'See it in the game')}</a></div>`)}
    ${win('#8e5131', '📋', t('පුවරුවේ දැන් තියෙන ඒවා', 'On the board now'), '', `<div class="rows">${all.map((n) => `<div class="row" style="align-items:flex-start"><span style="font-size:20px">📢</span><span class="grow"><b>${esc(L(n.h))}</b><small>${esc(L(n.p))}</small></span>${n.mine !== undefined ? `<button class="btn sm r" data-del="${n.mine}">✕</button>` : ''}</div>`).join('')}</div>`)}</div>`;
}

// 🎫 QR cards + attendance (the same QR kit as the other LMS packages, in the game look)
// The QR holds only the student number (SW-2027-0101); a reprint adds -2, -3... and the old card stops working.
const QRRE = /^(SW-\d{4}-\d{4})(?:-(\d+))?$/;
const ATT = {}; byXp().slice(0, 12).forEach((s, i) => { ATT[s.id] = `07:${String(41 + i * 2).padStart(2, '0')}`; });
const qver = (s) => (A.ver && A.ver[s.id]) || 1, qcode = (s) => QRKit.code(s.sn, qver(s));
const nowHM = () => new Date().toTimeString().slice(0, 5);
let qMode = 'att', stopCam = null;
const gcard = (s) => `<div class="gcard"><div class="gc-top"><b>${esc(L(CLASS.name))}</b><span>${t('සිසු කාඩ්පත', 'Student card')}</span></div>
  <div class="gc-mid"><div>${kidSlot(s.look, 40)}<b>${esc(L(s.n))}</b><code>${qcode(s)}</code></div>${QRKit.svg(qcode(s), { cls: 'gc-qr' })}</div></div>`;
function qrp() {
  const here = byXp().filter((s) => ATT[s.id]).sort((a, b) => (ATT[a.id] < ATT[b.id] ? -1 : 1)), away = byXp().filter((s) => !ATT[s.id]);
  return `<div class="tools"><button class="btn g" data-qscan="att">📷 ${t('පැමිණීම scan කරන්න', 'Scan attendance')}</button><button class="btn" data-qscan="fee">💰 ${t('ගාස්තු scan කරන්න', 'Scan fees')}</button><button class="btn w" data-qprint="1">🖨 ${t('කාඩ් ඔක්කොම print කරන්න', 'Print all cards')}</button></div>
    <div class="grid g4">${stat('#6cbf4e', '✅', `${here.length}/${ST.length}`, t('අද පන්තියට ආවා', 'in class today'))}${stat('#5ab7e8', '⏰', t('සෙනසුරාදා', 'Saturday'), t('පෙ.ව. 8.00 පන්තිය', '8.00 a.m. class'))}${stat('#e4594b', '💰', `${ST.filter(isPaid).length}/${ST.length}`, t('දෙසැම්බර් ගාස්තු ගෙවා', 'paid for December'))}${stat('#ffc23a', '🎫', ST.length, t('සිසු QR කාඩ්', 'student QR cards'))}</div>
    <div class="grid g2">${win('#3fae3a', '✅', t('අද පැමිණීම', 'Today'), t('සෙනසුරාදා · පෙ.ව. 8.00', 'Saturday · 8.00 a.m.'),
      `<div class="rows">${here.map((s) => `<div class="row">${kidSlot(s.look, 36)}<span class="grow"><b>${esc(L(s.n))}</b><small>${s.sn}${isPaid(s) ? '' : ` · <span style="color:#c0392b">${t('ගාස්තු නැහැ', 'fee due')}</span>`}</small></span><span class="pill ok">✓ ${ATT[s.id]}</span></div>`).join('')}</div>
      <h3 style="margin:14px 0 8px">${t('තවම නාපු අය', 'Not here yet')} · ${away.length}</h3>
      <div class="rows">${away.map((s) => `<div class="row" style="flex-wrap:wrap">${kidSlot(s.look, 36)}<span class="grow"><b>${esc(L(s.n))}</b><small>${s.ph}</small></span><a class="btn sm b" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(t(`ආයුබෝවන්! ${L(s.n)} අද (සෙනසුරාදා) ${L(CLASS.name)} පන්තියට ආවේ නැහැ. - ${L(CLASS.teacher)}`, `Hello! ${L(s.n)} did not come to ${L(CLASS.name)} today (Saturday). - ${L(CLASS.teacher)}`))}">💬 ${t('දෙමාපියන්ට', 'Parent')}</a><button class="btn sm w" data-qhere="${s.id}">✓ ${t('ආවා', 'Here')}</button></div>`).join('') || `<p class="note">🎉 ${t('හැමෝම ආවා!', 'Everyone is here!')}</p>`}</div>`)}
    ${win('#c97f45', '🎫', t('සිසු QR කාඩ්', 'Student QR cards'), t('සිසුවෙක් එකතු කළාම ඉබේම හැදෙනවා', 'Made by itself for each new student'),
      `<p class="note">${t('QR එකේ තියෙන්නේ සිසු අංකය. කාඩ් එක නැති වුණොත් Reprint කරන්න: පරණ කාඩ් එක ඉබේම වැඩ කරන්නේ නැති වෙනවා. A4 එකකට කාඩ් 10ක් (ID card size).', 'The QR holds the student number. If a card is lost, reprint it: the old card stops working. 10 cards per A4 page (ID-card size).')}</p>
      <div class="gcards">${byXp().slice(0, 4).map((s) => `<div>${gcard(s)}<button class="btn sm w" data-qre="${s.id}">↻ Reprint${qver(s) > 1 ? ' · v' + qver(s) : ''}</button></div>`).join('')}</div>`)}</div>`;
}
function qrWire() {
  $main.querySelectorAll('[data-qscan]').forEach((b) => { b.onclick = () => qrScan(b.dataset.qscan); });
  $main.querySelectorAll('[data-qhere]').forEach((b) => { b.onclick = () => { ATT[b.dataset.qhere] = nowHM(); render(false); }; });
  $main.querySelectorAll('[data-qre]').forEach((b) => { b.onclick = () => { const s = ST.find((x) => x.id === b.dataset.qre); (A.ver ||= {})[s.id] = qver(s) + 1; save(); render(false); toast(t(`↻ අලුත් කාඩ් එක: ${qcode(s)} · පරණ එක දැන් වැඩ නැහැ`, `↻ New card: ${qcode(s)} · the old one no longer works`)); }; });
  const pr = $main.querySelector('[data-qprint]'); if (pr) pr.onclick = () => {
    const ok = QRKit.print(byXp().map((s) => ({ name: L(s.n), sub: L(CLASS.grade), code: qcode(s), initial: L(s.n).slice(0, 1) })),
      { brand: L(CLASS.name), tagline: t('සිසු කාඩ්පත', 'Student card'), title: `${L(CLASS.name)} · QR`, color: '#c97f45', color2: '#e0407e', note: t('පන්තියට එද්දී මේ කාඩ් එක පෙන්වන්න.', 'Show this card when you come to class.') });
    if (!ok) toast(t('Popup එක block වුණා. Allow කරන්න.', 'The popup was blocked. Please allow it.'));
  };
}
function qrScan(mode) {
  qMode = mode;
  const old = byXp()[0], oldCode = qver(old) > 1 ? old.sn : `${old.sn}-0`; // (demo: a card from before a reprint)
  $drawer.innerHTML = `<div class="scrim" data-qclose="1"><section class="win" style="--c:#3fae3a"><div class="rib"><span class="ri">📷</span><h2>${t('QR scan කරන්න', 'Scan a QR')}<small>${t('සිසුවාගේ කාඩ් එක camera එකට අල්ලන්න', "Hold the student's card up to the camera")}</small></h2><button class="x" data-qclose="1">✕</button></div>
    <div class="body"><div class="seg" style="margin-bottom:12px"><button data-qm="att" aria-pressed="${mode === 'att'}">✅ ${t('පැමිණීම', 'Attendance')}</button><button data-qm="fee" aria-pressed="${mode === 'fee'}">💰 ${t('ගාස්තු', 'Fees')}</button></div>
    <div class="gscan"><div class="gcam" id="gCam"><button class="btn g" id="gStart">📷 ${t('Camera එක on කරන්න', 'Turn on the camera')}</button></div><div id="gRes" class="gres"></div></div>
    <p class="note" style="margin-top:12px">${t('Demo: ළඟ කාඩ් එකක් නැත්නම් පහළ කාඩ් එකක් ඔබන්න (scan කළා වගේ).', 'Demo: no card at hand? Tap a card below (as if scanned).')}</p>
    <div class="gpick">${byXp().slice(0, 6).map((s) => `<button data-qsim="${qcode(s)}" title="${qcode(s)}">${QRKit.svg(qcode(s), { cls: 'gc-qr' })}<small>${esc(L(s.n))}</small></button>`).join('')}<button data-qsim="${oldCode}" title="${oldCode}" class="old">${QRKit.svg(oldCode, { cls: 'gc-qr' })}<small>${t('පරණ කාඩ්', 'Old card')}</small></button></div></div></section></div>`;
  $drawer.hidden = false;
  const res = document.getElementById('gRes');
  const hint = () => { res.innerHTML = `<p class="note">${qMode === 'att' ? t('<b>පැමිණීම:</b> scan කරන හැම කෙනාම "ආවා". ගාස්තු නැති අය ගැනත් කියනවා.', '<b>Attendance:</b> everyone you scan is marked here, and it tells you who has not paid.') : t('<b>ගාස්තු:</b> නම, මාසය, මුදල පේනවා. මුදල ලැබුණාම "ගෙවූ" ඔබන්න.', '<b>Fees:</b> shows the name, month and amount. Press "Paid" once you have the money.')}</p>`; };
  hint();
  const close = () => { if (stopCam) stopCam(); stopCam = null; $drawer.hidden = true; $drawer.onclick = null; render(false); };
  $drawer.onclick = (e) => {
    if (e.target.dataset.qclose) { close(); return; }
    const m = e.target.closest('[data-qm]'); if (m) { qMode = m.dataset.qm; $drawer.querySelectorAll('[data-qm]').forEach((x) => x.setAttribute('aria-pressed', x === m)); hint(); return; }
    const sim = e.target.closest('[data-qsim]'); if (sim) { qrRead(sim.dataset.qsim); return; }
    if (e.target.closest('#gStart')) { e.target.closest('#gStart').disabled = true; QRKit.scan(document.getElementById('gCam'), qrRead, () => { document.getElementById('gCam').innerHTML = `<p class="note" style="color:#fff">${t('Camera එකක් නැහැ / අවසර නැහැ. පහළ demo කාඩ් පාවිච්චි කරන්න.', 'No camera or no permission. Use the demo cards below.')}</p>`; }).then((stop) => { stopCam = stop; }); return; }
    const pay = e.target.closest('[data-qpay]'); if (pay) { const s = ST.find((x) => x.id === pay.dataset.qpay); A.paid[s.id] = true; save(); qrRead(qcode(s)); toast(t(`✓ ${L(s.n)} ගෙවූ ලෙස සලකුණු කළා. Recordings විවෘතයි.`, `✓ ${L(s.n)} marked paid. Recordings are open.`)); }
  };
}
function qrRead(text) {
  const res = document.getElementById('gRes'); if (!res) return;
  const p = QRKit.parse(text, QRRE), s = p && ST.find((x) => x.sn === p.id);
  const bad = (msg) => { QRKit.beep(false); res.innerHTML = `<div class="gout bad"><i>✕</i><span><b>${msg}</b><small>${esc(text)}</small></span></div>`; };
  if (!s) return bad(t('මේ කාඩ් එක අපේ පන්තියේ නෙවෙයි', 'This card is not from our class'));
  if (p.ver !== qver(s)) return bad(t(`${L(s.n)} ගේ පරණ කාඩ් එකක්. අලුත් කාඩ් එක ඉල්ලන්න.`, `An old card of ${L(s.n)}. Ask for the new card.`));
  QRKit.beep(true);
  let body;
  if (qMode === 'att') {
    const again = !!ATT[s.id]; if (!again) ATT[s.id] = nowHM();
    body = `<p>${again ? t(`ℹ දැනටමත් ආවා · ${ATT[s.id]}`, `ℹ Already here · ${ATT[s.id]}`) : t(`✓ ආවා · ${ATT[s.id]}`, `✓ Here · ${ATT[s.id]}`)}</p>${isPaid(s) ? '' : `<p style="color:#c0392b">⚠ ${t('දෙසැම්බර් ගාස්තුව තවම නැහැ', 'December fee not paid yet')}</p>`}`;
    res.innerHTML = `<div class="gout ${again ? 'info' : 'ok'}">${kidSlot(s.look, 72)}<span><b>${esc(L(s.n))}</b><small>${s.sn} · Level ${lvlOf(xpOf(s))}</small>${body}</span></div>`;
  } else {
    body = `<p>${t('දෙසැම්බර්', 'December')} · <b>${t('රු.', 'Rs.')} ${num(A.fee)}</b></p>${isPaid(s) ? `<p>✓ ${t('දැනටමත් ගෙවලා', 'Already paid')}</p>` : `<button class="btn g sm" data-qpay="${s.id}">✓ ${t('මුදල් ලැබුණා: ගෙවූ ලෙස', 'Money received: mark paid')}</button>`}`;
    res.innerHTML = `<div class="gout ${isPaid(s) ? 'info' : 'ok'}">${kidSlot(s.look, 72)}<span><b>${esc(L(s.n))}</b><small>${s.sn}</small>${body}</span></div>`;
  }
  paintKids(res);
}

// ---------------------------------------------------------------- render + events
function render(scroll = true) {
  document.documentElement.lang = lang; document.title = `${L(CLASS.name)} · ${t('ගුරු Admin', 'Teacher admin')} · Samsoft`;
  top(); nav();
  const qr = () => (window.qrcode ? qrp() : (QRKit.load().then(() => render(false)).catch(() => toast(t('QR library එක load වුණේ නැහැ.', 'Could not load the QR library.'))), `<p class="note">…</p>`));
  $main.innerHTML = ({ home, kids, world, quests, shop, results, fees, notices, qr })[page]();
  paintKids($main); if (page === 'qr' && window.qrcode) qrWire();
  const q = document.getElementById('q'); if (q) { q.oninput = () => { query = q.value; const pos = q.selectionStart; render(false); const n = document.getElementById('q'); n.focus(); n.setSelectionRange(pos, pos); }; }
}
$main.addEventListener('click', (e) => {
  const el = e.target.closest('[data-go],[data-kid],[data-f],[data-lock],[data-pay],[data-qon],[data-ev],[data-son],[data-del],[data-a]'); if (!el) return;
  const d = el.dataset;
  if (d.go) { page = d.go; history.replaceState(null, '', '#' + page); render(); return; }
  if (d.kid) { kidDrawer(d.kid); return; }
  if (d.f) { filter = d.f; render(false); return; }
  if (d.lock) { A.lock[d.lock] = !A.lock[d.lock]; save(); toast(A.lock[d.lock] ? t('🔒 පාඩම වැහුවා. සිසුන්ට පේන්නේ නැහැ.', '🔒 Lesson locked. Students cannot open it.') : t('🔓 පාඩම විවෘත කළා.', '🔓 Lesson opened.')); render(false); return; }
  if (d.pay) { A.paid[d.pay] = !isPaid(ST.find((s) => s.id === d.pay)); save(); toast(A.paid[d.pay] ? t('✓ ගෙවූ ලෙස සටහන් කළා. Recordings විවෘත වුණා.', '✓ Marked paid. Recordings are open.') : t('නොගෙවූ ලෙස සටහන් කළා.', 'Marked unpaid.')); render(false); return; }
  if (d.qon) { A.quests[d.qon].on = !A.quests[d.qon].on; save(); render(false); return; }
  if (d.ev) { const on = !(A.event.on && A.event.kind === d.ev); A.event = { on, kind: d.ev }; save(); toast(on ? t('⚡ Event එක පටන් ගත්තා! ගමේ හැමෝටම පේනවා.', '⚡ Event started! Everyone in the village sees it.') : t('Event එක නැවැත්තුවා.', 'Event stopped.')); render(false); return; }
  if (d.son) { A.shop[d.son].on = !A.shop[d.son].on; save(); render(false); return; }
  if (d.del !== undefined) { myNotices.splice(+d.del, 1); store(NKEY, myNotices); toast(t('දැන්වීම අයින් කළා.', 'Notice removed.')); render(false); return; }
  const a = d.a;
  if (a === 'post') {
    const h = document.getElementById('nh').value.trim(), p = document.getElementById('np').value.trim();
    if (!h) { toast(t('මාතෘකාවක් ලියන්න.', 'Write a title.')); return; }
    myNotices.unshift({ h: [h, h], p: [p, p] }); store(NKEY, myNotices); toast(t('📌 දැන්වීම පුවරුවට දැම්මා!', '📌 Posted on the board!')); render(false); return;
  }
  const soon = { add: t('අලුත් සිසුවෙක්: නම, දෙමාපිය අංකය සහ login එක. (Demo එකේ මේක නැහැ.)', 'New student: name, parent number and a login. (Not in the demo.)'),
    addlesson: t('අලුත් පාඩමක්: සටහන්, ප්‍රශ්න, simulation සහ XP. (Demo එකේ මේක නැහැ.)', 'New lesson: notes, questions, simulation and XP. (Not in the demo.)'),
    addquest: t('අලුත් quest එකක් ඔබේ පන්තියට ගැළපෙන්න හදලා දෙනවා.', 'New quests are made to suit your class.'),
    additem: t('ඔබේ පන්තියේ ඇඳුම් / ත්‍යාග අපි pixel art විදිහට හදලා දෙනවා.', 'We draw your class clothes / rewards as pixel art.'),
    newpaper: t('අලුත් paper එකක්: ප්‍රශ්න, පිළිතුරු සහ කාලය. (Demo එකේ මේක නැහැ.)', 'New paper: questions, answers and a time limit. (Not in the demo.)'),
    upload: t('YouTube unlisted link එක දාලා මාසය තෝරන්න. (Demo එකේ මේක නැහැ.)', 'Paste the YouTube unlisted link and pick the month. (Not in the demo.)') };
  if (soon[a]) toast(soon[a]);
});
$main.addEventListener('change', (e) => {
  const d = e.target.dataset, v = Math.max(0, Math.round(+e.target.value || 0));
  if (d.rule) A.rule[d.rule] = e.target.value; else if (d.lxp) A.lxp[d.lxp] = v; else if (d.qxp) A.quests[d.qxp].xp = v; else if (d.qco) A.quests[d.qco].coins = v;
  else if (d.chest) A.chest[d.chest] = v; else if (d.price) A.shop[d.price].price = v; else if (d.a === 'fee') { A.fee = v || 1500; render(false); } else return;
  save(); toast(t('✓ Save කළා', '✓ Saved'));
});
document.addEventListener('keydown', (e) => { if (e.key !== 'Escape' || $drawer.hidden) return; $drawer.hidden = true; if (stopCam) { stopCam(); stopCam = null; render(false); } });
await document.fonts.ready.catch(() => {});
render();
window.gwAdmin = { A, ST }; // (tests)
