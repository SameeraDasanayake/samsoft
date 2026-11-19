/* Samsoft tutes — page filler, driven by tools/tutes/pdf.mjs.
   Every top-level block of the notes gets a tiny invisible marker (⟦k⟧). pdf.mjs prints the PDF, reads where each
   marker landed, and for every page that ends with a hole it calls window.__fit.fix(k, holeMM) for the block k that
   jumped to the next page. fix() either
     1. shrinks the figure in that block (down to 70 %) so it fits the hole, or
     2. moves the short text blocks that follow it (same section, no figure) up into the hole.
   Then pdf.mjs prints again, until no page has a hole (or nothing more can be done). */
(function () {
  const MM = 96 / 25.4;
  const sheet = document.querySelector('main.sheet');
  // papers set window.FIT before this file: which blocks to mark, where their figures are
  const C = Object.assign({ blocks: ':scope > *', art: 'figure .art', kids: ':scope > svg, :scope > img' }, window.FIT || {});
  const solidFig = el => { const a = el.querySelector(C.art); return !!(a && a.querySelector(C.kids)); };
  const movable = el => el.matches('.row') && !el.querySelector('figure') && !el.matches('.sec, .exh');
  const stopper = el => el.matches('.sec, .newpage, .exh') || !!el.querySelector('.sec, .exh');
  const tried = new Map();

  function mark() {
    // a short table (under 60 mm) never splits, so its header row is never left alone at a page end
    sheet.querySelectorAll(':scope > .row.rtbl').forEach(r => { if (r.getBoundingClientRect().height < 60 * MM) r.style.breakInside = 'avoid'; });
    [...sheet.querySelectorAll(C.blocks)].forEach((el, k) => {
      if (el.dataset.k) return; el.dataset.k = k;
      const m = document.createElement('i'); m.className = 'mk'; m.textContent = `⟦${k}⟧`; el.prepend(m);
    });
  }
  const css = document.createElement('style');
  css.textContent = '[data-k]{position:relative}.mk{position:absolute;left:0;top:0;font:1px/1px sans-serif;color:#fff;font-style:normal;pointer-events:none;white-space:nowrap}';
  document.head.appendChild(css);

  function fix(k, holeMM) {
    let el = sheet.querySelector(`[data-k="${k}"]`); if (!el) return false;
    const n = (tried.get(k) || 0) + 1; tried.set(k, n); if (n > 4) return false;
    while (el.matches('.sec, .exh') && el.nextElementSibling) el = el.nextElementSibling;          // the real jumper follows its headings
    let start = el; while (start.previousElementSibling && start.previousElementSibling.matches('.sec, .exh')) start = start.previousElementSibling;
    const hole = holeMM * MM, sTop = start.getBoundingClientRect().top - parseFloat(getComputedStyle(start).marginTop);
    const r = el.getBoundingClientRect(), head = r.top - sTop, h = r.height, need = head + h - hole + 2 * MM;   // how much is too tall
    // 1. shrink the figure
    if (need > 0 && solidFig(el)) {
      const art = el.querySelector(C.art), fh = art.getBoundingClientRect().height, kf = (fh - need - 2 * MM) / fh;
      if (kf >= .7 && kf < 1) {
        art.querySelectorAll(C.kids).forEach(x => { const w = x.getBoundingClientRect().width; x.style.width = (w * kf) + 'px'; x.removeAttribute('width'); x.style.height = 'auto'; });
        return true;
      }
    }
    // 2. a question with writing lines: make its lines a little closer (not under 5.6 mm)
    const ln = [...el.querySelectorAll('.lines i, .ln')];
    if (need > 0 && ln.length) {
      const lh = ln[0].getBoundingClientRect().height, nh = lh - need / ln.length;
      if (nh >= 5.6 * MM && nh < lh) { ln.forEach(x => x.style.height = nh + 'px'); return true; }
    }
    // 3. the text fits but its margin notes are too long: move the last notes on to the next row's margin
    const side = el.querySelector(':scope > .s'), main = el.querySelector(':scope > .m');
    if (side && main && head + main.getBoundingClientRect().height + 2 * MM <= hole && side.children.length > 1) {
      let nxt = el.nextElementSibling; while (nxt && !(nxt.matches('.row') && !nxt.matches('.wide'))) { if (stopper(nxt)) { nxt = null; break; } nxt = nxt.nextElementSibling; }
      if (nxt) {
        let ns = nxt.querySelector(':scope > .s'); if (!ns) { ns = document.createElement('div'); ns.className = 's'; nxt.prepend(ns); }
        const top = side.getBoundingClientRect().top; let moved = 0;
        while (side.children.length > 1 && side.lastElementChild.getBoundingClientRect().bottom - top > hole - head - 2 * MM) { ns.prepend(side.lastElementChild); moved++; }
        if (moved) return true;
      }
    }
    // 4. only a little too tall: tighten the line spacing of this block
    if (need > 0 && need <= h * .25 && (el.dataset.tight || 0) < 2) {
      const t = el.dataset.tight = (+el.dataset.tight || 0) + 1;
      el.style.lineHeight = t === 1 ? '1.36' : '1.28'; el.style.fontSize = t === 1 ? '97%' : '94%';
      el.querySelectorAll('p, li, .opts li').forEach(x => { x.style.marginBottom = '.2em'; x.style.marginTop = '0'; }); return true;
    }
    // 5. pull the following short text blocks up, between the headings and the jumper
    let room = hole - head - 2 * MM; const take = [];
    for (let x = el.nextElementSibling; x; x = x.nextElementSibling) {
      if (stopper(x) || !movable(x)) break;
      const xh = x.getBoundingClientRect().height + 2 * MM; if (xh > room) break;
      take.push(x); room -= xh;
    }
    if (take.length) { take.forEach(x => el.before(x)); return true; }
    const nx = el.nextElementSibling; window.__why = (window.__why || '') + ` | k${k} ${el.className} h=${(h / MM) | 0} head=${(head / MM) | 0} hole=${holeMM | 0} need=${(need / MM) | 0} next=${nx && nx.className}`;
    return false;
  }

  // the last page holds only a little: shrink figures from the end (each down to 80 %) until it fits back
  function tail(mm) {
    let need = (mm + 6) * MM, did = false;
    // first: tighten the closing blocks (summary, word list, answers) once
    if (!sheet.dataset.tailTight) {
      sheet.dataset.tailTight = 1;
      sheet.querySelectorAll(':scope > .sum li, :scope > .gloss div, :scope > .ans .a').forEach(x => { x.style.paddingTop = '.6mm'; x.style.paddingBottom = '.6mm'; x.style.lineHeight = '1.3'; });
      sheet.querySelectorAll(':scope > .sum').forEach(x => x.style.gap = '2mm 5mm');
      sheet.querySelectorAll('.lines i').forEach(x => x.style.height = '6.2mm');
      return true;
    }
    const figs = [...sheet.querySelectorAll(C.art)].reverse();
    for (const art of figs) {
      if (need <= 0) break;
      const kids = [...art.querySelectorAll(C.kids)]; if (!kids.length || art.dataset.t) continue;
      const fh = art.getBoundingClientRect().height, k = Math.max(.8, (fh - need) / fh);
      kids.forEach(x => { const w = x.getBoundingClientRect().width; x.style.width = (w * k) + 'px'; x.removeAttribute('width'); x.style.height = 'auto'; });
      art.dataset.t = 1; need -= fh * (1 - k); did = true;
    }
    return did;
  }
  function clear() { sheet.querySelectorAll('.mk').forEach(m => m.remove()); }
  window.__fit = { mark, fix, tail, clear };
  if (sheet) mark();
  window.__laid = true;
})();
