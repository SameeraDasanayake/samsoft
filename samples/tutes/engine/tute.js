/* Samsoft tutes — renders window.TUTE (+ window.FIGS label points from tools/tutes/trim.py) as an A4 study tute.
   ?lang=en|si. Plain script (no modules / fetch) so it also works when opened by double-click. */
(function () {
  const T = window.TUTE, F = window.FIGS || {}, qs = new URLSearchParams(location.search);
  const lang = qs.get('lang') === 'si' ? 'si' : 'en', other = lang === 'si' ? 'en' : 'si';
  const ed = qs.get('ed') === 'student' ? 'student' : 'teacher', stu = ed === 'student';
  const t = x => x == null ? '' : typeof x === 'string' || typeof x === 'number' ? String(x) : (x[lang] ?? x.en);
  const L = {
    en: { tute: 'Tute', toc: 'In this tute', name: 'Name', cls: 'Class', date: 'Date', ex: 'Example', check: 'Quick check',
      exs: 'Exercises', a: 'Part A — Multiple choice', b: 'Part B — Structured questions', sum: 'What we learned', words: 'Words to know',
      ans: 'Answers', fig: 'Figure', rem: 'Remember', fact: 'Did you know?', key: 'Key idea', tip: 'Tip', word: 'Word', ansl: 'Answer',
      mk: n => `[${n}]`, circle: 'Write the number of the correct answer in the box.', back: 'Tutes', ted: "Teacher's copy", sed: "Student's copy" },
    si: { tute: 'නිබන්ධනය', toc: 'මෙම නිබන්ධනයේ', name: 'නම', cls: 'පන්තිය', date: 'දිනය', ex: 'නිදසුන', check: 'තේරුණාද බලමු',
      exs: 'අභ්‍යාස', a: 'A කොටස — බහුවරණ', b: 'B කොටස — ව්‍යුහගත ප්‍රශ්න', sum: 'මේ පාඩමෙන් අපි ඉගෙන ගත්තේ', words: 'පාරිභාෂික වචන',
      ans: 'පිළිතුරු', fig: 'රූපය', rem: 'මතක තබා ගන්න', fact: 'ඔබ දන්නවාද?', key: 'ප්‍රධාන අදහස', tip: 'ඉඟිය', word: 'වචනය', ansl: 'පිළිතුර',
      mk: n => `[ලකුණු ${n}]`, circle: 'නිවැරදි පිළිතුරේ අංකය කොටුවේ ලියන්න.', back: 'නිබන්ධන', ted: 'ගුරු පිටපත', sed: 'සිසු පිටපත' }
  }[lang];
  const pad = n => String(n).padStart(2, '0');
  const plain = h => h.replace(/<[^>]+>/g, '').replace(/&\w+;/g, 'x');
  const alpha = 'abcdefgh';
  document.documentElement.lang = lang;
  document.documentElement.style.setProperty('--ac', T.accent);
  document.title = `${L.tute} ${T.no} — ${plain(t(T.title))} · ${stu ? L.sed : L.ted} (${lang.toUpperCase()})`;
  // key words (<b>) become blanks in the student copy and highlighted answers in the teacher copy
  const fill = h => h.replace(/<b>(.*?)<\/b>/g, (m, w) => stu ? `<span class="blank" style="width:${(plain(w).length * (lang === 'si' ? .62 : .55) + 1.6).toFixed(1)}em"></span>` : `<b class="fill">${w}</b>`);
  const tf = x => fill(t(x));

  // ---------- labelled 3D render: picture + print labels with leader lines ----------
  function labelled(f) {
    const d = F[f.img]; if (!d) return `<b style="color:red">missing fig ${f.img}</b>`;
    const W = f.w || 110, lw = f.lw ?? 34, rw = f.rw ?? lw, used = f.labels || [];
    const has = s => used.some(l => (l[2] || 'r') === s);
    const pl = has('l') ? lw : 0, pr = has('r') ? rw : 0, k = d.w / (W - pl - pr);   // figure px per mm
    const PL = pl * k, PR = pr * k, fs = (lang === 'si' ? 2.95 : 2.85) * k, gap = fs * 1.25, padY = (f.py ?? 0) * k;
    const pts = used.map(([key, txt, side = 'r', dy = 0, dx = 0]) => {
      const p = d.labels.find(l => l.en === key) || d.labels[key];
      if (!p) throw new Error('label ' + key + ' not in ' + f.img);
      const lines = t(txt ?? { en: p.en, si: p.si }).split('\n');
      return { x: p.x + PL, y: p.y + padY, side, ty: p.y + padY + dy * k, tx: p.x + PL + dx * k, lines };
    });
    const H = d.h + 2 * padY;
    for (const s of ['l', 'r']) {
      const g = pts.filter(p => p.side === s).sort((a, b) => a.ty - b.ty);
      const h = p => (p.lines.length - 1) * fs * 1.1;
      for (let i = 1; i < g.length; i++) g[i].ty = Math.max(g[i].ty, g[i - 1].ty + h(g[i - 1]) + gap);
      for (let i = g.length - 1; i >= 0; i--) { const max = i === g.length - 1 ? H - fs * .4 - h(g[i]) : g[i + 1].ty - gap - h(g[i]); g[i].ty = Math.min(g[i].ty, max); }
      for (let i = 0; i < g.length; i++) g[i].ty = Math.max(g[i].ty, i ? g[i - 1].ty + h(g[i - 1]) + gap : fs);
    }
    const sw = .28 * k, VW = d.w + PL + PR;
    // grow the picture area so labels above / below the render stay inside the figure (not over the caption)
    const lo = Math.min(0, ...pts.map(p => p.ty - fs)), hi = Math.max(H, ...pts.map(p => p.ty + fs * .9));
    const lab = pts.map(p => {
      if (p.side === 'c') return (p.tx !== p.x || p.ty !== p.y ? `<path class="ld" d="M${p.x.toFixed(1)} ${p.y.toFixed(1)} L${p.tx.toFixed(1)} ${(p.ty + (p.ty > p.y ? -fs * .75 : fs * .5)).toFixed(1)}" stroke-width="${sw}"/>` : '') +
        `<text class="plate" x="${p.tx.toFixed(1)}" y="${(p.ty + fs * .34).toFixed(1)}" font-size="${fs.toFixed(1)}" text-anchor="middle">${p.lines.join(' ')}</text>`;
      const ex = p.side === 'l' ? PL - 1.2 * k : PL + d.w + 1.2 * k, tx = p.side === 'l' ? ex - 1.2 * k : ex + 1.2 * k;
      const mid = p.side === 'l' ? Math.min(p.x - 2 * k, PL + 2 * k) : Math.max(p.x + 2 * k, PL + d.w - 2 * k);
      const path = `M${p.x.toFixed(1)} ${p.y.toFixed(1)} L${mid.toFixed(1)} ${p.ty.toFixed(1)} L${ex.toFixed(1)} ${p.ty.toFixed(1)}`;
      const txt = p.lines.map((s, i) => `<tspan x="${tx.toFixed(1)}" dy="${i ? fs * 1.1 : fs * .34}">${s}</tspan>`).join('');
      return `<path d="${path}" stroke="#fff" stroke-width="${sw * 3.2}" fill="none" opacity=".85"/><path class="ld" d="${path}" stroke-width="${sw}"/>` +
        `<circle class="dt" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(.85 * k).toFixed(1)}" stroke-width="${(.3 * k).toFixed(1)}"/>` +
        `<text x="${tx.toFixed(1)}" y="${p.ty.toFixed(1)}" font-size="${fs.toFixed(1)}" text-anchor="${p.side === 'l' ? 'end' : 'start'}">${txt}</text>`;
    }).join('');
    return `<svg class="lab" width="${W}mm" viewBox="0 ${lo.toFixed(1)} ${VW.toFixed(1)} ${(hi - lo).toFixed(1)}"><image href="img/${f.img}.png" x="${PL.toFixed(1)}" y="${padY.toFixed(1)}" width="${d.w}" height="${d.h}"/>${lab}</svg>`;
  }

  // ---------- blocks ----------
  let fign = 0, exn = 0, chk = 0, secn = 0;
  const checks = [], words = [];
  const side = s => !s ? '' : [].concat(s).map(x => {
    if (x.term) { words.push(x.term); return `<div class="term"><b>${x.term[lang]}</b><em>${x.term[other]}</em>${x.d ? `<span>${t(x.d)}</span>` : ''}</div>`; }
    if (x.note || x.fact || x.rem) { const tag = x.tag ? t(x.tag) : x.fact ? L.fact : x.rem ? L.rem : ''; return `<div class="note">${tag ? `<span class="tag">${tag}</span>` : ''}${t(x.note || x.fact || x.rem)}</div>`; }
    if (x.fig) return `<div class="note">${fig(x.fig, x.cap)}</div>`;
    return t(x);
  }).join('');
  function fig(f, cap) {
    const art = typeof f === 'string' || f.en ? t(f) : f.svg ? t(f.svg) : f.labels ? labelled(f) : `<img src="img/${f.img}.png" style="width:${f.w || 100}mm">`;
    return `<figure><div class="art">${art}</div>${cap ? `<figcaption><b>${L.fig} ${++fign}</b>${t(cap)}</figcaption>` : ''}</figure>`;
  }
  const row = (cls, m, s, wide) => { const sd = wide ? '' : side(s); return `<div class="row ${cls}${wide ? ' wide' : ''}">${sd ? `<div class="s">${sd}</div>` : ''}<div class="m">${m}</div></div>`; };
  function block(b) {
    if (b.sec) { secn++; return `<div class="sec${b.newpage ? ' newpage' : ''}"><span class="n">${pad(secn)}</span><h2>${t(b.sec)}</h2></div>` + (b.lead ? row('', `<p class="lead">${tf(b.lead)}</p>`, b.s) : ''); }
    if (b.h) return row('keep', `<h3 class="sub">${t(b.h)}</h3>${b.p ? `<p>${tf(b.p)}</p>` : ''}`, b.s);
    if (b.p) return row('', [].concat(b.p).map(p => `<p>${tf(p)}</p>`).join(''), b.s);
    if (b.ul) return row('', `${b.intro ? `<p>${tf(b.intro)}</p>` : ''}<ul class="dots">${b.ul.map(x => `<li>${tf(x)}</li>`).join('')}</ul>`, b.s);
    if (b.fig) return row('rfig', fig(b.fig, b.cap), b.s, b.wide);
    if (b.box) { const tt = b.title ? t(b.title) : { key: L.key, rem: L.rem, fact: L.fact, tip: L.tip }[b.k || 'rem'];
      return row('rbox', `<div class="box ${b.k || 'rem'}"><span class="bt">${tt}</span>${[].concat(b.box).map(x => `<p${b.k === 'key' ? ' class="big"' : ''}>${tf(x)}</p>`).join('')}</div>`, b.s, b.wide); }
    if (b.ex) { const e = b.ex; return row('rex', `<div class="ex"><div class="eh"><span>${L.ex} ${++exn}</span></div><p class="eq">${t(e.q)}</p>${e.fig ? fig(e.fig) : ''}
      <ol class="steps">${e.steps.map(s => `<li><span>${t(s)}</span></li>`).join('')}</ol>${e.a ? `<div class="ea">${t(e.a)}</div>` : ''}</div>`, b.s); }
    if (b.tbl) { const x = b.tbl, num = x.num || [];
      return row('rtbl', `<table class="t">${x.head ? `<tr>${x.head.map((h, i) => `<th class="${num.includes(i) ? 'n' : ''}">${t(h)}</th>`).join('')}</tr>` : ''}${
        x.rows.map(r => `<tr>${r.map((c, i) => `<td class="${num.includes(i) ? 'n' : ''}">${t(c)}</td>`).join('')}</tr>`).join('')}</table>`, b.s, b.wide); }
    if (b.check) { chk++; checks.push({ n: chk, qs: b.check });
      return row('keep', `<div class="check"><span class="bt">${L.check} ${chk}</span><ol>${b.check.map(c => `<li>${t(c.q)}${'<span class="ln"></span>'.repeat(c.lines ?? 1)}</li>`).join('')}</ol></div>`, b.s); }
    if (b.raw) return row('', t(b.raw), b.s, b.wide);
    throw new Error('unknown block ' + JSON.stringify(b).slice(0, 80));
  }

  // ---------- exercises ----------
  function optsHtml(q) {
    const o = q.opts.map(t), len = Math.max(...o.map(x => plain(x).length));
    const c = q.cols || (len <= 13 ? 4 : len <= 30 ? 2 : 1);
    return `<ol class="opts c${c}">${o.map((x, i) => `<li><span>(${i + 1})</span><span>${x}</span></li>`).join('')}</ol>`;
  }
  let qn = 0;
  const mcqHtml = q => `<div class="q"><span class="qn">${pad(q.n = ++qn)}</span><div><p>${t(q.q)}</p>${q.fig ? fig(q.fig) : ''}${optsHtml(q)}</div><span class="abox"></span></div>`;
  const lines = n => n ? `<div class="lines">${'<i></i>'.repeat(n)}</div>` : '';
  const draw = mm => mm ? `<div class="draw" style="height:${mm}mm"></div>` : '';
  // structured question: the stem, its figure and part (a) stay together (with the Part B heading for the first one); later parts may move to the next page
  const part = (p, i) => `<div class="qp"><span class="pl">(${alpha[i]})</span><div><p>${t(p.q)}</p>${p.fig ? fig(p.fig) : ''}${p.draw ? draw(p.draw) : lines(p.lines ?? 2)}</div><span class="mk">${p.m ? L.mk(p.m) : ''}</span></div>`;
  const stHtml = (q, head = '') => `<div class="keep">${head}<div class="sq first"><span class="qn">${pad(q.n = ++qn)}</span><div>${t(q.q) ? `<p>${t(q.q)}</p>` : ''}${q.fig ? fig(q.fig) : ''}${part(q.parts[0], 0)}</div></div></div>` +
    q.parts.slice(1).map((p, i) => `<div class="sq"><span></span><div>${part(p, i + 1)}</div></div>`).join('');

  // ---------- page ----------
  const self = location.pathname.split('/').slice(-2, -1)[0];
  const bar = `<nav class="bar noprint"><a href="../index.html">← ${L.back}</a><span class="sp"></span>
    <span class="grp"><a class="${!stu ? 'on' : ''}" href="?lang=${lang}&ed=teacher">${L.ted}</a><a class="${stu ? 'on' : ''}" href="?lang=${lang}&ed=student">${L.sed}</a></span>
    <span class="grp"><a class="${lang === 'en' ? 'on' : ''}" href="?lang=en&ed=${ed}">English</a><a class="${lang === 'si' ? 'on' : ''}" href="?lang=si&ed=${ed}">සිංහල</a></span>
    <a href="${stu ? `${self}-student-${lang}` : `${self}-teacher`}.pdf">PDF ↓</a></nav>`;

  // a section heading always stays with the block after it
  const small = b => b && (b.p || b.ul || b.h) && !b.s?.fig;
  const glue = (b, n) => b.sec && n && !b.lead && small(n);
  const notes = T.body.map((b, i) => [b, i]).filter(([b, i]) => !(i && glue(T.body[i - 1], b))).map(([b, i]) =>
    glue(b, T.body[i + 1]) ? `<div class="keep${b.newpage ? ' newpage' : ''}">${block(b)}${block(T.body[i + 1])}</div>` : b.sec && b.newpage ? `<div class="newpage">${block(b)}</div>` : block(b)).join('');
  const secs = T.body.filter(b => b.sec).map(b => t(b.sec)).concat(stu ? [L.exs, L.sum] : [L.exs, L.sum, L.ans]);
  const cover = `<section class="cover"><div class="band"></div><div class="top"><span>${t(T.inst)}</span><span>${t(T.subject)} · ${t(T.grade)}</span></div>
    <div class="ed ${ed}">${stu ? L.sed : L.ted}</div><div class="no">${T.no}</div><h1>${t(T.title)}</h1><div class="sub">${t(T.sub)}</div>
    <div class="hero">${T.heroSvg ? t(T.heroSvg) : `<img src="img/${T.hero}.png" alt="">`}</div>
        <div class="toc"><h3>${L.toc}</h3><ol>${secs.map((s, i) => `<li><span>${pad(i + 1)}</span>${s}</li>`).join('')}</ol></div>
    <div class="foot"><div><b>${t(T.inst)}</b>${t(T.teacher || '')}</div><div class="meta">${L.tute} ${T.no} · ${T.code}</div></div></section>`;

  const exs = `<div class="sec"><span class="n">${pad(++secn)}</span><h2>${L.exs}</h2></div>
    <div class="exh">${L.a}<span>${L.circle}</span></div>${T.mcq.map(mcqHtml).join('')}
    ${T.st.map((q, i) => stHtml(q, i ? '' : `<div class="exh">${L.b}<span></span></div>`)).join('')}`;

  const seen = new Set(), gl = words.concat(T.words || []).filter(w => !seen.has(w.en) && seen.add(w.en));
  const sum = `<div class="sec"><span class="n">${pad(++secn)}</span><h2>${L.sum}</h2></div>
    <ol class="sum">${T.summary.map(s => `<li>${t(s)}</li>`).join('')}</ol>
    <div class="exh">${L.words}<span></span></div><div class="gloss">${gl.map(w => `<div><b>${w.en}</b><span>${w.si}</span></div>`).join('')}</div>`;

  const ans = `<div class="sec"><span class="n">${pad(++secn)}</span><h2>${L.ans}</h2></div><div class="ans">
    ${checks.map(c => `<h4>${L.check} ${c.n}</h4>${c.qs.map((q, i) => `<div class="a"><b>${i + 1}</b><div>${t(q.a)}</div></div>`).join('')}`).join('')}
    <h4>${L.a}</h4><div class="mcqk">${T.mcq.map(q => `<div>${pad(q.n)}<b>${q.a}</b></div>`).join('')}</div>
    ${T.mcq.filter(q => q.why).map(q => `<div class="a"><b>${pad(q.n)}</b><div>${t(q.why)}</div></div>`).join('')}
    <h4>${L.b}</h4>${T.st.map(q => q.parts.map((p, i) => `<div class="a"><b>${i ? '' : pad(q.n)} (${alpha[i]})</b><div>${t(p.a)}</div></div>`).join('')).join('')}</div>`;

  document.body.innerHTML = bar + cover + `<main class="sheet ${ed}">${notes}${exs}${sum}${stu ? '' : ans}</main>`;
  // white plates behind centred figure labels (text outlines print badly), sized after the fonts load
  document.fonts.ready.then(() => document.querySelectorAll('text.plate').forEach(t => {
    const b = t.getBBox(), p = b.height * .16, r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    Object.entries({ x: b.x - p * 1.4, y: b.y + p * .4, width: b.width + p * 2.8, height: b.height - p * .2, fill: '#fff', opacity: .88 }).forEach(([k, v]) => r.setAttribute(k, v));
    t.parentNode.insertBefore(r, t);
  }));
})();
