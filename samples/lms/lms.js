/* Samsoft LMS demo - app */
(function () {
  'use strict';
  const D = window.LMS_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const qs = new URLSearchParams(location.search);

  /* ---------- state ---------- */
  const KEY = 'samsoft-lms-v1';
  let st = {};
  try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { st = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* demo still works */ } };
  st.progress = st.progress || { L01: 1, L02: 1, L03: 1, L04: 1, L05: 1, L06: 0.9, L07: 1, L08: 1, L09: 1, L10: 1, L11: 0.72, L12: 0.38 };
  st.fees = st.fees || {};
  st.uploads = st.uploads || [];
  st.newPapers = st.newPapers || [];

  let lang = qs.get('lang') === 'si' ? 'si' : 'en';
  if (lang !== 'si') lang = 'en';
  const S = { role: qs.get('role') === 'teacher' ? 'teacher' : 'student', page: qs.get('page') || '', sub: qs.get('id') || '' };
  const T = (en, si) => (lang === 'si' ? si : en);
  const N = o => (lang === 'si' ? o.si : o.en);

  /* ---------- helpers ---------- */
  const me = D.students[0];
  const money = n => 'Rs. ' + n.toLocaleString('en-US');
  const fmtT = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
  const MON_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MON_SI = ['ජන', 'පෙබ', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝ', 'සැප්', 'ඔක්', 'නොවැ', 'දෙසැ'];
  const fmtD = iso => { const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return lang === 'si' ? MON_SI[m - 1] + ' ' + d : d + ' ' + MON_EN[m - 1]; };
  const feePaid = s => (s.id in st.fees ? st.fees[s.id] : s.fees.nov);
  const lessons = () => D.lessons.concat(st.uploads);
  const lessonById = id => lessons().find(l => l.id === id);
  const unit = id => D.units[id] || D.units.U01;

  /* live paper submissions (seeded + mine) */
  const liveScore = ans => ans.reduce((a, x, i) => a + (x === D.live.qs[i].a ? 1 : 0), 0);
  const liveSubs = () => {
    const list = D.liveSubs.map(s => ({ ...s, score: liveScore(s.ans) }));
    if (st.exam && st.exam.done) list.push({ id: me.id, ans: st.exam.ans, at: st.exam.doneAt, score: liveScore(st.exam.ans), me: true });
    return list;
  };
  /* all papers as % marks per student, including P08 when submitted */
  const allPapers = () => {
    const ps = D.papers.map((p, i) => ({ ...p, idx: i, kind: 'done' }));
    ps.push({ ...D.live, nq: D.live.qs.length, kind: 'live' });
    st.newPapers.forEach(p => ps.push({ ...p, nq: p.qs.length, kind: 'new' }));
    return ps;
  };
  const marksFor = p => {
    if (p.kind === 'done') return D.students.map(s => ({ s, m: s.marks[p.idx] }));
    if (p.kind === 'live') { const subs = liveSubs(); return D.students.map(s => { const x = subs.find(y => y.id === s.id); return { s, m: x ? Math.round(x.score / D.live.qs.length * 100) : null }; }); }
    return D.students.map(s => ({ s, m: null }));
  };
  const statsFor = p => {
    const ms = marksFor(p).filter(x => x.m != null).map(x => x.m);
    if (!ms.length) return { n: 0, avg: 0, hi: 0, lo: 0, ms };
    return { n: ms.length, avg: Math.round(ms.reduce((a, b) => a + b, 0) / ms.length), hi: Math.max(...ms), lo: Math.min(...ms), ms };
  };
  const rankOf = (p, id) => {
    const list = marksFor(p).filter(x => x.m != null);
    const mine = list.find(x => x.s.id === id); if (!mine) return null;
    return { r: list.filter(x => x.m > mine.m).length + 1, of: list.length };
  };

  const ICON = {
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 4h4.5v16H6zM13.5 4H18v16h-4.5z" fill="currentColor"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M12 5a7 7 0 1 1-7 7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 1.5v7L7.5 5z" fill="currentColor"/><text x="12" y="15.5" text-anchor="middle" font-size="7" font-weight="700" fill="currentColor" font-family="Archivo,sans-serif">10</text></svg>',
    fwd: '<svg viewBox="0 0 24 24"><path d="M12 5a7 7 0 1 0 7 7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 1.5v7L16.5 5z" fill="currentColor"/><text x="12" y="15.5" text-anchor="middle" font-size="7" font-weight="700" fill="currentColor" font-family="Archivo,sans-serif">10</text></svg>',
    file: '<svg viewBox="0 0 24 24"><path d="M6 2.5h8l4.5 4.5v14.5H6z M14 2.5V7h4.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 12.5h6M9 16h6" stroke="currentColor" stroke-width="1.7"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M12 16V4M6.5 9.5 12 4l5.5 5.5M4 20h16" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2.2"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" stroke-width="2.2"/></svg>',
    dl: '<svg viewBox="0 0 24 24"><path d="M12 4v12M6.5 10.5 12 16l5.5-5.5M4 20h16" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>',
    flag: '<svg viewBox="0 0 24 24"><path d="M6 21V4M6 4h11l-2.5 4L17 12H6" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
  };

  /* ---------- covers ---------- */
  function cover(l, opts = {}) {
    const u = unit(l.unit), p = st.progress[l.id] || 0;
    return `<span class="cover${opts.big ? ' big' : ''}" style="--u:${u.color}">
      <span class="cv-unit">${u.code} · ${esc(N(u))}</span>
      <span class="cv-num" aria-hidden="true">${esc(l.n)}</span>
      <span class="cv-title">${esc(N(l))}</span>
      <span class="cv-dur">${l.dur}</span>
      ${p > 0 && !opts.noprog ? `<span class="cv-prog"><i style="width:${Math.round(p * 100)}%"></i></span>` : ''}
      ${opts.play ? `<span class="cv-play">${ICON.play}</span>` : ''}
    </span>`;
  }
  const lessonCard = l => `<a class="lcard" href="#" data-go="watch:${l.id}">${cover(l, { play: true })}
    <span class="lc-meta"><b>${T('Lesson', 'පාඩම')} ${esc(l.n)}</b> · ${fmtD(l.date)}${(st.progress[l.id] || 0) >= 0.98 ? ` · <em>${T('Watched', 'බලා ඇත')}</em>` : ''}</span></a>`;

  /* ---------- header ---------- */
  const NAV = {
    student: [['home', 'Home', 'මුල් පිටුව'], ['library', 'Recordings', 'පටිගත කිරීම්'], ['papers', 'Papers', 'ප්‍රශ්න පත්‍ර'], ['results', 'My results', 'මගේ ප්‍රතිඵල']],
    teacher: [['overview', 'Overview', 'සාරාංශය'], ['students', 'Students', 'සිසුන්'], ['tpapers', 'Papers', 'ප්‍රශ්න පත්‍ර'], ['recordings', 'Recordings', 'පටිගත කිරීම්']]
  };
  const homeOf = r => (r === 'teacher' ? 'overview' : 'home');
  const navFor = page => ({ watch: 'library', exam: 'papers', review: 'papers' }[page] || page);

  function renderChrome() {
    document.documentElement.lang = lang === 'si' ? 'si' : 'en';
    document.body.dataset.lang = lang;
    document.body.dataset.role = S.role;
    const active = navFor(S.page);
    const items = NAV[S.role].map(([k, en, si]) => `<a href="#" data-go="${k}" class="${k === active ? 'on' : ''}">${T(en, si)}</a>`).join('');
    $('#nav').innerHTML = items;
    $('#tabbar').innerHTML = items;
    $$('#role button').forEach(b => { b.classList.toggle('on', b.dataset.role === S.role); b.textContent = b.dataset.role === 'teacher' ? T('Teacher', 'ගුරු') : T('Student', 'සිසු'); });
    $('#langBtn').textContent = lang === 'si' ? 'EN' : 'සිං';
    $('#langBtn').title = lang === 'si' ? 'English' : 'සිංහල';
    $('#who').innerHTML = S.role === 'teacher'
      ? `<span class="av">DW</span><span class="who-t"><b>Dilan Weerasinghe</b><small>${T('Teacher', 'ගුරුවරයා')}</small></span>`
      : `<span class="av me">SP</span><span class="who-t"><b>Sanduni Perera</b><small>S1001 · 2026 O/L</small></span>`;
    $('#foot').innerHTML = `<span>${T('Demo class LMS made by', 'මෙම පන්ති LMS නිදර්ශනය සැකසුවේ')} <img src="samsoft-mark.png" alt=""> <b>Samsoft</b>. ${T('All names and marks are sample data.', 'සියලු නම් සහ ලකුණු නිදර්ශන දත්ත වේ.')}</span>
      <button class="linkbtn" id="resetDemo">${T('Reset demo', 'නිදර්ශනය යළි අරඹන්න')}</button>`;
  }

  /* ---------- routing ---------- */
  function syncURL() {
    const p = new URLSearchParams();
    if (S.role === 'teacher') p.set('role', 'teacher');
    if (S.page && S.page !== homeOf(S.role)) p.set('page', S.page);
    if (S.sub) p.set('id', S.sub);
    if (lang === 'si') p.set('lang', 'si');
    const q = p.toString();
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '')); } catch (e) { /* file:// in some browsers */ }
  }
  function go(page, sub) {
    stopPlayer();
    S.page = page; S.sub = sub || '';
    render(); window.scrollTo(0, 0);
  }

  const PAGES = {};
  function render() {
    const valid = S.role === 'teacher' ? ['overview', 'students', 'tpapers', 'recordings'] : ['home', 'library', 'papers', 'results', 'watch', 'exam', 'review'];
    if (!valid.includes(S.page)) { S.page = homeOf(S.role); S.sub = ''; }
    if (S.page === 'watch' && !lessonById(S.sub)) S.sub = 'L12';
    if (S.page === 'exam' && st.exam && st.exam.done) S.page = 'review';
    if (S.page === 'review' && !(st.exam && st.exam.done)) S.page = 'papers';
    syncURL(); renderChrome();
    const v = $('#view');
    v.className = 'view pg-' + S.page;
    v.innerHTML = PAGES[S.page]();
    if (after[S.page]) after[S.page]();
  }
  const after = {};

  /* ================= STUDENT ================= */
  PAGES.home = () => {
    const ls = lessons();
    const cont = ls.slice().reverse().find(l => (st.progress[l.id] || 0) > 0 && st.progress[l.id] < 0.98) || ls[ls.length - 1];
    const pc = st.progress[cont.id] || 0;
    const p07 = allPapers()[6], r7 = rankOf(p07, me.id);
    const exam = st.exam;
    const liveBox = exam && exam.done
      ? `<div class="tile"><span class="t-k">${T('Paper', 'ප්‍රශ්න පත්‍රය')} 08 · ${esc(N(D.live))}</span><span class="t-big">${liveScore(exam.ans)}<small>/10</small></span>
          <span class="t-s">${T('Submitted. Marked automatically.', 'යොමු කළා. ලකුණු ස්වයංක්‍රීයව දී ඇත.')}</span><a href="#" class="btn ghost sm" data-go="review">${T('See answers', 'පිළිතුරු බලන්න')}</a></div>`
      : `<div class="tile hot"><span class="t-k"><i class="dot"></i>${T('Open now', 'දැන් විවෘතයි')} · ${T('closes', 'වැසෙන්නේ')} ${fmtD(D.live.closes)}</span>
          <span class="t-big sm">${T('Paper', 'ප්‍රශ්න පත්‍රය')} 08 · ${esc(N(D.live))}</span>
          <span class="t-s">${D.live.qs.length} ${T('questions', 'ප්‍රශ්න')} · ${D.live.minutes} ${T('minutes', 'මිනිත්තු')} · ${T('auto marked', 'ස්වයංක්‍රීය ලකුණු')}</span>
          <a href="#" class="btn sm" data-go="exam">${exam ? T('Continue paper', 'පත්‍රය දිගටම කරන්න') : T('Start paper', 'පත්‍රය අරඹන්න')}</a></div>`;
    return `
    <section class="hero">
      <a href="#" class="hero-cv" data-go="watch:${cont.id}">${cover(cont, { big: true, play: true })}</a>
      <div class="hero-tx">
        <span class="kick">${T('Continue watching', 'නැරඹීම දිගටම')}</span>
        <h1>${esc(N(cont))}</h1>
        <p class="meta">${T('Lesson', 'පාඩම')} ${esc(cont.n)} · ${esc(N(unit(cont.unit)))} · ${cont.dur}</p>
        <div class="bar-l"><i style="width:${Math.round(pc * 100)}%"></i></div>
        <p class="meta">${fmtT(cont.sec * (1 - pc))} ${T('left', 'ඉතිරියි')}</p>
        <div class="row-btns"><a href="#" class="btn" data-go="watch:${cont.id}">${ICON.play}${T('Resume', 'නැවත අරඹන්න')}</a>
          <button class="btn ghost" data-act="notes">${ICON.file}${T('Lesson notes', 'පාඩම් සටහන්')}</button></div>
      </div>
    </section>
    <section class="tiles">
      ${liveBox}
      <div class="tile"><span class="t-k">${T('Last paper', 'අවසන් පත්‍රය')} · P07</span><span class="t-big">${me.marks[6]}<small>%</small></span>
        <span class="t-s">${T('Rank', 'ස්ථානය')} ${r7.r} / ${r7.of} · ${T('class average', 'පන්ති සාමාන්‍යය')} ${statsFor(p07).avg}%</span>
        <a href="#" class="btn ghost sm" data-go="results">${T('All my results', 'මගේ සියලු ප්‍රතිඵල')}</a></div>
      <div class="tile"><span class="t-k">${T('Class fee', 'පන්ති ගාස්තුව')} · ${T('November', 'නොවැම්බර්')}</span><span class="t-big ok">${T('Paid', 'ගෙවා ඇත')}</span>
        <span class="t-s">${money(D.teacher.fee)} · ${T('paid on', 'ගෙවූ දිනය')} ${fmtD('2026-11-02')}</span>
        <span class="t-s dim">${T('Next: December fee before 5 Dec', 'ඊළඟ: දෙසැම්බර් ගාස්තුව දෙසැ 5 ට පෙර')}</span></div>
    </section>
    <section class="shelf">
      <div class="sh-h"><h2>${T('Recordings', 'පටිගත කිරීම්')}<span>${T('Term 3', '3 වන වාරය')}</span></h2><a href="#" class="more" data-go="library">${T('See all', 'සියල්ල')} →</a></div>
      <div class="rail">${ls.slice().reverse().map(lessonCard).join('')}</div>
    </section>`;
  };

  let libFilter = 'all';
  PAGES.library = () => {
    const ls = lessons().slice().reverse();
    const used = Object.keys(D.units).filter(k => ls.some(l => l.unit === k));
    const show = libFilter === 'all' ? ls : ls.filter(l => l.unit === libFilter);
    return `<div class="ph"><h1>${T('Recordings', 'පටිගත කිරීම්')}</h1><p class="meta">${ls.length} ${T('lessons', 'පාඩම්')} · 2026 O/L</p></div>
      <div class="filters" role="tablist">
        <button class="${libFilter === 'all' ? 'on' : ''}" data-lib="all">${T('All units', 'සියලු ඒකක')}</button>
        ${used.map(k => `<button class="${libFilter === k ? 'on' : ''}" data-lib="${k}" style="--u:${D.units[k].color}">${esc(N(D.units[k]))}</button>`).join('')}
      </div>
      <div class="grid-l">${show.map(lessonCard).join('')}</div>`;
  };

  /* ----- player ----- */
  let player = null;
  function stopPlayer() {
    if (!player) return;
    if (player.timer) clearInterval(player.timer);
    const l = player.l, f = Math.min(1, player.t / l.sec);
    if (f > 0) { st.progress[l.id] = f > 0.98 ? 1 : Math.max(f, st.progress[l.id] || 0); save(); }
    player = null;
  }
  PAGES.watch = () => {
    const l = lessonById(S.sub), u = unit(l.unit);
    const ls = lessons(), i = ls.indexOf(l), next = ls[i + 1] || ls[0];
    const upl = !l.board;
    return `<div class="watch">
      <div class="player" id="player" style="--u:${u.color}">
        <div class="stage" id="stage">
          <span class="st-unit">${u.code} · ${esc(N(u))}</span>
          <span class="st-ch" id="stCh"></span>
          <span class="st-board">${esc(l.board || N(l))}</span>
          <span class="st-teacher"><b>WEERA</b>/ICT · ${T('Lesson', 'පාඩම')} ${esc(l.n)}</span>
          <button class="st-big" id="bigPlay" aria-label="Play">${ICON.play}</button>
        </div>
        <div class="scrub" id="scrub"><div class="sc-ch">${l.chapters.map(c => `<i style="left:${c[0] * 100}%"></i>`).join('')}</div><div class="sc-fill" id="scFill"></div><div class="sc-knob" id="scKnob"></div></div>
        <div class="ctrls">
          <button id="pPlay" aria-label="Play">${ICON.play}</button>
          <button id="pBack" aria-label="Back 10 seconds">${ICON.back}</button>
          <button id="pFwd" aria-label="Forward 10 seconds">${ICON.fwd}</button>
          <span class="time" id="pTime"></span>
          <span class="sp"></span>
          <button id="pSpeed" class="txt">1×</button>
        </div>
      </div>
      <aside class="w-side">
        <h3>${T('Chapters', 'කොටස්')}</h3>
        <ol class="chap" id="chap">${l.chapters.map((c, k) => `<li><button data-seek="${c[0]}"><span class="c-t">${fmtT(c[0] * l.sec)}</span><span>${esc(T(c[1], c[2]))}</span></button></li>`).join('')}</ol>
        <h3>${T('Downloads', 'බාගත කිරීම්')}</h3>
        <button class="dlrow" data-act="notes">${ICON.file}<span><b>${T('Lesson notes', 'පාඩම් සටහන්')}</b><small>PDF · 1.2 MB</small></span>${ICON.dl}</button>
        <button class="dlrow" data-act="notes">${ICON.file}<span><b>${T('Practice questions', 'පුහුණු ප්‍රශ්න')}</b><small>PDF · 0.4 MB</small></span>${ICON.dl}</button>
      </aside>
      <div class="w-info">
        <a href="#" class="crumb" data-go="library">← ${T('All recordings', 'සියලු පටිගත කිරීම්')}</a>
        <h1>${esc(N(l))}</h1>
        <p class="meta">${T('Lesson', 'පාඩම')} ${esc(l.n)} · ${esc(N(u))} · ${T('class on', 'පන්තිය')} ${fmtD(l.date)} · ${l.dur}${upl ? ' · ' + T('Uploaded just now', 'දැන් උඩුගත කළා') : ''}</p>
      </div>
      <section class="shelf w-next">
        <div class="sh-h"><h2>${T('Up next', 'ඊළඟට')}</h2></div>
        <div class="rail">${[next].concat(ls.filter(x => x !== l && x !== next).slice(-4).reverse()).map(lessonCard).join('')}</div>
      </section>
    </div>`;
  };
  after.watch = () => {
    const l = lessonById(S.sub);
    player = { l, t: (st.progress[l.id] || 0) >= 0.98 ? 0 : (st.progress[l.id] || 0) * l.sec, playing: false, speed: 1, timer: null };
    const upd = () => {
      const p = player; if (!p) return;
      const f = p.t / l.sec;
      $('#scFill').style.width = (f * 100) + '%'; $('#scKnob').style.left = (f * 100) + '%';
      $('#pTime').textContent = fmtT(p.t) + ' / ' + l.dur;
      let ci = 0; l.chapters.forEach((c, k) => { if (f >= c[0]) ci = k; });
      $('#stCh').textContent = T(l.chapters[ci][1], l.chapters[ci][2]);
      $$('#chap li').forEach((li, k) => li.classList.toggle('on', k === ci));
      $('#player').classList.toggle('playing', p.playing);
      const ic = p.playing ? ICON.pause : ICON.play;
      $('#pPlay').innerHTML = ic; $('#pPlay').setAttribute('aria-label', p.playing ? 'Pause' : 'Play');
    };
    const persist = () => { st.progress[l.id] = Math.max(st.progress[l.id] || 0, Math.min(1, player.t / l.sec)); if (player.t / l.sec > 0.98) st.progress[l.id] = 1; save(); };
    const toggle = () => {
      const p = player; p.playing = !p.playing;
      if (p.playing) {
        p.timer = setInterval(() => { p.t += 0.25 * p.speed; if (p.t >= l.sec) { p.t = l.sec; p.playing = false; clearInterval(p.timer); persist(); } upd(); }, 250);
      } else { clearInterval(p.timer); persist(); }
      upd();
    };
    const seek = f => { player.t = Math.max(0, Math.min(l.sec, f * l.sec)); persist(); upd(); };
    $('#pPlay').onclick = toggle; $('#bigPlay').onclick = toggle; $('#stage').onclick = e => { if (e.target === $('#stage')) toggle(); };
    $('#pBack').onclick = () => seek((player.t - 10) / l.sec);
    $('#pFwd').onclick = () => seek((player.t + 10) / l.sec);
    $('#pSpeed').onclick = () => { const sp = [1, 1.25, 1.5, 2]; player.speed = sp[(sp.indexOf(player.speed) + 1) % sp.length]; $('#pSpeed').textContent = player.speed + '×'; };
    $('#scrub').onclick = e => { const r = $('#scrub').getBoundingClientRect(); seek((e.clientX - r.left) / r.width); };
    $$('#chap [data-seek]').forEach(b => b.onclick = () => seek(+b.dataset.seek + 0.0001));
    upd();
  };

  /* ----- papers (student) ----- */
  PAGES.papers = () => {
    const ps = allPapers();
    const ex = st.exam;
    const live = ps.find(p => p.kind === 'live');
    const upcoming = ps.filter(p => p.kind === 'new');
    const done = ps.filter(p => p.kind === 'done').reverse();
    return `<div class="ph"><h1>${T('Papers', 'ප්‍රශ්න පත්‍ර')}</h1><p class="meta">${T('Online MCQ papers are marked the moment you submit.', 'ඔබ යොමු කළ සැණින් MCQ පත්‍රවලට ලකුණු ලැබේ.')}</p></div>
      <div class="plive${ex && ex.done ? ' done' : ''}">
        <div class="pl-n">08</div>
        <div class="pl-t"><span class="kick">${ex && ex.done ? T('Submitted', 'යොමු කළා') : `<i class="dot"></i>${T('Open now', 'දැන් විවෘතයි')}`}</span>
          <h2>${esc(N(live))}</h2>
          <p class="meta">${live.nq} ${T('questions', 'ප්‍රශ්න')} · ${live.minutes} ${T('minutes', 'මිනිත්තු')} · ${T('closes', 'වැසෙන්නේ')} ${fmtD(live.closes)}</p></div>
        <div class="pl-a">${ex && ex.done
          ? `<span class="pl-score">${liveScore(ex.ans)}<small>/${live.nq}</small></span><a href="#" class="btn ghost" data-go="review">${T('See answers', 'පිළිතුරු බලන්න')}</a>`
          : `<a href="#" class="btn" data-go="exam">${ex ? T('Continue paper', 'පත්‍රය දිගටම කරන්න') : T('Start paper', 'පත්‍රය අරඹන්න')} →</a>`}</div>
      </div>
      ${upcoming.length ? `<h3 class="sec">${T('Coming up', 'ඉදිරියට')}</h3><div class="plist">${upcoming.map(p => `<div class="pr">
        <span class="pr-id">${p.id.slice(1)}</span><span class="pr-t"><b>${esc(p.title)}</b><small>${p.nq} ${p.nq === 1 ? T('question', 'ප්‍රශ්නය') : T('questions', 'ප්‍රශ්න')} · ${p.minutes} ${T('minutes', 'මිනිත්තු')}</small></span>
        <span class="pr-d">${T('Opens', 'විවෘත වන්නේ')} ${fmtD(p.date)}</span><span class="pr-m dim">—</span></div>`).join('')}</div>` : ''}
      <h3 class="sec">${T('Finished papers', 'නිම කළ පත්‍ර')}</h3>
      <div class="plist">${done.map(p => { const m = me.marks[p.idx], r = rankOf(p, me.id); return `<div class="pr">
        <span class="pr-id">${p.id.slice(1)}</span><span class="pr-t"><b>${esc(N(p))}</b><small>${p.nq} ${T('questions', 'ප්‍රශ්න')} · ${fmtD(p.date)}</small></span>
        <span class="pr-d">${r ? T('Rank', 'ස්ථානය') + ' ' + r.r + ' / ' + r.of : ''}</span><span class="pr-m">${m == null ? '—' : m + '%'}</span></div>`; }).join('')}</div>`;
  };

  /* ----- exam ----- */
  let exTimer = null, exQ = 0;
  PAGES.exam = () => {
    if (!st.exam) { st.exam = { ans: Array(D.live.qs.length).fill(null), flag: [], start: Date.now(), done: false }; save(); exQ = 0; }
    return `<div class="exam">
      <div class="ex-top"><a href="#" class="crumb" data-go="papers">← ${T('Papers', 'ප්‍රශ්න පත්‍ර')}</a>
        <span class="ex-name">P08 · ${esc(N(D.live))}</span><span class="ex-clock" id="exClock">--:--</span>
        <button class="btn sm" id="exSubmit">${T('Submit', 'යොමු කරන්න')}</button></div>
      <div class="ex-body"><div class="ex-q" id="exQ"></div>
        <aside class="ex-nav"><h3>${T('Questions', 'ප්‍රශ්න')}</h3><div class="ex-grid" id="exGrid"></div>
          <p class="meta" id="exCount"></p>
          <p class="meta dim">${T('Keys: 1-4 to answer, ← → to move.', 'යතුරු: පිළිතුරට 1-4, යාමට ← →.')}</p></aside></div>
    </div>`;
  };
  after.exam = () => {
    const ex = st.exam, Q = D.live.qs, total = D.live.minutes * 60;
    const draw = () => {
      const q = Q[exQ];
      $('#exQ').innerHTML = `<div class="q-n">${T('Question', 'ප්‍රශ්නය')} ${exQ + 1} <span>/ ${Q.length}</span>
          <button class="flag${ex.flag.includes(exQ) ? ' on' : ''}" id="exFlag">${ICON.flag}${T('Mark to review', 'නැවත බැලීමට')}</button></div>
        <p class="q-t">${esc(N(q))}</p>
        <div class="opts">${q.o.map((o, k) => `<button class="opt${ex.ans[exQ] === k ? ' on' : ''}" data-opt="${k}"><span class="o-k">${k + 1}</span><span>${esc(T(o[0], o[1]))}</span></button>`).join('')}</div>
        <div class="q-move"><button class="btn ghost" id="exPrev" ${exQ === 0 ? 'disabled' : ''}>← ${T('Previous', 'පෙර')}</button>
          <button class="btn ghost" id="exNext" ${exQ === Q.length - 1 ? 'disabled' : ''}>${T('Next', 'ඊළඟ')} →</button></div>`;
      $('#exGrid').innerHTML = Q.map((_, k) => `<button class="${ex.ans[k] != null ? 'ans' : ''}${k === exQ ? ' cur' : ''}${ex.flag.includes(k) ? ' fl' : ''}" data-q="${k}">${k + 1}</button>`).join('');
      const n = ex.ans.filter(a => a != null).length;
      $('#exCount').textContent = n + ' / ' + Q.length + ' ' + T('answered', 'පිළිතුරු දී ඇත');
      $$('[data-opt]').forEach(b => b.onclick = () => pick(+b.dataset.opt));
      $$('#exGrid [data-q]').forEach(b => b.onclick = () => { exQ = +b.dataset.q; draw(); });
      $('#exPrev').onclick = () => { if (exQ > 0) { exQ--; draw(); } };
      $('#exNext').onclick = () => { if (exQ < Q.length - 1) { exQ++; draw(); } };
      $('#exFlag').onclick = () => { const i = ex.flag.indexOf(exQ); if (i >= 0) ex.flag.splice(i, 1); else ex.flag.push(exQ); save(); draw(); };
    };
    const pick = k => { ex.ans[exQ] = k; save(); draw(); };
    const tick = () => {
      const left = total - (Date.now() - ex.start) / 1000;
      const el = $('#exClock'); if (!el) { clearInterval(exTimer); return; }
      el.textContent = fmtT(left); el.classList.toggle('low', left < 120);
      if (left <= 0) { clearInterval(exTimer); finish(); }
    };
    const finish = () => { clearInterval(exTimer); ex.done = true; ex.doneAt = new Date().toISOString(); save(); go('review'); };
    $('#exSubmit').onclick = () => {
      const open = ex.ans.filter(a => a == null).length;
      modal(`<h2>${T('Submit your paper?', 'පත්‍රය යොමු කරන්නද?')}</h2>
        <p>${open ? `${open} ${T('questions are not answered yet.', 'ප්‍රශ්නවලට තවම පිළිතුරු දී නැත.')}` : T('All questions are answered.', 'සියලු ප්‍රශ්නවලට පිළිතුරු දී ඇත.')} ${T('You cannot change answers after this.', 'මෙයින් පසු පිළිතුරු වෙනස් කළ නොහැක.')}</p>
        <div class="m-btns"><button class="btn ghost" data-close>${T('Keep working', 'දිගටම කරන්න')}</button><button class="btn" id="mSubmit">${T('Submit now', 'දැන් යොමු කරන්න')}</button></div>`);
      $('#mSubmit').onclick = () => { closeModal(); finish(); };
    };
    keyHandler = e => {
      if (S.page !== 'exam' || $('#modal').classList.contains('open')) return;
      if (/^[1-4]$/.test(e.key)) pick(+e.key - 1);
      else if (e.key === 'ArrowRight' && exQ < Q.length - 1) { exQ++; draw(); }
      else if (e.key === 'ArrowLeft' && exQ > 0) { exQ--; draw(); }
    };
    clearInterval(exTimer); exTimer = setInterval(tick, 500); tick(); draw();
  };
  let keyHandler = null;
  document.addEventListener('keydown', e => { if (keyHandler) keyHandler(e); });

  PAGES.review = () => {
    const ex = st.exam, Q = D.live.qs, sc = liveScore(ex.ans);
    const p = allPapers().find(x => x.kind === 'live'), r = rankOf(p, me.id), stt = statsFor(p);
    return `<div class="ph"><a href="#" class="crumb" data-go="papers">← ${T('Papers', 'ප්‍රශ්න පත්‍ර')}</a><h1>P08 · ${esc(N(D.live))}</h1></div>
      <div class="score">
        <div class="sc-big">${sc}<small>/${Q.length}</small></div>
        <div class="sc-cells">
          <div><span class="t-k">${T('Mark', 'ලකුණ')}</span><b>${Math.round(sc / Q.length * 100)}%</b></div>
          <div><span class="t-k">${T('Rank so far', 'දැනට ස්ථානය')}</span><b>${r.r} / ${r.of}</b></div>
          <div><span class="t-k">${T('Class average', 'පන්ති සාමාන්‍යය')}</span><b>${stt.avg}%</b></div>
        </div>
      </div>
      <h3 class="sec">${T('Your answers', 'ඔබේ පිළිතුරු')}</h3>
      <ol class="rev">${Q.map((q, k) => { const a = ex.ans[k], ok = a === q.a; return `<li class="${ok ? 'ok' : 'bad'}">
        <span class="rv-n">${k + 1}</span><div><p>${esc(N(q))}</p>
        <p class="rv-a">${a == null ? `<em>${T('Not answered', 'පිළිතුරු දී නැත')}</em>` : `${T('Your answer', 'ඔබේ පිළිතුර')}: <b>${esc(T(q.o[a][0], q.o[a][1]))}</b>`}
        ${ok ? '' : ` · ${T('Correct', 'නිවැරදි')}: <b class="good">${esc(T(q.o[q.a][0], q.o[q.a][1]))}</b>`}</p></div>
        <span class="rv-i">${ok ? ICON.check : ICON.x}</span></li>`; }).join('')}</ol>`;
  };

  /* ----- results ----- */
  PAGES.results = () => {
    const ps = allPapers().filter(p => p.kind !== 'new');
    const rows = ps.map(p => { const m = marksFor(p).find(x => x.s.id === me.id).m; return { p, m, avg: statsFor(p).avg, r: rankOf(p, me.id) }; }).filter(x => x.m != null);
    const W = 1100, H = 330, pad = 40, bw = (W - pad * 2) / rows.length;
    const y = v => H - 28 - (v / 100) * (H - 52);
    const bars = rows.map((x, i) => {
      const cx = pad + bw * i + bw / 2;
      return `<rect x="${cx - bw * 0.28}" y="${y(x.m)}" width="${bw * 0.56}" height="${H - 28 - y(x.m)}" class="b"/>
        <text x="${cx}" y="${y(x.m) + 20}" class="vi">${x.m}</text><text x="${cx}" y="${H - 8}" class="l">${x.p.id}</text>`;
    }).join('');
    const line = rows.map((x, i) => (i ? 'L' : 'M') + (pad + bw * i + bw / 2).toFixed(1) + ' ' + y(x.avg).toFixed(1)).join(' ');
    const dots = rows.map((x, i) => `<circle cx="${pad + bw * i + bw / 2}" cy="${y(x.avg)}" r="3.5" class="ad"/>`).join('');
    const grid = [0, 25, 50, 75, 100].map(g => `<line x1="${pad}" x2="${W - 8}" y1="${y(g)}" y2="${y(g)}" class="g"/><text x="${pad - 8}" y="${y(g) + 4}" class="gl">${g}</text>`).join('');
    const first = rows[0], last = rows[rows.length - 1];
    const myAvg = Math.round(rows.reduce((a, x) => a + x.m, 0) / rows.length);
    return `<div class="ph"><h1>${T('My results', 'මගේ ප්‍රතිඵල')}</h1><p class="meta">Sanduni Perera · S1001</p></div>
      <div class="kpis">
        <div><span class="t-k">${T('My average', 'මගේ සාමාන්‍යය')}</span><b>${myAvg}%</b></div>
        <div><span class="t-k">${T('Latest', 'අවසන්')}</span><b>${last.m}%</b></div>
        <div><span class="t-k">${T('Since', 'සිට')} ${first.p.id}</span><b class="ok">+${last.m - first.m}</b></div>
        <div><span class="t-k">${T('Latest rank', 'අවසන් ස්ථානය')}</span><b>${last.r.r}<small> / ${last.r.of}</small></b></div>
      </div>
      <div class="chart">
        <div class="ch-h"><h3>${T('Marks per paper', 'පත්‍රයෙන් පත්‍රයට ලකුණු')}</h3><span class="lg"><i class="lb"></i>${T('Me', 'මම')} <i class="la"></i>${T('Class average', 'පන්ති සාමාන්‍යය')}</span></div>
        <svg viewBox="0 0 ${W} ${H}" class="svgc" role="img" aria-label="Marks chart">${grid}${bars}<path d="${line}" class="al"/>${dots}</svg>
      </div>
      <table class="tbl"><thead><tr><th>${T('Paper', 'පත්‍රය')}</th><th class="hide-s">${T('Date', 'දිනය')}</th><th class="n">${T('Mark', 'ලකුණ')}</th><th class="n">${T('Average', 'සාමාන්‍යය')}</th><th class="n">${T('Rank', 'ස්ථානය')}</th></tr></thead>
      <tbody>${rows.slice().reverse().map(x => `<tr><td><b>${x.p.id}</b> ${esc(N(x.p))}</td><td class="hide-s">${fmtD(x.p.date)}</td><td class="n"><b>${x.m}%</b></td><td class="n">${x.avg}%</td><td class="n">${x.r.r} / ${x.r.of}</td></tr>`).join('')}</tbody></table>`;
  };

  /* ================= TEACHER ================= */
  const hist = (ms, W = 520, H = 200) => {
    const bins = Array(10).fill(0); ms.forEach(m => bins[Math.min(9, Math.floor(m / 10))]++);
    const mx = Math.max(...bins, 1), bw = (W - 20) / 10;
    return `<svg viewBox="0 0 ${W} ${H}" class="svgc" role="img" aria-label="Mark distribution">${bins.map((b, i) => {
      const h = (b / mx) * (H - 50), x = 10 + i * bw;
      return `<rect x="${x + 3}" y="${H - 24 - h}" width="${bw - 6}" height="${h}" class="b${i < 4 ? ' lo' : ''}"/>${b ? `<text x="${x + bw / 2}" y="${H - 30 - h}" class="v">${b}</text>` : ''}<text x="${x + bw / 2}" y="${H - 8}" class="l">${i * 10}</text>`;
    }).join('')}</svg>`;
  };

  PAGES.overview = () => {
    const ps = allPapers(), p7 = ps[6], s7 = statsFor(p7), live = ps.find(p => p.kind === 'live'), subs = liveSubs();
    const paid = D.students.filter(feePaid), due = D.students.filter(s => !feePaid(s));
    const watchedNew = D.lessons[D.lessons.length - 1].views;
    return `<div class="ph"><h1>${T('Good morning, Dilan', 'සුබ උදෑසනක්, ඩිලාන්')}</h1><p class="meta">${T('Sunday 15 November', 'නොවැම්බර් 15 ඉරිදා')} · 2026 O/L · ${D.students.length} ${T('students', 'සිසුන්')}</p></div>
      <div class="kpis">
        <div><span class="t-k">${T('November fees', 'නොවැම්බර් ගාස්තු')}</span><b>${money(paid.length * D.teacher.fee)}</b><small>${paid.length} / ${D.students.length} ${T('paid', 'ගෙවා ඇත')}</small></div>
        <div><span class="t-k">P07 ${T('average', 'සාමාන්‍යය')}</span><b>${s7.avg}%</b><small>${T('highest', 'වැඩිම')} ${s7.hi}% · ${T('lowest', 'අඩුම')} ${s7.lo}%</small></div>
        <div><span class="t-k">P08 ${T('live now', 'දැන් සජීවී')}</span><b>${subs.length}<small> / ${D.students.length}</small></b><small>${T('submitted', 'යොමු කර ඇත')}</small></div>
        <div><span class="t-k">${T('Lesson 12 views', '12 වන පාඩම නැරඹුම්')}</span><b>${watchedNew}<small> / ${D.students.length}</small></b><small>${T('since yesterday', 'ඊයේ සිට')}</small></div>
      </div>
      <div class="cols">
        <section class="panel">
          <div class="ch-h"><h3>P07 · ${esc(N(p7))}</h3><a href="#" class="more" data-go="tpapers" data-sub="P07">${T('Open', 'විවෘත කරන්න')} →</a></div>
          <p class="meta">${T('How many students scored in each range', 'එක් එක් පරාසයේ ලකුණු ගත් සිසුන් ගණන')}</p>
          ${hist(s7.ms)}
          <p class="meta"><i class="sw lo"></i>${s7.ms.filter(m => m < 40).length} ${T('students below 40%. Worth a revision class.', 'සිසුන් 40% ට අඩුයි. පුනරීක්ෂණ පන්තියක් වටී.')}</p>
        </section>
        <section class="panel">
          <div class="ch-h"><h3>${T('Fee due · November', 'ගාස්තු හිඟ · නොවැම්බර්')}</h3><span class="tag-n">${due.length}</span></div>
          <ul class="due">${due.map(s => `<li><span><b>${esc(s.name)}</b><small>${s.id} · ${s.phone}</small></span>
            <button class="btn ghost xs" data-remind="${s.id}">${T('Remind', 'මතක් කරන්න')}</button><button class="btn xs" data-pay="${s.id}">${T('Mark paid', 'ගෙවූ ලෙස')}</button></li>`).join('') || `<li class="dim">${T('Everyone has paid.', 'සියලු දෙනා ගෙවා ඇත.')}</li>`}</ul>
        </section>
      </div>
      <div class="cols">
        <section class="panel">
          <div class="ch-h"><h3>${T('Latest submissions · P08', 'නවතම යොමු කිරීම් · P08')}</h3></div>
          <ul class="subs">${subs.slice().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6).map(x => { const s = D.students.find(y => y.id === x.id);
            return `<li${x.me ? ' class="new"' : ''}><span>${esc(s.name)}</span><span class="dim">${x.at.slice(11, 16)}</span><b>${x.score}/10</b></li>`; }).join('')}</ul>
        </section>
        <section class="panel">
          <div class="ch-h"><h3>${T('Your classes', 'ඔබේ පන්ති')}</h3></div>
          <ul class="cls">${D.classes.map(c => `<li class="${c.active ? 'on' : ''}"><span>${esc(N(c))}</span><b>${c.n}</b>${c.active ? `<small>${T('open', 'විවෘත')}</small>` : ''}</li>`).join('')}</ul>
        </section>
      </div>`;
  };

  let stuQ = '', stuF = 'all';
  PAGES.students = () => {
    return `<div class="ph row"><div><h1>${T('Students', 'සිසුන්')}</h1><p class="meta">2026 O/L · ${D.students.length} ${T('students', 'සිසුන්')} · ${T('November fee', 'නොවැම්බර් ගාස්තුව')} ${money(D.teacher.fee)}</p></div>
      <button class="btn ghost" id="csv">${ICON.dl}${T('Download CSV', 'CSV බාගන්න')}</button></div>
      <div class="toolbar"><input type="search" id="stuQ" placeholder="${T('Search name or ID', 'නම හෝ අංකය සොයන්න')}" value="${esc(stuQ)}">
        <div class="filters">${[['all', 'All', 'සියල්ල'], ['due', 'Fee due', 'ගාස්තු හිඟ'], ['low', 'Below 40% in P07', 'P07 හි 40% ට අඩු']].map(([k, en, si]) => `<button data-sf="${k}" class="${stuF === k ? 'on' : ''}">${T(en, si)}</button>`).join('')}</div></div>
      <div id="stuTable"></div>`;
  };
  const spark = ms => {
    const v = ms.filter(m => m != null); if (v.length < 2) return '';
    const w = 84, h = 24, pts = ms.map((m, i) => m == null ? null : [i * (w / (ms.length - 1)), h - 2 - (m / 100) * (h - 4)]).filter(Boolean);
    return `<svg viewBox="0 0 ${w} ${h}" class="spark"><path d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}"/></svg>`;
  };
  function drawStudents() {
    const q = stuQ.trim().toLowerCase();
    let list = D.students.filter(s => !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    if (stuF === 'due') list = list.filter(s => !feePaid(s));
    if (stuF === 'low') list = list.filter(s => s.marks[6] != null && s.marks[6] < 40);
    const avg = s => { const v = s.marks.filter(m => m != null); return Math.round(v.reduce((a, b) => a + b, 0) / v.length); };
    $('#stuTable').innerHTML = list.length ? `<table class="tbl stu"><thead><tr><th>${T('Student', 'සිසුවා')}</th><th class="hide-s">${T('Phone', 'දුරකථනය')}</th><th>${T('Nov fee', 'නොවැ ගාස්තුව')}</th>
      <th class="n hide-s">P06</th><th class="n">P07</th><th class="n hide-s">${T('Average', 'සාමාන්‍යය')}</th><th class="hide-s">${T('Trend', 'ප්‍රවණතාව')}</th></tr></thead>
      <tbody>${list.map(s => `<tr><td><b>${esc(s.name)}</b><small>${s.id}</small></td><td class="hide-s mono">${s.phone}</td>
        <td><button class="fee ${feePaid(s) ? 'paid' : 'due'}" data-toggle="${s.id}">${feePaid(s) ? T('Paid', 'ගෙවා ඇත') : T('Due', 'හිඟයි')}</button></td>
        <td class="n hide-s">${s.marks[5] ?? '—'}</td><td class="n ${s.marks[6] != null && s.marks[6] < 40 ? 'lo' : ''}"><b>${s.marks[6] ?? T('Absent', 'නොපැමිණ')}</b></td>
        <td class="n hide-s">${avg(s)}%</td><td class="hide-s">${spark(s.marks)}</td></tr>`).join('')}</tbody></table>`
      : `<p class="empty">${T('No students match.', 'ගැළපෙන සිසුන් නැත.')}</p>`;
  }
  after.students = () => {
    drawStudents();
    $('#stuQ').oninput = e => { stuQ = e.target.value; drawStudents(); };
    $$('[data-sf]').forEach(b => b.onclick = () => { stuF = b.dataset.sf; $$('[data-sf]').forEach(x => x.classList.toggle('on', x === b)); drawStudents(); });
    $('#csv').onclick = () => {
      const rows = [['ID', 'Name', 'Phone', 'Nov fee', ...D.papers.map(p => p.id)]].concat(D.students.map(s => [s.id, s.name, s.phone, feePaid(s) ? 'Paid' : 'Due', ...s.marks.map(m => m ?? 'Absent')]));
      const blob = new Blob(['﻿' + rows.map(r => r.join(',')).join('\r\n')], { type: 'text/csv' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '2026-OL-students.csv'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      toast(T('CSV downloaded.', 'CSV බාගත කළා.'));
    };
  };

  PAGES.tpapers = () => {
    const ps = allPapers();
    const sel = ps.find(p => p.id === S.sub) || ps.find(p => p.kind === 'live');
    S.sub = sel.id;
    const stt = statsFor(sel);
    const ranks = marksFor(sel).filter(x => x.m != null).sort((a, b) => b.m - a.m).slice(0, 10);
    let qpct = sel.qPct;
    if (sel.kind === 'live') { const subs = liveSubs(); qpct = D.live.qs.map((q, k) => subs.length ? Math.round(subs.filter(x => x.ans[k] === q.a).length / subs.length * 100) : 0); }
    const title = sel.kind === 'new' ? esc(sel.title) : esc(N(sel));
    const hard = qpct ? qpct.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]).slice(0, 3).map(x => 'Q' + (x[1] + 1)) : [];
    return `<div class="ph row"><div><h1>${T('Papers', 'ප්‍රශ්න පත්‍ර')}</h1><p class="meta">${T('Online MCQ papers mark themselves. Finished papers show every student’s mark.', 'MCQ පත්‍රවලට ලකුණු ස්වයංක්‍රීයව ලැබේ.')}</p></div>
      <button class="btn" id="newPaper">${ICON.plus}${T('New paper', 'නව පත්‍රයක්')}</button></div>
      <div class="pp">
        <ul class="pp-list">${ps.slice().reverse().map(p => `<li><button data-sel="${p.id}" class="${p.id === sel.id ? 'on' : ''}">
          <span class="pr-id">${p.id.slice(1)}</span><span class="pr-t"><b>${p.kind === 'new' ? esc(p.title) : esc(N(p))}</b><small>${fmtD(p.date)} · ${p.kind === 'live' ? `<em class="live">${T('Live', 'සජීවී')}</em>` : p.kind === 'new' ? T('Scheduled', 'සැලසුම් කළා') : statsFor(p).avg + '% ' + T('avg', 'සාමාන්‍ය')}</small></span></button></li>`).join('')}</ul>
        <div class="pp-d">
          <div class="pp-h"><span class="pl-n">${sel.id.slice(1)}</span><div><h2>${title}</h2><p class="meta">${sel.nq} ${sel.nq === 1 ? T('question', 'ප්‍රශ්නය') : T('questions', 'ප්‍රශ්න')} · ${fmtD(sel.date)}${sel.kind === 'live' ? ' · ' + T('closes', 'වැසෙන්නේ') + ' ' + fmtD(sel.closes) : ''}</p></div></div>
          ${sel.kind === 'new' ? `<p class="empty">${T('Scheduled. Students can start it from', 'සැලසුම් කළා. සිසුන්ට ආරම්භ කළ හැක්කේ')} ${fmtD(sel.date)}.</p>
            <ol class="prev">${sel.qs.map(q => `<li><p>${esc(q.t)}</p><ul>${q.o.map((o, k) => `<li class="${k === q.a ? 'good' : ''}">${esc(o)}</li>`).join('')}</ul></li>`).join('')}</ol>`
          : `<div class="kpis sm">
            <div><span class="t-k">${T('Submitted', 'යොමු කළා')}</span><b>${stt.n}<small> / ${D.students.length}</small></b></div>
            <div><span class="t-k">${T('Average', 'සාමාන්‍යය')}</span><b>${stt.avg}%</b></div>
            <div><span class="t-k">${T('Highest', 'වැඩිම')}</span><b>${stt.hi}%</b></div>
            <div><span class="t-k">${T('Lowest', 'අඩුම')}</span><b>${stt.lo}%</b></div></div>
          <div class="cols">
            <section class="panel"><div class="ch-h"><h3>${T('Correct answers per question', 'ප්‍රශ්නයෙන් ප්‍රශ්නයට නිවැරදි ප්‍රතිශතය')}</h3></div>
              <div class="qbars${qpct.length > 20 ? ' dense' : ''}">${qpct.map((v, i) => `<span title="Q${i + 1}: ${v}%" class="${v < 40 ? 'lo' : ''}"><i style="height:${Math.max(3, v)}%"></i><em>${i + 1}</em></span>`).join('')}</div>
              <p class="meta"><i class="sw lo"></i>${T('Hardest', 'අමාරුම')}: ${hard.join(', ')}. ${T('Explain these again in class.', 'පන්තියේදී මේවා නැවත පැහැදිලි කරන්න.')}</p></section>
            <section class="panel"><div class="ch-h"><h3>${T('Top 10', 'මුල් 10')}</h3></div>
              <ol class="rank">${ranks.map((x, i) => `<li class="${x.s.me ? 'me' : ''}"><span class="rk">${i + 1}</span><span>${esc(x.s.name)}</span><b>${x.m}%</b></li>`).join('')}</ol></section>
          </div>`}
        </div>
      </div>`;
  };
  after.tpapers = () => {
    $$('[data-sel]').forEach(b => b.onclick = () => { S.sub = b.dataset.sel; render(); });
    $('#newPaper').onclick = paperBuilder;
  };

  function paperBuilder() {
    const qRow = i => `<fieldset class="qb" data-qi="${i}"><legend>${T('Question', 'ප්‍රශ්නය')} ${i + 1}</legend>
      <input class="qb-t" placeholder="${T('Question text', 'ප්‍රශ්නය')}" required>
      ${[0, 1, 2, 3].map(k => `<label class="qb-o"><input type="radio" name="c${i}" value="${k}" ${k === 0 ? 'checked' : ''}><input class="qb-ot" placeholder="${T('Answer', 'පිළිතුර')} ${k + 1}" required></label>`).join('')}
      <small class="dim">${T('Select the correct answer with the circle.', 'නිවැරදි පිළිතුර රවුමෙන් තෝරන්න.')}</small></fieldset>`;
    let n = 1;
    modal(`<h2>${T('New MCQ paper', 'නව MCQ පත්‍රයක්')}</h2>
      <form id="pbF" class="form" novalidate>
        <label>${T('Paper title', 'පත්‍රයේ නම')}<input id="pbT" required placeholder="${T('e.g. Unit 7 networks quiz', 'උදා: 7 ඒකකය ජාල ප්‍රශ්න')}"></label>
        <div class="two"><label>${T('Opens on', 'විවෘත වන දිනය')}<input id="pbD" type="date" value="2026-11-22" min="2026-11-15" required></label>
        <label>${T('Time (minutes)', 'කාලය (මිනිත්තු)')}<input id="pbM" type="number" min="5" max="180" value="20" required></label></div>
        <div id="pbQs">${qRow(0)}</div>
        <button type="button" class="btn ghost sm" id="pbAdd">${ICON.plus}${T('Add question', 'ප්‍රශ්නයක් එක් කරන්න')}</button>
        <p class="err" id="pbErr"></p>
        <div class="m-btns"><button type="button" class="btn ghost" data-close>${T('Cancel', 'අවලංගු කරන්න')}</button><button class="btn" type="submit">${T('Publish to class', 'පන්තියට පළ කරන්න')}</button></div>
      </form>`, 'wide');
    $('#pbAdd').onclick = () => { $('#pbQs').insertAdjacentHTML('beforeend', qRow(n++)); $('#pbQs').lastElementChild.querySelector('.qb-t').focus(); };
    $('#pbF').onsubmit = e => {
      e.preventDefault();
      const title = $('#pbT').value.trim(), date = $('#pbD').value, minutes = +$('#pbM').value;
      const qsx = $$('#pbQs .qb').map(f => ({ t: f.querySelector('.qb-t').value.trim(), o: $$('.qb-ot', f).map(x => x.value.trim()), a: +f.querySelector('input[type=radio]:checked').value }));
      $$('#pbF .bad').forEach(x => x.classList.remove('bad'));
      let bad = [];
      if (!title) bad.push($('#pbT'));
      if (!date || date < D.today) bad.push($('#pbD'));
      if (!(minutes >= 5 && minutes <= 180)) bad.push($('#pbM'));
      $$('#pbQs .qb-t, #pbQs .qb-ot').forEach(x => { if (!x.value.trim()) bad.push(x); });
      if (bad.length) { bad.forEach(x => x.classList.add('bad')); bad[0].focus(); $('#pbErr').textContent = T('Fill in the highlighted boxes.', 'ඉස්මතු කළ කොටු පුරවන්න.'); return; }
      const id = 'P' + String(9 + st.newPapers.length).padStart(2, '0');
      st.newPapers.push({ id, title, date, minutes, qs: qsx }); save();
      closeModal(); S.sub = id; render(); toast(T('Paper published. Students will see it in their Papers page.', 'පත්‍රය පළ කළා. සිසුන්ට එය ප්‍රශ්න පත්‍ර පිටුවේ පෙනේ.'));
    };
  }

  PAGES.recordings = () => {
    const ls = lessons().slice().reverse();
    return `<div class="ph row"><div><h1>${T('Recordings', 'පටිගත කිරීම්')}</h1><p class="meta">${ls.length} ${T('lessons', 'පාඩම්')} · ${T('students only see their own class', 'සිසුන්ට පෙනෙන්නේ ඔවුන්ගේ පන්තිය පමණි')}</p></div>
      <button class="btn" id="upBtn">${ICON.up}${T('Upload recording', 'පටිගත කිරීමක් උඩුගත කරන්න')}</button></div>
      <div class="grid-l">${ls.map(l => { const v = l.views ?? 0; return `<div class="lcard t">${cover(l, { noprog: true })}
        <span class="lc-meta"><b>${T('Lesson', 'පාඩම')} ${esc(l.n)}</b> · ${fmtD(l.date)}</span>
        <span class="lc-views"><span class="bar-l"><i style="width:${Math.round(v / D.students.length * 100)}%"></i></span>${v} / ${D.students.length} ${T('watched', 'නැරඹුවා')}</span></div>`; }).join('')}</div>`;
  };
  after.recordings = () => { $('#upBtn').onclick = uploader; };

  function uploader() {
    const nextN = String(lessons().length + 1).padStart(2, '0');
    modal(`<h2>${T('Upload recording', 'පටිගත කිරීමක් උඩුගත කරන්න')}</h2>
      <form id="upF" class="form" novalidate>
        <label>${T('Lesson title', 'පාඩමේ නම')}<input id="upT" required placeholder="${T('e.g. IP addresses: practice', 'උදා: IP ලිපින පුහුණුව')}"></label>
        <div class="two"><label>${T('Unit', 'ඒකකය')}<select id="upU">${Object.values(D.units).map(u => `<option value="${u.code}" ${u.code === 'U07' ? 'selected' : ''}>${u.code} · ${esc(N(u))}</option>`).join('')}</select></label>
        <label>${T('Lesson number', 'පාඩම් අංකය')}<input id="upN" value="${nextN}" readonly></label></div>
        <label class="drop" id="upDrop"><input type="file" id="upFile" accept="video/*"><span id="upFn">${ICON.up}<b>${T('Choose a video file', 'වීඩියෝ ගොනුවක් තෝරන්න')}</b><small>MP4 · ${T('any size', 'ඕනෑම ප්‍රමාණයක්')}</small></span></label>
        <div class="upbar" id="upBar" hidden><i></i><span></span></div>
        <p class="err" id="upErr"></p>
        <div class="m-btns"><button type="button" class="btn ghost" data-close>${T('Cancel', 'අවලංගු කරන්න')}</button><button class="btn" type="submit" id="upGo">${T('Upload', 'උඩුගත කරන්න')}</button></div>
      </form>`);
    let fname = '';
    $('#upFile').onchange = e => { const f = e.target.files[0]; if (f) { fname = f.name; $('#upFn').innerHTML = `${ICON.file}<b>${esc(f.name)}</b><small>${(f.size / 1048576).toFixed(1)} MB</small>`; } };
    $('#upF').onsubmit = e => {
      e.preventDefault();
      const title = $('#upT').value.trim();
      $('#upT').classList.toggle('bad', !title); $('#upDrop').classList.toggle('bad', !fname);
      if (!title || !fname) { $('#upErr').textContent = T('Add a title and choose a video file.', 'නමක් දී වීඩියෝ ගොනුවක් තෝරන්න.'); return; }
      $('#upErr').textContent = ''; $('#upGo').disabled = true;
      const bar = $('#upBar'); bar.hidden = false;
      let p = 0;
      const t = setInterval(() => {
        p += 4 + Math.random() * 7;
        if (!document.body.contains(bar)) { clearInterval(t); return; }
        if (p >= 100) {
          clearInterval(t); bar.querySelector('i').style.width = '100%'; bar.querySelector('span').textContent = T('Processing…', 'සකසමින්…');
          setTimeout(() => {
            if (!document.body.contains(bar)) return;
            const id = 'L' + nextN;
            st.uploads.push({ id, n: nextN, unit: $('#upU').value, en: title, si: title, dur: '45:00', sec: 2700, date: D.today, views: 0,
              chapters: [[0, 'Introduction', 'හැඳින්වීම'], [0.2, 'Lesson', 'පාඩම'], [0.8, 'Questions', 'ප්‍රශ්න']] });
            save(); closeModal(); render(); toast(T('Uploaded. Students can watch it now.', 'උඩුගත කළා. සිසුන්ට දැන් නැරඹිය හැක.'));
          }, 900);
          return;
        }
        bar.querySelector('i').style.width = p + '%'; bar.querySelector('span').textContent = Math.floor(p) + '%';
      }, 120);
    };
  }

  /* ---------- modal + toast ---------- */
  function modal(html, cls) {
    const m = $('#modal');
    m.innerHTML = `<div class="m-box ${cls || ''}" role="dialog" aria-modal="true"><button class="m-x" data-close aria-label="Close">${ICON.x}</button>${html}</div>`;
    m.classList.add('open'); document.body.classList.add('locked');
    const f = m.querySelector('input:not([readonly]), button.btn'); if (f) setTimeout(() => f.focus(), 30);
  }
  function closeModal() { const m = $('#modal'); m.classList.remove('open'); m.innerHTML = ''; document.body.classList.remove('locked'); }
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }

  /* ---------- global events ---------- */
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); const [p, id] = g.dataset.go.split(':'); go(p, id || g.dataset.sub); return; }
    if (e.target.closest('[data-close]') || e.target.id === 'modal') { closeModal(); return; }
    const r = e.target.closest('#role button');
    if (r) { if (r.dataset.role !== S.role) { S.role = r.dataset.role; go(homeOf(S.role)); } return; }
    if (e.target.closest('#langBtn')) {
      lang = lang === 'si' ? 'en' : 'si'; try { localStorage.setItem('samsoft-lms-lang', lang); } catch (x) { /* ignore */ }
      stopPlayer(); clearInterval(exTimer); render();
      return;
    }
    if (e.target.closest('#resetDemo')) { try { localStorage.removeItem(KEY); } catch (x) { /* ignore */ } st = {}; location.search = lang === 'si' ? '?lang=si' : ''; return; }
    const lb = e.target.closest('[data-lib]'); if (lb) { libFilter = lb.dataset.lib; render(); return; }
    if (e.target.closest('[data-act="notes"]')) { toast(T('In the real LMS this opens the PDF notes.', 'සැබෑ LMS එකේ මෙයින් PDF සටහන් විවෘත වේ.')); return; }
    const pay = e.target.closest('[data-pay]'); if (pay) { st.fees[pay.dataset.pay] = true; save(); render(); toast(T('Marked as paid.', 'ගෙවූ ලෙස සටහන් කළා.')); return; }
    const tg = e.target.closest('[data-toggle]'); if (tg) { const s = D.students.find(x => x.id === tg.dataset.toggle); st.fees[s.id] = !feePaid(s); save(); drawStudents(); return; }
    const rm = e.target.closest('[data-remind]'); if (rm) { const s = D.students.find(x => x.id === rm.dataset.remind);
      toast(T('WhatsApp reminder ready for ', 'WhatsApp මතක් කිරීම සූදානම්: ') + s.name + '.'); return; }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal').classList.contains('open')) closeModal(); });

  render();
})();
