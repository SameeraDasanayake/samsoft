/* Samsoft LMS demo - sample data (O/L ICT tuition class). All names are fictional. */
(function () {
  'use strict';
  let seed = 20261115;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const teacher = { name: 'Dilan Weerasinghe', brand: 'WEERA', sub: 'ICT', town: 'Nugegoda', fee: 2500 };

  const units = {
    U01: { code: 'U01', en: 'Data & information', si: 'දත්ත හා තොරතුරු', color: '#e8d6a8' },
    U02: { code: 'U02', en: 'Number systems', si: 'සංඛ්‍යා පද්ධති', color: '#d4ff3a' },
    U03: { code: 'U03', en: 'Logic gates', si: 'තාර්කික ද්වාර', color: '#ff6a3d' },
    U04: { code: 'U04', en: 'Operating systems', si: 'මෙහෙයුම් පද්ධති', color: '#3ec5ff' },
    U05: { code: 'U05', en: 'Spreadsheets', si: 'පැතුරුම්පත්', color: '#39e6a7' },
    U06: { code: 'U06', en: 'Databases', si: 'දත්ත සමුදාය', color: '#ffb020' },
    U07: { code: 'U07', en: 'Networks', si: 'පරිගණක ජාල', color: '#ff4f7e' }
  };

  const toSec = s => s.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
  const generic = [
    [0, 'Introduction', 'හැඳින්වීම'], [0.12, 'Theory', 'න්‍යාය'],
    [0.45, 'Worked examples', 'විසඳූ උදාහරණ'], [0.78, 'Past paper questions', 'පසුගිය විභාග ප්‍රශ්න']
  ];
  const L = (id, unit, en, si, dur, date, board, views, chapters) => ({
    id, n: id.slice(1), unit, en, si, dur, sec: toSec(dur), date, board, views, chapters: chapters || generic
  });
  const lessons = [
    L('L01', 'U01', 'Data and information', 'දත්ත සහ තොරතුරු', '48:12', '2026-08-29', 'Data → Process → Information', 36),
    L('L02', 'U02', 'Binary numbers', 'ද්විමය සංඛ්‍යා', '1:02:40', '2026-09-05', '1011₂ = 8 + 0 + 2 + 1 = 11₁₀', 38),
    L('L03', 'U02', 'Binary ↔ decimal practice', 'ද්විමය ↔ දශමය පුහුණුව', '55:08', '2026-09-12', '25₁₀ = 11001₂', 37),
    L('L04', 'U02', 'Octal and hexadecimal', 'අෂ්ටමය සහ ෂඩ් දශමය', '58:30', '2026-09-19', '2F₁₆ = 2×16 + 15 = 47₁₀', 35),
    L('L05', 'U03', 'AND, OR, NOT gates', 'AND, OR, NOT ද්වාර', '1:05:10', '2026-09-26', 'Y = A · B', 36),
    L('L06', 'U03', 'Truth tables and circuits', 'සත්‍යතා වගු සහ පරිපථ', '52:44', '2026-10-03', 'Y = (A + B) · C̄', 33),
    L('L07', 'U04', 'What an operating system does', 'මෙහෙයුම් පද්ධතියක කාර්යයන්', '49:05', '2026-10-10', 'CPU · Memory · Files · Devices', 34),
    L('L08', 'U04', 'Files and folders', 'ගොනු සහ ෆෝල්ඩර කළමනාකරණය', '41:20', '2026-10-17', 'C:\\Users\\Sanduni\\ICT\\notes.docx', 31),
    L('L09', 'U05', 'Formulas and functions', 'සූත්‍ර සහ ශ්‍රිත', '1:10:02', '2026-10-24', '=SUM(A1:A4)   =AVERAGE(B2:B9)', 35),
    L('L10', 'U06', 'Tables and keys', 'වගු සහ යතුරු', '59:15', '2026-10-31', 'PRIMARY KEY → StudentID', 33),
    L('L11', 'U07', 'Network topologies', 'ජාල ස්ථලක', '54:33', '2026-11-07', 'Bus · Star · Ring · Mesh', 32),
    L('L12', 'U07', 'Network devices and IP', 'ජාල උපාංග සහ IP ලිපින', '1:01:47', '2026-11-14', 'Hub → Switch → Router', 27, [
      [0, 'Why networks need devices', 'ජාලවලට උපාංග අවශ්‍ය ඇයි'], [0.14, 'Hub and switch', 'Hub සහ Switch'],
      [0.38, 'Router and modem', 'Router සහ Modem'], [0.62, 'IP addresses', 'IP ලිපින'],
      [0.84, 'Past paper questions', 'පසුගිය විභාග ප්‍රශ්න']
    ])
  ];

  const papers = [
    { id: 'P01', en: 'Number systems', si: 'සංඛ්‍යා පද්ධති', date: '2026-09-20', nq: 20, diff: 2 },
    { id: 'P02', en: 'Logic gates', si: 'තාර්කික ද්වාර', date: '2026-10-04', nq: 20, diff: -5 },
    { id: 'P03', en: 'Operating systems', si: 'මෙහෙයුම් පද්ධති', date: '2026-10-11', nq: 20, diff: 6 },
    { id: 'P04', en: 'Spreadsheets', si: 'පැතුරුම්පත්', date: '2026-10-25', nq: 20, diff: 1 },
    { id: 'P05', en: 'Databases', si: 'දත්ත සමුදාය', date: '2026-11-01', nq: 20, diff: -2 },
    { id: 'P06', en: 'Networks', si: 'පරිගණක ජාල', date: '2026-11-08', nq: 20, diff: 3 },
    { id: 'P07', en: 'Term test model paper', si: 'වාර පරීක්ෂණ ආදර්ශ ප්‍රශ්න පත්‍රය', date: '2026-11-14', nq: 40, diff: -4 }
  ];

  /* The live paper students can take in the demo */
  const live = {
    id: 'P08', en: 'Revision: mixed', si: 'පුනරීක්ෂණය: මිශ්‍ර', date: '2026-11-15', closes: '2026-11-21', minutes: 15,
    qs: [
      { en: 'What is the decimal value of the binary number 1011₂?', si: 'ද්විමය සංඛ්‍යාව 1011₂ හි දශමය අගය කුමක්ද?',
        o: [['9', '9'], ['10', '10'], ['11', '11'], ['13', '13']], a: 2, topic: 'U02' },
      { en: 'Which binary number equals 25₁₀?', si: '25₁₀ ට සමාන ද්විමය සංඛ්‍යාව කුමක්ද?',
        o: [['10011₂', '10011₂'], ['11001₂', '11001₂'], ['11010₂', '11010₂'], ['10101₂', '10101₂']], a: 1, topic: 'U02' },
      { en: 'What is the decimal value of 2F₁₆?', si: 'ෂඩ් දශමය සංඛ්‍යාව 2F₁₆ හි දශමය අගය කුමක්ද?',
        o: [['45', '45'], ['47', '47'], ['32', '32'], ['215', '215']], a: 1, topic: 'U02' },
      { en: 'Which logic gate gives output 1 only when all its inputs are 1?', si: 'සියලුම ප්‍රදාන 1 වූ විට පමණක් ප්‍රතිදානය 1 වන තාර්කික ද්වාරය කුමක්ද?',
        o: [['OR', 'OR'], ['NOT', 'NOT'], ['AND', 'AND'], ['NOR', 'NOR']], a: 2, topic: 'U03' },
      { en: 'How many bits are there in one byte?', si: 'බයිට් එකක ඇති බිටු ගණන කීයද?',
        o: [['4', '4'], ['8', '8'], ['16', '16'], ['1024', '1024']], a: 1, topic: 'U02' },
      { en: 'Which one of these is an operating system?', si: 'පහත දැක්වෙන ඒවායින් මෙහෙයුම් පද්ධතියක් වන්නේ කුමක්ද?',
        o: [['Microsoft Word', 'Microsoft Word'], ['Linux', 'Linux'], ['Google Chrome', 'Google Chrome'], ['Python', 'Python']], a: 1, topic: 'U04' },
      { en: 'Cells A1 to A4 hold 5, 10, 15 and 20. What does =SUM(A1:A4) show?', si: 'A1 සිට A4 දක්වා කෝෂවල 5, 10, 15, 20 ඇත. =SUM(A1:A4) සූත්‍රයෙන් ලැබෙන අගය කුමක්ද?',
        o: [['40', '40'], ['45', '45'], ['50', '50'], ['20', '20']], a: 2, topic: 'U05' },
      { en: 'Which device forwards data packets between two different networks?', si: 'වෙනස් ජාල දෙකක් අතර දත්ත පැකට් යොමු කරන උපාංගය කුමක්ද?',
        o: [['Hub', 'Hub'], ['Switch', 'Switch'], ['Router', 'Router (මාර්ගකාරකය)'], ['Repeater', 'Repeater']], a: 2, topic: 'U07' },
      { en: 'In a database table, which field uniquely identifies each record?', si: 'දත්ත සමුදා වගුවක එක් එක් වාර්තාව අනන්‍යව හඳුනා ගන්නා ක්ෂේත්‍රය කුමක්ද?',
        o: [['Primary key', 'ප්‍රාථමික යතුර (Primary key)'], ['Foreign key', 'ආගන්තුක යතුර (Foreign key)'], ['Query', 'විමසුම (Query)'], ['Form', 'ආකෘතිපත්‍රය (Form)']], a: 0, topic: 'U06' },
      { en: 'Which HTML tag makes the largest heading?', si: 'විශාලතම මාතෘකාව සෑදීමට යොදන HTML ටැගය කුමක්ද?',
        o: [['<h6>', '<h6>'], ['<head>', '<head>'], ['<h1>', '<h1>'], ['<title>', '<title>']], a: 2, topic: 'U01' }
    ]
  };

  const first = ['Kavindu', 'Tharushi', 'Ravindu', 'Nethmi', 'Sahan', 'Dulani', 'Pasindu', 'Hiruni', 'Chamod', 'Imesha', 'Yasiru',
    'Senuri', 'Dinuka', 'Methmi', 'Lahiru', 'Oshadi', 'Kalana', 'Piyumi', 'Thisara', 'Anjali', 'Ruwan', 'Vihanga', 'Sachini', 'Isuru',
    'Nadeesha', 'Akila', 'Chathuri', 'Buddhika', 'Hasini', 'Janith', 'Minoli', 'Ovindu', 'Rashmi', 'Tharindu', 'Umesha', 'Heshan', 'Dinithi'];
  const last = ['Perera', 'Fernando', 'Silva', 'Jayasinghe', 'Bandara', 'Wickramasinghe', 'Rathnayake', 'Gunawardena', 'Dissanayake',
    'Herath', 'Senanayake', 'Kumara', 'Weerasekara', 'Abeysekara', 'Rajapaksha', 'Ekanayake'];

  const students = [{ id: 'S1001', name: 'Sanduni Perera', ability: 70, me: true, marks: [58, 64, 61, 72, 70, 76, 81] }];
  first.forEach((f, i) => {
    const ability = Math.round(32 + rnd() * 62);
    students.push({ id: 'S' + (1002 + i), name: f + ' ' + last[Math.floor(rnd() * last.length)], ability });
  });
  students.forEach(s => {
    if (!s.marks) s.marks = papers.map(p => rnd() < 0.06 ? null : clamp(Math.round(s.ability + p.diff + (rnd() - 0.5) * 18), 12, 100));
    // fees: Sep, Oct, Nov
    s.fees = { sep: rnd() > 0.03, oct: rnd() > 0.07, nov: rnd() > 0.24 };
    s.phone = '07' + [0, 1, 2, 4, 5, 6, 7, 8][Math.floor(rnd() * 8)] + ' ' + String(Math.floor(rnd() * 900 + 100)) + ' ' + String(Math.floor(rnd() * 9000 + 1000));
  });
  students[0].fees = { sep: true, oct: true, nov: true };

  /* per-question % correct for the finished papers */
  papers.forEach(p => {
    p.qPct = Array.from({ length: p.nq }, () => Math.round(clamp(48 + p.diff + (rnd() - 0.45) * 70, 14, 97)));
  });

  /* other students' answers for the live paper P08 (23 have already submitted) */
  const qDiff = [0.1, 0.0, -0.18, 0.05, 0.2, 0.12, 0.08, -0.12, -0.05, 0.04];
  const liveSubs = [];
  students.slice(1).forEach((s, i) => {
    if (liveSubs.length >= 23 || rnd() < 0.3) return;
    const ans = live.qs.map((q, k) => {
      const pOk = clamp(s.ability / 100 + qDiff[k], 0.1, 0.97);
      if (rnd() < pOk) return q.a;
      let w = Math.floor(rnd() * 4); if (w === q.a) w = (w + 1) % 4; return w;
    });
    const h = 8 + Math.floor(rnd() * 10), m = Math.floor(rnd() * 60);
    liveSubs.push({ id: s.id, ans, at: '2026-11-15T' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') });
  });

  const classes = [
    { en: '2026 O/L · Saturday', si: '2026 සා/පෙළ · සෙනසුරාදා', n: students.length, active: true },
    { en: '2027 O/L · Sunday', si: '2027 සා/පෙළ · ඉරිදා', n: 29 },
    { en: '2028 O/L · Wednesday', si: '2028 සා/පෙළ · බදාදා', n: 17 }
  ];

  window.LMS_DATA = { teacher, units, lessons, papers, live, students, liveSubs, classes, today: '2026-11-15' };
})();
