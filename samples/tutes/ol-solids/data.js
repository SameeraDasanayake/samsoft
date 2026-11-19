// O/L Maths — Surface area and volume of solids. Renders from the ol-solids deck + exact line diagrams (drawn to their numbers).
const INK = '#0d2440', FILL = '#e1ecfa', FILL2 = '#c3d8f3', DASH = 'stroke-dasharray="5 4"';
const ln = (d, w = 1.6, x = '') => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" ${x}/>`;
const tx = (x, y, s, a = 'middle', c = 't', fs = 15) => `<text class="${c}" x="${x}" y="${y}" font-size="${fs}" text-anchor="${a}">${s}</text>`;
const dim = (x1, y1, x2, y2, id) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="1.1" marker-start="url(#${id})" marker-end="url(#${id})"/>`;

// cylinder: centre x, top y, radius rx (ry = rx * .3), height H
function cyl(cx, yt, rx, H, lr = 'r', lh = 'h', id = 'cy') {
  const ry = rx * .3, yb = yt + H;
  return `${ARROW(id)}<path d="M${cx - rx} ${yt} V${yb} A${rx} ${ry} 0 0 0 ${cx + rx} ${yb} V${yt}" fill="${FILL}" stroke="none"/>
    <ellipse cx="${cx}" cy="${yt}" rx="${rx}" ry="${ry}" fill="${FILL2}" stroke="${INK}" stroke-width="1.6"/>
    ${ln(`M${cx - rx} ${yt} V${yb} A${rx} ${ry} 0 0 0 ${cx + rx} ${yb} V${yt}`)}${ln(`M${cx - rx} ${yb} A${rx} ${ry} 0 0 1 ${cx + rx} ${yb}`, 1.1, DASH)}
    ${ln(`M${cx} ${yt} H${cx + rx}`, 1.3)}<circle cx="${cx}" cy="${yt}" r="2.6" fill="${INK}"/>${tx(cx + rx / 2, yt - 6, lr, 'middle', 'tm')}
    ${dim(cx + rx + 18, yt, cx + rx + 18, yb, id)}${tx(cx + rx + 26, (yt + yb) / 2 + 5, lh, 'start', 'tm')}`;
}
// cone: centre x, apex y, base y, radius
function cone(cx, ya, yb, rx, lr = 'r', lh = 'h', ll = 'l') {
  const ry = rx * .3;
  return `<path d="M${cx} ${ya} L${cx - rx} ${yb} A${rx} ${ry} 0 0 0 ${cx + rx} ${yb} Z" fill="${FILL}" stroke="none"/>
    ${ln(`M${cx - rx} ${yb} L${cx} ${ya} L${cx + rx} ${yb} A${rx} ${ry} 0 0 1 ${cx - rx} ${yb}`)}${ln(`M${cx - rx} ${yb} A${rx} ${ry} 0 0 0 ${cx + rx} ${yb}`, 1.1, DASH)}
    ${ln(`M${cx} ${ya} V${yb} H${cx + rx}`, 1.2, DASH)}${ln(`M${cx} ${yb - 9} h9 v9`, 1)}
    ${tx(cx + rx / 2, yb + 18, lr, 'middle', 'tm')}${tx(cx - 9, (ya + yb) / 2 + 5, lh, 'end', 'tm')}${tx(cx + rx / 2 + 14, (ya + yb) / 2, ll, 'start', 'tm')}`;
}

const cylFig = SVG(46, 240, 250, cyl(100, 40, 70, 160));
const prismFig = SVG2(l => SVG(84, 400, 220, `
  <path d="M60 180 L148 180 L338 130 L250 130 Z" fill="none"/>
  <path d="M60 114 L148 180 L338 130 L250 64 Z" fill="${FILL}"/><path d="M60 180 L148 180 L60 114 Z" fill="${FILL2}"/>
  ${ln('M60 180 L148 180 L60 114 Z')}${ln('M60 114 L250 64 L338 130 L148 180')}${ln('M60 180 L250 130 L338 130 M250 130 L250 64', 1.1, DASH)}
  ${tx(48, 152, '3 cm', 'end')}${tx(104, 200, '4 cm')}${tx(96, 140, '5 cm', 'start')}${tx(258, 176, '10 cm', 'start')}
  ${ln('M60 170 h10 v10', 1)}`));
const prismCut = SVG2(l => SVG(96, 400, 200, `${ARROW('pcA')}
  <path d="M40 150 L120 150 L120 70 Z" fill="${FILL2}"/><path d="M120 150 L320 100 L320 20 L120 70 Z" fill="${FILL}"/><path d="M40 150 L240 100 L320 100 L120 150 Z" fill="${FILL}" opacity=".6"/>
  ${ln('M40 150 L120 150 L120 70 Z')}${ln('M120 70 L320 20 L320 100 L120 150 M40 150 L240 100', 1.6)}${ln('M240 100 L320 100 M240 100 L320 20', 1.1, DASH)}
  ${tx(86, 136, l(B('A', 'A')), 'middle', 'ta', 20)}${dim(130, 168, 330, 118, 'pcA')}${tx(250, 160, 'l', 'start', 'tm', 18)}
  ${tx(18, 192, l(B('cross-section (area A) is the same all along the length', 'හරස්කඩ (වර්ගඵලය A) මුළු දිග පුරාම එක හා සමාන ය')), 'start', 't', 14)}`));
const coneFig = SVG(56, 220, 250, cone(110, 20, 200, 80));
const pyrFig = SVG(44, 240, 240, `<path d="M40 200 L180 200 L230 160 L175 40 Z" fill="${FILL}"/><path d="M40 200 L175 40 L180 200 Z" fill="${FILL2}"/>
  ${ln('M40 200 L180 200 L230 160 M175 40 L40 200 M175 40 L180 200 M175 40 L230 160')}${ln('M230 160 L90 160 L40 200 M90 160 L175 40 M175 40 L135 180', 1.1, DASH)}
  ${tx(110, 220, '6 cm', 'middle', 't', 14)}${tx(141, 120, 'h', 'end', 'tm')}`);
const sphFig = SVG(38, 220, 220, `<circle cx="110" cy="110" r="90" fill="${FILL}"/>
  <ellipse cx="110" cy="110" rx="90" ry="24" fill="none" stroke="none"/>${ln('M20 110 A90 24 0 0 0 200 110', 1.4)}${ln('M20 110 A90 24 0 0 1 200 110', 1.1, DASH)}
  <circle cx="110" cy="110" r="90" fill="none" stroke="${INK}" stroke-width="1.6"/>${ln('M110 110 L190 70', 1.3)}<circle cx="110" cy="110" r="2.6" fill="${INK}"/>${tx(152, 82, 'r', 'middle', 'tm')}`);
const capsule = SVG(36, 220, 290, `${ARROW('cpA')}<path d="M40 100 A70 70 0 0 1 180 100 V250 A70 21 0 0 1 40 250 Z" fill="${FILL}"/>
  ${ln('M40 100 A70 70 0 0 1 180 100 V250 A70 21 0 0 1 40 250 Z')}${ln('M40 100 A70 21 0 0 0 180 100', 1.2)}${ln('M40 100 A70 21 0 0 1 180 100', 1.1, DASH)}${ln('M40 250 A70 21 0 0 1 180 250', 1.1, DASH)}
  ${ln('M110 250 H180', 1.2)}${tx(145, 244, '7 cm', 'middle', 't', 13)}${dim(200, 100, 200, 250, 'cpA')}${tx(206, 180, '10', 'start', 't', 13)}`);

window.TUTE = {
  no: '02', code: 'OLM-T2', accent: '#1452a0', hero: 'sd-hero',
  inst: B('Kelani Academy', 'කැලණි ඇකඩමිය'), teacher: B('O/L Mathematics class', 'සා/පෙළ ගණිතය පන්තිය'),
  subject: B('Mathematics', 'ගණිතය'), grade: B('O/L · Grades 10–11', 'සා/පෙළ · 10–11 ශ්‍රේණි'),
  title: B('Surface area and volume', 'පෘෂ්ඨ වර්ගඵලය සහ පරිමාව'),
  sub: B('Cylinders, prisms, cones, pyramids and spheres — where every formula comes from, and how to use it.',
    'සිලින්ඩර, ප්‍රිස්ම, කේතු, පිරමීඩ සහ ගෝල — එක් එක් සූත්‍රය එන්නේ කොහෙන්ද, එය භාවිත කරන්නේ කෙසේද.'),
  body: [
    /* 1 */
    { sec: B('Solids and their nets', 'ඝන වස්තු සහ ඒවායේ දැල්'),
      lead: B('A solid takes up space. Its outside is made of flat or curved surfaces called <b>faces</b>. Two numbers describe it: how much surface it has, and how much space it fills.',
        'ඝන වස්තුවක් අවකාශයේ ඉඩක් ගනී. එහි පිටත කොටස තල හෝ වක්‍ර <b>මුහුණත්</b>වලින් සෑදී ඇත. එය විස්තර කිරීමට අගයන් දෙකක් භාවිත වේ: එහි පෘෂ්ඨයේ ප්‍රමාණය සහ එය පුරවන ඉඩ ප්‍රමාණය.'),
      s: [{ term: B('surface area', 'පෘෂ්ඨ වර්ගඵලය'), d: B('The total area of all the faces. Units: cm², m².', 'සියලු මුහුණත්වල වර්ගඵලවල එකතුව. ඒකක: cm², m².') },
        { term: B('volume', 'පරිමාව'), d: B('The space a solid fills. Units: cm³, m³.', 'ඝන වස්තුවක් ගන්නා ඉඩ ප්‍රමාණය. ඒකක: cm³, m³.') }] },
    { fig: { img: 'sd-family', w: 178, labels: [['Cylinder', null, 'c', 1], ['Triangular prism', null, 'c', 1], ['Cone', null, 'c', 1], ['Square pyramid', B('Square pyramid', 'සමචතුරස්‍ර පාද පිරමීඩය'), 'c', 1], ['Sphere', null, 'c', 1]] },
      cap: B('The five solids in this tute.', 'මෙම නිබන්ධනයේ ඝන වස්තු පහ.'), wide: true },
    { p: B('If we cut along some edges of a hollow solid and open it out flat, we get its <b>net</b>. The area of the net is the surface area of the solid. A cylinder opens into a rectangle and two circles. The length of the rectangle is the distance round the circle — the circumference <b>2πr</b>.',
        'කුහර ඝන වස්තුවක දාර කිහිපයක් දිගේ කපා තලයක් ලෙස දිග හැරිය විට එහි <b>දැල</b> ලැබේ. දැලේ වර්ගඵලය ඝන වස්තුවේ පෘෂ්ඨ වර්ගඵලයට සමාන වේ. සිලින්ඩරයක් දිග හැරිය විට සෘජුකෝණාස්‍රයක් සහ වෘත්ත දෙකක් ලැබේ. සෘජුකෝණාස්‍රයේ දිග වෘත්තය වටා ඇති දුරට — එනම් පරිධිය <b>2πr</b> ට — සමාන වේ.'),
      s: { term: B('net', 'දැල'), d: B('A flat shape that folds up to make a solid.', 'නැමූ විට ඝන වස්තුවක් සෑදෙන තල හැඩය.') } },
    { fig: { img: 'sd-net', w: 74, rw: 30, labels: [['h', B('height h', 'උස h'), 'r'], ['length = 2πr', B('length = 2πr', 'දිග = 2πr'), 'r']] },
      cap: B('The net of a closed cylinder: one rectangle and two equal circles.', 'සංවෘත සිලින්ඩරයක දැල: එක් සෘජුකෝණාස්‍රයක් සහ සමාන වෘත්ත දෙකක්.'),
      s: { rem: B('Area of a circle = πr²<br>Circumference = 2πr<br>Use π = <sup>22</sup>⁄<sub>7</sub> when r is a multiple of 7, otherwise 3.14.', 'වෘත්තයක වර්ගඵලය = πr²<br>පරිධිය = 2πr<br>r, 7හි ගුණාකාරයක් නම් π = <sup>22</sup>⁄<sub>7</sub> ද, නැතහොත් 3.14 ද ගන්න.') } },
    { check: [
      { q: B('How many faces does a triangular prism have?', 'ත්‍රිකෝණාකාර ප්‍රිස්මයක මුහුණත් කීයක් ඇත්ද?'), a: B('5 (2 triangles + 3 rectangles)', '5 (ත්‍රිකෝණ 2 + සෘජුකෝණාස්‍ර 3)') },
      { q: B('What shapes make up the net of a closed cylinder?', 'සංවෘත සිලින්ඩරයක දැල සෑදී ඇත්තේ කුමන හැඩවලින්ද?'), a: B('One rectangle and two circles', 'එක් සෘජුකෝණාස්‍රයක් සහ වෘත්ත දෙකක්') }] },

    /* 2 */
    { sec: B('Surface area of a cylinder', 'සිලින්ඩරයක පෘෂ්ඨ වර්ගඵලය'),
      lead: B('Add the parts of the net: the curved surface (the rectangle) and the two circular ends.',
        'දැලේ කොටස් එකතු කරන්න: වක්‍ර පෘෂ්ඨය (සෘජුකෝණාස්‍රය) සහ වෘත්තාකාර කෙළවරවල් දෙක.'),
      s: { term: B('curved surface', 'වක්‍ර පෘෂ්ඨය'), d: B('The round side of a cylinder or cone.', 'සිලින්ඩරයක හෝ කේතුවක වක්‍ර පැත්ත.') } },
    { fig: { svg: cylFig }, cap: B('A cylinder of radius <i>r</i> and height <i>h</i>.', 'අරය <i>r</i> සහ උස <i>h</i> වූ සිලින්ඩරයක්.'),
      s: { note: B('Curved surface = 2πr × h<br>Two ends = 2 × πr²', 'වක්‍ර පෘෂ්ඨය = 2πr × h<br>කෙළවරවල් දෙක = 2 × πr²'), tag: B('From the net', 'දැලෙන්') } },
    { box: B('Curved surface area = 2πrh &nbsp;&nbsp;·&nbsp;&nbsp; Total surface area = 2πr² + 2πrh', 'වක්‍ර පෘෂ්ඨ වර්ගඵලය = 2πrh &nbsp;&nbsp;·&nbsp;&nbsp; මුළු පෘෂ්ඨ වර්ගඵලය = 2πr² + 2πrh'), k: 'key', title: B('Formula', 'සූත්‍රය') },
    { ex: { q: B('A closed cylinder has radius 7 cm and height 10 cm. Find its total surface area.', 'සංවෘත සිලින්ඩරයක අරය 7 cm ද උස 10 cm ද වේ. එහි මුළු පෘෂ්ඨ වර්ගඵලය සොයන්න.'),
        steps: [B('Curved surface = 2πrh = 2 × <sup>22</sup>⁄<sub>7</sub> × 7 × 10 = 440 cm²', 'වක්‍ර පෘෂ්ඨය = 2πrh = 2 × <sup>22</sup>⁄<sub>7</sub> × 7 × 10 = 440 cm²'),
          B('Two ends = 2πr² = 2 × <sup>22</sup>⁄<sub>7</sub> × 7 × 7 = 308 cm²', 'කෙළවරවල් දෙක = 2πr² = 2 × <sup>22</sup>⁄<sub>7</sub> × 7 × 7 = 308 cm²'),
          B('Total = 440 + 308', 'එකතුව = 440 + 308')],
        a: B('Total surface area = 748 cm²', 'මුළු පෘෂ්ඨ වර්ගඵලය = 748 cm²') } },
    { ex: { q: B('A water tank is a cylinder with no lid, radius 0.7 m and height 1.5 m. How much metal sheet is needed to make it?', 'ජල ටැංකියක් පියනක් නැති, අරය 0.7 m සහ උස 1.5 m වූ සිලින්ඩරයකි. එය සෑදීමට අවශ්‍ය ලෝහ තහඩුවේ වර්ගඵලය කීයද?'),
        steps: [B('No lid, so only <b>one</b> circle: πr² = <sup>22</sup>⁄<sub>7</sub> × 0.7 × 0.7 = 1.54 m²', 'පියනක් නැති නිසා වෘත්ත <b>එකක්</b> පමණි: πr² = <sup>22</sup>⁄<sub>7</sub> × 0.7 × 0.7 = 1.54 m²'),
          B('Curved surface = 2πrh = 2 × <sup>22</sup>⁄<sub>7</sub> × 0.7 × 1.5 = 6.6 m²', 'වක්‍ර පෘෂ්ඨය = 2πrh = 2 × <sup>22</sup>⁄<sub>7</sub> × 0.7 × 1.5 = 6.6 m²'),
          B('1.54 + 6.6 = 8.14', '1.54 + 6.6 = 8.14')],
        a: B('Metal sheet needed = 8.14 m²', 'අවශ්‍ය ලෝහ තහඩුව = 8.14 m²') },
      s: { rem: B('Read the question: is the solid <b>closed</b>, <b>open</b> (no lid) or a <b>pipe</b> (no ends)?', 'ප්‍රශ්නය හොඳින් කියවන්න: ඝන වස්තුව <b>සංවෘත</b>ද, <b>විවෘත</b>ද (පියනක් නැත), නැතහොත් <b>බටයක්</b>ද (කෙළවර නැත)?') } },
    { check: [
      { q: B('Find the curved surface area of a cylinder of radius 14 cm and height 10 cm.', 'අරය 14 cm සහ උස 10 cm වූ සිලින්ඩරයක වක්‍ර පෘෂ්ඨ වර්ගඵලය සොයන්න.'), a: B('2 × 22/7 × 14 × 10 = 880 cm²', '2 × 22/7 × 14 × 10 = 880 cm²') },
      { q: B('A pipe (no ends) has radius 7 cm and length 50 cm. Find its outside area.', 'අරය 7 cm සහ දිග 50 cm වූ බටයක (කෙළවර නැත) පිටත වර්ගඵලය සොයන්න.'), a: B('2 × 22/7 × 7 × 50 = 2200 cm²', '2 × 22/7 × 7 × 50 = 2200 cm²') }] },

    /* 3 */
    { sec: B('Surface area of a prism', 'ප්‍රිස්මයක පෘෂ්ඨ වර්ගඵලය'),
      lead: B('A prism has two equal end faces and rectangles all round. Find the area of each face and add them.',
        'ප්‍රිස්මයකට සමාන කෙළවර මුහුණත් දෙකක් සහ වටේට සෘජුකෝණාස්‍ර ඇත. එක් එක් මුහුණතේ වර්ගඵලය සොයා එකතු කරන්න.'),
      s: { term: B('prism', 'ප්‍රිස්මය'), d: B('A solid with the same cross-section all along its length.', 'මුළු දිග පුරාම එකම හරස්කඩ ඇති ඝන වස්තුවකි.') } },
    { fig: { svg: prismFig }, cap: B('A triangular prism. The ends are right-angled triangles with sides 3, 4 and 5 cm.', 'ත්‍රිකෝණාකාර ප්‍රිස්මයක්. කෙළවරවල් පාද 3, 4 සහ 5 cm වූ සෘජුකෝණී ත්‍රිකෝණ වේ.'),
      s: { note: B('The three rectangles together make one long rectangle: (perimeter of the end) × length.', 'සෘජුකෝණාස්‍ර තුන එකට තැබූ විට එක් දිගු සෘජුකෝණාස්‍රයක් වේ: (කෙළවරේ පරිමිතිය) × දිග.'), tag: B('Shortcut', 'කෙටි ක්‍රමය') } },
    { ex: { q: B('Find the total surface area of the prism in Figure 4.', '4 වන රූපයේ ප්‍රිස්මයේ මුළු පෘෂ්ඨ වර්ගඵලය සොයන්න.'),
        steps: [B('Two triangles: 2 × ½ × 4 × 3 = 12 cm²', 'ත්‍රිකෝණ දෙක: 2 × ½ × 4 × 3 = 12 cm²'),
          B('Three rectangles: (3 + 4 + 5) × 10 = 120 cm²', 'සෘජුකෝණාස්‍ර තුන: (3 + 4 + 5) × 10 = 120 cm²'), B('12 + 120 = 132', '12 + 120 = 132')],
        a: B('Total surface area = 132 cm²', 'මුළු පෘෂ්ඨ වර්ගඵලය = 132 cm²') } },

    /* 4 */
    { sec: B('Volume of prisms and cylinders', 'ප්‍රිස්ම සහ සිලින්ඩරවල පරිමාව'),
      lead: B('Think of a prism as many thin slices, each with the same area A. Stack slices for a length <i>l</i> and the volume is <b>A × l</b>. A cylinder is a prism with a circle for its cross-section.',
        'ප්‍රිස්මයක් එකම වර්ගඵලය A ඇති තුනී පෙති රාශියක් ලෙස සිතන්න. දිග <i>l</i> දක්වා පෙති අසුරූ විට පරිමාව <b>A × l</b> වේ. සිලින්ඩරය යනු හරස්කඩ වෘත්තයක් වූ ප්‍රිස්මයකි.'),
      s: { term: B('cross-section', 'හරස්කඩ'), d: B('The shape you see when you cut straight across a solid.', 'ඝන වස්තුවක් හරහා කෙළින් කැපූ විට පෙනෙන හැඩය.') } },
    { fig: { svg: prismCut }, cap: B('Volume of a prism = area of cross-section × length.', 'ප්‍රිස්මයක පරිමාව = හරස්කඩ වර්ගඵලය × දිග.') },
    { box: B('Prism: V = A × l &nbsp;&nbsp;·&nbsp;&nbsp; Cylinder: V = πr²h', 'ප්‍රිස්මය: V = A × l &nbsp;&nbsp;·&nbsp;&nbsp; සිලින්ඩරය: V = πr²h'), k: 'key', title: B('Formula', 'සූත්‍රය'),
      s: { rem: B('1 litre = 1000 cm³<br>1 m³ = 1000 litres', 'ලීටර 1 = 1000 cm³<br>1 m³ = ලීටර 1000') } },
    { ex: { q: B('A cylindrical tank has radius 0.7 m and height 1.2 m. How many litres of water does it hold when full?', 'සිලින්ඩරාකාර ටැංකියක අරය 0.7 m ද උස 1.2 m ද වේ. සම්පූර්ණයෙන් පිරුණු විට එහි ජලය ලීටර කීයක් ඇත්ද?'),
        steps: [B('V = πr²h = <sup>22</sup>⁄<sub>7</sub> × 0.7 × 0.7 × 1.2', 'V = πr²h = <sup>22</sup>⁄<sub>7</sub> × 0.7 × 0.7 × 1.2'), B('= 1.54 × 1.2 = 1.848 m³', '= 1.54 × 1.2 = 1.848 m³'),
          B('1 m³ = 1000 litres, so 1.848 × 1000 = 1848', '1 m³ = ලීටර 1000 නිසා 1.848 × 1000 = 1848')],
        a: B('The tank holds 1848 litres.', 'ටැංකියේ ජලය ලීටර 1848ක් ඇත.') } },
    { check: [
      { q: B('A prism has a cross-section of 15 cm² and length 8 cm. Find its volume.', 'ප්‍රිස්මයක හරස්කඩ වර්ගඵලය 15 cm² ද දිග 8 cm ද වේ. එහි පරිමාව සොයන්න.'), a: B('15 × 8 = 120 cm³', '15 × 8 = 120 cm³') },
      { q: B('Write 2.5 litres in cm³.', 'ලීටර 2.5 cm³ වලින් ලියන්න.'), a: B('2500 cm³', '2500 cm³') },
      { q: B('Find the volume of a cylinder of radius 7 cm and height 5 cm.', 'අරය 7 cm සහ උස 5 cm වූ සිලින්ඩරයක පරිමාව සොයන්න.'), a: B('22/7 × 49 × 5 = 770 cm³', '22/7 × 49 × 5 = 770 cm³') }] },

    /* 5 */
    { sec: B('Cones and pyramids', 'කේතු සහ පිරමීඩ'),
      lead: B('A cone fits inside a cylinder with the same base and height. Fill the cone with water and pour it into the cylinder: it takes exactly <b>three</b> cones to fill it. So a cone holds one third of the cylinder. The same is true for a pyramid and its prism.',
        'එකම පාදය සහ එකම උස ඇති සිලින්ඩරයක් තුළට කේතුවක් ගැළපේ. කේතුව ජලයෙන් පුරවා සිලින්ඩරයට වත් කළහොත් එය පිරවීමට හරියටම කේතු <b>තුනක්</b> අවශ්‍ය වේ. එබැවින් කේතුවක පරිමාව සිලින්ඩරයේ පරිමාවෙන් තුනෙන් එකකි. පිරමීඩයකටත් එහි ප්‍රිස්මයටත් මෙය එසේම සත්‍ය වේ.'),
      s: [{ term: B('cone', 'කේතුව'), d: B('A solid with a circular base and one point (vertex) on top.', 'වෘත්තාකාර පාදයක් සහ ඉහළින් එක් ශීර්ෂයක් ඇති ඝන වස්තුවකි.') },
        { term: B('pyramid', 'පිරමීඩය'), d: B('A solid with a flat base and triangular faces meeting at a vertex.', 'තල පාදයක් සහ ශීර්ෂයකදී හමු වන ත්‍රිකෝණාකාර මුහුණත් ඇති ඝන වස්තුවකි.') }] },
    { fig: { img: 'sd-cone', w: 60 }, cap: B('One cone of water fills one third of the cylinder.', 'එක් කේතුවක ජලයෙන් සිලින්ඩරයෙන් තුනෙන් එකක් පිරේ.'),
      s: { fig: { svg: coneFig }, cap: B('Slant height: <i>l</i>² = <i>r</i>² + <i>h</i>² (Pythagoras).', 'ඇල උස: <i>l</i>² = <i>r</i>² + <i>h</i>² (පයිතගරස්).') } },
    { box: [B('Cone: V = ⅓πr²h &nbsp;&nbsp;·&nbsp;&nbsp; Pyramid: V = ⅓ × base area × h', 'කේතුව: V = ⅓πr²h &nbsp;&nbsp;·&nbsp;&nbsp; පිරමීඩය: V = ⅓ × පාදයේ වර්ගඵලය × h'),
        B('Curved surface of a cone = πr<i>l</i>', 'කේතුවක වක්‍ර පෘෂ්ඨය = πr<i>l</i>')], k: 'key', title: B('Formula', 'සූත්‍රය'),
      s: { term: B('slant height', 'ඇල උස'), d: B('The distance from the vertex to the edge of the base, along the surface.', 'පෘෂ්ඨය දිගේ ශීර්ෂයේ සිට පාදයේ දාරයට ඇති දුර.') } },
    { ex: { q: B('A cone has radius 3.5 cm and height 6 cm. Find its volume.', 'කේතුවක අරය 3.5 cm ද උස 6 cm ද වේ. එහි පරිමාව සොයන්න.'),
        steps: [B('V = ⅓ × <sup>22</sup>⁄<sub>7</sub> × 3.5 × 3.5 × 6', 'V = ⅓ × <sup>22</sup>⁄<sub>7</sub> × 3.5 × 3.5 × 6'), B('= ⅓ × 38.5 × 6 = 77', '= ⅓ × 38.5 × 6 = 77')],
        a: B('V = 77 cm³', 'V = 77 cm³') } },
    { ex: { q: B('A square pyramid has a base of side 6 cm and height 4 cm. Find (a) its volume, (b) its total surface area.', 'සමචතුරස්‍ර පාද පිරමීඩයක පාදයේ පැත්තක දිග 6 cm ද උස 4 cm ද වේ. (a) එහි පරිමාව ද (b) මුළු පෘෂ්ඨ වර්ගඵලය ද සොයන්න.'),
        fig: { svg: pyrFig },
        steps: [B('(a) V = ⅓ × 6 × 6 × 4 = 48 cm³', '(a) V = ⅓ × 6 × 6 × 4 = 48 cm³'),
          B('(b) Height of each triangle: from the centre of the base to the middle of a side is 3 cm, so √(3² + 4²) = 5 cm.', '(b) එක් එක් ත්‍රිකෝණයේ උස: පාදයේ කේන්ද්‍රයේ සිට පැත්තක මැදට 3 cm නිසා √(3² + 4²) = 5 cm.'),
          B('Four triangles: 4 × ½ × 6 × 5 = 60 cm²; base: 6 × 6 = 36 cm²', 'ත්‍රිකෝණ හතර: 4 × ½ × 6 × 5 = 60 cm²; පාදය: 6 × 6 = 36 cm²')],
        a: B('(a) 48 cm³ &nbsp; (b) 60 + 36 = 96 cm²', '(a) 48 cm³ &nbsp; (b) 60 + 36 = 96 cm²') } },
    { check: [
      { q: B('A cone and a cylinder have the same radius and height. The cylinder holds 90 cm³. How much does the cone hold?', 'කේතුවක හා සිලින්ඩරයක අරය සහ උස සමාන වේ. සිලින්ඩරයේ පරිමාව 90 cm³ නම් කේතුවේ පරිමාව කීයද?'), a: B('⅓ × 90 = 30 cm³', '⅓ × 90 = 30 cm³') },
      { q: B('A cone has radius 6 cm and height 8 cm. Find its slant height.', 'කේතුවක අරය 6 cm ද උස 8 cm ද වේ. එහි ඇල උස සොයන්න.'), a: B('√(36 + 64) = 10 cm', '√(36 + 64) = 10 cm') }] },

    /* 6 */
    { sec: B('The sphere', 'ගෝලය'),
      lead: B('Archimedes showed that the surface of a sphere has the same area as the curved surface of the cylinder that just fits round it: 2πr × 2r = <b>4πr²</b>. The sphere\'s volume is ⅔ of that cylinder: <b>⁴⁄₃πr³</b>.',
        'ගෝලයක පෘෂ්ඨයේ වර්ගඵලය, එය හරියටම වට කරන සිලින්ඩරයේ වක්‍ර පෘෂ්ඨයට සමාන බව ආකිමිඩීස් පෙන්වා දුන්නේය: 2πr × 2r = <b>4πr²</b>. ගෝලයේ පරිමාව එම සිලින්ඩරයෙන් ⅔ කි: <b>⁴⁄₃πr³</b>.'),
      s: [{ term: B('sphere', 'ගෝලය'), d: B('A perfectly round solid; every point on it is r from the centre.', 'සම්පූර්ණයෙන්ම වටකුරු ඝන වස්තුවකි; එහි සෑම ලක්ෂ්‍යයක්ම කේන්ද්‍රයේ සිට r දුරින් ඇත.') },
        { term: B('hemisphere', 'අර්ධ ගෝලය'), d: B('Half of a sphere.', 'ගෝලයකින් අඩක්.') }] },
    { ex: { q: B('A ball has radius 21 cm. Find (a) its surface area, (b) its volume.', 'බෝලයක අරය 21 cm වේ. (a) එහි පෘෂ්ඨ වර්ගඵලය ද (b) පරිමාව ද සොයන්න.'),
        steps: [B('(a) 4πr² = 4 × <sup>22</sup>⁄<sub>7</sub> × 21 × 21 = 4 × 1386 = 5544 cm²', '(a) 4πr² = 4 × <sup>22</sup>⁄<sub>7</sub> × 21 × 21 = 4 × 1386 = 5544 cm²'),
          B('(b) ⁴⁄₃πr³ = ⁴⁄₃ × <sup>22</sup>⁄<sub>7</sub> × 21 × 21 × 21 = ⁴⁄₃ × 29 106 = 38 808 cm³', '(b) ⁴⁄₃πr³ = ⁴⁄₃ × <sup>22</sup>⁄<sub>7</sub> × 21 × 21 × 21 = ⁴⁄₃ × 29 106 = 38 808 cm³')],
        a: B('(a) 5544 cm² &nbsp; (b) 38 808 cm³', '(a) 5544 cm² &nbsp; (b) 38 808 cm³') },
      s: [{ fig: { svg: sphFig }, cap: B('A sphere of radius <i>r</i>.', 'අරය <i>r</i> වූ ගෝලයක්.') }, { rem: B('Solid hemisphere: curved part 2πr² + flat circle πr² = <b>3πr²</b>. Volume = ⅔πr³.', 'ඝන අර්ධ ගෝලය: වක්‍ර කොටස 2πr² + තල වෘත්තය πr² = <b>3πr²</b>. පරිමාව = ⅔πr³.')}] },
    { check: [
      { q: B('Find the curved surface area of a hemisphere of radius 7 cm.', 'අරය 7 cm වූ අර්ධ ගෝලයක වක්‍ර පෘෂ්ඨ වර්ගඵලය සොයන්න.'), a: B('2 × 22/7 × 49 = 308 cm²', '2 × 22/7 × 49 = 308 cm²') }] },
    { tbl: { head: [B('Solid', 'ඝන වස්තුව'), B('Surface area', 'පෘෂ්ඨ වර්ගඵලය'), B('Volume', 'පරිමාව')],
      rows: [[B('Cylinder', 'සිලින්ඩරය'), '2πr² + 2πrh', 'πr²h'], [B('Prism', 'ප්‍රිස්මය'), B('sum of all faces', 'සියලු මුහුණත්වල එකතුව'), 'A × l'],
        [B('Cone', 'කේතුව'), 'πr² + πr<i>l</i>', '⅓πr²h'], [B('Pyramid', 'පිරමීඩය'), B('base + triangles', 'පාදය + ත්‍රිකෝණ'), B('⅓ × base × h', '⅓ × පාදය × h')],
        [B('Sphere', 'ගෝලය'), '4πr²', '⁴⁄₃πr³'], [B('Hemisphere (solid)', 'අර්ධ ගෝලය (ඝන)'), '3πr²', '⅔πr³']] },
      s: { note: B('Learn this table. Every question in this tute uses one line of it.', 'මෙම වගුව කටපාඩම් කරන්න. මෙම නිබන්ධනයේ සෑම ප්‍රශ්නයක්ම එහි එක් පේළියක් භාවිත කරයි.'), tag: B('Formula sheet', 'සූත්‍ර පත්‍රය') } },

  ],

  mcq: [
    { q: B('The volume of a cylinder of radius r and height h is', 'අරය r සහ උස h වූ සිලින්ඩරයක පරිමාව වන්නේ'), opts: ['2πrh', 'πr²h', '⅓πr²h', '2πr² + 2πrh'], a: 2 },
    { q: B('Which unit is used for volume?', 'පරිමාව සඳහා භාවිත කරන ඒකකය කුමක්ද?'), opts: ['cm', 'cm²', 'cm³', 'm'], a: 3 },
    { q: B('The volume of a cylinder of radius 7 cm and height 2 cm is', 'අරය 7 cm සහ උස 2 cm වූ සිලින්ඩරයක පරිමාව වන්නේ'), opts: ['88 cm³', '154 cm³', '308 cm³', '616 cm³'], a: 3 },
    { q: B('1 litre is equal to', 'ලීටර 1ක් සමාන වන්නේ'), opts: ['10 cm³', '100 cm³', '1000 cm³', '10 000 cm³'], a: 3 },
    { q: B('How many cones of water fill a cylinder with the same base and height?', 'එකම පාදය සහ උස ඇති සිලින්ඩරයක් පිරවීමට ජලය පිරවූ කේතු කීයක් අවශ්‍යද?'), opts: ['2', '3', '4', '6'], a: 2 },
    { q: B('The surface area of a sphere of radius r is', 'අරය r වූ ගෝලයක පෘෂ්ඨ වර්ගඵලය වන්නේ'), opts: ['πr²', '2πr²', '3πr²', '4πr²'], a: 4 },
    { q: B('A prism has a cross-section of 12 cm² and length 9 cm. Its volume is', 'ප්‍රිස්මයක හරස්කඩ වර්ගඵලය 12 cm² ද දිග 9 cm ද වේ. එහි පරිමාව වන්නේ'), opts: ['21 cm³', '54 cm³', '108 cm³', '216 cm³'], a: 3 },
    { q: B('The total surface area of a cube of side 4 cm is', 'පැත්තක දිග 4 cm වූ ඝනකයක මුළු පෘෂ්ඨ වර්ගඵලය වන්නේ'), opts: ['16 cm²', '64 cm²', '96 cm²', '384 cm²'], a: 3, why: B('A cube has 6 square faces: 6 × 4 × 4 = 96 cm². (64 is its volume in cm³.)', 'ඝනකයකට සමචතුරස්‍ර මුහුණත් 6ක් ඇත: 6 × 4 × 4 = 96 cm². (64 යනු cm³ වලින් එහි පරිමාවයි.)') },
    { q: B('A cone has radius 6 cm and height 8 cm. Its slant height is', 'කේතුවක අරය 6 cm ද උස 8 cm ද වේ. එහි ඇල උස වන්නේ'), opts: ['7 cm', '10 cm', '14 cm', '48 cm'], a: 2 },
    { q: B('The volume of a hemisphere of radius 3 cm is', 'අරය 3 cm වූ අර්ධ ගෝලයක පරිමාව වන්නේ'), opts: ['9π cm³', '18π cm³', '27π cm³', '36π cm³'], a: 2, why: B('⅔ × π × 3³ = ⅔ × 27π = 18π cm³.', '⅔ × π × 3³ = ⅔ × 27π = 18π cm³.') }
  ],
  st: [
    { q: B('A closed cylindrical tin has radius 7 cm and height 12 cm. (Take π = <sup>22</sup>⁄<sub>7</sub>.)', 'සංවෘත සිලින්ඩරාකාර ටින් එකක අරය 7 cm ද උස 12 cm ද වේ. (π = <sup>22</sup>⁄<sub>7</sub> ලෙස ගන්න.)'), parts: [
      { q: B('Find the area of its circular base.', 'එහි වෘත්තාකාර පාදයේ වර්ගඵලය සොයන්න.'), m: 2, a: B('22/7 × 7 × 7 = 154 cm²', '22/7 × 7 × 7 = 154 cm²') },
      { q: B('Find its curved surface area.', 'එහි වක්‍ර පෘෂ්ඨ වර්ගඵලය සොයන්න.'), m: 2, a: B('2 × 22/7 × 7 × 12 = 528 cm²', '2 × 22/7 × 7 × 12 = 528 cm²') },
      { q: B('Find the total area of metal used to make the tin.', 'ටින් එක සෑදීමට භාවිත කළ මුළු ලෝහ වර්ගඵලය සොයන්න.'), m: 2, a: B('528 + 2 × 154 = 836 cm²', '528 + 2 × 154 = 836 cm²') },
      { q: B('Find its volume.', 'එහි පරිමාව සොයන්න.'), m: 2, a: B('154 × 12 = 1848 cm³', '154 × 12 = 1848 cm³') },
      { q: B('The tin is full of milk. How many full cups of 200 ml can be filled from it?', 'ටින් එක කිරිවලින් පිරී ඇත. එයින් මිලිලීටර 200 කෝප්ප කීයක් සම්පූර්ණයෙන් පිරවිය හැකිද?'), m: 2, a: B('1848 ÷ 200 = 9.24, so 9 full cups (1 cm³ = 1 ml).', '1848 ÷ 200 = 9.24, එබැවින් සම්පූර්ණ කෝප්ප 9යි (1 cm³ = 1 ml).') }] },
    { q: B('A solid is made of a cylinder of radius 7 cm and height 10 cm with a hemisphere of radius 7 cm on top.', 'අරය 7 cm සහ උස 10 cm වූ සිලින්ඩරයක් මත අරය 7 cm වූ අර්ධ ගෝලයක් තබා ඝන වස්තුවක් සාදා ඇත.'), fig: { svg: capsule }, parts: [
      { q: B('Find the volume of the cylinder.', 'සිලින්ඩරයේ පරිමාව සොයන්න.'), m: 2, a: B('154 × 10 = 1540 cm³', '154 × 10 = 1540 cm³') },
      { q: B('Find the volume of the hemisphere.', 'අර්ධ ගෝලයේ පරිමාව සොයන්න.'), m: 2, a: B('⅔ × 22/7 × 343 = 718⅔ cm³ (≈ 718.7 cm³)', '⅔ × 22/7 × 343 = 718⅔ cm³ (≈ 718.7 cm³)') },
      { q: B('Find the total volume of the solid.', 'ඝන වස්තුවේ මුළු පරිමාව සොයන්න.'), m: 1, a: B('1540 + 718⅔ = 2258⅔ cm³ (≈ 2258.7 cm³)', '1540 + 718⅔ = 2258⅔ cm³ (≈ 2258.7 cm³)') },
      { q: B('Find the total surface area of the solid.', 'ඝන වස්තුවේ මුළු පෘෂ්ඨ වර්ගඵලය සොයන්න.'), m: 3, lines: 3, a: B('Base 154 + curved side 440 + hemisphere 2πr² = 308 → 902 cm² (the joining circle is inside, so it is not counted).', 'පාදය 154 + වක්‍ර පැත්ත 440 + අර්ධ ගෝලය 2πr² = 308 → 902 cm² (සන්ධි වන වෘත්තය ඇතුළත ඇති නිසා එය ගණන් නොගනී).') }] },
    { q: B('A solid metal sphere of radius 6 cm is melted and made into small cones, each of radius 3 cm and height 4 cm. No metal is wasted.', 'අරය 6 cm වූ ඝන ලෝහ ගෝලයක් උණු කර, අරය 3 cm සහ උස 4 cm වූ කුඩා කේතු සාදනු ලැබේ. ලෝහ කිසිවක් නාස්ති නොවේ.'), parts: [
      { q: B('Find the volume of the sphere in terms of π.', 'ගෝලයේ පරිමාව π ඇසුරෙන් සොයන්න.'), m: 2, a: B('⁴⁄₃ × π × 216 = 288π cm³', '⁴⁄₃ × π × 216 = 288π cm³') },
      { q: B('Find the volume of one cone in terms of π.', 'එක් කේතුවක පරිමාව π ඇසුරෙන් සොයන්න.'), m: 2, a: B('⅓ × π × 9 × 4 = 12π cm³', '⅓ × π × 9 × 4 = 12π cm³') },
      { q: B('How many cones are made?', 'සාදන කේතු ගණන කීයද?'), m: 2, a: B('288π ÷ 12π = 24 cones', '288π ÷ 12π = කේතු 24') }] }
  ],
  summary: [
    B('Surface area is the total area of all faces (cm², m²). Volume is the space filled (cm³, m³).', 'පෘෂ්ඨ වර්ගඵලය යනු සියලු මුහුණත්වල මුළු වර්ගඵලයයි (cm², m²). පරිමාව යනු ගන්නා ඉඩයි (cm³, m³).'),
    B('The net of a cylinder is a rectangle (2πr by h) and two circles.', 'සිලින්ඩරයක දැල (2πr × h) සෘජුකෝණාස්‍රයක් සහ වෘත්ත දෙකකි.'),
    B('Cylinder: curved surface 2πrh, total 2πr² + 2πrh, volume πr²h.', 'සිලින්ඩරය: වක්‍ර පෘෂ්ඨය 2πrh, මුළු එකතුව 2πr² + 2πrh, පරිමාව πr²h.'),
    B('Prism: volume = cross-section × length.', 'ප්‍රිස්මය: පරිමාව = හරස්කඩ වර්ගඵලය × දිග.'),
    B('Cone and pyramid: one third of the matching cylinder or prism.', 'කේතුව සහ පිරමීඩය: ගැළපෙන සිලින්ඩරයෙන් හෝ ප්‍රිස්මයෙන් තුනෙන් එකකි.'),
    B('Cone: slant height l² = r² + h²; curved surface πrl.', 'කේතුව: ඇල උස l² = r² + h²; වක්‍ර පෘෂ්ඨය πrl.'),
    B('Sphere: surface 4πr², volume ⁴⁄₃πr³. Solid hemisphere: 3πr², ⅔πr³.', 'ගෝලය: පෘෂ්ඨය 4πr², පරිමාව ⁴⁄₃πr³. ඝන අර්ධ ගෝලය: 3πr², ⅔πr³.'),
    B('1 litre = 1000 cm³ and 1 m³ = 1000 litres. Check open / closed before adding faces.', 'ලීටර 1 = 1000 cm³ සහ 1 m³ = ලීටර 1000. මුහුණත් එකතු කිරීමට පෙර විවෘතද සංවෘතද බලන්න.')
  ],
  words: [B('face', 'මුහුණත'), B('radius', 'අරය'), B('circumference', 'පරිධිය'), B('litre', 'ලීටරය')]
};
