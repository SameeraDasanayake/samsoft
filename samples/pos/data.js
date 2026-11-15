// Samsoft POS demo - grocery demo data. Everything here is sample data for the demo only.
'use strict';

window.POS_DATA = (function () {
  // Categories: id, Sinhala, English, colour, icon
  const CATS = [
    ['grain', 'සහල් හා ධාන්‍ය', 'Rice & Grains', '#c58a12', '🌾'],
    ['spice', 'කුළුබඩු', 'Spices', '#b0381f', '🌶️'],
    ['dairy', 'කිරි, බිත්තර, පාන්', 'Dairy & Bakery', '#3d6b8c', '🥛'],
    ['drink', 'බීම', 'Drinks', '#2c7a6e', '🥤'],
    ['snack', 'බිස්කට් හා කෙටි කෑම', 'Biscuits & Snacks', '#8a5a2b', '🍪'],
    ['home', 'ගෘහ භාණ්ඩ', 'Household', '#6b5d4f', '🧺'],
    ['care', 'පුද්ගලික සත්කාර', 'Personal Care', '#9c4a6b', '🧴'],
    ['veg', 'එළවළු හා පලතුරු', 'Vegetables & Fruit', '#4f7a2e', '🥕']
  ].map(([id, si, en, color, icon]) => ({ id, si, en, color, icon }));

  // id, cat, Sinhala, English, unit, price (Rs.), stock, reorder level, icon, popularity
  const P = [
    [1, 'grain', 'සම්බා සහල්', 'Samba Rice', 'kg', 270, 85.5, 20, '🍚', 6],
    [2, 'grain', 'නාඩු සහල්', 'Nadu Rice', 'kg', 235, 120, 25, '🍚', 6],
    [3, 'grain', 'කීරි සම්බා', 'Keeri Samba', 'kg', 330, 14, 15, '🍚', 2],
    [4, 'grain', 'රතු පරිප්පු', 'Red Dhal', 'kg', 330, 40, 10, '🫘', 5],
    [5, 'grain', 'තිරිඟු පිටි', 'Wheat Flour', 'kg', 210, 60, 15, '🌾', 4],
    [6, 'grain', 'සීනි', 'Sugar', 'kg', 280, 9, 15, '🍬', 5],
    [7, 'grain', 'කඩල', 'Chickpeas', 'kg', 520, 18, 5, '🫘', 1],
    [8, 'grain', 'සෝයා මීට් 90g', 'Soya Meat 90g', 'pkt', 130, 48, 12, '🥡', 2],
    [9, 'spice', 'මිරිස් කුඩු 100g', 'Chilli Powder 100g', 'pkt', 210, 30, 10, '🌶️', 2],
    [10, 'spice', 'කහ කුඩු 50g', 'Turmeric Powder 50g', 'pkt', 120, 25, 8, '🌼', 1],
    [11, 'spice', 'ලුණු 1kg', 'Salt 1kg', 'pkt', 110, 40, 10, '🧂', 2],
    [12, 'spice', 'තුනපහ 100g', 'Curry Powder 100g', 'pkt', 240, 20, 8, '🍛', 2],
    [13, 'veg', 'ලොකු ලූනු', 'Big Onion', 'kg', 380, 22.5, 10, '🧅', 5],
    [14, 'veg', 'සුදු ලූනු', 'Garlic', 'kg', 900, 6.2, 3, '🧄', 2],
    [15, 'dairy', 'කිරිපිටි 400g', 'Milk Powder 400g', 'pkt', 1150, 24, 8, '🥛', 3],
    [16, 'dairy', 'බිත්තර', 'Egg', 'each', 48, 180, 60, '🥚', 6],
    [17, 'dairy', 'බටර් 200g', 'Butter 200g', 'pkt', 950, 7, 8, '🧈', 1],
    [18, 'dairy', 'යෝගට්', 'Yoghurt', 'each', 90, 30, 12, '🥣', 2],
    [19, 'dairy', 'පාන්', 'Bread Loaf', 'each', 160, 20, 10, '🍞', 6],
    [20, 'drink', 'තේ කොළ 200g', 'Tea Leaves 200g', 'pkt', 620, 26, 8, '🍵', 3],
    [21, 'drink', 'කෝපි කුඩු 100g', 'Coffee 100g', 'pkt', 480, 12, 5, '☕', 1],
    [22, 'drink', 'බෝතල් වතුර 1.5L', 'Water 1.5L', 'bottle', 150, 48, 24, '💧', 3],
    [23, 'drink', 'සිසිල් බීම 1L', 'Soft Drink 1L', 'bottle', 350, 30, 12, '🥤', 2],
    [24, 'drink', 'පලතුරු යුෂ 200ml', 'Fruit Juice 200ml', 'each', 140, 40, 12, '🧃', 2],
    [25, 'snack', 'ක්‍රීම් බිස්කට්', 'Cream Biscuits', 'pkt', 230, 45, 15, '🍪', 3],
    [26, 'snack', 'මාරි බිස්කට්', 'Marie Biscuits', 'pkt', 180, 50, 15, '🍪', 3],
    [27, 'snack', 'චොකලට් 100g', 'Chocolate 100g', 'each', 450, 18, 6, '🍫', 1],
    [28, 'snack', 'මික්ස්චර් 100g', 'Mixture 100g', 'pkt', 150, 4, 10, '🥨', 2],
    [29, 'home', 'රෙදි සෝදන කුඩු 1kg', 'Washing Powder 1kg', 'pkt', 620, 22, 8, '🧺', 2],
    [30, 'home', 'පිඟන් සෝදන දියර 500ml', 'Dishwash Liquid 500ml', 'bottle', 390, 16, 6, '🧽', 1],
    [31, 'home', 'ඉටිපන්දම් 6', 'Candles (6)', 'pkt', 180, 30, 10, '🕯️', 1],
    [32, 'home', 'ගිනිපෙට්ටි', 'Matchbox', 'each', 30, 100, 30, '🔥', 3],
    [33, 'home', 'ටොයිලට් පේපර්', 'Toilet Roll', 'each', 140, 3, 12, '🧻', 1],
    [34, 'care', 'නාන සබන්', 'Bath Soap', 'each', 160, 60, 20, '🧼', 3],
    [35, 'care', 'දත් බෙහෙත් 120g', 'Toothpaste 120g', 'each', 310, 25, 10, '🪥', 2],
    [36, 'care', 'ෂැම්පු 180ml', 'Shampoo 180ml', 'bottle', 690, 12, 5, '🧴', 1],
    [37, 'veg', 'පොල්', 'Coconut', 'each', 160, 45, 20, '🥥', 6],
    [38, 'veg', 'අල', 'Potato', 'kg', 320, 30, 10, '🥔', 3],
    [39, 'veg', 'කැරට්', 'Carrot', 'kg', 400, 12.5, 5, '🥕', 2],
    [40, 'veg', 'තක්කාලි', 'Tomato', 'kg', 480, 8, 4, '🍅', 2],
    [41, 'veg', 'ඇඹුල් කෙසෙල්', 'Banana (Ambul)', 'kg', 300, 15, 5, '🍌', 2],
    [42, 'veg', 'දෙහි', 'Lime', 'kg', 700, 3, 1, '🍋', 1]
  ];

  function ean13(id) {
    const b = '4791234' + String(id).padStart(5, '0');
    let s = 0;
    for (let i = 0; i < 12; i++) s += (+b[i]) * (i % 2 ? 3 : 1);
    return b + ((10 - (s % 10)) % 10);
  }

  const PRODUCTS = P.map(([id, cat, si, en, unit, price, stock, reorder, icon, pop]) => ({
    id, cat, si, en, unit, price, stock, reorder, icon, pop,
    code: String(100 + id),
    barcode: unit === 'kg' ? '' : ean13(id) // loose (weighed) items use the short code only
  }));

  // id, Sinhala, English, phone, credit limit, opening balance, payments [daysAgo, amount]
  const CUSTOMERS = [
    ['c1', 'කමල් පෙරේරා', 'Kamal Perera', '070 000 0001', 15000, 6450, [[5, 2000]]],
    ['c2', 'නිමලි සිල්වා', 'Nimali Silva', '070 000 0002', 10000, 2380, [[2, 1000]]],
    ['c3', 'සුනිල් බණ්ඩාර', 'Sunil Bandara', '070 000 0003', 20000, 18900, [[3, 5000]]],
    ['c4', 'ෆාතිමා රිස්වාන්', 'Fathima Rizwan', '070 000 0004', 8000, 1250, []],
    ['c5', 'රවී කුමාර්', 'Ravi Kumar', '070 000 0005', 20000, 0, []]
  ];

  function rngFrom(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;

  // Builds a fresh demo shop: products, customers and 7 days of sales up to "now".
  function makeDemo(now) {
    now = now || new Date();
    const day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const rnd = rngFrom(day0 / 1000);
    const pick = a => a[Math.floor(rnd() * a.length)];
    const products = PRODUCTS.map(p => Object.assign({}, p));
    const customers = CUSTOMERS.map(([id, si, en, phone, limit, open, pays]) => {
      const tx = [];
      if (open) tx.push({ t: day0 - 12 * 864e5 + 10 * 36e5, type: 'open', amt: open });
      pays.forEach(([d, a]) => tx.push({ t: day0 - d * 864e5 + 17 * 36e5, type: 'pay', amt: a }));
      return { id, si, en, phone, limit, demo: true, tx };
    });

    const pool = [];
    products.forEach(p => { for (let i = 0; i < p.pop; i++) pool.push(p); });
    const creditCust = ['c1', 'c2', 'c4', 'c5', 'c1', 'c2', 'c3'];

    const raw = [];
    for (let d = 6; d >= 0; d--) {
      const ds = day0 - d * 864e5;
      let start = ds + 6.5 * 36e5;
      let end = ds + 21 * 36e5;
      let n = 26 + Math.floor(rnd() * 13);
      if (d === 0) {
        end = Math.min(end, now.getTime() - 2 * 6e4);
        if (end - start < 30 * 6e4) start = Math.max(ds + 5 * 6e4, end - 90 * 6e4);
        const hrs = (end - start) / 36e5;
        n = end - start < 10 * 6e4 ? 0 : Math.max(4, Math.round(n * hrs / 14.5));
      }
      for (let i = 0; i < n; i++) {
        const t = start + rnd() * (end - start);
        const lines = new Map();
        const k = 1 + Math.floor(rnd() * rnd() * 7);
        for (let j = 0; j < k; j++) {
          const p = pick(pool);
          let q;
          if (p.unit === 'kg') q = p.price >= 600 ? pick([0.1, 0.25, 0.25, 0.5]) : pick([0.25, 0.5, 0.5, 1, 1, 1, 2, 5]);
          else if (p.id === 16) q = pick([2, 4, 5, 10]);
          else q = pick([1, 1, 1, 2, 2, 3]);
          const old = lines.get(p.id);
          lines.set(p.id, { id: p.id, si: p.si, en: p.en, unit: p.unit, price: p.price, qty: r2((old ? old.qty : 0) + q) });
        }
        const items = Array.from(lines.values());
        const sub = r2(items.reduce((s, l) => s + l.price * l.qty, 0));
        const r = rnd();
        const method = r < 0.72 ? 'cash' : r < 0.93 ? 'card' : 'credit';
        const total = sub;
        const bill = { t: Math.round(t), items, sub, disc: 0, total, method };
        if (method === 'cash') {
          const notes = [100, 500, 1000, 5000];
          let paid = total;
          for (const n2 of notes) { if (rnd() < 0.7) { paid = Math.ceil(total / n2) * n2; break; } }
          bill.paid = paid; bill.change = r2(paid - total);
        } else bill.paid = total;
        if (method === 'credit') bill.cust = pick(creditCust);
        raw.push(bill);
      }
    }
    raw.sort((a, b) => a.t - b.t);
    let no = 1001;
    raw.forEach(b => {
      b.no = no++;
      if (b.cust) customers.find(c => c.id === b.cust).tx.push({ t: b.t, type: 'sale', amt: b.total, bill: b.no });
    });
    customers.forEach(c => c.tx.sort((a, b) => a.t - b.t));

    return {
      v: 1,
      made: day0,
      shop: {
        si: 'සමන් ස්ටෝර්ස්', en: 'Saman Stores',
        addr: 'No. 25, Main Street, Kandy', phone: '081 000 0000',
        footer_si: 'ස්තූතියි! නැවත එන්න.', footer_en: 'Thank you! Come again.'
      },
      products, customers, bills: raw, nextNo: no, nextId: 100
    };
  }

  return { CATS, makeDemo, ean13 };
})();
