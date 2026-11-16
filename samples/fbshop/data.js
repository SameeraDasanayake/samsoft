// Samsoft online seller demo - shared catalogue for shop.html (customer page) and index.html (seller order manager).
// img: img/<id>.jpg (made by the user in ChatGPT, prompts in G:/Samsoft/brand/fbshop/PROMPTS.md)
window.FBSHOP = {
  shop: { name: 'Nethu Closet', tag_en: 'Everyday & party wear · Island-wide delivery', tag_si: 'දිනපතා සහ සාද ඇඳුම් · දිවයින පුරා බෙදාහැරීම',
    page: 'fb.com/nethucloset', phone: '077 512 3048', from: 'Nethu Closet, 14/3 Temple Rd, Kiribathgoda', bank: 'Commercial Bank · Kiribathgoda · 8012 4471 63 · N. Perera' },
  cats: [
    { id: 'dress', en: 'Dresses', si: 'ගවුම්' }, { id: 'top', en: 'Tops', si: 'ටොප්ස්' }, { id: 'bottom', en: 'Pants & skirts', si: 'කලිසම් / සායන්' },
    { id: 'set', en: 'Sets & sarees', si: 'කට්ටල / සාරි' }, { id: 'kids', en: 'Kids', si: 'ළමා' }, { id: 'bag', en: 'Bags', si: 'බෑග්' }
  ],
  products: [
    { id: 'p01', cat: 'dress', en: 'Batik maxi dress', si: 'බතික් maxi ගවුම', colour_en: 'Indigo', colour_si: 'ඉන්ඩිගෝ', price: 4850, cost: 2600, sizes: ['S', 'M', 'L', 'XL'], tag: 'best' },
    { id: 'p02', cat: 'dress', en: 'Linen shirt dress', si: 'ලිනන් shirt ගවුම', colour_en: 'Sand', colour_si: 'වැලි පාට', price: 5450, cost: 2950, sizes: ['S', 'M', 'L', 'XL'], tag: 'new' },
    { id: 'p03', cat: 'dress', en: 'Floral midi frock', si: 'මල් මෝස්තර midi ගවුම', colour_en: 'Rose', colour_si: 'රෝස', price: 3950, cost: 2100, sizes: ['S', 'M', 'L'], tag: '' },
    { id: 'p04', cat: 'top', en: 'Puff-sleeve top', si: 'Puff-sleeve ටොප් එක', colour_en: 'White', colour_si: 'සුදු', price: 2650, cost: 1350, sizes: ['S', 'M', 'L', 'XL'], tag: 'best' },
    { id: 'p05', cat: 'top', en: 'Office blouse', si: 'කාර්යාල බ්ලවුස්', colour_en: 'Sage green', colour_si: 'ළා කොළ', price: 2950, cost: 1500, sizes: ['S', 'M', 'L', 'XL', 'XXL'], tag: '' },
    { id: 'p06', cat: 'bottom', en: 'Wide-leg linen pants', si: 'Wide-leg ලිනන් කලිසම', colour_en: 'Black', colour_si: 'කළු', price: 3450, cost: 1800, sizes: ['S', 'M', 'L', 'XL'], tag: '' },
    { id: 'p07', cat: 'set', en: 'Kurta & pant set', si: 'කුර්තා සහ කලිසම් කට්ටලය', colour_en: 'Teal', colour_si: 'තද කොළ-නිල්', price: 5950, cost: 3300, sizes: ['M', 'L', 'XL'], tag: 'new' },
    { id: 'p08', cat: 'dress', en: 'Satin party dress', si: 'Satin සාද ගවුම', colour_en: 'Emerald', colour_si: 'මරකත කොළ', price: 6850, cost: 3700, sizes: ['S', 'M', 'L'], tag: '' },
    { id: 'p09', cat: 'kids', en: 'Kids cotton frock', si: 'ළමා කපු ගවුම', colour_en: 'Sunshine yellow', colour_si: 'කහ', price: 2450, cost: 1200, sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'], tag: '' },
    { id: 'p10', cat: 'bottom', en: 'Denim A-line skirt', si: 'Denim A-line සාය', colour_en: 'Mid blue', colour_si: 'මධ්‍යම නිල්', price: 3250, cost: 1700, sizes: ['S', 'M', 'L'], tag: '' },
    { id: 'p11', cat: 'bag', en: 'Crossbody handbag', si: 'Crossbody අත් බෑගය', colour_en: 'Tan', colour_si: 'දුඹුරු', price: 3950, cost: 2050, sizes: ['One size'], tag: '' },
    { id: 'p12', cat: 'set', en: 'Handloom cotton saree', si: 'අත්යන්ත්‍ර කපු සාරිය', colour_en: 'Mustard & maroon', colour_si: 'අබ කහ සහ තද රතු', price: 7500, cost: 4300, sizes: ['Free size'], tag: 'best' }
  ],
  // delivery fee charged to the customer, by district group
  districts: [
    ['Colombo', 350], ['Gampaha', 350], ['Kalutara', 400], ['Kandy', 450], ['Kurunegala', 450], ['Galle', 450], ['Matara', 450],
    ['Ratnapura', 450], ['Kegalle', 450], ['Anuradhapura', 500], ['Badulla', 500], ['Nuwara Eliya', 500], ['Hambantota', 500],
    ['Puttalam', 500], ['Polonnaruwa', 500], ['Matale', 450], ['Trincomalee', 550], ['Batticaloa', 550], ['Ampara', 550], ['Jaffna', 600]
  ],
  towns: { Colombo: ['Nugegoda', 'Dehiwala', 'Maharagama', 'Borella', 'Kottawa'], Gampaha: ['Kiribathgoda', 'Kadawatha', 'Ja-Ela', 'Negombo', 'Gampaha'],
    Kalutara: ['Panadura', 'Horana', 'Kalutara'], Kandy: ['Peradeniya', 'Katugastota', 'Kandy'], Kurunegala: ['Kurunegala', 'Kuliyapitiya'],
    Galle: ['Galle', 'Hikkaduwa', 'Ambalangoda'], Matara: ['Matara', 'Weligama'], Ratnapura: ['Ratnapura', 'Balangoda'], Kegalle: ['Kegalle', 'Mawanella'],
    Anuradhapura: ['Anuradhapura'], Badulla: ['Badulla', 'Bandarawela'], 'Nuwara Eliya': ['Nuwara Eliya', 'Hatton'], Hambantota: ['Tangalle', 'Ambalantota'],
    Puttalam: ['Chilaw', 'Wennappuwa'], Polonnaruwa: ['Polonnaruwa'], Matale: ['Matale', 'Dambulla'], Trincomalee: ['Trincomalee'], Batticaloa: ['Batticaloa'],
    Ampara: ['Ampara'], Jaffna: ['Jaffna'] },
  couriers: [
    { id: 'speed', name: 'SpeedLink Express', pre: 'SLX', fee: 380 },
    { id: 'island', name: 'IslandWide Couriers', pre: 'IWC', fee: 360 },
    { id: 'quick', name: 'QuickDrop Lanka', pre: 'QDL', fee: 400 }
  ],
  returnFee: 200,
  first: ['Nethmi', 'Sanduni', 'Hiruni', 'Dulani', 'Ishara', 'Kavindi', 'Tharushi', 'Piumi', 'Madushani', 'Chathurika', 'Dilhani', 'Sewwandi',
    'Nadeeka', 'Anjali', 'Shalini', 'Imesha', 'Rashmi', 'Yasodha', 'Nimesha', 'Udeshika', 'Gayani', 'Hansika', 'Oshadi', 'Thilini', 'Malsha',
    'Kaveesha', 'Dinithi', 'Ruwanthi', 'Shehani', 'Fathima Rifka', 'Ayesha', 'Lakmini', 'Kasun', 'Chamath'],
  last: ['Perera', 'Silva', 'Fernando', 'Jayasinghe', 'Bandara', 'Wickramasinghe', 'Herath', 'Rajapaksha', 'Dissanayake', 'Gunawardena',
    'Senanayake', 'Rathnayake', 'Weerasinghe', 'Karunaratne', 'Ekanayake', 'Mendis'],
  streets: ['Temple Rd', 'Main St', 'Station Rd', 'Lake Rd', 'Church Rd', 'School Lane', 'Hospital Rd', 'Old Kandy Rd', 'Galle Rd', 'Pansala Para']
};
