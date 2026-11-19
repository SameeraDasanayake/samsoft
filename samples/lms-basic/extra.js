/* Samsoft sample LMS: Medium (online papers, results) and Advanced (games, typing, lab, rewards) student views. */
(function () {
  const { $, $$, L, toast, views } = LMS;
  const si = () => LMS.root.dataset.lang === 'si';
  const vh = (eb, a, b, right = '') => `<div class="vh"><div><p class="eyebrow">${eb}</p><h2>${L(a, b)}</h2></div>${right}</div>`;
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  const stars = n => '⭐'.repeat(n) + '<i class="st0">' + '☆'.repeat(3 - n) + '</i>';
  let played = 1;

  /* ================= ONLINE PAPERS (medium) ================= */
  const QZ = [
    [['ජාල දෙකක් අතර දත්ත යොමු කරන උපාංගය කුමක්ද?', 'Which device forwards data between two networks?'], ['Router', 'Switch', 'Hub', 'Repeater'], 0],
    [['IPv4 ලිපිනයක බිටු ගණන කීයද?', 'How many bits are in an IPv4 address?'], ['16', '32', '64', '128'], 1],
    [['LAN එකක සියලු නෝඩ මධ්‍ය උපාංගයකට සම්බන්ධ ස්ථලකය කුමක්ද?', 'In which topology do all nodes connect to one central device?'], ['Bus', 'Ring', 'Star', 'Mesh'], 2],
    [['වෙබ් පිටු ලබාගැනීමට භාවිත වන protocol එක කුමක්ද?', 'Which protocol is used to fetch web pages?'], ['FTP', 'SMTP', 'HTTP', 'DHCP'], 2],
    [['192.168.1.0/24 ජාලයක භාවිත කළ හැකි ධාරක ගණන?', 'Usable hosts in a 192.168.1.0/24 network?'], ['254', '256', '128', '255'], 0]
  ];
  views.papers = el => {
    el.innerHTML = vh('Online papers', 'Online MCQ papers', 'Online MCQ papers') + `
    <div class="live-p glass-dark"><div><em class="live">LIVE</em><h3>Paper 09 · ${L('ජාල සහ අන්තර්ජාලය', 'Networks and the Internet')}</h3>
      <p>${L('ප්‍රශ්න 5 · විනාඩි 10 · අද රෑ 10.00 දක්වා විවෘතයි. ඉවර වුණු ගමන් ලකුණු සහ පන්තියේ ස්ථානය.', '5 questions · 10 minutes · open until 10.00 pm. Marks and class rank as soon as you finish.')}</p>
      <button class="btn lime" id="startP">✎ ${L('Paper එක පටන් ගන්න', 'Start the paper')}</button></div><div class="clock">⏱<b>10:00</b></div></div>
    <div class="ph" style="margin:22px 0 12px"><h3>${L('කලින් papers', 'Earlier papers')}</h3></div>
    <div class="plist">${[['Paper 08', 'IP ලිපින', 'IP addresses', 88, 5], ['Paper 07', 'දත්ත සන්නිවේදනය', 'Data communication', 92, 3], ['Paper 06', 'Spreadsheets', 'Spreadsheets', 76, 14], ['Paper 05', 'Python loops', 'Python loops', 84, 8]]
      .map(([n, a, b, m, r]) => `<div class="pl glass"><span class="ring-s" style="--v:${m}"><b>${m}</b></span><span><b>${n} · ${L(a, b)}</b><small>${L(`පන්තියේ ස්ථානය #${r} / 131`, `Class rank #${r} / 131`)}</small></span><button class="mini" data-review>${L('පිළිතුරු බලන්න', 'Review')}</button></div>`).join('')}</div>`;
    el.querySelector('#startP').onclick = paper;
    el.querySelectorAll('[data-review]').forEach(b => b.onclick = () => toast(L('ආදර්ශයක්: සැබෑ LMS එකේ නිවැරදි පිළිතුරු සහ විවරණ පේනවා.', 'Sample: a real LMS shows the right answers with explanations.')));
  };
  function paper() {
    let i = 0, ans = [], left = 600;
    const sh = LMS.sheet(`<div class="pp-top"><b>Paper 09</b><div class="dots" id="dots">${QZ.map(() => '<i></i>').join('')}</div><span class="clk" id="clk">10:00</span></div><div id="pq"></div>`, true);
    const clk = setInterval(() => { left--; const c = sh.querySelector('#clk'); if (c) c.textContent = `${String(left / 60 | 0).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`; }, 1000);
    LMS.onClose = () => clearInterval(clk);
    const draw = () => {
      const [q, o] = QZ[i];
      sh.querySelectorAll('#dots i').forEach((d, k) => d.className = k < i ? 'd' : k === i ? 'c' : '');
      sh.querySelector('#pq').innerHTML = `<p class="qn">${L('ප්‍රශ්නය', 'Question')} ${i + 1} / ${QZ.length}</p><h3 class="qt">${L(q[0], q[1])}</h3>
        <div class="qo">${o.map((x, k) => `<button data-o="${k}" class="${ans[i] === k ? 'sel' : ''}"><i>${k + 1}</i>${x}</button>`).join('')}</div>
        <div class="qnav"><button class="btn ghost-d" id="prv" ${i ? '' : 'disabled'}>← ${L('කලින්', 'Back')}</button><button class="btn grad sm" id="nxt" ${ans[i] == null ? 'disabled' : ''}>${i === QZ.length - 1 ? L('ඉදිරිපත් කරන්න ✓', 'Submit ✓') : L('ඊළඟ →', 'Next →')}</button></div>`;
      sh.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { ans[i] = +b.dataset.o; draw(); });
      sh.querySelector('#prv').onclick = () => { i--; draw(); };
      sh.querySelector('#nxt').onclick = () => { if (i < QZ.length - 1) { i++; draw(); } else done(); };
    };
    const done = () => {
      clearInterval(clk);
      const ok = QZ.filter((q, k) => ans[k] === q[2]).length, pc = ok / QZ.length * 100, rank = [131, 98, 64, 27, 9, 2][ok];
      sh.innerHTML = `<button class="sh-x" data-close>✕</button><div class="res-p"><div class="big-ring" style="--v:${pc}"><b>${pc}%</b></div>
        <h3>${pc >= 80 ? L('නියමයි! 🎉', 'Excellent! 🎉') : pc >= 50 ? L('හොඳයි! 👍', 'Good work! 👍') : L('තව ටිකක් පුරුදු වෙමු 💪', 'Keep practising 💪')}</h3>
        <p>${L(`ප්‍රශ්න ${QZ.length}න් ${ok}ක් නිවැරදියි · පන්තියේ ස්ථානය <b>#${rank}</b> / 131`, `${ok} of ${QZ.length} correct · class rank <b>#${rank}</b> / 131`)}</p>
        <div class="rev">${QZ.map((q, k) => `<div class="${ans[k] === q[2] ? 'y' : 'n'}"><i>${ans[k] === q[2] ? '✓' : '✕'}</i><span>${L(q[0][0], q[0][1])}<small>${L('නිවැරදි පිළිතුර', 'Answer')}: ${q[1][q[2]]}</small></span></div>`).join('')}</div>
        <button class="btn grad" data-close>${L('හරි', 'OK')}</button></div>`;
      if (LMS.pk() >= 2 && pc >= 80) LMS.addPoints(30);
    };
    draw();
  }

  /* ================= RESULTS (medium) ================= */
  views.results = el => {
    const me = [64, 71, 69, 80, 84, 76, 92, 88], cls = [58, 62, 60, 66, 70, 68, 76, 71];
    const W = 640, H = 220, x = i => 40 + i * (W - 60) / 7, y = v => H - 30 - (v - 40) / 60 * (H - 50);
    const line = a => a.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('');
    el.innerHTML = vh(L('ප්‍රතිඵල', 'Results'), 'මගේ ප්‍රතිඵල', 'My results') + `
    <div class="stats"><div class="stat glass"><i>✎</i><b>78%</b><small>${L('මගේ සාමාන්‍යය', 'my average')}</small></div><div class="stat glass"><i>🏆</i><b>#7</b><small>${L('පන්තියේ ස්ථානය', 'class rank')}</small></div>
      <div class="stat glass"><i>⬆</i><b>92%</b><small>${L('හොඳම ලකුණ', 'best mark')}</small></div><div class="stat glass"><i>📈</i><b>+24</b><small>${L('Paper 1 සිට දියුණුව', 'up since paper 1')}</small></div></div>
    <div class="panel glass"><div class="ph"><h3>${L('Paper එකෙන් paper එකට', 'Paper by paper')}</h3><span class="lgd"><i class="me"></i>${L('මම', 'Me')} <i class="cl"></i>${L('පන්තියේ සාමාන්‍යය', 'Class average')}</span></div>
      <svg class="chart" viewBox="0 0 ${W} ${H}">${[40, 60, 80, 100].map(v => `<line x1="30" x2="${W - 10}" y1="${y(v)}" y2="${y(v)}"/><text x="4" y="${y(v) + 4}">${v}</text>`).join('')}
        <path class="cl" d="${line(cls)}"/><path class="me" d="${line(me)}" pathLength="1"/>${me.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="5"><title>P0${i + 1}: ${v}%</title></circle><text class="xl" x="${x(i)}" y="${H - 8}">P0${i + 1}</text>`).join('')}</svg></div>
    <div class="panel glass"><div class="ph"><h3>${L('දුර්වල කොටස්', 'Weak areas')}</h3></div>
      <div class="qbars">${[['උපජාල ගණනය', 'Subnetting', 54], ['Python loops', 'Python loops', 68], ['Spreadsheet සූත්‍ර', 'Spreadsheet formulas', 81], ['තර්ක ද්වාර', 'Logic gates', 93]].map(([a, b, v]) => `<div class="${v < 60 ? 'hard' : ''}"><small>${L(a, b)}</small><i><b style="--w:${v}%"></b></i><span>${v}%</span></div>`).join('')}</div></div>`;
  };

  /* ================= GAMES HUB (advanced) ================= */
  const BEST = { quiz: 2, match: 3, binary: 1 };
  views.games = el => {
    el.innerHTML = vh('Games Hub', 'ඉගෙන ගනිමින් සෙල්ලම් කරමු', 'Play while you learn', `<span class="pts big">🪙 ${LMS.pts.toLocaleString('en')}</span>`) + `
    <div class="games">${[['quiz', '⚡', 'Quiz Challenge', 'Quiz Challenge', 'ඉක්මනට උත්තර දුන්නොත් වැඩි ලකුණු', 'Faster answers score more', '#6a5cff,#22c3ee'],
      ['match', '🧩', 'ගළපන්න', 'Match it', 'වචනය සහ තේරුම ගළපන්න', 'Match each word to its meaning', '#f472b6,#a855f7'],
      ['binary', '💡', 'Binary Builder', 'Binary Builder', 'බල්බ දල්වා අංකය හදන්න', 'Switch bulbs on to build the number', '#f59e0b,#ef4444']]
      .map(([k, i, a, b, c, d, col]) => `<button class="game" data-game="${k}" style="--g:${col}"><span class="gi">${i}</span><b>${L(a, b)}</b><small>${L(c, d)}</small><span class="gs">${stars(BEST[k])}</span><em>▶ ${L('සෙල්ලම් කරන්න', 'Play')}</em></button>`).join('')}
      <div class="game soon"><span class="gi">🧠</span><b>${L('පිළිවෙලට තියන්න', 'Put in order')}</b><small>${L('සෑම පාඩමකටම games 5–10ක්', '5–10 games for every lesson')}</small><em>${L('ඔබේ පාඩම් වලින් හදනවා', 'built from your lessons')}</em></div></div>`;
    el.querySelectorAll('[data-game]').forEach(b => b.onclick = () => GAME[b.dataset.game]());
  };
  const finish = (k, st, pts) => { played++; BEST[k] = Math.max(BEST[k], st); if (pts) LMS.addPoints(pts); };
  const GAME = {
    quiz() {
      let i = 0, score = 0, ok = 0, t = 15, tm;
      const sh = LMS.sheet(`<div class="g-top"><b>⚡ Quiz Challenge</b><span class="gsc">🏅 <b id="gs">0</b></span></div><div class="tbar"><i id="tb"></i></div><div id="gq"></div>`, true);
      LMS.onClose = () => clearInterval(tm);
      const next = () => {
        if (i >= QZ.length) { clearInterval(tm); const st = ok >= 5 ? 3 : ok >= 4 ? 2 : ok >= 2 ? 1 : 0;
          sh.querySelector('#gq').innerHTML = `<div class="g-end"><div class="gst">${stars(st)}</div><h3>${score} ${L('ලකුණු', 'points')}</h3><p>${L(`ප්‍රශ්න ${QZ.length}න් ${ok}ක් නිවැරදියි`, `${ok} of ${QZ.length} correct`)}</p><button class="btn grad" data-close>${L('හරි', 'Done')}</button></div>`;
          finish('quiz', st, st === 3 ? 5 : 0); return; }
        t = 15; const [q, o, c] = QZ[i];
        sh.querySelector('#gq').innerHTML = `<p class="qn">${i + 1} / ${QZ.length}</p><h3 class="qt">${L(q[0], q[1])}</h3><div class="qo g4">${o.map((x, k) => `<button data-o="${k}" style="--c:${['#6a5cff', '#22c3ee', '#f472b6', '#f59e0b'][k]}">${x}</button>`).join('')}</div>`;
        sh.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { clearInterval(tm); const right = +b.dataset.o === c;
          b.classList.add(right ? 'right' : 'wrong'); sh.querySelector(`[data-o="${c}"]`).classList.add('right'); sh.querySelectorAll('[data-o]').forEach(x => x.disabled = true);
          if (right) { ok++; score += 100 + t * 10; sh.querySelector('#gs').textContent = score; }
          setTimeout(() => { i++; next(); }, 900); });
        clearInterval(tm); const tb = sh.querySelector('#tb'); tb.style.width = '100%';
        tm = setInterval(() => { t = Math.max(0, t - .1); tb.style.width = (t / 15 * 100) + '%'; tb.classList.toggle('low', t < 5); if (t <= 0) { clearInterval(tm); i++; next(); } }, 100);
      };
      next();
    },
    match() {
      const P = [['Router', 'ජාල අතර දත්ත යොමු කරයි', 'Forwards data between networks'], ['Switch', 'LAN එකේ නෝඩ සම්බන්ධ කරයි', 'Joins the nodes of a LAN'], ['IP address', 'උපාංගයක ජාල ලිපිනය', 'A device\'s network address'],
        ['MAC address', 'NIC එකේ ස්ථිර ලිපිනය', 'The fixed address of a NIC'], ['Bandwidth', 'තත්පරයකට යැවිය හැකි දත්ත', 'Data that can be sent per second']];
      let pick = null, done = 0, miss = 0;
      const R = shuffle(P.map((p, i) => i));
      const sh = LMS.sheet(`<div class="g-top"><b>🧩 ${L('ගළපන්න', 'Match it')}</b><span class="gsc">✕ <b id="mm">0</b></span></div><p class="muted">${L('වම් පැත්තේ වචනයක් ඔබලා, දකුණු පැත්තේ ඒකේ තේරුම ඔබන්න.', 'Tap a word on the left, then its meaning on the right.')}</p>
        <div class="mt"><div>${P.map((p, i) => `<button data-l="${i}">${p[0]}</button>`).join('')}</div><div>${R.map(i => `<button data-r="${i}">${L(P[i][1], P[i][2])}</button>`).join('')}</div></div><div id="mend"></div>`, true);
      sh.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { if (b.classList.contains('ok')) return; sh.querySelectorAll('[data-l]').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); pick = +b.dataset.l; });
      sh.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { if (pick == null || b.classList.contains('ok')) return;
        if (+b.dataset.r === pick) { b.classList.add('ok'); sh.querySelector(`[data-l="${pick}"]`).classList.add('ok'); sh.querySelector(`[data-l="${pick}"]`).classList.remove('sel'); pick = null; done++;
          if (done === P.length) { const st = miss === 0 ? 3 : miss <= 2 ? 2 : 1; sh.querySelector('#mend').innerHTML = `<div class="g-end"><div class="gst">${stars(st)}</div><h3>${L('ඔක්කොම ගැළපුවා!', 'All matched!')}</h3><button class="btn grad" data-close>${L('හරි', 'Done')}</button></div>`; finish('match', st, st === 3 ? 5 : 0); } }
        else { miss++; sh.querySelector('#mm').textContent = miss; b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); } });
    },
    binary() {
      const T = [5, 12, 37, 200]; let r = 0, bits = Array(8).fill(0);
      const sh = LMS.sheet(`<div class="g-top"><b>💡 Binary Builder</b><span class="gsc">${L('වටය', 'Round')} <b id="br">1</b>/4</span></div><div id="bb"></div>`, true);
      const draw = () => { const v = bits.reduce((a, b, i) => a + b * (128 >> i), 0);
        sh.querySelector('#bb').innerHTML = `<p class="muted">${L('බල්බ දල්වලා මේ අංකය හදන්න:', 'Switch bulbs on to make this number:')}</p><div class="btarget">${T[r]}</div>
          <div class="bulbs">${bits.map((b, i) => `<button class="bulb${b ? ' on' : ''}" data-b="${i}"><i></i><b>${b}</b><small>${128 >> i}</small></button>`).join('')}</div>
          <div class="bval ${v === T[r] ? 'ok' : ''}">= ${v}</div>`;
        sh.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { bits[+b.dataset.b] ^= 1; draw(); });
        if (v === T[r]) { setTimeout(() => { r++; bits = Array(8).fill(0);
          if (r === T.length) { sh.querySelector('#bb').innerHTML = `<div class="g-end"><div class="gst">${stars(3)}</div><h3>${L('ඔබ binary master කෙනෙක්!', 'You are a binary master!')}</h3><button class="btn grad" data-close>${L('හරි', 'Done')}</button></div>`; finish('binary', 3, 5); }
          else { sh.querySelector('#br').textContent = r + 1; draw(); } }, 700); } };
      draw();
    }
  };

  /* ================= TYPING (advanced) ================= */
  views.typing = el => {
    const TX = 'the router sends data to the right network';
    let pos = 0, err = 0, t0 = 0;
    const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    el.innerHTML = vh('SANDS Typing', 'Typing පාඩම් සහ සහතික', 'Typing lessons and certificates') + `
    <div class="ty-units">${[['Home row', 3], ['Top row', 3], ['Bottom row', 2], ['Shift', 1], ['Numbers', 0], ['Sentences', 0]].map(([u, s], i) => `<div class="tu glass${i === 2 ? ' cur' : ''}"><small>Unit ${i + 1}</small><b>${u}</b><span>${s ? stars(s) : '🔒'}</span></div>`).join('')}</div>
    <div class="panel glass typer"><div class="ph"><h3>Unit 3 · ${L('වාක්‍ය පුහුණුව', 'Sentence practice')}</h3><span class="tystat"><b id="wpm">0</b> WPM · <b id="acc">100</b>%</span></div>
      <div class="ty-text" id="tyt" tabindex="0">${[...TX].map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div>
      <p class="tip">⌨ ${L('මෙතන click කරලා type කරන්න පටන් ගන්න.', 'Click here and start typing.')}</p>
      <div class="kb">${rows.map(r => `<div>${[...r].map(k => `<span data-k="${k}">${k}</span>`).join('')}</div>`).join('')}<div><span data-k=" " class="space">space</span></div></div></div>`;
    const box = el.querySelector('#tyt'), sp = [...box.children];
    const mark = () => { sp.forEach((s, i) => s.className = i < pos ? 'ok' : i === pos ? 'cur' : ''); el.querySelectorAll('.kb span').forEach(k => k.classList.toggle('next', k.dataset.k === TX[pos])); };
    mark(); box.focus();
    box.onclick = () => box.focus();
    box.onkeydown = e => { if (e.key.length !== 1 || pos >= TX.length) return; e.preventDefault(); if (!t0) t0 = performance.now();
      if (e.key === TX[pos]) pos++; else { err++; sp[pos].classList.add('bad'); setTimeout(mark, 150); }
      const min = (performance.now() - t0) / 60000; el.querySelector('#wpm').textContent = Math.round(pos / 5 / Math.max(min, 1 / 60));
      el.querySelector('#acc').textContent = Math.round(pos / (pos + err) * 100) || 100; mark();
      if (pos === TX.length) { toast(L('🎉 පාඩම ඉවරයි!', '🎉 Lesson done!')); LMS.addPoints(3); } };
  };

  /* ================= PRACTICAL LAB (advanced) ================= */
  views.lab = el => {
    el.innerHTML = vh('Practical Lab', 'ගෙදර ඉඳන් practicals', 'Practicals from home') + `
    <div class="labs">${[['🐍', 'Python Lab'], ['🌐', 'HTML Studio'], ['🔌', 'Logic Lab'], ['🎨', 'Paint'], ['🧮', 'Number Lab'], ['🤖', 'Circuit Lab']].map(([i, n], k) => `<div class="lab glass${k === 1 || k === 2 ? ' on' : ''}"><i>${i}</i><b>${n}</b></div>`).join('')}</div>
    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>🌐 HTML Studio</h3><span class="muted">${L('type කරනකොටම ප්‍රතිඵලය', 'live as you type')}</span></div>
        <div class="html-lab"><textarea id="code" spellcheck="false">&lt;h1 style="color:#6a5cff"&gt;මගේ පළමු වෙබ් පිටුව&lt;/h1&gt;
&lt;p&gt;මම &lt;b&gt;HTML&lt;/b&gt; ඉගෙන ගන්නවා!&lt;/p&gt;
&lt;button onclick="this.innerText='👍'"&gt;Click me&lt;/button&gt;</textarea><iframe id="out" title="preview" sandbox="allow-scripts"></iframe></div></div>
      <div class="panel glass"><div class="ph"><h3>🔌 Logic Lab</h3><div class="tabs" id="gate"><button aria-pressed="true" data-g="AND">AND</button><button data-g="OR">OR</button><button data-g="XOR">XOR</button></div></div>
        <div class="logic"><div class="ins"><button class="lsw" data-in="0">A = <b>0</b></button><button class="lsw" data-in="1">B = <b>0</b></button></div>
          <div class="gatebox" id="gbox">AND</div><div class="lamp" id="lamp">💡<b>0</b></div></div>
        <table class="tt" id="tt"></table></div>
    </div>`;
    const code = el.querySelector('#code'), out = el.querySelector('#out');
    const run = () => out.srcdoc = `<meta charset="utf-8"><body style="font-family:'Noto Sans Sinhala',sans-serif;padding:14px">${code.value}</body>`;
    code.oninput = run; run();
    let A = 0, B = 0, G = 'AND';
    const f = (a, b) => G === 'AND' ? a & b : G === 'OR' ? a | b : a ^ b;
    const draw = () => { const o = f(A, B); el.querySelectorAll('.lsw').forEach((s, i) => { const v = i ? B : A; s.classList.toggle('on', !!v); s.querySelector('b').textContent = v; });
      el.querySelector('#gbox').textContent = G; const l = el.querySelector('#lamp'); l.classList.toggle('on', !!o); l.querySelector('b').textContent = o;
      el.querySelector('#tt').innerHTML = '<tr><th>A</th><th>B</th><th>Q</th></tr>' + [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => `<tr class="${a === A && b === B ? 'cur' : ''}"><td>${a}</td><td>${b}</td><td>${f(a, b)}</td></tr>`).join(''); };
    el.querySelectorAll('.lsw').forEach(s => s.onclick = () => { if (s.dataset.in === '0') A ^= 1; else B ^= 1; draw(); });
    el.querySelectorAll('#gate button').forEach(b => b.onclick = () => { G = b.dataset.g; el.querySelectorAll('#gate button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
    draw();
  };

  /* ================= REWARDS (advanced) ================= */
  const MIS = () => [['▶', 'Recording එකක් බලන්න', 'Watch a recording', 1, 1, 10], ['🎮', 'Games 3ක් සෙල්ලම් කරන්න', 'Play 3 games', Math.min(played, 3), 3, 15], ['⌨', 'Typing පාඩමක් කරන්න', 'Do a typing lesson', 0, 1, 10]];
  LMS.drawMissions = box => { if (!box) return; box.innerHTML = MIS().map(([i, a, b, d, n, p]) => `<div class="ms${d >= n ? ' done' : ''}"><i>${d >= n ? '✓' : i}</i><span><b>${L(a, b)}</b><i class="msb"><b style="width:${d / n * 100}%"></b></i></span><em>🪙 ${p}</em></div>`).join(''); };
  views.rewards = el => {
    const lvl = 7, next = 1500;
    el.innerHTML = vh(L('ත්‍යාග', 'Rewards'), 'ත්‍යාග සහ leaderboard', 'Rewards and leaderboard') + `
    <div class="rw-hero glass-dark"><div><small>${L('මගේ ලකුණු', 'My points')}</small><b class="rw-pts">🪙 ${LMS.pts.toLocaleString('en')}</b>
      <span>Level ${lvl} · ${L(`ඊළඟ level එකට ${Math.max(0, next - LMS.pts)}යි`, `${Math.max(0, next - LMS.pts)} to the next level`)}</span><i class="lv"><b style="width:${Math.min(100, LMS.pts / next * 100)}%"></b></i></div>
      <div class="streak">🔥<b>12</b><small>${L('දින streak', 'day streak')}</small></div></div>
    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>${L('අද දවසේ missions', "Today's missions")}</h3></div><div class="missions" id="missionsR"></div>
        <div class="ph" style="margin-top:20px"><h3>${L('Badges', 'Badges')}</h3></div>
        <div class="badges">${[['🎯', 'Paper 90%+', 1], ['🔥', '7-day streak', 1], ['⚡', 'Quiz king', 1], ['⌨', '30 WPM', 1], ['🧠', 'All lessons', 0], ['🏆', 'Top 3', 0], ['💡', 'Binary master', 0], ['🤝', 'Bring a friend', 0]].map(([i, n, h]) => `<div class="bdg${h ? '' : ' no'}"><i>${i}</i><small>${n}</small></div>`).join('')}</div></div>
      <div class="panel glass"><div class="ph"><h3>🏆 ${L('සතියේ leaderboard · 11 ශ්‍රේණිය', 'Weekly leaderboard · Grade 11')}</h3></div>
        <div class="ulist lb">${[['ධනුෂ්ක', 'Dhanushka', 1610], ['නෙත්මි', 'Nethmi', 1475], ['දිල්මි', 'Dilmi', 1330], ['සෙනුරි (ඔබ)', 'Senuri (you)', LMS.pts, 1], ['හිරුණි', 'Hiruni', 1210], ['සචින්', 'Sachin', 1100]]
          .sort((a, b) => b[2] - a[2]).map(([a, b, p, me], i) => `<div class="urow${me ? ' me' : ''}"><span class="rk">${['🥇', '🥈', '🥉'][i] || i + 1}</span><span><b>${L(a, b)}</b></span><em class="paid">🪙 ${p.toLocaleString('en')}</em></div>`).join('')}</div>
        <div class="ph" style="margin-top:20px"><h3>🎁 ${L('ත්‍යාග', 'Gifts')}</h3></div>
        <div class="gifts">${[['📘', 'පොතක්', 'A book', 500], ['👕', 'පන්තියේ T-shirt', 'Class T-shirt', 1000], ['🎟', 'නොමිලේ මාසයක්', 'A free month', 3000]].map(([i, a, b, c]) => `<div class="gift"><i>${i}</i><b>${L(a, b)}</b><small>🪙 ${c.toLocaleString('en')}</small><button class="mini ${LMS.pts >= c ? 'ok' : ''}" data-redeem="${c}">${LMS.pts >= c ? L('ලබා ගන්න', 'Redeem') : '🔒'}</button></div>`).join('')}</div></div>
    </div>`;
    LMS.drawMissions(el.querySelector('#missionsR'));
    el.querySelectorAll('[data-redeem]').forEach(b => b.onclick = () => toast(LMS.pts >= +b.dataset.redeem ? L('🎁 ඉල්ලීම ගුරුතුමාට යැව්වා!', '🎁 Request sent to the teacher!') : L('තව ලකුණු ඕනේ. Games සහ papers කරන්න!', 'You need more points. Play games and do papers!')));
  };

  LMS.start();
})();
