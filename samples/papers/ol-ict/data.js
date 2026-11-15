// O/L ICT — sample paper (Part A MCQ + Part B structured)
const K = 'stroke="#141414" stroke-width="1.3" fill="none"';
const AND = (x, y) => `<path d="M${x} ${y} H${x + 20} A15 15 0 0 1 ${x + 20} ${y + 30} H${x} Z" ${K}/>`;
const OR = (x, y) => `<path d="M${x} ${y} Q${x + 12} ${y + 15} ${x} ${y + 30} Q${x + 28} ${y + 30} ${x + 40} ${y + 15} Q${x + 28} ${y} ${x} ${y} Z" ${K}/>`;
const NOT = (x, y) => `<path d="M${x} ${y} L${x + 26} ${y + 12} L${x} ${y + 24} Z" ${K}/><circle cx="${x + 29.5}" cy="${y + 12}" r="3.5" ${K}/>`;
const W = d => `<path d="${d}" ${K}/>`;
const nandFig = SVG(200, 70, `${W('M20 28 H60 M20 42 H60')}${AND(60, 20)}${W('M95 35 H110')}${NOT(110, 23)}${W('M143 35 H170')}
  <text x="6" y="32">A</text><text x="6" y="46">B</text><text x="176" y="39">X</text>`);
const gateFig = SVG(240, 110, `${W('M20 23 H65 M20 37 H65')}${OR(60, 15)}${W('M20 82 H60')}${NOT(60, 70)}
  ${W('M100 30 H120 V48 H140')}${W('M93 82 H128 V62 H140')}${AND(140, 40)}${W('M175 55 H205')}
  <text x="6" y="27">A</text><text x="6" y="41">B</text><text x="6" y="86">C</text><text x="211" y="59">X</text>`);
const tt = fill => `<table class="tb"><tr><th>A</th><th>B</th><th>C</th><th>X</th></tr>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
  const a = i >> 2 & 1, b = i >> 1 & 1, c = i & 1, x = (a | b) & (1 - c); return `<tr><td>${a}</td><td>${b}</td><td>${c}</td><td class="e">${fill ? `<b>${x}</b>` : ''}</td></tr>`; }).join('')}</table>`;
const sheet = `<table class="tb"><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr>
  <tr><th>1</th><td class="l">Name</td><td>Maths</td><td>Science</td><td>Total</td><td>Result</td></tr>
  ${[['Nimal', 72, 65], ['Kasun', 48, 55], ['Amaya', 90, 84], ['Ravi', 35, 40]].map((r, i) => `<tr><th>${i + 2}</th><td class="l">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="e"></td><td class="e"></td></tr>`).join('')}
  <tr><th>6</th><td class="l">Highest</td><td></td><td></td><td class="e"></td><td></td></tr></table>`;
const py = s => `<pre class="code">${s}</pre>`;

window.PAPER = {
  code: 'OLI-S1', accent: '#1d3f6e',
  inst: { en: 'Kelani Academy · ICT class', si: 'කැලණි ඇකඩමිය · තොරතුරු හා සන්නිවේදන තාක්ෂණය පන්තිය' },
  subject: { en: 'Information & Communication Technology', si: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය' },
  title: { en: 'G.C.E. (O/L) — Term test, sample paper', si: 'අ.පො.ස. (සා.පෙළ) — වාර පරීක්ෂණය, ආදර්ශ ප්‍රශ්න පත්‍රය' },
  grade: { en: '10 – 11', si: '10 – 11' }, time: { en: '1 hour', si: 'පැය 1' }, marks: 50,
  instr: [
    { en: 'Answer <b>all</b> the questions.', si: '<b>සියලු ම</b> ප්‍රශ්නවලට පිළිතුරු සපයන්න.' },
    { en: 'Part A: choose the correct or most suitable answer and write its number in the box on the right.', si: 'A කොටස: නිවැරදි හෝ වඩාත් ගැළපෙන පිළිතුර තෝරා එහි අංකය දකුණු පස කොටුවේ ලියන්න.' },
    { en: 'Part B: write the answers in the space provided.', si: 'B කොටස: පිළිතුරු දී ඇති ඉඩෙහි ලියන්න.' }],
  parts: [
    { h: { en: 'Part A', si: 'A කොටස' }, note: { en: 'Multiple choice', si: 'බහුවරණ' }, mk: '10 × 2 = 20', qs: [
      { t: 'mcq', a: 2, q: { en: 'The decimal value of the binary number 101101<sub>2</sub> is', si: '101101<sub>2</sub> ද්විමය සංඛ්‍යාවේ දශම අගය වන්නේ' },
        opts: ['43', '45', '53', '91'], why: both('32 + 8 + 4 + 1') },
      { t: 'mcq', a: 1, q: { en: '200<sub>10</sub> written in hexadecimal is', si: '200<sub>10</sub> ෂඩ් දශම සංඛ්‍යාවක් ලෙස ලියූ විට' },
        opts: ['C8', '8C', '128', 'CC'], why: both('200 = 12 × 16 + 8 → C8') },
      { t: 'mcq', a: 3, q: { en: 'Which of the following is an input device?', si: 'පහත දැක්වෙන ඒවායින් ආදාන උපාංගයක් වන්නේ' },
        opts: [{ en: 'Monitor', si: 'මොනිටරය' }, { en: 'Printer', si: 'මුද්‍රණ යන්ත්‍රය' }, { en: 'Scanner', si: 'ස්කෑනරය' }, { en: 'Speaker', si: 'ස්පීකරය' }] },
      { t: 'mcq', a: 3, q: { en: 'How many bytes are there in 1 KB?', si: '1 KB ක බයිට් කීයක් තිබේ ද?' }, opts: ['1 000', '8', '1 024', '1 048 576'] },
      { t: 'mcq', a: 3, fig: nandFig, q: { en: 'The Boolean expression for the output X of this circuit is', si: 'මෙම පරිපථයේ X ප්‍රතිදානය සඳහා බූලියානු ප්‍රකාශනය වන්නේ' },
        opts: ['A · B', 'A + B', '<span class="sq">A · B</span>', '<span class="sq">A</span> · B'], why: { en: 'AND followed by NOT (a NAND gate).', si: 'AND ද්වාරයට පසු NOT ද්වාරය (NAND).' } },
      { t: 'mcq', a: 4, q: { en: 'In a spreadsheet A1 = 10 and A2 = 20. The value shown by the formula =A1+A2*2 is', si: 'පැතුරුම්පතක A1 = 10 හා A2 = 20 වේ. =A1+A2*2 සූත්‍රයෙන් ලැබෙන අගය වන්නේ' },
        opts: ['60', '40', '70', '50'], why: { en: 'multiplication first: 10 + 40', si: 'ගුණ කිරීම පළමුව: 10 + 40' } },
      { t: 'mcq', a: 2, q: { en: 'In which network topology is every computer connected to one central device such as a switch?', si: 'සෑම පරිගණකයක් ම ස්විචයක් වැනි එක් මධ්‍ය උපාංගයකට සම්බන්ධ වන්නේ කුමන ජාල ස්ථලකයේ ද?' },
        opts: [{ en: 'Bus', si: 'බස්' }, { en: 'Star', si: 'තාරකා' }, { en: 'Ring', si: 'මුදු' }, { en: 'Mesh', si: 'දැල්' }] },
      { t: 'mcq', a: 1, q: { en: 'Which of the following is a valid IPv4 address?', si: 'පහත දැක්වෙන ඒවායින් වලංගු IPv4 ලිපිනයක් වන්නේ' },
        opts: ['192.168.1.25', '192.168.1.256', '192.168.1', '192.168.1.2.5'], cols: 2, why: { en: 'four numbers, each from 0 to 255', si: '0 සිට 255 දක්වා සංඛ්‍යා හතරක්' } },
      { t: 'mcq', a: 1, q: { en: `What is printed by this Python program?${py('x = 5\nfor i in range(3):\n    x = x + i\nprint(x)')}`, si: `මෙම Python ක්‍රමලේඛයේ ප්‍රතිදානය කුමක් ද?${py('x = 5\nfor i in range(3):\n    x = x + i\nprint(x)')}` },
        opts: ['8', '5', '11', '15'], why: both('5 + 0 + 1 + 2') },
      { t: 'mcq', a: 4, q: { en: 'In a database table, the field that identifies each record uniquely is the', si: 'දත්ත සමුදා වගුවක එක් එක් වාර්තාව අනන්‍ය ලෙස හඳුනාගන්නා ක්ෂේත්‍රය වන්නේ' },
        opts: [{ en: 'foreign key', si: 'ආගන්තුක යතුර' }, { en: 'record', si: 'වාර්තාව' }, { en: 'field name', si: 'ක්ෂේත්‍ර නාමය' }, { en: 'primary key', si: 'ප්‍රාථමික යතුර' }] },
    ] },
    { h: { en: 'Part B', si: 'B කොටස' }, note: { en: 'Structured questions', si: 'ව්‍යුහගත ප්‍රශ්න' }, mk: '2 × 15 = 30', qs: [
      { t: 'struct', q: { en: 'Number systems and logic gates.', si: 'සංඛ්‍යා පද්ධති හා තාර්කික ද්වාර.' }, parts: [
        { m: 2, lines: 1, q: { en: 'Convert 87<sub>10</sub> to binary.', si: '87<sub>10</sub> ද්විමය සංඛ්‍යාවක් බවට හරවන්න.' }, a: both('1010111<sub>2</sub>') },
        { m: 2, lines: 1, q: { en: 'Convert your answer to (a) to octal.', si: '(a) හි පිළිතුර අෂ්ටමය සංඛ්‍යාවක් බවට හරවන්න.' }, a: both('001 010 111 → 127<sub>8</sub>') },
        { m: 2, lines: 1, q: { en: 'Convert 87<sub>10</sub> to hexadecimal.', si: '87<sub>10</sub> ෂඩ් දශම සංඛ්‍යාවක් බවට හරවන්න.' }, a: both('0101 0111 → 57<sub>16</sub>') },
        { m: 5, fig: { svg: `<div>${gateFig}</div><div>${tt(false)}</div>`, left: 1 }, q: { en: 'Complete the truth table for the circuit below.', si: 'පහත පරිපථය සඳහා සත්‍යතා වගුව සම්පූර්ණ කරන්න.' },
          a: { en: 'X = 1 only for rows 010, 100, 110', si: 'X = 1 වන්නේ 010, 100, 110 පේළිවල පමණි' }, afig: { svg: tt(true), left: 1 },
          why: { en: '½ mark per correct row, rounded up (max 5).', si: 'නිවැරදි පේළියකට ½ බැගින්, ඉහළට වට කරන්න (උපරිම 5).' } },
        { m: 2, lines: 1, q: { en: 'Write the Boolean expression for X.', si: 'X සඳහා බූලියානු ප්‍රකාශනය ලියන්න.' }, a: both('X = (A + B) · <span class="sq">C</span>') },
        { m: 2, lines: 1, q: { en: 'How many rows does a truth table for 4 inputs have?', si: 'ආදාන 4ක් සහිත සත්‍යතා වගුවක පේළි කීයක් තිබේ ද?' }, a: both('2<sup>4</sup> = 16') },
      ] },
      { t: 'struct', q: { en: `Part of a spreadsheet with the marks of four students is shown.${sheet}`, si: `සිසුන් හතර දෙනෙකුගේ ලකුණු ඇතුළත් පැතුරුම්පතක කොටසක් පහත දැක්වේ.${sheet}` }, parts: [
        { m: 2, lines: 1, q: { en: 'Write a formula for cell D2 to find the total marks of Nimal.', si: 'නිමල්ගේ මුළු ලකුණු ලබාගැනීමට D2 කෝෂයට සූත්‍රයක් ලියන්න.' }, a: both('=B2+C2 &nbsp;or&nbsp; =SUM(B2:C2)') },
        { m: 2, lines: 1, q: { en: 'Write a formula for cell D6 to find the highest total.', si: 'ඉහළ ම මුළු ලකුණ ලබාගැනීමට D6 කෝෂයට සූත්‍රයක් ලියන්න.' }, a: both('=MAX(D2:D5)') },
        { m: 3, lines: 1, q: { en: 'A student passes if the total is 100 or more. Write a formula for E2 that shows "Pass" or "Fail".', si: 'මුළු ලකුණු 100 හෝ ඊට වැඩි නම් ශිෂ්‍යයා සමත් වේ. E2 කෝෂයේ "Pass" හෝ "Fail" පෙන්වීමට සූත්‍රයක් ලියන්න.' },
          a: both('=IF(D2>=100,"Pass","Fail")'), why: { en: '1 for IF, 1 for the condition, 1 for both results.', si: 'IF සඳහා 1, කොන්දේසියට 1, ප්‍රතිඵල දෙකට 1.' } },
        { m: 3, lines: 1, q: { en: 'Write a formula to count how many students passed. What value will it show?', si: 'සමත් වූ සිසුන් ගණන ගණනය කිරීමට සූත්‍රයක් ලියන්න. එයින් පෙන්වන අගය කුමක් ද?' },
          a: both('=COUNTIF(E2:E5,"Pass") (2); 3 (1)') },
        { m: 5, lines: 5, q: { en: 'Write a Python program that reads the Maths and Science marks of a student and prints "Pass" or "Fail" by the same rule.', si: 'ශිෂ්‍යයෙකුගේ ගණිතය හා විද්‍යාව ලකුණු ආදානය කර ඉහත නීතියට අනුව "Pass" හෝ "Fail" මුද්‍රණය කරන Python ක්‍රමලේඛයක් ලියන්න.' },
          a: both(py('m = int(input("Maths: "))\ns = int(input("Science: "))\nif m + s >= 100:\n    print("Pass")\nelse:\n    print("Fail")')),
          why: { en: 'input + int (2), if / else with the condition (2), output (1).', si: 'input හා int (2), කොන්දේසිය සහිත if / else (2), ප්‍රතිදානය (1).' } },
      ] },
    ] },
  ],
};
