// Samsoft online seller demo – order manager for "Nethu Closet": pipeline, COD + bank, couriers + tracking, returns, waybills, profit.
(function () {
  'use strict';
  const D = window.FBSHOP;
  const WA_NUMBER = '94704808744';
  const KEY = 'samsoft-fbshop-demo-v1', INBOX = 'samsoft-fbshop-inbox';
  const MIN = 60000, DAY = 86400000;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const FLOW = ['new', 'confirmed', 'packed', 'shipped', 'delivered'];
  const T = {
    en: {
      demoMsg: 'Demo: Samsoft order manager for Facebook / WhatsApp sellers. We set it up for your page.', demoCta: 'Get it for my page',
      waWelcome: 'Hello Samsoft, I tried the online seller demo. I would like an order system for my Facebook / WhatsApp business.',
      sub: 'Order manager', nav_orders: 'Orders', nav_cod: 'COD & payments', nav_stock: 'Stock', nav_profit: 'Profit', openShop: 'Shop page', newOrder: 'New order',
      new: 'New', confirmed: 'Confirmed', packed: 'Packed', shipped: 'With courier', delivered: 'Delivered', returned: 'Returned', cancelled: 'Cancelled',
      pipeline: 'Pipeline', doneList: 'Delivered', returns: 'Returns & cancelled', search: 'Search name, phone, order or tracking no.', allSrc: 'All',
      fb: 'Facebook', wa: 'WhatsApp', ig: 'Instagram', shop: 'Shop page', cod: 'COD', bank: 'Bank', paid: 'Paid', unpaid: 'Not paid',
      empty: 'Nothing here.', items: 'Items', delivery: 'Delivery', discount: 'Discount', total: 'Total', toCollect: 'COD to collect',
      customer: 'Customer', address: 'Address', courier: 'Courier', tracking: 'Tracking no.', genTrack: 'Auto', history: 'Timeline',
      confirm: 'Confirm order', pack: 'Mark packed', ship: 'Hand to courier', deliver: 'Mark delivered', ret: 'Returned', cancel: 'Cancel order',
      waybill: 'Print waybill', waCust: 'WhatsApp customer', slip: 'Bank slip received', reason: 'Return reason', needTrack: 'Pick a courier first',
      reasons: ['Customer not answering', 'Refused at the door', 'Wrong address', 'Wrong size – exchange'],
      moved: 'Order {n} → {s}', fromShop: '{n} new order(s) from your shop page', restocked: 'Items put back in stock',
      noStock: 'Not enough stock: {p}', ago: '{n}d', today: 'today', hrs: '{n}h', mins: '{n}m',
      msgConfirm: 'Hi {name}, thank you for your order {no} from Nethu Closet!\n{items}\nTotal: {tot} ({pay}).\nWe will send it in 1–2 days. Please keep your phone on for the courier.',
      msgShip: 'Hi {name}, your Nethu Closet order {no} is on the way with {c}.\nTracking: {tr}\n{pay}Thank you!', msgCod: 'Please keep {tot} ready for the rider.\n',
      // new order
      source: 'Where did the order come from?', name: 'Name', phone: 'Phone', town: 'Town', district: 'District', note: 'Note', product: 'Item', size: 'Size', qty: 'Qty',
      add: 'Add', save: 'Save order', saved: 'Order {n} saved', needAll: 'Fill name, phone, address and add at least one item', known: 'Returning customer – {n} past orders',
      pay: 'Payment', alsoConfirm: 'Already confirmed with the customer',
      // cod
      codPending: 'COD with riders', codOwed: 'Couriers owe you', codRemitted: 'Received from couriers (30 days)', bankWaiting: 'Bank transfers to check',
      remit: 'Mark received', remitDone: '{c}: {a} marked as received', orders: 'orders', markPaid: 'Slip OK', paidDone: 'Payment marked as received',
      // stock
      stockH: 'Stock by size', cost: 'Cost', price: 'Price', sold30: 'Sold (30d)', low: 'Low', out: 'Out',
      // profit
      d7: '7 days', d30: '30 days', ordersN: 'Orders', sales: 'Delivered sales', profit: 'Profit', retRate: 'Return rate', bySource: 'Orders by source',
      byCourier: 'Couriers', delRate: 'delivered', avgDays: 'avg days', topItems: 'Best sellers', perDay: 'Orders per day', costsH: 'Where the money went',
      goodsCost: 'Cost of clothes', courierCost: 'Courier charges', returnCost: 'Return losses', feeIn: 'Delivery fees collected',
      settingsReset: 'Restart the demo', resetDone: 'Fresh demo data loaded', close: 'Close',
      dshort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], am: 'AM', pm: 'PM', from: 'From', to: 'To', weight: 'Weight', pieces: 'Pieces'
    },
    si: {
      demoMsg: 'Demo: Facebook / WhatsApp විකුණුම්කරුවන්ට Samsoft order manager. ඔබේ page එකට ගැලපෙන්න හදලා දෙනවා.', demoCta: 'මගේ page එකටත් ඕනේ',
      waWelcome: 'ආයුබෝවන් Samsoft, මම online seller demo එක බැලුවා. මගේ Facebook / WhatsApp ව්‍යාපාරයට order system එකක් ඕනේ.',
      sub: 'Order manager', nav_orders: 'Orders', nav_cod: 'COD සහ ගෙවීම්', nav_stock: 'Stock', nav_profit: 'ලාභය', openShop: 'Shop page', newOrder: 'අලුත් order',
      new: 'අලුත්', confirmed: 'තහවුරුයි', packed: 'Pack කළා', shipped: 'Courier ළඟ', delivered: 'ලැබුණා', returned: 'ආපසු ආවා', cancelled: 'අවලංගුයි',
      pipeline: 'Pipeline', doneList: 'ලැබුණු', returns: 'ආපසු / අවලංගු', search: 'නම, දුරකථනය, order හෝ tracking අංකය', allSrc: 'සියල්ල',
      fb: 'Facebook', wa: 'WhatsApp', ig: 'Instagram', shop: 'Shop page', cod: 'COD', bank: 'බැංකු', paid: 'ගෙවා ඇත', unpaid: 'ගෙවා නැත',
      empty: 'මෙහි කිසිවක් නෑ.', items: 'භාණ්ඩ', delivery: 'බෙදාහැරීම', discount: 'වට්ටම', total: 'මුළු මුදල', toCollect: 'එකතු කළ යුතු COD',
      customer: 'පාරිභෝගිකයා', address: 'ලිපිනය', courier: 'Courier', tracking: 'Tracking අංකය', genTrack: 'Auto', history: 'කාලරේඛාව',
      confirm: 'Order තහවුරු කරන්න', pack: 'Pack කළා ලෙස', ship: 'Courier එකට දෙන්න', deliver: 'ලැබුණා ලෙස', ret: 'ආපසු ආවා', cancel: 'Order අවලංගු කරන්න',
      waybill: 'Waybill print', waCust: 'පාරිභෝගිකයාට WhatsApp', slip: 'බැංකු slip එක ලැබුණා', reason: 'ආපසු ආ හේතුව', needTrack: 'මුලින් courier එක තෝරන්න',
      reasons: ['පාරිභෝගිකයා phone එකට නෑ', 'දොර ළඟදී ප්‍රතික්ෂේප කළා', 'වැරදි ලිපිනය', 'වැරදි size – මාරු කිරීමට'],
      moved: 'Order {n} → {s}', fromShop: 'Shop page එකෙන් අලුත් orders {n}ක්', restocked: 'භාණ්ඩ නැවත stock එකට දැම්මා',
      noStock: 'Stock මදි: {p}', ago: 'දින {n}', today: 'අද', hrs: 'පැය {n}', mins: 'මි. {n}',
      msgConfirm: 'ආයුබෝවන් {name}, Nethu Closet වෙතින් ඔබේ order {no}ට ස්තූතියි!\n{items}\nමුළු මුදල: {tot} ({pay}).\nදින 1–2කින් එවනවා. Courier එකට phone එක on කරලා තියාගන්න.',
      msgShip: 'ආයුබෝවන් {name}, ඔබේ Nethu Closet order {no} {c} මඟින් එනවා.\nTracking: {tr}\n{pay}ස්තූතියි!', msgCod: 'Rider ට දෙන්න {tot} ලෑස්ති කරගන්න.\n',
      source: 'Order එක ආවේ කොහෙන්ද?', name: 'නම', phone: 'දුරකථනය', town: 'නගරය', district: 'දිස්ත්‍රික්කය', note: 'සටහන', product: 'භාණ්ඩය', size: 'Size', qty: 'ගණන',
      add: 'එකතු', save: 'Order save කරන්න', saved: 'Order {n} save කළා', needAll: 'නම, දුරකථනය, ලිපිනය පුරවලා අඩුම තරමේ එක භාණ්ඩයක් එකතු කරන්න', known: 'පරණ පාරිභෝගිකයෙක් – කලින් orders {n}ක්',
      pay: 'ගෙවීම', alsoConfirm: 'පාරිභෝගිකයා එක්ක දැනටමත් තහවුරු කළා',
      codPending: 'Riders ළඟ ඇති COD', codOwed: 'Couriers ඔබට දිය යුතු', codRemitted: 'Couriers ගෙන් ලැබුණු (දින 30)', bankWaiting: 'පරීක්ෂා කළ යුතු බැංකු මාරු',
      remit: 'ලැබුණා ලෙස', remitDone: '{c}: {a} ලැබුණා ලෙස සලකුණු කළා', orders: 'orders', markPaid: 'Slip හරි', paidDone: 'ගෙවීම ලැබුණා ලෙස සලකුණු කළා',
      stockH: 'Size අනුව stock', cost: 'පිරිවැය', price: 'මිල', sold30: 'විකුණුම් (දින 30)', low: 'අඩුයි', out: 'නෑ',
      d7: 'දින 7', d30: 'දින 30', ordersN: 'Orders', sales: 'ලැබුණු විකුණුම්', profit: 'ලාභය', retRate: 'ආපසු එන ප්‍රතිශතය', bySource: 'Orders එන තැන්',
      byCourier: 'Couriers', delRate: 'ලැබුණා', avgDays: 'සාමාන්‍ය දින', topItems: 'වැඩියෙන්ම යන', perDay: 'දිනකට orders', costsH: 'මුදල් ගියේ කොහෙටද',
      goodsCost: 'ඇඳුම් පිරිවැය', courierCost: 'Courier ගාස්තු', returnCost: 'ආපසු ඒමේ පාඩු', feeIn: 'එකතු කළ බෙදාහැරීම් ගාස්තු',
      settingsReset: 'Demo එක මුල ඉඳන්', resetDone: 'අලුත් demo දත්ත ආවා', close: 'වසන්න',
      dshort: ['ඉරි', 'සඳු', 'අඟ', 'බදා', 'බ්‍රහ', 'සිකු', 'සෙන'], am: 'පෙ.ව.', pm: 'ප.ව.', from: 'යවන්නා', to: 'ලබන්නා', weight: 'බර', pieces: 'කෑලි'
    }
  };

  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const dayStart = ms => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const P = id => D.products.find(p => p.id === id);
  const C = id => D.couriers.find(c => c.id === id);
  const feeOf = dist => (D.districts.find(d => d[0] === dist) || [0, 450])[1];

  // ---------- demo data ----------
  function makeDemo(now) {
    const day0 = dayStart(now), nowT = now.getTime();
    const R = rng(Math.floor(day0 / DAY) * 7777 + 11);
    const pick = a => a[Math.floor(R() * a.length)];
    const W = (pairs) => { let s = R() * pairs.reduce((x, p) => x + p[1], 0); for (const p of pairs) { s -= p[1]; if (s <= 0) return p[0]; } return pairs[0][0]; };
    const people = [], used = new Set();
    for (let i = 0; i < 130; i++) {
      let name; do { name = pick(D.first) + ' ' + pick(D.last); } while (used.has(name)); used.add(name);
      const district = W(D.districts.map(d => [d[0], d[0] === 'Colombo' || d[0] === 'Gampaha' ? 6 : d[1] <= 450 ? 2 : 1]));
      people.push({ name, phone: '07' + pick(['0', '1', '2', '5', '6', '7', '8']) + String(1000000 + Math.floor(R() * 8999999)), district, town: pick(D.towns[district]), address: 'No. ' + (1 + Math.floor(R() * 220)) + ', ' + pick(D.streets) });
    }
    const stock = {};
    D.products.forEach(p => p.sizes.forEach(z => { const r = R(); stock[p.id + ':' + z] = r < 0.07 ? 0 : r < 0.18 ? 1 + Math.floor(R() * 2) : 3 + Math.floor(R() * 14); }));
    const orders = []; let no = 2400;
    const pw = D.products.map(p => [p.id, p.tag === 'best' ? 5 : p.tag === 'new' ? 3 : 2]);
    for (let a = 40; a >= 0; a--) {
      const ds = day0 - a * DAY, n = 6 + Math.floor(R() * 7) + (new Date(ds).getDay() === 0 ? 3 : 0);
      for (let i = 0; i < n; i++) {
        // today's list = orders that came in since last night (FB / WhatsApp messages arrive all evening)
        const t = a === 0 ? nowT - Math.floor(10 + R() * 15 * 60) * MIN : ds + (8 * 60 + Math.floor(R() * 14 * 60)) * MIN;
        if (t > nowT - 10 * MIN) continue;
        const c = pick(people), lines = [];
        const nl = R() < 0.25 ? 2 : 1;
        for (let k = 0; k < nl; k++) { const p = P(W(pw)); lines.push({ id: p.id, size: pick(p.sizes), q: R() < 0.1 ? 2 : 1, p: p.price }); }
        const pay = R() < 0.7 ? 'cod' : 'bank';
        let status;
        if (a >= 7) status = W([['delivered', 86], ['returned', 9], ['cancelled', 5]]);
        else if (a >= 3) status = W([['delivered', 60], ['shipped', 30], ['returned', 5], ['cancelled', 5]]);
        else if (a >= 1) status = W([['shipped', 50], ['packed', 30], ['delivered', 8], ['confirmed', 12]]);
        else status = W([['new', 50], ['confirmed', 35], ['packed', 15]]);
        const o = { no: 'NC' + (no++), t, src: W([['fb', 5], ['wa', 4], ['ig', 1], ['shop', 2]]), name: c.name, phone: c.phone, address: c.address, town: c.town, district: c.district,
          items: lines, fee: feeOf(c.district), disc: R() < 0.06 ? 200 : 0, pay, paid: false, status, hist: [{ s: 'new', t }], courier: null, track: '', remit: false, reason: '' };
        const steps = status === 'cancelled' ? ['cancelled'] : status === 'returned' ? ['confirmed', 'packed', 'shipped', 'returned'] : FLOW.slice(1, FLOW.indexOf(status) + 1);
        const gaps = steps.map(s => s === 'confirmed' ? 30 + R() * 200 : s === 'packed' ? 300 + R() * 900 : s === 'shipped' ? 400 + R() * 900 : s === 'cancelled' ? 60 + R() * 600 : (1.5 + R() * 2.5) * 1440);
        const total = gaps.reduce((x, y) => x + y, 0), avail = (nowT - 5 * MIN - t) / MIN;
        const k = total > avail ? avail / total * (0.55 + 0.4 * R()) : 1;
        let tt = t;
        steps.forEach((s, i) => { tt += gaps[i] * k * MIN; o.hist.push({ s, t: tt }); });
        if (['shipped', 'delivered', 'returned'].includes(status)) { const cr = W([['speed', 5], ['island', 3], ['quick', 2]]); o.courier = cr; o.track = C(cr).pre + String(10000000 + Math.floor(R() * 89999999)); }
        if (status === 'returned') o.reason = Math.floor(R() * 4);
        if (pay === 'bank') o.paid = status !== 'new' && status !== 'cancelled' ? true : R() < 0.4;
        if (pay === 'cod' && status === 'delivered') { const dt = o.hist[o.hist.length - 1].t; o.remit = nowT - dt > 4 * DAY; o.paid = o.remit; }
        orders.push(o);
      }
    }
    orders.sort((x, y) => x.t - y.t);
    return { v: 1, made: day0, orders, stock, no, seen: [] };
  }
  function load() { let s = null; try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; } if (!s || s.v !== 1 || s.made !== dayStart(Date.now())) s = makeDemo(new Date()); return s; }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* demo works without storage */ } }
  save();

  const qp = new URLSearchParams(location.search);
  const U = { lang: qp.get('lang') === 'si' ? 'si' : 'en', page: ['orders', 'cod', 'stock', 'profit'].includes(qp.get('page')) ? qp.get('page') : 'orders',
    view: 'pipe', q: '', src: 'all', rp: 'd30', no: null };
  const t = (k, v) => { let s = T[U.lang][k] != null ? T[U.lang][k] : T.en[k]; if (s == null) s = k; if (v) Object.keys(v).forEach(x => { s = String(s).split('{' + x + '}').join(v[x]); }); return s; };
  const nm = o => (U.lang === 'si' ? o.si : o.en);
  const money = n => 'Rs. ' + Math.round(n).toLocaleString('en-US');
  const num = n => Math.round(n).toLocaleString('en-US');
  const itemsTot = o => o.items.reduce((s, l) => s + l.p * l.q, 0);
  const totOf = o => itemsTot(o) + o.fee - o.disc;
  const order = no => S.orders.find(o => o.no === no);
  const st = (id, z) => S.stock[id + ':' + z] || 0;
  function fmtTime(ms) { const d = new Date(ms); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0'); const ap = h < 12 ? t('am') : t('pm'); h = h % 12 || 12; return U.lang === 'si' ? ap + ' ' + h + '.' + m : h + ':' + m + ' ' + ap; }
  const fmtDate = ms => { const d = new Date(ms); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const age = ms => { const m = (Date.now() - ms) / MIN; return m < 60 ? t('mins', { n: Math.max(1, Math.round(m)) }) : m < 1440 ? t('hrs', { n: Math.round(m / 60) }) : t('ago', { n: Math.round(m / 1440) }); };
  const waPhone = p => { const d = String(p || '').replace(/\D/g, ''); return d.length === 10 && d[0] === '0' ? '94' + d.slice(1) : d; };
  const waLink = (phone, text) => 'https://wa.me/' + waPhone(phone) + '?text=' + encodeURIComponent(text);
  function toast(msg) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; $('#toasts').appendChild(el); setTimeout(() => el.classList.add('out'), 2200); setTimeout(() => el.remove(), 2600); }
  const srcChip = s => '<i class="src s-' + s + '">' + esc(t(s)) + '</i>';
  const payChip = o => o.pay === 'cod' ? '<i class="pay cod">COD</i>' : '<i class="pay ' + (o.paid ? 'ok' : 'wait') + '">' + esc(t('bank')) + (o.paid ? ' ✓' : '') + '</i>';

  // inbox from shop.html
  function importInbox() {
    let box = []; try { box = JSON.parse(localStorage.getItem(INBOX) || '[]'); } catch (e) { box = []; }
    const fresh = box.filter(x => !S.seen.includes(x.ref));
    if (!fresh.length) return;
    fresh.forEach(x => {
      S.orders.push({ no: 'NC' + (S.no++), ref: x.ref, t: x.t, src: 'shop', name: x.name, phone: x.phone, address: x.address, town: x.town, district: x.district, note: x.note,
        items: x.items, fee: x.fee, disc: 0, pay: x.pay, paid: false, status: 'new', hist: [{ s: 'new', t: x.t }], courier: null, track: '', remit: false, reason: '' });
      S.seen.push(x.ref);
    });
    try { localStorage.setItem(INBOX, '[]'); } catch (e) { /* ignore */ }
    save(); toast(t('fromShop', { n: fresh.length }));
  }

  // ---------- shell ----------
  function applyLang() {
    document.documentElement.setAttribute('data-lang', U.lang); document.documentElement.lang = U.lang;
    $$('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
    $('#waCta').href = waLink(WA_NUMBER, t('waWelcome'));
    renderPage(); counts();
  }
  function go(p) { U.page = p; document.body.dataset.page = p; $$('.page').forEach(x => x.classList.toggle('on', x.id === 'pg-' + p)); $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.id === p)); renderPage(); window.scrollTo(0, 0); }
  function renderPage() { ({ orders: renderOrders, cod: renderCod, stock: renderStock, profit: renderProfit })[U.page](); }
  function counts() { const n = S.orders.filter(o => o.status === 'new').length; const el = $('#newCnt'); el.textContent = n || ''; el.hidden = !n; }
  function openModal(html, cls) { $('#sheet').className = 'sheet ' + (cls || ''); $('#sheet').innerHTML = html; $('#modal').hidden = false; document.body.classList.add('noscroll'); }
  function closeModal() { $('#modal').hidden = true; $('#sheet').innerHTML = ''; document.body.classList.remove('noscroll'); U.no = null; U.nf = null; }
  const shHead = (title, sub) => '<div class="sh-head"><div><h2>' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div><button class="sh-x" data-act="close" aria-label="' + esc(t('close')) + '">×</button></div>';

  // ---------- orders ----------
  function match(o) {
    if (U.src !== 'all' && o.src !== U.src) return false;
    const q = U.q.trim().toLowerCase(); if (!q) return true;
    return (o.name + ' ' + o.phone + ' ' + o.no + ' ' + o.track + ' ' + o.town).toLowerCase().includes(q);
  }
  function card(o) {
    const n = o.items.reduce((s, l) => s + l.q, 0);
    return '<button class="oc" data-act="open" data-id="' + o.no + '"><span class="oc-1"><b class="mono">' + o.no + '</b>' + srcChip(o.src) + '<em>' + esc(age(o.hist[o.hist.length - 1].t)) + '</em></span>' +
      '<span class="oc-n">' + esc(o.name) + '</span><span class="oc-a">' + esc(o.town) + ' · ' + n + ' ' + (U.lang === 'si' ? t('items') : (n === 1 ? 'item' : 'items')) + '</span>' +
      '<span class="oc-3"><b>' + esc(money(totOf(o))) + '</b>' + payChip(o) + '</span>' + (o.track ? '<span class="oc-tr mono">' + esc(C(o.courier).name.split(' ')[0]) + ' · ' + esc(o.track) + '</span>' : '') + '</button>';
  }
  function renderOrders() {
    const list = S.orders.filter(match);
    const head = '<div class="pg-head"><span class="seg">' + [['pipe', t('pipeline')], ['done', t('doneList')], ['ret', t('returns')]].map(([id, l]) => '<button class="' + (U.view === id ? 'on' : '') + '" data-act="view" data-id="' + id + '">' + esc(l) + '</button>').join('') + '</span>' +
      '<label class="search"><input id="oq" placeholder="' + esc(t('search')) + '" value="' + esc(U.q) + '"></label>' +
      '<span class="seg sm">' + ['all', 'fb', 'wa', 'ig', 'shop'].map(s => '<button class="' + (U.src === s ? 'on' : '') + '" data-act="src" data-id="' + s + '">' + esc(s === 'all' ? t('allSrc') : t(s)) + '</button>').join('') + '</span></div>';
    let body;
    if (U.view === 'pipe') {
      const cols = FLOW.map(s => {
        let items = list.filter(o => o.status === s);
        if (s === 'delivered') items = items.filter(o => Date.now() - o.hist[o.hist.length - 1].t < 2 * DAY);
        items.sort((a, b) => b.hist[b.hist.length - 1].t - a.hist[a.hist.length - 1].t);
        const sum = items.reduce((x, o) => x + totOf(o), 0);
        return '<div class="col c-' + s + '"><div class="col-h"><b>' + esc(t(s)) + '</b><span>' + items.length + '</span><em>' + esc(money(sum)) + '</em></div><div class="col-b">' + (items.map(card).join('') || '<p class="empty">' + esc(t('empty')) + '</p>') + '</div></div>';
      }).join('');
      body = '<div class="board">' + cols + '</div>';
    } else {
      const rows = list.filter(o => U.view === 'done' ? o.status === 'delivered' : ['returned', 'cancelled'].includes(o.status)).sort((a, b) => b.t - a.t).slice(0, 80);
      body = '<div class="panel flush"><table class="tbl">' + (rows.map(o => '<tr data-act="open" data-id="' + o.no + '"><td class="mono">' + o.no + '</td><td>' + esc(fmtDate(o.t)) + '</td><td><b>' + esc(o.name) + '</b><small>' + esc(o.town) + '</small></td><td class="hs">' + srcChip(o.src) + '</td>' +
        '<td class="hs mono">' + esc(o.track || '–') + '</td><td>' + (U.view === 'ret' ? '<i class="st s-' + o.status + '">' + esc(t(o.status)) + '</i>' + (o.status === 'returned' ? '<small>' + esc(t('reasons')[o.reason] || '') + '</small>' : '') : payChip(o)) + '</td><td class="r">' + esc(num(totOf(o))) + '</td></tr>').join('') || '<tr><td class="empty">' + esc(t('empty')) + '</td></tr>') + '</table></div>';
    }
    $('#pg-orders').innerHTML = head + body;
    const q = $('#oq'); q.addEventListener('input', () => { U.q = q.value; const p = q.selectionStart; renderOrders(); const n = $('#oq'); n.focus(); n.setSelectionRange(p, p); });
  }
  function openOrder(no) {
    U.no = no; const o = order(no); if (!o) return;
    const it = itemsTot(o);
    const steps = FLOW.map((s, i) => { const h = o.hist.find(x => x.s === s); const idx = FLOW.indexOf(o.status); return '<li class="' + (h ? 'done' : '') + (o.status === s ? ' cur' : '') + '"><i></i><span>' + esc(t(s)) + '</span><small>' + (h ? esc(fmtDate(h.t).slice(5) + ' ' + fmtTime(h.t)) : '') + '</small></li>'; }).join('');
    const itemsMsg = o.items.map(l => '• ' + nm(P(l.id)) + ' (' + l.size + ') × ' + l.q).join('\n');
    const payTxt = o.pay === 'cod' ? 'COD' : t('bank') + (o.paid ? ' ✓' : '');
    let waMsg;
    if (o.status === 'shipped' || o.status === 'delivered') waMsg = t('msgShip', { name: o.name.split(' ')[0], no: o.no, c: C(o.courier).name, tr: o.track, pay: o.pay === 'cod' ? t('msgCod', { tot: money(totOf(o)) }) : '' });
    else waMsg = t('msgConfirm', { name: o.name.split(' ')[0], no: o.no, items: itemsMsg, tot: money(totOf(o)), pay: payTxt });
    let acts = '';
    if (o.status === 'new') acts = '<button class="btn" data-act="cancel">' + esc(t('cancel')) + '</button><button class="btn lime" data-act="to" data-id="confirmed">' + esc(t('confirm')) + '</button>';
    else if (o.status === 'confirmed') acts = '<button class="btn" data-act="cancel">' + esc(t('cancel')) + '</button><button class="btn lime" data-act="to" data-id="packed">' + esc(t('pack')) + '</button>';
    else if (o.status === 'packed') acts = '<button class="btn" data-act="waybill">' + esc(t('waybill')) + '</button><button class="btn lime" data-act="to" data-id="shipped">' + esc(t('ship')) + '</button>';
    else if (o.status === 'shipped') acts = '<select id="retR">' + t('reasons').map((r, i) => '<option value="' + i + '">' + esc(r) + '</option>').join('') + '</select><button class="btn" data-act="ret">' + esc(t('ret')) + '</button><button class="btn lime" data-act="to" data-id="delivered">' + esc(t('deliver')) + '</button>';
    else if (o.status === 'delivered') acts = '<button class="btn" data-act="waybill">' + esc(t('waybill')) + '</button>';
    const courierBox = ['confirmed', 'packed', 'shipped', 'delivered', 'returned'].includes(o.status) ?
      '<div class="cr"><label><span>' + esc(t('courier')) + '</span><select id="oCourier"' + (o.status === 'delivered' || o.status === 'returned' ? ' disabled' : '') + '><option value="">–</option>' + D.couriers.map(c => '<option value="' + c.id + '"' + (o.courier === c.id ? ' selected' : '') + '>' + esc(c.name) + ' (Rs. ' + c.fee + ')</option>').join('') + '</select></label>' +
      '<label><span>' + esc(t('tracking')) + '</span><span class="trk"><input id="oTrack" class="mono" value="' + esc(o.track) + '"' + (o.status === 'delivered' || o.status === 'returned' ? ' disabled' : '') + '><button class="btn sm" data-act="gen">' + esc(t('genTrack')) + '</button></span></label></div>' : '';
    openModal(shHead('<span class="mono">' + o.no + '</span> <i class="st s-' + o.status + '">' + esc(t(o.status)) + '</i>', srcChip(o.src) + ' ' + esc(fmtDate(o.t)) + ' ' + esc(fmtTime(o.t)) + (o.ref ? ' · ' + esc(o.ref) : '')) +
      '<div class="sh-body od">' + (['returned', 'cancelled'].includes(o.status) ? '' : '<ol class="steps">' + steps + '</ol>') +
      '<div class="od-grid"><div class="od-c"><h3>' + esc(t('customer')) + '</h3><b>' + esc(o.name) + '</b><span class="mono">' + esc(o.phone) + '</span><span>' + esc(o.address) + '</span><span>' + esc(o.town) + ', ' + esc(o.district) + '</span>' + (o.note ? '<em>“' + esc(o.note) + '”</em>' : '') +
      '<a class="btn wa sm" target="_blank" rel="noopener" href="' + esc(waLink(o.phone, waMsg)) + '">' + esc(t('waCust')) + '</a></div>' +
      '<div class="od-i"><h3>' + esc(t('items')) + '</h3><table class="lines">' + o.items.map(l => '<tr><td>' + esc(nm(P(l.id))) + ' <small>' + esc(t('size')) + ' ' + esc(l.size) + '</small></td><td>× ' + l.q + '</td><td class="r">' + esc(num(l.p * l.q)) + '</td></tr>').join('') +
      '<tr class="s"><td colspan="2">' + esc(t('delivery')) + '</td><td class="r">' + esc(num(o.fee)) + '</td></tr>' + (o.disc ? '<tr class="s"><td colspan="2">' + esc(t('discount')) + '</td><td class="r">− ' + esc(num(o.disc)) + '</td></tr>' : '') +
      '<tr class="g"><td colspan="2">' + esc(o.pay === 'cod' ? t('toCollect') : t('total')) + '</td><td class="r">' + esc(money(totOf(o))) + '</td></tr></table>' +
      '<div class="payrow">' + payChip(o) + (o.pay === 'bank' && !['cancelled'].includes(o.status) ? '<label class="chk"><input type="checkbox" id="oPaid"' + (o.paid ? ' checked' : '') + '> ' + esc(t('slip')) + '</label>' : '') + '</div></div></div>' +
      courierBox + (o.status === 'returned' ? '<p class="retr">' + esc(t('reason')) + ': <b>' + esc(t('reasons')[o.reason] || '') + '</b></p>' : '') + '</div>' +
      '<div class="sh-foot">' + acts + '</div>', 'wide');
    const pc = $('#oPaid'); if (pc) pc.addEventListener('change', () => { o.paid = pc.checked; save(); renderPage(); });
    const oc = $('#oCourier'); if (oc) oc.addEventListener('change', () => { o.courier = oc.value || null; if (o.courier && o.track && !o.track.startsWith(C(o.courier).pre)) o.track = ''; save(); openOrder(no); });
    const ot = $('#oTrack'); if (ot) ot.addEventListener('change', () => { o.track = ot.value.trim().toUpperCase(); save(); });
  }
  function moveTo(o, s) {
    if (s === 'packed') {
      for (const l of o.items) if (st(l.id, l.size) < l.q) { toast(t('noStock', { p: nm(P(l.id)) + ' ' + l.size })); return; }
      o.items.forEach(l => { S.stock[l.id + ':' + l.size] -= l.q; });
    }
    if (s === 'shipped') {
      if (!o.courier) { toast(t('needTrack')); return; }
      if (!o.track) o.track = C(o.courier).pre + String(10000000 + Math.floor(Math.random() * 89999999));
    }
    if (s === 'delivered' && o.pay === 'bank') o.paid = true;
    o.status = s; o.hist.push({ s, t: Date.now() }); save();
    toast(t('moved', { n: o.no, s: t(s) })); renderPage(); counts(); openOrder(o.no);
  }
  function waybillHtml(o) {
    const n = o.items.reduce((s, l) => s + l.q, 0);
    return '<div class="wb"><div class="wb-top"><b>' + esc(o.courier ? C(o.courier).name : '—') + '</b><span class="mono">' + esc(o.no) + '</span></div>' +
      '<div class="wb-track mono">' + esc(o.track || '—') + '</div>' +
      '<div class="wb-to"><small>' + esc(t('to')) + '</small><b>' + esc(o.name) + '</b><span>' + esc(o.address) + '</span><span>' + esc(o.town) + ', ' + esc(o.district) + '</span><span class="mono">' + esc(o.phone) + '</span></div>' +
      '<div class="wb-cod">' + (o.pay === 'cod' ? '<small>COD</small><b>' + esc(money(totOf(o))) + '</b>' : '<small>' + esc(t('paid')) + '</small><b>Rs. 0</b>') + '</div>' +
      '<div class="wb-from"><small>' + esc(t('from')) + '</small><span>' + esc(D.shop.from) + ' · ' + esc(D.shop.phone) + '</span></div>' +
      '<div class="wb-meta"><span>' + esc(t('pieces')) + ': ' + n + '</span><span>' + esc(fmtDate(Date.now())) + '</span></div></div>';
  }

  // new order
  function openNew() {
    U.nf = { src: 'fb', name: '', phone: '', address: '', district: 'Colombo', town: '', note: '', items: [], pid: D.products[0].id, size: D.products[0].sizes[0], q: 1, fee: '', disc: '', pay: 'cod', conf: true };
    renderNew();
  }
  function renderNew() {
    const f = U.nf, p = D.products.find(x => x.id === f.pid);
    const past = f.phone.replace(/\D/g, '').length === 10 ? S.orders.filter(o => o.phone === f.phone.replace(/\D/g, '')) : [];
    const it = f.items.reduce((s, l) => s + l.p * l.q, 0), fee = f.fee === '' ? feeOf(f.district) : +f.fee || 0, disc = +f.disc || 0;
    openModal(shHead(esc(t('newOrder'))) + '<div class="sh-body nf">' +
      '<h3>' + esc(t('source')) + '</h3><div class="seg">' + ['fb', 'wa', 'ig', 'shop'].map(s => '<button class="' + (f.src === s ? 'on' : '') + '" data-act="nfsrc" data-id="' + s + '">' + esc(t(s)) + '</button>').join('') + '</div>' +
      '<div class="f2"><label><span>' + esc(t('phone')) + '</span><input id="nfPhone" class="mono" inputmode="tel" maxlength="12" value="' + esc(f.phone) + '" placeholder="07X XXX XXXX"></label><label><span>' + esc(t('name')) + '</span><input data-nf="name" value="' + esc(f.name) + '"></label>' +
      (past.length ? '<p class="known">' + esc(t('known', { n: past.length })) + '</p>' : '') +
      '<label class="w"><span>' + esc(t('address')) + '</span><input data-nf="address" value="' + esc(f.address) + '"></label>' +
      '<label><span>' + esc(t('district')) + '</span><select id="nfDist">' + D.districts.map(d => '<option' + (d[0] === f.district ? ' selected' : '') + '>' + d[0] + '</option>').join('') + '</select></label>' +
      '<label><span>' + esc(t('town')) + '</span><input data-nf="town" list="nfTowns" value="' + esc(f.town) + '"><datalist id="nfTowns">' + (D.towns[f.district] || []).map(x => '<option value="' + esc(x) + '">').join('') + '</datalist></label></div>' +
      '<h3>' + esc(t('items')) + '</h3><div class="additem"><select id="nfP">' + D.products.map(x => '<option value="' + x.id + '"' + (x.id === f.pid ? ' selected' : '') + '>' + esc(nm(x)) + ' – ' + num(x.price) + '</option>').join('') + '</select>' +
      '<select id="nfS">' + p.sizes.map(z => '<option' + (z === f.size ? ' selected' : '') + '>' + esc(z) + '</option>').join('') + '</select><input id="nfQ" inputmode="numeric" value="' + f.q + '"><button class="btn" data-act="nfadd">' + esc(t('add')) + '</button></div>' +
      '<p class="stkline">' + esc(t('stockH')) + ': ' + p.sizes.map(z => esc(z) + ' <b class="' + (st(p.id, z) <= 0 ? 'o' : st(p.id, z) <= 2 ? 'l' : '') + '">' + st(p.id, z) + '</b>').join(' · ') + '</p>' +
      '<table class="lines">' + f.items.map((l, i) => '<tr><td>' + esc(nm(P(l.id))) + ' <small>' + esc(l.size) + '</small></td><td>× ' + l.q + '</td><td class="r">' + esc(num(l.p * l.q)) + '</td><td><button class="x" data-act="nfdel" data-id="' + i + '">×</button></td></tr>').join('') + '</table>' +
      '<div class="f3"><label><span>' + esc(t('delivery')) + '</span><input id="nfFee" inputmode="numeric" value="' + fee + '"></label><label><span>' + esc(t('discount')) + '</span><input data-nf="disc" inputmode="numeric" value="' + esc(f.disc) + '" placeholder="0"></label>' +
      '<label><span>' + esc(t('pay')) + '</span><span class="seg">' + ['cod', 'bank'].map(x => '<button class="' + (f.pay === x ? 'on' : '') + '" data-act="nfpay" data-id="' + x + '">' + esc(t(x)) + '</button>').join('') + '</span></label></div>' +
      '<label class="w"><span>' + esc(t('note')) + '</span><input data-nf="note" value="' + esc(f.note) + '"></label>' +
      '<label class="chk"><input type="checkbox" id="nfConf"' + (f.conf ? ' checked' : '') + '> ' + esc(t('alsoConfirm')) + '</label></div>' +
      '<div class="sh-foot"><div class="sf-l"><small>' + esc(t('total')) + '</small><b>' + esc(money(it + fee - disc)) + '</b></div><button class="btn lime big" data-act="nfsave">' + esc(t('save')) + '</button></div>', 'wide');
    $$('[data-nf]').forEach(el => el.addEventListener('input', () => { f[el.dataset.nf] = el.value; }));
    $('#nfPhone').addEventListener('input', e => {
      f.phone = e.target.value; const d = f.phone.replace(/\D/g, '');
      if (d.length === 10) { const prev = S.orders.slice().reverse().find(o => o.phone === d); if (prev && !f.name) Object.assign(f, { name: prev.name, address: prev.address, district: prev.district, town: prev.town }); renderNew(); }
    });
    $('#nfDist').addEventListener('change', e => { f.district = e.target.value; f.town = ''; f.fee = ''; renderNew(); });
    $('#nfP').addEventListener('change', e => { f.pid = e.target.value; f.size = P(f.pid).sizes[0]; renderNew(); });
    $('#nfS').addEventListener('change', e => { f.size = e.target.value; });
    $('#nfQ').addEventListener('input', e => { f.q = Math.max(1, +e.target.value || 1); });
    $('#nfFee').addEventListener('change', e => { f.fee = e.target.value; renderNew(); });
    $('#nfConf').addEventListener('change', e => { f.conf = e.target.checked; });
  }
  function saveNew() {
    const f = U.nf, ph = f.phone.replace(/\D/g, '');
    if (!f.name.trim() || ph.length !== 10 || !f.address.trim() || !f.items.length) { toast(t('needAll')); return; }
    const now = Date.now();
    const o = { no: 'NC' + (S.no++), t: now, src: f.src, name: f.name.trim(), phone: ph, address: f.address.trim(), town: f.town.trim() || (D.towns[f.district] || [''])[0], district: f.district, note: f.note.trim(),
      items: f.items.map(l => Object.assign({}, l)), fee: f.fee === '' ? feeOf(f.district) : +f.fee || 0, disc: +f.disc || 0, pay: f.pay, paid: false, status: f.conf ? 'confirmed' : 'new',
      hist: [{ s: 'new', t: now }].concat(f.conf ? [{ s: 'confirmed', t: now }] : []), courier: null, track: '', remit: false, reason: '' };
    S.orders.push(o); save(); closeModal(); toast(t('saved', { n: o.no })); U.view = 'pipe'; go('orders'); counts();
  }

  // ---------- COD & payments ----------
  function renderCod() {
    const now = Date.now();
    const withRider = S.orders.filter(o => o.pay === 'cod' && o.status === 'shipped');
    const owed = S.orders.filter(o => o.pay === 'cod' && o.status === 'delivered' && !o.remit);
    const remitted = S.orders.filter(o => o.pay === 'cod' && o.remit && o.hist[o.hist.length - 1].t > now - 30 * DAY);
    const bankWait = S.orders.filter(o => o.pay === 'bank' && !o.paid && !['cancelled', 'returned'].includes(o.status));
    const sum = a => a.reduce((s, o) => s + totOf(o), 0);
    const byC = D.couriers.map(c => { const mine = owed.filter(o => o.courier === c.id); const rid = withRider.filter(o => o.courier === c.id); return { c, mine, rid }; });
    $('#pg-cod').innerHTML = '<div class="kpis"><div><span>' + esc(t('codPending')) + '</span><b>' + esc(money(sum(withRider))) + '</b><small>' + withRider.length + ' ' + esc(t('orders')) + '</small></div>' +
      '<div class="hi"><span>' + esc(t('codOwed')) + '</span><b>' + esc(money(sum(owed))) + '</b><small>' + owed.length + ' ' + esc(t('orders')) + '</small></div>' +
      '<div><span>' + esc(t('codRemitted')) + '</span><b>' + esc(money(sum(remitted))) + '</b><small>' + remitted.length + ' ' + esc(t('orders')) + '</small></div>' +
      '<div><span>' + esc(t('bankWaiting')) + '</span><b>' + esc(money(sum(bankWait))) + '</b><small>' + bankWait.length + ' ' + esc(t('orders')) + '</small></div></div>' +
      '<div class="cod-grid">' + byC.map(x => '<section class="panel"><div class="ph"><h2>' + esc(x.c.name) + '</h2><span class="mono">' + esc(x.c.pre) + '</span></div>' +
        '<div class="cn"><div><small>' + esc(t('codOwed')) + '</small><b>' + esc(money(sum(x.mine))) + '</b><span>' + x.mine.length + ' ' + esc(t('orders')) + '</span></div><div><small>' + esc(t('codPending')) + '</small><b>' + esc(money(sum(x.rid))) + '</b><span>' + x.rid.length + ' ' + esc(t('orders')) + '</span></div></div>' +
        '<ul class="ol">' + x.mine.slice(0, 6).map(o => '<li data-act="open" data-id="' + o.no + '"><span class="mono">' + esc(o.track) + '</span><span>' + esc(o.name) + '</span><b>' + esc(num(totOf(o))) + '</b></li>').join('') + (x.mine.length > 6 ? '<li class="more">+' + (x.mine.length - 6) + '</li>' : '') + '</ul>' +
        '<button class="btn lime full" data-act="remit" data-id="' + x.c.id + '"' + (x.mine.length ? '' : ' disabled') + '>' + esc(t('remit')) + ' · ' + esc(money(sum(x.mine))) + '</button></section>').join('') +
      '<section class="panel"><div class="ph"><h2>' + esc(t('bankWaiting')) + '</h2></div><ul class="ol">' + (bankWait.map(o => '<li><span class="mono" data-act="open" data-id="' + o.no + '">' + o.no + '</span><span>' + esc(o.name) + '</span><b>' + esc(num(totOf(o))) + '</b><button class="btn sm" data-act="markpaid" data-id="' + o.no + '">' + esc(t('markPaid')) + '</button></li>').join('') || '<li class="empty">' + esc(t('empty')) + '</li>') + '</ul></section></div>';
  }

  // ---------- stock ----------
  function renderStock() {
    const from = Date.now() - 30 * DAY, sold = {};
    S.orders.forEach(o => { if (o.t < from || ['cancelled', 'returned'].includes(o.status)) return; o.items.forEach(l => { sold[l.id] = (sold[l.id] || 0) + l.q; }); });
    $('#pg-stock').innerHTML = '<div class="pg-head"><h1>' + esc(t('stockH')) + '</h1></div><div class="panel flush"><table class="tbl stk">' +
      '<thead><tr><th>' + esc(t('product')) + '</th><th>' + esc(t('size')) + '</th><th class="r">' + esc(t('cost')) + '</th><th class="r">' + esc(t('price')) + '</th><th class="r">' + esc(t('sold30')) + '</th></tr></thead><tbody>' +
      D.products.map(p => '<tr><td><span class="thumb"><img src="img/' + p.id + '.jpg" alt="" onerror="this.remove()"></span><b>' + esc(nm(p)) + '</b><small>' + esc(U.lang === 'si' ? p.colour_si : p.colour_en) + '</small></td>' +
        '<td><div class="sz">' + p.sizes.map(z => { const v = st(p.id, z); return '<span class="' + (v <= 0 ? 'o' : v <= 2 ? 'l' : '') + '"><em>' + esc(z) + '</em><button data-act="sdec" data-id="' + p.id + '" data-z="' + esc(z) + '">−</button><b class="mono">' + v + '</b><button data-act="sinc" data-id="' + p.id + '" data-z="' + esc(z) + '">+</button></span>'; }).join('') + '</div></td>' +
        '<td class="r mono">' + num(p.cost) + '</td><td class="r mono">' + num(p.price) + '</td><td class="r mono">' + (sold[p.id] || 0) + '</td></tr>').join('') + '</tbody></table></div>';
  }

  // ---------- profit ----------
  function renderProfit() {
    const nd = U.rp === 'd7' ? 7 : 30, d0 = dayStart(Date.now()), from = d0 - (nd - 1) * DAY;
    const list = S.orders.filter(o => o.t >= from);
    const del = list.filter(o => o.status === 'delivered'), ret = list.filter(o => o.status === 'returned');
    const sales = del.reduce((s, o) => s + itemsTot(o) - o.disc, 0), feeIn = del.reduce((s, o) => s + o.fee, 0);
    const goods = del.reduce((s, o) => s + o.items.reduce((x, l) => x + P(l.id).cost * l.q, 0), 0);
    const cour = del.concat(ret).reduce((s, o) => s + (o.courier ? C(o.courier).fee : 0), 0);
    const retLoss = ret.length * D.returnFee;
    const profit = sales + feeIn - goods - cour - retLoss;
    const finished = del.length + ret.length;
    const days = Array.from({ length: nd }, (_, i) => from + i * DAY), dv = days.map(d => S.orders.filter(o => o.t >= d && o.t < d + DAY).length), mx = Math.max(1, ...dv);
    const srcs = ['fb', 'wa', 'ig', 'shop'].map(s => ({ s, n: list.filter(o => o.src === s).length })), smx = Math.max(1, ...srcs.map(x => x.n));
    const cs = D.couriers.map(c => { const d = del.filter(o => o.courier === c.id), r = ret.filter(o => o.courier === c.id); const days2 = d.map(o => { const a = o.hist.find(h => h.s === 'shipped'), b = o.hist.find(h => h.s === 'delivered'); return a && b ? (b.t - a.t) / DAY : 0; }); return { c, d: d.length, r: r.length, avg: days2.length ? days2.reduce((x, y) => x + y, 0) / days2.length : 0 }; });
    const top = {}; del.forEach(o => o.items.forEach(l => { top[l.id] = (top[l.id] || 0) + l.q; }));
    const tops = Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const costRows = [[t('sales'), sales, ''], [t('feeIn'), feeIn, ''], [t('goodsCost'), -goods, 'neg'], [t('courierCost'), -cour, 'neg'], [t('returnCost'), -retLoss, 'neg']];
    $('#pg-profit').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_profit')) + '</h1><span class="seg">' + ['d7', 'd30'].map(x => '<button class="' + (U.rp === x ? 'on' : '') + '" data-act="rp" data-id="' + x + '">' + esc(t(x)) + '</button>').join('') + '</span></div>' +
      '<div class="kpis"><div><span>' + esc(t('ordersN')) + '</span><b>' + list.length + '</b></div><div><span>' + esc(t('sales')) + '</span><b>' + esc(money(sales)) + '</b></div><div class="hi"><span>' + esc(t('profit')) + '</span><b>' + esc(money(profit)) + '</b></div><div><span>' + esc(t('retRate')) + '</span><b>' + (finished ? (ret.length / finished * 100).toFixed(1) : 0) + '%</b></div></div>' +
      '<div class="pf-grid"><section class="panel"><h2>' + esc(t('perDay')) + '</h2><div class="bars n' + nd + '">' + days.map((d, i) => '<div class="bar' + (i === nd - 1 ? ' now' : '') + '" title="' + fmtDate(d) + ' · ' + dv[i] + '"><em>' + (nd === 7 ? dv[i] : '') + '</em><i style="height:' + (dv[i] / mx * 100) + '%"></i><span>' + esc(nd === 7 ? t('dshort')[new Date(d).getDay()] : (new Date(d).getDate() % 5 === 0 ? new Date(d).getDate() : '')) + '</span></div>').join('') + '</div></section>' +
      '<section class="panel"><h2>' + esc(t('costsH')) + '</h2><table class="money">' + costRows.map(r => '<tr class="' + r[2] + '"><td>' + esc(r[0]) + '</td><td class="r mono">' + (r[1] < 0 ? '− ' : '') + esc(num(Math.abs(r[1]))) + '</td></tr>').join('') + '<tr class="g"><td>' + esc(t('profit')) + '</td><td class="r mono">' + esc(money(profit)) + '</td></tr></table></section>' +
      '<section class="panel"><h2>' + esc(t('bySource')) + '</h2>' + srcs.map(x => '<div class="hb"><span>' + srcChip(x.s) + '</span><i><s style="width:' + (x.n / smx * 100) + '%"></s></i><b class="mono">' + x.n + '</b></div>').join('') +
      '<h2 class="mt">' + esc(t('topItems')) + '</h2><ol class="tops">' + tops.map(([id, n]) => '<li><span class="thumb sm"><img src="img/' + id + '.jpg" alt="" onerror="this.remove()"></span><span>' + esc(nm(P(id))) + '</span><b class="mono">' + n + '</b></li>').join('') + '</ol></section>' +
      '<section class="panel"><h2>' + esc(t('byCourier')) + '</h2><table class="tbl cour">' + cs.map(x => '<tr><td><b>' + esc(x.c.name) + '</b><small>Rs. ' + x.c.fee + '</small></td><td class="r mono">' + x.d + ' ' + esc(t('delRate')) + '</td><td class="r mono">' + ((x.d + x.r) ? Math.round(x.d / (x.d + x.r) * 100) : 0) + '%</td><td class="r mono">' + x.avg.toFixed(1) + ' ' + esc(t('avgDays')) + '</td></tr>').join('') + '</table></section></div>' +
      '<p class="reset"><button class="btn sm" data-act="reset">' + esc(t('settingsReset')) + '</button></p>';
  }

  // ---------- events ----------
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) { if (e.target.id === 'modal') closeModal(); return; }
    const a = el.dataset.act, id = el.dataset.id, o = U.no ? order(U.no) : null;
    switch (a) {
      case 'nav': go(id); break;
      case 'lang': U.lang = U.lang === 'si' ? 'en' : 'si'; applyLang(); if (U.no) openOrder(U.no); else if (U.nf) renderNew(); break;
      case 'close': closeModal(); break;
      case 'view': U.view = id; renderOrders(); break;
      case 'src': U.src = id; renderOrders(); break;
      case 'open': openOrder(id); break;
      case 'to': moveTo(o, id); break;
      case 'cancel': o.status = 'cancelled'; o.hist.push({ s: 'cancelled', t: Date.now() }); if (o.hist.some(h => h.s === 'packed')) o.items.forEach(l => { S.stock[l.id + ':' + l.size] += l.q; }); save(); toast(t('moved', { n: o.no, s: t('cancelled') })); renderPage(); counts(); openOrder(o.no); break;
      case 'ret': o.reason = +$('#retR').value; o.status = 'returned'; o.hist.push({ s: 'returned', t: Date.now() }); o.items.forEach(l => { S.stock[l.id + ':' + l.size] += l.q; }); save(); toast(t('restocked')); renderPage(); openOrder(o.no); break;
      case 'gen': { const c = $('#oCourier').value; if (!c) { toast(t('needTrack')); break; } o.courier = c; o.track = C(c).pre + String(10000000 + Math.floor(Math.random() * 89999999)); save(); openOrder(o.no); break; }
      case 'waybill': $('#print').innerHTML = waybillHtml(o); window.print(); break;
      case 'neworder': openNew(); break;
      case 'nfsrc': U.nf.src = id; renderNew(); break;
      case 'nfpay': U.nf.pay = id; renderNew(); break;
      case 'nfadd': { const f = U.nf, p = P(f.pid), size = $('#nfS').value, q = Math.max(1, +$('#nfQ').value || 1); const ex = f.items.find(l => l.id === p.id && l.size === size); if (ex) ex.q += q; else f.items.push({ id: p.id, size, q, p: p.price }); renderNew(); break; }
      case 'nfdel': U.nf.items.splice(+id, 1); renderNew(); break;
      case 'nfsave': saveNew(); break;
      case 'remit': { const list = S.orders.filter(x => x.pay === 'cod' && x.status === 'delivered' && !x.remit && x.courier === id); const amt = list.reduce((s, x) => s + totOf(x), 0); list.forEach(x => { x.remit = true; x.paid = true; }); save(); toast(t('remitDone', { c: C(id).name, a: money(amt) })); renderCod(); break; }
      case 'markpaid': { const x = order(id); x.paid = true; save(); toast(t('paidDone')); renderCod(); break; }
      case 'sinc': case 'sdec': { const k = id + ':' + el.dataset.z; S.stock[k] = Math.max(0, (S.stock[k] || 0) + (a === 'sinc' ? 1 : -1)); save(); renderStock(); break; }
      case 'rp': U.rp = id; renderProfit(); break;
      case 'reset': try { localStorage.removeItem(KEY); } catch (er) { /* ignore */ } S = makeDemo(new Date()); save(); toast(t('resetDone')); renderPage(); counts(); break;
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
  window.addEventListener('afterprint', () => { $('#print').innerHTML = ''; });
  window.addEventListener('focus', () => { const before = S.orders.length; importInbox(); if (S.orders.length !== before) { renderPage(); counts(); } });
  window.addEventListener('storage', e => { if (e.key === INBOX) { importInbox(); renderPage(); counts(); } });

  importInbox();
  go(U.page);
  applyLang();
})();
