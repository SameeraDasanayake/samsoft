// A/L Physics — sample paper (Part A MCQ + Part B structured)
const res = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#141414" stroke-width="1.3"/>`;
const circuit = (cell, top, a, b, extra = '') => SVG(300, 140, `
  <g fill="none" stroke="#141414" stroke-width="1.3"><path d="M30 64 V22 H250 V118 H30 V72"/><path d="M190 22 V118"/></g>
  <path d="M16 64 H44" stroke="#141414" stroke-width="1.3"/><path d="M23 72 H37" stroke="#141414" stroke-width="3.2"/>
  ${res(82, 15, 52, 14)}${res(183, 46, 14, 46)}${res(243, 46, 14, 46)}
  <circle cx="190" cy="22" r="2.4" fill="#141414"/><circle cx="190" cy="118" r="2.4" fill="#141414"/>
  <text x="96" y="10" class="m">${top}</text><text x="146" y="74" class="m">${a}</text><text x="264" y="74" class="m">${b}</text>
  <text x="${extra ? 2 : 50}" y="${extra ? 98 : 72}" class="m">${cell}</text>${extra}`);
const mcqCirc = circuit('12 V', '4 Ω', '6 Ω', '3 Ω');
const q12Circ = circuit('E = 9 V', '4 Ω', '6 Ω', '12 Ω', `<rect x="4" y="50" width="52" height="34" fill="none" stroke="#141414" stroke-width=".8" stroke-dasharray="3 3"/><text x="2" y="112" class="m">r = 1 Ω</text>`);

const S = 8, ox = 30, oy = 56, path = Array.from({ length: 41 }, (_, i) => { const x = 34.64 * i / 40, y = 0.5774 * x - x * x / 60; return `${(ox + S * x).toFixed(1)},${(oy - S * y).toFixed(1)}`; }).join(' ');
const projFig = SVG(360, 84, `
  <g stroke="#141414" fill="none" stroke-width="1"><path d="M${ox} ${oy} H345"/></g>
  <polyline points="${path}" fill="none" stroke="#141414" stroke-width="1.4"/>
  <path d="M${ox} ${oy} l${(36 * 0.866).toFixed(1)} ${(-36 * 0.5).toFixed(1)}" stroke="#141414" stroke-width="1.6"/>
  <path d="M${(ox + 31.2).toFixed(1)} ${oy - 18} l-7.5 -0.6 l3.2 5.6 z" fill="#141414"/>
  ${arc(ox, oy, 14, 0, 30)}<text x="${ox + 17}" y="${oy - 2}" class="m">30°</text>
  <text x="${ox + 40}" y="${oy - 9}" class="m">20 m s⁻¹</text>
  <rect x="${ox + S * 26}" y="${oy - S * 3}" width="5" height="${S * 3}" fill="#141414"/>
  <text x="${ox + S * 26 + 9}" y="${oy - 6}" class="m">3.0 m</text>
  <path d="M${ox} ${oy + 10} H${ox + S * 26}" stroke="#141414" stroke-width=".8"/><path d="M${ox} ${oy + 6} v8 M${ox + S * 26} ${oy + 6} v8" stroke="#141414" stroke-width=".8"/>
  <text x="${ox + S * 13 - 12}" y="${oy + 20}" class="m">26 m</text><text x="${ox - 16}" y="${oy + 4}">O</text>`);

const v = s => `<i class="v">${s}</i>`;
window.PAPER = {
  code: 'ALP-S1', accent: '#5a2330',
  inst: { en: 'Kelani Academy · Physics class', si: 'කැලණි ඇකඩමිය · භෞතික විද්‍යාව පන්තිය' },
  subject: { en: 'Physics', si: 'භෞතික විද්‍යාව' },
  title: { en: 'G.C.E. (A/L) — Unit test: mechanics & electricity, sample paper', si: 'අ.පො.ස. (උ.පෙළ) — ඒකක පරීක්ෂණය: යාන්ත්‍ර විද්‍යාව හා විද්‍යුතය, ආදර්ශ ප්‍රශ්න පත්‍රය' },
  grade: { en: '12 – 13', si: '12 – 13' }, time: { en: '1 hour 15 minutes', si: 'පැය 1 මිනිත්තු 15' }, marks: 50,
  instr: [
    { en: 'Answer <b>all</b> the questions.', si: '<b>සියලු ම</b> ප්‍රශ්නවලට පිළිතුරු සපයන්න.' },
    { en: 'Part A: in each question choose the correct or most suitable answer from (1) – (5) and write its number in the box on the right.', si: 'A කොටස: එක් එක් ප්‍රශ්නයට (1) – (5) පිළිතුරුවලින් නිවැරදි හෝ වඩාත් ගැළපෙන පිළිතුර තෝරා එහි අංකය දකුණු පස කොටුවේ ලියන්න.' },
    { en: 'Part B: write the answers in the space provided.', si: 'B කොටස: පිළිතුරු දී ඇති ඉඩෙහි ලියන්න.' },
    { en: 'Take <i class="v">g</i> = 10 m s<sup>−2</sup>. Calculators are not allowed.', si: '<i class="v">g</i> = 10 m s<sup>−2</sup> ලෙස ගන්න. ගණක යන්ත්‍ර භාවිතයට ඉඩ නොදේ.' }],
  parts: [
    { h: { en: 'Part A', si: 'A කොටස' }, note: { en: 'Multiple choice', si: 'බහුවරණ' }, mk: '10 × 2 = 20', qs: [
      { t: 'mcq', a: 2, q: { en: 'The dimensions of pressure are', si: 'පීඩනයේ මාන වන්නේ' },
        opts: ['MLT<sup>−2</sup>', 'ML<sup>−1</sup>T<sup>−2</sup>', 'ML<sup>2</sup>T<sup>−2</sup>', 'ML<sup>−2</sup>T<sup>−2</sup>', 'MLT<sup>−1</sup>'], cols: 5,
        why: { en: 'pressure = force / area = MLT<sup>−2</sup> / L<sup>2</sup>', si: 'පීඩනය = බලය / වර්ගඵලය = MLT<sup>−2</sup> / L<sup>2</sup>' } },
      { t: 'mcq', a: 3, q: { en: 'A ball is thrown vertically upwards with a speed of 20 m s<sup>−1</sup>. The maximum height it reaches is', si: 'බෝලයක් 20 m s<sup>−1</sup> වේගයෙන් සිරස්ව ඉහළට විසි කරනු ලැබේ. එය ළඟා වන උපරිම උස වන්නේ' },
        opts: ['10 m', '40 m', '20 m', '2 m', '200 m'], cols: 5, why: both(`${v('v')}<sup>2</sup> = ${v('u')}<sup>2</sup> − 2${v('gh')} → ${v('h')} = 400 / 20`) },
      { t: 'mcq', a: 5, q: { en: 'A body is projected with a speed of 40 m s<sup>−1</sup> at 30° to the horizontal. Its time of flight is', si: 'වස්තුවක් තිරසට 30°ක කෝණයකින් 40 m s<sup>−1</sup> වේගයෙන් ප්‍රක්ෂේපණය කෙරේ. එහි පියාසර කාලය වන්නේ' },
        opts: ['2 s', '3.5 s', '6.9 s', '8 s', '4 s'], cols: 5, why: both(`${v('T')} = 2${v('u')} sin θ / ${v('g')} = 2 × 40 × 0.5 / 10`) },
      { t: 'mcq', a: 4, q: { en: 'A stone thrown at 15° to the horizontal has a horizontal range <i class="v">R</i>. With the same speed, the range is also <i class="v">R</i> when it is thrown at', si: 'තිරසට 15°ක් ආනතව විසි කළ ගලක තිරස් පරාසය <i class="v">R</i> වේ. එම වේගයෙන් ම විසි කළ විට පරාසය නැවත <i class="v">R</i> වන්නේ කුමන කෝණයකට ද?' },
        opts: ['30°', '45°', '60°', '75°', '90°'], cols: 5, why: { en: 'θ and (90° − θ) give the same range.', si: 'θ හා (90° − θ) කෝණ සඳහා පරාසය සමාන වේ.' } },
      { t: 'mcq', a: 3, fig: mcqCirc, q: { en: 'The cell in the circuit has an e.m.f. of 12 V and negligible internal resistance. The current drawn from the cell is', si: 'පරිපථයේ කෝෂයේ වි.ගා.බ. 12 V වන අතර අභ්‍යන්තර ප්‍රතිරෝධය නොසලකා හැරිය හැකි ය. කෝෂයෙන් ලබාගන්නා ධාරාව වන්නේ' },
        opts: ['1 A', '1.5 A', '2 A', '3 A', '0.92 A'], cols: 5, why: both('6 Ω ∥ 3 Ω = 2 Ω; 12 / (2 + 4)') },
      { t: 'mcq', a: 1, q: { en: 'A uniform wire of resistance <i class="v">R</i> is stretched to twice its length without changing its volume. Its new resistance is', si: 'ප්‍රතිරෝධය <i class="v">R</i> වූ ඒකාකාර කම්බියක් එහි පරිමාව නොවෙනස්ව දිග මෙන් දෙගුණයක් වන සේ අදිනු ලැබේ. එහි නව ප්‍රතිරෝධය වන්නේ' },
        opts: ['4<i class="v">R</i>', `${fr('<i class="v">R</i>', 2)}`, '<i class="v">R</i>', '2<i class="v">R</i>', '8<i class="v">R</i>'], cols: 5,
        why: { en: 'length × 2 and area ÷ 2, so <i class="v">R</i> = ρ<i class="v">l</i>/<i class="v">A</i> becomes 4 times.', si: 'දිග × 2 හා හරස්කඩ ÷ 2 නිසා <i class="v">R</i> = ρ<i class="v">l</i>/<i class="v">A</i> 4 ගුණයක් වේ.' } },
      { t: 'mcq', a: 4, q: { en: 'The heat needed to warm 2 kg of water from 30 °C to 80 °C is (specific heat capacity of water = 4 200 J kg<sup>−1</sup> K<sup>−1</sup>)', si: 'ජලය 2 kg ක් 30 °C සිට 80 °C දක්වා රත් කිරීමට අවශ්‍ය තාපය වන්නේ (ජලයේ විශිෂ්ට තාප ධාරිතාව = 4 200 J kg<sup>−1</sup> K<sup>−1</sup>)' },
        opts: ['210 kJ', '840 kJ', '42 kJ', '420 kJ', '672 kJ'], cols: 5, why: both('2 × 4 200 × 50 = 420 000 J') },
      { t: 'mcq', a: 3, q: { en: 'The speed of sound in air is 340 m s<sup>−1</sup>. The wavelength of a 680 Hz sound wave is', si: 'වාතයේ ධ්වනි වේගය 340 m s<sup>−1</sup> වේ. සංඛ්‍යාතය 680 Hz වූ ධ්වනි තරංගයක තරංග ආයාමය වන්නේ' },
        opts: ['2 m', '0.25 m', '0.5 m', '1 m', '4 m'], cols: 5, why: both(`λ = ${v('v')} / ${v('f')} = 340 / 680`) },
      { t: 'mcq', a: 2, q: { en: 'A 2 kg trolley moving at 3 m s<sup>−1</sup> collides with a 1 kg trolley at rest and they stick together. Their common speed is', si: '3 m s<sup>−1</sup> වේගයෙන් චලනය වන 2 kg ට්‍රොලියක් නිසලව ඇති 1 kg ට්‍රොලියක ගැටී දෙක එකට ඇලී යයි. ඒවායේ පොදු වේගය වන්නේ' },
        opts: ['1 m s<sup>−1</sup>', '2 m s<sup>−1</sup>', '1.5 m s<sup>−1</sup>', '3 m s<sup>−1</sup>', '6 m s<sup>−1</sup>'], cols: 5,
        why: { en: 'momentum is conserved: 2 × 3 = 3<i class="v">v</i>', si: 'ගම්‍යතාව සංස්ථිතික වේ: 2 × 3 = 3<i class="v">v</i>' } },
      { t: 'mcq', a: 1, q: { en: 'An object is placed 15 cm from a convex lens of focal length 10 cm. The distance of the image from the lens is', si: 'නාභි දුර 10 cm වූ උත්තල කාචයක සිට 15 cm දුරින් වස්තුවක් තබා ඇත. කාචයේ සිට ප්‍රතිබිම්බයට ඇති දුර වන්නේ' },
        opts: ['30 cm', '6 cm', '12 cm', '25 cm', '60 cm'], cols: 5, why: both(`${fr(1, v('v'))} = ${fr(1, 10)} − ${fr(1, 15)} = ${fr(1, 30)}`) },
    ] },
    { h: { en: 'Part B', si: 'B කොටස' }, note: { en: 'Structured questions', si: 'ව්‍යුහගත ප්‍රශ්න' }, mk: '2 × 15 = 30', qs: [
      { t: 'struct', fig: projFig, q: { en: 'A ball is kicked from O on level ground with a speed of 20 m s<sup>−1</sup> at 30° to the horizontal. Ignore air resistance. (sin 30° = 0.5, cos 30° = 0.87)', si: 'තිරස් පොළොවේ O ලක්ෂ්‍යයේ සිට තිරසට 30°ක කෝණයකින් 20 m s<sup>−1</sup> වේගයෙන් බෝලයකට පයින් ගසනු ලැබේ. වායු ප්‍රතිරෝධය නොසලකා හරින්න. (sin 30° = 0.5, cos 30° = 0.87)' }, parts: [
        { m: 3, lines: 2, q: { en: 'Find the horizontal and vertical components of the initial velocity.', si: 'ආරම්භක ප්‍රවේගයේ තිරස් හා සිරස් සංරචක සොයන්න.' },
          a: { en: 'horizontal 20 × 0.87 = 17.4 m s<sup>−1</sup> (1½); vertical 20 × 0.5 = 10 m s<sup>−1</sup> (1½)', si: 'තිරස් 20 × 0.87 = 17.4 m s<sup>−1</sup> (1½); සිරස් 20 × 0.5 = 10 m s<sup>−1</sup> (1½)' } },
        { m: 3, lines: 2, q: { en: 'Find the time taken to reach the maximum height, and the maximum height.', si: 'උපරිම උසට ළඟා වීමට ගත වන කාලය හා උපරිම උස සොයන්න.' },
          a: both(`0 = 10 − 10${v('t')} → ${v('t')} = 1 s (1); ${v('h')} = 10² / (2 × 10) = 5 m (2)`) },
        { m: 3, lines: 2, q: { en: 'Find the time of flight and the horizontal range.', si: 'පියාසර කාලය හා තිරස් පරාසය සොයන්න.' },
          a: both('2 × 1 = 2 s (1); 17.4 × 2 = 34.8 m (2)'), why: { en: 'Accept 34.6 m (using cos 30° = √3/2).', si: '34.6 m ද පිළිගන්න (cos 30° = √3/2 ලෙස ගත් විට).' } },
        { m: 4, lines: 3, q: { en: 'A wall 3.0 m high stands 26 m from O, as shown. Show by calculation whether the ball goes over the wall.', si: 'රූපයේ පරිදි O සිට 26 m දුරින් උස 3.0 m වූ බිත්තියක් ඇත. බෝලය බිත්තිය උඩින් යයි ද යන්න ගණනය කර පෙන්වන්න.' },
          a: { en: `${v('t')} = 26 / 17.4 = 1.49 s (1); ${v('y')} = 10(1.49) − 5(1.49)² = 3.8 m (2); 3.8 m > 3.0 m, so it goes over (1)`, si: `${v('t')} = 26 / 17.4 = 1.49 s (1); ${v('y')} = 10(1.49) − 5(1.49)² = 3.8 m (2); 3.8 m > 3.0 m නිසා උඩින් යයි (1)` } },
        { m: 2, lines: 1, q: { en: 'At which point of the path is the speed least? Write that speed.', si: 'පථයේ කුමන ලක්ෂ්‍යයේ දී වේගය අවම වේ ද? එම වේගය ලියන්න.' },
          a: { en: 'at the highest point (1); 17.4 m s<sup>−1</sup> (1)', si: 'ඉහළ ම ලක්ෂ්‍යයේ දී (1); 17.4 m s<sup>−1</sup> (1)' } },
      ] },
      { t: 'struct', fig: q12Circ, q: { en: 'A cell of e.m.f. <i class="v">E</i> = 9 V and internal resistance <i class="v">r</i> = 1 Ω is connected to three resistors as shown.', si: 'වි.ගා.බ. <i class="v">E</i> = 9 V හා අභ්‍යන්තර ප්‍රතිරෝධය <i class="v">r</i> = 1 Ω වූ කෝෂයක් රූපයේ පරිදි ප්‍රතිරෝධක තුනකට සම්බන්ධ කර ඇත.' }, parts: [
        { m: 2, lines: 1, q: { en: 'Find the equivalent resistance of the 6 Ω and 12 Ω resistors.', si: '6 Ω හා 12 Ω ප්‍රතිරෝධකවල සමක ප්‍රතිරෝධය සොයන්න.' }, a: both('(6 × 12) / (6 + 12) = 4 Ω') },
        { m: 3, lines: 2, q: { en: 'Find the current drawn from the cell.', si: 'කෝෂයෙන් ලබාගන්නා ධාරාව සොයන්න.' }, a: { en: `total = 4 + 4 + 1 = 9 Ω (2); ${v('I')} = 9 / 9 = 1 A (1)`, si: `මුළු ප්‍රතිරෝධය = 4 + 4 + 1 = 9 Ω (2); ${v('I')} = 9 / 9 = 1 A (1)` } },
        { m: 2, lines: 1, q: { en: 'Find the terminal potential difference of the cell.', si: 'කෝෂයේ අග්‍ර විභව අන්තරය සොයන්න.' }, a: both(`${v('V')} = ${v('E')} − ${v('Ir')} = 9 − 1 × 1 = 8 V`) },
        { m: 3, lines: 2, q: { en: 'Find the current through the 6 Ω resistor and through the 12 Ω resistor.', si: '6 Ω හා 12 Ω ප්‍රතිරෝධක හරහා ගලන ධාරා සොයන්න.' },
          a: { en: 'p.d. across them = 1 × 4 = 4 V (1); 4/6 = 0.67 A (1); 4/12 = 0.33 A (1)', si: 'ඒවා හරහා වි.අ. = 1 × 4 = 4 V (1); 4/6 = 0.67 A (1); 4/12 = 0.33 A (1)' } },
        { m: 2, lines: 1, q: { en: 'Find the power dissipated in the 4 Ω resistor.', si: '4 Ω ප්‍රතිරෝධකයේ ක්ෂමතා හානිය සොයන්න.' }, a: both(`${v('P')} = ${v('I')}²${v('R')} = 1² × 4 = 4 W`) },
        { m: 3, lines: 2, q: { en: 'How much energy is turned into heat inside the cell in 5 minutes?', si: 'මිනිත්තු 5ක දී කෝෂය තුළ තාපය බවට පත් වන ශක්තිය කොපමණ ද?' },
          a: both(`${v('I')}²${v('r')}${v('t')} = 1² × 1 × 300 (2) = 300 J (1)`) },
      ] },
    ] },
  ],
};
