// Samsoft Fancy shop demo ("Tikiri Fancy & Gifts"): variant billing, gift wrap + hampers, loyalty points, retail/wholesale, stock by variant.
(function () {
  'use strict';
  const D = window.FANCY;
  const WA_NUMBER = '94704808744';
  const KEY = 'samsoft-fancy-demo-v1';
  const MIN = 60000, DAY = 86400000;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const T = {
    en: {
      demoMsg: 'Demo: Samsoft software for a fancy & gift shop. We set it up for your shop.', demoCta: 'Get it for my shop',
      waWelcome: 'Hello Samsoft, I tried the fancy shop demo. I would like to know about software for my shop.',
      shopSub: D.shop.sub_en, nav_sell: 'Sell', nav_hamper: 'Hampers', nav_stock: 'Stock', nav_loyal: 'Loyalty', nav_reports: 'Reports',
      all: 'All', search: 'Search items', retail: 'Retail', whole: 'Wholesale', wholeFrom: 'wholesale from {n}', below: 'min {n} for wholesale',
      cart: 'Bill', empty: 'Tap an item to add it.', customer: 'Loyalty customer', phoneHint: 'Phone number', points: 'points', redeem: 'Use points',
      wrap: 'Gift wrap', addWrap: '+ Gift wrap', giftMsg: 'Gift message', subtotal: 'Subtotal', discount: 'Discount', pointsUsed: 'Points used',
      total: 'Total', earn: 'Earns {n} points', cash: 'Cash', card: 'Card', qr: 'LankaQR', pay: 'Pay', clear: 'Clear', newCust: 'Add as new member',
      name: 'Name', variants: 'variants', inStock: 'in stock', out: 'Out', low: 'Low', add: 'Add to bill', qty: 'Qty', stock: 'Stock',
      added: 'Added', noStock: 'Only {n} in stock', billSaved: 'Bill {n} saved', receipt: 'Receipt', print: 'Print', sendWa: 'Send on WhatsApp', done: 'Done',
      close: 'Close', hamperLine: 'Hamper', items: 'items',
      presets: 'Ready hampers', builder: 'Build a hamper', base: 'Base', hItems: 'Items inside', pickItems: 'Add items', hName: 'Hamper name',
      itemsCost: 'Items', basePrice: 'Base + cellophane', suggested: 'Suggested price', finalPrice: 'Selling price', toSale: 'Add to bill', savePreset: 'Save as ready hamper',
      presetSaved: 'Saved as a ready hamper', toSaleDone: 'Hamper added to the bill', needItems: 'Add at least one item', load: 'Load', short: 'not enough stock',
      stockTitle: 'Stock by variant', lowOnly: 'Low', outOnly: 'Out', grn: 'Receive stock', addQty: 'Add quantity', reorder: 'Alert when at or below',
      saveStock: 'Save', stockSaved: 'Stock updated', prices: 'Prices', retailP: 'Retail price', wholeP: 'Wholesale price', minQ: 'Wholesale min qty',
      loyalTitle: 'Loyalty members', member: 'Member', visits: 'visits', lastVisit: 'Last visit', spent: 'Spent', tier: 'Tier', since: 'Member since',
      silver: 'Silver', gold: 'Gold', platinum: 'Platinum', sendPts: 'Send points on WhatsApp', history: 'History', earned: 'earned', used: 'used', noMatch: 'No members match.',
      ptsMsg: 'Hi {name}! You have {p} points at Tikiri Fancy & Gifts, Kurunegala (= Rs. {p} off your next bill). See you soon!',
      sales: 'Sales', bills: 'Bills', wholeSales: 'Wholesale', wrapIncome: 'Gift wrap & hampers', ptsRedeemed: 'Points used', today: 'Today', d7: '7 days', d30: '30 days',
      byDay: 'Sales by day', byCat: 'By category', topVar: 'Best-selling variants', lowList: 'Low stock right now', sold: 'sold', viewStock: 'Open stock',
      settings: 'Settings', language: 'Language', demoData: 'Demo data', resetTxt: 'Erase your changes and load fresh demo data.', reset: 'Restart the demo', resetDone: 'Fresh demo data loaded',
      talk: 'Want this for your shop? We load your items, variants and prices.',
      am: 'AM', pm: 'PM', dshort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], walkin: 'Walk-in', viewCart: 'View bill', pickM: 'Pick a member to see points and history.'
    },
    si: {
      demoMsg: 'Demo: ෆැන්සි / තෑගි කඩයකට Samsoft software. ඔබේ කඩයට ගැලපෙන්න හදලා දෙනවා.', demoCta: 'මගේ කඩේටත් ඕනේ',
      waWelcome: 'ආයුබෝවන් Samsoft, මම fancy shop demo එක බැලුවා. මගේ කඩයටත් software එකක් ගැන දැනගන්න ඕනේ.',
      shopSub: D.shop.sub_si, nav_sell: 'විකුණන්න', nav_hamper: 'Hampers', nav_stock: 'Stock', nav_loyal: 'Loyalty', nav_reports: 'වාර්තා',
      all: 'සියල්ල', search: 'භාණ්ඩ සොයන්න', retail: 'සිල්ලර', whole: 'තොග', wholeFrom: '{n}ක සිට තොග මිල', below: 'තොග මිලට අවම {n}ක්',
      cart: 'බිල', empty: 'එකතු කරන්න භාණ්ඩයක් ඔබන්න.', customer: 'Loyalty පාරිභෝගිකයා', phoneHint: 'දුරකථන අංකය', points: 'ලකුණු', redeem: 'ලකුණු පාවිච්චි කරන්න',
      wrap: 'තෑගි ඔතන', addWrap: '+ තෑගි ඔතන', giftMsg: 'තෑගි පණිවිඩය', subtotal: 'එකතුව', discount: 'වට්ටම', pointsUsed: 'පාවිච්චි කළ ලකුණු',
      total: 'මුළු මුදල', earn: 'ලකුණු {n}ක් ලැබෙනවා', cash: 'මුදල්', card: 'කාඩ්', qr: 'LankaQR', pay: 'ගෙවන්න', clear: 'මකන්න', newCust: 'අලුත් සාමාජිකයෙක් ලෙස',
      name: 'නම', variants: 'වර්ග', inStock: 'stock ඇත', out: 'නෑ', low: 'අඩුයි', add: 'බිලට එකතු කරන්න', qty: 'ගණන', stock: 'Stock',
      added: 'එකතු කළා', noStock: 'Stock {n}ක් පමණයි', billSaved: 'බිල {n} save කළා', receipt: 'බිල්පත', print: 'Print', sendWa: 'WhatsApp යවන්න', done: 'හරි',
      close: 'වසන්න', hamperLine: 'Hamper', items: 'අයිතම',
      presets: 'සූදානම් hampers', builder: 'Hamper එකක් හදන්න', base: 'පාදම', hItems: 'ඇතුළේ තියෙන දේ', pickItems: 'භාණ්ඩ එකතු කරන්න', hName: 'Hamper නම',
      itemsCost: 'භාණ්ඩ', basePrice: 'පාදම + cellophane', suggested: 'යෝජිත මිල', finalPrice: 'විකුණුම් මිල', toSale: 'බිලට එකතු', savePreset: 'සූදානම් hamper ලෙස save',
      presetSaved: 'සූදානම් hamper එකක් ලෙස save කළා', toSaleDone: 'Hamper එක බිලට එකතු කළා', needItems: 'අඩුම තරමේ එක භාණ්ඩයක් එකතු කරන්න', load: 'ගන්න', short: 'stock මදි',
      stockTitle: 'වර්ගය අනුව stock', lowOnly: 'අඩු', outOnly: 'නැති', grn: 'Stock ලැබීම', addQty: 'එකතු කරන ගණන', reorder: 'මෙතනට අඩු වුණාම දැනුම් දෙන්න',
      saveStock: 'Save', stockSaved: 'Stock යාවත්කාලීන කළා', prices: 'මිල', retailP: 'සිල්ලර මිල', wholeP: 'තොග මිල', minQ: 'තොග මිලට අවම ගණන',
      loyalTitle: 'Loyalty සාමාජිකයෝ', member: 'සාමාජික', visits: 'වතාවක්', lastVisit: 'අවසන් පැමිණීම', spent: 'වියදම', tier: 'මට්ටම', since: 'සාමාජික වූයේ',
      silver: 'Silver', gold: 'Gold', platinum: 'Platinum', sendPts: 'ලකුණු WhatsApp කරන්න', history: 'ඉතිහාසය', earned: 'ලැබුණා', used: 'පාවිච්චි', noMatch: 'ගැලපෙන කවුරුත් නෑ.',
      ptsMsg: 'ආයුබෝවන් {name}! Tikiri Fancy & Gifts කුරුණෑගලෙහි ඔබට ලකුණු {p}ක් තියෙනවා (ඊළඟ බිලෙන් රු. {p}ක් අඩු වෙනවා). ඉක්මනින් එන්න!',
      sales: 'විකුණුම්', bills: 'බිල්පත්', wholeSales: 'තොග විකුණුම්', wrapIncome: 'තෑගි ඔතන සහ hampers', ptsRedeemed: 'පාවිච්චි කළ ලකුණු', today: 'අද', d7: 'දින 7', d30: 'දින 30',
      byDay: 'දිනෙන් දිනට විකුණුම්', byCat: 'කාණ්ඩ අනුව', topVar: 'වැඩියෙන්ම විකුණුණු වර්ග', lowList: 'දැන් stock අඩු', sold: 'විකුණුණා', viewStock: 'Stock බලන්න',
      settings: 'සැකසුම්', language: 'භාෂාව', demoData: 'Demo දත්ත', resetTxt: 'ඔබ කළ වෙනස්කම් මකා, මුල් demo දත්ත නැවත ලබාගන්න.', reset: 'Demo එක මුල ඉඳන්', resetDone: 'අලුත් demo දත්ත ආවා',
      talk: 'ඔබේ කඩයටත් ඕනෙද? ඔබේ භාණ්ඩ, වර්ග සහ මිල ගණන් දාලා දෙනවා.',
      am: 'පෙ.ව.', pm: 'ප.ව.', dshort: ['ඉරි', 'සඳු', 'අඟ', 'බදා', 'බ්‍රහ', 'සිකු', 'සෙන'], walkin: 'Walk-in', viewCart: 'බිල බලන්න', pickM: 'ලකුණු සහ ඉතිහාසය බලන්න සාමාජිකයෙක් තෝරන්න.'
    }
  };

  // ---------- helpers ----------
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const dayStart = ms => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const P = id => D.products.find(p => p.id === id);
  const V = (pid, vid) => P(pid).v.find(v => v[0] === vid);
  const vk = (pid, vid) => pid + ':' + vid;

  // ---------- demo data ----------
  function makeDemo(now) {
    const day0 = dayStart(now), nowT = now.getTime();
    const R = rng(Math.floor(day0 / DAY) * 6151 + 3);
    const pick = a => a[Math.floor(R() * a.length)];
    const stock = {}, reorder = {};
    D.products.forEach(p => p.v.forEach(v => {
      const r = R(); const ro = p.retail > 2000 ? 2 : p.whole < 300 ? 10 : 4;
      reorder[vk(p.id, v[0])] = ro;
      stock[vk(p.id, v[0])] = r < 0.05 ? 0 : r < 0.18 ? 1 + Math.floor(R() * ro) : ro + 2 + Math.floor(R() * (ro * 5));
    }));
    const prices = Object.fromEntries(D.products.map(p => [p.id, { retail: p.retail, whole: p.whole, wq: p.wq }]));
    const custs = [], used = new Set();
    for (let i = 0; i < 90; i++) {
      let name; do { name = pick(D.first) + ' ' + pick(D.last); } while (used.has(name)); used.add(name);
      custs.push({ id: 'm' + (i + 1), name, phone: '07' + pick(['0', '1', '2', '5', '6', '7', '8']) + String(1000000 + Math.floor(R() * 8999999)), pts: 0, since: day0 - (40 + Math.floor(R() * 600)) * DAY });
    }
    const bills = []; let no = 8800;
    const HW = [1, 3, 5, 6, 5, 4, 5, 6, 7, 8, 7, 5, 2];
    const hour = () => { let s = R() * HW.reduce((a, b) => a + b, 0); for (let i = 0; i < HW.length; i++) { s -= HW[i]; if (s <= 0) return 8 + i; } return 19; };
    const bulkP = D.products.filter(p => ['stat', 'party', 'cards', 'acc'].includes(p.cat));
    for (let d = 29; d >= 0; d--) {
      const ds = day0 - d * DAY, wd = new Date(ds).getDay();
      const n = (wd === 0 || wd === 6 ? 40 : 24) + Math.floor(R() * 12);
      const day = [];
      for (let i = 0; i < n; i++) {
        const t = ds + (hour() * 60 + Math.floor(R() * 60)) * MIN;
        const mode = R() < 0.05 ? 'whole' : 'retail';
        const lines = [];
        const nl = mode === 'whole' ? 1 + Math.floor(R() * 2) : 1 + Math.floor(R() * 2.4);
        for (let k = 0; k < nl; k++) {
          const p = mode === 'whole' ? pick(bulkP) : pick(D.products); const v = pick(p.v);
          const q = mode === 'whole' ? p.wq + Math.floor(R() * p.wq) : (R() < 0.2 ? 2 : 1);
          lines.push({ k: 'v', pid: p.id, vid: v[0], q, p: (mode === 'whole' ? p.whole : p.retail) + v[4] });
        }
        if (mode === 'retail' && R() < 0.18) { lines.push({ k: 'w', id: R() < 0.55 ? 'paper' : 'box', q: 1, p: 0 }); if (R() < 0.4) lines.push({ k: 'w', id: pick(['bow', 'msg']), q: 1, p: 0 }); }
        if (mode === 'retail' && R() < 0.03) { const pr = pick(D.presets); const price = presetPrice(pr, prices); lines.push({ k: 'h', name: [pr.en, pr.si], items: pr.items.map(x => x.slice()), base: pr.base, q: 1, p: price }); }
        lines.forEach(l => { if (l.k === 'w') l.p = D.wraps.find(w => w.id === l.id).price; });
        const sub = lines.reduce((s, l) => s + l.p * l.q, 0);
        const c = mode === 'retail' && R() < 0.36 ? pick(custs) : null;
        const r = R(), method = r < 0.68 ? 'cash' : r < 0.85 ? 'qr' : 'card';
        day.push({ t, mode, lines, sub, disc: 0, redeem: 0, cid: c ? c.id : null, method });
      }
      day.sort((a, b) => a.t - b.t).forEach(b => { if (b.t > nowT - 5 * MIN) return; b.no = 'T' + (no++); bills.push(b); });
    }
    // loyalty points: some members redeem, the rest accumulate
    const startPts = {}; custs.forEach(c => { startPts[c.id] = Math.floor(R() * 900); });
    const bal = Object.assign({}, startPts);
    bills.forEach(b => {
      if (!b.cid) { b.total = b.sub; b.earn = 0; return; }
      if (bal[b.cid] > 500 && R() < 0.25) { b.redeem = Math.min(bal[b.cid], Math.floor(b.sub / 2)); bal[b.cid] -= b.redeem; }
      b.total = b.sub - b.redeem; b.earn = Math.floor(b.total / 100); bal[b.cid] += b.earn;
    });
    custs.forEach(c => { c.pts = bal[c.id]; c.start = startPts[c.id]; });
    return { v: 1, made: day0, stock, reorder, prices, custs, bills, presets: [], no };
  }
  function presetPrice(pr, prices) {
    const base = D.bases.find(b => b.id === pr.base).price + 250;
    const items = pr.items.reduce((s, [pid, vid, q]) => s + ((prices ? prices[pid].retail : S.prices[pid].retail) + V(pid, vid)[4]) * q, 0);
    return Math.ceil((base + items) / 50) * 50;
  }
  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    if (!s || s.v !== 1 || s.made !== dayStart(Date.now())) s = makeDemo(new Date());
    return s;
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* demo works without storage */ } }
  save();

  // ---------- ui state ----------
  const qp = new URLSearchParams(location.search);
  const PAGES = ['sell', 'hamper', 'stock', 'loyal', 'reports'];
  const newCart = () => ({ mode: 'retail', lines: [], cid: null, phone: '', name: '', redeem: false, disc: '', method: 'cash', msg: '' });
  const U = {
    lang: qp.get('lang') === 'si' ? 'si' : 'en', page: PAGES.includes(qp.get('page')) ? qp.get('page') : 'sell',
    cat: 'all', q: '', cart: newCart(), sf: 'all', sq: '', lq: '', lsel: null, rp: 'd7', hb: { base: 'basket', items: [], name: '', price: '', iq: '' }
  };
  const t = (k, v) => { let s = T[U.lang][k] != null ? T[U.lang][k] : (T.en[k] != null ? T.en[k] : k); if (v) Object.keys(v).forEach(x => { s = String(s).split('{' + x + '}').join(v[x]); }); return s; };
  const nm = o => o ? (U.lang === 'si' ? o.si : o.en) : '';
  const vName = (pid, vid) => { const v = V(pid, vid); return v ? v[U.lang === 'si' ? 2 : 1] : vid; };
  const pvName = (pid, vid) => nm(P(pid)) + ' · ' + vName(pid, vid);
  const money = n => 'Rs. ' + Math.round(n).toLocaleString('en-US');
  const num = n => Math.round(n).toLocaleString('en-US');
  const cust = id => S.custs.find(c => c.id === id);
  const st = (pid, vid) => S.stock[vk(pid, vid)] || 0;
  const stState = (pid, vid) => { const s = st(pid, vid); return s <= 0 ? 'out' : s <= S.reorder[vk(pid, vid)] ? 'low' : 'ok'; };
  const unitPrice = (pid, vid, mode) => (mode === 'whole' ? S.prices[pid].whole : S.prices[pid].retail) + V(pid, vid)[4];
  const tierOf = c => { const sp = spentOf(c.id); return sp >= 40000 ? 'platinum' : sp >= 15000 ? 'gold' : 'silver'; };
  const spentOf = id => S.bills.reduce((s, b) => s + (b.cid === id ? b.total : 0), 0);
  function fmtTime(ms) { const d = new Date(ms); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0'); const ap = h < 12 ? t('am') : t('pm'); h = h % 12 || 12; return U.lang === 'si' ? ap + ' ' + h + '.' + m : h + ':' + m + ' ' + ap; }
  const fmtDate = ms => { const d = new Date(ms); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const waPhone = p => { const d = String(p || '').replace(/\D/g, ''); return d.length === 10 && d[0] === '0' ? '94' + d.slice(1) : d; };
  const waLink = (phone, text) => 'https://wa.me/' + waPhone(phone) + '?text=' + encodeURIComponent(text);
  function toast(msg) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; $('#toasts').appendChild(el); setTimeout(() => el.classList.add('out'), 2000); setTimeout(() => el.remove(), 2400); }
  const lowList = () => { const o = []; D.products.forEach(p => p.v.forEach(v => { const s = stState(p.id, v[0]); if (s !== 'ok') o.push({ p, v, s }); })); return o; };
  const sw = (col) => '<i class="sw" style="--sw:' + col + '"></i>';

  // ---------- shell ----------
  function applyLang() {
    const root = document.documentElement; root.setAttribute('data-lang', U.lang); root.setAttribute('lang', U.lang);
    $$('[data-t]').forEach(el => { el.textContent = t(el.getAttribute('data-t')); });
    $('#waCta').href = waLink(WA_NUMBER, t('waWelcome'));
    $('#homeLink').href = '../../website/business.html' + (U.lang === 'si' ? '?lang=si' : '');
    renderPage(); renderCounts();
  }
  function go(p) {
    U.page = p; document.body.dataset.page = p;
    $$('.page').forEach(x => x.classList.toggle('on', x.id === 'pg-' + p));
    $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.id === p));
    document.body.classList.remove('cart-open'); renderPage(); window.scrollTo(0, 0);
  }
  function renderPage() { ({ sell: renderSell, hamper: renderHamper, stock: renderStock, loyal: renderLoyal, reports: renderReports })[U.page](); }
  function renderCounts() { const n = lowList().length; const el = $('#lowCnt'); el.textContent = n || ''; el.hidden = !n; }
  function openModal(html, cls) { $('#sheet').className = 'sheet ' + (cls || ''); $('#sheet').innerHTML = html; $('#modal').hidden = false; document.body.classList.add('noscroll'); }
  function closeModal() { $('#modal').hidden = true; $('#sheet').innerHTML = ''; document.body.classList.remove('noscroll'); }
  const shHead = (title, sub) => '<div class="sh-head"><div><h2>' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div><button class="sh-x" data-act="close" aria-label="' + esc(t('close')) + '">×</button></div>';

  // ---------- sell ----------
  function lineUnit(l, mode) { return l.k === 'v' ? unitPrice(l.pid, l.vid, mode) : l.k === 'w' ? D.wraps.find(w => w.id === l.id).price : l.p; }
  function cartCalc() {
    const c = U.cart;
    const sub = c.lines.reduce((s, l) => s + lineUnit(l, c.mode) * l.q, 0);
    const disc = Math.min(sub, Math.max(0, +c.disc || 0));
    const m = c.cid ? cust(c.cid) : null;
    const redeem = m && c.redeem && c.mode === 'retail' ? Math.min(m.pts, sub - disc) : 0;
    const total = sub - disc - redeem;
    return { sub, disc, redeem, total, earn: m && c.mode === 'retail' ? Math.floor(total / 100) : 0 };
  }
  function renderSell() {
    const q = U.q.trim().toLowerCase();
    let list = D.products.filter(p => U.cat === 'all' || p.cat === U.cat);
    if (q) list = list.filter(p => (p.en + ' ' + p.si + ' ' + p.v.map(v => v[1] + ' ' + v[2]).join(' ')).toLowerCase().includes(q));
    const cats = '<button class="chip' + (U.cat === 'all' ? ' on' : '') + '" data-act="cat" data-id="all">' + esc(t('all')) + '</button>' +
      D.cats.map(c => '<button class="chip' + (U.cat === c.id ? ' on' : '') + '" style="--cc:' + c.col + '" data-act="cat" data-id="' + c.id + '"><i></i>' + esc(nm(c)) + '</button>').join('');
    const tiles = list.map(p => {
      const cat = D.cats.find(c => c.id === p.cat), tot = p.v.reduce((s, v) => s + st(p.id, v[0]), 0);
      const anyLow = p.v.some(v => stState(p.id, v[0]) !== 'ok');
      const pr = U.cart.mode === 'whole' ? S.prices[p.id].whole : S.prices[p.id].retail;
      return '<button class="prod" style="--cc:' + cat.col + '" data-act="prod" data-id="' + p.id + '"><span class="pr-top"><b>' + esc(nm(p)) + '</b></span>' +
        '<span class="pr-sw">' + p.v.map(v => '<i class="sw' + (st(p.id, v[0]) <= 0 ? ' x' : '') + '" style="--sw:' + v[3] + '"></i>').join('') + '<small>' + p.v.length + ' ' + esc(t('variants')) + '</small></span>' +
        '<span class="pr-bot"><b>' + esc(money(pr)) + (p.v.some(v => v[4]) ? '+' : '') + '</b>' + (anyLow ? '<small class="lo">' + p.v.filter(v => stState(p.id, v[0]) !== 'ok').length + ' ' + esc(t('low')) + '</small>' : '<small>' + tot + ' ' + esc(t('inStock')) + '</small>') + '</span></button>';
    }).join('');
    $('#pg-sell').innerHTML = '<div class="sell"><div class="catalog"><div class="cat-row"><label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="q" placeholder="' + esc(t('search')) + '" value="' + esc(U.q) + '"></label></div>' +
      '<div class="chips">' + cats + '</div><div class="grid">' + tiles + '</div></div><aside class="cart" id="cart"></aside></div>' +
      '<button class="cart-bar" data-act="opencart" id="cartBar"></button>';
    const inp = $('#q'); inp.addEventListener('input', () => { U.q = inp.value; const p = inp.selectionStart; renderSell(); const n = $('#q'); n.focus(); n.setSelectionRange(p, p); });
    renderCart();
  }
  function renderCart() {
    const c = U.cart, k = cartCalc(), m = c.cid ? cust(c.cid) : null;
    const lines = c.lines.map((l, i) => {
      let title, sub = '', warn = '';
      if (l.k === 'v') { const v = V(l.pid, l.vid); title = nm(P(l.pid)); sub = sw(v[3]) + esc(vName(l.pid, l.vid)); if (c.mode === 'whole' && l.q < S.prices[l.pid].wq) warn = t('below', { n: S.prices[l.pid].wq }); }
      else if (l.k === 'w') { title = nm(D.wraps.find(w => w.id === l.id)); sub = esc(t('wrap')); }
      else { title = nm({ en: l.name[0], si: l.name[1] }); sub = esc(t('hamperLine')) + ' · ' + l.items.length + ' ' + esc(t('items')); }
      return '<li class="ln-' + l.k + '"><div class="ln-m"><b>' + esc(title) + '</b><span>' + sub + (warn ? ' <em>' + esc(warn) + '</em>' : '') + '</span></div>' +
        '<span class="qty"><button data-act="lq" data-id="' + i + '" data-d="-1">−</button><b>' + l.q + '</b><button data-act="lq" data-id="' + i + '" data-d="1">+</button></span>' +
        '<span class="ln-a"><b>' + esc(num(lineUnit(l, c.mode) * l.q)) + '</b><small>@ ' + esc(num(lineUnit(l, c.mode))) + '</small></span></li>';
    }).join('');
    const custBox = m ? '<div class="mem"><div><b>' + esc(m.name) + '</b><span>' + esc(m.phone) + ' · <em class="tier t-' + tierOf(m) + '">' + esc(t(tierOf(m))) + '</em></span></div><div class="mem-p"><b>' + num(m.pts) + '</b><small>' + esc(t('points')) + '</small></div><button class="x" data-act="custclear">×</button>' +
      (c.mode === 'retail' && m.pts > 0 ? '<label class="use"><input type="checkbox" id="useP"' + (c.redeem ? ' checked' : '') + '> ' + esc(t('redeem')) + '</label>' : '') + '</div>'
      : '<div class="mem-in"><input id="cPhone" inputmode="tel" maxlength="12" placeholder="' + esc(t('customer')) + ' – ' + esc(t('phoneHint')) + '" value="' + esc(c.phone) + '"><div id="cSugg"></div></div>';
    $('#cart').innerHTML = '<div class="cart-h"><h2>' + esc(t('cart')) + '</h2><span class="seg mode"><button class="' + (c.mode === 'retail' ? 'on' : '') + '" data-act="mode" data-id="retail">' + esc(t('retail')) + '</button><button class="' + (c.mode === 'whole' ? 'on' : '') + '" data-act="mode" data-id="whole">' + esc(t('whole')) + '</button></span>' +
      '<button class="x" data-act="closecart" aria-label="close">×</button></div>' + (c.mode === 'retail' ? custBox : '') +
      '<ul class="lines">' + (lines || '<li class="empty">' + esc(t('empty')) + '</li>') + '</ul>' +
      '<div class="cart-f">' + (c.mode === 'retail' ? '<button class="btn ghost sm wrapbtn" data-act="wrap">' + esc(t('addWrap')) + '</button>' : '') + (c.msg ? '<p class="gmsg">“' + esc(c.msg) + '”</p>' : '') +
      '<div class="tot"><div><span>' + esc(t('subtotal')) + '</span><b>' + esc(num(k.sub)) + '</b></div>' +
      '<div><span>' + esc(t('discount')) + '</span><input id="cDisc" inputmode="numeric" placeholder="0" value="' + esc(c.disc) + '"></div>' +
      (k.redeem ? '<div><span>' + esc(t('pointsUsed')) + '</span><b>− ' + esc(num(k.redeem)) + '</b></div>' : '') +
      '<div class="g"><span>' + esc(t('total')) + '</span><b>' + esc(money(k.total)) + '</b></div>' + (k.earn ? '<p class="earn">★ ' + esc(t('earn', { n: k.earn })) + '</p>' : '') + '</div>' +
      '<div class="seg pay">' + ['cash', 'card', 'qr'].map(x => '<button class="' + (c.method === x ? 'on' : '') + '" data-act="method" data-id="' + x + '">' + esc(t(x)) + '</button>').join('') + '</div>' +
      '<div class="pay-row"><button class="btn ghost" data-act="clearcart">' + esc(t('clear')) + '</button><button class="btn main big" data-act="paybill"' + (c.lines.length ? '' : ' disabled') + '>' + esc(t('pay')) + ' · ' + esc(money(k.total)) + '</button></div></div>';
    const bar = $('#cartBar'); if (bar) { const n = c.lines.reduce((s, l) => s + l.q, 0); bar.innerHTML = '<span>' + n + '</span><b>' + esc(t('viewCart')) + '</b><em>' + esc(money(k.total)) + '</em>'; bar.hidden = !n; }
    const ph = $('#cPhone');
    if (ph) ph.addEventListener('input', () => {
      c.phone = ph.value; const d = ph.value.replace(/\D/g, '');
      const ex = d.length === 10 ? S.custs.find(x => x.phone === d) : null;
      if (ex) { c.cid = ex.id; renderCart(); return; }
      const m2 = d.length >= 3 ? S.custs.filter(x => x.phone.includes(d)).slice(0, 3) : [];
      $('#cSugg').innerHTML = m2.map(x => '<button data-act="custpick" data-id="' + x.id + '"><b>' + esc(x.name) + '</b><span>' + esc(x.phone) + ' · ' + num(x.pts) + ' ' + esc(t('points')) + '</span></button>').join('') +
        (d.length === 10 ? '<div class="newm"><input id="cName" placeholder="' + esc(t('name')) + '"><button class="btn ghost sm" data-act="newmem">' + esc(t('newCust')) + '</button></div>' : '');
    });
    const up = $('#useP'); if (up) up.addEventListener('change', () => { c.redeem = up.checked; renderCart(); });
    const dc = $('#cDisc'); if (dc) dc.addEventListener('change', () => { c.disc = dc.value; renderCart(); });
  }
  function openVariant(pid) {
    const p = P(pid), mode = U.cart.mode;
    U.vp = { pid, vid: (mode === 'whole' ? p.v.slice().sort((a, b) => st(pid, b[0]) - st(pid, a[0]))[0] : (p.v.find(v => st(pid, v[0]) > 0) || p.v[0]))[0], q: mode === 'whole' ? S.prices[pid].wq : 1 };
    renderVariant();
  }
  function renderVariant() {
    const vp = U.vp, p = P(vp.pid), mode = U.cart.mode, cat = D.cats.find(c => c.id === p.cat);
    openModal(shHead(esc(nm(p)), esc(nm(cat)) + ' · ' + esc(t('wholeFrom', { n: S.prices[p.id].wq })) + ' (' + esc(money(S.prices[p.id].whole)) + ')') +
      '<div class="sh-body"><h3>' + esc(nm({ en: D.opt[p.opt][0], si: D.opt[p.opt][1] })) + '</h3><div class="vgrid">' + p.v.map(v => {
        const s = st(p.id, v[0]), ss = stState(p.id, v[0]);
        return '<button class="vbtn' + (vp.vid === v[0] ? ' on' : '') + '"' + (s <= 0 ? ' disabled' : '') + ' data-act="vsel" data-id="' + v[0] + '"><i class="sw big" style="--sw:' + v[3] + '"></i><b>' + esc(v[U.lang === 'si' ? 2 : 1]) + '</b>' +
          '<span>' + esc(money(unitPrice(p.id, v[0], mode))) + '</span><small class="s-' + ss + '">' + (s <= 0 ? esc(t('out')) : s + ' ' + esc(t('inStock'))) + '</small></button>';
      }).join('') + '</div></div>' +
      '<div class="sh-foot"><span class="qty big"><button data-act="vq" data-d="-1">−</button><b>' + vp.q + '</b><button data-act="vq" data-d="1">+</button></span>' +
      '<button class="btn main big grow" data-act="vadd">' + esc(t('add')) + ' · ' + esc(money(unitPrice(p.id, vp.vid, mode) * vp.q)) + '</button></div>', 'mid');
  }
  function addVariant() {
    const vp = U.vp, c = U.cart;
    const have = c.lines.filter(l => l.k === 'v' && l.pid === vp.pid && l.vid === vp.vid).reduce((s, l) => s + l.q, 0);
    if (have + vp.q > st(vp.pid, vp.vid)) { toast(t('noStock', { n: st(vp.pid, vp.vid) })); return; }
    const l = c.lines.find(x => x.k === 'v' && x.pid === vp.pid && x.vid === vp.vid);
    if (l) l.q += vp.q; else c.lines.push({ k: 'v', pid: vp.pid, vid: vp.vid, q: vp.q });
    closeModal(); toast(t('added') + ': ' + pvName(vp.pid, vp.vid)); renderCart();
  }
  function openWrap() {
    const c = U.cart;
    openModal(shHead(esc(t('wrap'))) + '<div class="sh-body"><div class="wraps">' + D.wraps.map(w => { const l = c.lines.find(x => x.k === 'w' && x.id === w.id); return '<div class="wr"><b>' + esc(nm(w)) + '</b><span>' + esc(money(w.price)) + '</span><span class="qty"><button data-act="wq" data-id="' + w.id + '" data-d="-1">−</button><b>' + (l ? l.q : 0) + '</b><button data-act="wq" data-id="' + w.id + '" data-d="1">+</button></span></div>'; }).join('') + '</div>' +
      '<label class="fld"><span>' + esc(t('giftMsg')) + '</span><textarea id="gMsg" rows="2" maxlength="120" placeholder="Happy Birthday Amaya! Love, Thaththa">' + esc(c.msg) + '</textarea></label></div>' +
      '<div class="sh-foot"><button class="btn main big grow" data-act="wrapdone">' + esc(t('done')) + '</button></div>', 'mid');
  }
  function payBill() {
    const c = U.cart; if (!c.lines.length) return;
    for (const l of c.lines) {
      if (l.k === 'v') { const need = c.lines.filter(x => x.k === 'v' && x.pid === l.pid && x.vid === l.vid).reduce((s, x) => s + x.q, 0); if (need > st(l.pid, l.vid)) { toast(pvName(l.pid, l.vid) + ': ' + t('noStock', { n: st(l.pid, l.vid) })); return; } }
    }
    const k = cartCalc();
    const b = { no: 'T' + (S.no++), t: Date.now(), mode: c.mode, cid: c.mode === 'retail' ? c.cid : null, method: c.method, msg: c.msg,
      lines: c.lines.map(l => Object.assign({}, l, { p: lineUnit(l, c.mode), items: l.items ? l.items.map(x => x.slice()) : undefined })), sub: k.sub, disc: k.disc, redeem: k.redeem, total: k.total, earn: k.earn };
    b.lines.forEach(l => {
      if (l.k === 'v') S.stock[vk(l.pid, l.vid)] -= l.q;
      if (l.k === 'h') l.items.forEach(([pid, vid, q]) => { S.stock[vk(pid, vid)] = Math.max(0, st(pid, vid) - q * l.q); });
    });
    if (b.cid) { const m = cust(b.cid); m.pts = m.pts - b.redeem + b.earn; }
    S.bills.push(b); save(); U.cart = newCart(); document.body.classList.remove('cart-open');
    toast(t('billSaved', { n: b.no })); renderSell(); renderCounts(); showReceipt(b);
  }
  function lineTitle(l) { return l.k === 'v' ? pvName(l.pid, l.vid) : l.k === 'w' ? nm(D.wraps.find(w => w.id === l.id)) : t('hamperLine') + ': ' + nm({ en: l.name[0], si: l.name[1] }); }
  function receiptHtml(b) {
    const m = b.cid ? cust(b.cid) : null;
    return '<div class="rc"><div class="rc-h"><b>tikiri</b><span>Fancy &amp; Gifts</span><small>' + esc(D.shop.addr) + ' · ' + esc(D.shop.phone) + '</small></div>' +
      '<div class="rc-m"><span>' + esc(b.no) + (b.mode === 'whole' ? ' · ' + esc(t('whole')).toUpperCase() : '') + '</span><span>' + esc(fmtDate(b.t)) + ' ' + esc(fmtTime(b.t)) + '</span></div>' +
      '<table>' + b.lines.map(l => '<tr><td>' + esc(lineTitle(l)) + '<small>' + l.q + ' × ' + esc(num(l.p)) + '</small></td><td>' + esc(num(l.p * l.q)) + '</td></tr>').join('') + '</table>' +
      '<div class="rc-t">' + (b.disc ? '<div><span>' + esc(t('discount')) + '</span><span>− ' + esc(num(b.disc)) + '</span></div>' : '') + (b.redeem ? '<div><span>' + esc(t('pointsUsed')) + '</span><span>− ' + esc(num(b.redeem)) + '</span></div>' : '') +
      '<div class="g"><span>' + esc(t('total')) + '</span><span>' + esc(money(b.total)) + '</span></div><div><span>' + esc(t('pay')) + '</span><span>' + esc(t(b.method)) + '</span></div></div>' +
      (m ? '<div class="rc-pts">' + esc(m.name) + ' · +' + b.earn + ' ' + esc(t('points')) + ' · ' + esc(t('total')) + ' ' + num(m.pts) + '</div>' : '') +
      (b.msg ? '<div class="rc-msg">' + esc(t('giftMsg')) + ': “' + esc(b.msg) + '”</div>' : '') + '<div class="rc-f">' + esc(U.lang === 'si' ? D.shop.footer_si : D.shop.footer_en) + '</div></div>';
  }
  function showReceipt(b) {
    const m = b.cid ? cust(b.cid) : null;
    const txt = ['Tikiri Fancy & Gifts', b.no + ' · ' + fmtDate(b.t), ''].concat(b.lines.map(l => lineTitle(l) + ' x' + l.q + '  ' + num(l.p * l.q))).concat(['', t('total') + ': ' + money(b.total)]).concat(m ? [t('points') + ': ' + num(m.pts)] : []).join('\n');
    openModal(shHead(esc(t('receipt')) + ' ' + esc(b.no)) + '<div class="sh-body rc-wrap">' + receiptHtml(b) + '</div>' +
      '<div class="sh-foot"><button class="btn ghost" data-act="printbill" data-id="' + b.no + '">' + esc(t('print')) + '</button><a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(m ? m.phone : '', txt)) + '">' + esc(t('sendWa')) + '</a><button class="btn main" data-act="close">' + esc(t('done')) + '</button></div>', 'mid');
  }

  // ---------- hampers ----------
  function hbCalc() {
    const hb = U.hb;
    const items = hb.items.reduce((s, [pid, vid, q]) => s + unitPrice(pid, vid, 'retail') * q, 0);
    const base = D.bases.find(b => b.id === hb.base).price + 250;
    const sug = Math.ceil((items + base) / 50) * 50;
    return { items, base, sug, price: +hb.price > 0 ? +hb.price : sug };
  }
  function renderHamper() {
    const hb = U.hb, k = hbCalc();
    const all = D.presets.map(p => Object.assign({ builtin: true }, p)).concat(S.presets);
    const presets = all.map(p => {
      const price = presetPrice(p), short = p.items.some(([pid, vid, q]) => st(pid, vid) < q);
      return '<div class="pre"><div><b>' + esc(nm(p)) + '</b><span>' + esc(nm(D.bases.find(b => b.id === p.base))) + ' · ' + p.items.length + ' ' + esc(t('items')) + '</span>' +
        '<p>' + p.items.map(([pid, vid]) => '<i class="sw" style="--sw:' + V(pid, vid)[3] + '"></i>' + esc(nm(P(pid)))).join(', ') + '</p>' + (short ? '<em>' + esc(t('short')) + '</em>' : '') + '</div>' +
        '<div class="pre-r"><b>' + esc(money(price)) + '</b><button class="btn ghost sm" data-act="hload" data-id="' + p.id + '">' + esc(t('load')) + '</button><button class="btn main sm" data-act="hsell" data-id="' + p.id + '"' + (short ? ' disabled' : '') + '>' + esc(t('toSale')) + '</button></div></div>';
    }).join('');
    const iq = hb.iq.trim().toLowerCase();
    const cand = [];
    D.products.forEach(p => p.v.forEach(v => { if (!iq || (p.en + ' ' + p.si + ' ' + v[1] + ' ' + v[2]).toLowerCase().includes(iq)) cand.push([p, v]); }));
    const picker = cand.slice(0, iq ? 40 : 16).map(([p, v]) => '<button class="pk" data-act="hadd" data-id="' + p.id + '" data-v="' + v[0] + '"' + (st(p.id, v[0]) <= 0 ? ' disabled' : '') + '>' + sw(v[3]) + '<span>' + esc(nm(p)) + ' <small>' + esc(v[U.lang === 'si' ? 2 : 1]) + '</small></span><em>' + esc(num(unitPrice(p.id, v[0], 'retail'))) + '</em><small class="s-' + stState(p.id, v[0]) + '">' + st(p.id, v[0]) + '</small><b>+</b></button>').join('');
    const inside = hb.items.map(([pid, vid, q], i) => '<li>' + sw(V(pid, vid)[3]) + '<span>' + esc(pvName(pid, vid)) + '</span><span class="qty"><button data-act="hq" data-id="' + i + '" data-d="-1">−</button><b>' + q + '</b><button data-act="hq" data-id="' + i + '" data-d="1">+</button></span><b>' + esc(num(unitPrice(pid, vid, 'retail') * q)) + '</b></li>').join('');
    $('#pg-hamper').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_hamper')) + '</h1></div><div class="h-grid">' +
      '<section class="box"><h2>' + esc(t('presets')) + '</h2>' + presets + '</section>' +
      '<section class="box builder"><h2>' + esc(t('builder')) + '</h2>' +
      '<label class="fld"><span>' + esc(t('hName')) + '</span><input id="hName" value="' + esc(hb.name) + '" placeholder="Anniversary hamper"></label>' +
      '<h3>' + esc(t('base')) + '</h3><div class="bases">' + D.bases.map(b => '<button class="' + (hb.base === b.id ? 'on' : '') + '" data-act="hbase" data-id="' + b.id + '"><b>' + esc(nm(b)) + '</b><span>' + esc(money(b.price)) + '</span></button>').join('') + '</div>' +
      '<h3>' + esc(t('hItems')) + ' <small>' + hb.items.length + '</small></h3><ul class="inside">' + (inside || '<li class="empty">' + esc(t('needItems')) + '</li>') + '</ul>' +
      '<h3>' + esc(t('pickItems')) + '</h3><label class="search sm"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="hq" placeholder="' + esc(t('search')) + '" value="' + esc(hb.iq) + '"></label><div class="picker">' + picker + '</div>' +
      '<div class="hcalc"><div><span>' + esc(t('itemsCost')) + '</span><b>' + esc(num(k.items)) + '</b></div><div><span>' + esc(t('basePrice')) + '</span><b>' + esc(num(k.base)) + '</b></div><div><span>' + esc(t('suggested')) + '</span><b>' + esc(money(k.sug)) + '</b></div>' +
      '<label><span>' + esc(t('finalPrice')) + '</span><input id="hPrice" inputmode="numeric" value="' + esc(hb.price) + '" placeholder="' + k.sug + '"></label></div>' +
      '<div class="pay-row"><button class="btn ghost" data-act="hsave">' + esc(t('savePreset')) + '</button><button class="btn main big" data-act="hcart">' + esc(t('toSale')) + ' · ' + esc(money(k.price)) + '</button></div></section></div>';
    $('#hName').addEventListener('input', e => { hb.name = e.target.value; });
    $('#hPrice').addEventListener('change', e => { hb.price = e.target.value; renderHamper(); });
    const hq = $('#hq'); hq.addEventListener('input', () => { hb.iq = hq.value; const p = hq.selectionStart; renderHamper(); const n = $('#hq'); n.focus(); n.setSelectionRange(p, p); });
  }
  function hamperToCart(name, items, base, price) {
    for (const [pid, vid, q] of items) if (st(pid, vid) < q) { toast(pvName(pid, vid) + ': ' + t('short')); return false; }
    U.cart.mode = 'retail';
    U.cart.lines.push({ k: 'h', name, items: items.map(x => x.slice()), base, q: 1, p: price });
    toast(t('toSaleDone')); go('sell'); return true;
  }

  // ---------- stock ----------
  function renderStock() {
    const q = U.sq.trim().toLowerCase();
    let list = D.products.slice();
    if (q) list = list.filter(p => (p.en + ' ' + p.si + ' ' + p.v.map(v => v[1]).join(' ')).toLowerCase().includes(q));
    if (U.sf !== 'all') list = list.filter(p => p.v.some(v => stState(p.id, v[0]) === U.sf || (U.sf === 'low' && stState(p.id, v[0]) === 'out')));
    const rows = list.map(p => {
      const cat = D.cats.find(c => c.id === p.cat), pr = S.prices[p.id];
      return '<tr><td><span class="cdot" style="--cc:' + cat.col + '"></span><b>' + esc(nm(p)) + '</b><small>' + esc(nm(cat)) + '</small></td>' +
        '<td><div class="vchips">' + p.v.map(v => { const s = stState(p.id, v[0]); return (U.sf === 'all' || s !== 'ok') ? '<button class="vc s-' + s + '" data-act="grn" data-id="' + p.id + '" data-v="' + v[0] + '">' + sw(v[3]) + '<span>' + esc(v[U.lang === 'si' ? 2 : 1]) + '</span><b>' + st(p.id, v[0]) + '</b></button>' : ''; }).join('') + '</div></td>' +
        '<td class="r"><b>' + esc(num(pr.retail)) + '</b><small>' + esc(t('whole')) + ' ' + esc(num(pr.whole)) + ' / ' + pr.wq + '+</small></td><td class="r"><button class="btn ghost sm" data-act="price" data-id="' + p.id + '">' + esc(t('prices')) + '</button></td></tr>';
    }).join('');
    const lows = lowList();
    $('#pg-stock').innerHTML = '<div class="pg-head"><h1>' + esc(t('stockTitle')) + '</h1><label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="sq" placeholder="' + esc(t('search')) + '" value="' + esc(U.sq) + '"></label>' +
      '<span class="seg">' + [['all', t('all')], ['low', t('lowOnly') + ' (' + lows.length + ')'], ['out', t('outOnly') + ' (' + lows.filter(x => x.s === 'out').length + ')']].map(([id, l]) => '<button class="' + (U.sf === id ? 'on' : '') + '" data-act="sf" data-id="' + id + '">' + esc(l) + '</button>').join('') + '</span></div>' +
      '<div class="box flush"><table class="tbl stock">' + rows + '</table></div>';
    const inp = $('#sq'); inp.addEventListener('input', () => { U.sq = inp.value; const p = inp.selectionStart; renderStock(); const n = $('#sq'); n.focus(); n.setSelectionRange(p, p); });
  }
  function openGrn(pid, vid) {
    const v = V(pid, vid);
    openModal(shHead(esc(t('grn')), esc(pvName(pid, vid)) + ' · ' + esc(t('stock')) + ' ' + st(pid, vid)) + '<div class="sh-body"><div class="grn-sw">' + '<i class="sw big" style="--sw:' + v[3] + '"></i><b>' + st(pid, vid) + '</b></div>' +
      '<label class="fld"><span>' + esc(t('addQty')) + '</span><input id="gQ" inputmode="numeric" value="12"></label><label class="fld"><span>' + esc(t('reorder')) + '</span><input id="gR" inputmode="numeric" value="' + S.reorder[vk(pid, vid)] + '"></label></div>' +
      '<div class="sh-foot"><button class="btn main big grow" data-act="grnsave" data-id="' + pid + '" data-v="' + vid + '">' + esc(t('saveStock')) + '</button></div>', 'small');
  }
  function openPrice(pid) {
    const pr = S.prices[pid];
    openModal(shHead(esc(t('prices')), esc(nm(P(pid)))) + '<div class="sh-body"><label class="fld"><span>' + esc(t('retailP')) + '</span><input id="pR" inputmode="numeric" value="' + pr.retail + '"></label><label class="fld"><span>' + esc(t('wholeP')) + '</span><input id="pW" inputmode="numeric" value="' + pr.whole + '"></label><label class="fld"><span>' + esc(t('minQ')) + '</span><input id="pQ" inputmode="numeric" value="' + pr.wq + '"></label></div>' +
      '<div class="sh-foot"><button class="btn main big grow" data-act="pricesave" data-id="' + pid + '">' + esc(t('saveStock')) + '</button></div>', 'small');
  }

  // ---------- loyalty ----------
  function renderLoyal() {
    const q = U.lq.trim().toLowerCase(), qd = q.replace(/\D/g, '');
    const idx = {}; S.bills.forEach(b => { if (!b.cid) return; const o = idx[b.cid] || (idx[b.cid] = { n: 0, last: 0, sp: 0 }); o.n++; o.last = Math.max(o.last, b.t); o.sp += b.total; });
    let list = S.custs.slice();
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q) || (qd && c.phone.includes(qd)));
    list.sort((a, b) => b.pts - a.pts);
    const rows = list.map(c => { const o = idx[c.id] || { n: 0, last: 0, sp: 0 }; const tr = o.sp >= 40000 ? 'platinum' : o.sp >= 15000 ? 'gold' : 'silver';
      return '<tr data-act="lsel" data-id="' + c.id + '" class="' + (U.lsel === c.id ? 'sel' : '') + '"><td><b>' + esc(c.name) + '</b><small>' + esc(c.phone) + '</small></td><td><em class="tier t-' + tr + '">' + esc(t(tr)) + '</em></td><td class="r"><b class="pts">' + num(c.pts) + '</b></td><td class="r hs">' + o.n + '</td><td class="r hs">' + esc(num(o.sp)) + '</td></tr>'; }).join('');
    const totPts = S.custs.reduce((s, c) => s + c.pts, 0);
    $('#pg-loyal').innerHTML = '<div class="pg-head"><h1>' + esc(t('loyalTitle')) + ' <small>' + S.custs.length + '</small></h1><label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="lq" placeholder="' + esc(t('phoneHint')) + ' / ' + esc(t('name')) + '" value="' + esc(U.lq) + '"></label>' +
      '<div class="pill-stat"><b>' + num(totPts) + '</b> ' + esc(t('points')) + '</div></div>' +
      '<div class="l-grid"><div class="box flush"><table class="tbl"><thead><tr><th>' + esc(t('member')) + '</th><th>' + esc(t('tier')) + '</th><th class="r">' + esc(t('points')) + '</th><th class="r hs">' + esc(t('visits')) + '</th><th class="r hs">' + esc(t('spent')) + '</th></tr></thead><tbody>' + (rows || '<tr><td colspan="5" class="empty">' + esc(t('noMatch')) + '</td></tr>') + '</tbody></table></div>' +
      '<aside class="box prof" id="prof">' + memberHtml(U.lsel) + '</aside></div>';
    const inp = $('#lq'); inp.addEventListener('input', () => { U.lq = inp.value; const p = inp.selectionStart; renderLoyal(); const n = $('#lq'); n.focus(); n.setSelectionRange(p, p); });
  }
  function memberHtml(id) {
    const c = id ? cust(id) : null; if (!c) return '<p class="empty">' + esc(t('pickM')) + '</p>';
    const bills = S.bills.filter(b => b.cid === c.id), sp = bills.reduce((s, b) => s + b.total, 0), tr = tierOf(c);
    return '<div class="m-card t-' + tr + '"><span>' + esc(t(tr)) + '</span><b>' + esc(c.name) + '</b><small>' + esc(c.phone) + '</small><div class="m-pts"><b>' + num(c.pts) + '</b> ' + esc(t('points')) + '</div></div>' +
      '<div class="m-stats"><div><b>' + bills.length + '</b><span>' + esc(t('visits')) + '</span></div><div><b>' + esc(num(sp)) + '</b><span>' + esc(t('spent')) + '</span></div><div><b>' + esc(fmtDate(c.since)) + '</b><span>' + esc(t('since')) + '</span></div></div>' +
      '<a class="btn wa full" target="_blank" rel="noopener" href="' + esc(waLink(c.phone, t('ptsMsg', { name: c.name.split(' ')[0], p: num(c.pts) }))) + '">' + esc(t('sendPts')) + '</a>' +
      '<h3>' + esc(t('history')) + '</h3><ul class="mh">' + bills.slice().reverse().slice(0, 10).map(b => '<li data-act="viewbill" data-id="' + b.no + '"><span>' + esc(fmtDate(b.t)) + '</span><span>' + esc(num(b.total)) + '</span><b>+' + b.earn + (b.redeem ? ' / −' + num(b.redeem) : '') + '</b></li>').join('') + '</ul>';
  }

  // ---------- reports ----------
  function renderReports() {
    const p = U.rp, d0 = dayStart(Date.now()), from = p === 'today' ? d0 : d0 - (p === 'd7' ? 6 : 29) * DAY;
    const bills = S.bills.filter(b => b.t >= from);
    const sales = bills.reduce((s, b) => s + b.total, 0);
    const whole = bills.filter(b => b.mode === 'whole').reduce((s, b) => s + b.total, 0);
    const wrapI = bills.reduce((s, b) => s + b.lines.filter(l => l.k !== 'v').reduce((x, l) => x + l.p * l.q, 0), 0);
    const red = bills.reduce((s, b) => s + b.redeem, 0);
    const nd = p === 'd30' ? 30 : 7, days = Array.from({ length: nd }, (_, i) => d0 - (nd - 1 - i) * DAY);
    const dv = days.map(d => S.bills.filter(b => b.t >= d && b.t < d + DAY).reduce((s, b) => s + b.total, 0)), mx = Math.max(1, ...dv);
    const cat = {}, vs = {};
    bills.forEach(b => b.lines.forEach(l => { if (l.k !== 'v') return; const c = P(l.pid).cat; cat[c] = (cat[c] || 0) + l.p * l.q; const key = vk(l.pid, l.vid); vs[key] = (vs[key] || 0) + l.q; }));
    const cmx = Math.max(1, ...Object.values(cat));
    const top = Object.entries(vs).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const lows = lowList().slice(0, 10);
    $('#pg-reports').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_reports')) + '</h1><span class="seg">' + ['today', 'd7', 'd30'].map(x => '<button class="' + (p === x ? 'on' : '') + '" data-act="rp" data-id="' + x + '">' + esc(t(x)) + '</button>').join('') + '</span></div>' +
      '<div class="kpis"><div class="k1"><span>' + esc(t('sales')) + '</span><b>' + esc(money(sales)) + '</b></div><div><span>' + esc(t('bills')) + '</span><b>' + bills.length + '</b></div><div><span>' + esc(t('wholeSales')) + '</span><b>' + esc(money(whole)) + '</b></div><div><span>' + esc(t('wrapIncome')) + '</span><b>' + esc(money(wrapI)) + '</b></div><div><span>' + esc(t('ptsRedeemed')) + '</span><b>' + esc(num(red)) + '</b></div></div>' +
      '<div class="r-grid"><section class="box"><h2>' + esc(t('byDay')) + '</h2><div class="cols n' + nd + '">' + days.map((d, i) => { const dt = new Date(d); return '<div class="cl' + (i === nd - 1 ? ' now' : '') + '" title="' + fmtDate(d) + ' · ' + money(dv[i]) + '"><em>' + (nd === 7 ? (dv[i] / 1000).toFixed(0) + 'k' : '') + '</em><i style="height:' + (dv[i] / mx * 100) + '%"></i><span>' + esc(nd === 7 ? t('dshort')[dt.getDay()] : (dt.getDate() % 5 === 0 ? dt.getDate() : '')) + '</span></div>'; }).join('') + '</div></section>' +
      '<section class="box"><h2>' + esc(t('byCat')) + '</h2>' + D.cats.map(c => '<div class="hbar"><span>' + esc(nm(c)) + '</span><i><s style="width:' + ((cat[c.id] || 0) / cmx * 100) + '%;background:' + c.col + '"></s></i><b>' + esc(num(cat[c.id] || 0)) + '</b></div>').join('') + '</section>' +
      '<section class="box"><h2>' + esc(t('topVar')) + '</h2><ol class="topv">' + top.map(([key, n]) => { const [pid, vid] = key.split(':'); return '<li>' + sw(V(pid, vid)[3]) + '<span>' + esc(pvName(pid, vid)) + '</span><b>' + n + '</b></li>'; }).join('') + '</ol></section>' +
      '<section class="box"><h2>' + esc(t('lowList')) + ' <button class="lnk" data-act="nav" data-id="stock">' + esc(t('viewStock')) + ' →</button></h2><ul class="lowl">' + lows.map(x => '<li>' + sw(x.v[3]) + '<span>' + esc(pvName(x.p.id, x.v[0])) + '</span><b class="s-' + x.s + '">' + st(x.p.id, x.v[0]) + '</b></li>').join('') + '</ul></section></div>';
  }
  function openSettings() {
    openModal(shHead(esc(t('settings'))) + '<div class="sh-body"><div class="set-row"><span>' + esc(t('language')) + '</span><span class="seg"><button class="' + (U.lang === 'en' ? 'on' : '') + '" data-act="setlang" data-id="en">English</button><button class="' + (U.lang === 'si' ? 'on' : '') + '" data-act="setlang" data-id="si">සිංහල</button></span></div>' +
      '<div class="set-row"><span>' + esc(t('demoData')) + '<small>' + esc(t('resetTxt')) + '</small></span><button class="btn ghost sm" data-act="reset">' + esc(t('reset')) + '</button></div>' +
      '<div class="set-row"><span><small>' + esc(t('talk')) + '</small></span><a class="btn wa sm" target="_blank" rel="noopener" href="' + esc(waLink(WA_NUMBER, t('waWelcome'))) + '">' + esc(t('demoCta')) + '</a></div></div>', 'mid');
  }

  // ---------- events ----------
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) { if (e.target.id === 'modal') closeModal(); return; }
    const a = el.dataset.act, id = el.dataset.id, c = U.cart;
    switch (a) {
      case 'nav': closeModal(); go(id); break;
      case 'lang': U.lang = U.lang === 'si' ? 'en' : 'si'; applyLang(); break;
      case 'setlang': U.lang = id; applyLang(); openSettings(); break;
      case 'settings': openSettings(); break;
      case 'close': closeModal(); break;
      case 'cat': U.cat = id; renderSell(); break;
      case 'prod': openVariant(id); break;
      case 'vsel': U.vp.vid = id; renderVariant(); break;
      case 'vq': U.vp.q = Math.max(1, U.vp.q + +el.dataset.d); renderVariant(); break;
      case 'vadd': addVariant(); break;
      case 'mode': c.mode = id; if (id === 'whole') { c.redeem = false; c.lines = c.lines.filter(l => l.k === 'v'); } renderSell(); break;
      case 'lq': { const l = c.lines[+id]; l.q += +el.dataset.d; if (l.q <= 0) c.lines.splice(+id, 1); renderCart(); break; }
      case 'custpick': c.cid = id; renderCart(); break;
      case 'custclear': c.cid = null; c.phone = ''; c.redeem = false; renderCart(); break;
      case 'newmem': {
        const d = c.phone.replace(/\D/g, ''), n = ($('#cName').value || '').trim() || t('walkin');
        const m = { id: 'm' + (S.custs.length + 100 + Math.floor(Math.random() * 900)), name: n, phone: d, pts: 0, since: Date.now() };
        S.custs.push(m); save(); c.cid = m.id; renderCart(); break;
      }
      case 'wrap': openWrap(); break;
      case 'wq': { const l = c.lines.find(x => x.k === 'w' && x.id === id); c.msg = $('#gMsg').value; if (l) { l.q += +el.dataset.d; if (l.q <= 0) c.lines.splice(c.lines.indexOf(l), 1); } else if (+el.dataset.d > 0) c.lines.push({ k: 'w', id, q: 1 }); openWrap(); break; }
      case 'wrapdone': c.msg = $('#gMsg').value.trim(); closeModal(); renderCart(); break;
      case 'method': c.method = id; renderCart(); break;
      case 'clearcart': U.cart = newCart(); renderSell(); break;
      case 'paybill': payBill(); break;
      case 'opencart': document.body.classList.add('cart-open'); break;
      case 'closecart': document.body.classList.remove('cart-open'); break;
      case 'printbill': { const b = S.bills.find(x => x.no === id); if (b) { $('#print').innerHTML = receiptHtml(b); window.print(); } break; }
      case 'viewbill': { const b = S.bills.find(x => x.no === id); if (b) showReceipt(b); break; }
      case 'hbase': U.hb.base = id; U.hb.price = ''; renderHamper(); break;
      case 'hadd': { const ex = U.hb.items.find(x => x[0] === id && x[1] === el.dataset.v); if (ex) ex[2]++; else U.hb.items.push([id, el.dataset.v, 1]); U.hb.price = ''; renderHamper(); break; }
      case 'hq': { const it = U.hb.items[+id]; it[2] += +el.dataset.d; if (it[2] <= 0) U.hb.items.splice(+id, 1); U.hb.price = ''; renderHamper(); break; }
      case 'hload': { const p = D.presets.concat(S.presets).find(x => x.id === id); U.hb = { base: p.base, items: p.items.map(x => x.slice()), name: nm(p), price: '', iq: '' }; renderHamper(); window.scrollTo(0, 0); break; }
      case 'hsell': { const p = D.presets.concat(S.presets).find(x => x.id === id); hamperToCart([p.en, p.si], p.items, p.base, presetPrice(p)); break; }
      case 'hcart': { const hb = U.hb; if (!hb.items.length) { toast(t('needItems')); break; } const n = hb.name.trim() || 'Gift hamper'; if (hamperToCart([n, n], hb.items, hb.base, hbCalc().price)) U.hb = { base: 'basket', items: [], name: '', price: '', iq: '' }; break; }
      case 'hsave': { const hb = U.hb; if (!hb.items.length) { toast(t('needItems')); break; } const n = hb.name.trim() || 'Gift hamper ' + (S.presets.length + 1); S.presets.push({ id: 'u' + Date.now(), en: n, si: n, base: hb.base, items: hb.items.map(x => x.slice()) }); save(); toast(t('presetSaved')); renderHamper(); break; }
      case 'sf': U.sf = id; renderStock(); break;
      case 'grn': openGrn(id, el.dataset.v); break;
      case 'grnsave': { const key = vk(id, el.dataset.v); S.stock[key] = st(id, el.dataset.v) + Math.max(0, Math.round(+$('#gQ').value || 0)); S.reorder[key] = Math.max(0, Math.round(+$('#gR').value || 0)); save(); closeModal(); toast(t('stockSaved')); renderPage(); renderCounts(); break; }
      case 'price': openPrice(id); break;
      case 'pricesave': { const pr = S.prices[id]; pr.retail = Math.max(0, Math.round(+$('#pR').value || pr.retail)); pr.whole = Math.max(0, Math.round(+$('#pW').value || pr.whole)); pr.wq = Math.max(1, Math.round(+$('#pQ').value || pr.wq)); save(); closeModal(); toast(t('stockSaved')); renderPage(); break; }
      case 'lsel':
        U.lsel = id;
        if (window.innerWidth < 1000) openModal(shHead(esc(cust(id).name)) + '<div class="sh-body prof">' + memberHtml(id) + '</div>', 'mid');
        else { $$('#pg-loyal tr.sel').forEach(r => r.classList.remove('sel')); el.classList.add('sel'); $('#prof').innerHTML = memberHtml(id); }
        break;
      case 'rp': U.rp = id; renderReports(); break;
      case 'reset': try { localStorage.removeItem(KEY); } catch (er) { /* ignore */ } S = makeDemo(new Date()); save(); U.cart = newCart(); U.lsel = null; closeModal(); toast(t('resetDone')); renderPage(); renderCounts(); break;
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
  window.addEventListener('afterprint', () => { $('#print').innerHTML = ''; });

  go(U.page);
  applyLang();
})();
