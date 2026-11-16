// Samsoft POS demo - app logic. Works offline; data is kept in this browser (localStorage).
'use strict';

(function () {
  const WA_NUMBER = '94704808744';
  const KEY = 'samsoft-pos-demo-v1';
  const { CATS, makeDemo } = window.POS_DATA;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;
  const r3 = n => Math.round((n + Number.EPSILON) * 1000) / 1000;
  const num = n => (+n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money = n => 'Rs. ' + num(n);
  const DAY = 864e5;

  // ---------- text ----------
  const T = {
    si: {
      demoMsg: 'මේ Samsoft POS demo එකක්. ඔබේ කඩයට ගැලපෙන විදිහට හදලා දෙනවා.',
      demoCta: 'මගේ කඩේටත් ඕනේ',
      nav_bill: 'බිල්පත', nav_sales: 'වාර්තා', nav_stock: 'තොග', nav_credit: 'ණය පොත', nav_settings: 'සැකසුම්',
      t_bill: 'බිල්පත', t_sales: 'විකුණුම් වාර්තා', t_stock: 'තොග පාලනය', t_credit: 'ණය පොත', t_settings: 'සැකසුම්',
      offline: 'Internet නැතුවත් වැඩ',
      search: 'නම, කේතය හෝ බාකෝඩ් අංකය…', scanDemo: 'බාකෝඩ් scan (demo)', all: 'සියල්ල',
      cart: 'වත්මන් බිල', billNo: 'බිල් අංකය', emptyCart: 'බිල තවම හිස්.', emptyHint: 'භාණ්ඩයක් තෝරන්න, නැත්නම් බාකෝඩ් එක scan කරන්න.',
      clear: 'මකන්න', items: 'භාණ්ඩ', subtotal: 'උප එකතුව', discount: 'වට්ටම', total: 'මුළු මුදල', pay: 'ගෙවීම',
      inStock: 'තොගයේ', low: 'අඩුයි', out: 'ඉවරයි', notEnough: 'තොගයේ ඇත්තේ', notFound: 'භාණ්ඩය හමු නොවීය', noResults: 'ගැලපෙන භාණ්ඩ නැත',
      weightTitle: 'බර / ප්‍රමාණය', byWeight: 'බර (kg)', byAmount: 'මුදලට (Rs.)', pricePer: 'මිල',
      add: 'එකතු කරන්න', update: 'යාවත්කාලීන කරන්න', cancel: 'අවලංගු', save: 'සුරකින්න', close: 'වසන්න',
      payTitle: 'ගෙවීම', cash: 'මුදල්', card: 'කාඩ්', credit: 'ණයට',
      given: 'ලැබුණු මුදල', change: 'ආපසු දිය යුතු', exact: 'හරියටම', short: 'තව ඕනේ',
      customer: 'පාරිභෝගිකයා', selectCust: 'පාරිභෝගිකයා තෝරන්න', balance: 'ණය ශේෂය', limit: 'ණය සීමාව',
      afterBill: 'මේ බිලෙන් පසු', overLimit: 'ණය සීමාව ඉක්මවයි', complete: 'බිල සම්පූර්ණ කරන්න', done: 'බිල සුරැකුණා',
      print: 'මුද්‍රණය', newBill: 'නව බිලක්', cardRef: 'කාඩ් යන්ත්‍රයෙන් ගෙවීම අනුමත වූ පසු තහවුරු කරන්න.',
      paidBy: 'ගෙවූ ක්‍රමය', paid: 'ගෙවූ මුදල', receipt: 'බිල්පත', date: 'දිනය', qty: 'ප්‍රමාණය', amount: 'මුදල',
      todaySales: 'අද විකුණුම්', bills: 'බිල්පත්', avgBill: 'සාමාන්‍ය බිලක්', creditToday: 'අද ණයට දුන්',
      vsYesterday: 'ඊයේ මේ වෙලාවට වඩා', hourly: 'අද පැයෙන් පැයට', payMix: 'ගෙවීම් ක්‍රම (අද)', week: 'පසුගිය දින 7',
      topItems: 'අද වැඩිපුරම විකුණුණු', todayBills: 'අද බිල්පත්', time: 'වේලාව', method: 'ක්‍රමය', view: 'බලන්න', noBills: 'අද තවම බිල් නැත.',
      itemsN: 'භාණ්ඩ', lowItems: 'තොග අඩු භාණ්ඩ', stockValue: 'තොගයේ වටිනාකම', filterAll: 'සියල්ල', filterLow: 'තොග අඩු',
      item: 'භාණ්ඩය', code: 'කේතය', price: 'විකුණුම් මිල', stock: 'තොගය', reorder: 'අවම මට්ටම', status: 'තත්ත්වය',
      ok: 'හොඳයි', addStock: 'තොග', edit: 'වෙනස් කරන්න', newProd: 'නව භාණ්ඩයක්',
      addStockTitle: 'තොග ලැබීම (GRN)', qtyRecv: 'ලැබුණු ප්‍රමාණය', newStock: 'අලුත් තොගය',
      nameSi: 'නම (සිංහල)', nameEn: 'නම (English)', unit: 'ඒකකය', category: 'වර්ගය', barcode: 'බාකෝඩ් අංකය', optional: 'අවශ්‍ය නම්',
      stockSaved: 'තොගය යාවත්කාලීන කළා', prodSaved: 'භාණ්ඩය සුරැකුණා', needName: 'නම සහ මිල දෙන්න',
      outstanding: 'මුළු ණය මුදල', customers: 'ණය පාරිභෝගිකයන්', overLimitN: 'සීමාව ඉක්මවූ',
      history: 'ගනුදෙනු ඉතිහාසය', recordPay: 'ගෙවීමක් ලියන්න', remind: 'WhatsApp මතක් කිරීම', newCust: 'නව පාරිභෝගිකයෙක්',
      name: 'නම', phone: 'දුරකථන අංකය', tx_open: 'පරණ ශේෂය', tx_sale: 'ණයට ගත් බඩු', tx_pay: 'ගෙවීම',
      paySaved: 'ගෙවීම ලිව්වා', custSaved: 'පාරිභෝගිකයා එකතු කළා', pickCust: 'වම් පැත්තෙන් පාරිභෝගිකයෙක් තෝරන්න.',
      remindMsg: 'ආයුබෝවන් {name}, {shop} හි ඔබේ ණය ශේෂය {amt} කි. පහසු වෙලාවක ගෙවන්න. ස්තූතියි!',
      back: 'ආපසු',
      shopInfo: 'කඩේ විස්තර (බිලේ පෙන්වන)', shopSi: 'කඩේ නම (සිංහල)', shopEn: 'කඩේ නම (English)', address: 'ලිපිනය',
      footerSi: 'බිලේ පණිවිඩය (සිංහල)', footerEn: 'බිලේ පණිවිඩය (English)', shopSaved: 'සුරැකුණා',
      language: 'භාෂාව', demoData: 'Demo දත්ත', resetTxt: 'ඔබ කළ වෙනස්කම් මකා, මුල් demo දත්ත නැවත ලබාගන්න.', reset: 'Demo එක මුල ඉඳන්',
      resetSure: 'ඔබ කළ සියලු වෙනස්කම් මැකෙනවා. ඉදිරියට යන්නද?', resetDone: 'Demo දත්ත අලුත් කළා',
      aboutT: 'ඔබේ කඩයට ගැලපෙන්න හදලා දෙනවා',
      aboutP: 'මේ demo එකේ තියෙන හැමදේම ඔබේ ව්‍යාපාරයට ගැලපෙන්න වෙනස් කරලා දෙන්න පුළුවන්.',
      f1: 'ඔබේ භාණ්ඩ, මිල, බාකෝඩ් ඇතුළත් කරලා දෙනවා', f2: 'Barcode scanner සහ receipt printer සමඟ වැඩ', f3: 'Internet නැතුවත් වැඩ, දත්ත ඔබේ පරිගණකයේම',
      f4: 'සිංහල, English (දෙමළ ඉල්ලුවොත්)', f5: 'Backup සහ ස්ථාපනය අපෙන්',
      talk: 'WhatsApp එකෙන් කතා කරන්න',
      am: 'පෙ.ව.', pm: 'ප.ව.', days: ['ඉරිදා', 'සඳුදා', 'අඟහරුවාදා', 'බදාදා', 'බ්‍රහස්පතින්දා', 'සිකුරාදා', 'සෙනසුරාදා'], dshort: ['ඉරි', 'සඳු', 'අඟ', 'බදා', 'බ්‍රහ', 'සිකු', 'සෙන'],
      u_kg: 'kg', u_each: 'එක', u_pkt: 'පැකට්', u_bottle: 'බෝතල',
      lowAlert: 'භාණ්ඩ {n}ක තොග අඩුයි', today: 'අද', yesterday: 'ඊයේ',
      added: 'එකතු කළා', scanned: 'Scan කළා', cust: 'පාරිභෝගිකයා', newBalance: 'නව ණය ශේෂය',
      waWelcome: 'ආයුබෝවන් Samsoft, මම POS demo එක බැලුවා. මගේ කඩයටත් POS එකක් ගැන දැනගන්න ඕනේ.'
    },
    en: {
      demoMsg: 'This is a Samsoft POS demo. We set it up to fit your shop.',
      demoCta: 'Get it for my shop',
      nav_bill: 'Billing', nav_sales: 'Reports', nav_stock: 'Stock', nav_credit: 'Credit book', nav_settings: 'Settings',
      t_bill: 'Billing', t_sales: 'Sales reports', t_stock: 'Stock control', t_credit: 'Credit book', t_settings: 'Settings',
      offline: 'Works offline',
      search: 'Name, code or barcode…', scanDemo: 'Scan barcode (demo)', all: 'All',
      cart: 'Current bill', billNo: 'Bill no', emptyCart: 'The bill is empty.', emptyHint: 'Pick an item or scan a barcode.',
      clear: 'Clear', items: 'items', subtotal: 'Subtotal', discount: 'Discount', total: 'Total', pay: 'Pay',
      inStock: 'In stock', low: 'Low', out: 'Out', notEnough: 'Only in stock:', notFound: 'Item not found', noResults: 'No matching items',
      weightTitle: 'Weight / quantity', byWeight: 'Weight (kg)', byAmount: 'By amount (Rs.)', pricePer: 'Price',
      add: 'Add', update: 'Update', cancel: 'Cancel', save: 'Save', close: 'Close',
      payTitle: 'Payment', cash: 'Cash', card: 'Card', credit: 'Credit',
      given: 'Cash received', change: 'Change', exact: 'Exact', short: 'Short by',
      customer: 'Customer', selectCust: 'Select the customer', balance: 'Balance', limit: 'Credit limit',
      afterBill: 'After this bill', overLimit: 'Over the credit limit', complete: 'Complete sale', done: 'Sale saved',
      print: 'Print', newBill: 'New bill', cardRef: 'Confirm after the card machine approves the payment.',
      paidBy: 'Paid by', paid: 'Paid', receipt: 'Receipt', date: 'Date', qty: 'Qty', amount: 'Amount',
      todaySales: "Today's sales", bills: 'Bills', avgBill: 'Average bill', creditToday: 'Credit given today',
      vsYesterday: 'vs yesterday, same time', hourly: 'Today by hour', payMix: 'Payment methods (today)', week: 'Last 7 days',
      topItems: 'Top sellers today', todayBills: "Today's bills", time: 'Time', method: 'Method', view: 'View', noBills: 'No bills yet today.',
      itemsN: 'Items', lowItems: 'Low stock items', stockValue: 'Stock value', filterAll: 'All', filterLow: 'Low stock',
      item: 'Item', code: 'Code', price: 'Selling price', stock: 'Stock', reorder: 'Reorder level', status: 'Status',
      ok: 'OK', addStock: 'Stock', edit: 'Edit', newProd: 'New item',
      addStockTitle: 'Receive stock (GRN)', qtyRecv: 'Quantity received', newStock: 'New stock',
      nameSi: 'Name (Sinhala)', nameEn: 'Name (English)', unit: 'Unit', category: 'Category', barcode: 'Barcode', optional: 'optional',
      stockSaved: 'Stock updated', prodSaved: 'Item saved', needName: 'Enter a name and a price',
      outstanding: 'Total outstanding', customers: 'Credit customers', overLimitN: 'Over limit',
      history: 'History', recordPay: 'Record payment', remind: 'WhatsApp reminder', newCust: 'New customer',
      name: 'Name', phone: 'Phone', tx_open: 'Old balance', tx_sale: 'Credit purchase', tx_pay: 'Payment',
      paySaved: 'Payment recorded', custSaved: 'Customer added', pickCust: 'Pick a customer from the list.',
      remindMsg: 'Hello {name}, your balance at {shop} is {amt}. Please settle it when convenient. Thank you!',
      back: 'Back',
      shopInfo: 'Shop details (shown on the receipt)', shopSi: 'Shop name (Sinhala)', shopEn: 'Shop name (English)', address: 'Address',
      footerSi: 'Receipt message (Sinhala)', footerEn: 'Receipt message (English)', shopSaved: 'Saved',
      language: 'Language', demoData: 'Demo data', resetTxt: 'Erase your changes and load fresh demo data.', reset: 'Restart the demo',
      resetSure: 'All your changes will be erased. Continue?', resetDone: 'Demo data refreshed',
      aboutT: 'We set it up for your shop',
      aboutP: 'Everything in this demo can be changed to fit your business.',
      f1: 'Your items, prices and barcodes loaded for you', f2: 'Works with barcode scanners and receipt printers', f3: 'Works offline, data stays on your computer',
      f4: 'Sinhala, English (Tamil on request)', f5: 'Backup and installation by us',
      talk: 'Talk to us on WhatsApp',
      am: 'AM', pm: 'PM', days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], dshort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      u_kg: 'kg', u_each: 'each', u_pkt: 'pkt', u_bottle: 'btl',
      lowAlert: '{n} items are low on stock', today: 'Today', yesterday: 'Yesterday',
      added: 'Added', scanned: 'Scanned', cust: 'Customer', newBalance: 'New balance',
      waWelcome: 'Hello Samsoft, I tried the POS demo. I would like to know about a POS for my shop.'
    }
  };

  // ---------- state ----------
  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    const day0 = new Date(); day0.setHours(0, 0, 0, 0);
    // The demo is rebuilt every new day so the reports always show "today".
    if (!s || s.v !== 1 || s.made !== day0.getTime()) s = makeDemo(new Date());
    return s;
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* demo still works without storage */ } }
  save();

  function initLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'si' || q === 'en') return q;
    return 'en';
  }
  const U = {
    lang: initLang(), page: 'bill', cat: 'all', q: '',
    cart: [], disc: 0, discType: 'rs',
    pay: null, stockFilter: 'all', stockQ: '', cust: null
  };
  const t = k => (T[U.lang][k] != null ? T[U.lang][k] : k);
  const nm = o => (U.lang === 'si' ? o.si : o.en) || o.si || o.en || '';
  const unitTxt = u => t('u_' + u);
  const qtyTxt = (q, u) => (u === 'kg' ? (+q).toFixed(3).replace(/\.?0+$/, '') + ' kg' : String(+q));
  const prod = id => S.products.find(p => p.id === id);
  const catOf = id => CATS.find(c => c.id === id) || CATS[0];

  function fmtTime(ms) {
    const d = new Date(ms);
    let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
    const ap = h < 12 ? t('am') : t('pm');
    h = h % 12 || 12;
    return U.lang === 'si' ? ap + ' ' + h + ':' + m : h + ':' + m + ' ' + ap;
  }
  function fmtDate(ms) {
    const d = new Date(ms);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  const dayStart = ms => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };

  function custBalance(c) {
    return r2(c.tx.reduce((s, x) => s + (x.type === 'pay' ? -x.amt : x.amt), 0));
  }
  function stockState(p) {
    if (p.stock <= 0) return 'out';
    if (p.stock <= p.reorder) return 'low';
    return 'ok';
  }
  function waLink(phone, text) {
    return 'https://wa.me/' + (phone || '') + '?text=' + encodeURIComponent(text);
  }
  function toast(msg, kind) {
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.classList.add('out'), 2200);
    setTimeout(() => el.remove(), 2600);
  }

  // ---------- static text + navigation ----------
  function applyLang() {
    const root = document.documentElement;
    root.setAttribute('data-lang', U.lang);
    root.setAttribute('lang', U.lang);
    try { localStorage.setItem('samsoft-ui-lang', U.lang); } catch (e) { /* ignore */ }
    $$('[data-t]').forEach(el => { el.textContent = t(el.getAttribute('data-t')); });
    $('#q').placeholder = t('search');
    $('#waCta').href = waLink(WA_NUMBER, t('waWelcome'));
    $('#homeLink').href = '../../website/index.html?lang=' + U.lang;
    renderAll();
  }
  function go(page) {
    U.page = page;
    document.body.dataset.page = page;
    $$('.page').forEach(p => p.classList.toggle('on', p.id === 'pg-' + page));
    $$('#nav button').forEach(b => b.classList.toggle('on', b.dataset.id === page));
    $('#pageTitle').textContent = t('t_' + page);
    document.body.classList.remove('cart-open');
    renderPage();
    window.scrollTo(0, 0);
    if (page === 'bill' && window.matchMedia('(min-width: 900px)').matches) $('#q').focus();
  }
  function renderPage() {
    ({ bill: renderBill, sales: renderSales, stock: renderStock, credit: renderCredit, settings: renderSettings })[U.page]();
  }
  function renderAll() {
    $('#pageTitle').textContent = t('t_' + U.page);
    $('#shopName').textContent = nm(S.shop);
    renderLowBadge();
    renderPage();
    tick();
  }
  function renderLowBadge() {
    const n = S.products.filter(p => stockState(p) !== 'ok').length;
    const b = $('#lowBadge');
    b.textContent = n || '';
    b.hidden = !n;
  }
  function tick() {
    const d = new Date();
    const days = t('days');
    $('#clock').innerHTML = '<b>' + esc(fmtTime(d.getTime())) + '</b><span>' + esc(days[d.getDay()] + ' · ' + fmtDate(d.getTime())) + '</span>';
  }

  // ---------- billing ----------
  function searchHits() {
    const q = U.q.trim().toLowerCase();
    return S.products.filter(p => {
      if (U.cat !== 'all' && p.cat !== U.cat) return false;
      if (!q) return true;
      return p.si.toLowerCase().includes(q) || p.en.toLowerCase().includes(q) || p.code === q || (p.barcode && p.barcode.includes(q));
    });
  }
  function renderBill() {
    $('#cats').innerHTML = [{ id: 'all', si: t('all'), en: t('all'), color: '#16181d', icon: '🛒' }].concat(CATS).map(c =>
      '<button class="chip' + (U.cat === c.id ? ' on' : '') + '" style="--c:' + c.color + '" data-act="cat" data-id="' + c.id + '">' +
      '<span class="chip-ic">' + c.icon + '</span>' + esc(nm(c)) + '</button>').join('');
    renderTiles();
    renderCart();
  }
  function renderTiles() {
    const hits = searchHits();
    if (!hits.length) { $('#tiles').innerHTML = '<div class="empty-tiles">🔍 ' + esc(t('noResults')) + '</div>'; return; }
    $('#tiles').innerHTML = hits.map(p => {
      const st = stockState(p);
      const c = catOf(p.cat);
      const inCart = U.cart.find(l => l.id === p.id);
      return '<button class="tile st-' + st + (inCart ? ' in' : '') + '" style="--c:' + c.color + '" data-act="add" data-id="' + p.id + '"' + (st === 'out' ? ' disabled' : '') + '>' +
        (inCart ? '<span class="tile-n">' + esc(qtyTxt(inCart.qty, p.unit)) + '</span>' : '') +
        '<span class="tile-ic">' + p.icon + '</span>' +
        '<span class="tile-name">' + esc(nm(p)) + '</span>' +
        '<span class="tile-price">' + money(p.price) + '<small> / ' + esc(unitTxt(p.unit)) + '</small></span>' +
        '<span class="tile-meta"><span>#' + esc(p.code) + '</span><span class="stk">' + (st === 'ok' ? '' : '<i>' + esc(t(st)) + '</i> ') + esc(qtyTxt(p.stock, p.unit)) + '</span></span>' +
        '</button>';
    }).join('');
  }
  function totals() {
    const sub = r2(U.cart.reduce((s, l) => s + prod(l.id).price * l.qty, 0));
    let disc = U.discType === 'pct' ? r2(sub * Math.min(100, Math.max(0, U.disc)) / 100) : r2(Math.max(0, U.disc));
    disc = Math.min(disc, sub);
    return { sub, disc, total: r2(sub - disc), count: U.cart.length };
  }
  function renderCart() {
    const tt = totals();
    const lines = U.cart.map(l => {
      const p = prod(l.id);
      return '<div class="line">' +
        '<span class="line-ic" style="--c:' + catOf(p.cat).color + '">' + p.icon + '</span>' +
        '<div class="line-name" title="' + esc(nm(p)) + '">' + esc(nm(p)) + '</div>' +
        '<div class="line-sub">' + num(p.price) + ' / ' + esc(unitTxt(p.unit)) + '</div>' +
        '<div class="qty">' +
        (p.unit === 'kg'
          ? '<button class="qty-kg" data-act="weigh" data-id="' + p.id + '">' + esc(qtyTxt(l.qty, 'kg')) + '</button>'
          : '<button data-act="dec" data-id="' + p.id + '" aria-label="-">−</button><span>' + l.qty + '</span><button data-act="inc" data-id="' + p.id + '" aria-label="+">+</button>') +
        '</div>' +
        '<div class="line-tot">' + num(p.price * l.qty) + '</div>' +
        '<button class="line-x" data-act="rm" data-id="' + p.id + '" aria-label="remove">×</button>' +
        '</div>';
    }).join('');
    $('#cart').innerHTML =
      '<div class="cart-head"><div><h2>' + esc(t('cart')) + '</h2><span>' + esc(t('billNo')) + ' #' + S.nextNo + '</span></div>' +
      (U.cart.length ? '<button class="ghost-btn" data-act="clear">' + esc(t('clear')) + '</button>' : '') +
      '<button class="cart-close" data-act="closecart" aria-label="close">×</button></div>' +
      '<div class="lines">' + (lines || '<div class="cart-empty"><div class="ce-ic">🧾</div><b>' + esc(t('emptyCart')) + '</b><span>' + esc(t('emptyHint')) + '</span></div>') + '</div>' +
      '<div class="cart-foot">' +
      '<div class="row"><span>' + esc(t('subtotal')) + ' <small>(' + tt.count + ' ' + esc(t('items')) + ')</small></span><b>' + money(tt.sub) + '</b></div>' +
      '<div class="row disc-row"><span>' + esc(t('discount')) + '</span>' +
      '<span class="disc-in"><input id="discIn" type="number" min="0" step="1" inputmode="decimal" value="' + (U.disc || '') + '" placeholder="0">' +
      '<span class="seg"><button class="' + (U.discType === 'rs' ? 'on' : '') + '" data-act="disctype" data-id="rs">Rs</button><button class="' + (U.discType === 'pct' ? 'on' : '') + '" data-act="disctype" data-id="pct">%</button></span></span>' +
      '<b class="neg">' + (tt.disc ? '− ' + money(tt.disc) : '') + '</b></div>' +
      '<div class="row grand"><span>' + esc(t('total')) + '</span><b>' + money(tt.total) + '</b></div>' +
      '<button class="pay-btn" data-act="pay"' + (U.cart.length ? '' : ' disabled') + '><span>' + esc(t('pay')) + '</span><b>' + money(tt.total) + '</b><kbd>F9</kbd></button>' +
      '</div>';
    const fab = $('#cartFab');
    fab.innerHTML = '<span class="fab-n">' + tt.count + '</span><span>' + esc(t('cart')) + '</span><b>' + money(tt.total) + '</b>';
    fab.classList.toggle('has', tt.count > 0);
  }
  function refreshBill() { renderTiles(); renderCart(); }

  function addToCart(p, qty, quiet) {
    if (!p) return;
    const line = U.cart.find(l => l.id === p.id);
    const want = r3((line ? line.qty : 0) + qty);
    if (want > p.stock + 1e-9) { toast(nm(p) + ': ' + t('notEnough') + ' ' + qtyTxt(p.stock, p.unit), 'bad'); return; }
    if (line) line.qty = want; else U.cart.push({ id: p.id, qty: want });
    if (!quiet) toast(t('added') + ': ' + nm(p) + ' × ' + qtyTxt(qty, p.unit), 'ok');
    refreshBill();
  }
  function setQty(p, qty) {
    const line = U.cart.find(l => l.id === p.id);
    if (qty > p.stock + 1e-9) { toast(nm(p) + ': ' + t('notEnough') + ' ' + qtyTxt(p.stock, p.unit), 'bad'); return false; }
    if (qty <= 0) U.cart = U.cart.filter(l => l.id !== p.id);
    else if (line) line.qty = r3(qty);
    else U.cart.push({ id: p.id, qty: r3(qty) });
    refreshBill();
    return true;
  }
  function tryAdd(p) {
    if (p.unit === 'kg') openWeigh(p);
    else addToCart(p, 1, true);
  }
  function findCode(q) {
    q = q.trim();
    return S.products.find(p => p.barcode === q || p.code === q);
  }

  // weight modal (loose items)
  function openWeigh(p) {
    const line = U.cart.find(l => l.id === p.id);
    const kg = line ? line.qty : 1;
    openModal(
      '<div class="m-head"><span class="m-ic" style="--c:' + catOf(p.cat).color + '">' + p.icon + '</span><div><h3>' + esc(nm(p)) + '</h3><span>' + money(p.price) + ' / kg · ' + esc(t('inStock')) + ' ' + esc(qtyTxt(p.stock, 'kg')) + '</span></div><button class="x" data-act="close">×</button></div>' +
      '<div class="weigh">' +
      '<label><span>' + esc(t('byWeight')) + '</span><input id="wKg" type="number" min="0" step="0.05" inputmode="decimal" value="' + kg + '"></label>' +
      '<label><span>' + esc(t('byAmount')) + '</span><input id="wRs" type="number" min="0" step="10" inputmode="decimal" value="' + r2(kg * p.price) + '"></label>' +
      '</div>' +
      '<div class="quick">' + [0.1, 0.25, 0.5, 1, 2, 5].map(v => '<button data-act="wq" data-id="' + v + '">' + (v < 1 ? v * 1000 + 'g' : v + 'kg') + '</button>').join('') + '</div>' +
      '<div class="quick">' + [50, 100, 200, 500, 1000].map(v => '<button data-act="wr" data-id="' + v + '">Rs. ' + v + '</button>').join('') + '</div>' +
      '<div class="m-total"><span>' + esc(t('amount')) + '</span><b id="wTot">' + money(kg * p.price) + '</b></div>' +
      '<div class="m-actions"><button class="btn ghost" data-act="close">' + esc(t('cancel')) + '</button><button class="btn primary" data-act="wok" data-id="' + p.id + '">' + esc(line ? t('update') : t('add')) + '</button></div>',
      'sm');
    const kgIn = $('#wKg'), rsIn = $('#wRs');
    const upd = (from) => {
      if (from === 'kg') rsIn.value = r2((+kgIn.value || 0) * p.price);
      else kgIn.value = r3((+rsIn.value || 0) / p.price);
      $('#wTot').textContent = money(r2((+kgIn.value || 0) * p.price));
    };
    kgIn.addEventListener('input', () => upd('kg'));
    rsIn.addEventListener('input', () => upd('rs'));
    U.weigh = { p, upd };
    setTimeout(() => { kgIn.focus(); kgIn.select(); }, 30);
  }
  function weighOk() {
    const p = U.weigh.p;
    const kg = r3(+$('#wKg').value || 0);
    if (setQty(p, kg)) closeModal();
  }

  // payment
  function openPay() {
    if (!U.cart.length) return;
    const tt = totals();
    U.pay = U.pay || { method: 'cash', given: '', cust: null };
    U.pay.total = tt.total;
    renderPay();
  }
  function renderPay() {
    const P = U.pay, total = P.total;
    let body = '';
    if (P.method === 'cash') {
      const given = +P.given || 0;
      const diff = r2(given - total);
      const notes = [...new Set([Math.ceil(total / 100) * 100, Math.ceil(total / 500) * 500, Math.ceil(total / 1000) * 1000, Math.ceil(total / 5000) * 5000])].filter(v => v > total).slice(0, 3);
      body = '<label class="big-in"><span>' + esc(t('given')) + '</span><input id="given" type="number" min="0" inputmode="decimal" value="' + esc(P.given) + '" placeholder="' + num(total) + '"></label>' +
        '<div class="quick"><button data-act="note" data-id="' + total + '">' + esc(t('exact')) + '</button>' + notes.map(v => '<button data-act="note" data-id="' + v + '">' + num(v).replace('.00', '') + '</button>').join('') + '</div>' +
        '<div class="change ' + (P.given === '' ? '' : diff < 0 ? 'short' : 'good') + '" id="chg">' + changeHtml(P) + '</div>';
    } else if (P.method === 'card') {
      body = '<div class="card-note">💳 ' + esc(t('cardRef')) + '</div>';
    } else {
      body = '<div class="cust-pick">' + S.customers.map(c => {
        const bal = custBalance(c);
        return '<button class="cp' + (P.cust === c.id ? ' on' : '') + '" data-act="pcust" data-id="' + c.id + '"><span class="av">' + esc(nm(c).slice(0, 1)) + '</span><span class="cp-n">' + esc(nm(c)) + '<small>' + esc(t('balance')) + ' ' + money(bal) + '</small></span></button>';
      }).join('') + '</div>';
      if (P.cust) {
        const c = S.customers.find(x => x.id === P.cust);
        const after = r2(custBalance(c) + total);
        body += '<div class="change ' + (after > c.limit ? 'short' : 'good') + '"><span>' + esc(t('afterBill')) + '</span><b>' + money(after) + '</b><small>' + esc(t('limit')) + ' ' + money(c.limit) + (after > c.limit ? ' · ⚠ ' + esc(t('overLimit')) : '') + '</small></div>';
      }
    }
    const can = P.method === 'card' || (P.method === 'cash' && (P.given === '' || +P.given >= total)) || (P.method === 'credit' && P.cust);
    openModal(
      '<div class="m-head"><div><h3>' + esc(t('payTitle')) + '</h3><span>' + esc(t('billNo')) + ' #' + S.nextNo + '</span></div><button class="x" data-act="close">×</button></div>' +
      '<div class="pay-total"><span>' + esc(t('total')) + '</span><b>' + money(total) + '</b></div>' +
      '<div class="tabs">' + ['cash', 'card', 'credit'].map(m => '<button class="' + (P.method === m ? 'on' : '') + '" data-act="pmethod" data-id="' + m + '">' + ({ cash: '💵 ', card: '💳 ', credit: '📒 ' })[m] + esc(t(m)) + '</button>').join('') + '</div>' +
      '<div class="pay-body">' + body + '</div>' +
      '<div class="m-actions"><button class="btn ghost" data-act="close">' + esc(t('cancel')) + '</button><button class="btn primary big" id="payGo" data-act="confirm"' + (can ? '' : ' disabled') + '>✓ ' + esc(t('complete')) + '</button></div>',
      'md');
    const g = $('#given');
    if (g) {
      g.addEventListener('input', () => {
        P.given = g.value;
        const diff = r2((+g.value || 0) - total);
        const box = $('#chg');
        box.className = 'change ' + (g.value === '' ? '' : diff < 0 ? 'short' : 'good');
        box.innerHTML = changeHtml(P);
        $('#payGo').disabled = !(g.value === '' || +g.value >= total);
      });
      setTimeout(() => g.focus(), 30);
    }
  }
  function changeHtml(P) {
    if (P.given === '') return '<span>' + esc(t('change')) + '</span><b>' + money(0) + '</b>';
    const diff = r2((+P.given || 0) - P.total);
    return diff < 0 ? '<span>' + esc(t('short')) + '</span><b>' + money(-diff) + '</b>' : '<span>' + esc(t('change')) + '</span><b>' + money(diff) + '</b>';
  }
  function confirmPay() {
    const P = U.pay;
    const tt = totals();
    if (!U.cart.length) return;
    if (P.method === 'cash' && P.given !== '' && +P.given < tt.total) return;
    if (P.method === 'credit' && !P.cust) return;
    const items = U.cart.map(l => { const p = prod(l.id); return { id: p.id, si: p.si, en: p.en, unit: p.unit, price: p.price, qty: l.qty }; });
    const bill = { no: S.nextNo++, t: Date.now(), items, sub: tt.sub, disc: tt.disc, total: tt.total, method: P.method };
    if (P.method === 'cash') { const g = P.given === '' ? tt.total : +P.given; bill.paid = r2(g); bill.change = r2(g - tt.total); } else bill.paid = tt.total;
    if (P.method === 'credit') {
      const c = S.customers.find(x => x.id === P.cust);
      bill.cust = c.id;
      c.tx.push({ t: bill.t, type: 'sale', amt: bill.total, bill: bill.no });
    }
    items.forEach(l => { const p = prod(l.id); p.stock = r3(p.stock - l.qty); });
    S.bills.push(bill);
    save();
    U.cart = []; U.disc = 0; U.discType = 'rs'; U.pay = null;
    document.body.classList.remove('cart-open');
    renderLowBadge();
    refreshBill();
    showReceipt(bill, true);
    const lowNow = items.map(l => prod(l.id)).filter(p => p && stockState(p) !== 'ok');
    if (lowNow.length) setTimeout(() => toast('⚠ ' + lowNow.map(nm).join(', ') + ': ' + t('low'), 'warn'), 400);
  }

  // receipt
  function receiptHtml(b) {
    const c = b.cust ? S.customers.find(x => x.id === b.cust) : null;
    const rows = b.items.map(l => '<tr><td colspan="3" class="rn">' + esc(nm(l)) + '</td></tr>' +
      '<tr class="rq"><td>' + esc(qtyTxt(l.qty, l.unit)) + ' × ' + num(l.price) + '</td><td></td><td>' + num(l.price * l.qty) + '</td></tr>').join('');
    return '<div class="rcpt">' +
      '<div class="r-shop">' + esc(nm(S.shop)) + '</div>' +
      '<div class="r-addr">' + esc(S.shop.addr) + '<br>' + esc(S.shop.phone) + '</div>' +
      '<div class="r-meta"><span>' + esc(t('billNo')) + ': #' + b.no + '</span><span>' + fmtDate(b.t) + ' ' + esc(fmtTime(b.t)) + '</span></div>' +
      '<table>' + rows + '</table>' +
      '<div class="r-tot"><span>' + esc(t('subtotal')) + '</span><span>' + num(b.sub) + '</span></div>' +
      (b.disc ? '<div class="r-tot"><span>' + esc(t('discount')) + '</span><span>-' + num(b.disc) + '</span></div>' : '') +
      '<div class="r-tot r-grand"><span>' + esc(t('total')) + '</span><span>' + money(b.total) + '</span></div>' +
      '<div class="r-tot"><span>' + esc(t('paidBy')) + '</span><span>' + esc(t(b.method)) + '</span></div>' +
      (b.method === 'cash' ? '<div class="r-tot"><span>' + esc(t('paid')) + '</span><span>' + num(b.paid) + '</span></div><div class="r-tot"><span>' + esc(t('change')) + '</span><span>' + num(b.change) + '</span></div>' : '') +
      (c ? '<div class="r-tot"><span>' + esc(t('cust')) + '</span><span>' + esc(nm(c)) + '</span></div><div class="r-tot"><span>' + esc(t('newBalance')) + '</span><span>' + num(balanceAfter(c, b)) + '</span></div>' : '') +
      '<div class="r-foot">' + esc(U.lang === 'si' ? S.shop.footer_si : S.shop.footer_en) + '</div>' +
      '<div class="r-pow">Software by Samsoft · 070 480 8744</div>' +
      '</div>';
  }
  function balanceAfter(c, b) {
    return r2(c.tx.filter(x => x.t <= b.t).reduce((s, x) => s + (x.type === 'pay' ? -x.amt : x.amt), 0));
  }
  function receiptText(b) {
    const L = [];
    L.push('*' + nm(S.shop) + '*');
    L.push(t('billNo') + ': #' + b.no + '  ' + fmtDate(b.t) + ' ' + fmtTime(b.t));
    L.push('------------------------');
    b.items.forEach(l => L.push(nm(l) + '\n  ' + qtyTxt(l.qty, l.unit) + ' x ' + num(l.price) + ' = ' + num(l.price * l.qty)));
    L.push('------------------------');
    if (b.disc) L.push(t('discount') + ': -' + num(b.disc));
    L.push('*' + t('total') + ': ' + money(b.total) + '*');
    L.push(t('paidBy') + ': ' + t(b.method));
    L.push('');
    L.push(U.lang === 'si' ? S.shop.footer_si : S.shop.footer_en);
    return L.join('\n');
  }
  function showReceipt(b, fresh) {
    const c = b.cust ? S.customers.find(x => x.id === b.cust) : null;
    openModal(
      '<div class="m-head">' + (fresh ? '<span class="done-ic">✓</span>' : '') + '<div><h3>' + esc(fresh ? t('done') : t('receipt') + ' #' + b.no) + '</h3><span>' + money(b.total) + ' · ' + esc(t(b.method)) + (b.method === 'cash' && b.change ? ' · ' + esc(t('change')) + ' ' + money(b.change) : '') + '</span></div><button class="x" data-act="close">×</button></div>' +
      '<div class="rcpt-wrap">' + receiptHtml(b) + '</div>' +
      '<div class="m-actions three">' +
      '<button class="btn ghost" data-act="print" data-id="' + b.no + '">🖨 ' + esc(t('print')) + '</button>' +
      '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(c && !c.demo ? c.phone.replace(/\D/g, '').replace(/^0/, '94') : '', receiptText(b))) + '">WhatsApp</a>' +
      (fresh ? '<button class="btn primary" data-act="close">＋ ' + esc(t('newBill')) + '</button>' : '<button class="btn primary" data-act="close">' + esc(t('close')) + '</button>') +
      '</div>', 'rc');
  }
  function printBill(no) {
    const b = S.bills.find(x => x.no === no);
    if (!b) return;
    $('#printArea').innerHTML = receiptHtml(b);
    window.print();
  }

  // ---------- reports ----------
  function renderSales() {
    const now = Date.now(), d0 = dayStart(now);
    const today = S.bills.filter(b => b.t >= d0);
    const ySame = S.bills.filter(b => b.t >= d0 - DAY && b.t <= now - DAY);
    const sum = a => r2(a.reduce((s, b) => s + b.total, 0));
    const tot = sum(today), yTot = sum(ySame);
    const pct = yTot ? Math.round((tot - yTot) / yTot * 100) : 0;
    const credit = sum(today.filter(b => b.method === 'credit'));

    // by hour
    const hours = []; for (let h = 6; h <= 21; h++) hours.push(h);
    const byH = hours.map(h => sum(today.filter(b => new Date(b.t).getHours() === h)));
    const maxH = Math.max(1, ...byH);
    const curH = new Date().getHours();
    // payment mix
    const mix = ['cash', 'card', 'credit'].map(m => ({ m, v: sum(today.filter(b => b.method === m)) }));
    const mixCol = { cash: '#138a4a', card: '#3b63c4', credit: '#ff5a1f' };
    let acc = 0;
    const grad = tot ? mix.map(x => { const a = acc; acc += x.v / tot * 360; return mixCol[x.m] + ' ' + a + 'deg ' + acc + 'deg'; }).join(',') : '#e6e8e2 0deg 360deg';
    // week
    const week = []; for (let i = 6; i >= 0; i--) { const s = d0 - i * DAY; week.push({ s, v: sum(S.bills.filter(b => b.t >= s && b.t < s + DAY)) }); }
    const maxW = Math.max(1, ...week.map(w => w.v));
    // top items
    const agg = new Map();
    today.forEach(b => b.items.forEach(l => {
      const a = agg.get(l.id) || { l, qty: 0, v: 0 };
      a.qty = r3(a.qty + l.qty); a.v = r2(a.v + l.price * l.qty); agg.set(l.id, a);
    }));
    const top = Array.from(agg.values()).sort((a, b) => b.v - a.v).slice(0, 6);
    const maxT = Math.max(1, ...top.map(x => x.v));

    const kpi = (ic, label, val, sub, cls) => '<div class="kpi ' + (cls || '') + '"><span class="kpi-ic">' + ic + '</span><div><span>' + esc(label) + '</span><b>' + val + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div></div>';
    $('#pg-sales').innerHTML =
      '<div class="kpis">' +
      kpi('💰', t('todaySales'), money(tot), '<em class="' + (pct >= 0 ? 'up' : 'down') + '">' + (pct >= 0 ? '▲ ' : '▼ ') + Math.abs(pct) + '%</em> ' + esc(t('vsYesterday')), 'hero') +
      kpi('🧾', t('bills'), today.length, '') +
      kpi('🛍️', t('avgBill'), money(today.length ? tot / today.length : 0), '') +
      kpi('📒', t('creditToday'), money(credit), '') +
      '</div>' +
      '<div class="grid-2">' +
      '<div class="panel"><h3>' + esc(t('hourly')) + '</h3><div class="bars hours">' + hours.map((h, i) =>
        '<div class="bar' + (h === curH ? ' now' : '') + '" title="' + h + ':00 · ' + money(byH[i]) + '"><i style="height:' + (byH[i] / maxH * 100) + '%"></i><span>' + (h % 12 || 12) + '</span></div>').join('') + '</div></div>' +
      '<div class="panel"><h3>' + esc(t('payMix')) + '</h3><div class="mix"><div class="donut" style="background:conic-gradient(' + grad + ')"><div><b>' + today.length + '</b><span>' + esc(t('bills')) + '</span></div></div><ul>' +
      mix.map(x => '<li><i style="background:' + mixCol[x.m] + '"></i><span>' + esc(t(x.m)) + '</span><b>' + money(x.v) + '</b><small>' + (tot ? Math.round(x.v / tot * 100) : 0) + '%</small></li>').join('') + '</ul></div></div>' +
      '</div>' +
      '<div class="grid-2">' +
      '<div class="panel"><h3>' + esc(t('week')) + '</h3><div class="bars week">' + week.map((w, i) =>
        '<div class="bar' + (i === 6 ? ' now' : '') + '" title="' + fmtDate(w.s) + ' · ' + money(w.v) + '"><em>' + (w.v >= 1000 ? Math.round(w.v / 1000) + 'k' : Math.round(w.v)) + '</em><i style="height:' + (w.v / maxW * 100) + '%"></i><span>' + esc(i === 6 ? t('today') : t('dshort')[new Date(w.s).getDay()]) + '</span></div>').join('') + '</div></div>' +
      '<div class="panel"><h3>' + esc(t('topItems')) + '</h3><div class="top">' + (top.length ? top.map(x => {
        const p = prod(x.l.id);
        return '<div class="top-row"><span class="top-ic" style="--c:' + catOf(p ? p.cat : 'grain').color + '">' + (p ? p.icon : '•') + '</span><div class="top-main"><div><span>' + esc(nm(x.l)) + '</span><b>' + money(x.v) + '</b></div><div class="top-bar"><i style="width:' + (x.v / maxT * 100) + '%;background:' + catOf(p ? p.cat : 'grain').color + '"></i></div><small>' + esc(qtyTxt(x.qty, x.l.unit)) + '</small></div></div>';
      }).join('') : '<p class="muted">' + esc(t('noBills')) + '</p>') + '</div></div>' +
      '</div>' +
      '<div class="panel"><h3>' + esc(t('todayBills')) + ' <small>(' + today.length + ')</small></h3>' +
      (today.length ? '<div class="tbl-wrap"><table class="tbl bills-tbl"><thead><tr><th>#</th><th>' + esc(t('time')) + '</th><th>' + esc(t('items')) + '</th><th>' + esc(t('method')) + '</th><th class="r">' + esc(t('total')) + '</th><th></th></tr></thead><tbody>' +
        today.slice().reverse().map(b => '<tr class="click" data-act="viewbill" data-id="' + b.no + '"><td><b>' + b.no + '</b></td><td>' + esc(fmtTime(b.t)) + '</td><td>' + b.items.length + '</td><td><span class="pill m-' + b.method + '">' + esc(t(b.method)) + '</span>' +
          (b.cust ? ' <small class="muted">' + esc(nm(S.customers.find(c => c.id === b.cust) || {})) + '</small>' : '') + '</td><td class="r"><b>' + money(b.total) + '</b></td><td class="r"><button class="link-btn" data-act="viewbill" data-id="' + b.no + '">' + esc(t('view')) + '</button></td></tr>').join('') +
        '</tbody></table></div>' : '<p class="muted">' + esc(t('noBills')) + '</p>') +
      '</div>';
  }

  // ---------- stock ----------
  function renderStock() {
    const low = S.products.filter(p => stockState(p) !== 'ok');
    const value = r2(S.products.reduce((s, p) => s + Math.max(0, p.stock) * p.price, 0));
    const q = U.stockQ.trim().toLowerCase();
    let list = U.stockFilter === 'low' ? low : S.products;
    if (q) list = list.filter(p => p.si.toLowerCase().includes(q) || p.en.toLowerCase().includes(q) || p.code === q || (p.barcode && p.barcode.includes(q)));
    list = list.slice().sort((a, b) => (stockState(a) === 'ok') - (stockState(b) === 'ok') || a.id - b.id);
    const box = $('#pg-stock');
    const hadFocus = document.activeElement && document.activeElement.id === 'stockQ';
    box.innerHTML =
      '<div class="kpis three">' +
      '<div class="kpi"><span class="kpi-ic">📦</span><div><span>' + esc(t('itemsN')) + '</span><b>' + S.products.length + '</b></div></div>' +
      '<div class="kpi warn"><span class="kpi-ic">⚠️</span><div><span>' + esc(t('lowItems')) + '</span><b>' + low.length + '</b></div></div>' +
      '<div class="kpi"><span class="kpi-ic">💎</span><div><span>' + esc(t('stockValue')) + '</span><b>' + money(value) + '</b></div></div>' +
      '</div>' +
      (low.length ? '<div class="alert">⚠ ' + esc(t('lowAlert').replace('{n}', low.length)) + ': ' + low.slice(0, 6).map(p => '<b>' + esc(nm(p)) + '</b>').join(', ') + (low.length > 6 ? '…' : '') + '</div>' : '') +
      '<div class="panel"><div class="toolbar">' +
      '<label class="search sm"><svg viewBox="0 0 24 24"><path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 3-4.3-4.3"/></svg><input id="stockQ" type="search" placeholder="' + esc(t('search')) + '" value="' + esc(U.stockQ) + '"></label>' +
      '<span class="seg big"><button class="' + (U.stockFilter === 'all' ? 'on' : '') + '" data-act="sfilter" data-id="all">' + esc(t('filterAll')) + '</button><button class="' + (U.stockFilter === 'low' ? 'on' : '') + '" data-act="sfilter" data-id="low">' + esc(t('filterLow')) + ' (' + low.length + ')</button></span>' +
      '<button class="btn primary" data-act="newprod">＋ ' + esc(t('newProd')) + '</button>' +
      '</div>' +
      '<div class="tbl-wrap"><table class="tbl stock-tbl"><thead><tr><th>' + esc(t('item')) + '</th><th>' + esc(t('code')) + '</th><th class="r">' + esc(t('price')) + '</th><th class="r">' + esc(t('stock')) + '</th><th class="r">' + esc(t('reorder')) + '</th><th>' + esc(t('status')) + '</th><th></th></tr></thead><tbody>' +
      (list.length ? list.map(p => {
        const st = stockState(p);
        return '<tr><td><span class="ti"><span class="ti-ic" style="--c:' + catOf(p.cat).color + '">' + p.icon + '</span><span><b>' + esc(nm(p)) + '</b><small>' + esc(nm(catOf(p.cat))) + '</small></span></span></td>' +
          '<td><span class="mono">' + esc(p.code) + '</span>' + (p.barcode ? '<small class="mono bc">' + esc(p.barcode) + '</small>' : '') + '</td>' +
          '<td class="r">' + money(p.price) + '<small class="muted"> / ' + esc(unitTxt(p.unit)) + '</small></td>' +
          '<td class="r"><b>' + esc(qtyTxt(p.stock, p.unit)) + '</b></td>' +
          '<td class="r muted">' + esc(qtyTxt(p.reorder, p.unit)) + '</td>' +
          '<td><span class="pill s-' + st + '">' + esc(t(st)) + '</span></td>' +
          '<td class="r nowrap"><button class="btn sm soft" data-act="grn" data-id="' + p.id + '">＋ ' + esc(t('addStock')) + '</button> <button class="btn sm ghost" data-act="editprod" data-id="' + p.id + '">' + esc(t('edit')) + '</button></td></tr>';
      }).join('') : '<tr><td colspan="7" class="muted center">' + esc(t('noResults')) + '</td></tr>') +
      '</tbody></table></div></div>';
    const sq = $('#stockQ');
    sq.addEventListener('input', () => { U.stockQ = sq.value; renderStock(); });
    if (hadFocus) { sq.focus(); sq.setSelectionRange(sq.value.length, sq.value.length); }
  }
  function openGrn(p) {
    openModal(
      '<div class="m-head"><span class="m-ic" style="--c:' + catOf(p.cat).color + '">' + p.icon + '</span><div><h3>' + esc(t('addStockTitle')) + '</h3><span>' + esc(nm(p)) + ' · ' + esc(t('stock')) + ' ' + esc(qtyTxt(p.stock, p.unit)) + '</span></div><button class="x" data-act="close">×</button></div>' +
      '<label class="big-in"><span>' + esc(t('qtyRecv')) + ' (' + esc(unitTxt(p.unit)) + ')</span><input id="grnQ" type="number" min="0" step="' + (p.unit === 'kg' ? '0.5' : '1') + '" inputmode="decimal" placeholder="0"></label>' +
      '<div class="quick">' + (p.unit === 'kg' ? [5, 10, 25, 50] : [6, 12, 24, 48]).map(v => '<button data-act="grnq" data-id="' + v + '">+' + v + '</button>').join('') + '</div>' +
      '<div class="m-total"><span>' + esc(t('newStock')) + '</span><b id="grnNew">' + esc(qtyTxt(p.stock, p.unit)) + '</b></div>' +
      '<div class="m-actions"><button class="btn ghost" data-act="close">' + esc(t('cancel')) + '</button><button class="btn primary" data-act="grnok" data-id="' + p.id + '">' + esc(t('save')) + '</button></div>', 'sm');
    const inp = $('#grnQ');
    inp.addEventListener('input', () => { $('#grnNew').textContent = qtyTxt(r3(p.stock + (+inp.value || 0)), p.unit); });
    setTimeout(() => inp.focus(), 30);
  }
  function openProd(p) {
    const isNew = !p;
    p = p || { si: '', en: '', cat: 'grain', unit: 'each', price: '', stock: '', reorder: 5, barcode: '' };
    const opt = (v, l, sel) => '<option value="' + v + '"' + (v === sel ? ' selected' : '') + '>' + esc(l) + '</option>';
    openModal(
      '<div class="m-head"><div><h3>' + esc(isNew ? t('newProd') : t('edit')) + '</h3>' + (isNew ? '' : '<span>#' + esc(p.code) + '</span>') + '</div><button class="x" data-act="close">×</button></div>' +
      '<div class="form">' +
      '<label><span>' + esc(t('nameSi')) + '</span><input id="pSi" value="' + esc(p.si) + '"></label>' +
      '<label><span>' + esc(t('nameEn')) + '</span><input id="pEn" value="' + esc(p.en) + '"></label>' +
      '<label><span>' + esc(t('category')) + '</span><select id="pCat">' + CATS.map(c => opt(c.id, nm(c), p.cat)).join('') + '</select></label>' +
      '<label><span>' + esc(t('unit')) + '</span><select id="pUnit">' + ['each', 'pkt', 'bottle', 'kg'].map(u => opt(u, unitTxt(u), p.unit)).join('') + '</select></label>' +
      '<label><span>' + esc(t('price')) + ' (Rs.)</span><input id="pPrice" type="number" min="0" step="1" inputmode="decimal" value="' + esc(p.price) + '"></label>' +
      (isNew ? '<label><span>' + esc(t('stock')) + '</span><input id="pStock" type="number" min="0" step="1" inputmode="decimal" value="' + esc(p.stock) + '"></label>' : '') +
      '<label><span>' + esc(t('reorder')) + '</span><input id="pRe" type="number" min="0" step="1" inputmode="decimal" value="' + esc(p.reorder) + '"></label>' +
      '<label><span>' + esc(t('barcode')) + ' <small>(' + esc(t('optional')) + ')</small></span><input id="pBc" inputmode="numeric" value="' + esc(p.barcode) + '"></label>' +
      '</div>' +
      '<div class="m-actions"><button class="btn ghost" data-act="close">' + esc(t('cancel')) + '</button><button class="btn primary" data-act="saveprod" data-id="' + (isNew ? '' : p.id) + '">' + esc(t('save')) + '</button></div>', 'md');
    setTimeout(() => $('#pSi').focus(), 30);
  }
  function saveProd(id) {
    const si = $('#pSi').value.trim(), en = $('#pEn').value.trim();
    const price = r2(+$('#pPrice').value || 0);
    if (!(si || en) || price <= 0) { toast(t('needName'), 'bad'); return; }
    const cat = $('#pCat').value;
    const fields = { si: si || en, en: en || si, cat, unit: $('#pUnit').value, price, reorder: Math.max(0, +$('#pRe').value || 0), barcode: $('#pBc').value.replace(/\D/g, '') };
    if (id) Object.assign(prod(+id), fields);
    else {
      const nid = S.nextId++;
      S.products.push(Object.assign({ id: nid, code: String(100 + nid), stock: Math.max(0, +$('#pStock').value || 0), icon: catOf(cat).icon, pop: 1 }, fields));
    }
    save(); closeModal(); toast(t('prodSaved'), 'ok'); renderLowBadge(); renderStock();
  }

  // ---------- credit book ----------
  function renderCredit() {
    const list = S.customers.map(c => ({ c, bal: custBalance(c) })).sort((a, b) => b.bal - a.bal);
    const out = r2(list.reduce((s, x) => s + Math.max(0, x.bal), 0));
    const over = list.filter(x => x.bal > x.c.limit).length;
    const sel = U.cust && S.customers.find(c => c.id === U.cust);
    let detail = '<div class="pick-hint">📒 ' + esc(t('pickCust')) + '</div>';
    if (sel) {
      const bal = custBalance(sel);
      const used = Math.min(100, sel.limit ? bal / sel.limit * 100 : 0);
      let run = 0;
      const rows = sel.tx.map(x => { run = r2(run + (x.type === 'pay' ? -x.amt : x.amt)); return { x, run }; }).reverse();
      detail =
        '<button class="back-btn" data-act="custback">‹ ' + esc(t('back')) + '</button>' +
        '<div class="cd-head"><span class="av lg">' + esc(nm(sel).slice(0, 1)) + '</span><div><h3>' + esc(nm(sel)) + '</h3><span>📞 ' + esc(sel.phone) + '</span></div></div>' +
        '<div class="cd-bal ' + (bal > sel.limit ? 'over' : '') + '"><div><span>' + esc(t('balance')) + '</span><b>' + money(bal) + '</b></div><div class="r"><span>' + esc(t('limit')) + '</span><b>' + money(sel.limit) + '</b></div>' +
        '<div class="meter"><i style="width:' + Math.max(0, used) + '%"></i></div>' + (bal > sel.limit ? '<small>⚠ ' + esc(t('overLimit')) + '</small>' : '') + '</div>' +
        '<div class="cd-actions"><button class="btn primary" data-act="cpay" data-id="' + sel.id + '">💵 ' + esc(t('recordPay')) + '</button>' +
        '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(sel.demo ? '' : sel.phone.replace(/\D/g, '').replace(/^0/, '94'), t('remindMsg').replace('{name}', nm(sel)).replace('{shop}', nm(S.shop)).replace('{amt}', money(bal)))) + '">' + esc(t('remind')) + '</a></div>' +
        '<h4>' + esc(t('history')) + '</h4><div class="tx">' + rows.map(({ x, run }) =>
          '<div class="tx-row t-' + x.type + '"><span class="tx-ic">' + (x.type === 'pay' ? '↓' : x.type === 'open' ? '•' : '↑') + '</span><div><b>' + esc(t('tx_' + x.type)) + (x.bill ? ' <button class="link-btn" data-act="viewbill" data-id="' + x.bill + '">#' + x.bill + '</button>' : '') + '</b><small>' + fmtDate(x.t) + ' · ' + esc(fmtTime(x.t)) + '</small></div><div class="r"><b>' + (x.type === 'pay' ? '− ' : '+ ') + num(x.amt) + '</b><small>' + num(run) + '</small></div></div>').join('') + '</div>';
    }
    $('#pg-credit').innerHTML =
      '<div class="kpis three">' +
      '<div class="kpi hero"><span class="kpi-ic">📒</span><div><span>' + esc(t('outstanding')) + '</span><b>' + money(out) + '</b></div></div>' +
      '<div class="kpi"><span class="kpi-ic">👥</span><div><span>' + esc(t('customers')) + '</span><b>' + list.length + '</b></div></div>' +
      '<div class="kpi warn"><span class="kpi-ic">⚠️</span><div><span>' + esc(t('overLimitN')) + '</span><b>' + over + '</b></div></div>' +
      '</div>' +
      '<div class="credit-grid' + (sel ? ' has-sel' : '') + '">' +
      '<div class="panel cust-list"><div class="toolbar"><h3>' + esc(t('customers')) + '</h3><button class="btn primary sm" data-act="newcust">＋ ' + esc(t('newCust')) + '</button></div>' +
      list.map(({ c, bal }) => '<button class="cust' + (sel && sel.id === c.id ? ' on' : '') + '" data-act="selcust" data-id="' + c.id + '"><span class="av">' + esc(nm(c).slice(0, 1)) + '</span><span class="cn"><b>' + esc(nm(c)) + '</b><small>' + esc(c.phone) + '</small></span><span class="cb ' + (bal > c.limit ? 'over' : '') + '"><b>' + money(bal) + '</b><small>' + (bal > c.limit ? '⚠ ' + esc(t('overLimitN')) : esc(t('limit')) + ' ' + num(c.limit).replace('.00', '')) + '</small></span></button>').join('') +
      '</div>' +
      '<div class="panel cust-detail">' + detail + '</div>' +
      '</div>';
  }
  function openCustPay(c) {
    const bal = custBalance(c);
    openModal(
      '<div class="m-head"><span class="av">' + esc(nm(c).slice(0, 1)) + '</span><div><h3>' + esc(t('recordPay')) + '</h3><span>' + esc(nm(c)) + ' · ' + esc(t('balance')) + ' ' + money(bal) + '</span></div><button class="x" data-act="close">×</button></div>' +
      '<label class="big-in"><span>' + esc(t('amount')) + ' (Rs.)</span><input id="cpAmt" type="number" min="0" inputmode="decimal" placeholder="0"></label>' +
      '<div class="quick">' + [500, 1000, 2000, 5000].filter(v => v < bal).map(v => '<button data-act="cpq" data-id="' + v + '">' + v + '</button>').join('') + (bal > 0 ? '<button data-act="cpq" data-id="' + bal + '">' + num(bal) + '</button>' : '') + '</div>' +
      '<div class="m-actions"><button class="btn ghost" data-act="close">' + esc(t('cancel')) + '</button><button class="btn primary" data-act="cpok" data-id="' + c.id + '">' + esc(t('save')) + '</button></div>', 'sm');
    setTimeout(() => $('#cpAmt').focus(), 30);
  }
  function openNewCust() {
    openModal(
      '<div class="m-head"><div><h3>' + esc(t('newCust')) + '</h3></div><button class="x" data-act="close">×</button></div>' +
      '<div class="form">' +
      '<label class="full"><span>' + esc(t('name')) + '</span><input id="ncName"></label>' +
      '<label><span>' + esc(t('phone')) + '</span><input id="ncPhone" inputmode="tel" placeholder="07X XXX XXXX"></label>' +
      '<label><span>' + esc(t('limit')) + ' (Rs.)</span><input id="ncLimit" type="number" min="0" inputmode="decimal" value="10000"></label>' +
      '</div>' +
      '<div class="m-actions"><button class="btn ghost" data-act="close">' + esc(t('cancel')) + '</button><button class="btn primary" data-act="ncok">' + esc(t('save')) + '</button></div>', 'sm');
    setTimeout(() => $('#ncName').focus(), 30);
  }

  // ---------- settings ----------
  function renderSettings() {
    const sh = S.shop;
    const f = (id, label, val) => '<label><span>' + esc(t(label)) + '</span><input id="' + id + '" value="' + esc(val) + '"></label>';
    $('#pg-settings').innerHTML =
      '<div class="grid-2 settings">' +
      '<div class="panel"><h3>' + esc(t('shopInfo')) + '</h3><div class="form">' +
      f('sSi', 'shopSi', sh.si) + f('sEn', 'shopEn', sh.en) + f('sAddr', 'address', sh.addr) + f('sPhone', 'phone', sh.phone) +
      f('sFSi', 'footerSi', sh.footer_si) + f('sFEn', 'footerEn', sh.footer_en) +
      '</div><div class="m-actions"><button class="btn primary" data-act="saveshop">' + esc(t('save')) + '</button></div></div>' +
      '<div class="stack">' +
      '<div class="panel"><h3>' + esc(t('language')) + '</h3><span class="seg big"><button class="' + (U.lang === 'si' ? 'on' : '') + '" data-act="setlang" data-id="si">සිංහල</button><button class="' + (U.lang === 'en' ? 'on' : '') + '" data-act="setlang" data-id="en">English</button></span></div>' +
      '<div class="panel"><h3>' + esc(t('demoData')) + '</h3><p class="muted">' + esc(t('resetTxt')) + '</p><button class="btn ghost" data-act="reset">↺ ' + esc(t('reset')) + '</button></div>' +
      '<div class="panel promo"><h3>' + esc(t('aboutT')) + '</h3><p>' + esc(t('aboutP')) + '</p><ul>' +
      ['f1', 'f2', 'f3', 'f4', 'f5'].map(k => '<li>' + esc(t(k)) + '</li>').join('') + '</ul>' +
      '<a class="btn wa big" target="_blank" rel="noopener" href="' + esc(waLink(WA_NUMBER, t('waWelcome'))) + '">' + esc(t('talk')) + '</a></div>' +
      '</div></div>';
  }

  // ---------- modal ----------
  let lastFocus = null;
  function openModal(html, size) {
    if ($('#modalWrap').hidden) lastFocus = document.activeElement;
    const m = $('#modal');
    m.className = 'modal ' + (size || '');
    m.innerHTML = html;
    $('#modalWrap').hidden = false;
    document.body.classList.add('modal-on');
  }
  function closeModal() {
    $('#modalWrap').hidden = true;
    $('#modal').innerHTML = '';
    document.body.classList.remove('modal-on');
    U.weigh = null;
    if (U.page === 'bill' && window.matchMedia('(min-width: 900px)').matches) $('#q').focus();
    else if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ---------- events ----------
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) {
      if (e.target.id === 'modalWrap') closeModal();
      return;
    }
    const a = el.dataset.act, id = el.dataset.id;
    switch (a) {
      case 'nav': go(id); break;
      case 'lang': U.lang = U.lang === 'si' ? 'en' : 'si'; applyLang(); break;
      case 'setlang': U.lang = id; applyLang(); break;
      case 'cat': U.cat = id; renderBill(); break;
      case 'add': tryAdd(prod(+id)); break;
      case 'inc': { const p = prod(+id); const l = U.cart.find(x => x.id === p.id); setQty(p, l.qty + 1); break; }
      case 'dec': { const p = prod(+id); const l = U.cart.find(x => x.id === p.id); setQty(p, l.qty - 1); break; }
      case 'rm': U.cart = U.cart.filter(l => l.id !== +id); refreshBill(); break;
      case 'weigh': openWeigh(prod(+id)); break;
      case 'wq': $('#wKg').value = id; U.weigh.upd('kg'); break;
      case 'wr': $('#wRs').value = id; U.weigh.upd('rs'); break;
      case 'wok': weighOk(); break;
      case 'clear': U.cart = []; U.disc = 0; refreshBill(); break;
      case 'disctype': U.discType = id; renderCart(); break;
      case 'tryscan': {
        const coded = S.products.filter(p => p.barcode && p.stock >= 1);
        const p = coded[Math.floor(Math.random() * coded.length)];
        const q = $('#q');
        q.value = p.barcode; U.q = '';
        el.classList.add('beep'); setTimeout(() => el.classList.remove('beep'), 400);
        setTimeout(() => { addToCart(p, 1, true); toast(t('scanned') + ': ' + p.barcode + ' → ' + nm(p), 'ok'); q.value = ''; }, 350);
        break;
      }
      case 'opencart': document.body.classList.add('cart-open'); break;
      case 'closecart': document.body.classList.remove('cart-open'); break;
      case 'pay': openPay(); break;
      case 'pmethod': U.pay.method = id; renderPay(); break;
      case 'note': U.pay.given = String(id); renderPay(); break;
      case 'pcust': U.pay.cust = id; renderPay(); break;
      case 'confirm': confirmPay(); break;
      case 'print': printBill(+id); break;
      case 'viewbill': { const b = S.bills.find(x => x.no === +id); if (b) showReceipt(b, false); break; }
      case 'close': closeModal(); break;
      case 'sfilter': U.stockFilter = id; renderStock(); break;
      case 'grn': openGrn(prod(+id)); break;
      case 'grnq': { const i = $('#grnQ'); i.value = r3((+i.value || 0) + (+id)); i.dispatchEvent(new Event('input')); break; }
      case 'grnok': {
        const p = prod(+id); const q = +$('#grnQ').value || 0;
        if (q > 0) { p.stock = r3(p.stock + q); save(); renderLowBadge(); renderStock(); toast(t('stockSaved') + ': ' + nm(p) + ' → ' + qtyTxt(p.stock, p.unit), 'ok'); }
        closeModal(); break;
      }
      case 'newprod': openProd(null); break;
      case 'editprod': openProd(prod(+id)); break;
      case 'saveprod': saveProd(id); break;
      case 'selcust': U.cust = id; renderCredit(); if (window.matchMedia('(max-width: 899px)').matches) window.scrollTo(0, 0); break;
      case 'custback': U.cust = null; renderCredit(); break;
      case 'cpay': openCustPay(S.customers.find(c => c.id === id)); break;
      case 'cpq': $('#cpAmt').value = id; break;
      case 'cpok': {
        const c = S.customers.find(x => x.id === id); const v = r2(+$('#cpAmt').value || 0);
        if (v > 0) { c.tx.push({ t: Date.now(), type: 'pay', amt: v }); save(); toast(t('paySaved') + ': ' + money(v), 'ok'); renderCredit(); }
        closeModal(); break;
      }
      case 'newcust': openNewCust(); break;
      case 'ncok': {
        const n = $('#ncName').value.trim();
        if (!n) { toast(t('needName'), 'bad'); return; }
        const c = { id: 'n' + (S.nextId++), si: n, en: n, phone: $('#ncPhone').value.trim(), limit: Math.max(0, +$('#ncLimit').value || 0), tx: [] };
        S.customers.push(c); save(); U.cust = c.id; closeModal(); toast(t('custSaved'), 'ok'); renderCredit(); break;
      }
      case 'saveshop': {
        Object.assign(S.shop, { si: $('#sSi').value.trim() || S.shop.si, en: $('#sEn').value.trim() || S.shop.en, addr: $('#sAddr').value.trim(), phone: $('#sPhone').value.trim(), footer_si: $('#sFSi').value.trim(), footer_en: $('#sFEn').value.trim() });
        save(); $('#shopName').textContent = nm(S.shop); toast(t('shopSaved'), 'ok'); break;
      }
      case 'reset':
        openModal('<div class="m-head"><div><h3>' + esc(t('reset')) + '</h3></div><button class="x" data-act="close">×</button></div><p>' + esc(t('resetSure')) + '</p>' +
          '<div class="m-actions"><button class="btn ghost" data-act="close">' + esc(t('cancel')) + '</button><button class="btn danger" data-act="resetok">' + esc(t('reset')) + '</button></div>', 'sm');
        break;
      case 'resetok':
        S = makeDemo(new Date()); save(); U.cart = []; U.cust = null; U.disc = 0; closeModal(); renderAll(); toast(t('resetDone'), 'ok'); break;
    }
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'q') { U.q = e.target.value; renderTiles(); }
    if (e.target.id === 'discIn') {
      U.disc = Math.max(0, +e.target.value || 0);
      const tt = totals();
      $('.disc-row .neg').textContent = tt.disc ? '− ' + money(tt.disc) : '';
      $('.grand b').textContent = money(tt.total);
      $('.pay-btn b').textContent = money(tt.total);
      $('#cartFab b').textContent = money(tt.total);
    }
  });

  document.addEventListener('keydown', e => {
    const modalOn = !$('#modalWrap').hidden;
    if (e.key === 'Escape') {
      if (modalOn) closeModal();
      else document.body.classList.remove('cart-open');
      return;
    }
    if (modalOn && e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
      const primary = $('#modal .m-actions .btn.primary:not([disabled]), #modal .m-actions .btn.danger');
      if (primary) primary.click();
      return;
    }
    if (modalOn) return;
    if (e.key === 'F2') { e.preventDefault(); if (U.page !== 'bill') go('bill'); $('#q').focus(); $('#q').select(); return; }
    if (e.key === 'F9' && U.page === 'bill') { e.preventDefault(); openPay(); return; }
    if (e.target.id === 'q' && e.key === 'Enter') {
      e.preventDefault();
      const v = e.target.value.trim();
      if (!v) { if (U.cart.length) openPay(); return; }
      const p = findCode(v);
      const hits = searchHits();
      const one = p || (hits.length === 1 ? hits[0] : null);
      if (one) {
        if (stockState(one) === 'out') { toast(nm(one) + ': ' + t('out'), 'bad'); return; }
        e.target.value = ''; U.q = '';
        if (one.unit === 'kg') { renderTiles(); openWeigh(one); } else { addToCart(one, 1, false); }
      } else if (!hits.length) toast(t('notFound') + ': ' + v, 'bad');
    }
  });

  window.addEventListener('afterprint', () => { $('#printArea').innerHTML = ''; });

  // ---------- start ----------
  applyLang();
  const startPage = new URLSearchParams(location.search).get('page');
  go(['bill', 'sales', 'stock', 'credit', 'settings'].includes(startPage) ? startPage : 'bill');
  tick();
  setInterval(tick, 15000);
})();
