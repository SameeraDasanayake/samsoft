// O/L Mathematics — sample paper (Part A short answers + Part B structured)
const triFig = SVG(250, 165, `
  <g fill="none" stroke="#141414" stroke-width="1.3"><path d="M20 150 L225 150"/><path d="M20 150 L83.8 6.7 L160 150"/></g>
  ${arc(83.8, 6.7, 20, 246, 298)}${arc(160, 150, 18, 0, 118)}
  <text x="76" y="4">A</text><text x="6" y="160">B</text><text x="155" y="164">C</text><text x="228" y="160">D</text>
  <text x="74" y="44">52°</text><text x="176" y="128">118°</text>`);
const circFig = SVG(200, 165, `
  <circle cx="100" cy="90" r="60" fill="none" stroke="#141414" stroke-width="1.3"/>
  <g fill="none" stroke="#141414" stroke-width="1.1"><path d="M50.9 124.4 L100 90 L149.1 124.4"/><path d="M50.9 124.4 L89.6 30.9 L149.1 124.4"/></g>
  ${arc(100, 90, 13, 215, 325)}<circle cx="100" cy="90" r="2" fill="#141414"/>
  <text x="104" y="86">O</text><text x="84" y="25">C</text><text x="36" y="134">A</text><text x="153" y="134">B</text><text x="88" y="119">110°</text>`);
const tankFig = SVG(260, 165, `
  <g fill="none" stroke="#141414" stroke-width="1.3">
    <path d="M20 50 H180 V140 H20 Z"/><path d="M20 50 L62 20 H222 L180 50"/><path d="M222 20 V110 L180 140"/></g>
  <g fill="none" stroke="#141414" stroke-width=".9" stroke-dasharray="4 3"><path d="M20 140 L62 110 H222"/><path d="M62 20 V110"/></g>
  <text x="88" y="158" class="m">2 m</text><text x="228" y="70" class="m">1.2 m</text><text x="200" y="134" class="m">1.5 m</text>`);
const stats = (fill) => `<table class="tb"><tr><th>${fill.h[0]}</th><th>${fill.h[1]}</th><th>${fill.h[2]}</th><th><i class="v">fx</i></th></tr>
  ${[['0 - 10', 3, 5, 15], ['10 - 20', 7, 15, 105], ['20 - 30', 12, 25, 300], ['30 - 40', 10, 35, 350], ['40 - 50', 8, 45, 360]]
    .map(([c, f, x, fx], i) => `<tr><td>${c}</td><td>${f}</td><td${fill.on || i < 2 ? '' : ' class="e"'}>${fill.on || i < 2 ? x : ''}</td><td${fill.on || i < 2 ? '' : ' class="e"'}>${fill.on || i < 2 ? fx : ''}</td></tr>`).join('')}
  <tr><th>${fill.h[3]}</th><th>40</th><th></th><th${fill.on ? '' : ' class="e"'}>${fill.on ? '1130' : ''}</th></tr></table>`;
const statH = { en: ['Marks (class interval)', 'No. of students (<i class="v">f</i>)', 'Mid value (<i class="v">x</i>)', 'Total'],
                si: ['ලකුණු (පන්ති ප්‍රාන්තරය)', 'සිසුන් ගණන (<i class="v">f</i>)', 'මධ්‍ය අගය (<i class="v">x</i>)', 'එකතුව'] };

window.PAPER = {
  code: 'OLM-S1', accent: '#1f4e3d',
  inst: { en: 'Kelani Academy · Mathematics class', si: 'කැලණි ඇකඩමිය · ගණිතය පන්තිය' },
  subject: { en: 'Mathematics', si: 'ගණිතය' },
  title: { en: 'G.C.E. (O/L) — Term test, sample paper', si: 'අ.පො.ස. (සා.පෙළ) — වාර පරීක්ෂණය, ආදර්ශ ප්‍රශ්න පත්‍රය' },
  grade: { en: '11', si: '11' }, time: { en: '1 hour', si: 'පැය 1' }, marks: 40,
  instr: [
    { en: 'Answer <b>all</b> the questions.', si: '<b>සියලු ම</b> ප්‍රශ්නවලට පිළිතුරු සපයන්න.' },
    { en: 'Write the answers and the working in the space provided.', si: 'පිළිතුරු හා ගණනය කිරීම් දී ඇති ඉඩෙහි ම ලියන්න.' },
    { en: 'Part A: 2 marks for each question. Part B: 10 marks for each question.', si: 'A කොටස: එක් ප්‍රශ්නයකට ලකුණු 2 බැගින්. B කොටස: එක් ප්‍රශ්නයකට ලකුණු 10 බැගින්.' },
    { en: 'Use π = <span class="fr"><i>22</i><i>7</i></span> where needed.', si: 'අවශ්‍ය තැන්හි π = <span class="fr"><i>22</i><i>7</i></span> ලෙස ගන්න.' }],
  parts: [
    { h: { en: 'Part A', si: 'A කොටස' }, note: { en: 'Short answers', si: 'කෙටි පිළිතුරු' }, mk: { en: '10 × 2 = 20', si: '10 × 2 = 20' }, qs: [
      { t: 'short', m: 2, lines: 2, q: { en: `Simplify: ${mx(2, 1, 3)} + ${mx(1, 1, 2)}`, si: `සුළු කරන්න: ${mx(2, 1, 3)} + ${mx(1, 1, 2)}` },
        a: mx(3, 5, 6), why: both(`${fr(14, 6)} + ${fr(9, 6)} = ${fr(23, 6)} (1)`) },
      { t: 'short', m: 2, lines: 2, q: { en: 'Factorise: <i class="v">x</i><sup>2</sup> − 5<i class="v">x</i> + 6', si: 'සාධක සොයන්න: <i class="v">x</i><sup>2</sup> − 5<i class="v">x</i> + 6' },
        a: both('(<i class="v">x</i> − 2)(<i class="v">x</i> − 3)'), why: { en: '1 mark for one correct factor.', si: 'එක් නිවැරදි සාධකයකට ලකුණු 1.' } },
      { t: 'short', m: 2, lines: 2, q: { en: 'A shopkeeper sold an item for Rs. 1 380 and made a profit of 15%. Find the cost price.', si: 'වෙළෙන්දෙක් භාණ්ඩයක් රු. 1 380කට විකුණා 15%ක ලාභයක් ලැබී ය. එහි ගැනුම් මිල සොයන්න.' },
        a: both('Rs. 1 200'), why: { en: '1 380 × <span class="fr"><i>100</i><i>115</i></span> (1)', si: '1 380 × <span class="fr"><i>100</i><i>115</i></span> (1)' } },
      { t: 'short', m: 2, lines: 2, q: { en: 'Solve: 2(<i class="v">x</i> − 3) = <i class="v">x</i> + 4', si: 'විසඳන්න: 2(<i class="v">x</i> − 3) = <i class="v">x</i> + 4' },
        a: both('<i class="v">x</i> = 10'), why: both('2<i class="v">x</i> − 6 = <i class="v">x</i> + 4 (1)') },
      { t: 'short', m: 2, lines: 1, fig: triFig, q: { en: 'In the figure, BCD is a straight line. Using the data, find the magnitude of ∠ABC.', si: 'රූපයේ BCD සරල රේඛාවකි. දී ඇති දත්ත ඇසුරෙන් ∠ABC හි විශාලත්වය සොයන්න.' },
        a: both('66°'), why: { en: 'Exterior angle = sum of the two interior opposite angles: 118° − 52° (1)', si: 'බාහිර කෝණය = අභ්‍යන්තර සම්මුඛ කෝණ දෙකේ එකතුව: 118° − 52° (1)' } },
      { t: 'short', m: 2, lines: 1, fig: circFig, q: { en: 'O is the centre of the circle and A, B, C lie on the circle. If ∠AOB = 110°, find ∠ACB.', si: 'O වෘත්තයේ කේන්ද්‍රය වන අතර A, B, C වෘත්තය මත පිහිටයි. ∠AOB = 110° නම් ∠ACB සොයන්න.' },
        a: both('55°'), why: { en: 'Angle at the centre = 2 × angle on the circumference (1)', si: 'කේන්ද්‍රයේ කෝණය = පරිධියේ කෝණය මෙන් දෙගුණයකි (1)' } },
      { t: 'short', m: 2, lines: 2, q: { en: 'Find the volume of a cylinder of radius 7 cm and height 10 cm.', si: 'අරය 7 cm හා උස 10 cm වූ සිලින්ඩරයක පරිමාව සොයන්න.' },
        a: both('1 540 cm<sup>3</sup>'), why: both(`${fr(22, 7)} × 7 × 7 × 10 (1)`) },
      { t: 'short', m: 2, lines: 1, q: { en: 'A bag has 3 red balls and 5 blue balls of the same size. One ball is taken at random. What is the probability that it is red?', si: 'බෑගයක එක ම ප්‍රමාණයේ රතු බෝල 3ක් හා නිල් බෝල 5ක් ඇත. සසම්භාවී ලෙස එක් බෝලයක් ගත් විට එය රතු බෝලයක් වීමේ සම්භාවිතාව කීය ද?' },
        a: fr(3, 8), why: { en: '1 mark for 3 out of 8 with a wrong form.', si: 'ආකාරය වැරදි වුවද 8න් 3 සඳහා ලකුණු 1.' } },
      { t: 'short', m: 2, lines: 1, q: { en: 'Write 0.000 452 in scientific notation.', si: '0.000 452 විද්‍යාත්මක අංකනයෙන් ලියන්න.' },
        a: both('4.52 × 10<sup>−4</sup>'), why: { en: '1 mark for 4.52 with a wrong power.', si: 'බලය වැරදි නම් 4.52 සඳහා ලකුණු 1.' } },
      { t: 'short', m: 2, lines: 2, q: { en: 'Write the gradient and the intercept on the <i class="v">y</i>-axis of the straight line 2<i class="v">y</i> = 6<i class="v">x</i> − 4.', si: '2<i class="v">y</i> = 6<i class="v">x</i> − 4 සරල රේඛාවේ අනුක්‍රමණය හා <i class="v">y</i> අක්ෂයේ අන්තඃඛණ්ඩය ලියන්න.' },
        a: { en: 'gradient = 3, intercept = −2', si: 'අනුක්‍රමණය = 3, අන්තඃඛණ්ඩය = −2' }, why: { en: '1 mark each.', si: 'එකකට ලකුණු 1 බැගින්.' } },
    ] },
    { h: { en: 'Part B', si: 'B කොටස' }, note: { en: 'Structured questions', si: 'ව්‍යුහගත ප්‍රශ්න' }, mk: { en: '2 × 10 = 20', si: '2 × 10 = 20' }, qs: [
      { t: 'struct', fig: tankFig, q: { en: 'A water tank is in the shape of a cuboid. Its inside length is 2 m, width 1.5 m and height 1.2 m.', si: 'ජල ටැංකියක් ඝනකාභයක හැඩයෙන් යුක්ත ය. එහි ඇතුළත දිග 2 m, පළල 1.5 m හා උස 1.2 m වේ.' }, parts: [
        { m: 2, lines: 2, q: { en: 'Find the volume of the tank in cubic metres.', si: 'ටැංකියේ පරිමාව ඝන මීටරවලින් සොයන්න.' }, a: both('2 × 1.5 × 1.2 = 3.6 m<sup>3</sup>') },
        { m: 2, lines: 1, q: { en: 'How many litres of water can the tank hold? (1 m<sup>3</sup> = 1 000 l)', si: 'ටැංකියට ජලය ලීටර කීයක් දැරිය හැකි ද? (1 m<sup>3</sup> = 1 000 l)' }, a: both('3.6 × 1 000 = 3 600 l') },
        { m: 3, lines: 2, q: { en: 'Water flows into the empty tank at 20 litres per minute. How long does it take to fill the tank? Give the answer in hours.', si: 'හිස් ටැංකියට මිනිත්තුවකට ලීටර 20ක් බැගින් ජලය ගලා එයි. ටැංකිය පිරීමට ගත වන කාලය පැයවලින් සොයන්න.' },
          a: { en: '3 600 ÷ 20 = 180 minutes (2) = 3 hours (1)', si: '3 600 ÷ 20 = මිනිත්තු 180 (2) = පැය 3 (1)' } },
        { m: 3, lines: 2, q: { en: 'The four vertical faces inside the tank are to be painted. Find the area to be painted.', si: 'ටැංකියේ ඇතුළත සිරස් මුහුණත් හතර තීන්ත ආලේප කළ යුතු ය. තීන්ත ආලේප කළ යුතු වර්ගඵලය සොයන්න.' },
          a: both('2(2 × 1.2) + 2(1.5 × 1.2) = 4.8 + 3.6 = 8.4 m<sup>2</sup>'), why: { en: '1 mark for each pair of faces, 1 for the total.', si: 'මුහුණත් යුගලයකට ලකුණු 1 බැගින්, එකතුවට ලකුණු 1.' } },
      ] },
      { t: 'struct', q: { en: `The marks of 40 students in a test are given in the table.${stats({ h: statH.en })}`, si: `පරීක්ෂණයක දී සිසුන් 40 දෙනෙකු ලබාගත් ලකුණු වගුවේ දැක්වේ.${stats({ h: statH.si })}` }, parts: [
        { m: 1, lines: 1, q: { en: 'Write the modal class.', si: 'මාත පන්තිය ලියන්න.' }, a: both('20 - 30') },
        { m: 3, q: { en: 'Fill in the empty cells of the table.', si: 'වගුවේ හිස් කොටු සම්පූර්ණ කරන්න.' }, a: { en: 'mid values 25, 35, 45; <i class="v">fx</i> 300, 350, 360; total 1 130', si: 'මධ්‍ය අගය 25, 35, 45; <i class="v">fx</i> 300, 350, 360; එකතුව 1 130' },
          why: { en: '1 for mid values, 1 for fx, 1 for the total.', si: 'මධ්‍ය අගයන්ට 1, fx අගයන්ට 1, එකතුවට 1.' } },
        { m: 3, lines: 2, q: { en: 'Find the mean mark.', si: 'මධ්‍යන්‍ය ලකුණ සොයන්න.' }, a: both(`${fr('1 130', '40')} = 28.25`), why: { en: '2 marks for the method, 1 for the answer.', si: 'ක්‍රමයට ලකුණු 2, පිළිතුරට 1.' } },
        { m: 3, lines: 2, q: { en: 'Students with 30 marks or more pass. What percentage of the students passed?', si: 'ලකුණු 30 හෝ ඊට වැඩි ලබාගත් සිසුන් සමත් වේ. සමත් වූ සිසුන්ගේ ප්‍රතිශතය කීය ද?' },
          a: both(`10 + 8 = 18 (1); ${fr(18, 40)} × 100 (1) = 45% (1)`) },
      ] },
    ] },
  ],
};
