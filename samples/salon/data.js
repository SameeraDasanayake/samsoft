// Samsoft Salon demo - fixed catalogue. Live data (queue, bills, customers) is generated in salon.js.
window.SALON = {
  shop: {
    name: 'ROYAL CUT', sub_en: 'Gents Salon · Maharagama', sub_si: 'පිරිමි සැලෝන් · මහරගම',
    addr: '142, High Level Rd, Maharagama', phone: '011 284 6610',
    open: 8.5, close: 20.5,
    footer_en: 'Thank you! See you in 3 weeks.', footer_si: 'ස්තූතියි! සති 3කින් නැවත එන්න.'
  },
  // one chair per barber; pct = commission on services, ppct = on products
  barbers: [
    { id: 'b1', en: 'Sunil', si: 'සුනිල්', role_en: 'Senior barber', role_si: 'ජ්‍යෙෂ්ඨ බාබර්', pct: 45, ppct: 10, chair: 1 },
    { id: 'b2', en: 'Ruwan', si: 'රුවන්', role_en: 'Fades & beards', role_si: 'Fade සහ රැවුල්', pct: 40, ppct: 10, chair: 2 },
    { id: 'b3', en: 'Asanka', si: 'අසංක', role_en: 'Barber', role_si: 'බාබර්', pct: 40, ppct: 10, chair: 3 },
    { id: 'b4', en: 'Lahiru', si: 'ලහිරු', role_en: 'Junior barber', role_si: 'කනිෂ්ඨ බාබර්', pct: 35, ppct: 10, chair: 4 }
  ],
  services: [
    { id: 'cut', en: 'Haircut', si: 'කොණ්ඩය කැපීම', price: 600, mins: 20, w: 30 },
    { id: 'fade', en: 'Skin fade', si: 'Skin fade', price: 800, mins: 30, w: 16 },
    { id: 'kids', en: 'Kids cut (under 12)', si: 'ළමා කොණ්ඩය (අවු. 12ට අඩු)', price: 400, mins: 15, w: 10 },
    { id: 'beard', en: 'Beard trim & shape', si: 'රැවුල කපා හැඩ කිරීම', price: 350, mins: 15, w: 14 },
    { id: 'combo', en: 'Haircut + beard', si: 'කොණ්ඩය + රැවුල', price: 900, mins: 35, w: 18 },
    { id: 'shave', en: 'Hot towel shave', si: 'උණු තුවා රැවුල බෑම', price: 450, mins: 20, w: 7 },
    { id: 'wash', en: 'Hair wash', si: 'කොණ්ඩය සේදීම', price: 250, mins: 10, w: 8 },
    { id: 'color', en: 'Hair colour', si: 'කොණ්ඩයට පාට', price: 1800, mins: 45, w: 4 },
    { id: 'facial', en: 'Facial', si: 'ෆේෂල්', price: 1500, mins: 40, w: 4 },
    { id: 'massage', en: 'Head massage', si: 'හිස සම්බාහනය', price: 500, mins: 15, w: 6 }
  ],
  products: [
    { id: 'wax', en: 'Hair wax 75g', si: 'Hair wax 75g', price: 950, stock: 14 },
    { id: 'gel', en: 'Hair gel 150ml', si: 'Hair gel 150ml', price: 480, stock: 9 },
    { id: 'boil', en: 'Beard oil 30ml', si: 'රැවුල් තෙල් 30ml', price: 1250, stock: 6 },
    { id: 'shamp', en: 'Anti-dandruff shampoo', si: 'Anti-dandruff ෂැම්පු', price: 890, stock: 3 },
    { id: 'comb', en: 'Pocket comb', si: 'සාක්කු පනාව', price: 150, stock: 25 }
  ],
  first: ['Kasun', 'Nuwan', 'Dilshan', 'Chamara', 'Isuru', 'Tharindu', 'Ravindu', 'Sahan', 'Pasindu', 'Lakshan', 'Supun', 'Chathura',
    'Dinesh', 'Sanjaya', 'Ashen', 'Heshan', 'Janith', 'Malith', 'Nimesh', 'Pradeep', 'Ruchira', 'Sachin', 'Thilina', 'Udara',
    'Vimukthi', 'Yasiru', 'Kavindu', 'Mahesh', 'Gayan', 'Roshan', 'Anuradha', 'Buddhika', 'Charith', 'Damith', 'Eranga',
    'Hasitha', 'Imesh', 'Kanishka', 'Lahiru', 'Mohamed Rizwan', 'Fazil', 'Ramesh Kumar'],
  last: ['Perera', 'Silva', 'Fernando', 'Jayasinghe', 'Bandara', 'Wickramasinghe', 'Herath', 'Rajapaksha', 'Dissanayake',
    'Gunawardena', 'Senanayake', 'Kumara', 'Rathnayake', 'Weerasinghe', 'Abeysekara', 'Karunaratne', 'Ekanayake', 'Mendis'],
  notes: [
    ['Skin fade #0 sides, 2 inch on top', 'Sides skin fade #0, උඩ අඟල් 2'],
    ['Short back & sides, side part on left', 'පස්ස සහ පැති කොට, වම් පැත්තට කඩ'],
    ['Crew cut, #2 all over the sides', 'Crew cut, පැති #2'],
    ['Beard: keep length, sharp line on cheeks', 'රැවුල දිග තියන්න, කම්මුල් රේඛාව තියුණු'],
    ['Sensitive skin - no alcohol after shave', 'සංවේදී සම - shave එකෙන් පස්සේ alcohol එපා'],
    ['Low taper, textured top, likes wax', 'Low taper, උඩ texture, wax කැමතියි'],
    ['Kid - sits on booster seat, nervous of clipper', 'ළමයා - booster පුටුව, clipper එකට බයයි'],
    ['Covers grey: colour dark brown every 6 weeks', 'සුදු කෙස් වසන්න: සති 6කට වරක් තද දුඹුරු'],
    ['Mid fade, line-up at front', 'Mid fade, ඉදිරියෙන් line-up'],
    ['Only scissors on top, no clipper', 'උඩ කතුරෙන් පමණයි, clipper එපා']
  ]
};
