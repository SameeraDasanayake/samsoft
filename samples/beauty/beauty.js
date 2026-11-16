// Samsoft Beauty demo (ladies salon "Senuri Bridal & Beauty"): stylist calendar, bridal bookings, clients, reminders, reports.
(function () {
  'use strict';
  const D = window.BEAUTY;
  const WA_NUMBER = '94704808744';
  const KEY = 'samsoft-beauty-demo-v1';
  const MIN = 60000, DAY = 86400000, SLOT = 15;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const T = {
    en: {
      demoMsg: 'Demo: Samsoft software for a ladies salon & bridal studio. We set it up for your salon.', demoCta: 'Get it for my salon',
      waWelcome: 'Hello Samsoft, I tried the ladies salon demo. I would like to know about software for my salon.',
      shopSub: 'Bridal & Beauty · Nugegoda',
      nav_cal: 'Calendar', nav_bridal: 'Bridal', nav_clients: 'Clients', nav_rem: 'Reminders', nav_reports: 'Reports',
      today: 'Today', newAppt: 'New appointment', appts: 'appointments', bridalToday: 'Bridal today',
      booked: 'Booked', arrived: 'Arrived', inservice: 'In service', done: 'Done', noshow: 'No-show',
      markArrived: 'Mark arrived', start: 'Start service', checkout: 'Checkout', viewBill: 'View bill', cancelAppt: 'Cancel', markNoShow: 'No-show',
      sendRem: 'WhatsApp reminder', remSent: 'Reminder sent', deposit: 'Advance paid', allergy: 'Allergy', hairType: 'Hair', skinType: 'Skin', formula: 'Colour formula',
      client: 'Client', searchClient: 'Search name or phone', newClient: 'New client', name: 'Name', phone: 'Phone', date: 'Date', time: 'Time',
      stylist: 'Stylist', services: 'Services', products: 'Products', mins: 'min', total: 'Total', save: 'Save', saved: 'Saved', close: 'Close',
      pickSvc: 'Pick at least one service', pickClient: 'Pick a client or type a name', clash: '{s} is busy at that time', outHours: 'Outside opening hours (9 am – 7 pm)',
      apptSaved: 'Appointment saved', cancelled: 'Appointment cancelled', undo: 'Undo', notFor: 'not usually done by {s}',
      discount: 'Discount', subtotal: 'Subtotal', lessAdv: 'Less advance', toPay: 'To pay', pay: 'Payment', cash: 'Cash', card: 'Card', qr: 'LankaQR', bank: 'Bank transfer',
      complete: 'Complete', billSaved: 'Bill {n} saved', receipt: 'Receipt', print: 'Print', sendWa: 'Send on WhatsApp', ok: 'Done', emptyBill: 'Add at least one item',
      upcoming: 'Upcoming', completed: 'Completed', newBooking: 'New bridal booking', event: 'Event', venue: 'Venue', trial: 'Trial', trialDone: 'Trial done',
      markTrial: 'Mark trial done', paid: 'Paid', balance: 'Balance', addPay: 'Add payment', payments: 'Payments', amount: 'Amount', statement: 'Send statement',
      markComplete: 'Mark completed', daysTo: 'in {n} days', daysAgo: '{n} days ago', tomorrow: 'tomorrow', yesterday: 'yesterday', todayW: 'today',
      pack: 'Package', extras: 'Extras', qty: 'Qty', advance: 'Advance now', bride: 'Bride', bookingSaved: 'Booking saved', paySaved: 'Payment added',
      pickPack: 'Pick a main package', needName: 'Type the bride\'s name', needDate: 'Pick the event date', fullyPaid: 'Fully paid', dueBy: 'Balance due by {d}',
      clients: 'Clients', visits: 'visits', lastVisit: 'Last visit', spent: 'Spent', since: 'Client since', history: 'History', nextAppt: 'Next appointment',
      notes: 'Notes', book: 'Book appointment', noMatch: 'No clients match.', pickOne: 'Pick a client to see the profile.', none: '—',
      remTomorrow: 'Tomorrow\'s appointments', remBridal: 'Bridal balances due (next 30 days)', remTrial: 'Trials in the next 7 days',
      remEmpty: 'Nothing here.', sendAll: 'Mark all sent',
      revenue: 'Revenue', apptsDone: 'Appointments done', noShows: 'No-shows', avgBill: 'Average bill', bridalIn: 'Bridal payments in',
      byStylist: 'By stylist', byDay: 'Revenue by day', mix: 'Where the money comes from', topSvc: 'Top services', bills: 'Bills', d7: '7 days', d30: '30 days',
      settings: 'Settings', language: 'Language', priceList: 'Service prices', stock: 'Stock', price: 'Price', low: 'Low', demoData: 'Demo data',
      resetTxt: 'Erase your changes and load fresh demo data.', reset: 'Restart the demo', resetDone: 'Fresh demo data loaded', updated: 'Updated',
      talk: 'Want this for your salon? We change the services, packages, stylists and receipts to fit you.',
      am: 'AM', pm: 'PM', dshort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dlong: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      mon: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      remMsg: 'Hi {name}, a reminder from Senuri Bridal & Beauty, Nugegoda: your appointment is {when} at {time} with {s} ({svc}). Please reply YES to confirm. Thank you!',
      stMsg: 'Dear {name},\nSenuri Bridal & Beauty – {pack}\nEvent: {date}, {venue}\nTotal: {tot}\nPaid: {paid}\nBalance: {bal}\nPlease settle the balance by {due}. Thank you!'
    },
    si: {
      demoMsg: 'Demo: ලේඩීස් සැලෝන් / බ්‍රයිඩල් ස්ටූඩියෝ එකකට Samsoft software. ඔබේ සැලෝන් එකට ගැලපෙන්න හදලා දෙනවා.', demoCta: 'මගේ සැලෝන් එකටත් ඕනේ',
      waWelcome: 'ආයුබෝවන් Samsoft, මම ladies salon demo එක බැලුවා. මගේ සැලෝන් එකටත් software එකක් ගැන දැනගන්න ඕනේ.',
      shopSub: 'Bridal & Beauty · නුගේගොඩ',
      nav_cal: 'දින දර්ශනය', nav_bridal: 'මනාලියන්', nav_clients: 'පාරිභෝගිකයෝ', nav_rem: 'මතක් කිරීම්', nav_reports: 'වාර්තා',
      today: 'අද', newAppt: 'අලුත් වෙලාවක්', appts: 'වෙලාවන්', bridalToday: 'අද මනාලියන්',
      booked: 'වෙන් කළා', arrived: 'ආවා', inservice: 'සේවය කරමින්', done: 'අවසන්', noshow: 'ආවේ නෑ',
      markArrived: 'ආවා ලෙස සලකුණු', start: 'සේවය අරඹන්න', checkout: 'බිල දාන්න', viewBill: 'බිල බලන්න', cancelAppt: 'අවලංගු කරන්න', markNoShow: 'ආවේ නෑ',
      sendRem: 'WhatsApp මතක් කිරීම', remSent: 'මතක් කිරීම යැව්වා', deposit: 'අත්තිකාරම', allergy: 'ආසාත්මිකතා', hairType: 'කොණ්ඩය', skinType: 'සම', formula: 'පාට formula',
      client: 'පාරිභෝගිකයා', searchClient: 'නම හෝ දුරකථනය සොයන්න', newClient: 'අලුත් පාරිභෝගිකයෙක්', name: 'නම', phone: 'දුරකථනය', date: 'දිනය', time: 'වේලාව',
      stylist: 'Stylist', services: 'සේවා', products: 'භාණ්ඩ', mins: 'මි.', total: 'මුළු මුදල', save: 'Save', saved: 'Save කළා', close: 'වසන්න',
      pickSvc: 'අඩුම තරමේ එක සේවාවක් තෝරන්න', pickClient: 'පාරිභෝගිකයෙක් තෝරන්න හෝ නමක් ලියන්න', clash: 'ඒ වෙලාවේ {s} කාර්යබහුලයි', outHours: 'විවෘත වේලාවෙන් පිට (පෙ.ව. 9 – ප.ව. 7)',
      apptSaved: 'වෙලාව save කළා', cancelled: 'වෙලාව අවලංගු කළා', undo: 'ආපසු', notFor: '{s} සාමාන්‍යයෙන් කරන්නේ නෑ',
      discount: 'වට්ටම', subtotal: 'එකතුව', lessAdv: 'අත්තිකාරම අඩු කළා', toPay: 'ගෙවිය යුතු', pay: 'ගෙවීම', cash: 'මුදල්', card: 'කාඩ්', qr: 'LankaQR', bank: 'බැංකු මාරුව',
      complete: 'අවසන් කරන්න', billSaved: 'බිල {n} save කළා', receipt: 'බිල්පත', print: 'Print', sendWa: 'WhatsApp යවන්න', ok: 'හරි', emptyBill: 'අඩුම තරමේ එකක් එකතු කරන්න',
      upcoming: 'ඉදිරියට', completed: 'අවසන් වූ', newBooking: 'අලුත් මනාලිය booking', event: 'උත්සවය', venue: 'ස්ථානය', trial: 'Trial', trialDone: 'Trial අවසන්',
      markTrial: 'Trial අවසන් ලෙස', paid: 'ගෙවූ', balance: 'ඉතිරිය', addPay: 'ගෙවීමක් එකතු', payments: 'ගෙවීම්', amount: 'මුදල', statement: 'ප්‍රකාශය යවන්න',
      markComplete: 'අවසන් ලෙස සලකුණු', daysTo: 'දින {n}කින්', daysAgo: 'දින {n}කට පෙර', tomorrow: 'හෙට', yesterday: 'ඊයේ', todayW: 'අද',
      pack: 'පැකේජය', extras: 'අමතර', qty: 'ගණන', advance: 'දැන් අත්තිකාරම', bride: 'මනාලිය', bookingSaved: 'Booking එක save කළා', paySaved: 'ගෙවීම එකතු කළා',
      pickPack: 'ප්‍රධාන පැකේජයක් තෝරන්න', needName: 'මනාලියගේ නම ලියන්න', needDate: 'උත්සව දිනය තෝරන්න', fullyPaid: 'සම්පූර්ණයෙන් ගෙවා ඇත', dueBy: '{d}ට පෙර ඉතිරිය ගෙවිය යුතුයි',
      clients: 'පාරිභෝගිකයෝ', visits: 'වතාවක්', lastVisit: 'අවසන් පැමිණීම', spent: 'වියදම', since: 'පාරිභෝගිකයෙක් වූයේ', history: 'ඉතිහාසය', nextAppt: 'ඊළඟ වෙලාව',
      notes: 'සටහන්', book: 'වෙලාවක් දෙන්න', noMatch: 'ගැලපෙන කවුරුත් නෑ.', pickOne: 'විස්තර බලන්න පාරිභෝගිකයෙක් තෝරන්න.', none: '—',
      remTomorrow: 'හෙට වෙලාවන්', remBridal: 'ගෙවිය යුතු මනාලිය ශේෂ (ඉදිරි දින 30)', remTrial: 'ඉදිරි දින 7 Trials',
      remEmpty: 'මෙහි කිසිවක් නෑ.', sendAll: 'ඔක්කොම යැව්වා ලෙස',
      revenue: 'ආදායම', apptsDone: 'අවසන් වූ වෙලාවන්', noShows: 'නොපැමිණි', avgBill: 'සාමාන්‍ය බිල', bridalIn: 'ලැබුණු මනාලිය ගෙවීම්',
      byStylist: 'Stylist අනුව', byDay: 'දිනෙන් දිනට ආදායම', mix: 'ආදායම එන්නේ කොහෙන්ද', topSvc: 'වැඩියෙන්ම කළ සේවා', bills: 'බිල්පත්', d7: 'දින 7', d30: 'දින 30',
      settings: 'සැකසුම්', language: 'භාෂාව', priceList: 'සේවා මිල', stock: 'Stock', price: 'මිල', low: 'අඩුයි', demoData: 'Demo දත්ත',
      resetTxt: 'ඔබ කළ වෙනස්කම් මකා, මුල් demo දත්ත නැවත ලබාගන්න.', reset: 'Demo එක මුල ඉඳන්', resetDone: 'අලුත් demo දත්ත ආවා', updated: 'යාවත්කාලීන කළා',
      talk: 'ඔබේ සැලෝන් එකටත් ඕනෙද? සේවා, පැකේජ, stylists, බිල්පත් ඔබට ගැලපෙන්න වෙනස් කරලා දෙනවා.',
      am: 'පෙ.ව.', pm: 'ප.ව.', dshort: ['ඉරි', 'සඳු', 'අඟ', 'බදා', 'බ්‍රහ', 'සිකු', 'සෙන'],
      dlong: ['ඉරිදා', 'සඳුදා', 'අඟහරුවාදා', 'බදාදා', 'බ්‍රහස්පතින්දා', 'සිකුරාදා', 'සෙනසුරාදා'],
      mon: ['ජන', 'පෙබ', 'මාර්', 'අප්‍රේ', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝ', 'සැප්', 'ඔක්', 'නොවැ', 'දෙසැ'],
      remMsg: 'ආයුබෝවන් {name}, Senuri Bridal & Beauty නුගේගොඩෙන් මතක් කිරීමක්: ඔබේ වෙලාව {when} {time}ට, {s} සමඟ ({svc}). තහවුරු කිරීමට YES ලෙස reply කරන්න. ස්තූතියි!',
      stMsg: 'හිතවත් {name},\nSenuri Bridal & Beauty – {pack}\nඋත්සවය: {date}, {venue}\nමුළු මුදල: {tot}\nගෙවූ: {paid}\nඉතිරිය: {bal}\n{due}ට පෙර ඉතිරිය ගෙවන්න. ස්තූතියි!'
    }
  };

  // ---------- helpers ----------
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const dayStart = ms => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const addDays = (ms, n) => { const d = new Date(ms); d.setDate(d.getDate() + n); return d.getTime(); };
  const svcD = id => D.services.find(s => s.id === id);
  const packD = id => D.packs.find(p => p.id === id);
  const prodD = id => D.products.find(p => p.id === id);
  const styD = id => D.stylists.find(s => s.id === id);

  // ---------- demo data ----------
  function makeDemo(now) {
    const day0 = dayStart(now), nowT = now.getTime();
    const R = rng(Math.floor(day0 / DAY) * 104729 + 7);
    const pick = a => a[Math.floor(R() * a.length)];
    const wpick = a => { let s = a.reduce((x, o) => x + o.w, 0) * R(); for (const o of a) { s -= o.w; if (s <= 0) return o; } return a[0]; };
    const clients = [], used = new Set();
    for (let i = 0; i < 150; i++) {
      let name; do { name = pick(D.first) + ' ' + pick(D.last); } while (used.has(name)); used.add(name);
      clients.push({ id: 'c' + (i + 1), name, phone: '07' + pick(['0', '1', '2', '5', '6', '7', '8']) + String(1000000 + Math.floor(R() * 8999999)),
        hair: Math.floor(R() * D.hair.length), skin: Math.floor(R() * D.skin.length), allergy: R() < 0.22 ? 1 + Math.floor(R() * 4) : 0,
        formula: R() < 0.35 ? Math.floor(R() * 4) : 4, notes: '', since: addDays(day0, -60 - Math.floor(R() * 700)) });
    }
    const appts = [], bills = [];
    let aseq = 1, no = 5300;
    const FROM = -45, TO = 14;
    for (let d = FROM; d <= TO; d++) {
      const ds = addDays(day0, d), wd = new Date(ds).getDay();
      const busy = d < 0 ? (wd === 6 || wd === 0 ? 0.85 : 0.68) : d === 0 ? 0.8 : d <= 3 ? 0.62 : d <= 7 ? 0.4 : 0.2;
      D.stylists.forEach(st => {
        let t = D.shop.open * 60 + Math.floor(R() * 4) * 15;
        const can = D.services.filter(s => s.who.includes(st.id));
        while (t < D.shop.close * 60 - 30) {
          if (R() > busy) { t += 30 + Math.floor(R() * 3) * 15; continue; }
          const svcs = [wpick(can).id];
          if (R() < 0.25) { const x = wpick(can).id; if (!svcs.includes(x)) svcs.push(x); }
          const mins = svcs.reduce((s, id) => s + svcD(id).mins, 0);
          if (t + mins > D.shop.close * 60) break;
          const start = ds + t * MIN, end = start + mins * MIN;
          let status = 'booked';
          if (end <= nowT) status = R() < 0.07 ? 'noshow' : 'done';
          else if (start <= nowT) status = 'inservice';
          else if (start - nowT < 25 * MIN && d === 0) status = 'arrived';
          const big = svcs.some(id => ['kera', 'hilite', 'party', 'color'].includes(id));
          const a = { id: 'a' + (aseq++), cid: pick(clients).id, sid: st.id, start, mins, svcs, status, dep: big && R() < 0.6 ? 2000 : 0, rem: d === 1 && R() < 0.3, bill: null };
          appts.push(a);
          if (status === 'done') {
            const items = svcs.map(id => ({ k: 's', id, q: 1, p: svcD(id).price }));
            if (R() < 0.09) { const p = pick(D.products); items.push({ k: 'p', id: p.id, q: 1, p: p.price }); }
            const sub = items.reduce((s, l) => s + l.p * l.q, 0);
            const disc = R() < 0.06 ? Math.round(sub * 0.1 / 50) * 50 : 0;
            const r = R();
            const b = { no: 'S' + (no++), t: end, cid: a.cid, sid: st.id, aid: a.id, items, sub, disc, dep: a.dep, method: r < 0.5 ? 'cash' : r < 0.78 ? 'card' : 'qr', total: sub - disc };
            bills.push(b); a.bill = b.no;
          }
          t += mins + Math.floor(R() * 3) * 15;
        }
      });
    }
    bills.sort((a, b) => a.t - b.t);
    // bridal bookings
    const brides = [];
    const offs = [3, 9, 16, 24, 33, 47, 61, 78, 96, 120, -2, -9, -20, -33, -48, -60];
    const mains = ['kandyan', 'kandyan', 'western', 'home', 'engage'];
    offs.forEach((o, i) => {
      const c = clients[i * 7 + 3];
      const date = addDays(day0, o) + (5 * 60 + (i % 3) * 30) * MIN;
      const type = mains[i % mains.length];
      const lines = [{ id: type, q: 1 }];
      const maids = type === 'engage' ? Math.floor(R() * 2) : Math.floor(R() * 5);
      if (maids) lines.push({ id: 'maid', q: maids });
      if (type !== 'engage' && R() < 0.6) lines.push({ id: 'flower', q: 1 + Math.floor(R() * 2) });
      if (R() < 0.5) lines.push({ id: 'mother', q: 1 });
      const hasTrial = type !== 'engage' && R() < 0.75;
      if (hasTrial) lines.push({ id: 'trial', q: 1 });
      if (R() < 0.4) lines.push({ id: 'ext', q: 1 });
      if (type === 'kandyan' && R() < 0.5) lines.push({ id: 'jewel', q: 1 });
      if (R() < 0.5) lines.push({ id: 'travel', q: 1 });
      lines.forEach(l => { l.p = packD(l.id).price; });
      const tot = lines.reduce((s, l) => s + l.p * l.q, 0);
      const bookedOn = Math.min(day0 - 3 * DAY, date - (50 + Math.floor(R() * 100)) * DAY);
      const pays = [{ t: bookedOn + 11 * 3600000, amt: Math.round(tot * (0.25 + R() * 0.15) / 1000) * 1000, method: R() < 0.6 ? 'bank' : 'cash' }];
      const mid = bookedOn + Math.floor((Math.min(date, nowT) - bookedOn) * 0.6);
      if ((o < 0 || o < 40) && R() < 0.75 && mid < nowT - DAY) pays.push({ t: mid, amt: Math.round(tot * 0.3 / 1000) * 1000, method: 'bank' });
      if (o < 0) { const paid = pays.reduce((s, p) => s + p.amt, 0); if (tot > paid) pays.push({ t: date - 7 * DAY, amt: tot - paid, method: R() < 0.5 ? 'bank' : 'cash' }); }
      const trial = hasTrial ? dayStart(date - (14 + Math.floor(R() * 16)) * DAY) + (14 * 60) * MIN : null;
      brides.push({ id: 'b' + (i + 1), cid: c.id, name: c.name, phone: c.phone, type, date, venue: pick(D.venues), sid: i % 4 === 3 ? 's4' : 's1',
        lines, pays, trial, trialDone: trial ? trial < nowT : false, status: o < 0 ? 'done' : 'up', made: bookedOn });
    });
    return {
      v: 1, made: day0, clients, appts, bills, brides, aseq, no,
      services: D.services.map(s => ({ id: s.id, price: s.price, mins: s.mins })), products: D.products.map(p => ({ id: p.id, stock: p.stock }))
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
  const PAGES = ['cal', 'bridal', 'clients', 'rem', 'reports'];
  const U = {
    lang: qp.get('lang') === 'si' ? 'si' : 'en', page: PAGES.includes(qp.get('page')) ? qp.get('page') : 'cal',
    day: dayStart(Date.now()), sty: 's1', bf: 'up', bsel: null, cq: '', csel: null, rp: 'd7', na: null, co: null, nb: null, btab: 's'
  };
  const t = (k, v) => { let s = T[U.lang][k] != null ? T[U.lang][k] : (T.en[k] != null ? T.en[k] : k); if (v) Object.keys(v).forEach(x => { s = String(s).split('{' + x + '}').join(v[x]); }); return s; };
  const nm = o => o ? (U.lang === 'si' ? o.si : o.en) : '';
  const sv = id => S.services.find(s => s.id === id);
  const svcName = id => nm(svcD(id));
  const styName = id => nm(styD(id));
  const client = id => S.clients.find(c => c.id === id);
  const money = n => 'Rs. ' + Math.round(n).toLocaleString('en-US');
  const num = n => Math.round(n).toLocaleString('en-US');
  const pair = (arr, i) => arr[i] ? arr[i][U.lang === 'si' ? 1 : 0] : '';
  function fmtTime(ms) {
    const d = new Date(ms); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
    const ap = h < 12 ? t('am') : t('pm'); h = h % 12 || 12;
    return U.lang === 'si' ? ap + ' ' + h + '.' + m : h + ':' + m + ' ' + ap;
  }
  const fmtDate = ms => { const d = new Date(ms); return d.getDate() + ' ' + t('mon')[d.getMonth()] + ' ' + d.getFullYear(); };
  const fmtDay = ms => { const d = new Date(ms); return t('dlong')[d.getDay()] + ', ' + d.getDate() + ' ' + t('mon')[d.getMonth()]; };
  const isoDate = ms => { const d = new Date(ms); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  function rel(ms) {
    const n = Math.round((dayStart(ms) - dayStart(Date.now())) / DAY);
    if (n === 0) return t('todayW'); if (n === 1) return t('tomorrow'); if (n === -1) return t('yesterday');
    return n > 0 ? t('daysTo', { n }) : t('daysAgo', { n: -n });
  }
  const waPhone = p => { const d = String(p || '').replace(/\D/g, ''); return d.length === 10 && d[0] === '0' ? '94' + d.slice(1) : d; };
  const waLink = (phone, text) => 'https://wa.me/' + waPhone(phone) + '?text=' + encodeURIComponent(text);
  function toast(msg, act) {
    const el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = '<span>' + esc(msg) + '</span>' + (act ? '<button>' + esc(act.label) + '</button>' : '');
    if (act) el.querySelector('button').onclick = () => { act.fn(); el.remove(); };
    $('#toasts').appendChild(el);
    setTimeout(() => el.classList.add('out'), act ? 4200 : 2200); setTimeout(() => el.remove(), act ? 4600 : 2600);
  }
  const brideTot = b => b.lines.reduce((s, l) => s + l.p * l.q, 0);
  const bridePaid = b => b.pays.reduce((s, p) => s + p.amt, 0);
  const brideMain = b => nm(packD(b.type));

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
    renderPage(); window.scrollTo(0, 0);
  }
  function renderPage() { ({ cal: renderCal, bridal: renderBridal, clients: renderClients, rem: renderRem, reports: renderReports })[U.page](); }
  function remItems() {
    const tm = addDays(dayStart(Date.now()), 1), now = Date.now();
    const appts = S.appts.filter(a => a.start >= tm && a.start < tm + DAY && a.status === 'booked').sort((a, b) => a.start - b.start);
    const bal = S.brides.filter(b => b.status === 'up' && b.date - now < 30 * DAY && brideTot(b) - bridePaid(b) > 0).sort((a, b) => a.date - b.date);
    const trials = S.brides.filter(b => b.trial && !b.trialDone && b.trial >= dayStart(now) && b.trial - now < 7 * DAY).sort((a, b) => a.trial - b.trial);
    return { appts, bal, trials };
  }
  function renderCounts() { const r = remItems(); const n = r.appts.filter(a => !a.rem).length + r.bal.length + r.trials.length; const el = $('#remCnt'); el.textContent = n || ''; el.hidden = !n; }

  // ---------- modal ----------
  function openModal(html, cls) {
    const keep = !$('#modal').hidden && $('#sheet').className === 'sheet ' + (cls || '');
    const old = $('#sheet .sh-body'), top = keep && old ? old.scrollTop : 0;
    $('#sheet').className = 'sheet ' + (cls || ''); $('#sheet').innerHTML = html;
    $('#modal').hidden = false; document.body.classList.add('noscroll');
    const nw = $('#sheet .sh-body'); if (nw && top) nw.scrollTop = top;
  }
  function closeModal() { $('#modal').hidden = true; $('#sheet').innerHTML = ''; document.body.classList.remove('noscroll'); U.na = U.co = U.nb = null; }
  const shHead = (title, sub) => '<div class="sh-head"><div><h2>' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div><button class="sh-x" data-act="close" aria-label="' + esc(t('close')) + '">×</button></div>';

  // ---------- calendar ----------
  const H0 = D.shop.open, H1 = D.shop.close;
  function slotPx() { return window.innerWidth < 760 ? 20 : 22; }
  function renderCal() {
    const day = U.day, px = slotPx();
    const list = S.appts.filter(a => a.start >= day && a.start < day + DAY && a.status !== 'cancel');
    const wk0 = addDays(day, -((new Date(day).getDay() + 6) % 7));
    const week = Array.from({ length: 7 }, (_, i) => addDays(wk0, i)).map(d => {
      const n = S.appts.filter(a => a.start >= d && a.start < d + DAY && a.status !== 'cancel').length;
      const br = S.brides.some(b => b.date >= d && b.date < d + DAY);
      const dt = new Date(d);
      return '<button class="wd' + (d === day ? ' on' : '') + (d === dayStart(Date.now()) ? ' now' : '') + '" data-act="day" data-id="' + d + '"><span>' + esc(t('dshort')[dt.getDay()]) + '</span><b>' + dt.getDate() + '</b><em>' + n + (br ? ' ♥' : '') + '</em></button>';
    }).join('');
    const brides = S.brides.filter(b => b.date >= day && b.date < day + DAY);
    const rows = (H1 - H0) * 60 / SLOT;
    const hours = []; for (let h = H0; h < H1; h++) hours.push(h);
    const nowT = Date.now(), showNow = day === dayStart(nowT) && new Date(nowT).getHours() >= H0 && new Date(nowT).getHours() < H1;
    const nowTop = ((nowT - day) / MIN - H0 * 60) / SLOT * px;
    const cols = D.stylists.map(st => {
      const mine = list.filter(a => a.sid === st.id).sort((a, b) => a.start - b.start);
      const blocks = mine.map(a => {
        const top = ((a.start - day) / MIN - H0 * 60) / SLOT * px, h = a.mins / SLOT * px;
        const c = client(a.cid);
        return '<button class="ap st-' + a.status + (h < 46 ? ' short' : '') + '" style="top:' + top + 'px;height:' + (h - 2) + 'px;--c:' + st.col + '" data-act="appt" data-id="' + a.id + '">' +
          '<span class="ap-t">' + esc(fmtTime(a.start)) + (a.status !== 'booked' ? ' · <i>' + esc(t(a.status)) + '</i>' : '') + '</span>' +
          '<b>' + esc(c ? c.name : '') + (c && c.allergy ? ' <i class="alg" title="allergy">!</i>' : '') + '</b><span class="ap-s">' + esc(a.svcs.map(svcName).join(', ')) + '</span></button>';
      }).join('');
      return '<div class="col" data-s="' + st.id + '"' + (st.id === U.sty ? ' data-on="1"' : '') + '><div class="col-h" style="--c:' + st.col + '"><i></i><div><b>' + esc(nm(st)) + '</b><span>' + esc(U.lang === 'si' ? st.role_si : st.role_en) + '</span></div><em>' + mine.length + '</em></div>' +
        '<div class="col-b" data-act="slot" data-s="' + st.id + '" style="height:' + rows * px + 'px;background-size:100% ' + px * 4 + 'px">' + blocks + '</div></div>';
    }).join('');
    $('#pg-cal').innerHTML =
      '<div class="cal-top"><div class="cal-nav"><button class="nb" data-act="day" data-id="' + addDays(day, -1) + '" aria-label="prev">‹</button>' +
      '<button class="nb" data-act="day" data-id="' + addDays(day, 1) + '" aria-label="next">›</button>' +
      '<button class="btn line sm" data-act="day" data-id="' + dayStart(nowT) + '">' + esc(t('today')) + '</button>' +
      '<h1>' + esc(fmtDay(day)) + ' <small>' + list.length + ' ' + esc(t('appts')) + '</small></h1></div>' +
      '<button class="btn main" data-act="newappt">+ ' + esc(t('newAppt')) + '</button></div>' +
      '<div class="week">' + week + '</div>' +
      (brides.length ? '<div class="bride-band">' + brides.map(b => '<button data-act="bopen" data-id="' + b.id + '"><span>♥ ' + esc(t('bridalToday')) + '</span><b>' + esc(b.name) + '</b> · ' + esc(brideMain(b)) + ' · ' + esc(b.venue) + ' · ' + esc(fmtTime(b.date)) + ' (' + esc(styName(b.sid)) + ')</button>').join('') + '</div>' : '') +
      '<div class="sty-pick">' + D.stylists.map(st => '<button class="' + (U.sty === st.id ? 'on' : '') + '" style="--c:' + st.col + '" data-act="sty" data-id="' + st.id + '">' + esc(nm(st)) + '</button>').join('') + '</div>' +
      '<div class="cal"><div class="times" style="padding-top:var(--colh)">' + hours.map(h => '<span style="height:' + px * 4 + 'px">' + (h % 12 || 12) + (U.lang === 'si' ? '' : (h < 12 ? ' am' : ' pm')) + '</span>').join('') + '</div>' +
      '<div class="cols">' + cols + (showNow ? '<i class="now-line" style="top:calc(var(--colh) + ' + nowTop + 'px)"></i>' : '') + '</div></div>';
  }
  function openAppt(id) {
    const a = S.appts.find(x => x.id === id); if (!a) return;
    const c = client(a.cid), st = styD(a.sid);
    const total = a.svcs.reduce((s, x) => s + sv(x).price, 0);
    let acts = '';
    const remBtn = '<a class="btn line" target="_blank" rel="noopener" data-act="remsent" data-id="' + a.id + '" href="' + esc(waLink(c.phone, t('remMsg', { name: c.name.split(' ')[0], when: rel(a.start), time: fmtTime(a.start), s: styName(a.sid), svc: a.svcs.map(svcName).join(', ') }))) + '">' + esc(a.rem ? t('remSent') + ' ✓' : t('sendRem')) + '</a>';
    if (a.status === 'booked') acts = '<button class="btn line" data-act="cancel" data-id="' + a.id + '">' + esc(t('cancelAppt')) + '</button>' + (a.start < Date.now() + 2 * 3600000 ? '<button class="btn line" data-act="st" data-s="noshow" data-id="' + a.id + '">' + esc(t('markNoShow')) + '</button>' : remBtn) + '<button class="btn main" data-act="st" data-s="arrived" data-id="' + a.id + '">' + esc(t('markArrived')) + '</button>';
    else if (a.status === 'arrived') acts = '<button class="btn main" data-act="st" data-s="inservice" data-id="' + a.id + '">' + esc(t('start')) + '</button>';
    else if (a.status === 'inservice') acts = '<button class="btn main" data-act="checkout" data-id="' + a.id + '">' + esc(t('checkout')) + '</button>';
    else if (a.status === 'done' && a.bill) acts = '<button class="btn main" data-act="viewbill" data-id="' + a.bill + '">' + esc(t('viewBill')) + '</button>';
    openModal(shHead(esc(c.name), esc(fmtDay(a.start)) + ' · ' + esc(fmtTime(a.start)) + ' – ' + esc(fmtTime(a.start + a.mins * MIN))) +
      '<div class="sh-body"><div class="ad-top"><span class="stchip st-' + a.status + '">' + esc(t(a.status)) + '</span><span class="sdot" style="--c:' + st.col + '"></span>' + esc(nm(st)) + ' · ' + esc(c.phone) + '</div>' +
      '<ul class="ad-svcs">' + a.svcs.map(x => '<li><span>' + esc(svcName(x)) + ' <small>' + sv(x).mins + ' ' + esc(t('mins')) + '</small></span><b>' + esc(num(sv(x).price)) + '</b></li>').join('') +
      '<li class="tot"><span>' + esc(t('total')) + '</span><b>' + esc(money(total)) + '</b></li>' + (a.dep ? '<li><span>' + esc(t('deposit')) + '</span><b>− ' + esc(num(a.dep)) + '</b></li>' : '') + '</ul>' +
      '<dl class="cnotes"><div><dt>' + esc(t('hairType')) + '</dt><dd>' + esc(pair(D.hair, c.hair)) + '</dd></div><div><dt>' + esc(t('skinType')) + '</dt><dd>' + esc(pair(D.skin, c.skin)) + '</dd></div>' +
      (D.formula[c.formula] ? '<div><dt>' + esc(t('formula')) + '</dt><dd>' + esc(D.formula[c.formula]) + '</dd></div>' : '') +
      '<div' + (c.allergy ? ' class="warn"' : '') + '><dt>' + esc(t('allergy')) + '</dt><dd>' + esc(pair(D.allergy, c.allergy)) + '</dd></div></dl></div>' +
      '<div class="sh-foot">' + acts + '</div>', 'mid');
  }

  // new appointment
  function openNewAppt(pre) {
    pre = pre || {};
    const st = pre.sid || U.sty;
    let start = pre.start;
    if (!start) { const n = new Date(); const base = U.day === dayStart(n.getTime()) ? Math.ceil((n.getHours() * 60 + n.getMinutes() + 30) / 30) * 30 : H0 * 60 + 60; start = U.day + Math.min(Math.max(base, H0 * 60), H1 * 60 - 60) * MIN; }
    U.na = { cid: pre.cid || null, q: '', name: '', phone: '', sid: st, date: dayStart(start), mins: Math.round((start - dayStart(start)) / MIN), svcs: [], dep: '' };
    renderNewAppt();
  }
  function renderNewAppt() {
    const na = U.na, c = na.cid ? client(na.cid) : null;
    let who;
    if (c) who = '<div class="pick-c"><div><b>' + esc(c.name) + '</b><span>' + esc(c.phone) + (c.allergy ? ' · <em>' + esc(t('allergy')) + ': ' + esc(pair(D.allergy, c.allergy)) + '</em>' : '') + '</span></div><button class="btn line sm" data-act="naclear">×</button></div>';
    else {
      const q = na.q.trim().toLowerCase(), qd = q.replace(/\D/g, '');
      const m = q.length >= 2 ? S.clients.filter(x => x.name.toLowerCase().includes(q) || (qd.length >= 3 && x.phone.includes(qd))).slice(0, 5) : [];
      who = '<div class="na-who"><label><span>' + esc(t('client')) + '</span><input id="naQ" placeholder="' + esc(t('searchClient')) + '" value="' + esc(na.q) + '" autocomplete="off"></label>' +
        '<div class="sugg" id="naSugg">' + m.map(x => '<button data-act="napick" data-id="' + x.id + '"><b>' + esc(x.name) + '</b><span>' + esc(x.phone) + '</span></button>').join('') + '</div>' +
        '<div class="na-new"><small>' + esc(t('newClient')) + '</small><input id="naName" placeholder="' + esc(t('name')) + '" value="' + esc(na.name) + '"><input id="naPhone" inputmode="tel" maxlength="12" placeholder="07X XXX XXXX" value="' + esc(na.phone) + '"></div></div>';
    }
    const times = []; for (let m = H0 * 60; m < H1 * 60; m += SLOT) times.push(m);
    const tsel = '<select id="naTime">' + times.map(m => '<option value="' + m + '"' + (m === na.mins ? ' selected' : '') + '>' + esc(fmtTime(na.date + m * MIN)) + '</option>').join('') + '</select>';
    const stys = D.stylists.map(s => '<button class="schip' + (na.sid === s.id ? ' on' : '') + '" style="--c:' + s.col + '" data-act="nasty" data-id="' + s.id + '"><i></i>' + esc(nm(s)) + '</button>').join('');
    const groups = D.cats.map(cat => '<div class="sg"><h4>' + esc(nm(cat)) + '</h4><div class="tiles">' + D.services.filter(s => s.cat === cat.id).map(s => {
      const off = !s.who.includes(na.sid);
      return '<button class="tile' + (na.svcs.includes(s.id) ? ' on' : '') + (off ? ' off' : '') + '" data-act="nasvc" data-id="' + s.id + '"><b>' + esc(svcName(s.id)) + '</b><span>' + esc(num(sv(s.id).price)) + ' · ' + sv(s.id).mins + ' ' + esc(t('mins')) + '</span></button>';
    }).join('') + '</div></div>').join('');
    const mins = na.svcs.reduce((s, id) => s + sv(id).mins, 0), price = na.svcs.reduce((s, id) => s + sv(id).price, 0);
    const offN = na.svcs.filter(id => !svcD(id).who.includes(na.sid));
    openModal(shHead(esc(t('newAppt'))) + '<div class="sh-body na">' + who +
      '<div class="na-when"><label><span>' + esc(t('date')) + '</span><input type="date" id="naDate" value="' + isoDate(na.date) + '"></label><label><span>' + esc(t('time')) + '</span>' + tsel + '</label></div>' +
      '<h3>' + esc(t('stylist')) + '</h3><div class="schips">' + stys + '</div>' +
      '<h3>' + esc(t('services')) + '</h3>' + groups +
      (offN.length ? '<p class="warn-p">' + esc(offN.map(svcName).join(', ')) + ': ' + esc(t('notFor', { s: styName(na.sid) })) + '</p>' : '') + '</div>' +
      '<div class="sh-foot"><div class="sf-l"><b>' + esc(money(price)) + '</b><span>' + (mins ? mins + ' ' + esc(t('mins')) + ' · ' + esc(fmtTime(na.date + na.mins * MIN)) + ' – ' + esc(fmtTime(na.date + (na.mins + mins) * MIN)) : '') + '</span></div>' +
      '<label class="dep"><span>' + esc(t('deposit')) + '</span><input id="naDep" inputmode="numeric" placeholder="0" value="' + esc(na.dep) + '"></label>' +
      '<button class="btn main lg" data-act="nasave">' + esc(t('save')) + '</button></div>', 'wide');
    const q = $('#naQ');
    if (q) q.addEventListener('input', () => { na.q = q.value; const pos = q.selectionStart; renderNewAppt(); const n = $('#naQ'); n.focus(); n.setSelectionRange(pos, pos); });
    const bind = (id, k) => { const el = $('#' + id); if (el) el.addEventListener('input', () => { na[k] = el.value; }); };
    bind('naName', 'name'); bind('naPhone', 'phone'); bind('naDep', 'dep');
    $('#naTime').addEventListener('change', e => { na.mins = +e.target.value; renderNewAppt(); });
    $('#naDate').addEventListener('change', e => { const v = e.target.value; if (v) { const [y, m, d] = v.split('-').map(Number); na.date = new Date(y, m - 1, d).getTime(); renderNewAppt(); } });
  }
  function saveAppt() {
    const na = U.na;
    if (!na.svcs.length) { toast(t('pickSvc')); return; }
    let cid = na.cid;
    if (!cid) {
      const name = na.name.trim(), phone = na.phone.replace(/\D/g, '');
      if (!name) { toast(t('pickClient')); return; }
      cid = 'c' + (S.clients.length + 1000 + Math.floor(Math.random() * 9000));
      S.clients.push({ id: cid, name, phone, hair: 4, skin: 4, allergy: 0, formula: 4, notes: '', since: Date.now() });
    }
    const mins = na.svcs.reduce((s, id) => s + sv(id).mins, 0);
    const start = na.date + na.mins * MIN, end = start + mins * MIN;
    if (na.mins + mins > H1 * 60) { toast(t('outHours')); return; }
    const clash = S.appts.find(a => a.sid === na.sid && !['cancel', 'noshow'].includes(a.status) && a.start < end && a.start + a.mins * MIN > start);
    if (clash) { toast(t('clash', { s: styName(na.sid) })); return; }
    S.appts.push({ id: 'a' + (S.aseq++), cid, sid: na.sid, start, mins, svcs: na.svcs.slice(), status: 'booked', dep: Math.max(0, +na.dep || 0), rem: false, bill: null });
    save(); closeModal(); toast(t('apptSaved'));
    U.day = na.date; U.sty = na.sid; if (U.page !== 'cal') go('cal'); else renderCal(); renderCounts();
  }

  // checkout
  function openCheckout(aid) {
    const a = S.appts.find(x => x.id === aid); if (!a) return;
    U.co = { aid, lines: a.svcs.map(id => ({ k: 's', id, q: 1, p: sv(id).price })), disc: '', method: 'cash' };
    U.btab = 's'; renderCheckout();
  }
  function coCalc() {
    const co = U.co, a = S.appts.find(x => x.id === co.aid);
    const sub = co.lines.reduce((s, l) => s + l.p * l.q, 0), disc = Math.min(sub, Math.max(0, +co.disc || 0));
    return { sub, disc, dep: Math.min(a.dep, sub - disc), pay: Math.max(0, sub - disc - a.dep) };
  }
  function renderCheckout() {
    const co = U.co, a = S.appts.find(x => x.id === co.aid), c = client(a.cid);
    const tiles = U.btab === 's' ? D.services.map(s => '<button class="tile" data-act="coadd" data-k="s" data-id="' + s.id + '"><b>' + esc(svcName(s.id)) + '</b><span>' + esc(num(sv(s.id).price)) + '</span></button>').join('')
      : D.products.map(p => { const st = S.products.find(x => x.id === p.id).stock; return '<button class="tile' + (st <= 2 ? ' lowt' : '') + '" data-act="coadd" data-k="p" data-id="' + p.id + '"><b>' + esc(nm(p)) + '</b><span>' + esc(num(p.price)) + ' · ' + esc(t('stock')) + ' ' + st + '</span></button>'; }).join('');
    const lines = co.lines.map((l, i) => '<li><span>' + esc(l.k === 's' ? svcName(l.id) : nm(prodD(l.id))) + '</span><span class="qty"><button data-act="coq" data-id="' + i + '" data-d="-1">−</button><b>' + l.q + '</b><button data-act="coq" data-id="' + i + '" data-d="1">+</button></span><b>' + esc(num(l.p * l.q)) + '</b></li>').join('');
    openModal(shHead(esc(t('checkout')) + ' · ' + esc(c.name), esc(styName(a.sid)) + ' · ' + esc(fmtTime(a.start))) +
      '<div class="co"><div class="co-add sh-body"><div class="seg"><button class="' + (U.btab === 's' ? 'on' : '') + '" data-act="cotab" data-id="s">' + esc(t('services')) + '</button><button class="' + (U.btab === 'p' ? 'on' : '') + '" data-act="cotab" data-id="p">' + esc(t('products')) + '</button></div><div class="tiles">' + tiles + '</div></div>' +
      '<div class="co-sum"><ul class="lines">' + (lines || '<li class="empty">' + esc(t('emptyBill')) + '</li>') + '</ul>' +
      '<label class="row"><span>' + esc(t('discount')) + ' (Rs)</span><input id="coDisc" inputmode="numeric" placeholder="0" value="' + esc(co.disc) + '"></label>' +
      '<div class="tot" id="coTot"></div><div class="seg pay">' + ['cash', 'card', 'qr'].map(m => '<button class="' + (co.method === m ? 'on' : '') + '" data-act="copay" data-id="' + m + '">' + esc(t(m)) + '</button>').join('') + '</div>' +
      '<button class="btn main lg full" data-act="codone" id="coDone"></button></div></div>', 'bill');
    $('#coDisc').addEventListener('input', e => { co.disc = e.target.value; coTotals(); });
    coTotals();
  }
  function coTotals() {
    const k = coCalc();
    $('#coTot').innerHTML = '<div><span>' + esc(t('subtotal')) + '</span><b>' + esc(num(k.sub)) + '</b></div>' + (k.disc ? '<div><span>' + esc(t('discount')) + '</span><b>− ' + esc(num(k.disc)) + '</b></div>' : '') +
      (k.dep ? '<div><span>' + esc(t('lessAdv')) + '</span><b>− ' + esc(num(k.dep)) + '</b></div>' : '') + '<div class="g"><span>' + esc(t('toPay')) + '</span><b>' + esc(money(k.pay)) + '</b></div>';
    $('#coDone').textContent = t('complete') + ' · ' + money(k.pay);
  }
  function completeCheckout() {
    const co = U.co; if (!co.lines.length) { toast(t('emptyBill')); return; }
    const a = S.appts.find(x => x.id === co.aid), k = coCalc();
    const b = { no: 'S' + (S.no++), t: Date.now(), cid: a.cid, sid: a.sid, aid: a.id, items: co.lines.map(l => ({ k: l.k, id: l.id, q: l.q, p: l.p })), sub: k.sub, disc: k.disc, dep: k.dep, method: co.method, total: k.sub - k.disc };
    b.items.filter(l => l.k === 'p').forEach(l => { const p = S.products.find(x => x.id === l.id); p.stock = Math.max(0, p.stock - l.q); });
    S.bills.push(b); a.status = 'done'; a.bill = b.no;
    save(); U.co = null; toast(t('billSaved', { n: b.no })); renderPage(); showReceipt(b);
  }
  function receiptHtml(b) {
    const c = client(b.cid);
    return '<div class="rc"><div class="rc-h"><b>Senuri</b><span>Bridal &amp; Beauty</span><small>' + esc(D.shop.addr) + ' · ' + esc(D.shop.phone) + '</small></div>' +
      '<div class="rc-m"><span>' + esc(b.no) + '</span><span>' + esc(fmtDate(b.t)) + ' ' + esc(fmtTime(b.t)) + '</span></div>' +
      '<div class="rc-m"><span>' + esc(c ? c.name : '') + '</span><span>' + esc(t('stylist')) + ': ' + esc(styName(b.sid)) + '</span></div>' +
      '<table>' + b.items.map(l => '<tr><td>' + esc(l.k === 's' ? svcName(l.id) : nm(prodD(l.id))) + (l.q > 1 ? ' × ' + l.q : '') + '</td><td>' + esc(num(l.p * l.q)) + '</td></tr>').join('') + '</table>' +
      '<div class="rc-t">' + (b.disc ? '<div><span>' + esc(t('discount')) + '</span><span>− ' + esc(num(b.disc)) + '</span></div>' : '') +
      '<div class="g"><span>' + esc(t('total')) + '</span><span>' + esc(money(b.total)) + '</span></div>' +
      (b.dep ? '<div><span>' + esc(t('lessAdv')) + '</span><span>− ' + esc(num(b.dep)) + '</span></div><div><span>' + esc(t('paid')) + '</span><span>' + esc(num(b.total - b.dep)) + '</span></div>' : '') +
      '<div><span>' + esc(t('pay')) + '</span><span>' + esc(t(b.method)) + '</span></div></div><div class="rc-f">' + esc(U.lang === 'si' ? D.shop.footer_si : D.shop.footer_en) + '</div></div>';
  }
  function receiptText(b) {
    const c = client(b.cid);
    const L = ['Senuri Bridal & Beauty', b.no + ' · ' + fmtDate(b.t) + ' ' + fmtTime(b.t), (c ? c.name : '') + ' · ' + styName(b.sid), ''];
    b.items.forEach(l => L.push((l.k === 's' ? svcName(l.id) : nm(prodD(l.id))) + (l.q > 1 ? ' x' + l.q : '') + '  ' + num(l.p * l.q)));
    if (b.disc) L.push(t('discount') + '  -' + num(b.disc));
    L.push(t('total') + ': ' + money(b.total)); if (b.dep) L.push(t('lessAdv') + ': ' + num(b.dep));
    L.push('', U.lang === 'si' ? D.shop.footer_si : D.shop.footer_en); return L.join('\n');
  }
  function showReceipt(b) {
    const c = client(b.cid);
    openModal(shHead(esc(t('receipt')) + ' ' + esc(b.no)) + '<div class="sh-body rc-wrap">' + receiptHtml(b) + '</div>' +
      '<div class="sh-foot"><button class="btn line" data-act="printbill" data-id="' + b.no + '">' + esc(t('print')) + '</button><a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(c ? c.phone : '', receiptText(b))) + '">' + esc(t('sendWa')) + '</a><button class="btn main" data-act="close">' + esc(t('ok')) + '</button></div>', 'mid');
  }

  // ---------- bridal ----------
  function renderBridal() {
    const now = Date.now();
    const list = S.brides.filter(b => b.status === U.bf).sort((a, b) => U.bf === 'up' ? a.date - b.date : b.date - a.date);
    if (!U.bsel || !list.find(b => b.id === U.bsel)) U.bsel = list.length ? list[0].id : null;
    const cards = list.map(b => {
      const d = new Date(b.date), bal = brideTot(b) - bridePaid(b);
      return '<button class="bk' + (U.bsel === b.id ? ' on' : '') + '" data-act="bsel" data-id="' + b.id + '"><span class="bk-d"><b>' + d.getDate() + '</b><small>' + esc(t('mon')[d.getMonth()]) + '</small></span>' +
        '<span class="bk-m"><b>' + esc(b.name) + '</b><span>' + esc(brideMain(b)) + ' · ' + esc(rel(b.date)) + '</span><small>' + esc(b.venue) + '</small></span>' +
        '<span class="bk-r">' + (bal > 0 ? '<em>' + esc(num(bal)) + '</em><small>' + esc(t('balance')) + '</small>' : '<i>✓ ' + esc(t('fullyPaid')) + '</i>') + '</span></button>';
    }).join('');
    const up = S.brides.filter(b => b.status === 'up');
    const due = up.reduce((s, b) => s + brideTot(b) - bridePaid(b), 0);
    const m0 = new Date(now); m0.setDate(1); m0.setHours(0, 0, 0, 0);
    const inMonth = S.brides.reduce((s, b) => s + b.pays.filter(p => p.t >= m0.getTime()).reduce((x, p) => x + p.amt, 0), 0);
    $('#pg-bridal').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_bridal')) + '</h1><span class="seg">' + ['up', 'done'].map(f => '<button class="' + (U.bf === f ? 'on' : '') + '" data-act="bf" data-id="' + f + '">' + esc(t(f === 'up' ? 'upcoming' : 'completed')) + '</button>').join('') + '</span>' +
      '<button class="btn main" data-act="newbride">+ ' + esc(t('newBooking')) + '</button></div>' +
      '<div class="figs"><div><b>' + up.length + '</b><span>' + esc(t('upcoming')) + '</span></div><div><b>' + esc(money(due)) + '</b><span>' + esc(t('balance')) + '</span></div><div><b>' + esc(money(inMonth)) + '</b><span>' + esc(t('bridalIn')) + ' · ' + esc(t('mon')[new Date(now).getMonth()]) + '</span></div></div>' +
      '<div class="br-grid"><div class="bk-list">' + (cards || '<p class="empty">' + esc(t('remEmpty')) + '</p>') + '</div><aside class="bdet" id="bdet">' + brideHtml(U.bsel) + '</aside></div>';
  }
  function brideHtml(id) {
    const b = S.brides.find(x => x.id === id); if (!b) return '';
    const tot = brideTot(b), paid = bridePaid(b), bal = tot - paid, due = b.date - 7 * DAY;
    const msg = t('stMsg', { name: b.name.split(' ')[0], pack: brideMain(b), date: fmtDate(b.date), venue: b.venue, tot: money(tot), paid: money(paid), bal: money(bal), due: fmtDate(due) });
    return '<div class="bd-head"><span class="bd-date"><b>' + new Date(b.date).getDate() + '</b><small>' + esc(t('mon')[new Date(b.date).getMonth()] + ' ' + new Date(b.date).getFullYear()) + '</small></span><div><h2>' + esc(b.name) + '</h2><p>' + esc(brideMain(b)) + ' · ' + esc(b.phone) + '</p></div></div>' +
      '<dl class="bd-info"><div><dt>' + esc(t('event')) + '</dt><dd>' + esc(fmtDay(b.date)) + ', ' + esc(fmtTime(b.date)) + ' <small>(' + esc(rel(b.date)) + ')</small></dd></div>' +
      '<div><dt>' + esc(t('venue')) + '</dt><dd>' + esc(b.venue) + '</dd></div><div><dt>' + esc(t('stylist')) + '</dt><dd>' + esc(styName(b.sid)) + '</dd></div>' +
      (b.trial ? '<div><dt>' + esc(t('trial')) + '</dt><dd>' + esc(fmtDate(b.trial)) + ', ' + esc(fmtTime(b.trial)) + ' ' + (b.trialDone ? '<i class="ok">✓ ' + esc(t('trialDone')) + '</i>' : '<button class="lnk" data-act="trialdone" data-id="' + b.id + '">' + esc(t('markTrial')) + '</button>') + '</dd></div>' : '') + '</dl>' +
      '<table class="bd-lines">' + b.lines.map(l => '<tr><td>' + esc(nm(packD(l.id))) + (l.q > 1 ? ' <small>× ' + l.q + '</small>' : '') + '</td><td>' + esc(num(l.p * l.q)) + '</td></tr>').join('') +
      '<tr class="t"><td>' + esc(t('total')) + '</td><td>' + esc(money(tot)) + '</td></tr></table>' +
      '<div class="bd-pay"><div class="meter"><i style="width:' + Math.min(100, paid / tot * 100) + '%"></i></div><div class="bd-nums"><span>' + esc(t('paid')) + ' <b>' + esc(money(paid)) + '</b></span><span>' + esc(t('balance')) + ' <b class="' + (bal > 0 ? 'due' : '') + '">' + esc(money(bal)) + '</b></span></div>' +
      (bal > 0 ? '<p class="dueby">' + esc(t('dueBy', { d: fmtDate(due) })) + '</p>' : '') + '</div>' +
      '<h3>' + esc(t('payments')) + '</h3><ul class="pays">' + b.pays.map(p => '<li><span>' + esc(fmtDate(p.t)) + '</span><span>' + esc(t(p.method)) + '</span><b>' + esc(num(p.amt)) + '</b></li>').join('') + '</ul>' +
      (b.status === 'up' && bal > 0 ? '<div class="addpay"><input id="payAmt" inputmode="numeric" placeholder="' + esc(t('amount')) + '" value="' + bal + '"><select id="payM"><option value="bank">' + esc(t('bank')) + '</option><option value="cash">' + esc(t('cash')) + '</option><option value="card">' + esc(t('card')) + '</option></select><button class="btn main sm" data-act="addpay" data-id="' + b.id + '">' + esc(t('addPay')) + '</button></div>' : '') +
      '<div class="bd-act"><a class="btn wa" target="_blank" rel="noopener" href="' + esc(waLink(b.phone, msg)) + '">' + esc(t('statement')) + '</a>' +
      (b.status === 'up' && b.date < Date.now() + DAY ? '<button class="btn line" data-act="bdone" data-id="' + b.id + '">' + esc(t('markComplete')) + '</button>' : '') + '</div>';
  }
  function openNewBride() {
    U.nb = { name: '', phone: '', date: '', venue: D.venues[0], type: null, q: {}, adv: '', method: 'bank' };
    renderNewBride();
  }
  function nbTotal() { const nb = U.nb; let s = nb.type ? packD(nb.type).price : 0; Object.keys(nb.q).forEach(id => { s += packD(id).price * nb.q[id]; }); return s; }
  function renderNewBride() {
    const nb = U.nb;
    const mains = D.packs.filter(p => p.main).map(p => '<button class="tile' + (nb.type === p.id ? ' on' : '') + '" data-act="nbtype" data-id="' + p.id + '"><b>' + esc(nm(p)) + '</b><span>' + esc(money(p.price)) + '</span></button>').join('');
    const extras = D.packs.filter(p => !p.main).map(p => '<li><span>' + esc(nm(p)) + ' <small>' + esc(num(p.price)) + '</small></span><span class="qty"><button data-act="nbq" data-id="' + p.id + '" data-d="-1">−</button><b>' + (nb.q[p.id] || 0) + '</b><button data-act="nbq" data-id="' + p.id + '" data-d="1">+</button></span></li>').join('');
    openModal(shHead(esc(t('newBooking'))) + '<div class="sh-body nbk">' +
      '<div class="f2"><label><span>' + esc(t('bride')) + '</span><input id="nbName" value="' + esc(nb.name) + '"></label><label><span>' + esc(t('phone')) + '</span><input id="nbPhone" inputmode="tel" maxlength="12" placeholder="07X XXX XXXX" value="' + esc(nb.phone) + '"></label>' +
      '<label><span>' + esc(t('event')) + '</span><input type="date" id="nbDate" value="' + esc(nb.date) + '"></label><label><span>' + esc(t('venue')) + '</span><select id="nbVenue">' + D.venues.map(v => '<option' + (v === nb.venue ? ' selected' : '') + '>' + esc(v) + '</option>').join('') + '</select></label></div>' +
      '<h3>' + esc(t('pack')) + '</h3><div class="tiles">' + mains + '</div><h3>' + esc(t('extras')) + '</h3><ul class="extras">' + extras + '</ul></div>' +
      '<div class="sh-foot"><div class="sf-l"><small>' + esc(t('total')) + '</small><b>' + esc(money(nbTotal())) + '</b></div>' +
      '<label class="dep"><span>' + esc(t('advance')) + '</span><input id="nbAdv" inputmode="numeric" placeholder="0" value="' + esc(nb.adv) + '"></label>' +
      '<button class="btn main lg" data-act="nbsave">' + esc(t('save')) + '</button></div>', 'wide');
    [['nbName', 'name'], ['nbPhone', 'phone'], ['nbAdv', 'adv']].forEach(([id, k]) => $('#' + id).addEventListener('input', e => { nb[k] = e.target.value; }));
    $('#nbDate').addEventListener('change', e => { nb.date = e.target.value; });
    $('#nbVenue').addEventListener('change', e => { nb.venue = e.target.value; });
  }
  function saveBride() {
    const nb = U.nb;
    if (!nb.name.trim()) { toast(t('needName')); return; }
    if (!nb.date) { toast(t('needDate')); return; }
    if (!nb.type) { toast(t('pickPack')); return; }
    const [y, m, d] = nb.date.split('-').map(Number), date = new Date(y, m - 1, d, 5, 30).getTime();
    const lines = [{ id: nb.type, q: 1, p: packD(nb.type).price }].concat(Object.keys(nb.q).filter(id => nb.q[id] > 0).map(id => ({ id, q: nb.q[id], p: packD(id).price })));
    const adv = Math.max(0, +nb.adv || 0);
    const phone = nb.phone.replace(/\D/g, '');
    let c = phone ? S.clients.find(x => x.phone === phone) : null;
    if (!c) { c = { id: 'c' + (S.clients.length + 2000 + Math.floor(Math.random() * 9000)), name: nb.name.trim(), phone, hair: 4, skin: 4, allergy: 0, formula: 4, notes: '', since: Date.now() }; S.clients.push(c); }
    const b = { id: 'b' + Date.now(), cid: c.id, name: nb.name.trim(), phone, type: nb.type, date, venue: nb.venue, sid: 's1', lines, pays: adv ? [{ t: Date.now(), amt: adv, method: 'bank' }] : [],
      trial: nb.q.trial ? dayStart(date - 21 * DAY) + 14 * 60 * MIN : null, trialDone: false, status: date < Date.now() ? 'done' : 'up', made: Date.now() };
    S.brides.push(b); save(); closeModal(); toast(t('bookingSaved'));
    U.bf = b.status; U.bsel = b.id; go('bridal'); renderCounts();
  }

  // ---------- clients ----------
  function cIndex() { const m = {}; S.bills.forEach(b => { const o = m[b.cid] || (m[b.cid] = { n: 0, last: 0, spent: 0 }); o.n++; o.last = Math.max(o.last, b.t); o.spent += b.total; }); return m; }
  function renderClients() {
    const ix = cIndex(), q = U.cq.trim().toLowerCase(), qd = q.replace(/\D/g, '');
    let list = S.clients.map(c => ({ c, s: ix[c.id] || { n: 0, last: 0, spent: 0 } }));
    if (q) list = list.filter(o => o.c.name.toLowerCase().includes(q) || (qd && o.c.phone.includes(qd)));
    list.sort((a, b) => b.s.last - a.s.last);
    const rows = list.slice(0, 100).map(o => '<button class="cl' + (U.csel === o.c.id ? ' on' : '') + '" data-act="csel" data-id="' + o.c.id + '"><span class="av">' + esc(o.c.name.split(' ').map(w => w[0]).join('').slice(0, 2)) + '</span>' +
      '<span class="cl-m"><b>' + esc(o.c.name) + (o.c.allergy ? ' <i class="alg">!</i>' : '') + '</b><small>' + esc(o.c.phone) + '</small></span><span class="cl-r"><b>' + o.s.n + '</b><small>' + esc(o.s.last ? rel(o.s.last) : t('none')) + '</small></span></button>').join('');
    $('#pg-clients').innerHTML = '<div class="pg-head"><h1>' + esc(t('clients')) + ' <small>' + S.clients.length + '</small></h1><label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="cq" placeholder="' + esc(t('searchClient')) + '" value="' + esc(U.cq) + '"></label></div>' +
      '<div class="cl-grid"><div class="cl-list">' + (rows || '<p class="empty">' + esc(t('noMatch')) + '</p>') + '</div><aside class="cprof" id="cprof">' + profHtml(U.csel) + '</aside></div>';
    const inp = $('#cq'); inp.addEventListener('input', () => { U.cq = inp.value; const p = inp.selectionStart; renderClients(); const n = $('#cq'); n.focus(); n.setSelectionRange(p, p); });
  }
  function profHtml(id) {
    const c = id ? client(id) : null;
    if (!c) return '<p class="empty">' + esc(t('pickOne')) + '</p>';
    const bills = S.bills.filter(b => b.cid === c.id), spent = bills.reduce((s, b) => s + b.total, 0);
    const next = S.appts.filter(a => a.cid === c.id && a.start > Date.now() && a.status === 'booked').sort((a, b) => a.start - b.start)[0];
    const sel = (fid, arr, cur) => '<select data-cf="' + fid + '" data-id="' + c.id + '">' + arr.map((x, i) => '<option value="' + i + '"' + (i === cur ? ' selected' : '') + '>' + esc(x[U.lang === 'si' ? 1 : 0]) + '</option>').join('') + '</select>';
    return '<div class="cp-head"><span class="av lg">' + esc(c.name.split(' ').map(w => w[0]).join('').slice(0, 2)) + '</span><div><h2>' + esc(c.name) + '</h2><p>' + esc(c.phone) + ' · ' + esc(t('since')) + ' ' + esc(fmtDate(c.since)) + '</p></div></div>' +
      '<div class="figs sm"><div><b>' + bills.length + '</b><span>' + esc(t('visits')) + '</span></div><div><b>' + esc(num(spent)) + '</b><span>' + esc(t('spent')) + '</span></div><div><b>' + esc(bills.length ? rel(bills[bills.length - 1].t) : t('none')) + '</b><span>' + esc(t('lastVisit')) + '</span></div></div>' +
      (next ? '<button class="next-ap" data-act="appt" data-id="' + next.id + '"><small>' + esc(t('nextAppt')) + '</small>' + esc(fmtDay(next.start)) + ' · ' + esc(fmtTime(next.start)) + ' · ' + esc(next.svcs.map(svcName).join(', ')) + '</button>' : '') +
      '<div class="cp-f"><label><span>' + esc(t('hairType')) + '</span>' + sel('hair', D.hair, c.hair) + '</label><label><span>' + esc(t('skinType')) + '</span>' + sel('skin', D.skin, c.skin) + '</label>' +
      '<label class="' + (c.allergy ? 'warn' : '') + '"><span>' + esc(t('allergy')) + '</span>' + sel('allergy', D.allergy, c.allergy) + '</label>' +
      '<label><span>' + esc(t('formula')) + '</span><input data-cf="formulaTxt" data-id="' + c.id + '" value="' + esc(c.formulaTxt != null ? c.formulaTxt : D.formula[c.formula]) + '"></label>' +
      '<label class="full"><span>' + esc(t('notes')) + '</span><textarea rows="2" data-cf="notes" data-id="' + c.id + '">' + esc(c.notes) + '</textarea></label></div>' +
      '<div class="cp-act"><button class="btn main" data-act="cbook" data-id="' + c.id + '">' + esc(t('book')) + '</button></div>' +
      '<h3>' + esc(t('history')) + '</h3><ul class="hist">' + bills.slice().reverse().slice(0, 12).map(b => '<li data-act="viewbill" data-id="' + b.no + '"><span>' + esc(fmtDate(b.t)) + '</span><span>' + esc(b.items.map(l => l.k === 's' ? svcName(l.id) : nm(prodD(l.id))).join(', ')) + '<small>' + esc(styName(b.sid)) + '</small></span><b>' + esc(num(b.total)) + '</b></li>').join('') + '</ul>';
  }

  // ---------- reminders ----------
  function renderRem() {
    const r = remItems();
    const apptRows = r.appts.map(a => { const c = client(a.cid);
      return '<li><span class="r-t">' + esc(fmtTime(a.start)) + '</span><span class="r-m"><b>' + esc(c.name) + '</b><small>' + esc(a.svcs.map(svcName).join(', ')) + ' · ' + esc(styName(a.sid)) + '</small></span>' +
        '<a class="btn ' + (a.rem ? 'line' : 'wa') + ' sm" target="_blank" rel="noopener" data-act="remsent" data-id="' + a.id + '" href="' + esc(waLink(c.phone, t('remMsg', { name: c.name.split(' ')[0], when: t('tomorrow'), time: fmtTime(a.start), s: styName(a.sid), svc: a.svcs.map(svcName).join(', ') }))) + '">' + esc(a.rem ? t('remSent') + ' ✓' : t('sendRem')) + '</a></li>'; }).join('');
    const balRows = r.bal.map(b => { const tot = brideTot(b), paid = bridePaid(b);
      return '<li><span class="r-t">' + esc(fmtDate(b.date).replace(/ \d{4}$/, '')) + '</span><span class="r-m"><b>' + esc(b.name) + '</b><small>' + esc(brideMain(b)) + ' · ' + esc(rel(b.date)) + ' · ' + esc(t('balance')) + ' ' + esc(money(tot - paid)) + '</small></span>' +
        '<a class="btn wa sm" target="_blank" rel="noopener" href="' + esc(waLink(b.phone, t('stMsg', { name: b.name.split(' ')[0], pack: brideMain(b), date: fmtDate(b.date), venue: b.venue, tot: money(tot), paid: money(paid), bal: money(tot - paid), due: fmtDate(b.date - 7 * DAY) }))) + '">' + esc(t('statement')) + '</a></li>'; }).join('');
    const trialRows = r.trials.map(b => '<li><span class="r-t">' + esc(fmtDate(b.trial).replace(/ \d{4}$/, '')) + '</span><span class="r-m"><b>' + esc(b.name) + '</b><small>' + esc(t('trial')) + ' · ' + esc(fmtTime(b.trial)) + ' · ' + esc(brideMain(b)) + '</small></span><button class="btn line sm" data-act="bopen" data-id="' + b.id + '">' + esc(t('nav_bridal')) + '</button></li>').join('');
    const sec = (title, n, rows, extra) => '<section class="rsec"><h2>' + esc(title) + ' <small>' + n + '</small>' + (extra || '') + '</h2>' + (rows ? '<ul class="rl">' + rows + '</ul>' : '<p class="empty">' + esc(t('remEmpty')) + '</p>') + '</section>';
    $('#pg-rem').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_rem')) + '</h1></div>' +
      sec(t('remTomorrow'), r.appts.length, apptRows, r.appts.some(a => !a.rem) ? '<button class="lnk" data-act="remall">' + esc(t('sendAll')) + '</button>' : '') +
      sec(t('remBridal'), r.bal.length, balRows) + sec(t('remTrial'), r.trials.length, trialRows);
  }

  // ---------- reports ----------
  function renderReports() {
    const p = U.rp, now = Date.now(), d0 = dayStart(now);
    const from = p === 'today' ? d0 : addDays(d0, p === 'd7' ? -6 : -29);
    const bills = S.bills.filter(b => b.t >= from);
    const ap = S.appts.filter(a => a.start >= from && a.start < now);
    const rev = bills.reduce((s, b) => s + b.total, 0);
    const ns = ap.filter(a => a.status === 'noshow').length;
    const bIn = S.brides.reduce((s, b) => s + b.pays.filter(x => x.t >= from).reduce((y, x) => y + x.amt, 0), 0);
    const byS = D.stylists.map(st => { const mine = bills.filter(b => b.sid === st.id); return { st, n: mine.length, v: mine.reduce((s, b) => s + b.total, 0) }; });
    const mx = Math.max(1, ...byS.map(o => o.v));
    const cat = {}; let prodV = 0; const top = {};
    bills.forEach(b => b.items.forEach(l => { if (l.k === 'p') { prodV += l.p * l.q; return; } const c = svcD(l.id).cat; cat[c] = (cat[c] || 0) + l.p * l.q; top[l.id] = (top[l.id] || 0) + l.q; }));
    const mixes = D.cats.map(c => ({ n: nm(c), v: cat[c.id] || 0 })).concat([{ n: t('products'), v: prodV }, { n: t('nav_bridal'), v: bIn }]);
    const mt = Math.max(1, mixes.reduce((s, o) => s + o.v, 0));
    const nd = p === 'today' ? 7 : p === 'd7' ? 7 : 30;
    const days = Array.from({ length: nd }, (_, i) => addDays(d0, i - nd + 1));
    const dv = days.map(d => S.bills.filter(b => b.t >= d && b.t < d + DAY).reduce((s, b) => s + b.total, 0));
    const dmx = Math.max(1, ...dv);
    const tops = Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 6);
    $('#pg-reports').innerHTML = '<div class="pg-head"><h1>' + esc(t('nav_reports')) + '</h1><span class="seg">' + ['today', 'd7', 'd30'].map(x => '<button class="' + (p === x ? 'on' : '') + '" data-act="rp" data-id="' + x + '">' + esc(t(x)) + '</button>').join('') + '</span></div>' +
      '<div class="figs"><div class="hi"><b>' + esc(money(rev)) + '</b><span>' + esc(t('revenue')) + '</span></div><div><b>' + bills.length + '</b><span>' + esc(t('apptsDone')) + '</span></div><div><b>' + ns + '</b><span>' + esc(t('noShows')) + '</span></div>' +
      '<div><b>' + esc(num(bills.length ? rev / bills.length : 0)) + '</b><span>' + esc(t('avgBill')) + '</span></div><div><b>' + esc(money(bIn)) + '</b><span>' + esc(t('bridalIn')) + '</span></div></div>' +
      '<div class="rp-grid"><section class="card"><h3>' + esc(t('byDay')) + '</h3><div class="vbars n' + nd + '">' + days.map((d, i) => { const dt = new Date(d); return '<div class="vb' + (i === nd - 1 ? ' now' : '') + '" title="' + esc(fmtDate(d)) + ' · ' + esc(money(dv[i])) + '"><em>' + (nd === 7 ? (dv[i] / 1000).toFixed(0) + 'k' : '') + '</em><i style="height:' + (dv[i] / dmx * 100) + '%"></i><span>' + esc(nd === 7 ? t('dshort')[dt.getDay()] : (dt.getDate() % 5 === 0 ? String(dt.getDate()) : '')) + '</span></div>'; }).join('') + '</div></section>' +
      '<section class="card"><h3>' + esc(t('byStylist')) + '</h3>' + byS.map(o => '<div class="hrow"><span class="sdot" style="--c:' + o.st.col + '"></span><span class="hn">' + esc(nm(o.st)) + ' <small>' + o.n + '</small></span><span class="hb"><i style="width:' + (o.v / mx * 100) + '%;background:' + o.st.col + '"></i></span><b>' + esc(num(o.v)) + '</b></div>').join('') +
      '<h3 class="mt">' + esc(t('topSvc')) + '</h3><ol class="tops">' + tops.map(([id, n]) => '<li><span>' + esc(svcName(id)) + '</span><b>' + n + '</b></li>').join('') + '</ol></section>' +
      '<section class="card wide"><h3>' + esc(t('mix')) + '</h3><div class="mixbar">' + mixes.map((o, i) => '<i class="mx' + i + '" style="width:' + (o.v / mt * 100) + '%"></i>').join('') + '</div><ul class="mixl">' + mixes.map((o, i) => '<li><i class="mx' + i + '"></i><span>' + esc(o.n) + '</span><b>' + esc(money(o.v)) + '</b><em>' + Math.round(o.v / mt * 100) + '%</em></li>').join('') + '</ul></section>' +
      '<section class="card wide"><h3>' + esc(t('bills')) + ' <small>' + bills.length + '</small></h3><table class="tbl">' + bills.slice().reverse().slice(0, 15).map(b => '<tr data-act="viewbill" data-id="' + b.no + '"><td>' + esc(b.no) + '</td><td>' + esc(p === 'today' ? fmtTime(b.t) : fmtDate(b.t)) + '</td><td>' + esc(client(b.cid) ? client(b.cid).name : '') + '</td><td class="hs">' + esc(styName(b.sid)) + '</td><td class="hs">' + esc(t(b.method)) + '</td><td class="r">' + esc(num(b.total)) + '</td></tr>').join('') + '</table></section></div>';
  }

  // ---------- settings ----------
  function openSettings() {
    openModal(shHead(esc(t('settings'))) + '<div class="sh-body set">' +
      '<div class="set-row"><span>' + esc(t('language')) + '</span><span class="seg"><button class="' + (U.lang === 'en' ? 'on' : '') + '" data-act="setlang" data-id="en">English</button><button class="' + (U.lang === 'si' ? 'on' : '') + '" data-act="setlang" data-id="si">සිංහල</button></span></div>' +
      '<h3>' + esc(t('priceList')) + '</h3><table class="tbl ed">' + D.services.map(s => '<tr><td>' + esc(svcName(s.id)) + '</td><td class="r"><input data-ed="sp" data-id="' + s.id + '" inputmode="numeric" value="' + sv(s.id).price + '"></td><td class="r"><input class="sm" data-ed="sm" data-id="' + s.id + '" inputmode="numeric" value="' + sv(s.id).mins + '"></td></tr>').join('') + '</table>' +
      '<h3>' + esc(t('products')) + '</h3><table class="tbl ed">' + D.products.map(p => { const st = S.products.find(x => x.id === p.id).stock; return '<tr><td>' + esc(nm(p)) + (st <= 2 ? ' <span class="lowpill">' + esc(t('low')) + '</span>' : '') + '</td><td class="r">' + esc(num(p.price)) + '</td><td class="r"><input class="sm" data-ed="ps" data-id="' + p.id + '" inputmode="numeric" value="' + st + '"></td></tr>'; }).join('') + '</table>' +
      '<div class="set-row"><span>' + esc(t('demoData')) + '<small>' + esc(t('resetTxt')) + '</small></span><button class="btn line sm" data-act="reset">' + esc(t('reset')) + '</button></div>' +
      '<div class="set-row"><span><small>' + esc(t('talk')) + '</small></span><a class="btn wa sm" target="_blank" rel="noopener" href="' + esc(waLink(WA_NUMBER, t('waWelcome'))) + '">' + esc(t('demoCta')) + '</a></div></div>', 'mid');
  }

  // ---------- events ----------
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) { if (e.target.id === 'modal') closeModal(); return; }
    const a = el.dataset.act, id = el.dataset.id;
    switch (a) {
      case 'nav': go(id); break;
      case 'lang': U.lang = U.lang === 'si' ? 'en' : 'si'; applyLang(); break;
      case 'setlang': U.lang = id; applyLang(); openSettings(); break;
      case 'close': closeModal(); break;
      case 'settings': openSettings(); break;
      case 'day': U.day = +id; renderCal(); break;
      case 'sty': U.sty = id; renderCal(); break;
      case 'slot': {
        const r = el.getBoundingClientRect(), px = slotPx();
        const m = H0 * 60 + Math.floor((e.clientY - r.top) / px) * SLOT;
        openNewAppt({ sid: el.dataset.s, start: U.day + Math.min(m, H1 * 60 - SLOT) * MIN });
        break;
      }
      case 'appt': openAppt(id); break;
      case 'newappt': openNewAppt(); break;
      case 'napick': U.na.cid = id; renderNewAppt(); break;
      case 'naclear': U.na.cid = null; U.na.q = ''; renderNewAppt(); break;
      case 'nasty': U.na.sid = id; renderNewAppt(); break;
      case 'nasvc': { const s = U.na.svcs, i = s.indexOf(id); if (i >= 0) s.splice(i, 1); else s.push(id); renderNewAppt(); break; }
      case 'nasave': saveAppt(); break;
      case 'st': { const ap = S.appts.find(x => x.id === id); ap.status = el.dataset.s; save(); renderPage(); renderCounts(); if (ap.status === 'noshow') closeModal(); else openAppt(id); break; }
      case 'cancel': {
        const i = S.appts.findIndex(x => x.id === id); const [ap] = S.appts.splice(i, 1); save(); closeModal(); renderPage(); renderCounts();
        toast(t('cancelled'), { label: t('undo'), fn: () => { S.appts.push(ap); save(); renderPage(); renderCounts(); } }); break;
      }
      case 'remsent': { const ap = S.appts.find(x => x.id === id); if (ap) { ap.rem = true; save(); setTimeout(() => { renderPage(); renderCounts(); if (!$('#modal').hidden && $('#sheet .ad-top')) openAppt(id); }, 50); } break; }
      case 'remall': remItems().appts.forEach(x => { x.rem = true; }); save(); renderRem(); renderCounts(); break;
      case 'checkout': openCheckout(id); break;
      case 'cotab': U.btab = id; renderCheckout(); break;
      case 'coadd': { const k = el.dataset.k, l = U.co.lines.find(x => x.k === k && x.id === id); if (l) l.q++; else U.co.lines.push({ k, id, q: 1, p: k === 's' ? sv(id).price : prodD(id).price }); renderCheckout(); break; }
      case 'coq': { const l = U.co.lines[+id]; l.q += +el.dataset.d; if (l.q <= 0) U.co.lines.splice(+id, 1); renderCheckout(); break; }
      case 'copay': U.co.method = id; renderCheckout(); break;
      case 'codone': completeCheckout(); break;
      case 'viewbill': { const b = S.bills.find(x => x.no === id); if (b) showReceipt(b); break; }
      case 'printbill': { const b = S.bills.find(x => x.no === id); if (b) { $('#print').innerHTML = receiptHtml(b); window.print(); } break; }
      case 'bf': U.bf = id; U.bsel = null; renderBridal(); break;
      case 'bsel':
        U.bsel = id;
        if (window.innerWidth < 1000) openModal(shHead(esc(S.brides.find(x => x.id === id).name)) + '<div class="sh-body bdet">' + brideHtml(id) + '</div>', 'mid');
        else renderBridal();
        break;
      case 'bopen': { const b = S.brides.find(x => x.id === id); closeModal(); U.bf = b.status; U.bsel = id; go('bridal'); if (window.innerWidth < 1000) openModal(shHead(esc(b.name)) + '<div class="sh-body bdet">' + brideHtml(id) + '</div>', 'mid'); break; }
      case 'trialdone': { const b = S.brides.find(x => x.id === id); b.trialDone = true; save(); refreshBride(id); break; }
      case 'addpay': {
        const b = S.brides.find(x => x.id === id), amt = Math.round(+$('#payAmt').value || 0);
        if (amt > 0) { b.pays.push({ t: Date.now(), amt, method: $('#payM').value }); save(); toast(t('paySaved')); refreshBride(id); }
        break;
      }
      case 'bdone': { const b = S.brides.find(x => x.id === id); b.status = 'done'; save(); closeModal(); renderBridal(); renderCounts(); break; }
      case 'newbride': openNewBride(); break;
      case 'nbtype': U.nb.type = id; renderNewBride(); break;
      case 'nbq': U.nb.q[id] = Math.max(0, (U.nb.q[id] || 0) + +el.dataset.d); renderNewBride(); break;
      case 'nbsave': saveBride(); break;
      case 'csel':
        U.csel = id;
        if (window.innerWidth < 1000) openModal(shHead(esc(client(id).name)) + '<div class="sh-body cprof">' + profHtml(id) + '</div>', 'mid');
        else { $$('.cl.on').forEach(x => x.classList.remove('on')); el.classList.add('on'); $('#cprof').innerHTML = profHtml(id); }
        break;
      case 'cbook': closeModal(); U.day = dayStart(Date.now()); go('cal'); openNewAppt({ cid: id }); break;
      case 'rp': U.rp = id; renderReports(); break;
      case 'reset': try { localStorage.removeItem(KEY); } catch (er) { /* ignore */ } S = makeDemo(new Date()); save(); U.bsel = U.csel = null; U.day = dayStart(Date.now()); closeModal(); toast(t('resetDone')); renderPage(); renderCounts(); break;
    }
  });
  function refreshBride(id) {
    renderCounts();
    if (!$('#modal').hidden && $('#sheet .bdet')) $('#sheet .bdet').innerHTML = brideHtml(id);
    if (U.page === 'bridal') renderBridal();
    if (U.page === 'rem') renderRem();
  }
  document.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.ed) {
      const v = Math.max(0, Math.round(+el.value || 0)), id = el.dataset.id;
      if (el.dataset.ed === 'sp') sv(id).price = v; if (el.dataset.ed === 'sm') sv(id).mins = Math.max(15, Math.round(v / 15) * 15);
      if (el.dataset.ed === 'ps') S.products.find(x => x.id === id).stock = v;
      save(); toast(t('updated')); openSettings(); return;
    }
    if (el.dataset.cf) {
      const c = client(el.dataset.id), f = el.dataset.cf;
      c[f] = ['hair', 'skin', 'allergy'].includes(f) ? +el.value : el.value;
      save(); toast(t('saved'));
      if (f === 'allergy') { el.closest('label').classList.toggle('warn', +el.value > 0); }
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
  window.addEventListener('afterprint', () => { $('#print').innerHTML = ''; });
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => { if ((lastW < 760) !== (window.innerWidth < 760) && U.page === 'cal') renderCal(); lastW = window.innerWidth; });
  setInterval(() => { if (U.page === 'cal' && $('#modal').hidden) renderCal(); }, 60000);

  go(U.page);
  applyLang();
})();
