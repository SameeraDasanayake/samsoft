/* Samsoft QR kit (2026-11-21): student QR cards for attendance + fee marking, shared by the LMS samples.
   The QR holds only the student number (e.g. KJ-2027-0148). A reprinted card gets "-2", "-3"... so a lost card stops working.
   Libraries (loaded on first use): qrcode-generator (MIT, makes the QR) and jsQR (Apache-2.0, reads it from the camera). */
(function () {
  const LIBS = { qr: 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js', read: 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js' };
  const loaded = {};
  const script = (src) => loaded[src] || (loaded[src] = new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('load ' + src)); document.head.appendChild(s); }));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const K = window.QRKit = {
    /** load the QR maker (and the camera reader when read = true) */
    load: (read) => Promise.all([script(LIBS.qr), read ? script(LIBS.read) : null]),
    /** the text inside a student's QR: the number, plus -2, -3... after a reprint */
    code: (id, ver) => (ver > 1 ? `${id}-${ver}` : id),
    /** "KJ-2027-0148-2" -> { id: 'KJ-2027-0148', ver: 2 } (or null if it is not one of ours) */
    parse: (text, re) => { const m = String(text).trim().match(re); return m ? { id: m[1], ver: m[2] ? +m[2] : 1 } : null; },
    /** an SVG of the QR (needs load() first) */
    svg(text, opts = {}) {
      const q = window.qrcode(0, 'M'); q.addData(text); q.make();
      const n = q.getModuleCount(), m = opts.margin ?? 2, size = n + m * 2; let d = '';
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c + m} ${r + m}h1v1h-1z`;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" ${opts.cls ? `class="${opts.cls}"` : ''} role="img" aria-label="QR ${esc(text)}"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="${opts.color || '#000'}"/></svg>`;
    },
    /** open a print sheet: A4, 10 ID-size cards (85.6 x 54 mm) per page.
        cards: [{ name, sub, id, code, initial }], o: { brand, tagline, color, color2, note, title, font } */
    print(cards, o = {}) {
      const w = window.open('', '_blank'); if (!w) return false;
      w.document.write(K.sheetHTML(cards, o)); w.document.close(); return true;
    },
    /** the print sheet as a whole HTML page */
    sheetHTML(cards, o = {}) {
      const c1 = o.color || '#3b3fd8', c2 = o.color2 || '#22c3ee';
      const card = (s) => `<div class="card"><div class="top"><b>${esc(o.brand || '')}</b><span>${esc(o.tagline || '')}</span></div>
        <div class="mid"><div class="who"><div class="av">${esc(s.initial || '')}</div><div><div class="nm">${esc(s.name)}</div><div class="sb">${esc(s.sub || '')}</div><div class="id">${esc(s.code)}</div></div></div>${K.svg(s.code, { cls: 'qr' })}</div>
        <div class="ft">${esc(o.note || '')}</div></div>`;
      return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(o.title || 'QR cards')}</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@500;700;800&display=swap" rel="stylesheet">
        <style>@page { size: A4; margin: 10mm; } * { box-sizing: border-box; margin: 0; } body { font-family: ${o.font || "'Noto Sans Sinhala', system-ui, sans-serif"}; background: #eee; }
        .sheet { display: grid; grid-template-columns: repeat(2, 85.6mm); grid-auto-rows: 54mm; gap: 4mm 6mm; justify-content: center; padding: 6mm 0; }
        .card { border: .3mm dashed #999; border-radius: 3mm; overflow: hidden; background: #fff; display: flex; flex-direction: column; break-inside: avoid; }
        .top { background: linear-gradient(110deg, ${c1}, ${c2}); color: #fff; padding: 2.2mm 3.5mm; display: flex; justify-content: space-between; align-items: baseline; }
        .top b { font-size: 3.6mm; } .top span { font-size: 2.4mm; opacity: .9; }
        .mid { flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 2mm 3mm 0 3.5mm; gap: 2mm; }
        .who { display: flex; gap: 2.5mm; align-items: center; min-width: 0; } .av { width: 11mm; height: 11mm; border-radius: 2.5mm; background: linear-gradient(140deg, ${c1}, ${c2}); color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 5mm; flex: none; }
        .nm { font-weight: 800; font-size: 3.6mm; line-height: 1.15; } .sb { font-size: 2.6mm; color: #555; margin-top: .6mm; } .id { font: 700 2.9mm/1 monospace; margin-top: 1.4mm; letter-spacing: .2mm; }
        .qr { width: 30mm; height: 30mm; flex: none; } .ft { font-size: 2.2mm; color: #666; padding: 0 3.5mm 2mm; }
        .bar { font: 14px system-ui; text-align: center; padding: 10px; background: #fff; border-bottom: 1px solid #ccc; } .bar button { font: inherit; padding: 6px 14px; margin-left: 8px; }
        @media print { body { background: #fff; } .bar { display: none; } .sheet { padding: 0; } }</style></head>
        <body><div class="bar">${esc(o.title || '')} · ${cards.length} <button onclick="print()">🖨 Print</button></div><div class="sheet">${cards.map(card).join('')}</div></body></html>`;
    },
    /** start the camera in `box` and call onCode(text) for each QR seen (the same code is ignored for 3 s). Returns stop(). */
    async scan(box, onCode, onError) {
      let stream, raf, stopped = false; const last = { t: '', at: 0 };
      try {
        await K.load(true);
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false });
      } catch (e) { onError && onError(e); return () => {}; }
      if (stopped) { stream.getTracks().forEach((t) => t.stop()); return () => {}; }
      const v = document.createElement('video'); v.playsInline = true; v.muted = true; v.srcObject = stream; v.className = 'qr-video';
      box.innerHTML = ''; box.appendChild(v); const aim = document.createElement('i'); aim.className = 'qr-aim'; box.appendChild(aim);
      await v.play().catch(() => {});
      const cv = document.createElement('canvas'), g = cv.getContext('2d', { willReadFrequently: true });
      const tick = () => {
        if (stopped) return;
        if (v.readyState >= 2 && v.videoWidth) {
          const s = Math.min(1, 640 / v.videoWidth); cv.width = v.videoWidth * s; cv.height = v.videoHeight * s; g.drawImage(v, 0, 0, cv.width, cv.height);
          const r = window.jsQR(g.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height, { inversionAttempts: 'dontInvert' });
          if (r && r.data && (r.data !== last.t || Date.now() - last.at > 3000)) { last.t = r.data; last.at = Date.now(); if (navigator.vibrate) navigator.vibrate(60); onCode(r.data); }
        }
        raf = requestAnimationFrame(tick);
      };
      tick();
      return () => { stopped = true; cancelAnimationFrame(raf); stream.getTracks().forEach((t) => t.stop()); };
    },
    /** a short beep for a good / bad scan */
    beep(ok) { try { const a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(), gn = a.createGain(); o.frequency.value = ok ? 880 : 220; gn.gain.value = .08; o.connect(gn); gn.connect(a.destination); o.start(); o.stop(a.currentTime + (ok ? .12 : .3)); } catch (e) { /* no audio */ } },
  };
})();
