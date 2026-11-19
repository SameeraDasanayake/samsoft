// Nethu Closet customer shop page (Samsoft demo): catalogue -> bag -> order sent on WhatsApp (+ handed to the seller demo via localStorage).
(function () {
  'use strict';
  const D = window.FBSHOP;
  const INBOX = 'samsoft-fbshop-inbox';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const T = {
    en: { demoMsg: 'Demo shop page for a Facebook / WhatsApp seller, made by Samsoft.', seeSeller: 'See the seller side →', kicker: 'New this week',
      heroH: 'Easy, pretty clothes. Cash on delivery.', heroP: 'Pick your size, tap order, and we confirm on WhatsApp. Island-wide delivery in 2–4 days.',
      tag: D.shop.tag_en, all: 'All', new: 'New', best: 'Best seller', size: 'Size', qty: 'Quantity', addBag: 'Add to bag', added: 'Added to your bag',
      bag: 'Your bag', empty: 'Your bag is empty.', keep: 'Keep shopping', remove: 'Remove', items: 'Items', delivery: 'Delivery', total: 'Total',
      details: 'Delivery details', name: 'Full name', phone: 'Phone (WhatsApp)', address: 'Address', district: 'District', town: 'Town / city', note: 'Note (optional)',
      pay: 'Payment', cod: 'Cash on delivery', bank: 'Bank transfer', bankNote: 'Send the slip on WhatsApp after you order.', order: 'Order on WhatsApp',
      need: 'Please fill name, phone, address and town', badPhone: 'Phone number should have 10 digits', okH: 'Order {n} is ready!',
      okP: 'WhatsApp opened with your order. Send the message and we will confirm the delivery date.', okAgain: 'Open WhatsApp again', okSeller: 'See this order on the seller side →',
      howH: 'How to order', how1: 'Pick the item and your size.', how2: 'Fill your address and tap “Order on WhatsApp”.', how3: 'We confirm, pack and send by courier. Pay the rider (COD) or by bank transfer.',
      msgHead: 'Hi Nethu Closet! I want to order:', msgName: 'Name', msgPhone: 'Phone', msgAddr: 'Address', msgPay: 'Payment', msgOrder: 'Order', noPhoto: 'photo coming soon', close: 'Close' },
    si: { demoMsg: 'Facebook / WhatsApp seller කෙනෙකුට Samsoft හැදූ demo shop page එකක්.', seeSeller: 'Seller පැත්ත බලන්න →', kicker: 'මේ සතියේ අලුත්',
      heroH: 'ලේසි, ලස්සන ඇඳුම්. භාණ්ඩ ලැබුණම ගෙවන්න.', heroP: 'Size එක තෝරලා order කරන්න, අපි WhatsApp එකෙන් confirm කරනවා. දින 2–4කින් දිවයින පුරා බෙදාහැරීම.',
      tag: D.shop.tag_si, all: 'සියල්ල', new: 'අලුත්', best: 'වැඩියෙන්ම යන', size: 'Size', qty: 'ගණන', addBag: 'බෑගයට දාන්න', added: 'බෑගයට දැම්මා',
      bag: 'ඔබේ බෑගය', empty: 'බෑගය හිස්.', keep: 'තව බලන්න', remove: 'ඉවත් කරන්න', items: 'භාණ්ඩ', delivery: 'බෙදාහැරීම', total: 'මුළු මුදල',
      details: 'බෙදාහැරීමේ විස්තර', name: 'සම්පූර්ණ නම', phone: 'දුරකථනය (WhatsApp)', address: 'ලිපිනය', district: 'දිස්ත්‍රික්කය', town: 'නගරය', note: 'සටහන (අවශ්‍ය නම්)',
      pay: 'ගෙවීම', cod: 'භාණ්ඩ ලැබුණම ගෙවීම (COD)', bank: 'බැංකු මාරුව', bankNote: 'Order කළාට පස්සේ slip එක WhatsApp කරන්න.', order: 'WhatsApp එකෙන් order කරන්න',
      need: 'නම, දුරකථනය, ලිපිනය සහ නගරය පුරවන්න', badPhone: 'දුරකථන අංකයේ ඉලක්කම් 10ක් තිබිය යුතුයි', okH: 'Order {n} සූදානම්!',
      okP: 'ඔබේ order එක එක්ක WhatsApp open වුණා. Message එක යවන්න, අපි බෙදාහරින දිනය confirm කරනවා.', okAgain: 'ආයෙත් WhatsApp open කරන්න', okSeller: 'මේ order එක seller පැත්තෙන් බලන්න →',
      howH: 'Order කරන හැටි', how1: 'ඇඳුම සහ ඔබේ size එක තෝරන්න.', how2: 'ලිපිනය පුරවලා “WhatsApp එකෙන් order කරන්න” ඔබන්න.', how3: 'අපි confirm කරලා, pack කරලා courier එකෙන් එවනවා. Rider ට ගෙවන්න (COD) හෝ බැංකුවට දාන්න.',
      msgHead: 'ආයුබෝවන් Nethu Closet! මට order කරන්න ඕනේ:', msgName: 'නම', msgPhone: 'දුරකථනය', msgAddr: 'ලිපිනය', msgPay: 'ගෙවීම', msgOrder: 'Order', noPhoto: 'photo ළඟදීම', close: 'වසන්න' }
  };
  const qp = new URLSearchParams(location.search);
  const U = { lang: qp.get('lang') === 'en' ? 'en' : 'si', cat: 'all', bag: [], form: { name: '', phone: '', address: '', district: 'Colombo', town: '', note: '', pay: 'cod' }, sel: null, last: null };
  try { const b = JSON.parse(sessionStorage.getItem('nethu-bag')); if (Array.isArray(b)) U.bag = b; } catch (e) { /* ignore */ }
  const t = (k, v) => { let s = T[U.lang][k] != null ? T[U.lang][k] : T.en[k]; if (v) Object.keys(v).forEach(x => { s = String(s).split('{' + x + '}').join(v[x]); }); return s; };
  const nm = o => (U.lang === 'si' ? o.si : o.en);
  const P = id => D.products.find(p => p.id === id);
  const money = n => 'Rs. ' + Math.round(n).toLocaleString('en-US');
  const fee = () => (D.districts.find(d => d[0] === U.form.district) || [0, 450])[1];
  const keepBag = () => { try { sessionStorage.setItem('nethu-bag', JSON.stringify(U.bag)); } catch (e) { /* ignore */ } };
  const img = p => '<span class="ph"><img src="img/' + p.id + '.jpg" alt="' + esc(nm(p)) + '" loading="lazy" onerror="this.parentNode.classList.add(\'none\');this.remove()"><em>' + esc(t('noPhoto')) + '</em></span>';
  function toast(m) { const el = $('#toast'); el.textContent = m; el.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => { el.hidden = true; }, 1800); }

  function render() {
    document.documentElement.setAttribute('data-lang', U.lang); document.documentElement.lang = U.lang;
    $$('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
    $('#cats').innerHTML = [{ id: 'all', en: t('all'), si: t('all') }].concat(D.cats).map(c => '<button class="' + (U.cat === c.id ? 'on' : '') + '" data-act="cat" data-id="' + c.id + '">' + esc(nm(c)) + '</button>').join('');
    $('#grid').innerHTML = D.products.filter(p => U.cat === 'all' || p.cat === U.cat).map(p => '<button class="card" data-act="open" data-id="' + p.id + '">' + img(p) +
      (p.tag ? '<i class="tag t-' + p.tag + '">' + esc(t(p.tag)) + '</i>' : '') + '<b>' + esc(nm(p)) + '</b><span>' + esc(U.lang === 'si' ? p.colour_si : p.colour_en) + '</span><strong>' + esc(money(p.price)) + '</strong></button>').join('');
    const n = U.bag.reduce((s, l) => s + l.q, 0); $('#bagN').textContent = n || ''; $('#bagN').hidden = !n;
  }
  function open(html, cls) { $('#panel').className = 'panel ' + (cls || ''); $('#panel').innerHTML = html; $('#ov').hidden = false; document.body.classList.add('lock'); }
  function close() { $('#ov').hidden = true; document.body.classList.remove('lock'); }
  const xBtn = '<button class="x" data-act="close" aria-label="' + esc(t('close')) + '">×</button>';
  function openProduct(id) {
    const p = P(id); U.sel = { id, size: p.sizes.length === 1 ? p.sizes[0] : null, q: 1 };
    renderProduct();
  }
  function renderProduct() {
    const s = U.sel, p = P(s.id);
    open(xBtn + '<div class="pd">' + img(p) + '<div class="pd-i"><h2>' + esc(nm(p)) + '</h2><p class="col">' + esc(U.lang === 'si' ? p.colour_si : p.colour_en) + '</p><p class="pr">' + esc(money(p.price)) + '</p>' +
      '<h3>' + esc(t('size')) + '</h3><div class="sizes">' + p.sizes.map(z => '<button class="' + (s.size === z ? 'on' : '') + '" data-act="size" data-id="' + z + '">' + esc(z) + '</button>').join('') + '</div>' +
      '<h3>' + esc(t('qty')) + '</h3><div class="qty"><button data-act="q" data-d="-1">−</button><b>' + s.q + '</b><button data-act="q" data-d="1">+</button></div>' +
      '<button class="cta" data-act="add"' + (s.size ? '' : ' disabled') + '>' + esc(t('addBag')) + ' · ' + esc(money(p.price * s.q)) + '</button></div></div>', 'prod');
  }
  function renderBag() {
    const f = U.form, items = U.bag.reduce((s, l) => s + P(l.id).price * l.q, 0);
    if (!U.bag.length) { open(xBtn + '<div class="bag"><h2>' + esc(t('bag')) + '</h2><p class="empty">' + esc(t('empty')) + '</p><button class="cta" data-act="close">' + esc(t('keep')) + '</button></div>', 'side'); return; }
    const towns = D.towns[f.district] || [];
    open(xBtn + '<div class="bag"><h2>' + esc(t('bag')) + '</h2><ul class="bl">' + U.bag.map((l, i) => { const p = P(l.id); return '<li>' + img(p) + '<div><b>' + esc(nm(p)) + '</b><span>' + esc(t('size')) + ': ' + esc(l.size) + '</span><div class="qty sm"><button data-act="bq" data-id="' + i + '" data-d="-1">−</button><b>' + l.q + '</b><button data-act="bq" data-id="' + i + '" data-d="1">+</button></div></div><strong>' + esc(money(p.price * l.q)) + '</strong></li>'; }).join('') + '</ul>' +
      '<h3>' + esc(t('details')) + '</h3><div class="form">' +
      '<label><span>' + esc(t('name')) + '</span><input data-f="name" value="' + esc(f.name) + '" autocomplete="name"></label>' +
      '<label><span>' + esc(t('phone')) + '</span><input data-f="phone" inputmode="tel" maxlength="12" placeholder="07X XXX XXXX" value="' + esc(f.phone) + '" autocomplete="tel"></label>' +
      '<label class="w"><span>' + esc(t('address')) + '</span><input data-f="address" value="' + esc(f.address) + '" placeholder="No. 12, Temple Rd"></label>' +
      '<label><span>' + esc(t('district')) + '</span><select data-f="district">' + D.districts.map(d => '<option' + (d[0] === f.district ? ' selected' : '') + '>' + d[0] + '</option>').join('') + '</select></label>' +
      '<label><span>' + esc(t('town')) + '</span><input data-f="town" list="towns" value="' + esc(f.town) + '"><datalist id="towns">' + towns.map(x => '<option value="' + esc(x) + '">').join('') + '</datalist></label>' +
      '<label class="w"><span>' + esc(t('note')) + '</span><input data-f="note" value="' + esc(f.note) + '"></label></div>' +
      '<h3>' + esc(t('pay')) + '</h3><div class="pays"><button class="' + (f.pay === 'cod' ? 'on' : '') + '" data-act="pay" data-id="cod">' + esc(t('cod')) + '</button><button class="' + (f.pay === 'bank' ? 'on' : '') + '" data-act="pay" data-id="bank">' + esc(t('bank')) + '</button></div>' +
      (f.pay === 'bank' ? '<p class="bnote">' + esc(D.shop.bank) + '<br>' + esc(t('bankNote')) + '</p>' : '') +
      '<div class="sum"><div><span>' + esc(t('items')) + '</span><b>' + esc(money(items)) + '</b></div><div><span>' + esc(t('delivery')) + ' · ' + esc(f.district) + '</span><b>' + esc(money(fee())) + '</b></div><div class="g"><span>' + esc(t('total')) + '</span><b>' + esc(money(items + fee())) + '</b></div></div>' +
      '<button class="cta wa" data-act="order">' + esc(t('order')) + '</button></div>', 'side');
    $$('[data-f]').forEach(el => el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => { f[el.dataset.f] = el.value; if (el.dataset.f === 'district') { f.town = ''; renderBag(); } }));
  }
  function placeOrder() {
    const f = U.form, ph = f.phone.replace(/\D/g, '');
    if (!f.name.trim() || !ph || !f.address.trim() || !f.town.trim()) { toast(t('need')); return; }
    if (ph.length !== 10) { toast(t('badPhone')); return; }
    const no = 'W' + String(Date.now()).slice(-5);
    const items = U.bag.reduce((s, l) => s + P(l.id).price * l.q, 0);
    const lines = U.bag.map(l => '• ' + nm(P(l.id)) + ' (' + l.size + ') × ' + l.q + ' – ' + money(P(l.id).price * l.q));
    const msg = [t('msgHead'), ''].concat(lines).concat(['', t('delivery') + ': ' + money(fee()), t('total') + ': ' + money(items + fee()), '',
      t('msgName') + ': ' + f.name.trim(), t('msgPhone') + ': ' + ph, t('msgAddr') + ': ' + f.address.trim() + ', ' + f.town.trim() + ', ' + f.district,
      t('msgPay') + ': ' + (f.pay === 'cod' ? 'COD' : t('bank'))]).concat(f.note.trim() ? [t('note') + ': ' + f.note.trim()] : []).concat([t('msgOrder') + ': ' + no]).join('\n');
    const order = { ref: no, t: Date.now(), name: f.name.trim(), phone: ph, address: f.address.trim(), town: f.town.trim(), district: f.district, note: f.note.trim(), pay: f.pay,
      items: U.bag.map(l => ({ id: l.id, size: l.size, q: l.q, p: P(l.id).price })), fee: fee() };
    try { const box = JSON.parse(localStorage.getItem(INBOX) || '[]'); box.push(order); localStorage.setItem(INBOX, JSON.stringify(box)); } catch (e) { /* ignore */ }
    const link = 'https://wa.me/?text=' + encodeURIComponent(msg);
    U.last = link; U.bag = []; keepBag(); render();
    window.open(link, '_blank', 'noopener');
    open(xBtn + '<div class="done"><span class="tick">✓</span><h2>' + esc(t('okH', { n: no })) + '</h2><p>' + esc(t('okP')) + '</p><pre>' + esc(msg) + '</pre>' +
      '<a class="cta wa" href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(t('okAgain')) + '</a><a class="lnk" href="index.html">' + esc(t('okSeller')) + '</a></div>', 'side');
  }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) { if (e.target.id === 'ov') close(); return; }
    const a = el.dataset.act, id = el.dataset.id;
    if (a === 'lang') { U.lang = U.lang === 'si' ? 'en' : 'si'; render(); if (!$('#ov').hidden && $('.bag')) renderBag(); else if (!$('#ov').hidden && U.sel && $('.pd')) renderProduct(); }
    else if (a === 'cat') { U.cat = id; render(); }
    else if (a === 'open') openProduct(id);
    else if (a === 'close') close();
    else if (a === 'size') { U.sel.size = id; renderProduct(); }
    else if (a === 'q') { U.sel.q = Math.max(1, Math.min(9, U.sel.q + +el.dataset.d)); renderProduct(); }
    else if (a === 'add') { const s = U.sel, l = U.bag.find(x => x.id === s.id && x.size === s.size); if (l) l.q += s.q; else U.bag.push({ id: s.id, size: s.size, q: s.q }); keepBag(); render(); close(); toast(t('added')); }
    else if (a === 'bag') renderBag();
    else if (a === 'bq') { const l = U.bag[+id]; l.q += +el.dataset.d; if (l.q <= 0) U.bag.splice(+id, 1); keepBag(); render(); renderBag(); }
    else if (a === 'pay') { U.form.pay = id; renderBag(); }
    else if (a === 'order') placeOrder();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  render();
})();
