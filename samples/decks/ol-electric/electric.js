/* O/L Science · Electricity deck — every figure is drawn here (no 3D files), so it also works from disk.
   Cover circuit, circuit symbols, series/parallel builder, Ohm's law graph, resistor calculator, electricity bill, fuse. */
(function () {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const tr = (en, si) => `<span lang="en">${en}</span><span lang="si">${si}</span>`;
  const slideOf = el => el.closest('.slide');
  const f1 = n => (Math.round(n * 10) / 10).toFixed(1), f2 = n => (Math.round(n * 100) / 100).toFixed(2);
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- 1. cover: charges running round the loop ---------- */
  {
    const p = $('#cvLoop'), g = $('#cvDots'), L = p.getTotalLength(), N = 18;
    for (let i = 0; i < N; i++) { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 6); c.setAttribute('class', 'e'); g.appendChild(c); }
    const dots = [...g.children]; let t0 = performance.now(), raf = 0;
    const run = now => { const s = (now - t0) / 1000 * 90; dots.forEach((c, i) => { const q = p.getPointAtLength((s + i * L / N) % L); c.setAttribute('cx', q.x); c.setAttribute('cy', q.y); }); raf = requestAnimationFrame(run); };
    const sl = slideOf(p); sl.addEventListener('slide:enter', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(run); });
    sl.addEventListener('slide:leave', () => cancelAnimationFrame(raf));
    if (sl.classList.contains('on')) raf = requestAnimationFrame(run);
  }

  /* ---------- 3. symbols ---------- */
  {
    const W = 'class="sw2"';
    const S = [
      [tr('Cell', 'කෝෂය'), `<path ${W} d="M10 40 H60 M90 40 H140"/><path ${W} d="M60 18 V62" style="stroke-width:4"/><path ${W} d="M90 28 V52" style="stroke-width:8"/>`],
      [tr('Battery', 'බැටරිය'), `<path ${W} d="M5 40 H40 M110 40 H145"/><path ${W} d="M40 18 V62 M70 18 V62"/><path ${W} d="M55 28 V52 M85 28 V52" style="stroke-width:7"/><path ${W} d="M85 40 H110" stroke-dasharray="4 4"/>`],
      [tr('Switch (open)', 'ස්විචය (විවෘත)'), `<path ${W} d="M10 40 H50 M100 40 H140 M50 40 L95 18"/><circle cx="50" cy="40" r="4" class="dot2"/><circle cx="100" cy="40" r="4" class="dot2"/>`],
      [tr('Bulb', 'බල්බය'), `<path ${W} d="M10 40 H50 M100 40 H140"/><circle cx="75" cy="40" r="25" ${W}/><path ${W} d="M57 22 L93 58 M93 22 L57 58"/>`],
      [tr('Resistor', 'ප්‍රතිරෝධකය'), `<path ${W} d="M10 40 H45 M105 40 H140"/><rect x="45" y="28" width="60" height="24" ${W}/>`],
      [tr('Variable resistor', 'විචල්‍ය ප්‍රතිරෝධකය'), `<path ${W} d="M10 40 H45 M105 40 H140"/><rect x="45" y="28" width="60" height="24" ${W}/><path ${W} d="M40 66 L110 14 M100 14 H110 V24"/>`],
      [tr('Ammeter', 'ඇමීටරය'), `<path ${W} d="M10 40 H50 M100 40 H140"/><circle cx="75" cy="40" r="25" ${W}/><text x="75" y="49" class="st">A</text>`],
      [tr('Voltmeter', 'වෝල්ට්මීටරය'), `<path ${W} d="M10 40 H50 M100 40 H140"/><circle cx="75" cy="40" r="25" ${W}/><text x="75" y="49" class="st">V</text>`],
      [tr('Fuse', 'විලායකය'), `<path ${W} d="M10 40 H140"/><rect x="45" y="30" width="60" height="20" ${W}/>`],
      [tr('LED', 'LED'), `<path ${W} d="M10 40 H55 M95 40 H140 M55 20 V60 M55 20 L95 40 L55 60 M95 20 V60 M100 18 l14 -10 M108 26 l14 -10"/>`]
    ];
    $('#syms').innerHTML = S.map(([n, g]) => `<div class="sy"><svg viewBox="0 0 150 80">${g}</svg><span>${n}</span></div>`).join('');
  }

  /* ---------- 4. series / parallel builder ---------- */
  {
    const svg = $('#circ'); let mode = 's', on = true, bOut = false;
    const bulb = (x, y, lum, name, gone) => gone
      ? `<g transform="translate(${x} ${y})"><circle r="30" class="bsock"/><text y="8" class="bx">✕</text><text y="62" class="bn">${name}</text></g>`
      : `<g transform="translate(${x} ${y})"><circle r="${30 + 50 * lum}" fill="rgba(255,214,10,${(.5 * lum).toFixed(2)})" class="halo"/><circle r="34" class="bglass" style="fill:rgba(255,${200 + 40 * lum | 0},${60 + 120 * lum | 0},${(.15 + .85 * lum).toFixed(2)})"/><path d="M-12 6 q6 -16 12 0 q6 16 12 0" class="bfil" style="stroke:${lum > .02 ? '#fff6c0' : '#666'}"/><text y="62" class="bn">${name}</text></g>`;
    const wire = (d, I) => `<path d="${d}" class="cw"/>` + (I > 0 ? `<path d="${d}" class="cflow" style="animation-duration:${(3 / Math.min(6, I)).toFixed(2)}s"/>` : '');
    const meter = (x, y, I) => `<g transform="translate(${x} ${y})"><circle r="34" class="cm"/><text y="-2" class="cmv">${f2(I)}</text><text y="18" class="cmu">A</text></g>`;
    function draw() {
      const V = +$('#bV').value, R = +$('#bR').value;
      $('#bVo').textContent = V + ' V'; $('#bRo').textContent = R + ' Ω';
      let I = 0, IA = 0, IB = 0, VA = 0, VB = 0, RT = Infinity;
      if (mode === 's') { if (!bOut) { RT = 2 * R; if (on) { I = V / RT; IA = IB = I; VA = VB = I * R; } } }
      else { RT = bOut ? R : R / 2; if (on) { IA = V / R; VA = V; if (!bOut) { IB = V / R; VB = V; } I = IA + IB; } }
      const lum = v => Math.min(1, Math.sqrt((v * v / R) / 24));
      const sw = '<text x="370" y="478" class="bn">S</text>' + (on ? '<path d="M330 440 L410 440" class="cw"/><circle cx="330" cy="440" r="6" class="cd"/><circle cx="410" cy="440" r="6" class="cd"/>'
        : '<path d="M330 440 L400 400" class="cw"/><circle cx="330" cy="440" r="6" class="cd"/><circle cx="410" cy="440" r="6" class="cd"/>');
      const bat = `<g transform="translate(90 260)"><path d="M-30 -20 H30 M-18 -6 H18 M-30 8 H30 M-18 22 H18" class="cbat"/><text x="-48" y="-14" class="bn">+</text><text x="-70" y="10" class="bn">${V} V</text></g>`;
      let h = '';
      if (mode === 's') {
        h += wire('M90 230 V80 H270', I) + wire('M330 80 H490', I) + wire('M550 80 H680 V226', I) + wire('M680 294 V440 H410', I) + wire('M330 440 H90 V290', I);
        if (bOut) h += '<path d="M490 80 H550" class="cgap"/>';
        h += bulb(300, 80, lum(VA), 'A', false) + bulb(520, 80, lum(VB), 'B', bOut) + meter(680, 260, I);
      } else {
        h += wire('M90 230 V80 H146', I) + wire('M214 80 H330', I) + wire('M330 80 H530', IB) + wire('M330 80 V230', IA) + wire('M330 290 V440', IA) + wire('M530 80 V230', IB) + wire('M530 290 V440 H330', IB) + wire('M330 440 H90 V290', I);
        if (bOut) h += '<path d="M530 80 V230" class="cgap"/>';
        h += meter(180, 80, I) + bulb(330, 260, lum(VA), 'A', false) + bulb(530, 260, lum(VB), 'B', bOut);
      }
      svg.innerHTML = h + sw + bat;
      $('#rI').textContent = f2(I) + ' A'; $('#rVA').textContent = f1(VA) + ' V'; $('#rVB').textContent = bOut ? '—' : f1(VB) + ' V';
      $('#rRT').textContent = RT === Infinity ? '∞' : f1(RT) + ' Ω';
      $('#bCut').classList.toggle('on', bOut);
      $('#bTip').innerHTML = !on ? tr('The switch is open: no complete path, so no current flows.', 'ස්විචය විවෘතයි: සම්පූර්ණ මාර්ගයක් නැති නිසා ධාරාවක් නොගලයි.')
        : mode === 's' ? (bOut ? tr('Series: one bulb is out, the only path is broken, so <b>both</b> go out.', 'ශ්‍රේණිගත: එක් බල්බයක් ඉවත් කළ විට එකම මාර්ගය කැඩෙන නිසා බල්බ <b>දෙකම</b> නිවේ.')
          : tr('Series: one path. The same current passes through both bulbs and they share the voltage, so each is dimmer.', 'ශ්‍රේණිගත: එක් මාර්ගයක්. බල්බ දෙක හරහා එකම ධාරාව ගලයි; වෝල්ටීයතාව බෙදී යන නිසා එක් එක් බල්බය අඳුරුයි.'))
        : (bOut ? tr('Parallel: bulb A has its own path, so it stays bright. This is how house wiring works.', 'සමාන්තර: A බල්බයට වෙනම මාර්ගයක් ඇති නිසා එය දිගටම දීප්තිමත්ව දැල්වේ. නිවාස රැහැන් ක්‍රියා කරන්නේ මෙලෙසයි.')
          : tr('Parallel: each bulb gets the full battery voltage, so both are bright, and the battery gives more current.', 'සමාන්තර: සෑම බල්බයකටම බැටරියේ සම්පූර්ණ වෝල්ටීයතාව ලැබෙන නිසා දෙකම දීප්තිමත්ය; බැටරිය වැඩි ධාරාවක් දෙයි.'));
    }
    $$('#mode button').forEach(b => b.addEventListener('click', () => { mode = b.dataset.m; $$('#mode button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
    $('#bSw').addEventListener('click', () => { on = !on; $('#bSw').classList.toggle('on', on); draw(); });
    $('#bCut').addEventListener('click', () => { bOut = !bOut; draw(); });
    $('#bV').addEventListener('input', draw); $('#bR').addEventListener('input', draw);
    draw();
  }

  /* ---------- 5. Ohm's law graph ---------- */
  {
    const g = $('#ohmG'), X0 = 70, Y0 = 410, W = 540, H = 370, X = v => X0 + v / 12 * W, Y = i => Y0 - i / 6 * H;
    function draw() {
      const V = +$('#oV').value, R = +$('#oR').value, I = V / R;
      $('#oVo').textContent = f1(V) + ' V'; $('#oRo').textContent = R + ' Ω'; $('#oI').textContent = f2(I) + ' A';
      let h = '';
      for (let v = 0; v <= 12; v += 2) h += `<path d="M${X(v)} ${Y0} V${Y0 - H}" class="gg"/><text x="${X(v)}" y="${Y0 + 26}" class="gt">${v}</text>`;
      for (let i = 0; i <= 6; i++) h += `<path d="M${X0} ${Y(i)} H${X0 + W}" class="gg"/><text x="${X0 - 14}" y="${Y(i) + 5}" class="gt" text-anchor="end">${i}</text>`;
      h += `<path d="M${X0} ${Y0} H${X0 + W + 10} M${X0} ${Y0} V${Y0 - H - 10}" class="ga"/><text x="${X0 + W}" y="${Y0 + 52}" class="gl">V / volt</text><text x="${X0}" y="${Y0 - H - 22}" class="gl">I / A</text>`;
      [2, 4, 8].filter(r => r !== R).forEach(r => { const v1 = Math.min(12, 6 * r); h += `<path d="M${X(0)} ${Y(0)} L${X(v1)} ${Y(v1 / r)}" class="gh"/><text x="${X(v1) + 6}" y="${Y(v1 / r) - 6}" class="gt">${r} Ω</text>`; });
      const v1 = Math.min(12, 6 * R);
      h += `<path d="M${X(0)} ${Y(0)} L${X(v1)} ${Y(v1 / R)}" class="gm"/><text x="${X(v1) - 8}" y="${Y(v1 / R) - 12}" class="gk" text-anchor="end">R = ${R} Ω</text>`;
      h += `<path d="M${X(V)} ${Y0} V${Y(I)} H${X0}" class="gd"/><circle cx="${X(V)}" cy="${Y(I)}" r="10" class="gp"/>`;
      g.innerHTML = h;
    }
    $('#oV').addEventListener('input', draw); $('#oR').addEventListener('input', draw); draw();
  }

  /* ---------- 6. resistors ---------- */
  {
    const draw = () => { const a = +$('#c1').value, b = +$('#c2').value; $('#c1o').textContent = a + ' Ω'; $('#c2o').textContent = b + ' Ω';
      $('#cS').textContent = (a + b) + ' Ω'; $('#cP').textContent = f2(a * b / (a + b)) + ' Ω'; };
    $('#c1').addEventListener('input', draw); $('#c2').addEventListener('input', draw); draw();
  }

  /* ---------- 7. electricity bill ---------- */
  {
    const A = [[tr('LED bulb', 'LED බල්බය'), 10, 6], [tr('Ceiling fan', 'සිවිලිම් පංකාව'), 60, 8], [tr('Television', 'රූපවාහිනිය'), 100, 4],
      [tr('Refrigerator', 'ශීතකරණය'), 150, 10], [tr('Rice cooker', 'බත් පිසින උදුන'), 700, 1], [tr('Iron', 'ඉස්ත්‍රික්කය'), 1000, .5], [tr('Kettle', 'කේතලය'), 2000, .25]];
    $('#apps').innerHTML = A.map(([n, w, h], i) => `<div class="ap"><b>${n}</b><em>${w} W</em><input type="range" min="0" max="24" step=".25" value="${h}" data-i="${i}"><span class="hrs"></span></div>`).join('');
    const draw = () => {
      let wh = 0; $$('#apps input').forEach(s => { const i = +s.dataset.i, h = +s.value; wh += A[i][1] * h; s.nextElementSibling.innerHTML = `${h} ${tr('h / day', 'පැය / දිනය')}`; });
      const day = wh / 1000, mon = day * 30;
      $('#eDay').textContent = f2(day) + ' kWh'; $('#eMon').textContent = f1(mon) + ' kWh'; $('#eCost').textContent = 'Rs. ' + Math.round(mon * 30).toLocaleString('en-US');
    };
    $$('#apps input').forEach(s => s.addEventListener('input', draw)); draw();
  }

  /* ---------- 8. fuse ---------- */
  {
    const P = [[tr('Kettle', 'කේතලය'), 2000], [tr('Iron', 'ඉස්ත්‍රික්කය'), 1200], [tr('Heater', 'තාපකය'), 2000], [tr('Microwave', 'මයික්‍රෝවේව්'), 1200], [tr('TV', 'රූපවාහිනිය'), 100], [tr('Fan', 'පංකාව'), 60]];
    const box = $('#plugs'); let blown = false;
    box.innerHTML = P.map(([n, w], i) => `<button data-i="${i}"><b>${n}</b><em>${w} W · ${f1(w / 230)} A</em></button>`).join('');
    const draw = () => {
      const I = blown ? 0 : $$('#plugs button.on').reduce((s, b) => s + P[+b.dataset.i][1] / 230, 0);
      $('#fI').textContent = f1(I) + ' A'; $('#fBar').style.width = Math.min(100, I / 20 * 100) + '%'; $('#fBar').classList.toggle('hot', I > 10);
      $('#fMsg').innerHTML = blown ? tr('<b>The fuse melted.</b> The circuit is cut, so nothing can overheat. Unplug some appliances, then replace the fuse.', '<b>විලායකය දිය විය.</b> පරිපථය කැපී ඇති නිසා කිසිවක් රත් විය නොහැක. උපකරණ කිහිපයක් ගලවා විලායකය මාරු කරන්න.')
        : I > 10 ? tr('Close to the limit…', 'සීමාවට ආසන්නයි…') : tr('Safe: below 13 A.', 'ආරක්ෂිතයි: 13 A ට අඩුයි.');
      $('#fuseSvg').classList.toggle('blown', blown);
      if (!blown && I > 13) { blown = true; setTimeout(draw, 350); }
    };
    box.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || blown) return; b.classList.toggle('on'); draw(); });
    $('#fReset').addEventListener('click', () => { blown = false; $$('#plugs button').forEach(b => b.classList.remove('on')); draw(); });
    draw();
  }
})();
