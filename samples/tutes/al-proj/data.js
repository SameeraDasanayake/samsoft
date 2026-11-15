// A/L Physics — Projectile motion. Every graph is computed from the equations (g = 10 m s⁻², no air resistance).
const INK = '#1c1d1f', AC = '#1f4f8a', AMB = '#d9822b', GR = '#c9c6bf';
const rad = d => d * Math.PI / 180;
const path = (u, th, g = 10) => { const T = 2 * u * Math.sin(rad(th)) / g; return { T, H: (u * Math.sin(rad(th))) ** 2 / (2 * g), R: u * u * Math.sin(rad(2 * th)) / g, at: t => [u * Math.cos(rad(th)) * t, u * Math.sin(rad(th)) * t - g * t * t / 2] }; };
const tx = (x, y, s, a = 'middle', c = 't', fs = 13, st = '') => `<text class="${c}" x="${x}" y="${y}" font-size="${fs}" text-anchor="${a}" ${st}>${s}</text>`;
const f1 = v => (Math.round(v * 10) / 10).toString();

// equal-scale x–y plot. o: { W, H, xmax, ymax, sx, sy, lx, ly, m }
function frame(o) {
  const m = o.m || { l: 44, r: 18, t: 14, b: 38 }, k = Math.min((o.W - m.l - m.r) / o.xmax, (o.H - m.t - m.b) / o.ymax);
  const X = x => +(m.l + x * k).toFixed(1), Y = y => +(o.H - m.b - y * k).toFixed(1);
  let s = '';
  for (let g = 0; g <= o.xmax + 1e-6; g += o.sx) s += `<path d="M${X(g)} ${Y(0)} V${Y(o.ymax)}" stroke="${GR}" stroke-width=".6"/>${tx(X(g), Y(0) + 15, f1(g), 'middle', 't', 10.5)}`;
  for (let g = o.sy; g <= o.ymax + 1e-6; g += o.sy) s += `<path d="M${X(0)} ${Y(g)} H${X(o.xmax)}" stroke="${GR}" stroke-width=".6"/>${tx(X(0) - 6, Y(g) + 4, f1(g), 'end', 't', 10.5)}`;
  s += `<path d="M${X(0)} ${Y(o.ymax)} V${Y(0)} H${X(o.xmax)}" fill="none" stroke="${INK}" stroke-width="1.3"/>`;
  s += tx(X(o.xmax), Y(0) + 31, o.lx || 'x / m', 'end', 'tm', 12) + tx(X(0) + 6, Y(o.ymax) + 4, o.ly || 'y / m', 'start', 'tm', 12);
  return { X, Y, k, s };
}
const curve = (F, p, n = 90, st = `stroke="${INK}" stroke-width="2"`) => `<polyline fill="none" ${st} points="${Array.from({ length: n + 1 }, (_, i) => p.at(p.T * i / n)).map(([x, y]) => `${F.X(x)},${F.Y(Math.max(0, y))}`).join(' ')}"/>`;
const arrow = (x1, y1, x2, y2, c = INK, w = 1.8, id = 'pjA') => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="${w}" marker-end="url(#${id})"/>`;

/* cover: five angles at 20 m/s, 45° highlighted, strobe dots on it */
const heroSvg = (() => {
  const W = 520, H = 330, F = { X: x => 14 + x * 11.6, Y: y => H - 30 - y * 11.6 };
  let s = `<path d="M6 ${F.Y(0)} H${W - 6}" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>`;
  [15, 30, 60, 75].forEach(a => s += curve(F, path(20, a), 90, `stroke="#fff" stroke-opacity=".55" stroke-width="2.4"`));
  const p = path(20, 45); s += curve(F, p, 90, `stroke="#f6b44a" stroke-width="5"`);
  for (let i = 1; i < 14; i++) { const [x, y] = p.at(p.T * i / 14); s += `<circle cx="${F.X(x)}" cy="${F.Y(y)}" r="5.5" fill="#fff"/>`; }
  [[15, 20], [30, 34.6], [45, 40], [60, 34.6], [75, 20]].forEach(([a]) => { const q = path(20, a); const [x, y] = q.at(q.T * .5); s += `<text x="${F.X(x)}" y="${F.Y(y) - 9}" font-size="14" text-anchor="middle" style="fill:#fff;font-family:'Schibsted Grotesk',sans-serif;font-weight:700">${a}°</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}">${s}</svg>`;
})();

/* 1 strobe: positions every 0.1 s with their shadows on both axes */
const strobe = SVG2(l => {
  const p = path(14, 52), F = frame({ W: 520, H: 210, xmax: 20, ymax: 7, sx: 2, sy: 1 }); let s = F.s;
  const n = Math.floor(p.T / .1);
  for (let i = 0; i <= n; i++) {
    const [x, y] = p.at(i * .1);
    s += `<circle cx="${F.X(x)}" cy="${F.Y(0) - 6}" r="2.6" fill="${AC}"/><circle cx="${F.X(0) + 6}" cy="${F.Y(y)}" r="2.6" fill="${AMB}"/><circle cx="${F.X(x)}" cy="${F.Y(y)}" r="4.2" fill="${INK}"/>`;
  }
  s += tx(F.X(10), F.Y(0) - 14, l(B('equal steps: steady speed across', 'සමාන පියවර: තිරස්ව ඒකාකාර වේගය')), 'middle', 't', 11, `style="fill:${AC}"`);
  s += tx(F.X(11.2), F.Y(6.7), l(B('steps shrink, then grow: accelerating down', 'පියවර කුඩා වී නැවත විශාල වේ: පහළට ත්වරණය')), 'start', 't', 11, `style="fill:${AMB}"`);
  return SVG(124, 520, 210, s);
});

/* 2 components of u */
const comps = SVG2(l => {
  const ox = 50, oy = 190, L = 210, th = 35, ex = ox + L * Math.cos(rad(th)), ey = oy - L * Math.sin(rad(th));
  return SVG(80, 340, 220, `${ARROW('pjA')}${ARROW('pjB', AC)}${ARROW('pjC', AMB)}
    <path d="M${ox} ${oy} H${ex.toFixed(1)} V${ey.toFixed(1)}" fill="none" stroke="${GR}" stroke-width="1.2" stroke-dasharray="5 4"/>
    ${arrow(ox, oy, ex.toFixed(1), (oy).toFixed(1), AC, 2.6, 'pjB')}${arrow(ox, oy, ox, ey.toFixed(1), AMB, 2.6, 'pjC')}${arrow(ox, oy, ex.toFixed(1), ey.toFixed(1), INK, 2.8)}
    <path d="M${ox + 46} ${oy} A46 46 0 0 0 ${(ox + 46 * Math.cos(rad(th))).toFixed(1)} ${(oy - 46 * Math.sin(rad(th))).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.2"/>
    ${tx(ox + 58, oy - 10, 'θ', 'start', 'tm', 15)}${tx((ox + ex) / 2 - 10, (oy + ey) / 2 - 10, 'u', 'end', 'tm', 18)}
    ${tx((ox + ex) / 2, oy + 22, 'u cos θ', 'middle', 'tm', 15, `style="fill:${AC}"`)}${tx(ox - 8, (oy + ey) / 2, 'u sin θ', 'end', 'tm', 15, `style="fill:${AMB}"`)}`);
});

/* 3 one path with T, H, R and the velocity at a few times */
const anatomy = SVG2(l => {
  const u = 20, th = 50, p = path(u, th), F = frame({ W: 520, H: 280, xmax: 44, ymax: 16, sx: 5, sy: 2.5 }); let s = `${ARROW('pjA')}${ARROW('pjB', AC)}${ARROW('pjC', AMB)}` + F.s + curve(F, p);
  const vx = u * Math.cos(rad(th)), sc = .9;
  [0.12, 0.5, 0.88].forEach(f => {
    const t = p.T * f, [x, y] = p.at(t), vy = u * Math.sin(rad(th)) - 10 * t, X = F.X(x), Y = F.Y(y);
    s += arrow(X, Y, (X + vx * sc * F.k / 2.2).toFixed(1), Y, AC, 2, 'pjB');
    if (Math.abs(vy) > .5) s += arrow(X, Y, X, (Y - vy * sc * F.k / 2.2).toFixed(1), AMB, 2, 'pjC');
    s += `<circle cx="${X}" cy="${Y}" r="4" fill="${INK}"/>`;
  });
  const [xt, yt] = p.at(p.T / 2);
  s += `<path d="M${F.X(xt)} ${F.Y(yt)} V${F.Y(0)}" stroke="${INK}" stroke-width="1" stroke-dasharray="4 3"/>${tx(F.X(xt) + 6, F.Y(yt / 2), 'H', 'start', 'tm', 15)}`;
  s += tx(F.X(xt), F.Y(yt) - 10, l(B('top: v<sub>y</sub> = 0', 'ඉහළම: v<sub>y</sub> = 0')).replace(/<sub>(.*?)<\/sub>/g, '<tspan baseline-shift="sub" font-size="8.5">$1</tspan>'), 'middle', 't', 11.5);
  s += `<path d="M${F.X(0)} ${F.Y(0) - 26} H${F.X(p.R)}" stroke="${INK}" stroke-width="1" marker-start="url(#pjA)" marker-end="url(#pjA)"/>${tx(F.X(p.R / 2) + 16, F.Y(0) - 31, 'R', 'middle', 'tm', 15)}`;
  s += tx(F.X(5.5), F.Y(15.3), l(B('across: u cos θ (same all the way)', 'තිරස්: u cos θ (නියතයි)')), 'start', 't', 11, `style="fill:${AC}"`);
  s += tx(F.X(5.5), F.Y(13.9), l(B('up/down: v<sub>y</sub> = u sin θ − gt', 'සිරස්: v<sub>y</sub> = u sin θ − gt')).replace(/<sub>(.*?)<\/sub>/g, '<tspan baseline-shift="sub" font-size="8.5">$1</tspan>'), 'start', 't', 11, `style="fill:${AMB}"`);
  return SVG(124, 520, 280, s);
});

/* 4 same speed, five angles */
const family = SVG2(l => {
  const F = frame({ W: 520, H: 260, xmax: 42, ymax: 20, sx: 5, sy: 5 }); let s = F.s;
  [15, 30, 45, 60, 75].forEach(a => { const p = path(20, a), [x, y] = p.at(p.T / 2);
    s += curve(F, p, 90, a === 45 ? `stroke="${AC}" stroke-width="3"` : `stroke="${INK}" stroke-width="1.5"`) + tx(F.X(x), F.Y(y) - 6, a + '°', 'middle', a === 45 ? 'ta' : 't', 12); });
  s += tx(F.X(41), F.Y(18.5), l(B('u = 20 m s⁻¹ for every path', 'සෑම පථයකටම u = 20 m s⁻¹')), 'end', 't', 11.5);
  return SVG(110, 520, 260, s);
});

/* 5 thrown horizontally from a 45 m cliff at 15 m/s */
const cliff = SVG2(l => {
  const F = frame({ W: 520, H: 250, xmax: 50, ymax: 45, sx: 10, sy: 15, m: { l: 70, r: 20, t: 14, b: 36 } }); let s = `${ARROW('pjA')}` + F.s;
  s += `<rect x="${F.X(0) - 40}" y="${F.Y(45)}" width="40" height="${(F.Y(0) - F.Y(45)).toFixed(1)}" fill="#d9d4ca" stroke="${INK}" stroke-width="1"/>`;
  s += `<polyline fill="none" stroke="${INK}" stroke-width="2" points="${Array.from({ length: 61 }, (_, i) => { const t = 3 * i / 60; return `${F.X(15 * t)},${F.Y(45 - 5 * t * t)}`; }).join(' ')}"/>`;
  for (let t = 0; t <= 3; t += .5) s += `<circle cx="${F.X(15 * t)}" cy="${F.Y(45 - 5 * t * t)}" r="3.6" fill="${AC}"/>`;
  s += arrow(F.X(0), F.Y(45) - 8, F.X(8), F.Y(45) - 8) + tx(F.X(4), F.Y(45) - 14, '15 m s⁻¹', 'middle', 't', 11.5);
  s += tx(F.X(45), F.Y(3), l(B('lands 45 m out', '45 m දුරින් වැටේ')), 'end', 't', 11.5);
  return SVG(92, 520, 250, s);
});

window.TUTE = {
  no: '05', code: 'ALP-T5', accent: '#1f4f8a', heroSvg,
  inst: B('Kelani Academy', 'කැලණි ඇකඩමිය'), teacher: B('A/L Physics class', 'උ/පෙළ භෞතික විද්‍යාව පන්තිය'),
  subject: B('Physics', 'භෞතික විද්‍යාව'), grade: B('A/L · Mechanics', 'උ/පෙළ · යාන්ත්‍ර විද්‍යාව'),
  title: B('Projectile motion', 'ප්‍රක්ෂිප්ත චලිතය'),
  sub: B('Two simple motions at once — steady sideways, accelerating downwards — and the three results that follow from them.',
    'එකවර චලිත දෙකක් — තිරස්ව ඒකාකාරව, සිරස්ව ත්වරණයෙන් — සහ ඒවායින් ලැබෙන ප්‍රතිඵල තුන.'),
  body: [
    /* 1 */
    { sec: B('Split it into two motions', 'චලිත දෙකකට වෙන් කරන්න'),
      lead: B('A <b>projectile</b> is any object thrown into the air that then moves under gravity alone. We take g = 10 m s<sup>−2</sup> and ignore air resistance. Then the motion splits into two independent parts.',
        '<b>ප්‍රක්ෂිප්තයක්</b> යනු වාතයට විසි කළ පසු ගුරුත්වය යටතේ පමණක් චලනය වන ඕනෑම වස්තුවකි. අපි g = 10 m s<sup>−2</sup> ලෙස ගෙන වායු ප්‍රතිරෝධය නොසලකා හරිමු. එවිට චලිතය එකිනෙකින් ස්වායත්ත කොටස් දෙකකට වෙන් වේ.'),
      s: [{ term: B('projectile', 'ප්‍රක්ෂිප්තය'), d: B('An object moving freely under gravity after being launched.', 'විදීමෙන් පසු ගුරුත්වය යටතේ නිදහසේ චලනය වන වස්තුවකි.') },
        { term: B('air resistance', 'වායු ප්‍රතිරෝධය'), d: B('The drag of the air; ignored in this tute.', 'වාතයෙන් ඇති වන බාධාව; මෙම නිබන්ධනයේදී නොසලකා හරී.') }] },
    { tbl: { head: ['', B('Horizontal (x)', 'තිරස් (x)'), B('Vertical (y, up +)', 'සිරස් (y, ඉහළට +)')],
      rows: [[B('<b>Force</b>', '<b>බලය</b>'), B('none', 'නැත'), B('weight mg, down', 'බර mg, පහළට')], [B('<b>Acceleration</b>', '<b>ත්වරණය</b>'), '0', '−g'],
        [B('<b>Motion</b>', '<b>චලිතය</b>'), B('uniform velocity', 'ඒකාකාර ප්‍රවේගය'), B('uniform acceleration', 'ඒකාකාර ත්වරණය')]] },
      s: { rem: B('The two directions are <b>independent</b>: what happens across does not change what happens up and down. They share only the time t.', 'දිශා දෙක <b>ස්වායත්ත</b> වේ: තිරස්ව සිදු වන දෙය සිරස් චලිතය වෙනස් නොකරයි. ඒවාට පොදු වන්නේ කාලය t පමණි.') } },
    { fig: { svg: strobe }, cap: B('Positions every 0.1 s for u = 14 m s<sup>−1</sup> at 52°, with their shadows on the two axes.', 'u = 14 m s<sup>−1</sup>, 52° සඳහා සෑම තත්පර 0.1කටම පිහිටීම් සහ අක්ෂ දෙක මත ඒවායේ සෙවණැලි.') },

    /* 2 */
    { sec: B('Components of the initial velocity', 'ආරම්භක ප්‍රවේගයේ සංරචක'),
      lead: B('A ball is launched with speed <i>u</i> at angle θ above the horizontal. <b>Resolve</b> u into two components and treat each direction on its own.',
        'බෝලයක් තිරසට θ කෝණයකින් <i>u</i> වේගයෙන් විදිනු ලැබේ. u සංරචක දෙකකට <b>විභේදනය</b> කර එක් එක් දිශාව වෙන වෙනම සලකන්න.'),
      s: { term: B('resolve', 'විභේදනය'), d: B('Split a vector into perpendicular components.', 'දෛශිකයක් ලම්බක සංරචකවලට වෙන් කිරීම.') } },
    { fig: { svg: comps }, cap: B('u cos θ across, u sin θ up.', 'තිරසට u cos θ, ඉහළට u sin θ.'),
      s: { note: B('u<sub>x</sub> = u cos θ<br>u<sub>y</sub> = u sin θ', 'u<sub>x</sub> = u cos θ<br>u<sub>y</sub> = u sin θ'), tag: B('Components', 'සංරචක') } },
    { ex: { q: B('A stone is thrown at 20 m s<sup>−1</sup> at 30° above the horizontal. Find the components of its initial velocity.', 'ගලක් තිරසට 30° කෝණයකින් 20 m s<sup>−1</sup> වේගයෙන් විසි කරයි. එහි ආරම්භක ප්‍රවේගයේ සංරචක සොයන්න.'),
        steps: [B('u<sub>x</sub> = 20 cos 30° = 20 × 0.866 = 17.3 m s<sup>−1</sup>', 'u<sub>x</sub> = 20 cos 30° = 20 × 0.866 = 17.3 m s<sup>−1</sup>'), B('u<sub>y</sub> = 20 sin 30° = 20 × 0.5 = 10 m s<sup>−1</sup>', 'u<sub>y</sub> = 20 sin 30° = 20 × 0.5 = 10 m s<sup>−1</sup>')],
        a: B('17.3 m s<sup>−1</sup> across, 10 m s<sup>−1</sup> up', 'තිරසට 17.3 m s<sup>−1</sup>, ඉහළට 10 m s<sup>−1</sup>') } },

    /* 3 */
    { sec: B('Position and velocity at time t', 't කාලයේදී පිහිටීම සහ ප්‍රවේගය'),
      lead: B('Use the equations of uniform motion in each direction, starting from the launch point.', 'විදින ලක්ෂ්‍යයේ සිට, එක් එක් දිශාවට ඒකාකාර චලිත සමීකරණ යොදන්න.') },
    { tbl: { head: ['', B('Horizontal', 'තිරස්'), B('Vertical (up +)', 'සිරස් (ඉහළට +)')],
      rows: [[B('<b>Velocity</b>', '<b>ප්‍රවේගය</b>'), 'v<sub>x</sub> = u cos θ', 'v<sub>y</sub> = u sin θ − gt'],
        [B('<b>Position</b>', '<b>පිහිටීම</b>'), 'x = (u cos θ) t', 'y = (u sin θ) t − ½gt²'], [B('<b>Also</b>', '<b>තවද</b>'), '', 'v<sub>y</sub>² = (u sin θ)² − 2gy']] },
      s: { note: B('Speed at any time: v = √(v<sub>x</sub>² + v<sub>y</sub>²); direction: tan α = v<sub>y</sub> / v<sub>x</sub>.', 'ඕනෑම මොහොතක වේගය: v = √(v<sub>x</sub>² + v<sub>y</sub>²); දිශාව: tan α = v<sub>y</sub> / v<sub>x</sub>.'), tag: B('Resultant', 'සම්ප්‍රයුක්තය') } },
    { fig: { svg: anatomy }, cap: B('u = 20 m s<sup>−1</sup> at 50°. The blue arrow (v<sub>x</sub>) never changes; the orange arrow (v<sub>y</sub>) shrinks to zero at the top, then grows downwards.', 'u = 20 m s<sup>−1</sup>, 50°. නිල් ඊතලය (v<sub>x</sub>) කිසිවිටෙක වෙනස් නොවේ; තැඹිලි ඊතලය (v<sub>y</sub>) ඉහළම ලක්ෂ්‍යයේදී ශූන්‍ය වී, පසුව පහළට වැඩි වේ.') },
    { p: B('Eliminate t from the two position equations: y = x tan θ − g x² / (2u² cos²θ). This is the equation of a <b>parabola</b>, so every projectile path is a parabola.',
        'පිහිටීම් සමීකරණ දෙකෙන් t ඉවත් කළ විට: y = x tan θ − g x² / (2u² cos²θ). මෙය <b>පරාවලයක</b> සමීකරණයයි; එබැවින් සෑම ප්‍රක්ෂිප්ත පථයක්ම පරාවලයකි.'),
      s: { term: B('trajectory', 'ගමන් පථය'), d: B('The path of the projectile — a parabola.', 'ප්‍රක්ෂිප්තයේ මාර්ගය — පරාවලයකි.') } },
    { check: [
      { q: B('A ball is thrown at 25 m s<sup>−1</sup> at 37° (sin 37° = 0.6, cos 37° = 0.8). Find v<sub>x</sub> and v<sub>y</sub> after 1 s.', 'බෝලයක් 37° කෝණයකින් 25 m s<sup>−1</sup> වේගයෙන් විසි කරයි (sin 37° = 0.6, cos 37° = 0.8). තත්පර 1කට පසු v<sub>x</sub> සහ v<sub>y</sub> සොයන්න.'), a: B('v<sub>x</sub> = 20 m s<sup>−1</sup>; v<sub>y</sub> = 15 − 10 = 5 m s<sup>−1</sup> (up)', 'v<sub>x</sub> = 20 m s<sup>−1</sup>; v<sub>y</sub> = 15 − 10 = 5 m s<sup>−1</sup> (ඉහළට)') },
      { q: B('At the highest point, which component of velocity is zero?', 'ඉහළම ලක්ෂ්‍යයේදී ශූන්‍ය වන්නේ ප්‍රවේගයේ කුමන සංරචකයද?'), a: B('The vertical component v<sub>y</sub>.', 'සිරස් සංරචකය v<sub>y</sub>.') }] },

    /* 4 */
    { sec: B('Time of flight, maximum height, range', 'පියාසර කාලය, උපරිම උස, පරාසය'),
      lead: B('For a projectile that lands back at its launch height, three results follow directly from the equations.', 'විදි උසටම නැවත පතිත වන ප්‍රක්ෂිප්තයක් සඳහා සමීකරණවලින් සෘජුවම ප්‍රතිඵල තුනක් ලැබේ.'),
      s: [{ term: B('time of flight', 'පියාසර කාලය'), d: B('Time from launch until it lands.', 'විදීමේ සිට පතිත වන තෙක් කාලය.') }, { term: B('range', 'පරාසය'), d: B('Horizontal distance from launch to landing.', 'විදීමේ සිට පතිත වීම දක්වා තිරස් දුර.') }] },
    { tbl: { head: [B('Result', 'ප්‍රතිඵලය'), B('Where it comes from', 'ලැබෙන ආකාරය'), B('Formula', 'සූත්‍රය')],
      rows: [[B('Time of flight T', 'පියාසර කාලය T'), B('y = 0 again: t(u sin θ − ½gt) = 0', 'නැවත y = 0: t(u sin θ − ½gt) = 0'), '<b>T = 2u sin θ / g</b>'],
        [B('Maximum height H', 'උපරිම උස H'), B('at the top v<sub>y</sub> = 0: 0 = u² sin²θ − 2gH', 'ඉහළම ලක්ෂ්‍යයේ v<sub>y</sub> = 0: 0 = u² sin²θ − 2gH'), '<b>H = u² sin²θ / 2g</b>'],
        [B('Range R', 'පරාසය R'), B('R = (u cos θ) × T and 2 sin θ cos θ = sin 2θ', 'R = (u cos θ) × T සහ 2 sin θ cos θ = sin 2θ'), '<b>R = u² sin 2θ / g</b>']] }, wide: true },
    { ex: { q: B('A football is kicked at 25 m s<sup>−1</sup> at 37° to the ground (sin 37° = 0.6, cos 37° = 0.8). Find T, H and R. Does it clear a crossbar 2.4 m high, 30 m away?', 'පාපන්දුවකට බිමට 37° කෝණයකින් 25 m s<sup>−1</sup> වේගයෙන් පහර දෙයි (sin 37° = 0.6, cos 37° = 0.8). T, H සහ R සොයන්න. 30 m දුරින් ඇති 2.4 m උස හරස් පොල්ලට ඉහළින් එය යයිද?'),
        steps: [B('u<sub>x</sub> = 25 × 0.8 = 20 m s<sup>−1</sup>; u<sub>y</sub> = 25 × 0.6 = 15 m s<sup>−1</sup>', 'u<sub>x</sub> = 25 × 0.8 = 20 m s<sup>−1</sup>; u<sub>y</sub> = 25 × 0.6 = 15 m s<sup>−1</sup>'),
          B('T = 2 × 15 / 10 = 3 s; &nbsp;H = 15² / 20 = 11.25 m; &nbsp;R = 20 × 3 = 60 m', 'T = 2 × 15 / 10 = 3 s; &nbsp;H = 15² / 20 = 11.25 m; &nbsp;R = 20 × 3 = 60 m'),
          B('At x = 30 m: t = 30 / 20 = 1.5 s; y = 15 × 1.5 − 5 × 1.5² = 22.5 − 11.25 = 11.25 m', 'x = 30 m දී: t = 30 / 20 = 1.5 s; y = 15 × 1.5 − 5 × 1.5² = 22.5 − 11.25 = 11.25 m')],
        a: B('T = 3 s, H = 11.25 m, R = 60 m; at the goal it is 11.25 m high — well over the bar.', 'T = 3 s, H = 11.25 m, R = 60 m; ගෝලය අසල එය 11.25 m උසින් ඇත — පොල්ලට බොහෝ ඉහළින්.') },
      s: { rem: B('These formulas are only for landing at the <b>same height</b>. From a cliff or a table, use the x and y equations directly.', 'මෙම සූත්‍ර <b>එකම උසට</b> පතිත වීම සඳහා පමණි. කඳු මුදුනක හෝ මේසයක සිට නම්, x සහ y සමීකරණ සෘජුවම යොදන්න.') } },

    /* 5 */
    { sec: B('45° goes furthest', '45° උපරිම දුර යයි'),
      lead: B('At a fixed speed, R = u² sin 2θ / g is largest when sin 2θ = 1, that is θ = 45°: <b>R<sub>max</sub> = u² / g</b>. Since sin 2θ = sin (180° − 2θ), the angles θ and 90° − θ give the <b>same range</b>.',
        'නියත වේගයකදී R = u² sin 2θ / g උපරිම වන්නේ sin 2θ = 1, එනම් θ = 45° වන විටය: <b>R<sub>max</sub> = u² / g</b>. sin 2θ = sin (180° − 2θ) නිසා θ සහ 90° − θ කෝණ <b>එකම පරාසය</b> දෙයි.') },
    { fig: { svg: family }, cap: B('Five paths at 20 m s<sup>−1</sup>. 15° and 75° land together (20 m); so do 30° and 60° (34.6 m). 45° goes furthest (40 m).', '20 m s<sup>−1</sup> හි පථ පහක්. 15° සහ 75° එකම තැනට (20 m) වැටේ; 30° සහ 60° ද එසේමය (34.6 m). 45° උපරිම දුර (40 m) යයි.'),
      s: { fact: B('With air resistance the best angle for a ball is a little below 45°.', 'වායු ප්‍රතිරෝධය සැලකූ විට බෝලයක් සඳහා හොඳම කෝණය 45° ට මඳක් අඩුය.') } },

    /* 6 */
    { sec: B('Launched horizontally', 'තිරස්ව විදීම'),
      lead: B('If an object is thrown horizontally from a height h, then u<sub>y</sub> = 0. The time to fall depends only on h: h = ½gt². In that time it moves x = ut sideways.',
        'වස්තුවක් h උසක සිට තිරස්ව විසි කළහොත් u<sub>y</sub> = 0 වේ. පතිත වීමට ගත වන කාලය රඳා පවතින්නේ h මත පමණි: h = ½gt². එම කාලය තුළ එය තිරස්ව x = ut දුරක් ගමන් කරයි.') },
    { fig: { svg: cliff }, cap: B('A stone thrown horizontally at 15 m s<sup>−1</sup> from a 45 m cliff. Dots every 0.5 s.', '45 m උස කඳු මුදුනක සිට තිරස්ව 15 m s<sup>−1</sup> වේගයෙන් විසි කළ ගලක්. තත්පර 0.5කට වරක් තිත්.'),
      s: { rem: B('A stone <b>dropped</b> from the same cliff at the same moment lands at the <b>same time</b> (3 s).', 'එම මොහොතේම එම කඳු මුදුනේ සිට <b>අත හැරි</b> ගලක්ද <b>එකම වේලාවේ</b> (3 s) පතිත වේ.') } },
    { ex: { q: B('For the stone in the figure above, find the time of flight, how far out it lands, and its speed on landing.', 'ඉහත රූපයේ ගල සඳහා පියාසර කාලය, එය වැටෙන දුර සහ පතිත වන විට වේගය සොයන්න.'),
        steps: [B('45 = ½ × 10 × t² → t² = 9 → t = 3 s', '45 = ½ × 10 × t² → t² = 9 → t = 3 s'), B('x = 15 × 3 = 45 m', 'x = 15 × 3 = 45 m'),
          B('v<sub>x</sub> = 15, v<sub>y</sub> = 10 × 3 = 30 → v = √(15² + 30²) = √1125 = 33.5 m s<sup>−1</sup>', 'v<sub>x</sub> = 15, v<sub>y</sub> = 10 × 3 = 30 → v = √(15² + 30²) = √1125 = 33.5 m s<sup>−1</sup>')],
        a: B('3 s; 45 m; 33.5 m s<sup>−1</sup> at tan⁻¹(30/15) = 63.4° below the horizontal', '3 s; 45 m; තිරසට පහළින් tan⁻¹(30/15) = 63.4° දිශාවට 33.5 m s<sup>−1</sup>') } },
    { check: [
      { q: B('A ball rolls off a table 0.8 m high at 3 m s<sup>−1</sup>. How long does it take to reach the floor, and how far from the table does it land?', '0.8 m උස මේසයක සිට බෝලයක් 3 m s<sup>−1</sup> වේගයෙන් පෙරළී වැටේ. බිමට ළඟා වීමට ගත වන කාලය සහ මේසයේ සිට එය වැටෙන දුර සොයන්න.'), a: B('0.8 = 5t² → t = 0.4 s; x = 3 × 0.4 = 1.2 m', '0.8 = 5t² → t = 0.4 s; x = 3 × 0.4 = 1.2 m'), lines: 2 },
      { q: B('Two stones are thrown at 20 m s<sup>−1</sup>, at 20° and at 70°. Which goes further?', 'ගල් දෙකක් 20 m s<sup>−1</sup> වේගයෙන් 20° සහ 70° ට විසි කරයි. වැඩි දුරක් යන්නේ කුමක්ද?'), a: B('Neither — 20° + 70° = 90°, so the ranges are equal.', 'කිසිවක් නැත — 20° + 70° = 90° නිසා පරාස සමාන වේ.') }] }
  ],

  mcq: [
    { q: B('At the highest point of a projectile\'s path (no air resistance)', 'ප්‍රක්ෂිප්තයක ගමන් පථයේ ඉහළම ලක්ෂ්‍යයේදී (වායු ප්‍රතිරෝධය නැත)'), opts: [B('its velocity is zero.', 'ප්‍රවේගය ශූන්‍ය වේ.'), B('its acceleration is zero.', 'ත්වරණය ශූන්‍ය වේ.'), B('the vertical component of velocity is zero.', 'ප්‍රවේගයේ සිරස් සංරචකය ශූන්‍ය වේ.'), B('the horizontal component of velocity is zero.', 'ප්‍රවේගයේ තිරස් සංරචකය ශූන්‍ය වේ.')], a: 3,
      why: B('It still moves sideways at u cos θ, and g still acts downwards. Only v<sub>y</sub> is zero.', 'එය තවමත් u cos θ වේගයෙන් තිරස්ව ගමන් කරයි; g තවමත් පහළට ක්‍රියා කරයි. ශූන්‍ය වන්නේ v<sub>y</sub> පමණි.') },
    { q: B('Two stones are thrown at the same speed, one at 30° and one at 60°. Their ranges are', 'ගල් දෙකක් එකම වේගයෙන්, එකක් 30° ටද අනෙක 60° ටද විසි කරයි. ඒවායේ පරාස'), opts: [B('greater at 30°.', '30° ට වැඩිය.'), B('greater at 60°.', '60° ට වැඩිය.'), B('equal.', 'සමානය.'), B('decided by the masses.', 'ස්කන්ධ මත රඳා පවතී.')], a: 3 },
    { q: B('The horizontal acceleration of a projectile (no air resistance) is', 'ප්‍රක්ෂිප්තයක තිරස් ත්වරණය (වායු ප්‍රතිරෝධය නැත)'), opts: ['0', 'g', 'g sin θ', 'g cos θ'], a: 1 },
    { q: B('For a fixed launch speed, the range is greatest at', 'නියත විදීමේ වේගයකදී පරාසය උපරිම වන්නේ'), opts: ['30°', '45°', '60°', '90°'], a: 2 },
    { q: B('A ball is thrown at 20 m s<sup>−1</sup> at 30°. Its time of flight is', 'බෝලයක් 30° ට 20 m s<sup>−1</sup> වේගයෙන් විසි කරයි. පියාසර කාලය වන්නේ'), opts: ['1 s', '2 s', '3.46 s', '4 s'], a: 2 },
    { q: B('A ball is thrown horizontally from a height of 20 m. It reaches the ground after', '20 m උසක සිට බෝලයක් තිරස්ව විසි කරයි. එය බිමට ළඟා වන්නේ'), opts: ['1 s', '2 s', '4 s', '20 s'], a: 2 },
    { q: B('One ball is dropped and another is thrown horizontally from the same height at the same time. Which lands first?', 'එකම උසක සිට එකම මොහොතේ එක් බෝලයක් අත හරින අතර අනෙක තිරස්ව විසි කරයි. මුලින්ම බිමට වැටෙන්නේ කුමක්ද?'), opts: [B('the dropped ball', 'අත හැරි බෝලය'), B('the thrown ball', 'විසි කළ බෝලය'), B('both together', 'දෙකම එකවර'), B('the heavier ball', 'බර වැඩි බෝලය')], a: 3 },
    { q: B('The path of a projectile is', 'ප්‍රක්ෂිප්තයක ගමන් පථය'), opts: [B('a straight line.', 'සරල රේඛාවකි.'), B('a parabola.', 'පරාවලයකි.'), B('a circle.', 'වෘත්තයකි.'), B('a hyperbola.', 'බහුවලයකි.')], a: 2 },
    { q: B('A stone is thrown straight up at 10 m s<sup>−1</sup>. Its maximum height is', 'ගලක් 10 m s<sup>−1</sup> වේගයෙන් සිරස්ව ඉහළට විසි කරයි. එහි උපරිම උස'), opts: ['5 m', '10 m', '20 m', '50 m'], a: 1 },
    { q: B('If the launch speed is doubled (same angle), the range becomes', 'විදීමේ වේගය දෙගුණ කළහොත් (එකම කෝණය), පරාසය'), opts: [B('the same.', 'වෙනස් නොවේ.'), B('twice as large.', 'දෙගුණ වේ.'), B('four times as large.', 'හතර ගුණ වේ.'), B('half.', 'අඩක් වේ.')], a: 3, why: B('R = u² sin 2θ / g, so R is proportional to u².', 'R = u² sin 2θ / g නිසා R, u² ට අනුලෝමව සමානුපාතික වේ.') }
  ],
  st: [
    { q: B('A stone is thrown from level ground at 20 m s<sup>−1</sup> at 30° above the horizontal. (g = 10 m s<sup>−2</sup>, cos 30° = 0.866)', 'තිරස් බිමක සිට ගලක් තිරසට 30° ට 20 m s<sup>−1</sup> වේගයෙන් විසි කරයි. (g = 10 m s<sup>−2</sup>, cos 30° = 0.866)'), parts: [
      { q: B('Find the horizontal and vertical components of the initial velocity.', 'ආරම්භක ප්‍රවේගයේ තිරස් සහ සිරස් සංරචක සොයන්න.'), m: 2, a: B('17.3 m s<sup>−1</sup> and 10 m s<sup>−1</sup>', '17.3 m s<sup>−1</sup> සහ 10 m s<sup>−1</sup>') },
      { q: B('Find the time of flight.', 'පියාසර කාලය සොයන්න.'), m: 2, lines: 1, a: B('T = 2 × 10 / 10 = 2 s', 'T = 2 × 10 / 10 = 2 s') },
      { q: B('Find the maximum height.', 'උපරිම උස සොයන්න.'), m: 2, lines: 1, a: B('H = 10² / 20 = 5 m', 'H = 10² / 20 = 5 m') },
      { q: B('Find the range.', 'පරාසය සොයන්න.'), m: 2, lines: 1, a: B('R = 17.3 × 2 = 34.6 m', 'R = 17.3 × 2 = 34.6 m') },
      { q: B('Find the speed and direction of the stone 1.5 s after it is thrown.', 'විසි කර තත්පර 1.5කට පසු ගලේ වේගය සහ දිශාව සොයන්න.'), m: 3, lines: 3, a: B('v<sub>x</sub> = 17.3; v<sub>y</sub> = 10 − 15 = −5 (down); v = √(300 + 25) = 18.0 m s<sup>−1</sup>, at tan⁻¹(5/17.3) = 16.1° below the horizontal', 'v<sub>x</sub> = 17.3; v<sub>y</sub> = 10 − 15 = −5 (පහළට); v = √(300 + 25) = 18.0 m s<sup>−1</sup>, තිරසට පහළින් tan⁻¹(5/17.3) = 16.1°') }] },
    { q: B('An aeroplane flies horizontally at 80 m s<sup>−1</sup>, 500 m above the ground, and drops a food packet. Ignore air resistance.', 'ගුවන් යානයක් බිමට 500 m ඉහළින් 80 m s<sup>−1</sup> වේගයෙන් තිරස්ව පියාසර කරමින් ආහාර පැකට්ටුවක් හෙළයි. වායු ප්‍රතිරෝධය නොසලකන්න.'), parts: [
      { q: B('How long does the packet take to reach the ground?', 'පැකට්ටුව බිමට ළඟා වීමට කොපමණ කාලයක් ගනීද?'), m: 2, lines: 1, a: B('500 = 5t² → t = 10 s', '500 = 5t² → t = 10 s') },
      { q: B('How far does it travel horizontally in that time?', 'එම කාලය තුළ එය තිරස්ව කොපමණ දුරක් ගමන් කරයිද?'), m: 2, lines: 1, a: B('80 × 10 = 800 m', '80 × 10 = 800 m') },
      { q: B('Where is the aeroplane when the packet lands? Explain.', 'පැකට්ටුව බිමට වැටෙන විට ගුවන් යානය කොතැනද? පැහැදිලි කරන්න.'), m: 2, a: B('Directly above it: both keep the same horizontal velocity, 80 m s<sup>−1</sup>.', 'එයට හරියටම ඉහළින්: දෙකම එකම තිරස් ප්‍රවේගය, 80 m s<sup>−1</sup> පවත්වා ගනී.') }] },
    { q: B('A long jumper takes off at 9 m s<sup>−1</sup> at 20° to the ground. (sin 40° = 0.643)', 'දුරපැනීම් ක්‍රීඩකයෙක් බිමට 20° ට 9 m s<sup>−1</sup> වේගයෙන් පනී. (sin 40° = 0.643)'), parts: [
      { q: B('Treating the jumper as a projectile landing at take-off height, find the length of the jump.', 'ක්‍රීඩකයා පැනි උසටම පතිත වන ප්‍රක්ෂිප්තයක් ලෙස සලකා පැනීමේ දුර සොයන්න.'), m: 2, lines: 2, a: B('R = 81 × 0.643 / 10 = 5.21 m', 'R = 81 × 0.643 / 10 = 5.21 m') },
      { q: B('What would the length be at 45° with the same speed?', 'එකම වේගයෙන් 45° ට පැන්නේ නම් දුර කීයද?'), m: 1, lines: 1, a: B('81 / 10 = 8.1 m', '81 / 10 = 8.1 m') },
      { q: B('Show that θ and 90° − θ give the same range.', 'θ සහ 90° − θ එකම පරාසය දෙන බව පෙන්වන්න.'), m: 2, lines: 2, a: B('sin 2(90° − θ) = sin (180° − 2θ) = sin 2θ, so R is the same.', 'sin 2(90° − θ) = sin (180° − 2θ) = sin 2θ, එබැවින් R සමාන වේ.') }] }
  ],
  summary: [
    B('Horizontal velocity is constant; vertical acceleration is g downwards.', 'තිරස් ප්‍රවේගය නියතය; සිරස් ත්වරණය පහළට g වේ.'),
    B('Resolve u: u cos θ across, u sin θ up. The two directions share only t.', 'u විභේදනය: තිරසට u cos θ, ඉහළට u sin θ. දිශා දෙකට පොදු වන්නේ t පමණි.'),
    B('x = (u cos θ) t; y = (u sin θ) t − ½gt². The path is a parabola.', 'x = (u cos θ) t; y = (u sin θ) t − ½gt². ගමන් පථය පරාවලයකි.'),
    B('T = 2u sin θ / g (landing at the same height).', 'T = 2u sin θ / g (එකම උසට පතිත වන විට).'),
    B('H = u² sin²θ / 2g', 'H = u² sin²θ / 2g'),
    B('R = u² sin 2θ / g, largest at 45°; θ and 90° − θ give the same range.', 'R = u² sin 2θ / g, 45° දී උපරිම; θ සහ 90° − θ එකම පරාසය දෙයි.'),
    B('At the top: v<sub>y</sub> = 0, but v<sub>x</sub> and g are not zero.', 'ඉහළම ලක්ෂ්‍යයේ: v<sub>y</sub> = 0, නමුත් v<sub>x</sub> සහ g ශූන්‍ය නොවේ.'),
    B('Thrown horizontally from height h: h = ½gt², x = ut — same fall time as a dropped object.', 'h උසක සිට තිරස්ව විසි කළ විට: h = ½gt², x = ut — අත හැරි වස්තුවකට සමාන පතන කාලය.')
  ],
  words: [B('horizontal', 'තිරස්'), B('vertical', 'සිරස්'), B('component', 'සංරචකය'), B('velocity', 'ප්‍රවේගය'), B('acceleration', 'ත්වරණය'), B('maximum height', 'උපරිම උස'), B('parabola', 'පරාවලය')]
};
