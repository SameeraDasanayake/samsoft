// O/L ICT — The computer system. Renders from the ol-computer deck (pc.glb, cpu.glb built in Blender) + block diagrams.
const INK = '#1c1d1f', AC = '#2b6b3f', T1 = '#e3efe6', T2 = '#c9e0cf';
const tx = (x, y, s, a = 'middle', c = 't', fs = 13) => `<text class="${c}" x="${x}" y="${y}" font-size="${fs}" text-anchor="${a}">${s}</text>`;

const ipo = SVG2(l => {
  const box = (x, y, w, h, t, sub, f = T1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="${INK}" stroke-width="1.6"/>${tx(x + w / 2, y + 24, l(t), 'middle', 'ta', 16)}` +
    l(sub).split('|').map((s, i) => tx(x + w / 2, y + 43 + i * 14, s, 'middle', 't', 11)).join('');
  return SVG(124, 480, 250, `${ARROW('ipA')}
    ${box(4, 16, 142, 106, B('INPUT', 'ආදානය'), B('keyboard, mouse|scanner, microphone|camera, touch screen', 'යතුරු පුවරුව, මූසිකය|ස්කෑනරය|මයික්‍රොෆෝනය|කැමරාව, ස්පර්ශ තිරය'))}
    ${box(169, 16, 142, 106, B('PROCESS', 'සැකසීම'), B('CPU|calculate, compare|sort, search', 'CPU|ගණනය, සැසඳීම|පිළිවෙළට සැකසීම|සෙවීම'), T2)}
    ${box(334, 16, 142, 106, B('OUTPUT', 'ප්‍රතිදානය'), B('monitor, printer|speakers|projector', 'මොනිටරය|මුද්‍රණ යන්ත්‍රය|ස්පීකර|ප්‍රක්ෂේපකය'))}
    ${box(169, 170, 142, 76, B('STORAGE', 'ආචයනය'), B('hard disk, SSD|flash drive', 'දෘඪ තැටිය, SSD|සැණෙලි ධාවකය'))}
    <path d="M146 69 H165" stroke="${INK}" stroke-width="2" marker-end="url(#ipA)"/><path d="M311 69 H330" stroke="${INK}" stroke-width="2" marker-end="url(#ipA)"/>
    <path d="M225 126 V166" stroke="${INK}" stroke-width="2" marker-end="url(#ipA)"/><path d="M255 166 V126" stroke="${INK}" stroke-width="2" marker-end="url(#ipA)"/>
    ${tx(75, 142, l(B('data in', 'දත්ත ඇතුළට')), 'middle', 't', 12)}${tx(405, 142, l(B('information out', 'තොරතුරු පිටතට')), 'middle', 't', 12)}`);
});

const cycle = SVG2(l => {
  const cx = 170, cy = 135, R = 106, pt = d => [(cx + R * Math.cos(d * Math.PI / 180)).toFixed(1), (cy - R * Math.sin(d * Math.PI / 180)).toFixed(1)];
  const arc = (d0, d1) => { const [x0, y0] = pt(d0), [x1, y1] = pt(d1); return `<path d="M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#mcA)"/>`; };
  const P = [[90, B('1 Fetch', '1 ලබා ගැනීම')], [0, B('2 Decode', '2 විකේතනය')], [-90, B('3 Execute', '3 ක්‍රියාත්මක කිරීම')], [180, B('4 Store', '4 ගබඩා කිරීම')]];
  return SVG(84, 340, 270, `${ARROW('mcA')}<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4 5"/>
    ${arc(50, 16)}${arc(-16, -50)}${arc(-130, -164)}${arc(164, 130)}
    ${P.map(([d, t]) => { const [x, y] = pt(d).map(Number); return `<rect x="${x - 62}" y="${y - 15}" width="124" height="30" fill="${T2}" stroke="${INK}" stroke-width="1.4"/>${tx(x, y + 5, l(t), 'middle', 't', 12.5)}`; }).join('')}
    ${tx(cx, cy - 4, 'CPU', 'middle', 'ta', 18)}${tx(cx, cy + 16, l(B('one instruction', 'එක් උපදෙසක්')), 'middle', 't', 11)}`);
});

const hier = SVG2(l => {
  const L = [[B('Registers', 'රෙජිස්තර'), B('inside the CPU', 'CPU තුළ')], [B('Cache memory', 'නිහිත මතකය'), B('on the CPU chip', 'CPU චිපය මත')],
    [B('Main memory (RAM)', 'ප්‍රධාන මතකය (RAM)'), B('programs that are running', 'ක්‍රියාත්මක වන වැඩසටහන්')], [B('Secondary storage', 'ද්විතීයික ආචයනය'), B('SSD, hard disk: kept when power is off', 'SSD, දෘඪ තැටිය: විදුලිය නැති විටද රැඳේ')]];
  const fills = ['#2b6b3f', '#5f8f6c', '#a9c8b0', '#dbe9de'];
  return SVG(150, 520, 236, `${ARROW('hA')}${L.map(([a, b], i) => {
    const y = 10 + i * 54, w0 = 90 + i * 70, w1 = w0 + 70, cx = 260;
    return `<path d="M${cx - w0 / 2} ${y} H${cx + w0 / 2} L${cx + w1 / 2} ${y + 50} H${cx - w1 / 2} Z" fill="${fills[i]}" stroke="${INK}" stroke-width="1.2"/>` +
      `<text class="t" x="${cx}" y="${y + 23}" font-size="13" text-anchor="middle" style="fill:${i < 2 ? '#fff' : INK}">${l(a)}</text>` +
      `<text class="t" x="${cx}" y="${y + 40}" font-size="10.5" text-anchor="middle" style="fill:${i < 2 ? '#fff' : '#45474b'}">${l(b)}</text>`;
  }).join('')}
    <path d="M506 214 V20" stroke="${INK}" stroke-width="1.6" marker-end="url(#hA)"/>${tx(498, 40, l(B('faster', 'වේගවත්')), 'end', 't', 12)}${tx(498, 55, l(B('dearer per GB', 'GB එකකට මිල වැඩි')), 'end', 't', 10.5)}
    <path d="M14 66 V214" stroke="${INK}" stroke-width="1.6" marker-end="url(#hA)"/>${tx(22, 40, l(B('bigger', 'විශාල')), 'start', 't', 12)}${tx(22, 55, l(B('cheaper per GB', 'GB එකකට මිල අඩු')), 'start', 't', 10.5)}`);
});

window.TUTE = {
  no: '04', code: 'OLI-T4', accent: '#2b6b3f', hero: 'pc-hero',
  inst: B('Kelani Academy', 'කැලණි ඇකඩමිය'), teacher: B('O/L ICT class', 'සා/පෙළ තොරතුරු හා සන්නිවේදන තාක්ෂණය පන්තිය'),
  subject: B('ICT', 'තො.ස.තා.'), grade: B('O/L · Grade 10', 'සා/පෙළ · 10 ශ්‍රේණිය'),
  title: B('The computer system', 'පරිගණක පද්ධතිය'),
  sub: B('What is inside the box, what each part does, and how the CPU and memory work together to run a program.',
    'පරිගණකය තුළ ඇත්තේ මොනවාද, එක් එක් කොටසේ කාර්යය කුමක්ද, සහ වැඩසටහනක් ක්‍රියාත්මක කිරීමට CPU සහ මතකය එක්ව ක්‍රියා කරන්නේ කෙසේද.'),
  body: [
    /* 1 */
    { sec: B('Input → process → output', 'ආදානය → සැකසීම → ප්‍රතිදානය'),
      lead: B('Every computer system does the same four things: it takes in <b>data</b>, <b>processes</b> it, gives out <b>information</b>, and <b>stores</b> data and programs for later.',
        'සෑම පරිගණක පද්ධතියක්ම කාර්යයන් හතරක් කරයි: <b>දත්ත</b> ලබා ගනී, ඒවා <b>සකසයි</b>, <b>තොරතුරු</b> පිටතට ලබා දෙයි, සහ දත්ත සහ වැඩසටහන් පසුව භාවිතයට <b>ආචයනය</b> කරයි.'),
      s: [{ term: B('data', 'දත්ත'), d: B('Raw facts and figures, not yet processed.', 'තවම සකස් නොකළ අමු කරුණු සහ සංඛ්‍යා.') },
        { term: B('information', 'තොරතුරු'), d: B('Data that has been processed so it has meaning.', 'අර්ථයක් ඇති වන පරිදි සකස් කළ දත්ත.') }] },
    { fig: { svg: ipo }, cap: B('The four jobs of a computer system.', 'පරිගණක පද්ධතියක කාර්යයන් හතර.'),
      s: { note: B('A list of marks 45, 72, 61 is <b>data</b>. “The class average is 59.3” is <b>information</b>.', 'ලකුණු 45, 72, 61 ලැයිස්තුව <b>දත්ත</b> වේ. “පන්තියේ සාමාන්‍යය 59.3” යනු <b>තොරතුරු</b> වේ.'), tag: B('Example', 'නිදසුනක්') } },
    { check: [
      { q: B('Write one input device and one output device.', 'ආදාන උපාංගයක් සහ ප්‍රතිදාන උපාංගයක් ලියන්න.'), a: B('e.g. keyboard (input); printer (output)', 'උදා: යතුරු පුවරුව (ආදාන); මුද්‍රණ යන්ත්‍රය (ප්‍රතිදාන)') },
      { q: B('A touch screen is both an input and an output device. Explain.', 'ස්පර්ශ තිරය ආදාන මෙන්ම ප්‍රතිදාන උපාංගයක්ද වේ. පැහැදිලි කරන්න.'), a: B('You touch it to give data (input) and it shows the result (output).', 'ස්පර්ශ කිරීමෙන් දත්ත ලබා දෙයි (ආදාන), ප්‍රතිඵලය තිරයේ පෙන්වයි (ප්‍රතිදාන).'), lines: 2 }] },

    /* 2 */
    { sec: B('Inside the system unit', 'පද්ධති ඒකකය ඇතුළත'),
      lead: B('The case that holds the main parts is the <b>system unit</b>. Take off the side panel and every part you see is connected to one large circuit board: the <b>motherboard</b>.',
        'ප්‍රධාන කොටස් අඩංගු ආවරණය <b>පද්ධති ඒකකයයි</b>. පැති පුවරුව ඉවත් කළ විට පෙනෙන සෑම කොටසක්ම එක් විශාල පරිපථ පුවරුවකට සම්බන්ධ වී ඇත: එනම් <b>මවු පුවරුව</b>.'),
      s: { term: B('motherboard', 'මවු පුවරුව'), d: B('The main circuit board; all parts connect to it.', 'ප්‍රධාන පරිපථ පුවරුව; සියලු කොටස් එයට සම්බන්ධ වේ.') } },
    { fig: { img: 'pc-inside', w: 172, lw: 38, rw: 38, labels: [['CPU + cooler', null, 'l'], ['SSD', null, 'l'], ['Power supply unit', null, 'l'], ['NVMe SSD', null, 'l'],
        ['RAM', null, 'r'], ['Motherboard', null, 'r'], ['Graphics card', null, 'r'], ['Cooling fan', null, 'r'], ['Hard disk', null, 'r']] },
      cap: B('Inside a desktop computer (side panel removed).', 'ඩෙස්ක්ටොප් පරිගණකයක් ඇතුළත (පැති පුවරුව ඉවත් කර).'), wide: true },
    { tbl: { head: [B('Part', 'කොටස'), B('Job', 'කාර්යය')],
      rows: [[B('CPU', 'CPU'), B('processes data and runs instructions', 'දත්ත සකසා උපදෙස් ක්‍රියාත්මක කරයි')],
        [B('RAM', 'RAM'), B('holds the programs and data in use now', 'දැනට භාවිත වන වැඩසටහන් සහ දත්ත රඳවා ගනී')],
        [B('SSD / hard disk', 'SSD / දෘඪ තැටිය'), B('stores files and programs when the power is off', 'විදුලිය නැති විටද ගොනු සහ වැඩසටහන් ආචයනය කරයි')],
        [B('Graphics card', 'චිත්‍රක පත'), B('makes the picture for the monitor', 'මොනිටරය සඳහා රූපය සකසයි')],
        [B('Power supply unit', 'බල සැපයුම් ඒකකය'), B('changes mains AC into the low DC voltages the parts need', 'ප්‍රධාන AC විදුලිය කොටස්වලට අවශ්‍ය අඩු DC වෝල්ටීයතාවලට හරවයි')],
        [B('Cooler and fans', 'සිසිලනය සහ පංකා'), B('carry heat away so the parts do not overheat', 'කොටස් අධික ලෙස රත් නොවීමට තාපය ඉවත් කරයි')]] },
      s: { rem: B('Parts outside the system unit (keyboard, monitor, printer…) are called <b>peripherals</b>.', 'පද්ධති ඒකකයෙන් පිටත ඇති කොටස් (යතුරු පුවරුව, මොනිටරය, මුද්‍රණ යන්ත්‍රය…) <b>පර්යන්ත උපාංග</b> ලෙස හැඳින්වේ.') } },
    { fig: { img: 'pc-explode', w: 84 }, cap: B('The same computer taken apart: every part leaves the motherboard.', 'එම පරිගණකයම කොටස් වෙන් කළ විට: සෑම කොටසක්ම මවු පුවරුවෙන් ඉවත් වේ.'),
      s: [{ term: B('bus', 'බසය'), d: B('A set of wires on the motherboard that carries signals between parts.', 'කොටස් අතර සංඥා ගෙන යන, මවු පුවරුවේ ඇති කම්බි සමූහයකි.') },
        { note: B('<b>Data bus</b> — carries the data.<br><b>Address bus</b> — carries where in memory.<br><b>Control bus</b> — carries commands such as read / write.', '<b>දත්ත බසය</b> — දත්ත ගෙන යයි.<br><b>ලිපින බසය</b> — මතකයේ ස්ථානය ගෙන යයි.<br><b>පාලන බසය</b> — කියවීම / ලිවීම වැනි විධාන ගෙන යයි.'), tag: B('Three buses', 'බස් තුන') }] },

    /* 3 */
    { sec: B('The central processing unit', 'මධ්‍ය සැකසුම් ඒකකය'),
      lead: B('The CPU is the “brain” of the computer. It has three main parts: the <b>arithmetic and logic unit (ALU)</b>, the <b>control unit (CU)</b> and the <b>registers</b>.',
        'CPU යනු පරිගණකයේ “මොළයයි”. එයට ප්‍රධාන කොටස් තුනක් ඇත: <b>අංක ගණිත හා තාර්කික ඒකකය (ALU)</b>, <b>පාලන ඒකකය (CU)</b> සහ <b>රෙජිස්තර</b>.'),
      s: [{ term: B('ALU', 'අංක ගණිත හා තාර්කික ඒකකය'), d: B('Does arithmetic (+ − × ÷) and logic (compare: >, <, =).', 'අංක ගණිත (+ − × ÷) සහ තාර්කික (සැසඳීම: >, <, =) කර්ම කරයි.') },
        { term: B('control unit', 'පාලන ඒකකය'), d: B('Fetches and decodes instructions and directs the other parts.', 'උපදෙස් ලබා ගෙන විකේතනය කර අනෙක් කොටස් මෙහෙයවයි.') },
        { term: B('register', 'රෙජිස්තරය'), d: B('A tiny, very fast store inside the CPU.', 'CPU තුළ ඇති ඉතා කුඩා, ඉතා වේගවත් ගබඩාවකි.') }] },
    { fig: { img: 'pc-cpu', w: 120, lw: 36, rw: 30, labels: [['Heat spreader (lid)', B('Heat spreader (lid)', 'තාප විසරකය\n(ආවරණය)'), 'l'], ['Cores', B('Cores', 'හර (cores)'), 'l'], ['Cache memory', null, 'l'], ['Graphics', null, 'r'], ['Memory controller', null, 'r']] },
      cap: B('A CPU with its metal lid lifted to show the chip (die).', 'චිපය (ඩයි) පෙනෙන සේ ලෝහ ආවරණය ඔසවා ඇති CPU එකක්.'),
      s: [{ term: B('core', 'හරය'), d: B('A complete processor inside the CPU. A quad-core CPU has four.', 'CPU තුළ ඇති සම්පූර්ණ සකසනයකි. හර හතරේ CPU එකකට හර හතරක් ඇත.') },
        { term: B('clock speed', 'ස්පන්දක වේගය'), d: B('How many cycles the CPU does each second, in GHz.', 'CPU එක තත්පරයකට කරන චක්‍ර ගණන; GHz වලින්.') }] },
    { ex: { q: B('A CPU has a clock speed of 3.2 GHz. How many clock cycles does it do in one second?', 'CPU එකක ස්පන්දක වේගය 3.2 GHz වේ. එය තත්පරයකදී ස්පන්දක චක්‍ර කීයක් කරයිද?'),
        steps: [B('1 GHz = 1 000 000 000 cycles per second (one thousand million).', '1 GHz = තත්පරයට චක්‍ර 1 000 000 000 (මිලියන දහසක්).'), B('3.2 × 1 000 000 000 = 3 200 000 000', '3.2 × 1 000 000 000 = 3 200 000 000')],
        a: B('3 200 000 000 cycles per second', 'තත්පරයට චක්‍ර 3 200 000 000') },
      s: { rem: B('A faster clock and more cores usually make a computer faster — but RAM size and the storage speed matter too.', 'වේගවත් ස්පන්දකයක් සහ වැඩි හර ගණනක් සාමාන්‍යයෙන් පරිගණකය වේගවත් කරයි — නමුත් RAM ප්‍රමාණය සහ ආචයනයේ වේගයද වැදගත් වේ.') } },

    /* 4 */
    { sec: B('The machine cycle', 'යන්ත්‍ර චක්‍රය'),
      lead: B('A program is a list of instructions in RAM. The CPU runs them one by one. For each instruction it goes round the same four steps — the <b>machine cycle</b> — millions of times a second.',
        'වැඩසටහනක් යනු RAM තුළ ඇති උපදෙස් ලැයිස්තුවකි. CPU එක ඒවා එකින් එක ක්‍රියාත්මක කරයි. සෑම උපදෙසක් සඳහාම එය එකම පියවර හතර — <b>යන්ත්‍ර චක්‍රය</b> — තත්පරයට මිලියන ගණන් වාර ගනී.'),
      s: { term: B('machine cycle', 'යන්ත්‍ර චක්‍රය'), d: B('Fetch → decode → execute → store, for one instruction.', 'එක් උපදෙසක් සඳහා ලබා ගැනීම → විකේතනය → ක්‍රියාත්මක කිරීම → ගබඩා කිරීම.') } },
    { fig: { svg: cycle }, cap: B('The four steps of the machine cycle.', 'යන්ත්‍ර චක්‍රයේ පියවර හතර.'),
      s: { note: B('<b>1 Fetch</b> — the CU brings the next instruction from RAM into a register.<br><b>2 Decode</b> — the CU works out what it means, e.g. “add two numbers”.<br><b>3 Execute</b> — the ALU does the work.<br><b>4 Store</b> — the result goes to a register or to memory.',
        '<b>1 ලබා ගැනීම</b> — CU ඊළඟ උපදෙස RAM එකෙන් රෙජිස්තරයකට ගෙන එයි.<br><b>2 විකේතනය</b> — CU එහි අර්ථය හඳුනා ගනී, උදා: “සංඛ්‍යා දෙකක් එකතු කරන්න”.<br><b>3 ක්‍රියාත්මක කිරීම</b> — ALU එම කාර්යය කරයි.<br><b>4 ගබඩා කිරීම</b> — ප්‍රතිඵලය රෙජිස්තරයකට හෝ මතකයට යයි.') } },
    { check: [
      { q: B('Which part of the CPU compares two numbers?', 'සංඛ්‍යා දෙකක් සසඳන්නේ CPU හි කුමන කොටසද?'), a: B('The ALU (arithmetic and logic unit)', 'ALU (අංක ගණිත හා තාර්කික ඒකකය)') },
      { q: B('Write the four steps of the machine cycle in order.', 'යන්ත්‍ර චක්‍රයේ පියවර හතර පිළිවෙළින් ලියන්න.'), a: B('Fetch, decode, execute, store', 'ලබා ගැනීම, විකේතනය, ක්‍රියාත්මක කිරීම, ගබඩා කිරීම') }] },

    /* 5 */
    { sec: B('Memory and storage', 'මතකය සහ ආචයනය'),
      lead: B('A computer uses several kinds of memory. The fastest are small and costly, so they are used only for what the CPU needs right now. Slower, cheaper storage holds everything else.',
        'පරිගණකයක් මතක වර්ග කිහිපයක් භාවිත කරයි. වේගවත්ම ඒවා කුඩා සහ මිල අධික නිසා CPU එකට එම මොහොතේ අවශ්‍ය දේ සඳහා පමණක් භාවිත වේ. සෙමින් ක්‍රියා කරන, මිල අඩු ආචයනය අනෙක් සියල්ල රඳවා ගනී.'),
      s: { term: B('cache memory', 'නිහිත මතකය'), d: B('Very fast memory on the CPU chip for data used again and again.', 'නැවත නැවත භාවිත වන දත්ත සඳහා CPU චිපය මත ඇති ඉතා වේගවත් මතකය.') } },
    { fig: { svg: hier }, cap: B('The memory hierarchy.', 'මතක ධුරාවලිය.') },
    { tbl: { head: ['', B('RAM', 'RAM'), B('ROM', 'ROM')],
      rows: [[B('<b>Name</b>', '<b>නම</b>'), B('Random Access Memory', 'සසම්භාවී ප්‍රවේශ මතකය'), B('Read Only Memory', 'පඨන මාත්‍ර මතකය')],
        [B('<b>Power off</b>', '<b>විදුලිය නැති විට</b>'), B('data is lost (volatile)', 'දත්ත මැකේ (නශ්‍ය)'), B('data stays (non-volatile)', 'දත්ත රැඳේ (අනශ්‍ය)')],
        [B('<b>Read / write</b>', '<b>කියවීම / ලිවීම</b>'), B('read and write', 'කියවීම සහ ලිවීම'), B('mostly read only', 'බොහෝ විට කියවීම පමණි')],
        [B('<b>Holds</b>', '<b>රඳවා ගන්නේ</b>'), B('open programs and data', 'විවෘත වැඩසටහන් සහ දත්ත'), B('start-up program (BIOS / firmware)', 'ආරම්භක වැඩසටහන (BIOS / ස්ථිරාංග)')]] },
      s: [{ term: B('volatile', 'නශ්‍ය'), d: B('Loses its data when the power goes off.', 'විදුලිය නැති වූ විට දත්ත නැති වේ.') }, { fig: { img: 'pc-ram', w: 42 }, cap: B('A RAM module.', 'RAM මොඩියුලයක්.') }] },
    { h: B('Units of storage', 'ආචයන ඒකක'), p: B('The smallest unit is a <b>bit</b> (0 or 1). 8 bits make 1 <b>byte</b> — about one character. Each bigger unit is 1024 times the one before.',
        'කුඩාම ඒකකය <b>බිටුවයි</b> (0 හෝ 1). බිටු 8ක් බයිට 1ක් වේ — එක් අක්ෂරයක් පමණ. ඊළඟ විශාල ඒකකය පෙර ඒකකය මෙන් 1024 ගුණයකි.'),
      s: [{ term: B('bit', 'බිටුව'), d: B('A binary digit: 0 or 1.', 'ද්විමය අංකයකි: 0 හෝ 1.') }, { term: B('byte', 'බයිටය'), d: B('8 bits.', 'බිටු 8.') }] },
    { ex: { q: B('A phone has 16 GB of free space. Each photo is 4 MB. How many photos can it store?', 'දුරකථනයක නිදහස් ඉඩ 16 GB කි. එක් ඡායාරූපයක් 4 MB වේ. එයට ගබඩා කළ හැකි ඡායාරූප ගණන කීයද?'),
        steps: [B('Change GB to MB: 16 × 1024 = 16 384 MB', 'GB, MB වලට හරවන්න: 16 × 1024 = 16 384 MB'), B('16 384 ÷ 4 = 4096', '16 384 ÷ 4 = 4096')],
        a: B('4096 photos', 'ඡායාරූප 4096') },
      s: { note: B('1 byte = 8 bits<br>1 KB = 1024 bytes<br>1 MB = 1024 KB<br>1 GB = 1024 MB<br>1 TB = 1024 GB', '1 බයිට = බිටු 8<br>1 KB = බයිට 1024<br>1 MB = 1024 KB<br>1 GB = 1024 MB<br>1 TB = 1024 GB'), tag: B('Units', 'ඒකක') } },
    { check: [
      { q: B('Which memory loses its data when the power is switched off?', 'විදුලිය විසන්ධි කළ විට දත්ත නැති වන මතකය කුමක්ද?'), a: B('RAM', 'RAM') },
      { q: B('How many bytes are there in 2 KB?', 'KB 2ක බයිට කීයක් ඇත්ද?'), a: B('2 × 1024 = 2048 bytes', '2 × 1024 = බයිට 2048') },
      { q: B('Why is cache memory not used instead of all the RAM?', 'සියලු RAM වෙනුවට නිහිත මතකය භාවිත නොකරන්නේ ඇයි?'), a: B('Cache is much more costly per GB, so only a small amount is used.', 'නිහිත මතකය GB එකකට ඉතා මිල අධික නිසා කුඩා ප්‍රමාණයක් පමණක් භාවිත වේ.') }] }
  ],

  mcq: [
    { q: B('Which part of the CPU compares two numbers?', 'සංඛ්‍යා දෙකක් සසඳන්නේ CPU හි කුමන කොටසද?'), opts: [B('Control unit', 'පාලන ඒකකය'), B('Register', 'රෙජිස්තරය'), B('Cache memory', 'නිහිත මතකය'), B('Arithmetic and logic unit', 'අංක ගණිත හා තාර්කික ඒකකය')], a: 4 },
    { q: B('Which memory loses its data when the power is switched off?', 'විදුලිය විසන්ධි කළ විට දත්ත නැති වන මතකය කුමක්ද?'), opts: [B('ROM', 'ROM'), B('RAM', 'RAM'), B('Hard disk', 'දෘඪ තැටිය'), B('SSD', 'SSD')], a: 2 },
    { q: B('Which of these is an input device?', 'පහත ඒවායින් ආදාන උපාංගයක් වන්නේ කුමක්ද?'), opts: [B('printer', 'මුද්‍රණ යන්ත්‍රය'), B('projector', 'ප්‍රක්ෂේපකය'), B('scanner', 'ස්කෑනරය'), B('speaker', 'ස්පීකරය')], a: 3 },
    { q: B('The correct order of the machine cycle is', 'යන්ත්‍ර චක්‍රයේ නිවැරදි පිළිවෙළ වන්නේ'), opts: [B('fetch, execute, decode, store', 'ලබා ගැනීම, ක්‍රියාත්මක කිරීම, විකේතනය, ගබඩා කිරීම'), B('decode, fetch, execute, store', 'විකේතනය, ලබා ගැනීම, ක්‍රියාත්මක කිරීම, ගබඩා කිරීම'), B('fetch, decode, execute, store', 'ලබා ගැනීම, විකේතනය, ක්‍රියාත්මක කිරීම, ගබඩා කිරීම'), B('store, fetch, decode, execute', 'ගබඩා කිරීම, ලබා ගැනීම, විකේතනය, ක්‍රියාත්මක කිරීම')], a: 3 },
    { q: B('The fastest memory in a computer is', 'පරිගණකයක ඇති වේගවත්ම මතකය වන්නේ'), opts: [B('registers.', 'රෙජිස්තර'), B('cache memory.', 'නිහිත මතකය'), B('RAM.', 'RAM'), B('hard disk.', 'දෘඪ තැටිය')], a: 1 },
    { q: B('Clock speed is measured in', 'ස්පන්දක වේගය මනිනු ලබන්නේ'), opts: ['GB', 'GHz', 'MB', 'bit'], a: 2 },
    { q: B('How many bits are there in one byte?', 'එක් බයිටයක බිටු කීයක් ඇත්ද?'), opts: ['2', '4', '8', '1024'], a: 3 },
    { q: B('The start-up program (BIOS) is kept in', 'ආරම්භක වැඩසටහන (BIOS) රඳවා ඇත්තේ'), opts: [B('RAM.', 'RAM හි'), B('ROM.', 'ROM හි'), B('cache.', 'නිහිත මතකයේ'), B('a register.', 'රෙජිස්තරයක')], a: 2 },
    { q: B('Which part changes mains electricity into the voltages the computer needs?', 'ප්‍රධාන විදුලිය පරිගණකයට අවශ්‍ය වෝල්ටීයතාවලට හරවන්නේ කුමන කොටසද?'), opts: [B('Motherboard', 'මවු පුවරුව'), B('Graphics card', 'චිත්‍රක පත'), B('Power supply unit', 'බල සැපයුම් ඒකකය'), B('CPU', 'CPU')], a: 3 },
    { q: B('1 GB is equal to', '1 GB සමාන වන්නේ'), opts: ['1000 KB', '1024 KB', '1000 MB', '1024 MB'], a: 4 }
  ],
  st: [
    { q: B('A shop uses a computer to make bills. The cashier scans the barcode of each item and the bill is printed.', 'සාප්පුවක් බිල්පත් සෑදීමට පරිගණකයක් භාවිත කරයි. මුදල් අයකැමි එක් එක් භාණ්ඩයේ තීරු කේතය ස්කෑන් කරන අතර බිල්පත මුද්‍රණය වේ.'), parts: [
      { q: B('Name the input device and the output device in this system.', 'මෙම පද්ධතියේ ආදාන උපාංගය සහ ප්‍රතිදාන උපාංගය නම් කරන්න.'), m: 2, lines: 1, a: B('Input: barcode scanner; output: printer', 'ආදාන: තීරු කේත ස්කෑනරය; ප්‍රතිදාන: මුද්‍රණ යන්ත්‍රය') },
      { q: B('Give one example of data and one of information in this system.', 'මෙම පද්ධතියේ දත්ත සඳහා එක් නිදසුනක් සහ තොරතුරු සඳහා එක් නිදසුනක් දෙන්න.'), m: 2, a: B('Data: the barcode number / price of each item. Information: the total on the bill.', 'දත්ත: එක් එක් භාණ්ඩයේ තීරු කේත අංකය / මිල. තොරතුරු: බිල්පතේ මුළු එකතුව.') },
      { q: B('The day\'s sales must be kept for the end-of-month report. Where should they be saved? Why not only in RAM?', 'දවසේ විකුණුම් මාසික වාර්තාව සඳහා තබා ගත යුතුය. ඒවා සුරැකිය යුත්තේ කොතැනද? RAM තුළ පමණක් නොතබන්නේ ඇයි?'), m: 3, lines: 3, a: B('In secondary storage (SSD / hard disk). RAM is volatile: the data would be lost when the computer is switched off.', 'ද්විතීයික ආචයනයේ (SSD / දෘඪ තැටිය). RAM නශ්‍ය නිසා පරිගණකය නිවා දැමූ විට දත්ත නැති වේ.') }] },
    { q: B('The figure shows the parts of a CPU.', 'රූපයේ දැක්වෙන්නේ CPU එකක කොටස් ය.'),
      fig: { svg: SVG2(l => SVG(84, 360, 150, `<rect x="10" y="10" width="340" height="130" fill="none" stroke="${INK}" stroke-width="1.8"/>${tx(180, 30, 'CPU', 'middle', 'ta', 14)}
        ${[[30, 'A'], [140, 'B'], [250, 'C']].map(([x, t]) => `<rect x="${x}" y="48" width="90" height="70" fill="${T1}" stroke="${INK}" stroke-width="1.4"/>${tx(x + 45, 90, t, 'middle', 'ta', 22)}`).join('')}`)) },
      parts: [
      { q: B('A does calculations and comparisons. Name A.', 'A ගණනය කිරීම් සහ සැසඳීම් කරයි. A නම් කරන්න.'), m: 1, lines: 1, a: B('Arithmetic and logic unit (ALU)', 'අංක ගණිත හා තාර්කික ඒකකය (ALU)') },
      { q: B('B fetches and decodes the instructions. Name B.', 'B උපදෙස් ලබා ගෙන විකේතනය කරයි. B නම් කරන්න.'), m: 1, lines: 1, a: B('Control unit (CU)', 'පාලන ඒකකය (CU)') },
      { q: B('C is a very small, very fast store. Name C.', 'C ඉතා කුඩා, ඉතා වේගවත් ගබඩාවකි. C නම් කරන්න.'), m: 1, lines: 1, a: B('Registers', 'රෙජිස්තර') },
      { q: B('Explain what happens in the “execute” step of the machine cycle.', 'යන්ත්‍ර චක්‍රයේ “ක්‍රියාත්මක කිරීම” පියවරේදී සිදු වන්නේ කුමක්දැයි පැහැදිලි කරන්න.'), m: 2, a: B('The ALU carries out the decoded instruction, e.g. adds the two numbers.', 'විකේතනය කළ උපදෙස ALU මගින් සිදු කරයි, උදා: සංඛ්‍යා දෙක එකතු කිරීම.') },
      { q: B('Computer X has a 2.4 GHz CPU and computer Y a 3.6 GHz CPU. How many more cycles per second does Y do?', 'X පරිගණකයේ CPU එක 2.4 GHz ද Y හි 3.6 GHz ද වේ. Y තත්පරයකට කොපමණ චක්‍ර වැඩිපුර කරයිද?'), m: 2, lines: 1, a: B('1.2 GHz = 1 200 000 000 more cycles per second', '1.2 GHz = තත්පරයට චක්‍ර 1 200 000 000ක් වැඩිපුර') }] },
    { q: B('A school computer has 8 GB RAM, a 512 GB SSD and a 1 TB hard disk.', 'පාසල් පරිගණකයක 8 GB RAM, 512 GB SSD සහ 1 TB දෘඪ තැටියක් ඇත.'), parts: [
      { q: B('Write 8 GB in MB.', '8 GB, MB වලින් ලියන්න.'), m: 1, lines: 1, a: B('8 × 1024 = 8192 MB', '8 × 1024 = 8192 MB') },
      { q: B('Which of the three has the largest capacity? Which is the fastest?', 'තුනෙන් වැඩිම ධාරිතාව ඇත්තේ කුමකටද? වේගවත්ම කුමක්ද?'), m: 2, lines: 1, a: B('Largest: the 1 TB hard disk (1 TB = 1024 GB). Fastest: RAM.', 'විශාලතම: 1 TB දෘඪ තැටිය (1 TB = 1024 GB). වේගවත්ම: RAM.') },
      { q: B('A video lesson is 700 MB. How many such lessons fit on the 512 GB SSD?', 'වීඩියෝ පාඩමක් 700 MB වේ. 512 GB SSD එකට එවැනි පාඩම් කීයක් ගැළපේද?'), m: 2, lines: 2, a: B('512 × 1024 = 524 288 MB; 524 288 ÷ 700 = 748.98 → 748 lessons', '512 × 1024 = 524 288 MB; 524 288 ÷ 700 = 748.98 → පාඩම් 748') }] }
  ],
  summary: [
    B('A computer system: input → process → output, with storage.', 'පරිගණක පද්ධතිය: ආදානය → සැකසීම → ප්‍රතිදානය, සමඟ ආචයනය.'),
    B('Data are raw facts; information is processed data with meaning.', 'දත්ත යනු අමු කරුණු ය; තොරතුරු යනු අර්ථයක් ඇති සකස් කළ දත්ත ය.'),
    B('Every part connects to the motherboard; data, address and control buses carry the signals.', 'සියලු කොටස් මවු පුවරුවට සම්බන්ධ වේ; දත්ත, ලිපින සහ පාලන බස් සංඥා ගෙන යයි.'),
    B('CPU = ALU + control unit + registers. Clock speed is in GHz.', 'CPU = ALU + පාලන ඒකකය + රෙජිස්තර. ස්පන්දක වේගය GHz වලින්.'),
    B('Machine cycle: fetch → decode → execute → store.', 'යන්ත්‍ර චක්‍රය: ලබා ගැනීම → විකේතනය → ක්‍රියාත්මක කිරීම → ගබඩා කිරීම.'),
    B('Registers → cache → RAM → secondary storage: faster at the top, bigger at the bottom.', 'රෙජිස්තර → නිහිත මතකය → RAM → ද්විතීයික ආචයනය: ඉහළට වේගවත්, පහළට විශාල.'),
    B('RAM is volatile; ROM is non-volatile and holds the start-up program.', 'RAM නශ්‍ය ය; ROM අනශ්‍ය වන අතර ආරම්භක වැඩසටහන රඳවා ගනී.'),
    B('8 bits = 1 byte; KB, MB, GB, TB each go up by 1024.', 'බිටු 8 = බයිට 1; KB, MB, GB, TB එකිනෙක 1024 ගුණයෙන් වැඩි වේ.')
  ],
  words: [B('input device', 'ආදාන උපාංගය'), B('output device', 'ප්‍රතිදාන උපාංගය'), B('secondary storage', 'ද්විතීයික ආචයනය'), B('peripheral', 'පර්යන්ත උපාංගය'), B('non-volatile', 'අනශ්‍ය')]
};
