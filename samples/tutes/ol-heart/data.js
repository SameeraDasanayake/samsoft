// O/L Science — The heart and blood circulation. Renders from the ol-heart deck (models CC BY: neshallads, jalmer) + schematic diagrams.
const INK = '#1c1d1f', RED = '#c3343c', BLUE = '#3560ad';
const tx = (x, y, s, a = 'middle', c = 't', fs = 13, st = '') => `<text class="${c}" x="${x}" y="${y}" font-size="${fs}" text-anchor="${a}" ${st}>${s}</text>`;

const circ = SVG2(l => {
  const box = (x, y, en, si, c) => `<rect x="${x}" y="${y}" width="86" height="46" fill="#fff" stroke="${c}" stroke-width="2"/>` +
    l(B(en, si)).split('|').map((s, i) => tx(x + 43, y + 18 + i * 14, s, 'middle', 't', 11.5)).join('');
  const pth = (d, c, id) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="3.2" marker-end="url(#${id})"/>`;
  return SVG(150, 480, 330, `${ARROW('cR', RED)}${ARROW('cB', BLUE)}
    <rect x="186" y="18" width="108" height="50" fill="#f3e3e1" stroke="${INK}" stroke-width="1.2"/>${tx(240, 48, l(B('Lungs', 'පෙනහළු')), 'middle', 't', 14)}
    <rect x="160" y="268" width="160" height="50" fill="#f3e3e1" stroke="${INK}" stroke-width="1.2"/>${tx(240, 298, l(B('Body tissues', 'දේහ පටක')), 'middle', 't', 14)}
    <rect x="134" y="118" width="212" height="122" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4"/>${tx(340, 112, l(B('heart', 'හෘදය')), 'end', 't', 11)}
    ${box(144, 128, 'Right|atrium', 'දකුණු|කර්ණිකාව', BLUE)}${box(144, 184, 'Right|ventricle', 'දකුණු|කෝෂිකාව', BLUE)}
    ${box(250, 128, 'Left|atrium', 'වම්|කර්ණිකාව', RED)}${box(250, 184, 'Left|ventricle', 'වම්|කෝෂිකාව', RED)}
    <path d="M187 176 V181" stroke="${BLUE}" stroke-width="1.6" marker-end="url(#cB)"/><path d="M293 176 V181" stroke="${RED}" stroke-width="1.6" marker-end="url(#cR)"/>
    ${pth('M230 207 H240 V72', BLUE, 'cB')}${pth('M294 43 H380 V151 H340', RED, 'cR')}
    ${pth('M336 207 H430 V293 H324', RED, 'cR')}${pth('M160 293 H56 V151 H140', BLUE, 'cB')}
    ${tx(150, 92, l(B('pulmonary circulation', 'පුප්ඵුසීය සංසරණය')), 'end', 'ta', 12.5)}${tx(240, 260, l(B('systemic circulation', 'දේහ සංසරණය')), 'middle', 'ta', 12.5)}
    <path d="M14 322 h22" stroke="${RED}" stroke-width="3.2"/>${tx(42, 326, l(B('oxygen-rich', 'ඔක්සිජන් බහුල')), 'start', 't', 11)}
    <path d="M330 322 h22" stroke="${BLUE}" stroke-width="3.2"/>${tx(358, 326, l(B('oxygen-poor', 'ඔක්සිජන් ඌන')), 'start', 't', 11)}`);
});

const vessels = SVG2(l => SVG(124, 480, 170, `
  <circle cx="80" cy="70" r="56" fill="#e7b9b6" stroke="${INK}" stroke-width="1.4"/><circle cx="80" cy="70" r="40" fill="none" stroke="${INK}" stroke-width=".8" stroke-dasharray="3 3"/><circle cx="80" cy="70" r="17" fill="#fff" stroke="${INK}" stroke-width="1.2"/>
  <ellipse cx="240" cy="70" rx="58" ry="48" fill="#cfd8ea" stroke="${INK}" stroke-width="1.4"/><ellipse cx="240" cy="70" rx="48" ry="38" fill="#fff" stroke="${INK}" stroke-width="1.2"/>
  <circle cx="400" cy="70" r="15" fill="#efd9d7" stroke="${INK}" stroke-width="1.2"/><circle cx="400" cy="70" r="10" fill="#fff" stroke="${INK}" stroke-width="1"/><circle cx="400" cy="70" r="6" fill="${RED}"/>
  ${tx(80, 150, l(B('artery', 'ධමනිය')), 'middle', 'ta', 15)}${tx(240, 150, l(B('vein', 'ශිරාව')), 'middle', 'ta', 15)}${tx(400, 150, l(B('capillary', 'කේශනාලිකාව')), 'middle', 'ta', 15)}
  ${tx(80, 166, l(B('thick wall, narrow lumen', 'ඝන බිත්තිය, පටු කුහරය')), 'middle', 't', 10.5)}${tx(240, 166, l(B('thin wall, wide lumen', 'තුනී බිත්තිය, පළල් කුහරය')), 'middle', 't', 10.5)}${tx(400, 166, l(B('wall one cell thick', 'එක් සෛලයක ඝනකම බිත්තිය')), 'middle', 't', 10.5)}
  ${tx(400, 30, l(B('(enlarged)', '(විශාලනය කර)')), 'middle', 't', 10.5)}`));

const IN = { RA: 'Right atrium', RV: 'Right ventricle', LA: 'Left atrium', LV: 'Left ventricle', SEP: 'Middle wall', TRI: 'Tricuspid valve', PSL: 'Semilunar valve (pulmonary)',
  ASL: 'Semilunar valve (aortic)', BI: 'Bicuspid valve', SVC: 'Superior vena cava', IVC: 'Inferior vena cava', AO: 'Aorta', PA: 'Pulmonary artery', PV: 'Pulmonary veins' };

window.TUTE = {
  no: '03', code: 'OLS-T3', accent: '#a11d33', hero: 'hh-hero',
  inst: B('Kelani Academy', 'කැලණි ඇකඩමිය'), teacher: B('O/L Science class', 'සා/පෙළ විද්‍යාව පන්තිය'),
  subject: B('Science', 'විද්‍යාව'), grade: B('O/L · Human biology', 'සා/පෙළ · මිනිස් ජීව විද්‍යාව'),
  title: B('The heart and blood circulation', 'හෘදය සහ රුධිර සංසරණය'),
  sub: B('A pump the size of your fist that never stops — its chambers and valves, the two loops it drives, and the vessels that carry the blood.',
    'කිසිදා නොනවතින, ඔබේ මිටක් තරම් පොම්පය — එහි කුටීර සහ කපාට, එය ක්‍රියාත්මක කරන පුඩු දෙක සහ රුධිරය ගෙන යන වාහිනී.'),
  body: [
    /* 1 */
    { sec: B('Meet the heart', 'හෘදය හඳුනා ගනිමු'),
      lead: B('The heart is a hollow, muscular pump about the size of your fist. It lies in the <b>thoracic cavity</b>, between the two lungs, a little to the left. It is made of <b>cardiac muscle</b>, which contracts all through life without getting tired.',
        'හෘදය ඔබේ මිටක් තරම් විශාලත්වයක් ඇති, කුහරමය පේශිමය පොම්පයකි. එය <b>උරස් කුහරයේ</b>, පෙනහළු දෙක අතර, මඳක් වමට වන්නට පිහිටා ඇත. එය <b>හෘද පේශිවලින්</b> සෑදී ඇති අතර, එම පේශි ජීවිත කාලය පුරාම වෙහෙසට පත් නොවී සංකෝචනය වේ.'),
      s: [{ term: B('cardiac muscle', 'හෘද පේශි'), d: B('The special muscle of the heart; it never tires.', 'හෘදයට ආවේණික පේශි වර්ගය; එය වෙහෙසට පත් නොවේ.') },
        { term: B('thoracic cavity', 'උරස් කුහරය'), d: B('The space inside the chest, protected by the ribs.', 'ඉළ ඇට මගින් ආරක්ෂා වන පපුව තුළ ඇති අවකාශය.') }] },
    { fig: { img: 'hh-out', w: 112, lw: 34, rw: 32, labels: [['Superior vena cava', null, 'l'], ['Right atrium', null, 'l'], ['Right ventricle', null, 'l'], ['Coronary artery', null, 'l'],
        ['Aorta', null, 'r'], ['Pulmonary artery', null, 'r'], ['Left ventricle', null, 'r']] },
      cap: B('The heart from the front. Its right side is on <b>your left</b> as you look at it.', 'ඉදිරියෙන් පෙනෙන හෘදය. එහි දකුණු පැත්ත ඔබ බලන විට <b>ඔබේ වම්</b> පැත්තේ ඇත.'),
      s: [{ rem: B('In heart diagrams, “right” and “left” mean the <b>owner\'s</b> right and left, not yours.', 'හෘද රූපසටහන්වල “දකුණ” සහ “වම” යනු <b>හෘදය අයිති පුද්ගලයාගේ</b> දකුණ සහ වම මිස ඔබේ නොවේ.') },
        { term: B('coronary artery', 'කිරීටක ධමනිය'), d: B('Brings oxygen-rich blood to the heart muscle itself.', 'හෘද පේශියටම ඔක්සිජන් බහුල රුධිරය සපයයි.') }] },

    /* 2 */
    { sec: B('Four chambers and four valves', 'කුටීර හතර සහ කපාට'),
      lead: B('Inside, a wall (the septum) divides the heart into a right side and a left side, so the two kinds of blood never mix. Each side has an upper <b>atrium</b> that receives blood and a lower <b>ventricle</b> that pumps it out.',
        'හෘදය ඇතුළත ඇති බිත්තියක් (මැද බිත්තිය) මගින් එය දකුණු පැත්තක් සහ වම් පැත්තක් ලෙස බෙදයි; එබැවින් රුධිර වර්ග දෙක කිසිවිටෙක මිශ්‍ර නොවේ. සෑම පැත්තකම රුධිරය ලබා ගන්නා ඉහළ <b>කර්ණිකාවක්</b> සහ එය පිටතට පොම්ප කරන පහළ <b>කෝෂිකාවක්</b> ඇත.'),
      s: [{ term: B('atrium (pl. atria)', 'කර්ණිකාව'), d: B('Upper chamber; receives blood from the veins.', 'ඉහළ කුටීරය; ශිරාවලින් රුධිරය ලබා ගනී.') },
        { term: B('ventricle', 'කෝෂිකාව'), d: B('Lower chamber; pumps blood into the arteries.', 'පහළ කුටීරය; රුධිරය ධමනිවලට පොම්ප කරයි.') }] },
    { fig: { img: 'hh-in', w: 172, lw: 46, rw: 50, labels: [
        [IN.SVC, null, 'l'], [IN.RA, null, 'l'], [IN.PSL, B('Semilunar valve\n(pulmonary)', 'අර්ධචන්ද්‍රාකාර කපාටය\n(පුප්ඵුසීය)'), 'l'], [IN.TRI, null, 'l'], [IN.RV, null, 'l'], [IN.IVC, null, 'l'],
        [IN.AO, null, 'r'], [IN.PA, null, 'r'], [IN.PV, null, 'r'], [IN.LA, null, 'r'], [IN.ASL, B('Semilunar valve\n(aortic)', 'අර්ධචන්ද්‍රාකාර කපාටය\n(මහා ධමනිය)'), 'r'], [IN.BI, null, 'r'],
        [IN.SEP, B('Septum (middle wall)', 'මැද බිත්තිය'), 'r'], [IN.LV, null, 'r']] },
      cap: B('The heart cut open from the front.', 'ඉදිරියෙන් කපා විවෘත කළ හෘදය.'), wide: true },
    { tbl: { head: [B('Chamber', 'කුටීරය'), B('Receives blood from', 'රුධිරය ලබා ගන්නේ'), B('Sends blood to', 'රුධිරය යවන්නේ')],
      rows: [[B('Right atrium', 'දකුණු කර්ණිකාව'), B('the body (venae cavae)', 'සිරුරෙන් (මහා ශිරා)'), B('right ventricle', 'දකුණු කෝෂිකාවට')],
        [B('Right ventricle', 'දකුණු කෝෂිකාව'), B('right atrium', 'දකුණු කර්ණිකාවෙන්'), B('lungs (pulmonary artery)', 'පෙනහළුවලට (පුප්ඵුසීය ධමනිය)')],
        [B('Left atrium', 'වම් කර්ණිකාව'), B('the lungs (pulmonary veins)', 'පෙනහළුවලින් (පුප්ඵුසීය ශිරා)'), B('left ventricle', 'වම් කෝෂිකාවට')],
        [B('Left ventricle', 'වම් කෝෂිකාව'), B('left atrium', 'වම් කර්ණිකාවෙන්'), B('whole body (aorta)', 'මුළු සිරුරට (මහා ධමනිය)')]] },
      s: { rem: B('The <b>left ventricle</b> has the thickest wall: it pumps blood all round the body.', '<b>වම් කෝෂිකාවට</b> ඝනම බිත්තිය ඇත: එය මුළු සිරුර පුරාම රුධිරය පොම්ප කරයි.') } },
    { ul: [B('<b>Tricuspid valve</b> — between the right atrium and right ventricle.', '<b>ත්‍රිතුණ්ඩ කපාටය</b> — දකුණු කර්ණිකාව සහ දකුණු කෝෂිකාව අතර.'),
        B('<b>Bicuspid valve</b> — between the left atrium and left ventricle.', '<b>ද්විතුණ්ඩ කපාටය</b> — වම් කර්ණිකාව සහ වම් කෝෂිකාව අතර.'),
        B('<b>Semilunar valves</b> — at the start of the pulmonary artery and of the aorta.', '<b>අර්ධචන්ද්‍රාකාර කපාට</b> — පුප්ඵුසීය ධමනියේ සහ මහා ධමනියේ ආරම්භයේ.')],
      intro: B('<b>Valves</b> are flaps that let blood flow one way only. When blood tries to flow back, they close.', '<b>කපාට</b> යනු රුධිරයට එක් දිශාවකට පමණක් ගලා යාමට ඉඩ දෙන පියන් ය. රුධිරය ආපසු ගලන්නට උත්සාහ කරන විට ඒවා වැසේ.'),
      s: { term: B('valve', 'කපාටය'), d: B('A flap that stops blood flowing backwards.', 'රුධිරය ආපසු ගැලීම වළක්වන පියනකි.') } },
    { check: [
      { q: B('Which chamber pumps blood to the lungs?', 'පෙනහළු වෙත රුධිරය පොම්ප කරන්නේ කුමන කුටීරයද?'), a: B('Right ventricle', 'දකුණු කෝෂිකාව') },
      { q: B('Name the valve between the left atrium and the left ventricle.', 'වම් කර්ණිකාව සහ වම් කෝෂිකාව අතර ඇති කපාටය නම් කරන්න.'), a: B('Bicuspid valve', 'ද්විතුණ්ඩ කපාටය') },
      { q: B('Why is the wall of the left ventricle thicker than that of the right ventricle?', 'වම් කෝෂිකාවේ බිත්තිය දකුණු කෝෂිකාවේ බිත්තියට වඩා ඝන වන්නේ ඇයි?'), a: B('It must pump blood to the whole body, which needs more force (higher pressure).', 'එයට මුළු සිරුරටම රුධිරය පොම්ප කිරීමට සිදු වන නිසා වැඩි බලයක් (ඉහළ පීඩනයක්) අවශ්‍ය වේ.'), lines: 2 }] },

    /* 3 */
    { sec: B('Double circulation', 'ද්විත්ව සංසරණය'),
      lead: B('In one full trip round the body, blood passes through the heart <b>twice</b>. The short loop to the lungs is the <b>pulmonary circulation</b>; the long loop to the rest of the body is the <b>systemic circulation</b>.',
        'සිරුර වටා එක් සම්පූර්ණ ගමනකදී රුධිරය හෘදය හරහා <b>දෙවරක්</b> ගමන් කරයි. පෙනහළු වෙත යන කෙටි පුඩුව <b>පුප්ඵුසීය සංසරණයයි</b>; සිරුරේ ඉතිරි කොටස් වෙත යන දිගු පුඩුව <b>දේහ සංසරණයයි</b>.'),
      s: { term: B('double circulation', 'ද්විත්ව සංසරණය'), d: B('Blood goes through the heart twice in one circuit.', 'එක් වටයකදී රුධිරය හෘදය හරහා දෙවරක් යයි.') } },
    { fig: { svg: circ }, cap: B('Double circulation (a plan, not a picture). The heart is drawn as seen from the front.', 'ද්විත්ව සංසරණය (සැලැස්මකි, රූපයක් නොවේ). හෘදය ඉදිරියෙන් පෙනෙන ලෙස ඇඳ ඇත.'),
      s: [{ note: B('<b>Pulmonary:</b> right ventricle → lungs → left atrium. Blood takes in oxygen and gives off carbon dioxide.', '<b>පුප්ඵුසීය:</b> දකුණු කෝෂිකාව → පෙනහළු → වම් කර්ණිකාව. රුධිරය ඔක්සිජන් ලබා ගෙන කාබන් ඩයොක්සයිඩ් ඉවත් කරයි.') },
        { note: B('<b>Systemic:</b> left ventricle → body tissues → right atrium. Cells take oxygen and food, and give carbon dioxide.', '<b>දේහ:</b> වම් කෝෂිකාව → දේහ පටක → දකුණු කර්ණිකාව. සෛල ඔක්සිජන් සහ ආහාර ලබා ගෙන කාබන් ඩයොක්සයිඩ් ලබා දෙයි.') }] },
    { ex: { q: B('Trace a drop of blood from the vena cava until it leaves the heart in the aorta.', 'මහා ශිරාවේ සිට මහා ධමනිය හරහා හෘදයෙන් පිටවන තෙක් රුධිර බිඳුවක ගමන් මග සොයන්න.'),
        steps: [B('vena cava → <b>right atrium</b> → (tricuspid valve) → <b>right ventricle</b>', 'මහා ශිරාව → <b>දකුණු කර්ණිකාව</b> → (ත්‍රිතුණ්ඩ කපාටය) → <b>දකුණු කෝෂිකාව</b>'),
          B('→ (semilunar valve) → pulmonary artery → <b>lungs</b> (blood gets oxygen)', '→ (අර්ධචන්ද්‍රාකාර කපාටය) → පුප්ඵුසීය ධමනිය → <b>පෙනහළු</b> (රුධිරයට ඔක්සිජන් ලැබේ)'),
          B('→ pulmonary veins → <b>left atrium</b> → (bicuspid valve) → <b>left ventricle</b>', '→ පුප්ඵුසීය ශිරා → <b>වම් කර්ණිකාව</b> → (ද්විතුණ්ඩ කපාටය) → <b>වම් කෝෂිකාව</b>'),
          B('→ (semilunar valve) → <b>aorta</b> → to the body', '→ (අර්ධචන්ද්‍රාකාර කපාටය) → <b>මහා ධමනිය</b> → සිරුරට')],
        a: B('RA → RV → lungs → LA → LV → aorta', 'දකුණු කර්ණිකාව → දකුණු කෝෂිකාව → පෙනහළු → වම් කර්ණිකාව → වම් කෝෂිකාව → මහා ධමනිය') } },
    { box: B('Arteries carry blood <b>away</b> from the heart; veins carry it <b>to</b> the heart. So the <b>pulmonary artery</b> is the only artery with oxygen-poor blood, and the <b>pulmonary veins</b> are the only veins with oxygen-rich blood.',
        'ධමනි රුධිරය හෘදයෙන් <b>ඉවතට</b> ගෙන යයි; ශිරා රුධිරය හෘදය <b>වෙතට</b> ගෙන එයි. එබැවින් ඔක්සිජන් ඌන රුධිරය ගෙන යන එකම ධමනිය <b>පුප්ඵුසීය ධමනියයි</b>; ඔක්සිජන් බහුල රුධිරය ගෙන යන එකම ශිරා <b>පුප්ඵුසීය ශිරායි</b>.'),
      k: 'key', title: B('Exam point', 'විභාග කරුණ') },

    /* 4 */
    { sec: B('Heartbeat and pulse', 'හෘද ස්පන්දනය සහ නාඩිය'),
      lead: B('One heartbeat has three steps. Each time the ventricles push blood into the arteries, a wave of pressure runs along them. We can feel this wave as the <b>pulse</b> where an artery is near the skin — at the wrist or the side of the neck.',
        'එක් හෘද ස්පන්දනයකට පියවර තුනක් ඇත. කෝෂිකා රුධිරය ධමනිවලට තල්ලු කරන සෑම වරකම, ධමනි දිගේ පීඩන තරංගයක් ගමන් කරයි. ධමනියක් සමට ආසන්නව ඇති ස්ථානයක — මැණික් කටුවේ හෝ බෙල්ලේ පැත්තේ — මෙම තරංගය <b>නාඩිය</b> ලෙස දැනිය හැකිය.'),
      s: { term: B('pulse', 'නාඩිය'), d: B('The beat felt in an artery each time the heart pumps.', 'හෘදය පොම්ප කරන සෑම වරකම ධමනියක දැනෙන ගැස්ම.') } },
    { tbl: { head: [B('Step', 'පියවර'), B('What happens', 'සිදු වන දේ')], num: [],
      rows: [['1', B('The atria contract and push blood into the ventricles.', 'කර්ණිකා සංකෝචනය වී රුධිරය කෝෂිකාවලට තල්ලු කරයි.')],
        ['2', B('The ventricles contract and push blood into the arteries. The valves snap shut: “lub-dub”.', 'කෝෂිකා සංකෝචනය වී රුධිරය ධමනිවලට තල්ලු කරයි. කපාට වැසෙන ශබ්දය “ලබ්-ඩබ්” ලෙස ඇසේ.')],
        ['3', B('The heart relaxes and fills with blood again.', 'හෘදය ඉහිල් වී නැවත රුධිරයෙන් පිරේ.')]] },
      s: { fact: B('At rest an adult\'s heart beats about 72 times a minute — over 100 000 times a day.', 'විවේකයේදී වැඩිහිටියෙකුගේ හෘදය මිනිත්තුවට 72 වාරයක් පමණ ස්පන්දනය වේ — දිනකට වාර 100 000කට වඩා.') } },
    { ex: { q: B('A student counts 19 pulse beats in 15 seconds. What is the pulse rate?', 'සිසුවෙක් තත්පර 15කදී නාඩි වැටීම් 19ක් ගණන් කරයි. නාඩි වේගය කීයද?'),
        steps: [B('Pulse rate is given per minute. 60 s = 4 × 15 s.', 'නාඩි වේගය දෙන්නේ මිනිත්තුවකටයි. තත්පර 60 = 4 × තත්පර 15.'), B('19 × 4 = 76', '19 × 4 = 76')],
        a: B('76 beats per minute', 'මිනිත්තුවට ස්පන්දන 76') } },
    { ex: { q: B('The heart pumps about 70 mL of blood in each beat. How much does it pump in one minute at 72 beats per minute?', 'හෘදය එක් ස්පන්දනයකදී රුධිරය mL 70ක් පමණ පොම්ප කරයි. මිනිත්තුවට ස්පන්දන 72 නම් මිනිත්තුවකදී පොම්ප කරන ප්‍රමාණය කීයද?'),
        steps: [B('70 mL × 72 = 5040 mL', '70 mL × 72 = 5040 mL'), B('1000 mL = 1 L, so 5040 mL ≈ 5 L', '1000 mL = 1 L, එබැවින් 5040 mL ≈ 5 L')],
        a: B('About 5 litres a minute — about all the blood in the body.', 'මිනිත්තුවට ලීටර 5ක් පමණ — සිරුරේ ඇති රුධිරය සියල්ලම පාහේ.') },
      s: { note: B('During exercise the muscles need more oxygen, so the heart beats faster and the pulse rises.', 'ව්‍යායාම කරන විට පේශිවලට වැඩි ඔක්සිජන් අවශ්‍ය නිසා හෘදය වේගයෙන් ස්පන්දනය වී නාඩි වේගය ඉහළ යයි.'), tag: B('Why it changes', 'වෙනස් වන්නේ ඇයි') } },

    /* 5 */
    { sec: B('Arteries, veins and capillaries', 'ධමනි, ශිරා සහ කේශනාලිකා'),
      lead: B('Blood leaves the heart in arteries, which branch into tiny capillaries in every tissue. The capillaries join up again into veins that bring the blood back.',
        'රුධිරය හෘදයෙන් ධමනි හරහා පිට වන අතර, ඒවා සෑම පටකයකම කුඩා කේශනාලිකා බවට ශාඛා වේ. කේශනාලිකා නැවත එක් වී රුධිරය ආපසු ගෙන එන ශිරා සාදයි.'),
      s: [{ term: B('artery', 'ධමනිය'), d: B('Carries blood away from the heart.', 'රුධිරය හෘදයෙන් ඉවතට ගෙන යයි.') }, { term: B('vein', 'ශිරාව'), d: B('Carries blood back to the heart.', 'රුධිරය හෘදය වෙතට ගෙන එයි.') },
        { term: B('capillary', 'කේශනාලිකාව'), d: B('A tiny vessel where materials pass to and from cells.', 'සෛල සමඟ ද්‍රව්‍ය හුවමාරු වන ඉතා කුඩා වාහිනිය.') }] },
    { fig: { svg: vessels }, cap: B('Cross-sections of the three kinds of blood vessel (not to scale).', 'රුධිර වාහිනී වර්ග තුනේ හරස්කඩ (පරිමාණයට නැත).'),
      s: { term: B('lumen', 'කුහරය'), d: B('The space inside a vessel where blood flows.', 'රුධිරය ගලා යන, වාහිනිය ඇතුළත ඇති ඉඩ.') } },
    { tbl: { head: ['', B('Artery', 'ධමනිය'), B('Vein', 'ශිරාව'), B('Capillary', 'කේශනාලිකාව')],
      rows: [[B('<b>Wall</b>', '<b>බිත්තිය</b>'), B('thick, muscular, elastic', 'ඝන, පේශිමය, ප්‍රත්‍යාස්ථ'), B('thinner, less muscle', 'තුනී, පේශි අඩු'), B('one cell thick', 'එක් සෛලයක ඝනකමක්')],
        [B('<b>Lumen</b>', '<b>කුහරය</b>'), B('narrow', 'පටු'), B('wide', 'පළල්'), B('just wide enough for one red blood cell', 'රතු රුධිරාණුවකට යා හැකි තරම් පමණි')],
        [B('<b>Pressure</b>', '<b>පීඩනය</b>'), B('high, flows in spurts', 'ඉහළ, ස්පන්දන ලෙස ගලයි'), B('low, flows smoothly', 'අඩු, සුමටව ගලයි'), B('low', 'අඩු')],
        [B('<b>Valves</b>', '<b>කපාට</b>'), B('none (only at the heart)', 'නැත (හෘදය අසල පමණි)'), B('yes: stop backflow', 'ඇත: ආපසු ගැලීම වළක්වයි'), B('none', 'නැත')],
        [B('<b>Job</b>', '<b>කාර්යය</b>'), B('take blood out fast, under pressure', 'පීඩනය යටතේ රුධිරය ඉක්මනින් ගෙන යාම'), B('bring blood back', 'රුධිරය ආපසු ගෙන ඒම'), B('exchange O₂, CO₂, food and waste with cells', 'සෛල සමඟ O₂, CO₂, ආහාර සහ අපද්‍රව්‍ය හුවමාරුව')]] }, wide: true },
    { box: [B('Regular exercise, less salt and fatty food, no smoking and a healthy weight keep the blood vessels open and the <b>blood pressure</b> normal. Fat building up inside the coronary arteries can block them and cause a heart attack.',
        'නිතිපතා ව්‍යායාම, ලුණු සහ මේද සහිත ආහාර අඩු කිරීම, දුම් නොබීම සහ නිරෝගී බර පවත්වා ගැනීම රුධිර වාහිනී විවෘතව තබා <b>රුධිර පීඩනය</b> සාමාන්‍ය මට්ටමේ පවත්වයි. කිරීටක ධමනි තුළ මේදය තැන්පත් වීමෙන් ඒවා අවහිර වී හෘදයාබාධයක් ඇති විය හැකිය.')], k: 'tip', title: B('A healthy heart', 'නිරෝගී හෘදයක්'),
      s: { term: B('blood pressure', 'රුධිර පීඩනය'), d: B('The push of the blood on the artery walls.', 'ධමනි බිත්ති මත රුධිරය ඇති කරන තෙරපුම.') } },
    { check: [
      { q: B('Which blood vessels have valves along their length?', 'දිග පුරා කපාට ඇති රුධිර වාහිනී මොනවාද?'), a: B('Veins', 'ශිරා') },
      { q: B('Why are capillary walls only one cell thick?', 'කේශනාලිකා බිත්ති එක් සෛලයක ඝනකමින් පමණක් යුක්ත වන්නේ ඇයි?'), a: B('So that oxygen, food, carbon dioxide and waste can pass through easily.', 'ඔක්සිජන්, ආහාර, කාබන් ඩයොක්සයිඩ් සහ අපද්‍රව්‍ය පහසුවෙන් ඒ හරහා ගමන් කිරීමට.'), lines: 2 },
      { q: B('Where can you feel your pulse? Give two places.', 'ඔබේ නාඩිය දැනිය හැක්කේ කොතැනද? ස්ථාන දෙකක් දෙන්න.'), a: B('Wrist; side of the neck.', 'මැණික් කටුව; බෙල්ලේ පැත්ත.') }] }
  ],

  mcq: [
    { q: B('Which chamber of the heart has the thickest wall?', 'හෘදයේ ඝනම බිත්තිය ඇත්තේ කුමන කුටීරයටද?'), opts: [B('Right atrium', 'දකුණු කර්ණිකාව'), B('Right ventricle', 'දකුණු කෝෂිකාව'), B('Left ventricle', 'වම් කෝෂිකාව'), B('Left atrium', 'වම් කර්ණිකාව')], a: 3 },
    { q: B('Which blood vessel carries oxygen-poor blood from the heart to the lungs?', 'ඔක්සිජන් ඌන රුධිරය හෘදයේ සිට පෙනහළු වෙත ගෙන යන රුධිර වාහිනිය කුමක්ද?'), opts: [B('Aorta', 'මහා ධමනිය'), B('Pulmonary artery', 'පුප්ඵුසීය ධමනිය'), B('Pulmonary vein', 'පුප්ඵුසීය ශිරාව'), B('Vena cava', 'මහා ශිරාව')], a: 2 },
    { q: B('What stops blood flowing back from the right ventricle into the right atrium?', 'දකුණු කෝෂිකාවේ සිට දකුණු කර්ණිකාවට රුධිරය ආපසු ගැලීම වළක්වන්නේ කුමක්ද?'), opts: [B('Bicuspid valve', 'ද්විතුණ්ඩ කපාටය'), B('Aortic semilunar valve', 'මහා ධමනියේ අර්ධචන්ද්‍රාකාර කපාටය'), B('The septum', 'මැද බිත්තිය'), B('Tricuspid valve', 'ත්‍රිතුණ්ඩ කපාටය')], a: 4 },
    { q: B('A student counts 19 pulse beats in 15 seconds. The pulse rate is', 'සිසුවෙක් තත්පර 15කදී නාඩි වැටීම් 19ක් ගණන් කරයි. නාඩි වේගය වන්නේ'), opts: [B('76 per minute', 'මිනිත්තුවට 76'), B('19 per minute', 'මිනිත්තුවට 19'), B('34 per minute', 'මිනිත්තුවට 34'), B('95 per minute', 'මිනිත්තුවට 95')], a: 1 },
    { q: B('Which blood vessels have valves along their length?', 'දිග පුරා කපාට ඇත්තේ කුමන රුධිර වාහිනීවලටද?'), opts: [B('arteries', 'ධමනි'), B('veins', 'ශිරා'), B('capillaries', 'කේශනාලිකා'), B('the aorta', 'මහා ධමනිය')], a: 2 },
    { q: B('Oxygen passes from the blood into the cells through the walls of the', 'ඔක්සිජන් රුධිරයේ සිට සෛල වෙත ගමන් කරන්නේ කුමක බිත්ති හරහාද?'), opts: [B('arteries.', 'ධමනි'), B('veins.', 'ශිරා'), B('capillaries.', 'කේශනාලිකා'), B('heart.', 'හෘදය')], a: 3 },
    { q: B('Which chamber receives blood coming from the lungs?', 'පෙනහළුවල සිට එන රුධිරය ලබා ගන්නේ කුමන කුටීරයද?'), opts: [B('Right atrium', 'දකුණු කර්ණිකාව'), B('Left atrium', 'වම් කර්ණිකාව'), B('Right ventricle', 'දකුණු කෝෂිකාව'), B('Left ventricle', 'වම් කෝෂිකාව')], a: 2 },
    { q: B('Which vessel brings oxygen-rich blood to the heart muscle itself?', 'හෘද පේශියටම ඔක්සිජන් බහුල රුධිරය ගෙන එන්නේ කුමන වාහිනියද?'), opts: [B('Coronary artery', 'කිරීටක ධමනිය'), B('Pulmonary artery', 'පුප්ඵුසීය ධමනිය'), B('Vena cava', 'මහා ශිරාව'), B('Pulmonary vein', 'පුප්ඵුසීය ශිරාව')], a: 1 },
    { q: B('In one full circuit of the body, blood passes through the heart', 'සිරුර වටා එක් සම්පූර්ණ වටයකදී රුධිරය හෘදය හරහා ගමන් කරන වාර ගණන'), opts: [B('once.', 'එක් වරකි.'), B('twice.', 'දෙවරකි.'), B('three times.', 'තුන් වරකි.'), B('four times.', 'හතර වරකි.')], a: 2 },
    { q: B('The “lub-dub” sound of the heart is made by', 'හෘදයේ “ලබ්-ඩබ්” ශබ්දය ඇති වන්නේ'), opts: [B('the atria contracting.', 'කර්ණිකා සංකෝචනය වීමෙනි.'), B('the valves closing.', 'කපාට වැසීමෙනි.'), B('blood in the capillaries.', 'කේශනාලිකාවල රුධිරයෙනි.'), B('the lungs filling with air.', 'පෙනහළු වාතයෙන් පිරීමෙනි.')], a: 2 }
  ],
  st: [
    { q: B('The figure shows the heart cut open from the front.', 'රූපයේ දැක්වෙන්නේ ඉදිරියෙන් කපා විවෘත කළ හෘදයයි.'),
      fig: { img: 'hh-in', w: 96, lw: 10, rw: 10, labels: [[IN.AO, 'A', 'r'], [IN.PA, 'B', 'r'], [IN.LA, 'C', 'r'], [IN.BI, 'D', 'r'], [IN.LV, 'E', 'r'], [IN.RV, 'F', 'l'], [IN.RA, 'G', 'l']] },
      parts: [
      { q: B('Name the parts labelled A, C and E.', 'A, C සහ E ලෙස නම් කළ කොටස් නම් කරන්න.'), m: 3, lines: 2, a: B('A aorta, C left atrium, E left ventricle', 'A මහා ධමනිය, C වම් කර්ණිකාව, E වම් කෝෂිකාව') },
      { q: B('Which letter shows the vessel that takes oxygen-poor blood to the lungs? Name it.', 'ඔක්සිජන් ඌන රුධිරය පෙනහළු වෙත ගෙන යන වාහිනිය දැක්වෙන අක්ෂරය කුමක්ද? එය නම් කරන්න.'), m: 2, lines: 1, a: B('B — the pulmonary artery', 'B — පුප්ඵුසීය ධමනිය') },
      { q: B('What is the job of D?', 'D හි කාර්යය කුමක්ද?'), m: 2, a: B('D is the bicuspid valve; it lets blood go from the left atrium to the left ventricle and stops it flowing back.', 'D ද්විතුණ්ඩ කපාටයයි; එය රුධිරයට වම් කර්ණිකාවේ සිට වම් කෝෂිකාවට යාමට ඉඩ දී ආපසු ගැලීම වළක්වයි.') },
      { q: B('Explain why the wall of E is thicker than the wall of F.', 'E හි බිත්තිය F හි බිත්තියට වඩා ඝන වන්නේ ඇයි දැයි පැහැදිලි කරන්න.'), m: 2, a: B('E (left ventricle) pumps blood to the whole body; F (right ventricle) only to the nearby lungs, so E needs more muscle.', 'E (වම් කෝෂිකාව) මුළු සිරුරටම රුධිරය පොම්ප කරයි; F (දකුණු කෝෂිකාව) ළඟ ඇති පෙනහළුවලට පමණි; එබැවින් E ට වැඩි පේශි අවශ්‍ය වේ.') }] },
    { q: B('Human blood circulation is called a double circulation.', 'මිනිස් රුධිර සංසරණය ද්විත්ව සංසරණයක් ලෙස හැඳින්වේ.'), parts: [
      { q: B('Name the two circulations.', 'සංසරණ දෙක නම් කරන්න.'), m: 2, lines: 1, a: B('Pulmonary circulation and systemic circulation', 'පුප්ඵුසීය සංසරණය සහ දේහ සංසරණය') },
      { q: B('Where does the blood take in oxygen?', 'රුධිරය ඔක්සිජන් ලබා ගන්නේ කොතැනදීද?'), m: 1, lines: 1, a: B('In the lungs (in the capillaries round the air sacs)', 'පෙනහළුවලදී (වායු ගෝණිකා වටා ඇති කේශනාලිකාවලදී)') },
      { q: B('Write, in order, the chambers and vessels a drop of blood passes from the vena cava to the aorta.', 'මහා ශිරාවේ සිට මහා ධමනිය දක්වා රුධිර බිඳුවක් ගමන් කරන කුටීර සහ වාහිනී පිළිවෙළින් ලියන්න.'), m: 3, lines: 3, a: B('Vena cava → right atrium → right ventricle → pulmonary artery → lungs → pulmonary veins → left atrium → left ventricle → aorta', 'මහා ශිරාව → දකුණු කර්ණිකාව → දකුණු කෝෂිකාව → පුප්ඵුසීය ධමනිය → පෙනහළු → පුප්ඵුසීය ශිරා → වම් කර්ණිකාව → වම් කෝෂිකාව → මහා ධමනිය') }] },
    { q: B('Nimali counts her pulse for 15 seconds: 18 beats at rest, and 30 beats just after running.', 'නිමාලි තත්පර 15ක් තම නාඩිය ගණන් කරයි: විවේකයේදී ස්පන්දන 18ක් සහ දිවීමෙන් පසු ස්පන්දන 30ක්.'), parts: [
      { q: B('Find her pulse rate per minute at rest and after running.', 'විවේකයේදී සහ දිවීමෙන් පසු මිනිත්තුවට නාඩි වේගය සොයන්න.'), m: 2, lines: 1, a: B('Rest 18 × 4 = 72; after running 30 × 4 = 120 beats per minute', 'විවේකයේ 18 × 4 = 72; දිවීමෙන් පසු 30 × 4 = මිනිත්තුවට 120') },
      { q: B('Explain why the pulse rate goes up during exercise.', 'ව්‍යායාම කරන විට නාඩි වේගය ඉහළ යන්නේ ඇයි දැයි පැහැදිලි කරන්න.'), m: 2, a: B('Working muscles need more oxygen and food and make more carbon dioxide, so the heart pumps blood faster.', 'ක්‍රියා කරන පේශිවලට වැඩි ඔක්සිජන් සහ ආහාර අවශ්‍ය වන අතර වැඩි කාබන් ඩයොක්සයිඩ් නිපදවන නිසා හෘදය වේගයෙන් රුධිරය පොම්ප කරයි.') },
      { q: B('Her heart pumps 70 mL in each beat. How much blood does it pump in one minute at rest?', 'ඇගේ හෘදය එක් ස්පන්දනයකදී mL 70ක් පොම්ප කරයි. විවේකයේදී මිනිත්තුවකදී පොම්ප කරන රුධිර ප්‍රමාණය කීයද?'), m: 2, lines: 1, a: B('72 × 70 = 5040 mL (about 5 L)', '72 × 70 = 5040 mL (ලීටර 5ක් පමණ)') }] }
  ],
  summary: [
    B('The heart is a pump of cardiac muscle in the thoracic cavity, between the lungs.', 'හෘදය උරස් කුහරයේ, පෙනහළු අතර පිහිටි හෘද පේශිවලින් සෑදුණු පොම්පයකි.'),
    B('Four chambers: two atria receive blood, two ventricles pump it out. The septum keeps the two sides apart.', 'කුටීර හතරයි: කර්ණිකා දෙක රුධිරය ලබා ගනී, කෝෂිකා දෙක එය පිටතට පොම්ප කරයි. මැද බිත්තිය පැති දෙක වෙන් කරයි.'),
    B('Tricuspid, bicuspid and semilunar valves keep blood moving one way.', 'ත්‍රිතුණ්ඩ, ද්විතුණ්ඩ සහ අර්ධචන්ද්‍රාකාර කපාට රුධිරය එක් දිශාවකට ගලා යාමට සලස්වයි.'),
    B('The left ventricle has the thickest wall: it pumps blood to the whole body.', 'වම් කෝෂිකාවට ඝනම බිත්තිය ඇත: එය මුළු සිරුරටම රුධිරය පොම්ප කරයි.'),
    B('Double circulation: heart → lungs → heart → body → heart.', 'ද්විත්ව සංසරණය: හෘදය → පෙනහළු → හෘදය → සිරුර → හෘදය.'),
    B('Arteries carry blood away from the heart, veins bring it back, capillaries exchange with cells.', 'ධමනි රුධිරය හෘදයෙන් ඉවතට ගෙන යයි, ශිරා ආපසු ගෙන එයි, කේශනාලිකා සෛල සමඟ හුවමාරු කරයි.'),
    B('The pulmonary artery carries oxygen-poor blood; the pulmonary veins carry oxygen-rich blood.', 'පුප්ඵුසීය ධමනිය ඔක්සිජන් ඌන රුධිරය ද, පුප්ඵුසීය ශිරා ඔක්සිජන් බහුල රුධිරය ද ගෙන යයි.'),
    B('Pulse = heartbeats per minute; about 72 at rest. It rises with exercise.', 'නාඩි වේගය = මිනිත්තුවට හෘද ස්පන්දන ගණන; විවේකයේදී 72 පමණ. ව්‍යායාමයේදී එය ඉහළ යයි.')
  ],
  words: [B('aorta', 'මහා ධමනිය'), B('vena cava', 'මහා ශිරාව'), B('pulmonary artery', 'පුප්ඵුසීය ධමනිය'), B('pulmonary vein', 'පුප්ඵුසීය ශිරාව'), B('tricuspid valve', 'ත්‍රිතුණ්ඩ කපාටය'), B('bicuspid valve', 'ද්විතුණ්ඩ කපාටය'), B('semilunar valve', 'අර්ධචන්ද්‍රාකාර කපාටය'), B('septum', 'මැද බිත්තිය')]
};
