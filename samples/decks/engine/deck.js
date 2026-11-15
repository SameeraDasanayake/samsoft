/* Samsoft Decks engine: 1600x900 stage scaled to the window, arrow / clicker / swipe navigation, step reveals,
   English / Sinhala toggle (data-en / data-si or <span lang>), MCQ marking, per-slide enter / leave hooks. */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const stage = $('.stage'), slides = $$('.slide', stage), body = document.body, root = document.documentElement;
  const hooks = {}; let cur = -1;

  /* language: English default, ?lang=si or the last choice */
  let lang = new URLSearchParams(location.search).get('lang');
  if (!lang) { try { lang = localStorage.getItem('samsoft-deck-lang'); } catch (e) {} }
  lang = lang === 'si' ? 'si' : 'en';
  function setLang(l) {
    lang = l; root.dataset.lang = l; root.lang = l === 'si' ? 'si' : 'en';
    try { localStorage.setItem('samsoft-deck-lang', l); } catch (e) {}
    $$('[data-lang-btn]').forEach(b => b.textContent = l === 'en' ? 'සිං' : 'EN');
    document.title = (l === 'si' ? body.dataset.titleSi : body.dataset.titleEn) || document.title;
    window.dispatchEvent(new CustomEvent('deck:lang', { detail: l }));
  }

  /* expand data-en / data-si into two spans so CSS can switch them */
  $$('[data-en]').forEach(el => {
    el.innerHTML = `<span lang="en">${el.dataset.en}</span><span lang="si">${el.dataset.si ?? el.dataset.en}</span>`;
  });

  /* chrome on every slide: subject tag left, number right, progress bar */
  const n = slides.length, pad = x => String(x).padStart(2, '0');
  slides.forEach((s, i) => {
    if (s.hasAttribute('data-bare')) return;
    const c = document.createElement('div'); c.className = 'chrome';
    c.innerHTML = `<span><b>Samsoft</b> · <span lang="en">${body.dataset.tagEn}</span><span lang="si">${body.dataset.tagSi}</span></span><span class="num">${pad(i + 1)} / ${pad(n)}</span>`;
    s.prepend(c);
  });
  const prog = document.createElement('div'); prog.className = 'progress'; stage.appendChild(prog);

  /* scale */
  function fit() {
    const k = Math.min(innerWidth / 1600, innerHeight / 900);
    stage.style.transform = `scale(${k})`;
  }
  addEventListener('resize', fit); fit();

  /* steps */
  const steps = s => $$('[data-step]', s).sort((a, b) => a.dataset.step - b.dataset.step);
  function resetSteps(s, shown) { steps(s).forEach(e => e.classList.toggle('hide', !shown)); }

  function go(i, fromBack) {
    i = Math.max(0, Math.min(n - 1, i)); if (i === cur) return;
    const prev = slides[cur];
    if (prev) { prev.classList.remove('on'); fire(prev, 'leave'); }
    cur = i; const s = slides[i];
    resetSteps(s, !!fromBack);
    s.classList.add('on'); prog.style.width = ((i + 1) / n * 100) + '%';
    history.replaceState(null, '', location.pathname + location.search + '#' + (i + 1));
    fire(s, 'enter');
  }
  function fire(s, type) {
    s.dispatchEvent(new CustomEvent('slide:' + type));
    const h = hooks[s.dataset.id]; if (h && h[type]) h[type](s);
  }
  function next() {
    const hidden = steps(slides[cur]).filter(e => e.classList.contains('hide'));
    if (hidden.length) { const k = hidden[0].dataset.step; hidden.filter(e => e.dataset.step === k).forEach(e => e.classList.remove('hide')); return; }
    go(cur + 1);
  }
  function prev() {
    const shown = steps(slides[cur]).filter(e => !e.classList.contains('hide'));
    if (shown.length) { const k = shown[shown.length - 1].dataset.step; shown.filter(e => e.dataset.step === k).forEach(e => e.classList.add('hide')); return; }
    go(cur - 1, true);
  }
  function full() { if (document.fullscreenElement) document.exitFullscreen(); else root.requestFullscreen?.().catch(() => {}); }

  addEventListener('keydown', e => {
    const t = e.target; if (t.matches && t.matches('input, textarea, select')) return;
    const k = e.key;
    if (['ArrowRight', 'PageDown', ' ', 'Enter', 'ArrowDown'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0); else if (k === 'End') go(n - 1);
    else if (k === 'f' || k === 'F') full();
    else if (k === 'l' || k === 'L') setLang(lang === 'en' ? 'si' : 'en');
  });

  /* swipe (not on 3D views or controls) */
  let sx = null, sy = 0;
  stage.addEventListener('touchstart', e => { if (e.target.closest('.v3d, input, button, .nodrag')) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (sx === null) return; const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
  });

  /* floating bar */
  const bar = document.createElement('div'); bar.className = 'bar';
  const icon = d => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
  bar.innerHTML = `<a class="home" href="../index.html" title="All decks">${icon('M4 5h16M4 12h16M4 19h16')}</a>
    <button data-a="prev" title="Back">${icon('M15 5l-7 7 7 7')}</button><button data-a="next" title="Next">${icon('M9 5l7 7-7 7')}</button>
    <button data-a="lang" data-lang-btn title="English / සිංහල"></button><button data-a="full" title="Full screen">${icon('M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5')}</button>`;
  body.appendChild(bar);
  bar.addEventListener('click', e => {
    const a = e.target.closest('button')?.dataset.a;
    if (a === 'prev') prev(); else if (a === 'next') next(); else if (a === 'full') full(); else if (a === 'lang') setLang(lang === 'en' ? 'si' : 'en');
  });
  let idle; const wake = () => { body.classList.add('awake'); clearTimeout(idle); idle = setTimeout(() => body.classList.remove('awake'), 2600); };
  addEventListener('mousemove', wake); addEventListener('touchstart', wake, { passive: true });

  /* MCQ: (1)(2)(3)(4), data-ans = the right number; wrong picks get struck, the right one shows the reason */
  $$('.mcq').forEach(q => {
    const ans = +q.dataset.ans;
    $$('li', q).forEach((li, i) => {
      const b = li.querySelector('button') || li;
      b.insertAdjacentHTML('afterbegin', `<span class="k">(${i + 1})</span>`); b.insertAdjacentHTML('beforeend', '<span class="mk"></span>');
      b.addEventListener('click', () => {
        if (q.classList.contains('done')) return;
        if (i + 1 === ans) { li.classList.add('right'); li.querySelector('.mk').textContent = '✓'; q.classList.add('done'); }
        else { li.classList.add('wrong'); li.querySelector('.mk').textContent = '✗'; }
      });
    });
  });

  window.Deck = {
    on(id, h) { hooks[id] = Object.assign(hooks[id] || {}, h); if (slides[cur] && slides[cur].dataset.id === id && h.enter) h.enter(slides[cur]); },
    get lang() { return lang; }, go, next, prev
  };

  setLang(lang);
  const start = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(start) ? start - 1 : 0);
})();
