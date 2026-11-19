/* ICT deck simulations (plain script, works from disk too): data flow, CPU simulator, memory speed,
   RAM/ROM power switch, storage-unit converter, quiz score. Runs after engine/deck.js. */
(function () {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const tr = (en, si) => `<span lang="en">${en}</span><span lang="si">${si}</span>`;
  const slide = el => el.closest('.slide');
  const enter = (el, f) => slide(el).addEventListener('slide:enter', f);
  const leave = (el, f) => slide(el).addEventListener('slide:leave', f);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const num = n => Number.isInteger(n) ? n.toLocaleString('en-US') : (+n.toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 6 });

  /* ---------- 1. input -> process -> output ---------- */
  {
    const pk = $('#pk'), run = $('#run'), inp = $('#sum'), res = $('#res'), st = $('#cpuSt'), saved = $('#saved');
    const nodes = { in: $('#nIn'), cpu: $('#nCpu'), out: $('#nOut'), sto: $('#nSto') };
    let busy = false;
    const fly = (id, ms = 650) => new Promise(ok => {
      const p = document.getElementById(id), L = p.getTotalLength(), t0 = performance.now();
      pk.classList.add('on');
      const f = now => { const t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2, q = p.getPointAtLength(e * L);
        pk.setAttribute('cx', q.x); pk.setAttribute('cy', q.y); t < 1 ? requestAnimationFrame(f) : (pk.classList.remove('on'), ok()); };
      requestAnimationFrame(f);
    });
    const act = (k, on) => nodes[k].classList.toggle('act', on);
    async function go() {
      if (busy) return; busy = true;
      const raw = inp.value.trim(), ex = raw.replace(/×/g, '*').replace(/÷/g, '/');
      let r = '?'; if (/^[\d\s+\-*/().]+$/.test(ex)) { try { const v = Function('return (' + ex + ')')(); if (Number.isFinite(v)) r = num(v); } catch (e) {} }
      res.textContent = '—'; st.textContent = 'idle';
      act('in', true); await wait(250); await fly('w1'); act('in', false);
      act('cpu', true); st.textContent = 'ALU: ' + raw; await wait(900); st.textContent = '= ' + r; await wait(350);
      await fly('w2'); act('out', true); res.textContent = r; await wait(300);
      await fly('w3', 450); act('sto', true); saved.textContent = `${raw} = ${r}`; await wait(700);
      act('cpu', false); act('out', false); act('sto', false); busy = false;
    }
    run.addEventListener('click', go);
    inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') go(); });
    enter(run, () => setTimeout(go, 600));
    if (slide(run).classList.contains('on')) setTimeout(go, 600);
  }
  { const sp = document.querySelector('#speed'); if (sp.closest('.slide').classList.contains('on')) setTimeout(() => sp.classList.add('grow'), 200);
  }

  /* ---------- 2. CPU simulator: fetch, decode, execute, store ---------- */
  {
    const memEl = $('#mem'), say = $('#say'), stg = $$('#stg > div'), bus = $('#busDot');
    const R = { pc: $('#rPC'), ir: $('#rIR'), alu: $('#rALU'), acc: $('#rACC') };
    const PROG = ['LOAD 5', 'ADD 3', 'STORE 05', 'HALT'];
    let mem, pc, acc, k, timer = 0;
    const hex = n => String(n).padStart(2, '0');
    const D = {
      'LOAD 5': [tr('<b>LOAD 5</b> means: put the number 5 into the accumulator (ACC).', '<b>LOAD 5</b> යනු: අංකය 5 ACC එකට දමන්න.'),
        () => { R.alu.textContent = '5'; return tr('The value 5 goes through the ALU.', 'අගය 5 ALU එක හරහා යයි.'); },
        () => { acc = 5; return tr('The result is stored in the accumulator: ACC = 5.', 'ප්‍රතිඵලය ACC එකේ ගබඩා වේ: ACC = 5.'); }],
      'ADD 3': [tr('<b>ADD 3</b> means: add 3 to the number in ACC.', '<b>ADD 3</b> යනු: ACC හි ඇති අගයට 3 එකතු කරන්න.'),
        () => { R.alu.textContent = `${acc} + 3 = ${acc + 3}`; return tr(`The ALU adds: ${acc} + 3 = ${acc + 3}.`, `ALU එක එකතු කරයි: ${acc} + 3 = ${acc + 3}.`); },
        () => { acc += 3; return tr(`The answer is stored back in ACC: ACC = ${acc}.`, `පිළිතුර නැවත ACC එකේ ගබඩා වේ: ACC = ${acc}.`); }],
      'STORE 05': [tr('<b>STORE 05</b> means: copy ACC into RAM address 05.', '<b>STORE 05</b> යනු: ACC අගය RAM හි 05 ලිපිනයට පිටපත් කරන්න.'),
        () => { R.alu.textContent = 'ACC → BUS'; return tr(`The value ${acc} is put on the bus.`, `අගය ${acc} බසයට යවයි.`); },
        () => { mem[5] = String(acc); pulse('out', 5); return tr(`RAM address 05 now holds ${acc}.`, `දැන් RAM හි 05 ලිපිනයේ ${acc} ඇත.`); }]
    };
    function draw(hl, flash) {
      memEl.innerHTML = mem.map((v, i) => `<li class="${i === hl ? 'hl' : ''}${i === flash ? ' fl' : ''}${i > 3 ? ' data' : ''}"><i>${hex(i)}</i><b>${v || '·'}</b></li>`).join('');
      R.pc.textContent = hex(pc); R.acc.textContent = acc;
    }
    function pulse(dir, cell) { bus.className = ''; void bus.offsetWidth; bus.className = dir; if (cell != null) draw(-1, cell); }
    function stage(i) { stg.forEach(d => d.classList.toggle('on', +d.dataset.k === i)); }
    function reset() {
      clearInterval(timer); timer = 0; $('#sRun').classList.remove('on');
      mem = [...PROG, '', '']; pc = 0; acc = 0; k = 0;
      R.ir.textContent = '—'; R.alu.textContent = '—'; stage(-1); draw(-1);
      say.innerHTML = tr('A tiny program is in RAM. Press <b>Step</b> to run it one stage at a time.', 'කුඩා වැඩසටහනක් RAM එකේ ඇත. එය පියවරෙන් පියවර ධාවනය කිරීමට <b>ඊළඟ පියවර</b> ඔබන්න.');
      $('#sStep').disabled = false;
    }
    function step() {
      const ins = Math.floor(k / 4), part = k % 4, op = PROG[Math.min(ins, 3)];
      if (op === 'HALT') {
        stage(0); R.ir.textContent = 'HALT'; draw(3);
        say.innerHTML = tr('<b>HALT</b>: the program is finished. RAM address 05 holds the answer.', '<b>HALT</b>: වැඩසටහන අවසන්. පිළිතුර RAM හි 05 ලිපිනයේ ඇත.');
        $('#sStep').disabled = true; clearInterval(timer); timer = 0; $('#sRun').classList.remove('on'); return;
      }
      stage(part);
      if (part === 0) { const a = pc; R.ir.textContent = op; pc++; pulse('in'); draw(a);
        say.innerHTML = tr(`<b>Fetch</b>: the control unit reads the instruction at address ${hex(a)} into the IR. The PC moves on to ${hex(pc)}.`,
          `<b>ලබා ගැනීම</b>: පාලන ඒකකය ${hex(a)} ලිපිනයේ උපදෙස IR එකට ගෙන එයි. PC එක ${hex(pc)} ට යයි.`); }
      else if (part === 1) say.innerHTML = '<b>' + tr('Decode', 'විකේතනය') + '</b>: ' + D[op][0];
      else if (part === 2) say.innerHTML = '<b>' + tr('Execute', 'ක්‍රියාත්මක කිරීම') + '</b>: ' + D[op][1]();
      else { const m = D[op][2](); say.innerHTML = '<b>' + tr('Store', 'ගබඩා කිරීම') + '</b>: ' + m; if (op !== 'STORE 05') draw(-1); R.acc.textContent = acc; R.acc.parentNode.classList.remove('fl'); void R.acc.offsetWidth; R.acc.parentNode.classList.add('fl'); }
      k++;
    }
    $('#sStep').addEventListener('click', step);
    $('#sReset').addEventListener('click', reset);
    $('#sRun').addEventListener('click', e => { if (timer) { clearInterval(timer); timer = 0; e.currentTarget.classList.remove('on'); return; }
      if ($('#sStep').disabled) reset(); e.currentTarget.classList.add('on'); step(); timer = setInterval(step, 2200); });
    leave(memEl, () => { clearInterval(timer); timer = 0; $('#sRun').classList.remove('on'); });
    enter(memEl, reset);
    reset();
  }

  /* ---------- 3. memory speed bars grow when the slide opens ---------- */
  { const sp = $('#speed'); enter(sp, () => { sp.classList.remove('grow'); void sp.offsetWidth; setTimeout(() => sp.classList.add('grow'), 200); }); leave(sp, () => sp.classList.remove('grow')); }

  /* ---------- 4. RAM / ROM power switch ---------- */
  {
    const RAM = ['Chrome', 'Word', 'song.mp3', 'photo.jpg', 'Game', 'Zoom'], ROM = ['BIOS', 'POST', 'Boot', 'Setup', 'Clock', 'Firmware'];
    const ramC = $('#ramC'), romC = $('#romC'), sw = $('#pSw'), msg = $('#pMsg'); let on = true, busy = false;
    const fill = (el, a, cls = '') => el.innerHTML = a.map((x, i) => `<span class="${cls}" style="--i:${i}">${x}</span>`).join('');
    fill(ramC, RAM); fill(romC, ROM);
    const M = {
      on: tr('Power ON. RAM holds the programs that are open now.', 'විදුලිය ඇත. දැනට විවෘත වැඩසටහන් RAM එකේ ඇත.'),
      off: tr('Power OFF. RAM is empty (volatile). ROM still has the BIOS (non-volatile).', 'විදුලිය නැත. RAM හිස් (නශ්‍ය). ROM හි BIOS තවමත් ඇත (අනශ්‍ය).'),
      boot: tr('Power ON again. The BIOS in ROM starts the computer, then programs load into RAM again.', 'නැවත විදුලිය. ROM හි BIOS පරිගණකය ආරම්භ කරයි, පසුව වැඩසටහන් නැවත RAM එකට පැටවේ.')
    };
    msg.innerHTML = M.on;
    sw.addEventListener('click', async () => {
      if (busy) return; busy = true; on = !on; sw.classList.toggle('on', on); $('#pwr').classList.toggle('off', !on);
      if (!on) { $$('span', ramC).forEach(s => s.classList.add('gone')); await wait(700); fill(ramC, RAM.map(() => '&nbsp;'), 'empty'); msg.innerHTML = M.off; }
      else { msg.innerHTML = M.boot; romC.classList.add('boot'); await wait(900); romC.classList.remove('boot'); fill(ramC, RAM, 'load'); }
      busy = false;
    });
  }

  /* ---------- 5. storage units ---------- */
  {
    const U = ['bit', 'byte', 'KB', 'MB', 'GB', 'TB'], F = [1, 8, 8 * 1024, 8 * 1024 ** 2, 8 * 1024 ** 3, 8 * 1024 ** 4];
    const n = $('#uN'), u = $('#uU'), out = $('#uOut');
    const big = v => v >= 1e15 ? v.toExponential(3).replace('e+', ' × 10^') : num(v);
    function conv() { const bits = (+n.value || 0) * F[U.indexOf(u.value)];
      out.innerHTML = U.map((x, i) => `<div class="${x === u.value ? 'me' : ''}"><b class="mono">${big(bits / F[i])}</b><span class="mono">${x}</span></div>`).join(''); }
    n.addEventListener('input', conv); u.addEventListener('change', conv); n.addEventListener('keydown', e => e.stopPropagation()); conv();
    const S = [8, 16, 32, 64, 128, 256, 512], fS = $('#fS'), fP = $('#fP');
    function fit() { const g = S[fS.value - 1], p = +fP.value, c = Math.floor(g * 1024 / p);
      $('#fSo').textContent = g + ' GB'; $('#fPo').textContent = p + ' MB';
      $('#fAns').innerHTML = `${g} × 1024 ÷ ${p} = <b>${num(c)}</b> ` + tr('photos', 'ඡායාරූප'); }
    fS.addEventListener('input', fit); fP.addEventListener('input', fit); fit();
  }

  /* ---------- 6. quiz score (right on the first try) ---------- */
  {
    const sc = $('#score'), qs = $$('.slide[data-id="quiz"] .mcq'); const tried = new Set(); let pts = 0;
    qs.forEach((q, qi) => [...q.querySelectorAll('li')].forEach(li => li.addEventListener('click', () => setTimeout(() => {
      if (tried.has(qi)) return;
      if (li.classList.contains('right')) { tried.add(qi); pts++; } else if (li.classList.contains('wrong')) tried.add(qi);
      sc.textContent = `${pts} / ${qs.length}`; sc.classList.remove('bump'); void sc.offsetWidth; sc.classList.add('bump');
    }, 0))));
  }
})();
