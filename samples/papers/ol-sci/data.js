// O/L Science — sample paper (Part A MCQ + Part B structured)
const vt = SVG(280, 160, `
  <defs><marker id="vtah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#141414"/></marker></defs>
  <g stroke="#141414" stroke-width="1" fill="none"><path d="M40 130 H262" marker-end="url(#vtah)"/><path d="M40 130 V14" marker-end="url(#vtah)"/>
  <path d="M90 130 v4 M140 130 v4 M190 130 v4 M240 130 v4 M36 90 h4 M36 50 h4"/></g>
  <path d="M40 130 L140 50 L240 50" fill="none" stroke="#141414" stroke-width="1.6"/>
  <path d="M140 50 V130 M40 50 H140" fill="none" stroke="#141414" stroke-width=".8" stroke-dasharray="3 3"/>
  <text x="86" y="146" class="m">2</text><text x="136" y="146" class="m">4</text><text x="186" y="146" class="m">6</text><text x="236" y="146" class="m">8</text>
  <text x="34" y="146" class="m">0</text><text x="20" y="94" class="m">10</text><text x="20" y="54" class="m">20</text>
  <text x="248" y="146" class="m">t / s</text><text x="46" y="12" class="m">v / m s⁻¹</text>`);
const box = (x, y, w, s) => `<rect x="${x}" y="${y}" width="${w}" height="30" fill="#fff" stroke="#141414" stroke-width="1.2"/><text x="${x + w / 2}" y="${y + 19}" text-anchor="middle">${s}</text>`;
const lbl = (x, y, s) => `<circle cx="${x}" cy="${y}" r="8" fill="#fff" stroke="#141414" stroke-width="1"/><text x="${x}" y="${y + 4}" text-anchor="middle" style="font-weight:700">${s}</text>`;
const loop = n => SVG(420, 196, `
  <defs><marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#141414"/></marker></defs>
  <g fill="none" stroke="#141414" stroke-width="1.3">
    <path d="M160 175 H8 V80 H18" marker-end="url(#ah)"/><path d="M125 125 H140 V25 H158" marker-end="url(#ah)"/>
    <path d="M260 25 H280 V80 H293" marker-end="url(#ah)"/><path d="M400 125 H412 V175 H262" marker-end="url(#ah)"/>
    <path d="M72 95 V108" marker-end="url(#ah)"/><path d="M347 95 V108" marker-end="url(#ah)"/></g>
  ${box(160, 10, 100, n[0])}${box(160, 160, 100, n[1])}${box(20, 65, 105, n[2])}${box(20, 110, 105, n[3])}${box(295, 65, 105, n[4])}${box(295, 110, 105, n[5])}
  ${lbl(80, 175, 'A')}${lbl(140, 70, 'B')}${lbl(280, 52, 'C')}${lbl(340, 175, 'D')}`);
const loopFig = { en: loop(['Lungs', 'Body tissues', 'Right atrium', 'Right ventricle', 'Left atrium', 'Left ventricle']),
                  si: loop(['පෙනහළු', 'දේහ පටක', 'දකුණු කර්ණිකාව', 'දකුණු කෝෂිකාව', 'වම් කර්ණිකාව', 'වම් කෝෂිකාව']) };

window.PAPER = {
  code: 'OLS-S1', accent: '#c8102e',
  inst: { en: 'Kelani Academy · Science class', si: 'කැලණි ඇකඩමිය · විද්‍යාව පන්තිය' },
  subject: { en: 'Science', si: 'විද්‍යාව' },
  title: { en: 'G.C.E. (O/L) — Term test, sample paper', si: 'අ.පො.ස. (සා.පෙළ) — වාර පරීක්ෂණය, ආදර්ශ ප්‍රශ්න පත්‍රය' },
  grade: { en: '10 – 11', si: '10 – 11' }, time: { en: '1 hour', si: 'පැය 1' }, marks: 50,
  instr: [
    { en: 'Answer <b>all</b> the questions.', si: '<b>සියලු ම</b> ප්‍රශ්නවලට පිළිතුරු සපයන්න.' },
    { en: 'Part A: choose the correct or most suitable answer and write its number in the box on the right.', si: 'A කොටස: නිවැරදි හෝ වඩාත් ගැළපෙන පිළිතුර තෝරා එහි අංකය දකුණු පස කොටුවේ ලියන්න.' },
    { en: 'Part B: write the answers in the space provided.', si: 'B කොටස: පිළිතුරු දී ඇති ඉඩෙහි ලියන්න.' }],
  parts: [
    { h: { en: 'Part A', si: 'A කොටස' }, note: { en: 'Multiple choice', si: 'බහුවරණ' }, mk: '10 × 2 = 20', qs: [
      { t: 'mcq', a: 3, q: { en: 'Which part of the blood helps blood to clot?', si: 'රුධිරය කැටි ගැසීමට උපකාරී වන්නේ රුධිරයේ කුමන කොටස ද?' },
        opts: [{ en: 'red blood cells', si: 'රතු රුධිරාණු' }, { en: 'white blood cells', si: 'සුදු රුධිරාණු' }, { en: 'platelets', si: 'රුධිර පට්ටිකා' }, { en: 'plasma', si: 'ප්ලාස්මය' }], cols: 4 },
      { t: 'mcq', a: 1, q: { en: 'Which blood vessels have valves along their length to stop blood flowing back?', si: 'රුධිරය ආපසු ගැලීම වැළැක්වීමට දිග දිගට කපාට ඇත්තේ කුමන රුධිර වාහිනීවල ද?' },
        opts: [{ en: 'veins', si: 'ශිරා' }, { en: 'arteries', si: 'ධමනි' }, { en: 'capillaries', si: 'කේශනාලිකා' }, { en: 'the aorta', si: 'මහා ධමනිය' }] },
      { t: 'mcq', a: 2, q: { en: 'The atomic number of sodium is 11. Its electron configuration is', si: 'සෝඩියම්හි පරමාණුක ක්‍රමාංකය 11 වේ. එහි ඉලෙක්ට්‍රෝන වින්‍යාසය වන්නේ' },
        opts: ['2, 9', '2, 8, 1', '2, 1, 8', '8, 2, 1'] },
      { t: 'mcq', a: 3, q: { en: 'The pH of a neutral solution at 25 °C is', si: '25 °C දී උදාසීන ද්‍රාවණයක pH අගය වන්නේ' }, opts: ['0', '1', '7', '14'] },
      { t: 'mcq', a: 4, q: { en: 'Which of the following is a chemical change?', si: 'පහත දැක්වෙන ඒවායින් රසායනික විපර්යාසයක් වන්නේ' },
        opts: [{ en: 'melting of ice', si: 'අයිස් දියවීම' }, { en: 'dissolving salt in water', si: 'ලුණු ජලයේ දියවීම' }, { en: 'boiling of water', si: 'ජලය නැටීම' }, { en: 'rusting of iron', si: 'යකඩ මලකෑම' }], cols: 2 },
      { t: 'mcq', a: 2, fig: vt, q: { en: 'The velocity–time graph of a vehicle is shown. Its acceleration during the first 4 s is', si: 'වාහනයක ප්‍රවේග–කාල ප්‍රස්තාරය රූපයේ දැක්වේ. පළමු තත්පර 4 තුළ එහි ත්වරණය වන්නේ' },
        opts: ['4 m s<sup>−2</sup>', '5 m s<sup>−2</sup>', '20 m s<sup>−2</sup>', '80 m s<sup>−2</sup>'], why: both('20 / 4 = 5 m s<sup>−2</sup>') },
      { t: 'mcq', a: 3, q: { en: 'A current of 2 A flows through a 6 Ω resistor. The potential difference across it is', si: '6 Ω ප්‍රතිරෝධකයක් හරහා 2 A ධාරාවක් ගලයි. එය දෙකෙළවර විභව අන්තරය වන්නේ' },
        opts: ['3 V', '8 V', '12 V', '4 V'], why: both('<i class="v">V</i> = <i class="v">IR</i> = 2 × 6') },
      { t: 'mcq', a: 1, q: { en: 'The gas given out by green plants during photosynthesis is', si: 'ප්‍රභාසංශ්ලේෂණයේ දී හරිත ශාක පිට කරන වායුව වන්නේ' },
        opts: [{ en: 'oxygen', si: 'ඔක්සිජන්' }, { en: 'carbon dioxide', si: 'කාබන් ඩයොක්සයිඩ්' }, { en: 'nitrogen', si: 'නයිට්‍රජන්' }, { en: 'hydrogen', si: 'හයිඩ්‍රජන්' }] },
      { t: 'mcq', a: 4, q: { en: 'The SI unit of force is the', si: 'බලයේ SI ඒකකය වන්නේ' },
        opts: [{ en: 'joule', si: 'ජූල්' }, { en: 'watt', si: 'වොට්' }, { en: 'pascal', si: 'පැස්කල්' }, { en: 'newton', si: 'නිව්ටන්' }] },
      { t: 'mcq', a: 2, q: { en: 'Insulin is produced by the', si: 'ඉන්සියුලින් නිපදවනු ලබන්නේ' },
        opts: [{ en: 'thyroid gland', si: 'තයිරොයිඩ් ග්‍රන්ථිය' }, { en: 'pancreas', si: 'අග්න්‍යාශය' }, { en: 'adrenal gland', si: 'අධිවෘක්ක ග්‍රන්ථිය' }, { en: 'pituitary gland', si: 'පිටියුටරි ග්‍රන්ථිය' }], cols: 2 },
    ] },
    { h: { en: 'Part B', si: 'B කොටස' }, note: { en: 'Structured questions', si: 'ව්‍යුහගත ප්‍රශ්න' }, mk: '2 × 15 = 30', qs: [
      { t: 'struct', fig: loopFig, q: { en: 'The diagram shows the path of blood through the heart, the lungs and the body. A, B, C and D are blood vessels.', si: 'හෘදය, පෙනහළු හා දේහය හරහා රුධිරය ගමන් කරන මාර්ගය රූප සටහනේ දැක්වේ. A, B, C හා D රුධිර වාහිනී වේ.' }, parts: [
        { m: 4, lines: 2, q: { en: 'Name the blood vessels A, B, C and D.', si: 'A, B, C හා D රුධිර වාහිනී නම් කරන්න.' },
          a: { en: 'A – vena cava, B – pulmonary artery, C – pulmonary vein, D – aorta', si: 'A – මහා ශිරාව, B – පුප්ඵුසීය ධමනිය, C – පුප්ඵුසීය ශිරාව, D – මහා ධමනිය' }, why: { en: '1 mark each.', si: 'එකකට ලකුණු 1 බැගින්.' } },
        { m: 1, lines: 1, q: { en: 'Which side of the heart carries oxygen-rich blood?', si: 'ඔක්සිජන් බහුල රුධිරය ගෙන යන්නේ හෘදයේ කුමන පැත්ත ද?' }, a: { en: 'the left side', si: 'වම් පැත්ත' } },
        { m: 2, lines: 1, q: { en: 'Name the valve between the left atrium and the left ventricle.', si: 'වම් කර්ණිකාව හා වම් කෝෂිකාව අතර ඇති කපාටය නම් කරන්න.' }, a: { en: 'bicuspid (mitral) valve', si: 'ද්විතුණ්ඩ කපාටය' } },
        { m: 2, lines: 2, q: { en: 'Why is the wall of the left ventricle thicker than that of the right ventricle?', si: 'වම් කෝෂිකාවේ බිත්තිය දකුණු කෝෂිකාවේ බිත්තියට වඩා ඝන වන්නේ ඇයි?' },
          a: { en: 'it pumps blood to the whole body, so it needs a higher pressure', si: 'එය මුළු සිරුරට ම රුධිරය පොම්ප කරන නිසා වැඩි පීඩනයක් අවශ්‍ය වේ' } },
        { m: 2, lines: 1, q: { en: 'What is the function of red blood cells? Name the pigment in them.', si: 'රතු රුධිරාණුවල කාර්යය කුමක් ද? ඒවායේ ඇති වර්ණකය නම් කරන්න.' },
          a: { en: 'carry oxygen (1); haemoglobin (1)', si: 'ඔක්සිජන් පරිවහනය (1); හීමොග්ලොබින් (1)' } },
        { m: 2, lines: 2, q: { en: 'Why is the human circulation called a <i>double circulation</i>?', si: 'මිනිස් රුධිර සංසරණය <i>ද්විත්ව සංසරණයක්</i> ලෙස හඳුන්වන්නේ ඇයි?' },
          a: { en: 'in one full circuit of the body the blood passes through the heart twice', si: 'දේහය වටා එක් වටයක් යන විට රුධිරය හෘදය හරහා දෙවරක් ගමන් කරයි' } },
        { m: 2, lines: 2, q: { en: 'Give two habits that help keep the heart healthy.', si: 'හෘදය නිරෝගීව තබා ගැනීමට උපකාරී වන පුරුදු දෙකක් දෙන්න.' },
          a: { en: 'any two: regular exercise, less fatty or salty food, not smoking, healthy body weight', si: 'ඕනෑ ම දෙකක්: නිතිපතා ව්‍යායාම, මේද හා ලුණු අඩු ආහාර, දුම් නොබීම, නිරෝගී සිරුරු බර' } },
      ] },
      { t: 'struct', q: { en: 'The atomic number of an element X is 12 and its mass number is 24. (X is not its real symbol.)', si: 'X මූලද්‍රව්‍යයේ පරමාණුක ක්‍රමාංකය 12 වන අතර ස්කන්ධ ක්‍රමාංකය 24 වේ. (X එහි සත්‍ය සංකේතය නොවේ.)' }, parts: [
        { m: 3, lines: 1, q: { en: 'Write the number of protons, neutrons and electrons in an atom of X.', si: 'X පරමාණුවක ඇති ප්‍රෝටෝන, නියුට්‍රෝන හා ඉලෙක්ට්‍රෝන සංඛ්‍යා ලියන්න.' },
          a: { en: 'protons 12, neutrons 12, electrons 12', si: 'ප්‍රෝටෝන 12, නියුට්‍රෝන 12, ඉලෙක්ට්‍රෝන 12' } },
        { m: 1, lines: 1, q: { en: 'Write the electron configuration of X.', si: 'X හි ඉලෙක්ට්‍රෝන වින්‍යාසය ලියන්න.' }, a: both('2, 8, 2') },
        { m: 2, lines: 1, q: { en: 'To which group and period of the periodic table does X belong?', si: 'X අයත් වන්නේ ආවර්තිතා වගුවේ කුමන කාණ්ඩයට හා ආවර්තයට ද?' }, a: { en: 'group 2 (1), period 3 (1)', si: 'කාණ්ඩය 2 (1), ආවර්තය 3 (1)' } },
        { m: 2, lines: 1, q: { en: 'X is magnesium. Write the balanced equation for magnesium burning in oxygen.', si: 'X යනු මැග්නීසියම් ය. මැග්නීසියම් ඔක්සිජන්හි දහනය වීමේ තුලිත සමීකරණය ලියන්න.' },
          a: both('2Mg + O<sub>2</sub> → 2MgO'), why: { en: '1 for the formulae, 1 for balancing.', si: 'සූත්‍රවලට 1, තුලනයට 1.' } },
        { m: 2, lines: 1, q: { en: 'Find the relative formula mass of MgO. (Mg = 24, O = 16)', si: 'MgO හි සාපේක්ෂ සූත්‍ර ස්කන්ධය සොයන්න. (Mg = 24, O = 16)' }, a: both('24 + 16 = 40') },
        { m: 2, lines: 1, q: { en: 'How many moles are there in 8 g of MgO?', si: 'MgO 8 g ක ඇති මවුල ගණන කීය ද?' }, a: both('8 / 40 = 0.2 mol') },
        { m: 3, lines: 2, q: { en: 'What type of bond is found in MgO? Is MgO an acidic or a basic oxide?', si: 'MgO හි ඇති බන්ධන වර්ගය කුමක් ද? MgO ආම්ලික ඔක්සයිඩයක් ද, භාෂ්මික ඔක්සයිඩයක් ද?' },
          a: { en: 'ionic bond (1); basic oxide (2)', si: 'අයනික බන්ධනය (1); භාෂ්මික ඔක්සයිඩයකි (2)' } },
      ] },
    ] },
  ],
};
