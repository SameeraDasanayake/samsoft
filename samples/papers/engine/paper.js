/* Samsoft papers — renders window.PAPER as a print paper (?part=paper) or its marking scheme (?part=scheme).
   Plain script (no modules / fetch) so it also works when opened by double-click. */
(function () {
  const P = window.PAPER, qs = new URLSearchParams(location.search);
  const lang = qs.get('lang') === 'si' ? 'si' : 'en', part = qs.get('part') === 'scheme' ? 'scheme' : 'paper';
  const t = x => x == null ? '' : typeof x === 'string' || typeof x === 'number' ? String(x) : (x[lang] ?? x.en);
  const L = {
    en: { time: 'Time', marks: 'Marks', qn: 'Questions', grade: 'Grade', name: 'Name', ix: 'Index No.', instr: 'Instructions',
      scheme: 'Marking scheme', key: 'Answer key', m: n => `(${n})`, mm: n => `${n} ${n == 1 ? 'mark' : 'marks'}`, tot: 'Total',
      end: 'END', conf: 'For teachers', paper: 'Paper', pdf: 'PDF' },
    si: { time: 'කාලය', marks: 'ලකුණු', qn: 'ප්‍රශ්න', grade: 'ශ්‍රේණිය', name: 'නම', ix: 'විභාග අංකය', instr: 'උපදෙස්',
      scheme: 'ලකුණු දීමේ පටිපාටිය', key: 'පිළිතුරු', m: n => `(${n})`, mm: n => `ලකුණු ${n}`, tot: 'එකතුව',
      end: 'END', conf: 'ගුරුවරුන් සඳහා', paper: 'ප්‍රශ්න පත්‍රය', pdf: 'PDF' }
  }[lang];
  const pad = n => String(n).padStart(2, '0');
  const plain = h => h.replace(/<[^>]+>/g, '').replace(/&\w+;/g, 'x');
  const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi'], alpha = 'abcdefgh';
  const fig = f => f ? `<div class="fig ${f.left ? '' : 'c'}">${t(f.svg ?? f)}</div>` : '';
  const lines = n => n ? `<div class="lines">${'<i></i>'.repeat(n)}</div>` : '';
  const ansArea = q => (q.box ? [].concat(q.box).map(b => `<div class="ansbox"><i></i><span>${t(b)}</span></div>`).join(' ') : '') + lines(q.lines) +
    (q.space ? `<span class="space" style="height:${q.space}mm"></span>` : '');

  document.documentElement.lang = lang;
  document.documentElement.style.setProperty('--ac', P.accent);
  document.title = `${t(P.subject)} — ${part === 'scheme' ? L.scheme : L.paper} (${lang.toUpperCase()})`;

  // ---------- numbering ----------
  let n = 0; P.parts.forEach(s => s.qs.forEach(q => q.n = ++n));

  // ---------- paper ----------
  function optsHtml(q) {
    const o = q.opts.map(t), len = Math.max(...o.map(x => plain(x).length));
    const c = q.cols || (len <= 12 ? 4 : len <= 34 ? 2 : 1);
    return `<ol class="opts c${c}">${o.map((x, i) => `<li><span>(${i + 1})</span><span>${x}</span></li>`).join('')}</ol>`;
  }
  function subParts(ps, lvl, off = 0) {
    return ps.map((p, i) => `<div class="qp"><span class="pl">(${lvl ? roman[i + off] : alpha[i + off]})</span><div>${t(p.q) ? `<p>${t(p.q)}</p>` : ''}${fig(p.fig)}${
      p.parts ? subParts(p.parts, lvl + 1) : ansArea(p)}</div><span class="mkr">${p.m ? L.m(p.m) : ''}</span></div>`).join('');
  }
  function qHtml(q) {
    const head = `<span class="qn">${pad(q.n)}</span>`;
    if (q.t === 'mcq') return `<div class="q">${head}<div class="qb"><p>${t(q.q)}</p>${fig(q.fig)}${optsHtml(q)}</div><span class="abox"></span></div>`;
    if (q.t === 'short') return `<div class="q">${head}<div class="qb"><p>${t(q.q)}</p>${fig(q.fig)}${ansArea(q)}</div><span class="mkr">${L.m(q.m)}</span></div>`;
    const row = (p, i, n) => `<div class="q stp${i === n - 1 ? ' last' : ''}"><span></span><div class="qb">${subParts([p], 0, i)}</div><span></span></div>`;
    return `<div class="keep"><div class="q st">${head}<div class="qb">${t(q.q) ? `<div>${t(q.q)}</div>` : ''}${fig(q.fig)}</div><span></span></div>${row(q.parts[0], 0, q.parts.length)}</div>` +
      q.parts.slice(1).map((p, i) => row(p, i + 1, q.parts.length)).join('');
  }

  // ---------- scheme ----------
  const sum = ps => ps.reduce((a, p) => a + (p.parts ? sum(p.parts) : p.m || 0), 0);
  function subAns(ps, lvl) {
    return ps.map((p, i) => `<div class="qp"><span class="pl">(${lvl ? roman[i] : alpha[i]})</span><div>${
      p.parts ? subAns(p.parts, lvl + 1) : `<div class="ans">${t(p.a)}</div>${p.why ? `<div class="why">${t(p.why)}</div>` : ''}${fig(p.afig)}`
    }</div><span class="mkr">${p.parts ? '' : L.m(p.m)}</span></div>`).join('');
  }
  function schemePart(s) {
    if (s.qs[0].t === 'mcq') {
      const why = s.qs.filter(q => q.why);
      return `<div class="key">${s.qs.map(q => `<div>${pad(q.n)}<b>${q.a}</b></div>`).join('')}</div>` +
        (why.length ? `<div style="margin-top:6px">${why.map(q => `<div class="sa"><span class="qn">${pad(q.n)}</span><div class="why">(${q.a}) — ${t(q.why)}</div><span></span></div>`).join('')}</div>` : '');
    }
    return s.qs.map(q => q.t === 'short'
      ? `<div class="sa"><span class="qn">${pad(q.n)}</span><div><div class="ans">${t(q.a)}</div>${q.why ? `<div class="why">${t(q.why)}</div>` : ''}${fig(q.afig)}</div><span class="mkr">${L.m(q.m)}</span></div>`
      : `<div class="sa"><span class="qn">${pad(q.n)}</span><div>${subAns(q.parts, 0)}<div class="tot"><span>${L.tot}</span><span>${sum(q.parts)}</span></div></div><span></span></div>`
    ).join('');
  }

  // ---------- page ----------
  const self = location.pathname.split('/').slice(-2, -1)[0];
  const link = (l, p) => `?lang=${l}&part=${p}`;
  const bar = `<nav class="bar noprint"><a href="../index.html">← ${lang === 'si' ? 'පත්‍ර' : 'Papers'}</a><span class="sp"></span>
    <span class="grp"><a class="${lang === 'en' ? 'on' : ''}" href="${link('en', part)}">English</a><a class="${lang === 'si' ? 'on' : ''}" href="${link('si', part)}">සිංහල</a></span>
    <span class="grp"><a class="${part === 'paper' ? 'on' : ''}" href="${link(lang, 'paper')}">${L.paper}</a><a class="${part === 'scheme' ? 'on' : ''}" href="${link(lang, 'scheme')}">${L.scheme}</a></span>
    <a href="${part === 'scheme' ? `${self}-scheme` : `${self}-${lang}`}.pdf">${L.pdf} ↓</a></nav>`;

  const meta = `<div class="meta"><div><b>${L.grade}</b>${t(P.grade)}</div><div><b>${L.time}</b>${t(P.time)}</div><div><b>${L.marks}</b>${P.marks}</div><div><b>${L.qn}</b>${n}</div><div></div></div>`;
  const mast = `<header class="mast"><div class="mast-top"><span>${t(P.inst)}</span><span class="code">${P.code}${part === 'scheme' ? ' · MS' : ''}</span></div>
    <h1>${t(P.subject)}${part === 'scheme' ? `<span class="stamp">${L.conf}</span>` : ''}</h1><div class="sub">${t(P.title)}${part === 'scheme' ? ' — ' + L.scheme : ''}</div>${meta}
    ${part === 'paper' ? `<div class="cand"><div class="nm">${L.name}<span></span></div><div class="ix">${L.ix}<span>${'<i></i>'.repeat(7)}</span></div></div>` : ''}</header>`;
  const instr = part === 'paper' && P.instr ? `<div class="instr"><b>${L.instr}</b><ol>${P.instr.map(i => `<li>${t(i)}</li>`).join('')}</ol></div>` : '';

  const body = P.parts.map(s => `<section class="part"><h2><span>${t(s.h)}</span><span class="note">${part === 'paper' ? t(s.note) : ''}</span><span class="mk">${t(s.mk)}</span></h2>${
    part === 'paper' ? s.qs.map(qHtml).join('') : schemePart(s)}</section>`).join('');

  document.body.innerHTML = bar + `<main class="sheet">${mast}${instr}${body}<div class="end">${L.end}</div></main>`;
})();
