// Samsoft Salon demo (gents salon "Royal Cut"): walk-in tokens, chair board, bills, barber commission, customers, reports.
(function () {
  'use strict';
  const D = window.SALON;
  const WA_NUMBER = '94704808744';
  const KEY = 'samsoft-salon-demo-v1';
  const MIN = 60000, DAY = 86400000;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- text ----------
  const T = {
    en: {
      demoMsg: 'Demo: Samsoft software for a gents salon. We set it up for your salon.', demoCta: 'Get it for my salon',
      waWelcome: 'Hello Samsoft, I tried the salon demo. I would like to know about software for my salon.',
      shopSub: D.shop.sub_en, tv: 'TV screen',
      nav_queue: 'Queue', nav_barbers: 'Barbers', nav_customers: 'Customers', nav_reports: 'Reports', nav_prices: 'Prices',
      newToken: 'New token', served: 'Served today', waiting: 'Waiting', avgWait: 'Avg. wait today', takings: "Today's takings",
      chair: 'Chair', token: 'Token', busy: 'Busy', free: 'Free', onBreak: 'On break', addSvc: '+ Service', finish: 'Finish & bill',
      callNext: 'Call next', brk: 'Break', back: 'Back to work', next: 'Next', nobodyWaiting: 'Nobody waiting', over: 'over',
      waitingFor: 'Waiting', forB: 'for', anyB: 'Any barber', seat: 'Seat', soon: 'now', approx: '≈', mins: 'min', noQueue: 'Queue is empty. Tap “New token” when a customer walks in.',
      walkin: 'Walk-in', phone: 'Phone number', phoneHint: '07X XXX XXXX (optional)', name: 'Name', nameHint: 'Customer name (optional)',
      services: 'Services', products: 'Products', barber: 'Barber', prefer: 'Preferred barber', estWait: 'Estimated wait',
      issue: 'Issue token', usual: 'Usual cut', usuallyWith: 'Usually with', visits: 'visits', lastVisit: 'Last visit', newCust: 'New customer – will be saved with the bill.',
      pickSvc: 'Pick at least one service', tokenFor: 'Token', printSlip: 'Print slip', sendWa: 'Send on WhatsApp', done: 'Done',
      chooseChair: 'Which chair?', noFree: 'No free chair right now', removed: 'Token {n} removed', undo: 'Undo', seated: 'Token {n} → Chair {c}',
      bill: 'Bill', discount: 'Discount', tip: 'Tip for barber', subtotal: 'Subtotal', total: 'Total', pay: 'Payment',
      cash: 'Cash', card: 'Card', qr: 'LankaQR', given: 'Cash given', change: 'Change', complete: 'Complete', none: 'None',
      emptyBill: 'Add at least one item', billSaved: 'Bill {n} saved', receipt: 'Receipt', print: 'Print', close: 'Close',
      updated: 'Updated', added: 'Added to token {n}',
      period: 'Period', today: 'Today', d7: '7 days', d30: '30 days', month: 'This month', payout: 'Payout', customers: 'Customers',
      svcSales: 'Service sales', commission: 'Commission', prodSales: 'Product sales', tips: 'Tips', working: 'Working',
      jobs: 'Jobs', sendSlip: 'Send pay slip', topSvc: 'Most done', noJobs: 'No jobs in this period.',
      search: 'Search name or phone', all: 'All', regulars: 'Regulars', due: 'Due for a cut', spent: 'Spent', favBarber: 'Barber',
      daysAgo: '{n} days ago', todayW: 'today', yesterdayW: 'yesterday', since: 'Customer since', history: 'Visit history',
      notes: 'Usual cut / notes', save: 'Save', saved: 'Saved', remind: 'WhatsApp reminder', tokenFor2: 'New token for him',
      pickCust: 'Pick a customer to see the profile.', noMatch: 'No customers match.', noPhone: 'no phone',
      remindMsg: 'Hello {name}, it has been {n} days since your last cut at Royal Cut Maharagama. Walk in any time 8.30 am – 8.30 pm, or reply to get a token. 💈',
      tTakings: 'Takings', tCust: 'Customers', avgBill: 'Average bill', tAvgWait: 'Average wait',
      tProducts: 'Products sold', byHour: 'Takings by hour', byDay: 'Takings by day', svcMix: 'Services', payMix: 'Payments',
      bills: 'Bills', time: 'Time', items: 'Items', amount: 'Amount', more: '+{n} more',
      priceList: 'Service price list', mins2: 'Minutes', price: 'Price', stock: 'Stock', low: 'Low', productList: 'Products for sale',
      settings: 'Settings', language: 'Language', demoData: 'Demo data', resetTxt: 'Erase your changes and load fresh demo data.',
      reset: 'Restart the demo', resetDone: 'Fresh demo data loaded', talk: 'Talk to Samsoft', talkTxt: 'Want this for your salon? We change the services, prices, barbers and receipts to fit you.',
      nowServing: 'Now serving', nextUp: 'Next', am: 'AM', pm: 'PM',
      dshort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      slipTitle: 'Pay slip', slipMsg: 'Royal Cut – pay slip\n{name} · {period}\nCustomers: {c}\nService sales: {s}\nCommission {p}%: {cm}\nProduct commission: {pc}\nTips: {tp}\nTotal payout: {tot}',
      tokMsg: 'Royal Cut Maharagama\nYour token: {n}\nServices: {s}\nApprox. wait: {w}\nWe will call you. Thank you!'
    },
    si: {
      demoMsg: 'Demo: පිරිමි සැලෝන් එකකට Samsoft software. ඔබේ සැලෝන් එකට ගැලපෙන්න හදලා දෙනවා.', demoCta: 'මගේ සැලෝන් එකටත් ඕනේ',
      waWelcome: 'ආයුබෝවන් Samsoft, මම salon demo එක බැලුවා. මගේ සැලෝන් එකටත් software එකක් ගැන දැනගන්න ඕනේ.',
      shopSub: D.shop.sub_si, tv: 'TV තිරය',
      nav_queue: 'පෝලිම', nav_barbers: 'බාබර්ලා', nav_customers: 'පාරිභෝගිකයෝ', nav_reports: 'වාර්තා', nav_prices: 'මිල ගණන්',
      newToken: 'අලුත් ටෝකන්', served: 'අද සේවය කළ', waiting: 'බලාගෙන', avgWait: 'අද සාමාන්‍ය රැඳීම', takings: 'අද ආදායම',
      chair: 'පුටුව', token: 'ටෝකන්', busy: 'වැඩ', free: 'නිදහස්', onBreak: 'විවේකයේ', addSvc: '+ සේවාව', finish: 'අවසන් කර බිල',
      callNext: 'ඊළඟ කෙනා', brk: 'විවේකය', back: 'නැවත වැඩට', next: 'ඊළඟට', nobodyWaiting: 'කවුරුත් බලාගෙන නෑ', over: 'වැඩියි',
      waitingFor: 'රැඳී', forB: '→', anyB: 'ඕනෑම බාබර්', seat: 'පුටුවට', soon: 'දැන්', approx: '≈', mins: 'මි.', noQueue: 'පෝලිම හිස්. පාරිභෝගිකයෙක් ආවම “අලුත් ටෝකන්” ඔබන්න.',
      walkin: 'Walk-in', phone: 'දුරකථන අංකය', phoneHint: '07X XXX XXXX (අවශ්‍ය නම්)', name: 'නම', nameHint: 'පාරිභෝගිකයාගේ නම (අවශ්‍ය නම්)',
      services: 'සේවා', products: 'භාණ්ඩ', barber: 'බාබර්', prefer: 'කැමති බාබර්', estWait: 'බලාපොරොත්තු රැඳීම',
      issue: 'ටෝකන් දෙන්න', usual: 'සාමාන්‍ය කැපුම', usuallyWith: 'සාමාන්‍යයෙන්', visits: 'වතාවක්', lastVisit: 'අවසන් පැමිණීම', newCust: 'අලුත් පාරිභෝගිකයෙක් – බිල සමඟ save වෙනවා.',
      pickSvc: 'අඩුම තරමේ එක සේවාවක් තෝරන්න', tokenFor: 'ටෝකන්', printSlip: 'Slip print', sendWa: 'WhatsApp යවන්න', done: 'හරි',
      chooseChair: 'කුමන පුටුවද?', noFree: 'දැන් නිදහස් පුටුවක් නෑ', removed: 'ටෝකන් {n} ඉවත් කළා', undo: 'ආපසු', seated: 'ටෝකන් {n} → පුටුව {c}',
      bill: 'බිල', discount: 'වට්ටම', tip: 'බාබර්ට tip', subtotal: 'එකතුව', total: 'මුළු මුදල', pay: 'ගෙවීම',
      cash: 'මුදල්', card: 'කාඩ්', qr: 'LankaQR', given: 'දුන් මුදල', change: 'ඉතිරිය', complete: 'අවසන් කරන්න', none: 'නෑ',
      emptyBill: 'අඩුම තරමේ එකක් එකතු කරන්න', billSaved: 'බිල {n} save කළා', receipt: 'බිල්පත', print: 'Print', close: 'වසන්න',
      updated: 'යාවත්කාලීන කළා', added: 'ටෝකන් {n}ට එකතු කළා',
      period: 'කාලය', today: 'අද', d7: 'දින 7', d30: 'දින 30', month: 'මේ මාසය', payout: 'ගෙවිය යුතු', customers: 'පාරිභෝගිකයෝ',
      svcSales: 'සේවා ආදායම', commission: 'කොමිස්', prodSales: 'භාණ්ඩ විකුණුම්', tips: 'Tips', working: 'වැඩේ',
      jobs: 'වැඩ', sendSlip: 'Pay slip යවන්න', topSvc: 'වැඩියෙන්ම කළේ', noJobs: 'මේ කාලයේ වැඩ නෑ.',
      search: 'නම හෝ දුරකථනය සොයන්න', all: 'සියල්ල', regulars: 'නිතර එන', due: 'කැපුම් කාලය පැනපු', spent: 'වියදම', favBarber: 'බාබර්',
      daysAgo: 'දින {n}කට පෙර', todayW: 'අද', yesterdayW: 'ඊයේ', since: 'පාරිභෝගිකයෙක් වූයේ', history: 'පැමිණීම් ඉතිහාසය',
      notes: 'සාමාන්‍ය කැපුම / සටහන්', save: 'Save', saved: 'Save කළා', remind: 'WhatsApp මතක් කිරීම', tokenFor2: 'ඔහුට අලුත් ටෝකන්',
      pickCust: 'විස්තර බලන්න පාරිභෝගිකයෙක් තෝරන්න.', noMatch: 'ගැලපෙන කවුරුත් නෑ.', noPhone: 'දුරකථනය නෑ',
      remindMsg: 'ආයුබෝවන් {name}, Royal Cut මහරගමෙන් ඔබ කොණ්ඩය කපලා දැන් දින {n}ක්. උදේ 8.30 – රෑ 8.30 ඕනෑම වෙලාවක එන්න, නැත්නම් ටෝකන් එකක් ගන්න reply කරන්න. 💈',
      tTakings: 'ආදායම', tCust: 'පාරිභෝගිකයෝ', avgBill: 'සාමාන්‍ය බිල', tAvgWait: 'සාමාන්‍ය රැඳීම',
      tProducts: 'විකුණූ භාණ්ඩ', byHour: 'පැයෙන් පැයට ආදායම', byDay: 'දිනෙන් දිනට ආදායම', svcMix: 'සේවා', payMix: 'ගෙවීම්',
      bills: 'බිල්පත්', time: 'වේලාව', items: 'අයිතම', amount: 'මුදල', more: 'තව {n}ක්',
      priceList: 'සේවා මිල ලැයිස්තුව', mins2: 'මිනිත්තු', price: 'මිල', stock: 'Stock', low: 'අඩුයි', productList: 'විකිණීමට භාණ්ඩ',
      settings: 'සැකසුම්', language: 'භාෂාව', demoData: 'Demo දත්ත', resetTxt: 'ඔබ කළ වෙනස්කම් මකා, මුල් demo දත්ත නැවත ලබාගන්න.',
      reset: 'Demo එක මුල ඉඳන්', resetDone: 'අලුත් demo දත්ත ආවා', talk: 'Samsoft එක්ක කතා කරන්න', talkTxt: 'ඔබේ සැලෝන් එකටත් ඕනෙද? සේවා, මිල, බාබර්ලා, බිල්පත් ඔබට ගැලපෙන්න වෙනස් කරලා දෙනවා.',
      nowServing: 'දැන් සේවය කරන්නේ', nextUp: 'ඊළඟට', am: 'පෙ.ව.', pm: 'ප.ව.',
      dshort: ['ඉරි', 'සඳු', 'අඟ', 'බදා', 'බ්‍රහ', 'සිකු', 'සෙන'],
      slipTitle: 'Pay slip', slipMsg: 'Royal Cut – pay slip\n{name} · {period}\nපාරිභෝගිකයෝ: {c}\nසේවා ආදායම: {s}\nකොමිස් {p}%: {cm}\nභාණ්ඩ කොමිස්: {pc}\nTips: {tp}\nමුළු ගෙවීම: {tot}',
      tokMsg: 'Royal Cut මහරගම\nඔබේ ටෝකන් අංකය: {n}\nසේවා: {s}\nආසන්න රැඳීම: {w}\nඔබේ වාරය ආවම කතා කරනවා. ස්තූතියි!'
    }
  };

  // ---------- helpers ----------
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const dayStart = ms => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const svc = id => D.services.find(s => s.id === id) || S.services.find(s => s.id === id);
  const sv = id => S.services.find(s => s.id === id);
  const pr = id => S.products.find(p => p.id === id);
  const barber = id => D.barbers.find(b => b.id === id);
  const cust = id => S.custs.find(c => c.id === id);
  const dur = ids => ids.reduce((s, id) => s + (sv(id) ? sv(id).mins : 15), 0);

  // ---------- demo data ----------
  function makeDemo(now) {
    const day0 = dayStart(now);
    const R = rng(Math.floor(day0 / DAY) * 7919 + 13);
    const pick = a => a[Math.floor(R() * a.length)];
    const wpick = a => { let s = a.reduce((x, o) => x + o.w, 0) * R(); for (const o of a) { s -= o.w; if (s <= 0) return o; } return a[0]; };
    const DAYS = 60;
    const startDay = day0 - (DAYS - 1) * DAY;
    // customers with their own visit rhythm
    const custs = [], used = new Set();
    for (let i = 0; i < 190; i++) {
      let name; do { name = pick(D.first) + ' ' + pick(D.last); } while (used.has(name)); used.add(name);
      const phone = '07' + pick(['0', '1', '2', '4', '5', '6', '7', '8']) + String(1000000 + Math.floor(R() * 8999999));
      custs.push({ id: 'c' + (i + 1), name, phone, note: R() < 0.8 ? Math.floor(R() * D.notes.length) : null,
        fav: wpick(D.barbers.map((b, k) => ({ id: b.id, w: [5, 4, 3, 2][k] }))).id, rate: 16 + Math.floor(R() * 24),
        lapse: R() < 0.16, since: 0 });
    }
    // hour weights 8..20
    const HW = [2, 6, 8, 7, 5, 4, 4, 5, 7, 9, 9, 7, 3];
    const hourPick = () => { const tot = HW.reduce((a, b) => a + b, 0); let s = R() * tot; for (let h = 0; h < HW.length; h++) { s -= HW[h]; if (s <= 0) return 8 + h; } return 19; };
    const svcsFor = c => {
      const n = c && c.note != null ? c.note : -1; let list;
      if (n === 0 || n === 5 || n === 8) list = R() < 0.35 ? ['fade', 'beard'] : ['fade'];
      else if (n === 3) list = ['combo'];
      else if (n === 6) list = ['kids'];
      else if (n === 7) list = R() < 0.45 ? ['cut', 'color'] : ['cut'];
      else if (n === 4) list = R() < 0.5 ? ['cut', 'shave'] : ['cut'];
      else list = [wpick(D.services).id];
      if (R() < 0.1) list.push('wash');
      if (R() < 0.07) list.push('massage');
      if (R() < 0.03 && !list.includes('facial')) list.push('facial');
      return Array.from(new Set(list));
    };
    // visits per day from each customer's rhythm
    const visitsByDay = Array.from({ length: DAYS }, () => []);
    custs.forEach(c => {
      let d = Math.floor(R() * c.rate) - (c.lapse ? 0 : 2);
      const stopAt = c.lapse ? 8 + Math.floor(R() * 22) : DAYS;
      while (d < DAYS && d <= stopAt) {
        if (d >= 0) { visitsByDay[d].push(c); if (!c.since) c.since = startDay + d * DAY; }
        d += c.rate + Math.floor(R() * 5) - 2;
      }
    });
    const bills = [];
    let no = 24100;
    for (let d = 0; d < DAYS; d++) {
      const ds = startDay + d * DAY, wd = new Date(ds).getDay();
      const total = (wd === 0 || wd === 6 ? 46 : 31) + Math.floor(R() * 10);
      const list = visitsByDay[d].slice();
      while (list.length < total) list.push(null);
      const dayBills = list.map(c => {
        let h = hourPick(), m = Math.floor(R() * 60);
        if (h === 8 && m < 30) m += 30; if (h === 20 && m > 25) m = Math.floor(R() * 25);
        const t = ds + (h * 60 + m) * MIN;
        const ids = svcsFor(c);
        const bid = c && R() < 0.7 ? c.fav : wpick(D.barbers.map((b, k) => ({ id: b.id, w: [4, 4, 4, 3][k] }))).id;
        const items = ids.map(id => ({ k: 's', id, q: 1, p: svc(id).price }));
        if (R() < 0.08) { const p = pick(D.products); items.push({ k: 'p', id: p.id, q: 1, p: p.price }); }
        const sub = items.reduce((s, l) => s + l.p * l.q, 0);
        const disc = R() < 0.05 ? 100 : 0;
        const tip = R() < 0.22 ? pick([50, 100, 100, 200]) : 0;
        const r = R(), method = r < 0.6 ? 'cash' : r < 0.8 ? 'qr' : 'card';
        return { t, cid: c ? c.id : null, name: c ? c.name : null, bid, items, sub, disc, tip, method, total: sub - disc + tip, wait: Math.floor(R() * (h >= 17 ? 38 : 22)) };
      }).sort((a, b) => a.t - b.t);
      dayBills.forEach((b, i) => { b.tok = i + 1; b.no = 'R' + (no++); });
      bills.push(...dayBills);
    }
    const nowT = now.getTime();
    const keep = bills.filter(b => b.t < nowT - 8 * MIN);
    custs.forEach(c => { delete c.rate; delete c.lapse; if (!c.since) c.since = startDay - Math.floor(R() * 200) * DAY; });
    // keep only customers who appear in the history (plus a few older ones)
    const seen = new Set(keep.map(b => b.cid));
    const finalCusts = custs.filter(c => seen.has(c.id));
    // live queue right now
    const todayCount = keep.filter(b => b.t >= day0).length;
    let tok = todayCount;
    const regs = finalCusts.slice().sort(() => R() - 0.5);
    const q = [];
    const add = (c, svcs, state, ago, bid, startAgo, pref) => {
      tok++;
      q.push({ tok, cid: c ? c.id : null, name: c ? c.name : null, phone: c ? c.phone : '', svcs, pref: pref || null, t: nowT - ago * MIN,
        state, bid: bid || null, start: state === 'chair' ? nowT - startAgo * MIN : null, wait: state === 'chair' ? ago - startAgo : 0 });
    };
    add(regs[0], ['combo'], 'chair', 31, 'b1', 14);
    add(null, ['fade'], 'chair', 16, 'b2', 6);
    add(regs[1], ['fade', 'beard'], 'wait', 17, null, 0, 'b1');
    add(null, ['cut'], 'wait', 11);
    add(regs[2], ['kids'], 'wait', 6);
    add(null, ['cut', 'wash'], 'wait', 2);
    return {
      v: 1, made: day0, bills: keep, custs: finalCusts, queue: q, tok, brk: { b4: true }, pct: Object.fromEntries(D.barbers.map(b => [b.id, b.pct])),
      services: D.services.map(s => ({ id: s.id, price: s.price, mins: s.mins })), products: D.products.map(p => ({ id: p.id, price: p.price, stock: p.stock })),
      no
    };
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
  const U = {
    lang: qp.get('lang') === 'en' ? 'en' : 'si',
    page: ['queue', 'barbers', 'customers', 'reports', 'prices'].includes(qp.get('page')) ? qp.get('page') : 'queue',
    bp: 'today', rp: 'today', cf: 'all', cq: '', sel: null, bill: null, nt: null, btab: 's'
  };
  const t = (k, v) => { let s = T[U.lang][k] != null ? T[U.lang][k] : (T.en[k] != null ? T.en[k] : k); if (v) Object.keys(v).forEach(x => { s = String(s).split('{' + x + '}').join(v[x]); }); return s; };
  const nm = o => o ? (U.lang === 'si' ? o.si : o.en) : '';
  const sName = id => nm(svc(id));
  const bName = id => nm(barber(id));
  const money = n => 'Rs. ' + Math.round(n).toLocaleString('en-US');
  const num = n => Math.round(n).toLocaleString('en-US');
  function fmtTime(ms) {
    const d = new Date(ms); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
    const ap = h < 12 ? t('am') : t('pm'); h = h % 12 || 12;
    return U.lang === 'si' ? ap + ' ' + h + '.' + m : h + ':' + m + ' ' + ap;
  }
  function fmtDate(ms) { const d = new Date(ms); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function ago(ms) {
    const n = Math.round((dayStart(Date.now()) - dayStart(ms)) / DAY);
    return n <= 0 ? t('todayW') : n === 1 ? t('yesterdayW') : t('daysAgo', { n });
  }
  const custName = x => x.name || t('walkin');
  const waPhone = p => { const d = String(p || '').replace(/\D/g, ''); return d.length === 10 && d[0] === '0' ? '94' + d.slice(1) : d; };
  const waLink = (phone, text) => 'https://wa.me/' + waPhone(phone) + '?text=' + encodeURIComponent(text);

  function toast(msg, act) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span>' + esc(msg) + '</span>' + (act ? '<button>' + esc(act.label) + '</button>' : '');
    if (act) el.querySelector('button').onclick = () => { act.fn(); el.remove(); };
    $('#toasts').appendChild(el);
    setTimeout(() => el.classList.add('out'), act ? 4200 : 2200);
    setTimeout(() => el.remove(), act ? 4600 : 2600);
  }

  // ---------- queue logic ----------
  const inChair = bid => S.queue.find(x => x.state === 'chair' && x.bid === bid);
  const waitingList = () => S.queue.filter(x => x.state === 'wait');
  function plan(extra) {
    const now = Date.now(), free = {};
    D.barbers.forEach(b => {
      if (S.brk[b.id]) return;
      const q = inChair(b.id);
      free[b.id] = q ? Math.max(now + 2 * MIN, q.start + dur(q.svcs) * MIN) : now;
    });
    const eta = {};
    const list = waitingList().concat(extra ? [extra] : []);
    list.forEach(x => {
      const ks = Object.keys(free);
      const cands = x.pref && free[x.pref] != null ? [x.pref] : ks;
      if (!cands.length) { eta[x.tok] = null; return; }
      const best = cands.reduce((a, b) => (free[a] <= free[b] ? a : b));
      eta[x.tok] = { at: free[best], bid: best };
      free[best] += dur(x.svcs) * MIN;
    });
    return eta;
  }
  const etaMin = e => (e ? Math.max(0, Math.round((e.at - Date.now()) / MIN)) : null);
  const etaTxt = e => { const m = etaMin(e); return m == null ? '–' : m <= 1 ? t('soon') : t('approx') + ' ' + m + ' ' + t('mins'); };
  const nextFor = bid => waitingList().find(x => !x.pref || x.pref === bid || S.brk[x.pref]);

  function seat(x, bid) {
    if (inChair(bid) || S.brk[bid]) return;
    x.state = 'chair'; x.bid = bid; x.start = Date.now(); x.wait = Math.max(0, Math.round((x.start - x.t) / MIN));
    save(); toast(t('seated', { n: x.tok, c: barber(bid).chair })); renderPage(); renderCounts();
  }

  // ---------- rendering: shell ----------
  function applyLang() {
    const root = document.documentElement;
    root.setAttribute('data-lang', U.lang); root.setAttribute('lang', U.lang);
    $$('[data-t]').forEach(el => { el.textContent = t(el.getAttribute('data-t')); });
    $('#waCta').href = waLink(WA_NUMBER, t('waWelcome'));
    $('#homeLink').href = '../../website/business.html' + (U.lang === 'si' ? '?lang=si' : '');
    renderPage(); renderCounts(); tick();
    if (!$('#tv').hidden) renderTV();
  }
  function go(page) {
    U.page = page; document.body.dataset.page = page;
    $$('.page').forEach(p => p.classList.toggle('on', p.id === 'pg-' + page));
    $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.id === page));
    renderPage(); window.scrollTo(0, 0);
  }
  function renderPage() {
    ({ queue: renderQueue, barbers: renderBarbers, customers: renderCustomers, reports: renderReports, prices: renderPrices })[U.page]();
  }
  function renderCounts() { const n = waitingList().length; const el = $('#waitCnt'); el.textContent = n || ''; el.hidden = !n; }
  function tick() {
    const d = new Date();
    $('#clock').innerHTML = '<b>' + esc(fmtTime(d)) + '</b><span>' + esc(t('dshort')[d.getDay()] + ' ' + fmtDate(d)) + '</span>';
  }

  // ---------- queue page ----------
  function todayBills() { const d0 = dayStart(Date.now()); return S.bills.filter(b => b.t >= d0); }
  function renderQueue() {
    const tb = todayBills(), eta = plan();
    const avgW = tb.length ? Math.round(tb.reduce((s, b) => s + b.wait, 0) / tb.length) : 0;
    const wl = waitingList();
    const chairs = D.barbers.map(b => {
      const x = inChair(b.id), br = S.brk[b.id];
      let state = x ? 'busy' : br ? 'brk' : 'free', body = '', foot = '';
      if (x) {
        const el = Math.max(0, Math.round((Date.now() - x.start) / MIN)), pl = dur(x.svcs), over = el > pl;
        body = '<div class="ch-tok"><small>' + esc(t('token')) + '</small><b>' + x.tok + '</b></div>' +
          '<div class="ch-info"><b>' + esc(custName(x)) + '</b><span class="ch-svcs">' + esc(x.svcs.map(sName).join(' + ')) + '</span>' +
          '<div class="prog' + (over ? ' over' : '') + '"><i style="width:' + Math.min(100, el / pl * 100) + '%"></i></div>' +
          '<span class="ch-time">' + (over ? '<em>' + (el - pl) + ' ' + esc(t('mins')) + ' ' + esc(t('over')) + '</em>' : el + ' / ' + pl + ' ' + esc(t('mins'))) + '</span></div>';
        foot = '<button class="btn ghost" data-act="addsvc" data-id="' + b.id + '">' + esc(t('addSvc')) + '</button>' +
          '<button class="btn brass" data-act="finish" data-id="' + b.id + '">' + esc(t('finish')) + '</button>';
      } else if (br) {
        body = '<div class="ch-big dim">' + esc(t('onBreak')) + '</div>';
        foot = '<button class="btn ghost wide" data-act="brk" data-id="' + b.id + '">' + esc(t('back')) + '</button>';
      } else {
        const n = nextFor(b.id);
        body = '<div class="ch-big">' + esc(t('free')) + '</div><div class="ch-next">' + (n ? esc(t('next')) + ': <b>' + n.tok + '</b> · ' + esc(custName(n)) + ' · ' + esc(n.svcs.map(sName).join(' + ')) : esc(t('nobodyWaiting'))) + '</div>';
        foot = '<button class="btn ghost" data-act="brk" data-id="' + b.id + '">' + esc(t('brk')) + '</button>' +
          '<button class="btn brass"' + (n ? '' : ' disabled') + ' data-act="callnext" data-id="' + b.id + '">' + esc(t('callNext')) + (n ? ' · ' + n.tok : '') + '</button>';
      }
      return '<article class="chair s-' + state + '"><header><span class="ch-no">' + esc(t('chair')) + ' ' + b.chair + '</span>' +
        '<span class="ch-who"><b>' + esc(nm(b)) + '</b><small>' + esc(U.lang === 'si' ? b.role_si : b.role_en) + '</small></span>' +
        '<span class="ch-state">' + esc(t(state === 'busy' ? 'busy' : state === 'brk' ? 'onBreak' : 'free')) + '</span></header>' +
        '<div class="ch-body">' + body + '</div><footer>' + foot + '</footer></article>';
    }).join('');
    const items = wl.map(x => {
      const w = Math.max(0, Math.round((Date.now() - x.t) / MIN));
      return '<li class="wi"><div class="wi-tok">' + x.tok + '</div><div class="wi-main"><b>' + esc(custName(x)) + '</b>' +
        '<span class="wi-svc">' + esc(x.svcs.map(sName).join(' + ')) + '</span>' +
        '<span class="wi-meta">' + esc(t('waitingFor')) + ' ' + w + ' ' + esc(t('mins')) + (x.pref ? ' · <em>' + esc(t('forB')) + ' ' + esc(bName(x.pref)) + '</em>' : '') + '</span></div>' +
        '<div class="wi-eta"><b>' + esc(etaTxt(eta[x.tok])) + '</b></div>' +
        '<div class="wi-act"><button class="btn brass sm" data-act="seat" data-id="' + x.tok + '">' + esc(t('seat')) + '</button>' +
        '<button class="btn x" data-act="noshow" data-id="' + x.tok + '" aria-label="remove">×</button></div></li>';
    }).join('');
    $('#pg-queue').innerHTML =
      '<div class="strip">' +
        '<div><b>' + tb.length + '</b><span>' + esc(t('served')) + '</span></div>' +
        '<div><b>' + wl.length + '</b><span>' + esc(t('waiting')) + '</span></div>' +
        '<div><b>' + avgW + '<small> ' + esc(t('mins')) + '</small></b><span>' + esc(t('avgWait')) + '</span></div>' +
        '<div class="hi"><b>' + esc(money(tb.reduce((s, b) => s + b.total, 0))) + '</b><span>' + esc(t('takings')) + '</span></div>' +
      '</div>' +
      '<div class="q-grid"><div class="chairs">' + chairs + '</div>' +
      '<aside class="waitlist"><div class="wl-head"><h2>' + esc(t('waiting')) + ' <span>' + wl.length + '</span></h2>' +
      '<button class="btn brass big" data-act="newtok">+ ' + esc(t('newToken')) + '</button></div>' +
      (wl.length ? '<ol class="wl">' + items + '</ol>' : '<p class="empty">' + esc(t('noQueue')) + '</p>') + '</aside></div>';
  }

  // ---------- modal ----------
  function openModal(html, cls) {
    const keep = !$('#modal').hidden && $('#sheet').className === 'sheet ' + (cls || '');
    const old = $('#sheet .sh-body, #sheet .bill-add'), top = keep && old ? old.scrollTop : 0;
    $('#sheet').className = 'sheet ' + (cls || '');
    $('#sheet').innerHTML = html; $('#modal').hidden = false; document.body.classList.add('noscroll');
    const nw = $('#sheet .sh-body, #sheet .bill-add'); if (nw && top) nw.scrollTop = top;
  }
  function closeModal() { $('#modal').hidden = true; $('#sheet').innerHTML = ''; document.body.classList.remove('noscroll'); U.bill = null; U.nt = null; }
  const shHead = (title, sub) => '<div class="sh-head"><div><h2>' + title + '</h2>' + (sub ? '<span>' + sub + '</span>' : '') + '</div><button class="sh-x" data-act="close" aria-label="' + esc(t('close')) + '">×</button></div>';

  // new token
  function openNewToken(cid) {
    const c = cid ? cust(cid) : null;
    U.nt = { phone: c ? c.phone : '', name: c ? c.name : '', cid: c ? c.id : null, svcs: [], pref: null };
    renderNewToken();
  }
  function ntMatches() {
    const p = U.nt.phone.replace(/\D/g, '');
    if (U.nt.cid || p.length < 3) return [];
    return S.custs.filter(c => c.phone.includes(p)).slice(0, 4);
  }
  function custStats(c) {
    const v = S.bills.filter(b => b.cid === c.id);
    return { n: v.length, last: v.length ? v[v.length - 1].t : null, spent: v.reduce((s, b) => s + b.total, 0), list: v };
  }
  const noteTxt = c => c.note == null ? '' : typeof c.note === 'number' ? D.notes[c.note][U.lang === 'si' ? 1 : 0] : c.note;
  function renderNewToken() {
    const nt = U.nt, c = nt.cid ? cust(nt.cid) : null;
    const nextTok = S.tok + 1;
    const extra = { tok: -1, svcs: nt.svcs.length ? nt.svcs : ['cut'], pref: nt.pref };
    const eta = plan(extra)[-1];
    const etaPer = Object.fromEntries(D.barbers.map(b => [b.id, plan({ tok: -1, svcs: extra.svcs, pref: b.id })[-1]]));
    let who;
    if (c) {
      const st = custStats(c);
      who = '<div class="cust-card"><div><b>' + esc(c.name) + '</b><span>' + esc(c.phone) + ' · ' + st.n + ' ' + esc(t('visits')) +
        (st.last ? ' · ' + esc(t('lastVisit')) + ': ' + esc(ago(st.last)) : '') + '</span>' +
        (noteTxt(c) ? '<p><small>' + esc(t('usual')) + '</small>' + esc(noteTxt(c)) + '</p>' : '') +
        '<span class="uw">' + esc(t('usuallyWith')) + ' <button class="chip-s" data-act="ntpref" data-id="' + c.fav + '">' + esc(bName(c.fav)) + '</button></span></div>' +
        '<button class="btn ghost sm" data-act="ntclear">×</button></div>';
    } else {
      const m = ntMatches();
      const digits = nt.phone.replace(/\D/g, '');
      who = '<div class="nt-who"><label><span>' + esc(t('phone')) + '</span><input id="ntPhone" inputmode="tel" maxlength="12" placeholder="' + esc(t('phoneHint')) + '" value="' + esc(nt.phone) + '"></label>' +
        '<label><span>' + esc(t('name')) + '</span><input id="ntName" placeholder="' + esc(t('nameHint')) + '" value="' + esc(nt.name) + '"></label></div>' +
        '<div class="sugg" id="ntSugg">' + suggHtml(m, digits) + '</div>';
    }
    const svcs = S.services.map(s => '<button class="tile' + (nt.svcs.includes(s.id) ? ' on' : '') + '" data-act="ntsvc" data-id="' + s.id + '"><b>' + esc(sName(s.id)) + '</b><span>' + esc(money(s.price)) + ' · ' + s.mins + ' ' + esc(t('mins')) + '</span></button>').join('');
    const bars = '<button class="chip' + (!nt.pref ? ' on' : '') + '" data-act="ntpref" data-id=""><b>' + esc(t('anyB')) + '</b></button>' +
      D.barbers.map(b => '<button class="chip' + (nt.pref === b.id ? ' on' : '') + '"' + (S.brk[b.id] ? ' disabled' : '') + ' data-act="ntpref" data-id="' + b.id + '"><b>' + esc(nm(b)) + '</b><span>' + esc(S.brk[b.id] ? t('onBreak') : etaTxt(etaPer[b.id])) + '</span></button>').join('');
    const price = nt.svcs.reduce((s, id) => s + sv(id).price, 0);
    openModal(shHead(esc(t('newToken')) + ' <em class="tok-pill">' + nextTok + '</em>') +
      '<div class="sh-body nt">' + who +
      '<h3>' + esc(t('services')) + '</h3><div class="tiles">' + svcs + '</div>' +
      '<h3>' + esc(t('prefer')) + '</h3><div class="chips">' + bars + '</div></div>' +
      '<div class="sh-foot"><div class="sf-l"><small>' + esc(t('estWait')) + '</small><b>' + esc(etaTxt(eta)) + '</b>' + (price ? '<span>' + esc(money(price)) + '</span>' : '') + '</div>' +
      '<button class="btn brass xl" data-act="ntissue">' + esc(t('issue')) + ' · ' + nextTok + '</button></div>', 'wide');
    const ph = $('#ntPhone');
    if (ph) {
      ph.addEventListener('input', () => {
        nt.phone = ph.value;
        const d = ph.value.replace(/\D/g, '');
        const exact = d.length === 10 ? S.custs.find(c2 => c2.phone === d) : null;
        if (exact) { nt.cid = exact.id; nt.name = exact.name; nt.phone = exact.phone; renderNewToken(); return; }
        $('#ntSugg').innerHTML = suggHtml(ntMatches(), d);
      });
      $('#ntName').addEventListener('input', e => { nt.name = e.target.value; });
    }
  }
  function suggHtml(m, digits) {
    if (m.length) return m.map(c => '<button data-act="ntpick" data-id="' + c.id + '"><b>' + esc(c.name) + '</b><span>' + esc(c.phone) + '</span></button>').join('');
    if (digits.length === 10) return '<p class="hint">' + esc(t('newCust')) + '</p>';
    return '';
  }
  function issueToken() {
    const nt = U.nt;
    if (!nt.svcs.length) { toast(t('pickSvc')); return; }
    S.tok++;
    const x = { tok: S.tok, cid: nt.cid, name: (nt.name || '').trim() || null, phone: nt.phone.replace(/\D/g, ''), svcs: nt.svcs.slice(), pref: nt.pref, t: Date.now(), state: 'wait', bid: null, start: null, wait: 0 };
    S.queue.push(x); save();
    const eta = plan()[x.tok];
    renderPage(); renderCounts();
    const msg = t('tokMsg', { n: x.tok, s: x.svcs.map(sName).join(' + '), w: etaTxt(eta) });
    U.nt = null;
    openModal(shHead(esc(t('tokenFor'))) +
      '<div class="sh-body slip"><div class="slip-no"><small>' + esc(t('token')) + '</small><b>' + x.tok + '</b></div>' +
      '<p class="slip-name">' + esc(custName(x)) + '</p><p>' + esc(x.svcs.map(sName).join(' + ')) + '</p>' +
      '<p class="slip-eta">' + esc(t('estWait')) + ': <b>' + esc(etaTxt(eta)) + '</b>' + (x.pref ? ' · ' + esc(bName(x.pref)) : '') + '</p></div>' +
      '<div class="sh-foot center">' + '<button class="btn ghost" data-act="printslip" data-id="' + x.tok + '">' + esc(t('printSlip')) + '</button>' +
      (x.phone ? '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(x.phone, msg)) + '">' + esc(t('sendWa')) + '</a>' : '') +
      '<button class="btn brass" data-act="close">' + esc(t('done')) + '</button></div>', 'narrow');
  }

  // add service to a running chair
  function openAddSvc(bid) {
    const x = inChair(bid); if (!x) return;
    const tiles = S.services.map(s => '<button class="tile' + (x.svcs.includes(s.id) ? ' on' : '') + '" data-act="chsvc" data-id="' + s.id + '" data-b="' + bid + '"><b>' + esc(sName(s.id)) + '</b><span>' + esc(money(s.price)) + ' · ' + s.mins + ' ' + esc(t('mins')) + '</span></button>').join('');
    openModal(shHead(esc(t('token')) + ' ' + x.tok + ' · ' + esc(custName(x)), esc(t('chair')) + ' ' + barber(bid).chair + ' · ' + esc(bName(bid))) +
      '<div class="sh-body"><div class="tiles">' + tiles + '</div></div><div class="sh-foot center"><button class="btn brass xl" data-act="close">' + esc(t('done')) + '</button></div>', 'wide');
  }

  // chair chooser
  function openChooser(x) {
    const free = D.barbers.filter(b => !inChair(b.id) && !S.brk[b.id]);
    openModal(shHead(esc(t('chooseChair')), esc(t('token')) + ' ' + x.tok + ' · ' + esc(custName(x))) +
      '<div class="sh-body"><div class="chips big">' + free.map(b => '<button class="chip" data-act="seatto" data-id="' + x.tok + '" data-b="' + b.id + '"><b>' + esc(t('chair')) + ' ' + b.chair + '</b><span>' + esc(nm(b)) + '</span></button>').join('') + '</div></div>', 'narrow');
  }

  // ---------- billing ----------
  function openBill(bid) {
    const x = inChair(bid); if (!x) return;
    const c = x.cid ? cust(x.cid) : null;
    U.bill = { tok: x.tok, bid, cid: x.cid, name: x.name || '', phone: c ? c.phone : (x.phone || ''), lines: x.svcs.map(id => ({ k: 's', id, q: 1, p: sv(id).price })),
      disc: 0, dtype: 'rs', tip: 0, method: 'cash', given: '' };
    U.btab = 's';
    renderBill();
  }
  function billCalc() {
    const b = U.bill;
    const sub = b.lines.reduce((s, l) => s + l.p * l.q, 0);
    const dv = Math.max(0, +b.disc || 0);
    const disc = Math.min(sub, b.dtype === 'pc' ? Math.round(sub * Math.min(dv, 100) / 100) : dv);
    const tip = Math.max(0, +b.tip || 0);
    const total = sub - disc + tip;
    const given = +b.given || 0;
    return { sub, disc, tip, total, change: given >= total ? given - total : null };
  }
  function renderBill() {
    const b = U.bill, x = S.queue.find(q => q.tok === b.tok), c = b.cid ? cust(b.cid) : null;
    const tiles = (U.btab === 's' ? S.services.map(s => ({ k: 's', id: s.id, p: s.price, sub: s.mins + ' ' + t('mins') })) :
      S.products.map(p => ({ k: 'p', id: p.id, p: p.price, sub: t('stock') + ' ' + p.stock, low: p.stock <= 3 }))).map(o =>
      '<button class="tile' + (o.low ? ' low' : '') + '" data-act="badd" data-k="' + o.k + '" data-id="' + o.id + '"><b>' + esc(o.k === 's' ? sName(o.id) : nm(D.products.find(p => p.id === o.id))) + '</b><span>' + esc(money(o.p)) + ' · ' + esc(o.sub) + '</span></button>').join('');
    const lines = b.lines.map((l, i) => '<li><span class="ln-n">' + esc(l.k === 's' ? sName(l.id) : nm(D.products.find(p => p.id === l.id))) + '</span>' +
      '<span class="qty"><button data-act="bq" data-id="' + i + '" data-d="-1">−</button><b>' + l.q + '</b><button data-act="bq" data-id="' + i + '" data-d="1">+</button></span>' +
      '<span class="ln-a">' + esc(num(l.p * l.q)) + '</span></li>').join('');
    const who = c ? '<div class="b-cust"><b>' + esc(c.name) + '</b><span>' + esc(c.phone) + '</span></div>' :
      '<div class="b-cust in"><input id="bName" placeholder="' + esc(t('nameHint')) + '" value="' + esc(b.name) + '"><input id="bPhone" inputmode="tel" maxlength="12" placeholder="' + esc(t('phoneHint')) + '" value="' + esc(b.phone) + '"></div>';
    openModal(shHead(esc(t('bill')) + ' · ' + esc(t('token')) + ' ' + b.tok, esc(t('chair')) + ' ' + barber(b.bid).chair + ' · ' + esc(bName(b.bid)) + ' · ' + esc(x ? custName(x) : '')) +
      '<div class="bill-cols"><div class="bill-add"><div class="seg"><button class="' + (U.btab === 's' ? 'on' : '') + '" data-act="btab" data-id="s">' + esc(t('services')) + '</button>' +
      '<button class="' + (U.btab === 'p' ? 'on' : '') + '" data-act="btab" data-id="p">' + esc(t('products')) + '</button></div><div class="tiles sm">' + tiles + '</div></div>' +
      '<div class="bill-sum">' + who + '<ul class="lines">' + (lines || '<li class="empty">' + esc(t('emptyBill')) + '</li>') + '</ul>' +
      '<div class="b-row"><label>' + esc(t('discount')) + '</label><div class="b-disc"><input id="bDisc" inputmode="numeric" value="' + esc(b.disc || '') + '" placeholder="0">' +
      '<span class="seg mini"><button class="' + (b.dtype === 'rs' ? 'on' : '') + '" data-act="bdt" data-id="rs">Rs</button><button class="' + (b.dtype === 'pc' ? 'on' : '') + '" data-act="bdt" data-id="pc">%</button></span></div></div>' +
      '<div class="b-row"><label>' + esc(t('tip')) + '</label><div class="tipchips">' + [0, 100, 200, 500].map(v => '<button class="' + (+b.tip === v ? 'on' : '') + '" data-act="btip" data-id="' + v + '">' + (v ? num(v) : esc(t('none'))) + '</button>').join('') + '</div></div>' +
      '<div class="b-tot" id="bTot"></div>' +
      '<div class="seg pay">' + ['cash', 'card', 'qr'].map(m => '<button class="' + (b.method === m ? 'on' : '') + '" data-act="bpay" data-id="' + m + '">' + esc(t(m)) + '</button>').join('') + '</div>' +
      (b.method === 'cash' ? '<div class="b-row cashrow"><label>' + esc(t('given')) + '</label><input id="bGiven" inputmode="numeric" value="' + esc(b.given) + '" placeholder="0"><span id="bChange"></span></div>' : '') +
      '<button class="btn brass xl full" data-act="bdone" id="bDone"></button></div></div>', 'bill');
    const bind = (id, k) => { const el = $('#' + id); if (el) el.addEventListener('input', () => { b[k] = el.value; billTotals(); }); };
    bind('bDisc', 'disc'); bind('bGiven', 'given'); bind('bName', 'name'); bind('bPhone', 'phone');
    billTotals();
  }
  function billTotals() {
    const k = billCalc();
    $('#bTot').innerHTML = '<div><span>' + esc(t('subtotal')) + '</span><b>' + esc(num(k.sub)) + '</b></div>' +
      (k.disc ? '<div><span>' + esc(t('discount')) + '</span><b>− ' + esc(num(k.disc)) + '</b></div>' : '') +
      (k.tip ? '<div><span>' + esc(t('tip')) + '</span><b>+ ' + esc(num(k.tip)) + '</b></div>' : '') +
      '<div class="grand"><span>' + esc(t('total')) + '</span><b>' + esc(money(k.total)) + '</b></div>';
    const ch = $('#bChange'); if (ch) ch.innerHTML = k.change != null && +U.bill.given ? esc(t('change')) + ' <b>' + esc(money(k.change)) + '</b>' : '';
    $('#bDone').textContent = t('complete') + ' · ' + money(k.total);
  }
  function completeBill() {
    const b = U.bill;
    if (!b.lines.length) { toast(t('emptyBill')); return; }
    const k = billCalc();
    const xi = S.queue.findIndex(q => q.tok === b.tok); const x = S.queue[xi];
    let cid = b.cid;
    const phone = String(b.phone || '').replace(/\D/g, '');
    if (!cid && phone.length === 10) {
      const ex = S.custs.find(c => c.phone === phone);
      if (ex) cid = ex.id;
      else { cid = 'c' + (S.custs.length + 500 + Math.floor(Math.random() * 1000)); S.custs.push({ id: cid, name: (b.name || '').trim() || t('walkin'), phone, note: null, fav: b.bid, since: Date.now() }); }
    }
    const c = cid ? cust(cid) : null;
    const bill = { no: 'R' + (S.no++), t: Date.now(), tok: b.tok, cid, name: c ? c.name : ((b.name || '').trim() || null), bid: b.bid,
      items: b.lines.map(l => ({ k: l.k, id: l.id, q: l.q, p: l.p })), sub: k.sub, disc: k.disc, tip: k.tip, method: b.method, total: k.total, wait: x ? x.wait : 0 };
    bill.items.filter(l => l.k === 'p').forEach(l => { const p = pr(l.id); if (p) p.stock = Math.max(0, p.stock - l.q); });
    S.bills.push(bill);
    if (xi >= 0) S.queue.splice(xi, 1);
    save(); U.bill = null;
    toast(t('billSaved', { n: bill.no }));
    renderPage(); renderCounts();
    showReceipt(bill);
  }
  function receiptHtml(b) {
    const it = b.items.map(l => '<tr><td>' + esc(l.k === 's' ? sName(l.id) : nm(D.products.find(p => p.id === l.id))) + (l.q > 1 ? ' × ' + l.q : '') + '</td><td>' + esc(num(l.p * l.q)) + '</td></tr>').join('');
    return '<div class="rc"><div class="rc-h"><b>ROYAL CUT</b><span>' + esc(t('shopSub')) + '</span><span>' + esc(D.shop.addr) + ' · ' + esc(D.shop.phone) + '</span></div>' +
      '<div class="rc-m"><span>' + esc(b.no) + '</span><span>' + esc(fmtDate(b.t)) + ' ' + esc(fmtTime(b.t)) + '</span></div>' +
      '<div class="rc-m"><span>' + esc(t('token')) + ' ' + b.tok + ' · ' + esc(t('barber')) + ': ' + esc(bName(b.bid)) + '</span><span>' + esc(b.name || t('walkin')) + '</span></div>' +
      '<table>' + it + '</table><div class="rc-t">' +
      (b.disc ? '<div><span>' + esc(t('discount')) + '</span><span>− ' + esc(num(b.disc)) + '</span></div>' : '') +
      (b.tip ? '<div><span>' + esc(t('tip')) + '</span><span>+ ' + esc(num(b.tip)) + '</span></div>' : '') +
      '<div class="g"><span>' + esc(t('total')) + '</span><span>' + esc(money(b.total)) + '</span></div><div><span>' + esc(t('pay')) + '</span><span>' + esc(t(b.method)) + '</span></div></div>' +
      '<div class="rc-f">' + esc(U.lang === 'si' ? D.shop.footer_si : D.shop.footer_en) + '</div></div>';
  }
  function receiptText(b) {
    const L = ['ROYAL CUT – ' + t('shopSub'), b.no + ' · ' + fmtDate(b.t) + ' ' + fmtTime(b.t), t('barber') + ': ' + bName(b.bid), ''];
    b.items.forEach(l => L.push((l.k === 's' ? sName(l.id) : nm(D.products.find(p => p.id === l.id))) + (l.q > 1 ? ' x' + l.q : '') + '  ' + num(l.p * l.q)));
    if (b.disc) L.push(t('discount') + '  -' + num(b.disc));
    if (b.tip) L.push(t('tip') + '  +' + num(b.tip));
    L.push(t('total') + ': ' + money(b.total), '', U.lang === 'si' ? D.shop.footer_si : D.shop.footer_en);
    return L.join('\n');
  }
  function showReceipt(b) {
    const c = b.cid ? cust(b.cid) : null;
    openModal(shHead(esc(t('receipt')) + ' ' + esc(b.no)) + '<div class="sh-body rc-wrap">' + receiptHtml(b) + '</div>' +
      '<div class="sh-foot center"><button class="btn ghost" data-act="printbill" data-id="' + b.no + '">' + esc(t('print')) + '</button>' +
      '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(c ? c.phone : '', receiptText(b))) + '">' + esc(t('sendWa')) + '</a>' +
      '<button class="btn brass" data-act="close">' + esc(t('done')) + '</button></div>', 'narrow');
  }
  function doPrint(html) {
    $('#print').innerHTML = html;
    window.print();
  }

  // ---------- period helpers ----------
  function range(p) {
    const now = Date.now(), d0 = dayStart(now);
    if (p === 'today') return [d0, now + DAY];
    if (p === 'd7' || p === 'week') return [d0 - 6 * DAY, now + DAY];
    if (p === 'd30') return [d0 - 29 * DAY, now + DAY];
    const m = new Date(now); m.setDate(1); m.setHours(0, 0, 0, 0); return [m.getTime(), now + DAY];
  }
  const inRange = (p) => { const [a, b] = range(p); return S.bills.filter(x => x.t >= a && x.t < b); };
  const segHtml = (act, cur, opts) => '<span class="seg">' + opts.map(o => '<button class="' + (cur === o ? 'on' : '') + '" data-act="' + act + '" data-id="' + o + '">' + esc(t(o)) + '</button>').join('') + '</span>';

  // ---------- barbers ----------
  function barberCalc(bid, list) {
    const mine = list.filter(b => b.bid === bid);
    let svcAmt = 0, prodAmt = 0, tips = 0; const cnt = {};
    mine.forEach(b => {
      const s = b.items.filter(l => l.k === 's').reduce((a, l) => a + l.p * l.q, 0);
      svcAmt += Math.max(0, s - b.disc);
      prodAmt += b.items.filter(l => l.k === 'p').reduce((a, l) => a + l.p * l.q, 0);
      tips += b.tip;
      b.items.filter(l => l.k === 's').forEach(l => { cnt[l.id] = (cnt[l.id] || 0) + l.q; });
    });
    const B = barber(bid), pct = S.pct[bid];
    const com = Math.round(svcAmt * pct / 100), pcom = Math.round(prodAmt * B.ppct / 100);
    return { mine, svcAmt, prodAmt, tips, pct, com, pcom, pay: com + pcom + tips, cnt };
  }
  function renderBarbers() {
    const list = inRange(U.bp);
    const cards = D.barbers.map(B => {
      const k = barberCalc(B.id, list);
      const top = Object.entries(k.cnt).sort((a, b) => b[1] - a[1]).slice(0, 4);
      const mx = top.length ? top[0][1] : 1;
      const st = inChair(B.id) ? 'busy' : S.brk[B.id] ? 'brk' : 'free';
      return '<article class="bb"><header><span class="bb-chair">' + esc(t('chair')) + ' ' + B.chair + '</span><h3>' + esc(nm(B)) + '</h3>' +
        '<small>' + esc(U.lang === 'si' ? B.role_si : B.role_en) + '</small><span class="dot s-' + st + '">' + esc(t(st === 'busy' ? 'busy' : st === 'brk' ? 'onBreak' : 'free')) + '</span></header>' +
        '<div class="bb-pay"><small>' + esc(t('payout')) + '</small><b>' + esc(money(k.pay)) + '</b></div>' +
        '<dl>' +
        '<div><dt>' + esc(t('customers')) + '</dt><dd>' + k.mine.length + '</dd></div>' +
        '<div><dt>' + esc(t('svcSales')) + '</dt><dd>' + esc(num(k.svcAmt)) + '</dd></div>' +
        '<div><dt>' + esc(t('commission')) + ' <span class="pct"><button data-act="pct" data-id="' + B.id + '" data-d="-5">−</button><b>' + k.pct + '%</b><button data-act="pct" data-id="' + B.id + '" data-d="5">+</button></span></dt><dd>' + esc(num(k.com)) + '</dd></div>' +
        '<div><dt>' + esc(t('prodSales')) + ' <small>(' + B.ppct + '%)</small></dt><dd>' + esc(num(k.prodAmt)) + ' → ' + esc(num(k.pcom)) + '</dd></div>' +
        '<div><dt>' + esc(t('tips')) + '</dt><dd>' + esc(num(k.tips)) + '</dd></div>' +
        '</dl>' +
        '<div class="bb-top"><small>' + esc(t('topSvc')) + '</small>' + (top.length ? top.map(([id, n]) => '<div class="hb"><span>' + esc(sName(id)) + '</span><i style="width:' + (n / mx * 100) + '%"></i><b>' + n + '</b></div>').join('') : '<p class="empty">' + esc(t('noJobs')) + '</p>') + '</div>' +
        '<footer><button class="btn ghost sm" data-act="jobs" data-id="' + B.id + '">' + esc(t('jobs')) + ' (' + k.mine.length + ')</button>' +
        '<a class="btn wa sm" target="_blank" rel="noopener" href="' + esc(waLink('', t('slipMsg', { name: nm(B), period: t(U.bp), c: k.mine.length, s: money(k.svcAmt), p: k.pct, cm: money(k.com), pc: money(k.pcom), tp: money(k.tips), tot: money(k.pay) }))) + '">' + esc(t('sendSlip')) + '</a></footer></article>';
    }).join('');
    const tot = D.barbers.reduce((s, B) => s + barberCalc(B.id, list).pay, 0);
    $('#pg-barbers').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_barbers')) + '</h1>' + segHtml('bp', U.bp, ['today', 'week', 'month']) +
      '<div class="pg-sum"><small>' + esc(t('payout')) + '</small><b>' + esc(money(tot)) + '</b></div></div><div class="bb-grid">' + cards + '</div>';
  }
  T.en.week = '7 days'; T.si.week = 'දින 7';
  function openJobs(bid) {
    const k = barberCalc(bid, inRange(U.bp));
    const rows = k.mine.slice().reverse().slice(0, 80).map(b => '<tr class="click" data-act="viewbill" data-id="' + b.no + '"><td>' + esc(U.bp === 'today' ? fmtTime(b.t) : fmtDate(b.t)) + '</td><td>' + esc(b.name || t('walkin')) + '</td><td>' + esc(b.items.filter(l => l.k === 's').map(l => sName(l.id)).join(' + ')) + '</td><td class="r">' + esc(num(b.total)) + '</td></tr>').join('');
    openModal(shHead(esc(t('jobs')) + ' · ' + esc(bName(bid)), esc(t(U.bp)) + ' · ' + k.mine.length) +
      '<div class="sh-body">' + (rows ? '<table class="tbl">' + rows + '</table>' : '<p class="empty">' + esc(t('noJobs')) + '</p>') + '</div>', 'wide');
  }

  // ---------- customers ----------
  function custIndex() {
    const m = {};
    S.bills.forEach(b => { if (!b.cid) return; const o = m[b.cid] || (m[b.cid] = { n: 0, last: 0, spent: 0 }); o.n++; o.last = Math.max(o.last, b.t); o.spent += b.total; });
    return m;
  }
  function renderCustomers() {
    const ix = custIndex(), now = Date.now();
    const q = U.cq.trim().toLowerCase();
    let list = S.custs.map(c => ({ c, s: ix[c.id] || { n: 0, last: c.since, spent: 0 } }));
    if (q) list = list.filter(o => o.c.name.toLowerCase().includes(q) || o.c.phone.includes(q.replace(/\D/g, '') || '@'));
    if (U.cf === 'regulars') list = list.filter(o => o.s.n >= 3);
    if (U.cf === 'due') list = list.filter(o => (now - o.s.last) / DAY >= 28);
    list.sort((a, b) => U.cf === 'due' ? a.s.last - b.s.last : U.cf === 'regulars' ? b.s.n - a.s.n : b.s.last - a.s.last);
    const dueN = S.custs.filter(c => { const s = ix[c.id]; return s && (now - s.last) / DAY >= 28; }).length;
    const rows = list.slice(0, 120).map(o => '<tr class="click' + (U.sel === o.c.id ? ' sel' : '') + '" data-act="csel" data-id="' + o.c.id + '"><td><b>' + esc(o.c.name) + '</b><span class="sub">' + esc(o.c.phone) + '</span></td>' +
      '<td class="c">' + o.s.n + '</td><td>' + esc(ago(o.s.last)) + '</td><td class="hide-s">' + esc(bName(o.c.fav)) + '</td><td class="r">' + esc(num(o.s.spent)) + '</td></tr>').join('');
    $('#pg-customers').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_customers')) + ' <small>' + S.custs.length + '</small></h1>' +
      '<label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="cq" placeholder="' + esc(t('search')) + '" value="' + esc(U.cq) + '"></label>' +
      '<span class="seg">' + ['all', 'regulars', 'due'].map(f => '<button class="' + (U.cf === f ? 'on' : '') + '" data-act="cf" data-id="' + f + '">' + esc(t(f)) + (f === 'due' ? ' <i class="badge">' + dueN + '</i>' : '') + '</button>').join('') + '</span></div>' +
      '<div class="c-grid"><div class="panel tbl-wrap"><table class="tbl"><thead><tr><th>' + esc(t('name')) + '</th><th class="c">' + esc(t('visits')) + '</th><th>' + esc(t('lastVisit')) + '</th><th class="hide-s">' + esc(t('favBarber')) + '</th><th class="r">' + esc(t('spent')) + '</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="5" class="empty">' + esc(t('noMatch')) + '</td></tr>') + '</tbody></table></div>' +
      '<aside class="panel profile" id="profile">' + profileHtml() + '</aside></div>';
    const inp = $('#cq');
    inp.addEventListener('input', () => { U.cq = inp.value; const pos = inp.selectionStart; renderCustomers(); const n = $('#cq'); n.focus(); n.setSelectionRange(pos, pos); });
  }
  function profileHtml() {
    const c = U.sel ? cust(U.sel) : null;
    if (!c) return '<p class="empty">' + esc(t('pickCust')) + '</p>';
    const st = custStats(c);
    const days = st.last ? Math.round((Date.now() - st.last) / DAY) : 0;
    const hist = st.list.slice().reverse().slice(0, 12).map(b => '<li data-act="viewbill" data-id="' + b.no + '"><span class="h-d">' + esc(fmtDate(b.t)) + '</span><span class="h-s">' + esc(b.items.filter(l => l.k === 's').map(l => sName(l.id)).join(' + ')) + '<small>' + esc(bName(b.bid)) + '</small></span><b>' + esc(num(b.total)) + '</b></li>').join('');
    return '<div class="pf-head"><div class="pf-av">' + esc(c.name.split(' ').map(w => w[0]).join('').slice(0, 2)) + '</div><div><h2>' + esc(c.name) + '</h2><span>' + esc(c.phone || t('noPhone')) + ' · ' + esc(t('since')) + ' ' + esc(fmtDate(c.since)) + '</span></div></div>' +
      '<div class="pf-stats"><div><b>' + st.n + '</b><span>' + esc(t('visits')) + '</span></div><div><b>' + esc(st.last ? ago(st.last) : '–') + '</b><span>' + esc(t('lastVisit')) + '</span></div><div><b>' + esc(num(st.spent)) + '</b><span>' + esc(t('spent')) + '</span></div><div><b>' + esc(bName(c.fav)) + '</b><span>' + esc(t('favBarber')) + '</span></div></div>' +
      '<label class="pf-note"><span>' + esc(t('notes')) + '</span><textarea id="cNote" rows="2">' + esc(noteTxt(c)) + '</textarea></label>' +
      '<div class="pf-act"><button class="btn ghost sm" data-act="csave" data-id="' + c.id + '">' + esc(t('save')) + '</button>' +
      '<a class="btn wa sm" target="_blank" rel="noopener" href="' + esc(waLink(c.phone, t('remindMsg', { name: c.name.split(' ')[0], n: days }))) + '">' + esc(t('remind')) + '</a>' +
      '<button class="btn brass sm" data-act="ctok" data-id="' + c.id + '">' + esc(t('tokenFor2')) + '</button></div>' +
      '<h3>' + esc(t('history')) + '</h3><ol class="hist">' + hist + '</ol>';
  }

  // ---------- reports ----------
  function renderReports() {
    const p = U.rp, list = inRange(p);
    const tot = list.reduce((s, b) => s + b.total, 0);
    const avgW = list.length ? Math.round(list.reduce((s, b) => s + b.wait, 0) / list.length) : 0;
    const prods = list.reduce((s, b) => s + b.items.filter(l => l.k === 'p').reduce((a, l) => a + l.q, 0), 0);
    let bars;
    if (p === 'today') {
      const hrs = []; for (let h = 8; h <= 20; h++) hrs.push(h);
      const v = hrs.map(h => list.filter(b => new Date(b.t).getHours() === h).reduce((s, b) => s + b.total, 0));
      const mx = Math.max(1, ...v), nowH = new Date().getHours();
      bars = hrs.map((h, i) => '<div class="bar' + (h === nowH ? ' now' : '') + '"><em>' + (v[i] ? (v[i] >= 1000 ? (v[i] / 1000).toFixed(1) + 'k' : v[i]) : '') + '</em><i style="height:' + (v[i] / mx * 100) + '%"></i><span>' + (h % 12 || 12) + '</span></div>').join('');
    } else {
      const n = p === 'd7' ? 7 : 30, d0 = dayStart(Date.now()), days = [];
      for (let i = n - 1; i >= 0; i--) days.push(d0 - i * DAY);
      const v = days.map(d => list.filter(b => b.t >= d && b.t < d + DAY).reduce((s, b) => s + b.total, 0));
      const mx = Math.max(1, ...v);
      bars = days.map((d, i) => { const dt = new Date(d); const lab = n === 7 ? t('dshort')[dt.getDay()] : (dt.getDate() % 5 === 0 || i === n - 1 ? String(dt.getDate()) : '');
        return '<div class="bar' + (i === n - 1 ? ' now' : '') + (dt.getDay() === 0 || dt.getDay() === 6 ? ' we' : '') + '" title="' + fmtDate(d) + ' · ' + money(v[i]) + '"><em>' + (n === 7 ? (v[i] / 1000).toFixed(1) + 'k' : '') + '</em><i style="height:' + (v[i] / mx * 100) + '%"></i><span>' + esc(lab) + '</span></div>'; }).join('');
    }
    const cnt = {};
    list.forEach(b => b.items.filter(l => l.k === 's').forEach(l => { const o = cnt[l.id] || (cnt[l.id] = { n: 0, v: 0 }); o.n += l.q; o.v += l.p * l.q; }));
    const svcRows = Object.entries(cnt).sort((a, b) => b[1].v - a[1].v);
    const smx = svcRows.length ? svcRows[0][1].v : 1;
    const pm = ['cash', 'qr', 'card'].map(m => ({ m, v: list.filter(b => b.method === m).reduce((s, b) => s + b.total, 0) }));
    const pt = Math.max(1, pm.reduce((s, o) => s + o.v, 0));
    const recent = list.slice().reverse();
    $('#pg-reports').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_reports')) + '</h1>' + segHtml('rp', p, ['today', 'd7', 'd30']) + '</div>' +
      '<div class="strip">' +
        '<div class="hi"><b>' + esc(money(tot)) + '</b><span>' + esc(t('tTakings')) + '</span></div>' +
        '<div><b>' + list.length + '</b><span>' + esc(t('tCust')) + '</span></div>' +
        '<div><b>' + esc(num(list.length ? tot / list.length : 0)) + '</b><span>' + esc(t('avgBill')) + '</span></div>' +
        '<div><b>' + avgW + '<small> ' + esc(t('mins')) + '</small></b><span>' + esc(t('tAvgWait')) + '</span></div>' +
        '<div><b>' + prods + '</b><span>' + esc(t('tProducts')) + '</span></div>' +
      '</div>' +
      '<div class="r-grid">' +
        '<section class="panel chart"><h3>' + esc(t(p === 'today' ? 'byHour' : 'byDay')) + '</h3><div class="bars n' + (p === 'today' ? 13 : p === 'd7' ? 7 : 30) + '">' + bars + '</div></section>' +
        '<section class="panel"><h3>' + esc(t('payMix')) + '</h3><div class="stack">' + pm.map(o => '<i class="m-' + o.m + '" style="width:' + (o.v / pt * 100) + '%"></i>').join('') + '</div>' +
          '<ul class="legend">' + pm.map(o => '<li><i class="m-' + o.m + '"></i><span>' + esc(t(o.m)) + '</span><b>' + esc(money(o.v)) + '</b><em>' + Math.round(o.v / pt * 100) + '%</em></li>').join('') + '</ul>' +
          '<h3 class="mt">' + esc(t('svcMix')) + '</h3>' + svcRows.slice(0, 7).map(([id, o]) => '<div class="hb wide"><span>' + esc(sName(id)) + ' <small>× ' + o.n + '</small></span><i style="width:' + (o.v / smx * 100) + '%"></i><b>' + esc(num(o.v)) + '</b></div>').join('') + '</section>' +
        '<section class="panel bills"><h3>' + esc(t('bills')) + ' <small>' + list.length + '</small></h3><div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>' + esc(t('time')) + '</th><th>' + esc(t('barber')) + '</th><th class="hide-s">' + esc(t('items')) + '</th><th>' + esc(t('pay')) + '</th><th class="r">' + esc(t('amount')) + '</th></tr></thead><tbody>' +
          recent.slice(0, 20).map(b => '<tr class="click" data-act="viewbill" data-id="' + b.no + '"><td><b>' + esc(b.no) + '</b></td><td>' + esc(p === 'today' ? fmtTime(b.t) : fmtDate(b.t)) + '</td><td>' + esc(bName(b.bid)) + '</td><td class="hide-s">' + esc(b.items.map(l => l.k === 's' ? sName(l.id) : nm(D.products.find(x => x.id === l.id))).join(', ')) + '</td><td><span class="pm m-' + b.method + '">' + esc(t(b.method)) + '</span></td><td class="r">' + esc(num(b.total)) + '</td></tr>').join('') +
          '</tbody></table></div>' + (recent.length > 20 ? '<p class="more">' + esc(t('more', { n: recent.length - 20 })) + '</p>' : '') + '</section>' +
      '</div>';
  }

  // ---------- prices + settings ----------
  function renderPrices() {
    const srows = S.services.map(s => '<tr><td><b>' + esc(sName(s.id)) + '</b></td><td class="r"><input class="num" data-ed="sp" data-id="' + s.id + '" inputmode="numeric" value="' + s.price + '"></td><td class="r"><input class="num sm" data-ed="sm" data-id="' + s.id + '" inputmode="numeric" value="' + s.mins + '"></td></tr>').join('');
    const prows = S.products.map(p => '<tr><td><b>' + esc(nm(D.products.find(x => x.id === p.id))) + '</b>' + (p.stock <= 3 ? ' <span class="lowpill">' + esc(t('low')) + '</span>' : '') + '</td><td class="r"><input class="num" data-ed="pp" data-id="' + p.id + '" inputmode="numeric" value="' + p.price + '"></td><td class="r"><input class="num sm" data-ed="ps" data-id="' + p.id + '" inputmode="numeric" value="' + p.stock + '"></td></tr>').join('');
    $('#pg-prices').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_prices')) + '</h1></div><div class="p-grid">' +
      '<section class="panel"><h3>' + esc(t('priceList')) + '</h3><table class="tbl ed"><thead><tr><th></th><th class="r">' + esc(t('price')) + ' (Rs)</th><th class="r">' + esc(t('mins2')) + '</th></tr></thead><tbody>' + srows + '</tbody></table></section>' +
      '<div class="stack-col"><section class="panel"><h3>' + esc(t('productList')) + '</h3><table class="tbl ed"><thead><tr><th></th><th class="r">' + esc(t('price')) + ' (Rs)</th><th class="r">' + esc(t('stock')) + '</th></tr></thead><tbody>' + prows + '</tbody></table></section>' +
      '<section class="panel"><h3>' + esc(t('settings')) + '</h3><div class="set-row"><span>' + esc(t('language')) + '</span><span class="seg"><button class="' + (U.lang === 'en' ? 'on' : '') + '" data-act="setlang" data-id="en">English</button><button class="' + (U.lang === 'si' ? 'on' : '') + '" data-act="setlang" data-id="si">සිංහල</button></span></div>' +
      '<div class="set-row"><span>' + esc(t('demoData')) + '<small>' + esc(t('resetTxt')) + '</small></span><button class="btn ghost sm" data-act="reset">' + esc(t('reset')) + '</button></div></section>' +
      '<section class="panel talk"><h3>' + esc(t('talk')) + '</h3><p>' + esc(t('talkTxt')) + '</p><a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(WA_NUMBER, t('waWelcome'))) + '">' + esc(t('demoCta')) + '</a></section></div></div>';
  }

  // ---------- TV screen ----------
  function renderTV() {
    const wl = waitingList();
    $('#tv').innerHTML = '<div class="tv-in"><header><div class="tv-brand"><b>ROYAL CUT</b><span>' + esc(t('nowServing')) + '</span></div><div class="tv-clock">' + esc(fmtTime(Date.now())) + '</div><button class="sh-x" data-act="tvclose">×</button></header>' +
      '<div class="tv-chairs">' + D.barbers.map(B => { const x = inChair(B.id); return '<div class="tvc' + (x ? '' : ' idle') + '"><span>' + esc(t('chair')) + ' ' + B.chair + ' · ' + esc(nm(B)) + '</span>' + (x ? '<b>' + x.tok + '</b>' : '<strong>' + esc(S.brk[B.id] ? t('onBreak') : t('free')) + '</strong>') + '</div>'; }).join('') + '</div>' +
      '<div class="tv-next"><span>' + esc(t('nextUp')) + '</span>' + (wl.length ? wl.slice(0, 6).map(x => '<b>' + x.tok + '</b>').join('') : '<em>—</em>') + '</div></div>';
  }

  // ---------- events ----------
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) { if (e.target.id === 'modal') closeModal(); return; }
    const a = el.dataset.act, id = el.dataset.id;
    const tokx = () => S.queue.find(x => x.tok === +id);
    switch (a) {
      case 'nav': go(id); break;
      case 'lang': U.lang = U.lang === 'si' ? 'en' : 'si'; applyLang(); break;
      case 'setlang': U.lang = id; applyLang(); break;
      case 'close': closeModal(); break;
      case 'tv': renderTV(); $('#tv').hidden = false; document.body.classList.add('noscroll'); break;
      case 'tvclose': $('#tv').hidden = true; document.body.classList.remove('noscroll'); break;
      case 'newtok': openNewToken(); break;
      case 'ntsvc': { const s = U.nt.svcs, i = s.indexOf(id); if (i >= 0) s.splice(i, 1); else s.push(id); keepNt(); renderNewToken(); break; }
      case 'ntpref': U.nt.pref = id || null; keepNt(); renderNewToken(); break;
      case 'ntpick': { const c = cust(id); Object.assign(U.nt, { cid: c.id, name: c.name, phone: c.phone }); renderNewToken(); break; }
      case 'ntclear': Object.assign(U.nt, { cid: null, name: '', phone: '' }); renderNewToken(); break;
      case 'ntissue': keepNt(); issueToken(); break;
      case 'printslip': { const x = tokx(); if (x) doPrint('<div class="rc slipp"><div class="rc-h"><b>ROYAL CUT</b><span>' + esc(t('shopSub')) + '</span></div><div class="big">' + x.tok + '</div><p>' + esc(custName(x)) + '</p><p>' + esc(x.svcs.map(sName).join(' + ')) + '</p><p>' + esc(fmtDate(x.t) + ' ' + fmtTime(x.t)) + '</p></div>'); break; }
      case 'callnext': { const n = nextFor(id); if (n) seat(n, id); break; }
      case 'seat': {
        const x = tokx(); if (!x) break;
        if (x.pref && !inChair(x.pref) && !S.brk[x.pref]) { seat(x, x.pref); break; }
        const free = D.barbers.filter(b => !inChair(b.id) && !S.brk[b.id]);
        if (!free.length) toast(t('noFree'));
        else if (free.length === 1) seat(x, free[0].id);
        else openChooser(x);
        break;
      }
      case 'seatto': { const x = tokx(); closeModal(); if (x) seat(x, el.dataset.b); break; }
      case 'noshow': {
        const i = S.queue.findIndex(x => x.tok === +id); if (i < 0) break;
        const [x] = S.queue.splice(i, 1); save(); renderPage(); renderCounts();
        toast(t('removed', { n: x.tok }), { label: t('undo'), fn: () => { S.queue.splice(Math.min(i, S.queue.length), 0, x); save(); renderPage(); renderCounts(); } });
        break;
      }
      case 'brk': if (S.brk[id]) delete S.brk[id]; else S.brk[id] = true; save(); renderPage(); break;
      case 'addsvc': openAddSvc(id); break;
      case 'chsvc': { const x = inChair(el.dataset.b); if (!x) break; const i = x.svcs.indexOf(id); if (i >= 0) { if (x.svcs.length > 1) x.svcs.splice(i, 1); } else x.svcs.push(id); save(); openAddSvc(el.dataset.b); renderPage(); break; }
      case 'finish': openBill(id); break;
      case 'btab': U.btab = id; renderBill(); break;
      case 'badd': {
        const k = el.dataset.k, l = U.bill.lines.find(x => x.k === k && x.id === id);
        if (l) l.q++; else U.bill.lines.push({ k, id, q: 1, p: k === 's' ? sv(id).price : pr(id).price });
        renderBill(); break;
      }
      case 'bq': { const l = U.bill.lines[+id]; l.q += +el.dataset.d; if (l.q <= 0) U.bill.lines.splice(+id, 1); renderBill(); break; }
      case 'bdt': U.bill.dtype = id; renderBill(); break;
      case 'btip': U.bill.tip = +id; renderBill(); break;
      case 'bpay': U.bill.method = id; renderBill(); break;
      case 'bdone': completeBill(); break;
      case 'printbill': { const b = S.bills.find(x => x.no === id); if (b) doPrint(receiptHtml(b)); break; }
      case 'viewbill': { const b = S.bills.find(x => x.no === id); if (b) showReceipt(b); break; }
      case 'bp': U.bp = id; renderBarbers(); break;
      case 'pct': S.pct[id] = Math.max(0, Math.min(80, S.pct[id] + +el.dataset.d)); save(); renderBarbers(); break;
      case 'jobs': openJobs(id); break;
      case 'cf': U.cf = id; renderCustomers(); break;
      case 'csel':
        U.sel = id;
        if (window.innerWidth < 1000) openModal(shHead(esc(cust(id).name)) + '<div class="sh-body profile">' + profileHtml() + '</div>', 'wide');
        else { $$('#pg-customers tr.sel').forEach(r => r.classList.remove('sel')); el.classList.add('sel'); $('#profile').innerHTML = profileHtml(); }
        break;
      case 'csave': { const c = cust(id), v = $('#cNote').value.trim(); c.note = v || null; save(); toast(t('saved')); break; }
      case 'ctok': closeModal(); go('queue'); openNewToken(id); break;
      case 'rp': U.rp = id; renderReports(); break;
      case 'reset': try { localStorage.removeItem(KEY); } catch (er) { /* ignore */ } S = makeDemo(new Date()); save(); U.sel = null; toast(t('resetDone')); renderPage(); renderCounts(); break;
    }
  });
  function keepNt() { const p = $('#ntPhone'), n = $('#ntName'); if (p) U.nt.phone = p.value; if (n) U.nt.name = n.value; }
  document.addEventListener('change', e => {
    const el = e.target; const ed = el.dataset && el.dataset.ed; if (!ed) return;
    const v = Math.max(0, Math.round(+el.value || 0));
    if (ed === 'sp') sv(el.dataset.id).price = v; if (ed === 'sm') sv(el.dataset.id).mins = Math.max(5, v);
    if (ed === 'pp') pr(el.dataset.id).price = v; if (ed === 'ps') pr(el.dataset.id).stock = v;
    save(); toast(t('updated')); renderPrices();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!$('#tv').hidden) { $('#tv').hidden = true; document.body.classList.remove('noscroll'); } else if (!$('#modal').hidden) closeModal(); }
  });
  window.addEventListener('afterprint', () => { $('#print').innerHTML = ''; });

  // live timers
  setInterval(() => {
    tick();
    if (U.page === 'queue') renderQueue();
    if (!$('#tv').hidden) renderTV();
  }, 20000);

  go(U.page);
  applyLang();
})();
