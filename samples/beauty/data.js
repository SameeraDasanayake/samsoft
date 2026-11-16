// Samsoft Beauty demo - fixed catalogue. Live data (appointments, bills, bridal bookings) is generated in beauty.js.
window.BEAUTY = {
  shop: {
    name: 'Senuri', full: 'Senuri Bridal & Beauty', sub_en: 'Ladies salon · Nugegoda', sub_si: 'ලේඩීස් සැලෝන් · නුගේගොඩ',
    addr: '58/2, Stanley Thilakaratne Mw, Nugegoda', phone: '011 281 4470', open: 9, close: 19,
    footer_en: 'Thank you for choosing Senuri.', footer_si: 'Senuri තෝරාගත්තාට ස්තූතියි.'
  },
  stylists: [
    { id: 's1', en: 'Dilini', si: 'දිලිනි', role_en: 'Senior stylist · Bridal', role_si: 'ජ්‍යෙෂ්ඨ stylist · මනාලියන්', col: '#8c2f4b' },
    { id: 's2', en: 'Sachini', si: 'සචිනි', role_en: 'Hair colour', role_si: 'කොණ්ඩ පාට', col: '#3f6f73' },
    { id: 's3', en: 'Nadeesha', si: 'නදීශා', role_en: 'Skin & nails', role_si: 'සම සහ නියපොතු', col: '#b0703a' },
    { id: 's4', en: 'Kumari', si: 'කුමාරි', role_en: 'Beautician', role_si: 'රූපලාවණ්‍ය ශිල්පිනී', col: '#5d5a8a' }
  ],
  cats: [
    { id: 'hair', en: 'Hair', si: 'කොණ්ඩය' }, { id: 'skin', en: 'Skin', si: 'සම' },
    { id: 'nails', en: 'Nails', si: 'නියපොතු' }, { id: 'dress', en: 'Dressing', si: 'ඇඳුම් / මේකප්' }
  ],
  services: [
    { id: 'cutbd', cat: 'hair', en: 'Haircut & blow-dry', si: 'කොණ්ඩය කපා blow-dry', price: 2500, mins: 45, w: 16, who: ['s1', 's2', 's4'] },
    { id: 'bdry', cat: 'hair', en: 'Blow-dry', si: 'Blow-dry', price: 1500, mins: 30, w: 8, who: ['s1', 's2', 's4'] },
    { id: 'color', cat: 'hair', en: 'Hair colour (full)', si: 'කොණ්ඩයට පාට (සම්පූර්ණ)', price: 6500, mins: 90, w: 7, who: ['s2'] },
    { id: 'hilite', cat: 'hair', en: 'Highlights', si: 'Highlights', price: 9500, mins: 120, w: 4, who: ['s2'] },
    { id: 'kera', cat: 'hair', en: 'Keratin treatment', si: 'Keratin ප්‍රතිකාරය', price: 18000, mins: 150, w: 3, who: ['s2', 's1'] },
    { id: 'spa', cat: 'hair', en: 'Hair spa', si: 'Hair spa', price: 3500, mins: 60, w: 6, who: ['s2', 's4'] },
    { id: 'clean', cat: 'skin', en: 'Clean-up', si: 'Clean-up', price: 3000, mins: 45, w: 8, who: ['s3', 's4'] },
    { id: 'facial', cat: 'skin', en: 'Gold facial', si: 'Gold facial', price: 6500, mins: 75, w: 6, who: ['s3', 's4'] },
    { id: 'brow', cat: 'skin', en: 'Eyebrow threading', si: 'ඇහිබැම හැඩ කිරීම', price: 300, mins: 15, w: 18, who: ['s3', 's4'] },
    { id: 'wax', cat: 'skin', en: 'Waxing – full arms', si: 'Waxing – අත් දෙක', price: 1800, mins: 30, w: 6, who: ['s3', 's4'] },
    { id: 'mani', cat: 'nails', en: 'Manicure', si: 'Manicure', price: 2200, mins: 45, w: 7, who: ['s3'] },
    { id: 'pedi', cat: 'nails', en: 'Pedicure', si: 'Pedicure', price: 2800, mins: 60, w: 7, who: ['s3'] },
    { id: 'gel', cat: 'nails', en: 'Gel polish', si: 'Gel polish', price: 3500, mins: 45, w: 5, who: ['s3'] },
    { id: 'saree', cat: 'dress', en: 'Saree draping', si: 'සාරිය ඇඳීම', price: 2500, mins: 30, w: 5, who: ['s1', 's4'] },
    { id: 'party', cat: 'dress', en: 'Party make-up & hair', si: 'Party මේකප් සහ කොණ්ඩය', price: 7500, mins: 90, w: 4, who: ['s1', 's4'] }
  ],
  products: [
    { id: 'serum', en: 'Hair serum 100ml', si: 'Hair serum 100ml', price: 2650, stock: 8 },
    { id: 'shamp', en: 'Colour-safe shampoo', si: 'පාට ආරක්ෂිත ෂැම්පු', price: 3200, stock: 5 },
    { id: 'mask', en: 'Keratin hair mask', si: 'Keratin hair mask', price: 4100, stock: 2 },
    { id: 'sun', en: 'Sunscreen SPF 50', si: 'Sunscreen SPF 50', price: 2900, stock: 11 },
    { id: 'polish', en: 'Nail polish', si: 'Nail polish', price: 950, stock: 24 }
  ],
  // bridal / dressing packages (price per person)
  packs: [
    { id: 'kandyan', en: 'Kandyan bridal', si: 'උඩරට මනාලිය', price: 85000, main: true },
    { id: 'western', en: 'Western bridal', si: 'බටහිර මනාලිය', price: 75000, main: true },
    { id: 'home', en: 'Homecoming', si: 'ගෙදර ඒම', price: 45000, main: true },
    { id: 'engage', en: 'Engagement dressing', si: 'විවාහ ගිවිසුම් ඇඳීම', price: 32000, main: true },
    { id: 'maid', en: 'Bridesmaid dressing', si: 'මනාලියන්ගේ සහායිකා', price: 9500 },
    { id: 'flower', en: 'Flower girl', si: 'මල් කුමාරිකාව', price: 4500 },
    { id: 'mother', en: 'Mother of the bride', si: 'මනාලියගේ මව', price: 8500 },
    { id: 'trial', en: 'Trial session', si: 'අත්හදා බැලීමේ session එක', price: 7500 },
    { id: 'ext', en: 'Hair extensions', si: 'කොණ්ඩ extensions', price: 6000 },
    { id: 'jewel', en: 'Jewellery set rental', si: 'ආභරණ කට්ටලය කුලියට', price: 15000 },
    { id: 'travel', en: 'Home / hotel visit', si: 'නිවසට / හෝටලයට පැමිණීම', price: 8000 }
  ],
  venues: ['Waters Edge, Battaramulla', 'Galadari Hotel, Colombo', 'Cinnamon Lakeside', 'Golden Rose, Boralesgamuwa', 'Mount Lavinia Hotel', 'Bride\'s home, Maharagama', 'Grand Monarch, Thalawathugoda', 'Hotel Janaki, Narahenpita'],
  first: ['Nethmi', 'Sanduni', 'Hiruni', 'Dulani', 'Ishara', 'Kavindi', 'Tharushi', 'Piumi', 'Madushani', 'Chathurika', 'Dilhani',
    'Sewwandi', 'Nadeeka', 'Anjali', 'Shalini', 'Imesha', 'Rashmi', 'Yasodha', 'Nimesha', 'Udeshika', 'Gayani', 'Hansika', 'Oshadi',
    'Thilini', 'Sachintha', 'Malsha', 'Kaveesha', 'Dinithi', 'Ruwanthi', 'Shehani', 'Fathima Rizna', 'Ayesha', 'Priyanka', 'Lakmini'],
  last: ['Perera', 'Silva', 'Fernando', 'Jayasinghe', 'Bandara', 'Wickramasinghe', 'Herath', 'Rajapaksha', 'Dissanayake',
    'Gunawardena', 'Senanayake', 'Rathnayake', 'Weerasinghe', 'Abeysekara', 'Karunaratne', 'Ekanayake', 'Mendis', 'De Alwis'],
  hair: [['Fine, straight', 'සිහින්, කෙළින්'], ['Thick, wavy', 'ඝන, රැලි'], ['Curly, dry ends', 'රැලි, අග වියළි'], ['Medium, coloured', 'මධ්‍යම, පාට කළ'], ['Long, oily scalp', 'දිග, හිස්කබල තෙල්']],
  skin: [['Oily, T-zone', 'තෙල් සහිත, T-zone'], ['Dry', 'වියළි'], ['Combination', 'මිශ්‍ර'], ['Sensitive', 'සංවේදී'], ['Normal', 'සාමාන්‍ය']],
  allergy: [['None', 'නෑ'], ['PPD in hair dye – use PPD-free', 'Hair dye PPD – PPD නැති එකක්'], ['Fragrance – unscented products', 'සුවඳ – සුවඳ නැති භාණ්ඩ'], ['Nickel – no metal clips', 'Nickel – ලෝහ clips එපා'], ['Latex gloves', 'Latex අත්වැසුම්']],
  formula: ['6.35 + 20 vol, 35 min', '5.0 + 4.5 (1:1) + 20 vol', '7.43 gloss, 10 vol', 'Roots 4.0 + 20 vol, ends 6.0', '']
};
