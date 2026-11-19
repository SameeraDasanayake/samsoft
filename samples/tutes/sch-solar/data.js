// Grade 5 scholarship — The Solar System. Figures: renders from the sch-solar deck (tools/tutes/shots.json) + exact diagrams.
const INK = '#141a3a', NIGHT = '#2a3470', SUNC = '#ffb02e';

const dayNight = SVG2(l => SVG(118, 480, 210, `${ARROW('dnA')}${ARROW('dnB', '#c77a1c')}
  <circle cx="44" cy="105" r="36" fill="${SUNC}"/>
  ${[45, 75, 105, 135, 165].map(y => `<path d="M96 ${y} H246" stroke="#c77a1c" stroke-width="2" marker-end="url(#dnB)"/>`).join('')}
  <path d="M330 30 A75 75 0 0 1 330 180 Z" fill="${NIGHT}"/>
  <circle cx="330" cy="105" r="75" fill="none" stroke="${INK}" stroke-width="2"/>
  <path d="M330 16 V194" stroke="${INK}" stroke-width="1.4" stroke-dasharray="5 4"/>
  <path d="M258 116 A72 16 0 0 0 400 116" fill="none" stroke="${INK}" stroke-width="2" marker-end="url(#dnA)"/>
  <text class="t" x="44" y="160" font-size="15" text-anchor="middle">${l(B('Sun', 'සූර්යයා'))}</text>
  <text class="t" x="171" y="30" font-size="13" text-anchor="middle">${l(B("Sun's rays", 'හිරු කිරණ'))}</text>
  <text class="ta" x="292" y="92" font-size="16" text-anchor="middle">${l(B('DAY', 'දවල්'))}</text>
  <text class="t" x="368" y="92" font-size="16" text-anchor="middle" style="fill:#fff">${l(B('NIGHT', 'රාත්‍රිය'))}</text>
  <text class="t" x="330" y="12" font-size="12" text-anchor="middle">${l(B('axis', 'අක්ෂය'))}</text>
  <text class="t" x="418" y="140" font-size="12">${l(B('spins west → east', 'බටහිර → නැගෙනහිර'))}</text>`));

const year = SVG2(l => SVG(118, 480, 226, `${ARROW('yrA')}
  <ellipse cx="240" cy="110" rx="190" ry="78" fill="none" stroke="${INK}" stroke-width="1.6" stroke-dasharray="6 5"/>
  <circle cx="240" cy="110" r="26" fill="${SUNC}"/>
  <text class="t" x="240" y="152" font-size="13" text-anchor="middle">${l(B('Sun', 'සූර්යයා'))}</text>
  ${[[430, 110], [240, 188], [50, 110], [240, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#2f69b3" stroke="${INK}" stroke-width="1.2"/>`).join('')}
  <path d="M425 58 A204 92 0 0 0 340 26" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#yrA)"/>
  <path d="M55 162 A204 92 0 0 0 140 194" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#yrA)"/>
  <text class="t" x="442" y="138" font-size="13" text-anchor="middle">${l(B('Earth', 'පෘථිවිය'))}</text>
  <text class="ta" x="240" y="222" font-size="14" text-anchor="middle">${l(B('one revolution = 365¼ days = 1 year', 'එක් පරිභ්‍රමණයක් = දින 365¼ = අවුරුද්දක්'))}</text>`));

const PH = [[0, 'New moon', 'අමාවක'], [4, '', ''], [7, 'First quarter', 'පුර අටවක'], [11, '', ''], [15, 'Full moon', 'පුර පසළොස්වක'], [18, '', ''], [22, 'Last quarter', 'අව අටවක'], [26, '', '']];
const phases = SVG2(l => SVG(176, 800, 150, PH.map(([d, en, si], i) => {
  const x = 10 + i * 99;
  return `<circle cx="${x + 42}" cy="48" r="41" fill="none" stroke="#b9b4a9" stroke-width="1"/><image href="img/sol-moon${i}.png" x="${x}" y="6" width="84" height="84"/>
    <text class="t" x="${x + 42}" y="110" font-size="13" text-anchor="middle" style="fill:#7d8086">${l(B('day ' + d, 'දින ' + d))}</text>
    ${en ? `<text class="ta" x="${x + 42}" y="132" font-size="14" text-anchor="middle">${l(B(en, si))}</text>` : ''}`;
}).join('') + `<path d="M60 145 H740" stroke="${INK}" stroke-width="1" marker-end="url(#phA)"/>${ARROW('phA')}`));

window.TUTE = {
  no: '01', code: 'SCH-T1', accent: '#ff7a30', hero: 'sol-hero',
  inst: B('Kelani Academy', 'කැලණි ඇකඩමිය'), teacher: B('Grade 5 scholarship class', '5 ශ්‍රේණිය ශිෂ්‍යත්ව පන්තිය'),
  subject: B('Environment', 'පරිසරය'), grade: B('Grade 5', '5 ශ්‍රේණිය'),
  title: B('The Solar System', 'සෞරග්‍රහ මණ්ඩලය'),
  sub: B('The Sun, its eight planets, the Moon — and why we have day and night, months and years.',
    'සූර්යයා, ග්‍රහලෝක අට, චන්ද්‍රයා — සහ දිවා රෑ, මාස, අවුරුදු ඇති වන හැටි.'),
  body: [
    /* 1 */
    { sec: B('The Sun is a star', 'සූර්යයා තාරකාවකි'),
      lead: B('The Sun is the centre of our solar system. It is a star — a huge ball of very hot gas that makes its own light and heat.',
        'සූර්යයා අපේ සෞරග්‍රහ මණ්ඩලයේ මධ්‍යයයි. එය තාරකාවකි — තමාගේම ආලෝකය සහ තාපය නිපදවන, ඉතා උණුසුම් වායුවලින් යුත් විශාල ගෝලයකි.'),
      s: { term: B('star', 'තාරකාව'), d: B('A ball of hot gas that gives out its own light.', 'තමාගේම ආලෝකය නිකුත් කරන උණුසුම් වායු ගෝලයකි.') } },
    { p: [B('Everything that goes round the Sun — the planets, their moons and many small rocks — makes up the <b>solar system</b>. Without the Sun\'s light and heat there would be no plants, no animals and no people on the Earth.',
        'සූර්යයා වටා යන සියල්ල — ග්‍රහලෝක, ඒවායේ චන්ද්‍රිකා සහ කුඩා පාෂාණ රාශියක් — එක්ව <b>සෞරග්‍රහ මණ්ඩලය</b> සෑදේ. සූර්යයාගේ ආලෝකය සහ තාපය නොමැති නම් පෘථිවියේ ශාක, සතුන් හෝ මිනිසුන් ජීවත් නොවනු ඇත.'),
      B('The stars we see at night are suns too. They look like tiny points only because they are very, very far away.',
        'රාත්‍රියේ අප දකින තාරකාද සූර්යයන් ය. ඒවා කුඩා තිත් ලෙස පෙනෙන්නේ ඉතා ඈතින් පිහිටා ඇති නිසා පමණි.')],
      s: [{ term: B('solar system', 'සෞරග්‍රහ මණ්ඩලය'), d: B('The Sun and everything that goes round it.', 'සූර්යයා සහ ඒ වටා යන සියල්ල.') },
        { fact: B('About 109 Earths could sit side by side across the face of the Sun.', 'සූර්යයාගේ විෂ්කම්භය හරහා පෘථිවි 109ක් පමණ එක පෙළට තැබිය හැකිය.') }] },
    { box: [B('The Sun gives out its own light. The planets and the Moon do <b>not</b> — they only reflect (send back) the sunlight that falls on them.',
        'සූර්යයා තමාගේම ආලෝකය නිකුත් කරයි. ග්‍රහලෝක සහ චන්ද්‍රයා එසේ <b>නොකරයි</b> — ඒවා කරන්නේ තමා මතට වැටෙන හිරු එළිය පරාවර්තනය කිරීම (ආපසු යැවීම) පමණි.')], k: 'key',
      s: [{ term: B('reflect', 'පරාවර්තනය'), d: B('To send light back from a surface.', 'පෘෂ්ඨයකින් ආලෝකය ආපසු යැවීම.') },
        { rem: B('Never look straight at the Sun, even with sunglasses. It can damage your eyes.', 'අව් කණ්ණාඩි පැළඳ සිටියත් කිසිවිටෙක සූර්යයා දෙස කෙළින්ම නොබලන්න. එයින් ඇස්වලට හානි විය හැකිය.') }] },

    /* 2 */
    { sec: B('Eight planets', 'ග්‍රහලෝක අට'),
      lead: B('Eight planets travel round the Sun. Each one moves on its own path, called an <b>orbit</b>.',
        'ග්‍රහලෝක අටක් සූර්යයා වටා ගමන් කරයි. එක් එක් ග්‍රහලෝකය ගමන් කරන්නේ <b>කක්ෂය</b> නම් වූ තමාගේම මාර්ගයක ය.'),
      s: [{ term: B('planet', 'ග්‍රහලෝකය'), d: B('A large round body that goes round the Sun.', 'සූර්යයා වටා යන විශාල ගෝලාකාර වස්තුවකි.') },
        { term: B('orbit', 'කක්ෂය'), d: B('The path of a planet round the Sun.', 'ග්‍රහලෝකයක් සූර්යයා වටා යන මාර්ගය.') }] },
    { fig: { img: 'sol-orbits', w: 120, labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].map(n => [n, null, 'c']) },
      cap: B('The eight planets on their orbits. Sizes and distances are not to scale.', 'ග්‍රහලෝක අට තම කක්ෂවල. ප්‍රමාණ සහ දුර පරිමාණයට නැත.'),
      s: { note: B('Order from the Sun:<br><b>1</b> Mercury · <b>2</b> Venus · <b>3</b> Earth · <b>4</b> Mars · <b>5</b> Jupiter · <b>6</b> Saturn · <b>7</b> Uranus · <b>8</b> Neptune',
        'සූර්යයාගේ සිට පිළිවෙළ:<br><b>1</b> බුධ · <b>2</b> සිකුරු · <b>3</b> පෘථිවිය · <b>4</b> අඟහරු · <b>5</b> බ්‍රහස්පති · <b>6</b> සෙනසුරු · <b>7</b> යුරේනස් · <b>8</b> නෙප්චූන්'), tag: B('Remember', 'මතක තබා ගන්න') } },
    { tbl: { head: [B('No.', 'අංකය'), B('Planet', 'ග්‍රහලෝකය'), B('One thing to remember', 'මතක තබා ගත යුතු කරුණ'), B('One trip round the Sun', 'සූර්යයා වටා එක් වටයක්')], num: [0],
      rows: [
        ['1', B('Mercury', 'බුධ'), B('closest to the Sun; the smallest planet', 'සූර්යයාට ළඟම; කුඩාම ග්‍රහලෝකය'), B('88 days', 'දින 88')],
        ['2', B('Venus', 'සිකුරු'), B('the hottest planet; the brightest planet in our sky', 'උණුසුම්ම ග්‍රහලෝකය; අහසේ දීප්තිමත්ම ග්‍රහලෝකය'), B('225 days', 'දින 225')],
        ['3', B('Earth', 'පෘථිවිය'), B('the only planet known to have life', 'ජීවය ඇති බව දන්නා එකම ග්‍රහලෝකය'), B('365¼ days', 'දින 365¼')],
        ['4', B('Mars', 'අඟහරු'), B('the red planet', 'රතු ග්‍රහලෝකය'), B('about 2 years', 'අවුරුදු 2ක් පමණ')],
        ['5', B('Jupiter', 'බ්‍රහස්පති'), B('the largest planet', 'විශාලතම ග්‍රහලෝකය'), B('about 12 years', 'අවුරුදු 12ක් පමණ')],
        ['6', B('Saturn', 'සෙනසුරු'), B('has the clearest rings', 'පැහැදිලිම වළලු ඇත'), B('about 29 years', 'අවුරුදු 29ක් පමණ')],
        ['7', B('Uranus', 'යුරේනස්'), B('spins lying on its side', 'පැත්තකට ඇල වී කරකැවේ'), B('84 years', 'අවුරුදු 84')],
        ['8', B('Neptune', 'නෙප්චූන්'), B('the farthest from the Sun', 'සූර්යයාගේ සිට ඈතම ග්‍රහලෝකය'), B('165 years', 'අවුරුදු 165')]] },
      s: { fact: B('The farther a planet is from the Sun, the longer it takes to go once round it.', 'ග්‍රහලෝකයක් සූර්යයාගේ සිට ඈත් වන තරමට, ඒ වටා එක් වටයක් යාමට ගත වන කාලය වැඩි වේ.') } },
    { ex: { q: B('Which planet is between the Earth and Jupiter?', 'පෘථිවිය සහ බ්‍රහස්පති අතර ඇති ග්‍රහලෝකය කුමක්ද?'),
        steps: [B('Write the order: Mercury, Venus, <b>Earth</b>, Mars, <b>Jupiter</b>, …', 'පිළිවෙළ ලියන්න: බුධ, සිකුරු, <b>පෘථිවිය</b>, අඟහරු, <b>බ්‍රහස්පති</b>, …'),
          B('The Earth is 3rd and Jupiter is 5th. The planet in between is the 4th.', 'පෘථිවිය 3 වැන්න, බ්‍රහස්පති 5 වැන්න. ඒ අතර ඇත්තේ 4 වැන්නයි.')],
        a: B('Answer: Mars', 'පිළිතුර: අඟහරු') },
      s: { note: B('Make a sentence from the first letters to remember the order — for example <i>“My Very Easy Method Just Speeds Up Naming”</i>.', 'පිළිවෙළ මතක තබා ගැනීමට මුල් අකුරුවලින් වාක්‍යයක් හදාගන්න — <i>“බු සි පෘ අ, බ්‍ර සෙ යු නෙ”</i> ලෙස හයියෙන් කියන්න.'), tag: B('Tip', 'ඉඟිය') } },
    { check: [
      { q: B('Which planet is closest to the Sun?', 'සූර්යයාට ළඟම ග්‍රහලෝකය කුමක්ද?'), a: B('Mercury', 'බුධ') },
      { q: B('Which planet is called the red planet?', 'රතු ග්‍රහලෝකය ලෙස හඳුන්වන්නේ කුමන ග්‍රහලෝකයද?'), a: B('Mars', 'අඟහරු') },
      { q: B('How many planets go round the Sun?', 'සූර්යයා වටා ග්‍රහලෝක කීයක් යයිද?'), a: B('Eight (8)', 'අටක් (8)') }] },

    /* 3 */
    { sec: B('Small and giant planets', 'කුඩා සහ යෝධ ග්‍රහලෝක'),
      lead: B('The four planets nearest the Sun are small and made of rock. The four outer planets are giants made mostly of gas.',
        'සූර්යයාට ළඟම ග්‍රහලෝක හතර කුඩා වන අතර පාෂාණවලින් සෑදී ඇත. පිටත ග්‍රහලෝක හතර බොහෝ දුරට වායුවලින් සෑදුණු යෝධයන් ය.') },
    { fig: { img: 'sol-sizes', w: 178, labels: [['Mercury', null, 'c', 9, -3], ['Venus', null, 'c', -9, -2], ['Earth', null, 'c', 9, 2], ['Mars', null, 'c', -9, 3],
        ['Jupiter', null, 'c'], ['Saturn', null, 'c'], ['Uranus', null, 'c'], ['Neptune', null, 'c']] },
      cap: B('The planets drawn to the same scale, with the edge of the Sun at the left. Distances are not to scale.', 'ග්‍රහලෝක එකම පරිමාණයට, වම් පස සූර්යයාගේ දාරය සමඟ. දුර පරිමාණයට නැත.'), wide: true },
    { tbl: { head: [B('Small rocky planets', 'කුඩා පාෂාණමය ග්‍රහලෝක'), B('Giant gas planets', 'යෝධ වායුමය ග්‍රහලෝක')],
      rows: [[B('Mercury, Venus, Earth, Mars', 'බුධ, සිකුරු, පෘථිවිය, අඟහරු'), B('Jupiter, Saturn, Uranus, Neptune', 'බ්‍රහස්පති, සෙනසුරු, යුරේනස්, නෙප්චූන්')],
        [B('closer to the Sun', 'සූර්යයාට ළඟින්'), B('far from the Sun', 'සූර්යයාගෙන් ඈතින්')],
        [B('hard, rocky surface', 'තද පාෂාණමය පෘෂ්ඨයක්'), B('no hard surface to stand on', 'සිටගත හැකි තද පෘෂ්ඨයක් නැත')],
        [B('few or no moons', 'චන්ද්‍රිකා කිහිපයක් හෝ නැත'), B('many moons and rings', 'චන්ද්‍රිකා රාශියක් සහ වළලු')]] },
      s: { fact: B('Jupiter is about 11 times as wide as the Earth. More than 1,000 Earths could fit inside it.', 'බ්‍රහස්පතිගේ විෂ්කම්භය පෘථිවියේ විෂ්කම්භය මෙන් 11 ගුණයක් පමණ වේ. ඒ තුළට පෘථිවි 1,000කට වඩා ඇතුළු කළ හැකිය.') } },
    { check: [
      { q: B('Name the largest planet.', 'විශාලතම ග්‍රහලෝකය නම් කරන්න.'), a: B('Jupiter', 'බ්‍රහස්පති') },
      { q: B('Write the four rocky planets in order from the Sun.', 'පාෂාණමය ග්‍රහලෝක හතර සූර්යයාගේ සිට පිළිවෙළට ලියන්න.'), a: B('Mercury, Venus, Earth, Mars', 'බුධ, සිකුරු, පෘථිවිය, අඟහරු') }] },

    /* 4 */
    { sec: B('Day and night', 'දිවා රෑ ඇති වීම'),
      lead: B('The Earth spins on its <b>axis</b> — an imaginary line through the North and South Poles. One full spin is called a <b>rotation</b> and takes about 24 hours.',
        'පෘථිවිය තම <b>අක්ෂය</b> වටා කරකැවේ — උතුරු සහ දකුණු ධ්‍රැව හරහා යන මනඃකල්පිත රේඛාවකි. එක් සම්පූර්ණ කරකැවීමක් <b>භ්‍රමණය</b> ලෙස හැඳින්වෙන අතර ඊට පැය 24ක් පමණ ගත වේ.'),
      s: [{ term: B('axis', 'අක්ෂය'), d: B('The imaginary line the Earth spins round.', 'පෘථිවිය කරකැවෙන මනඃකල්පිත රේඛාව.') },
        { term: B('rotation', 'භ්‍රමණය'), d: B('Spinning on the axis. One rotation ≈ 24 hours.', 'අක්ෂය වටා කරකැවීම. එක් භ්‍රමණයක් ≈ පැය 24.') }] },
    { fig: { svg: dayNight }, cap: B('The half of the Earth facing the Sun has day; the other half has night.', 'සූර්යයාට මුහුණලා ඇති පෘථිවි අර්ධයට දවල් ය; අනෙක් අර්ධයට රාත්‍රිය ය.'),
      s: { rem: B('Day and night happen because the Earth <b>rotates</b> — not because the Sun moves round the Earth.', 'දිවා රෑ ඇති වන්නේ පෘථිවිය <b>භ්‍රමණය</b> වන නිසා ය — සූර්යයා පෘථිවිය වටා යන නිසා නොවේ.') } },
    { p: B('As the Earth turns, Sri Lanka moves into the sunlight (sunrise), through the middle of the day (noon), and out of it again (sunset). The Earth spins from <b>west to east</b>, so the Sun seems to rise in the <b>east</b> and set in the <b>west</b>.',
        'පෘථිවිය කරකැවෙන විට ශ්‍රී ලංකාව හිරු එළියට පැමිණේ (හිරු උදාව), දවල් මැදින් ගමන් කර (මධ්‍යාහ්නය), නැවත එයින් ඉවතට යයි (හිරු බැසීම). පෘථිවිය කරකැවෙන්නේ <b>බටහිර සිට නැගෙනහිරට</b> නිසා සූර්යයා <b>නැගෙනහිරින්</b> උදා වී <b>බටහිරින්</b> බැස යන බව පෙනේ.'),
      s: { fig: { img: 'sol-earth', w: 42, labels: [['Sri Lanka', null, 'c', -5, -4]] }, cap: B('Morning in Sri Lanka. Night is coming over Africa.', 'ශ්‍රී ලංකාවේ උදෑසන. අප්‍රිකාවට රාත්‍රිය එළඹෙමින් පවතී.') } },
    { check: [
      { q: B('What is one spin of the Earth on its axis called?', 'පෘථිවිය තම අක්ෂය වටා එක් වරක් කරකැවීම හඳුන්වන්නේ කුමක්ද?'), a: B('A rotation (about 24 hours)', 'භ්‍රමණය (පැය 24ක් පමණ)') },
      { q: B('In which direction does the Sun seem to rise?', 'සූර්යයා උදා වන බව පෙනෙන්නේ කුමන දිශාවෙන්ද?'), a: B('East', 'නැගෙනහිරින්') }] },

    /* 5 */
    { sec: B('One year', 'අවුරුද්දක්'),
      lead: B('While it spins, the Earth also travels round the Sun. One full trip round the Sun is a <b>revolution</b>. It takes 365¼ days — one year.',
        'කරකැවෙන අතරම පෘථිවිය සූර්යයා වටාද ගමන් කරයි. සූර්යයා වටා එක් සම්පූර්ණ වටයක් <b>පරිභ්‍රමණය</b> වේ. ඊට දින 365¼ක් — එනම් අවුරුද්දක් — ගත වේ.'),
      s: { term: B('revolution', 'පරිභ්‍රමණය'), d: B('Going once round the Sun. One revolution = 1 year.', 'සූර්යයා වටා එක් වරක් යාම. එක් පරිභ්‍රමණයක් = අවුරුද්දක්.') } },
    { fig: { svg: year }, cap: B('The Earth on its orbit (seen from above, not to scale).', 'පෘථිවිය තම කක්ෂයේ (ඉහළ සිට, පරිමාණයට නැත).') },
    { p: B('Our calendar year has 365 days. The extra ¼ day each year adds up: after 4 years it makes one whole day. So once in every 4 years February gets a 29th day, and that year has 366 days. It is called a <b>leap year</b>.',
        'අපේ දින දර්ශන අවුරුද්දට දින 365ක් ඇත. සෑම අවුරුද්දකම ඉතිරි වන දින ¼ එකතු වී අවුරුදු 4කට පසු එක් මුළු දිනයක් වේ. එබැවින් අවුරුදු 4කට වරක් පෙබරවාරි මාසයට 29 වැනි දිනයක් එකතු වන අතර එම අවුරුද්දට දින 366ක් ඇත. එය <b>අධික අවුරුද්ද</b> ලෙස හැඳින්වේ.'),
      s: { term: B('leap year', 'අධික අවුරුද්ද'), d: B('A year of 366 days; February has 29 days.', 'දින 366ක අවුරුද්දක්; පෙබරවාරියට දින 29කි.') } },
    { ex: { q: B('Is 2028 a leap year?', '2028 අධික අවුරුද්දක්ද?'),
        steps: [B('A leap year (in our time) can be divided exactly by 4.', 'අධික අවුරුද්දක් (අපේ කාලයේ) 4න් ඉතිරි නැතිව බෙදේ.'),
          B('2028 ÷ 4 = 507, with no remainder.', '2028 ÷ 4 = 507, ඉතිරියක් නැත.')],
        a: B('Yes — 2028 is a leap year (366 days).', 'ඔව් — 2028 අධික අවුරුද්දකි (දින 366).') },
      s: { fact: B('2024 was a leap year. The next ones are 2028 and 2032.', '2024 අධික අවුරුද්දක් විය. ඊළඟ ඒවා 2028 සහ 2032 යි.') } },
    { ex: { q: B('How many days are there in the three years 2026, 2027 and 2028 together?', '2026, 2027 සහ 2028 යන අවුරුදු තුනේ මුළු දින ගණන කීයද?'),
        steps: [B('2026 and 2027 are ordinary years: 365 + 365 = 730 days.', '2026 සහ 2027 සාමාන්‍ය අවුරුදු ය: 365 + 365 = දින 730.'),
          B('2028 is a leap year: 366 days.', '2028 අධික අවුරුද්දකි: දින 366.'), B('730 + 366 = 1096', '730 + 366 = 1096')],
        a: B('Answer: 1096 days', 'පිළිතුර: දින 1096') } },

    /* 6 */
    { sec: B('The Moon', 'චන්ද්‍රයා'),
      lead: B('The Moon goes round the Earth. It is the Earth\'s only natural <b>satellite</b>. It has no light of its own — we see it because it reflects sunlight.',
        'චන්ද්‍රයා පෘථිවිය වටා ගමන් කරයි. එය පෘථිවියේ එකම ස්වාභාවික <b>චන්ද්‍රිකාවයි</b>. එයට තමාගේම ආලෝකයක් නැත — අපට එය පෙනෙන්නේ හිරු එළිය පරාවර්තනය කරන නිසා ය.'),
      s: [{ term: B('satellite', 'චන්ද්‍රිකාව'), d: B('A body that goes round a planet.', 'ග්‍රහලෝකයක් වටා යන වස්තුවකි.') },
        { fact: B('The Moon is about 384,000 km away. Its width is about one quarter of the Earth\'s.', 'චන්ද්‍රයා කි.මී. 384,000ක් පමණ දුරින් ඇත. එහි විෂ්කම්භය පෘථිවියේ විෂ්කම්භයෙන් හතරෙන් එකක් පමණ වේ.') }] },
    { p: B('Half of the Moon is always lit by the Sun. As the Moon goes round the Earth we see different amounts of that lit half, so its shape seems to change. These shapes are the <b>phases of the Moon</b>. One full set of phases takes about 29½ days — about one month.',
        'චන්ද්‍රයාගෙන් අඩක් සැමවිටම හිරු එළියෙන් ආලෝකමත් වේ. චන්ද්‍රයා පෘථිවිය වටා යන විට ඒ ආලෝකමත් අර්ධයෙන් අපට පෙනෙන කොටස වෙනස් වන නිසා එහි හැඩය වෙනස් වන බව පෙනේ. මෙම හැඩ <b>චන්ද්‍ර කලා</b> වේ. සම්පූර්ණ චන්ද්‍ර කලා චක්‍රයකට දින 29½ක් පමණ — එනම් මාසයක් පමණ — ගත වේ.'),
      s: { term: B('phases of the Moon', 'චන්ද්‍ර කලා'), d: B('The changing shapes of the lit part of the Moon.', 'චන්ද්‍රයාගේ ආලෝකමත් කොටසේ වෙනස් වන හැඩ.') } },
    { fig: { svg: phases }, wide: true, cap: B('The phases of the Moon, counted in days after the new moon.', 'අමාවකින් පසු දින ගණනින් චන්ද්‍ර කලා.') },
    { tbl: { head: [B('Phase', 'කලාව'), B('What we see', 'අපට පෙනෙන දේ'), B('Day', 'දිනය')], num: [2],
      rows: [[B('New moon', 'අමාවක'), B('the Moon cannot be seen', 'චන්ද්‍රයා නොපෙනේ'), '0'],
        [B('First quarter', 'පුර අටවක'), B('right half lit; the lit part is growing', 'දකුණු අර්ධය ආලෝකමත්; ආලෝකමත් කොටස වැඩෙමින්'), '≈ 7'],
        [B('Full moon', 'පුර පසළොස්වක'), B('the whole face is lit — a Poya day', 'මුළු මුහුණතම ආලෝකමත් — පොහොය දිනයකි'), '≈ 15'],
        [B('Last quarter', 'අව අටවක'), B('left half lit; the lit part is getting smaller', 'වම් අර්ධය ආලෝකමත්; ආලෝකමත් කොටස අඩු වෙමින්'), '≈ 22']] },
      s: { rem: B('Every <b>Poya</b> day is a full moon day. There are 12 (sometimes 13) Poya days in a year.', 'සෑම <b>පොහොය</b> දිනයක්ම පුර පසළොස්වක දිනයකි. අවුරුද්දකට පොහොය දින 12ක් (සමහර විට 13ක්) ඇත.') } },
    { check: [
      { q: B('Why can we see the Moon at night?', 'රාත්‍රියේ අපට චන්ද්‍රයා පෙනෙන්නේ ඇයි?'), a: B('It reflects sunlight.', 'එය හිරු එළිය පරාවර්තනය කරන නිසා ය.') },
      { q: B('About how many days are there from one full moon to the next?', 'එක් පුර පසළොස්වකක සිට ඊළඟ පුර පසළොස්වක දක්වා දින කීයක් පමණ ඇත්ද?'), a: B('About 29½ days', 'දින 29½ක් පමණ') },
      { q: B('What do we call the day when the Moon cannot be seen?', 'චන්ද්‍රයා නොපෙනෙන දිනය හඳුන්වන්නේ කුමක්ද?'), a: B('New moon', 'අමාවක') }] }
  ],

  mcq: [
    { q: B('Which of these gives out its own light?', 'පහත ඒවායින් තමාගේම ආලෝකය නිකුත් කරන්නේ කුමක්ද?'), opts: [B('the Moon', 'චන්ද්‍රයා'), B('the Sun', 'සූර්යයා'), B('Venus', 'සිකුරු'), B('the Earth', 'පෘථිවිය')], a: 2 },
    { q: B('Which is the largest planet in the solar system?', 'සෞරග්‍රහ මණ්ඩලයේ විශාලතම ග්‍රහලෝකය කුමක්ද?'), opts: [B('Earth', 'පෘථිවිය'), B('Saturn', 'සෙනසුරු'), B('Jupiter', 'බ්‍රහස්පති'), B('Neptune', 'නෙප්චූන්')], a: 3 },
    { q: B('Day and night happen because …', 'දිවා රෑ ඇති වන්නේ …'), opts: [B('the Earth goes round the Sun.', 'පෘථිවිය සූර්යයා වටා යන නිසා ය.'), B('the Earth spins on its axis.', 'පෘථිවිය තම අක්ෂය වටා කරකැවෙන නිසා ය.'), B('the Moon goes round the Earth.', 'චන්ද්‍රයා පෘථිවිය වටා යන නිසා ය.'), B('the Sun goes round the Earth.', 'සූර්යයා පෘථිවිය වටා යන නිසා ය.')], a: 2 },
    { q: B('Which planet is fourth from the Sun?', 'සූර්යයාගේ සිට හතරවැනි ග්‍රහලෝකය කුමක්ද?'), opts: [B('Mars', 'අඟහරු'), B('Earth', 'පෘථිවිය'), B('Venus', 'සිකුරු'), B('Jupiter', 'බ්‍රහස්පති')], a: 1 },
    { q: B('How many days are there in a leap year?', 'අධික අවුරුද්දක දින කීයක් ඇත්ද?'), opts: ['364', '365', '366', '367'], a: 3 },
    { q: B('Which one is the hottest planet?', 'උණුසුම්ම ග්‍රහලෝකය කුමක්ද?'), opts: [B('Mercury', 'බුධ'), B('Venus', 'සිකුරු'), B('Mars', 'අඟහරු'), B('Saturn', 'සෙනසුරු')], a: 2,
      why: B('Venus, not Mercury: its thick blanket of gas traps the heat.', 'බුධ නොව සිකුරු: එහි ඝන වායු ආවරණය තාපය රඳවා තබා ගනී.') },
    { q: B('Every Poya day is a …', 'සෑම පොහොය දිනයක්ම …'), opts: [B('new moon day.', 'අමාවක දිනයකි.'), B('first quarter day.', 'පුර අටවක දිනයකි.'), B('full moon day.', 'පුර පසළොස්වක දිනයකි.'), B('last quarter day.', 'අව අටවක දිනයකි.')], a: 3 },
    { q: B('Which group has only giant gas planets?', 'යෝධ වායුමය ග්‍රහලෝක පමණක් ඇති කාණ්ඩය කුමක්ද?'), opts: [B('Mercury, Venus, Mars', 'බුධ, සිකුරු, අඟහරු'), B('Earth, Jupiter, Saturn', 'පෘථිවිය, බ්‍රහස්පති, සෙනසුරු'), B('Saturn, Uranus, Neptune', 'සෙනසුරු, යුරේනස්, නෙප්චූන්'), B('Mars, Jupiter, Uranus', 'අඟහරු, බ්‍රහස්පති, යුරේනස්')], a: 3 },
    { q: B('The Earth takes about how long to go once round the Sun?', 'පෘථිවිය සූර්යයා වටා එක් වරක් යාමට ගත වන කාලය කොපමණද?'), opts: [B('24 hours', 'පැය 24'), B('29½ days', 'දින 29½'), B('365¼ days', 'දින 365¼'), B('12 years', 'අවුරුදු 12')], a: 3 },
    { q: B('The Sun seems to set in the …', 'සූර්යයා බැස යන බව පෙනෙන්නේ …'), opts: [B('north.', 'උතුරින්.'), B('south.', 'දකුණින්.'), B('east.', 'නැගෙනහිරින්.'), B('west.', 'බටහිරින්.')], a: 4 }
  ],
  st: [
    { q: B('Look at the order of the planets from the Sun.', 'සූර්යයාගේ සිට ග්‍රහලෝකවල පිළිවෙළ සලකන්න.'), parts: [
      { q: B('Write the names of the planets just before and just after the Earth.', 'පෘථිවියට පෙර සහ පසු ඇති ග්‍රහලෝක දෙකේ නම් ලියන්න.'), lines: 1, m: 2, a: B('Before: Venus; after: Mars', 'පෙර: සිකුරු; පසු: අඟහරු') },
      { q: B('Which planet takes the longest time to go round the Sun? Give a reason.', 'සූර්යයා වටා යාමට වැඩිම කාලයක් ගන්නා ග්‍රහලෝකය කුමක්ද? හේතුවක් දෙන්න.'), lines: 2, m: 2, a: B('Neptune — it is the farthest from the Sun, so its orbit is the longest.', 'නෙප්චූන් — එය සූර්යයාගේ සිට ඈතම නිසා එහි කක්ෂය දිගම ය.') },
      { q: B('Name one way in which Jupiter is different from Mars.', 'බ්‍රහස්පති අඟහරුට වඩා වෙනස් වන එක් ආකාරයක් ලියන්න.'), lines: 1, m: 1, a: B('Jupiter is a giant gas planet; Mars is a small rocky planet (or: Jupiter has rings and many moons).', 'බ්‍රහස්පති යෝධ වායුමය ග්‍රහලෝකයකි; අඟහරු කුඩා පාෂාණමය ග්‍රහලෝකයකි (හෝ: බ්‍රහස්පතිට වළලු සහ චන්ද්‍රිකා රාශියක් ඇත).') }] },
    { q: B('Kamal phones his aunt in America at 8 o’clock in the morning, Sri Lanka time. She says it is night there and the stars are out.', 'කමල් ලංකාවේ වේලාවෙන් උදේ 8ට ඇමරිකාවේ සිටින නැන්දාට දුරකථන ඇමතුමක් දෙයි. ඇය කියන්නේ එහි රාත්‍රිය බවත් තරු පායා ඇති බවත් ය.'), parts: [
      { q: B('Why is it night in America when it is morning in Sri Lanka?', 'ලංකාවේ උදෑසන වන විට ඇමරිකාවේ රාත්‍රිය වන්නේ ඇයි?'), lines: 2, m: 2, a: B('America is on the other side of the Earth, the half that is turned away from the Sun.', 'ඇමරිකාව පිහිටා ඇත්තේ පෘථිවියේ අනෙක් පැත්තේ, එනම් සූර්යයාගෙන් අනෙක් පැත්තට හැරී ඇති අර්ධයේ ය.') },
      { q: B('Which movement of the Earth will bring morning to America? What is it called?', 'ඇමරිකාවට උදෑසන ගෙන එන්නේ පෘථිවියේ කුමන චලනයද? එය හඳුන්වන්නේ කුමක්ද?'), lines: 2, m: 2, a: B('The Earth spinning on its axis — rotation.', 'පෘථිවිය තම අක්ෂය වටා කරකැවීම — භ්‍රමණය.') },
      { q: B('How long does one such spin take?', 'එවැනි එක් කරකැවීමකට ගත වන කාලය කොපමණද?'), lines: 1, m: 1, a: B('About 24 hours.', 'පැය 24ක් පමණ.') }] },
    { q: B('The full moon Poya of one month was on the 5th.', 'එක් මාසයක පුර පසළොස්වක පොහොය 5 වැනිදා විය.'), parts: [
      { q: B('About which date will the next new moon be?', 'ඊළඟ අමාවක දළ වශයෙන් කුමන දිනයේ වේද?'), lines: 1, m: 2, a: B('About the 20th (about 15 days later).', '20 වැනිදා පමණ (දින 15කට පමණ පසු).') },
      { q: B('About which date will the next full moon Poya be (in a 30-day month)?', 'ඊළඟ පුර පසළොස්වක පොහොය දළ වශයෙන් කුමන දිනයේ වේද (දින 30ක මාසයක)?'), lines: 1, m: 2, a: B('About the 4th or 5th of the next month (29½ days later).', 'ඊළඟ මාසයේ 4 හෝ 5 වැනිදා පමණ (දින 29½කට පසු).') },
      { q: B('Draw the shape of the Moon you would see at the first quarter.', 'පුර අටවක දිනයේ පෙනෙන චන්ද්‍රයාගේ හැඩය අඳින්න.'), draw: 32, m: 1, a: B('A circle with the right half lit (a half moon).', 'දකුණු අර්ධය ආලෝකමත් වූ රවුමක් (අඩ සඳ).') }] }
  ],
  summary: [
    B('The Sun is a star. It makes its own light and heat.', 'සූර්යයා තාරකාවකි. එය තමාගේම ආලෝකය සහ තාපය නිපදවයි.'),
    B('Eight planets go round the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', 'ග්‍රහලෝක අටක් සූර්යයා වටා යයි: බුධ, සිකුරු, පෘථිවිය, අඟහරු, බ්‍රහස්පති, සෙනසුරු, යුරේනස්, නෙප්චූන්.'),
    B('Planets and the Moon only reflect sunlight.', 'ග්‍රහලෝක සහ චන්ද්‍රයා හිරු එළිය පරාවර්තනය කරයි පමණි.'),
    B('The inner four planets are small and rocky; the outer four are gas giants. Jupiter is the largest.', 'ඇතුළත ග්‍රහලෝක හතර කුඩා, පාෂාණමය ය; පිටත හතර යෝධ වායුමය ය. විශාලතම බ්‍රහස්පති ය.'),
    B('Rotation (about 24 hours) → day and night. The Sun seems to rise in the east.', 'භ්‍රමණය (පැය 24ක් පමණ) → දිවා රෑ. සූර්යයා නැගෙනහිරින් උදා වන බව පෙනේ.'),
    B('Revolution (365¼ days) → one year.', 'පරිභ්‍රමණය (දින 365¼) → අවුරුද්දක්.'),
    B('A leap year has 366 days, once in 4 years (February 29).', 'අවුරුදු 4කට වරක් එන අධික අවුරුද්දට දින 366කි (පෙබරවාරි 29).'),
    B('The Moon is the Earth\'s natural satellite. Its phases repeat every 29½ days; every Poya is a full moon.', 'චන්ද්‍රයා පෘථිවියේ ස්වාභාවික චන්ද්‍රිකාවයි. චන්ද්‍ර කලා දින 29½කට වරක් නැවත සිදු වේ; සෑම පොහොයක්ම පුර පසළොස්වකකි.')
  ],
  words: [B('new moon', 'අමාවක'), B('full moon', 'පුර පසළොස්වක')]
};
