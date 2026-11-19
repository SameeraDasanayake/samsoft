// Grade 5 Scholarship — sample paper
const sq = 26;
const fracFig = SVG(4 * sq + 2, 2 * sq + 2, [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${1 + (i % 4) * sq}" y="${1 + Math.floor(i / 4) * sq}" width="${sq}" height="${sq}" fill="${[0, 1, 4].includes(i) ? '#b8b8b8' : '#fff'}" stroke="#141414" stroke-width="1.2"/>`).join(''));
const tri = n => { let s = '', k = 0; for (let r = 0; k < n; r++) for (let c = 0; c <= r && k < n; c++, k++) s += `<circle cx="${c * 12 - r * 6}" cy="${r * 11}" r="3.6" fill="#141414"/>`; return s; };
const dotsFig = SVG(330, 66, [1, 3, 6, 10].map((n, i) => `<g transform="translate(${30 + i * 76},6)">${tri(n)}</g><text x="${26 + i * 76 - (n > 9 ? 3 : 0)}" y="62" class="m">${n}</text>`).join('') +
  `<text x="${30 + 4 * 76 - 6}" y="34" style="font-size:22px">?</text>`);
const g = 22, P = (x, y) => `${1 + x * g} ${1 + y * g}`;
const gridFig = SVG(6 * g + 2, 4 * g + 2,
  Array.from({ length: 7 }, (_, i) => `<path d="M${P(i, 0)} V${1 + 4 * g}" stroke="#9a9a9a" stroke-width=".7"/>`).join('') +
  Array.from({ length: 5 }, (_, i) => `<path d="M${P(0, i)} H${1 + 6 * g}" stroke="#9a9a9a" stroke-width=".7"/>`).join('') +
  `<path d="M${P(1, 0)} L${P(3, 0)} L${P(3, 2)} L${P(5, 2)} L${P(5, 3)} L${P(1, 3)} Z" fill="#14141433" stroke="#141414" stroke-width="2"/>`);

window.PAPER = {
  code: 'SCH5-S1', accent: '#e2601b',
  inst: { en: 'Kelani Academy · Scholarship class', si: 'කැලණි ඇකඩමිය · ශිෂ්‍යත්ව පන්තිය' },
  subject: { en: 'Grade 5 Scholarship', si: '5 ශ්‍රේණිය ශිෂ්‍යත්වය' },
  title: { en: 'Practice paper — Paper I, sample', si: 'පුහුණු ප්‍රශ්න පත්‍රය — I පත්‍රය, ආදර්ශය' },
  grade: { en: '5', si: '5' }, time: { en: '45 minutes', si: 'මිනිත්තු 45' }, marks: 40,
  instr: [
    { en: 'Answer <b>all</b> the questions. Each question carries 2 marks.', si: '<b>සියලු ම</b> ප්‍රශ්නවලට පිළිතුරු සපයන්න. එක් ප්‍රශ්නයකට ලකුණු 2 බැගින් හිමි වේ.' },
    { en: 'Part I: write the number of the correct answer in the box on the right.', si: 'I කොටස: නිවැරදි පිළිතුරේ අංකය දකුණු පස කොටුවේ ලියන්න.' },
    { en: 'Part II: write the answer in the box given.', si: 'II කොටස: පිළිතුර දී ඇති කොටුවේ ලියන්න.' }],
  parts: [
    { h: { en: 'Part I', si: 'I කොටස' }, note: { en: 'Choose the answer', si: 'පිළිතුර තෝරන්න' }, mk: '10 × 2 = 20', qs: [
      { t: 'mcq', a: 3, q: { en: 'What is the next number in the pattern 3, 7, 11, 15, … ?', si: '3, 7, 11, 15, … රටාවේ ඊළඟ සංඛ්‍යාව කුමක් ද?' }, opts: ['17', '18', '19', '21'], why: { en: 'add 4 each time', si: 'වරකට 4 බැගින් එකතු වේ' } },
      { t: 'mcq', a: 3, q: { en: 'Which one is different from the others?', si: 'අනෙක් ඒවාට වඩා වෙනස් වන්නේ කුමක් ද?' },
        opts: [{ en: 'mango', si: 'අඹ' }, { en: 'banana', si: 'කෙසෙල්' }, { en: 'carrot', si: 'කැරට්' }, { en: 'papaya', si: 'පැපොල්' }], why: { en: 'carrot is a vegetable, the others are fruits', si: 'කැරට් එළවළුවකි, අනෙක් ඒවා පලතුරු ය' } },
      { t: 'mcq', a: 2, q: { en: '2 kg 350 g + 1 kg 800 g =', si: '2 kg 350 g + 1 kg 800 g =' }, opts: ['3 kg 150 g', '4 kg 150 g', '4 kg 50 g', '3 kg 1 150 g'], cols: 4 },
      { t: 'mcq', a: 4, q: { en: 'A clock shows 3.45. What time will it show after 50 minutes?', si: 'ඔරලෝසුවක වේලාව 3.45 කි. මිනිත්තු 50කට පසු එහි පෙන්වන වේලාව කුමක් ද?' }, opts: ['4.25', '4.45', '3.95', '4.35'] },
      { t: 'mcq', a: 3, q: { en: 'Which solid has 6 faces that are all squares?', si: 'මුහුණත් 6 ම සමචතුරස්‍ර වූ ඝන වස්තුව කුමක් ද?' },
        opts: [{ en: 'sphere', si: 'ගෝලය' }, { en: 'cylinder', si: 'සිලින්ඩරය' }, { en: 'cube', si: 'ඝනකය' }, { en: 'cone', si: 'කේතුව' }] },
      { t: 'mcq', a: 1, q: { en: 'Which is the largest number?', si: 'විශාලතම සංඛ්‍යාව කුමක් ද?' }, opts: ['0.5', '0.45', '0.405', '0.054'] },
      { t: 'mcq', a: 2, q: { en: 'The longest river in Sri Lanka is the', si: 'ශ්‍රී ලංකාවේ දිගම ගඟ වන්නේ' },
        opts: [{ en: 'Kelani', si: 'කැලණි ගඟ' }, { en: 'Mahaweli', si: 'මහවැලි ගඟ' }, { en: 'Walawe', si: 'වලවේ ගඟ' }, { en: 'Kalu', si: 'කළු ගඟ' }] },
      { t: 'mcq', a: 2, q: { en: 'Which of these animals is a mammal?', si: 'මෙම සතුන් අතුරින් ක්ෂීරපායියෙකු වන්නේ' },
        opts: [{ en: 'crocodile', si: 'කිඹුලා' }, { en: 'dolphin', si: 'ඩොල්ෆින්' }, { en: 'shark', si: 'මෝරා' }, { en: 'frog', si: 'ගෙම්බා' }] },
      { t: 'mcq', a: 4, q: { en: 'Amal buys 3 books at Rs. 245 each and pays with a Rs. 1 000 note. How much change does he get?', si: 'අමල් රු. 245 බැගින් වූ පොත් 3ක් මිලදී ගෙන රු. 1 000 නෝට්ටුවක් දෙයි. ඔහුට ලැබෙන ඉතිරි මුදල කීය ද?' },
        opts: ['Rs. 735', 'Rs. 255', 'Rs. 275', 'Rs. 265'], why: both('1 000 − 3 × 245 = 1 000 − 735') },
      { t: 'mcq', a: 3, fig: fracFig, q: { en: 'What fraction of the shape is shaded?', si: 'රූපයේ අඳුරු කළ කොටස භාගයක් ලෙස කීය ද?' }, opts: [fr(5, 8), fr(8, 3), fr(3, 8), fr(3, 5)] },
    ] },
    { h: { en: 'Part II', si: 'II කොටස' }, note: { en: 'Write the answer', si: 'පිළිතුර ලියන්න' }, mk: '10 × 2 = 20', qs: [
      { t: 'short', m: 2, box: ' ', q: { en: 'Find the value: 25 × 4 × 7', si: 'අගය සොයන්න: 25 × 4 × 7' }, a: both('700') },
      { t: 'short', m: 2, box: ' ', q: { en: 'Write in numbers: three thousand and five', si: 'ඉලක්කම්වලින් ලියන්න: තුන්දහස් පහ' }, a: both('3 005') },
      { t: 'short', m: 2, box: 'cm', q: { en: 'A rectangle is 12 cm long and 5 cm wide. Find its perimeter.', si: 'සෘජුකෝණාස්‍රයක දිග 12 cm ද පළල 5 cm ද වේ. එහි පරිමිතිය සොයන්න.' }, a: both('34 cm'), why: both('2 × (12 + 5)') },
      { t: 'short', m: 2, box: [{ en: 'h', si: 'පැය' }, { en: 'min', si: 'මිනිත්තු' }], q: { en: 'A bus leaves at 7.40 a.m. and arrives at 10.15 a.m. How long is the journey?', si: 'බස් රථයක් පෙ.ව. 7.40ට පිටත් වී පෙ.ව. 10.15ට ගමනාන්තයට පැමිණේ. ගමනට ගත වූ කාලය කොපමණ ද?' },
        a: { en: '2 h 35 min', si: 'පැය 2 මිනිත්තු 35' } },
      { t: 'short', m: 2, box: { en: 'years', si: 'අවුරුදු' }, q: { en: 'Nimal is 3 years older than Kamal. The sum of their ages is 23 years. How old is Nimal?', si: 'නිමල් කමල්ට වඩා අවුරුදු 3කින් වැඩිමල් ය. ඔවුන්ගේ වයස්වල එකතුව අවුරුදු 23කි. නිමල්ගේ වයස කීය ද?' },
        a: { en: '13 years', si: 'අවුරුදු 13' }, why: { en: 'Kamal = (23 − 3) ÷ 2 = 10', si: 'කමල් = (23 − 3) ÷ 2 = 10' } },
      { t: 'short', m: 2, box: { en: 'days', si: 'දින' }, q: { en: 'How many days are there in February of a leap year?', si: 'අධික අවුරුද්දක පෙබරවාරි මාසයේ දින කීයක් තිබේ ද?' }, a: { en: '29 days', si: 'දින 29' } },
      { t: 'short', m: 2, box: ' ', fig: dotsFig, q: { en: 'How many dots will the next shape in the pattern have?', si: 'රටාවේ ඊළඟ රූපයේ තිත් කීයක් තිබේ ද?' }, a: both('15'), why: { en: 'add 2, 3, 4, then 5', si: '2, 3, 4, ඊළඟට 5 බැගින් එකතු වේ' } },
      { t: 'short', m: 2, box: ' ', q: { en: `Find the value: ${fr(1, 2)} of ${fr(1, 4)} of 64`, si: `64 න් ${fr(1, 4)} ක ${fr(1, 2)} ක් කීය ද?` }, a: both('8') },
      { t: 'short', m: 2, box: 'cm<sup>2</sup>', fig: gridFig, q: { en: 'Each small square is 1 cm<sup>2</sup>. Find the area of the shaded shape.', si: 'එක් කුඩා කොටුවක වර්ගඵලය 1 cm<sup>2</sup> වේ. අඳුරු කළ රූපයේ වර්ගඵලය සොයන්න.' }, a: both('8 cm<sup>2</sup>') },
      { t: 'short', m: 2, box: ' ', q: { en: 'A ribbon 5 m long is cut into pieces of 25 cm each. How many pieces are there?', si: 'දිග 5 m වූ පීත්ත පටියක් 25 cm බැගින් වූ කෑලිවලට කපනු ලැබේ. කෑලි කීයක් ලැබේ ද?' }, a: both('20'), why: both('500 ÷ 25') },
    ] },
  ],
};
