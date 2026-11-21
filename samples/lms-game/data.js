// SITHUMINA WORLD - a sample "Game World" LMS (Samsoft, 2026-11-21): a Grade 5 Scholarship class as a small 2D game.
// Everything a student sees, in Sinhala + English ([si, en]). The teacher and the class are made up.
export const CLASS = { name: ['සිතුමිණ ලෝකය', 'Sithumina World'], teacher: ['නදීෂා ගුරුතුමිය', 'Nadeesha Miss'], grade: ['5 ශ්‍රේණිය · ශිෂ්‍යත්ව', 'Grade 5 · Scholarship'] };

// q: [question, [options], answer index]  (si / en kept side by side)
const Q = (si, en, osi, oen, a) => ({ q: [si, en], o: osi.map((x, i) => [x, oen[i]]), a });

export const LESSONS = [
  { id: 1, t: ['සංඛ්‍යා රටා', 'Number patterns'], ic: '🔢',
    pts: [['රටාවක ඊළඟ අංකය හොයන්න අංක දෙකක් අතර වෙනස බලන්න.', 'To find the next number, look at the difference between two numbers.'], ['සමහර රටා එකතු වෙනවා (+3), සමහර ඒවා අඩු වෙනවා (-5).', 'Some patterns add (+3), some take away (-5).'], ['සමහර රටා දෙගුණ වෙනවා: 1, 2, 4, 8 ...', 'Some patterns double: 1, 2, 4, 8 ...']],
    qs: [Q('3, 6, 9, 12, ___', '3, 6, 9, 12, ___', ['14', '15', '16', '18'], ['14', '15', '16', '18'], 1),
         Q('50, 45, 40, 35, ___', '50, 45, 40, 35, ___', ['25', '30', '32', '40'], ['25', '30', '32', '40'], 1),
         Q('1, 2, 4, 8, ___', '1, 2, 4, 8, ___', ['10', '12', '14', '16'], ['10', '12', '14', '16'], 3)] },
  { id: 2, t: ['භාග', 'Fractions'], ic: '🍕', sim: 'pizza',
    pts: [['භාගයක් කියන්නේ මුළු දෙයකින් කොටසක්. 3/4 = කොටස් 4න් 3ක්.', 'A fraction is a part of a whole. 3/4 = 3 parts out of 4.'], ['උඩ අංකය (ලවය) = ගත්ත කොටස්. යට අංකය (හරය) = මුළු කොටස්.', 'The top number = the parts taken. The bottom number = all the parts.'], ['1/2 = 2/4 = 4/8. මේවා සමාන භාග.', '1/2 = 2/4 = 4/8. These are equal fractions.']],
    qs: [Q('1/2 ට සමාන භාගය කුමක්ද?', 'Which fraction is equal to 1/2?', ['2/3', '4/8', '1/4', '3/5'], ['2/3', '4/8', '1/4', '3/5'], 1),
         Q('පීසා කෑලි 8න් 2ක් කෑවා. කෑවේ කොපමණ කොටසක්ද?', '2 of 8 pizza slices were eaten. What part was eaten?', ['1/2', '1/4', '1/8', '2/6'], ['1/2', '1/4', '1/8', '2/6'], 1),
         Q('3/4 සහ 2/4 න් විශාල කුමක්ද?', 'Which is bigger: 3/4 or 2/4?', ['2/4', '3/4', 'දෙකම සමානයි', 'කියන්න බෑ'], ['2/4', '3/4', 'Both equal', "Can't tell"], 1)] },
  { id: 3, t: ['කාලය', 'Time'], ic: '⏰', sim: 'clock',
    pts: [['පැයක් = විනාඩි 60. දවසක් = පැය 24.', 'One hour = 60 minutes. One day = 24 hours.'], ['දිග කටුව විනාඩි පෙන්වයි, කොට කටුව පැය පෙන්වයි.', 'The long hand shows minutes, the short hand shows hours.'], ['පැය 24 ඔරලෝසුවේ 15:00 = ප.ව. 3.00.', 'On a 24-hour clock 15:00 = 3.00 p.m.']],
    qs: [Q('විනාඩි 90 = ?', '90 minutes = ?', ['පැය 1', 'පැය 1 විනාඩි 30', 'පැය 2', 'පැය 1 විනාඩි 9'], ['1 hour', '1 hour 30 minutes', '2 hours', '1 hour 9 minutes'], 1),
         Q('පෙ.ව. 10.30 සිට ප.ව. 1.00 දක්වා කාලය කීයද?', 'How long is it from 10.30 a.m. to 1.00 p.m.?', ['පැය 2', 'පැය 2 විනාඩි 30', 'පැය 3', 'පැය 3 විනාඩි 30'], ['2 hours', '2 hours 30 minutes', '3 hours', '3 hours 30 minutes'], 1),
         Q('14:00 = ?', '14:00 = ?', ['පෙ.ව. 2.00', 'ප.ව. 2.00', 'ප.ව. 4.00', 'පෙ.ව. 10.00'], ['2.00 a.m.', '2.00 p.m.', '4.00 p.m.', '10.00 a.m.'], 1)] },
  { id: 4, t: ['මිනුම්', 'Measurements'], ic: '📏',
    pts: [['1 m = 100 cm. 1 km = 1000 m.', '1 m = 100 cm. 1 km = 1000 m.'], ['1 kg = 1000 g. 1 l = 1000 ml.', '1 kg = 1000 g. 1 l = 1000 ml.'], ['ලොකු ඒකකයෙන් කුඩා ඒකකයට යන්න ගුණ කරන්න.', 'From a big unit to a small one, multiply.']],
    qs: [Q('1 m = cm කීයද?', '1 m = how many cm?', ['10', '100', '1000', '50'], ['10', '100', '1000', '50'], 1),
         Q('2 kg 500 g = g කීයද?', '2 kg 500 g = how many g?', ['250', '2050', '2500', '25000'], ['250', '2050', '2500', '25000'], 2),
         Q('1 l = ml කීයද?', '1 l = how many ml?', ['100', '500', '1000', '10000'], ['100', '500', '1000', '10000'], 2)] },
  { id: 5, t: ['හැඩතල සහ පරිමිතිය', 'Shapes and perimeter'], ic: '🔷',
    pts: [['පරිමිතිය = හැඩයේ වටේ මුළු දිග.', 'Perimeter = the whole length round a shape.'], ['සමචතුරස්‍රය: පැත්තක දිග x 4.', 'A square: one side x 4.'], ['සෘජුකෝණාස්‍රය: (දිග + පළල) x 2.', 'A rectangle: (length + width) x 2.']],
    qs: [Q('සමචතුරස්‍රයක පැත්තක් 6 cm. පරිමිතිය?', 'A square has 6 cm sides. Its perimeter?', ['12 cm', '18 cm', '24 cm', '36 cm'], ['12 cm', '18 cm', '24 cm', '36 cm'], 2),
         Q('ත්‍රිකෝණයක කොන් කීයද?', 'How many corners does a triangle have?', ['2', '3', '4', '5'], ['2', '3', '4', '5'], 1),
         Q('දිග 5 cm, පළල 3 cm සෘජුකෝණාස්‍රයක පරිමිතිය?', 'A rectangle 5 cm long and 3 cm wide. Its perimeter?', ['8 cm', '15 cm', '16 cm', '30 cm'], ['8 cm', '15 cm', '16 cm', '30 cm'], 2)] },
  { id: 6, t: ['සමාන පද', 'Words that mean the same'], ic: '📖',
    pts: [['සමාන පද = එකම අර්ථය තියෙන වචන.', 'Synonyms = words with the same meaning.'], ['ජලය = වතුර, සූර්යයා = ඉර.', 'big = large, quick = fast.'], ['වාක්‍යයක් ලියන්න වෙනස් වචන පාවිච්චි කරන්න.', 'Use different words to make your writing richer.']],
    qs: [Q("'ජලය' යන්නට සමාන පදය", "A word that means 'big'", ['ගින්දර', 'වතුර', 'පොළොව', 'සුළඟ'], ['small', 'large', 'thin', 'short'], 1),
         Q("'සූර්යයා' යන්නට සමාන පදය", "A word that means 'quick'", ['සඳ', 'තරුව', 'ඉර', 'වලාකුළ'], ['slow', 'late', 'fast', 'soft'], 2),
         Q("'නිවස' යන්නට සමාන පදය", "A word that means 'happy'", ['පාසල', 'ගෙදර', 'කඩය', 'පාර'], ['sad', 'glad', 'angry', 'tired'], 1)] },
  { id: 7, t: ['විරුද්ධ පද', 'Opposites'], ic: '↔️',
    pts: [['විරුද්ධ පද = අර්ථය අනිත් පැත්ත වෙන වචන.', 'Opposites = words with the opposite meaning.'], ['උස x මිටි, රස්නය x සීතල.', 'tall x short, hot x cold.'], ['ඉදිරිය x පිටුපස, උඩ x යට.', 'front x back, up x down.']],
    qs: [Q("'උස' යන්නට විරුද්ධ පදය", "The opposite of 'tall'", ['මිටි', 'දිග', 'පළල', 'උඩ'], ['short', 'long', 'wide', 'high'], 0),
         Q("'රස්නය' යන්නට විරුද්ධ පදය", "The opposite of 'hot'", ['උණුසුම', 'සීතල', 'වියළි', 'තෙත්'], ['warm', 'cold', 'dry', 'wet'], 1),
         Q("'ඉදිරිය' යන්නට විරුද්ධ පදය", "The opposite of 'front'", ['පැත්ත', 'උඩ', 'පිටුපස', 'මැද'], ['side', 'top', 'back', 'middle'], 2)] },
  { id: 8, t: ['තර්කනය', 'Reasoning'], ic: '🧩',
    pts: [['අකුරු රටා: අකුරු අතර පනින ගණන බලන්න.', 'Letter patterns: count the letters skipped.'], ['සම්බන්ධතා: පළමු යුගලේ සම්බන්ධය දෙවැන්නටත් යොදන්න.', 'Relations: use the first pair\'s link on the second.'], ['දින: සතියේ දින 7 පිළිවෙළට මතක තියාගන්න.', 'Days: remember the 7 days in order.']],
    qs: [Q('A, C, E, G, ___', 'A, C, E, G, ___', ['H', 'I', 'J', 'K'], ['H', 'I', 'J', 'K'], 1),
         Q('බල්ලා : බලු පැටියා = බළලා : ___', 'dog : puppy = cat : ___', ['පූස් පැටියා', 'වසු පැටියා', 'කුකුළු පැටියා', 'එළු පැටියා'], ['kitten', 'calf', 'chick', 'kid'], 0),
         Q('අද බදාදා නම් අනිද්දා කුමන දිනයද?', 'Today is Wednesday. What is the day after tomorrow?', ['බ්‍රහස්පතින්දා', 'සිකුරාදා', 'සෙනසුරාදා', 'සඳුදා'], ['Thursday', 'Friday', 'Saturday', 'Monday'], 1)] },
];

export const PAPER = { id: 'mp07', t: ['ශිෂ්‍යත්ව Model Paper 07', 'Scholarship Model Paper 07'], mins: 10, qs: [
  Q('2, 5, 8, 11, ___ ඊළඟ සංඛ්‍යාව?', '2, 5, 8, 11, ___ the next number?', ['12', '13', '14', '15'], ['12', '13', '14', '15'], 2),
  Q('3/4 ට සමාන භාගය කුමක්ද?', 'Which fraction equals 3/4?', ['6/8', '3/8', '4/6', '2/4'], ['6/8', '3/8', '4/6', '2/4'], 0),
  Q('පැය 2 විනාඩි 15 = විනාඩි කීයද?', '2 hours 15 minutes = how many minutes?', ['115', '125', '135', '215'], ['115', '125', '135', '215'], 2),
  Q("'ලස්සන' යන්නට සමාන පදය", "A word that means 'pretty'", ['සුන්දර', 'කැත', 'විශාල', 'ඉක්මන්'], ['beautiful', 'ugly', 'huge', 'quick'], 0),
  Q("'උස' යන්නට විරුද්ධ පදය", "The opposite of 'tall'", ['මිටි', 'දිග', 'පළල', 'උඩ'], ['short', 'long', 'wide', 'up'], 0),
  Q('සමචතුරස්‍රයක පැත්තක් 5 cm නම් පරිමිතිය?', 'A square has 5 cm sides. Its perimeter?', ['10 cm', '15 cm', '20 cm', '25 cm'], ['10 cm', '15 cm', '20 cm', '25 cm'], 2),
  Q('රු. 500ක් අරන් ගිහින් රු. 175ක පොතක් ගත්තොත් ඉතිරිය?', 'You take Rs. 500 and buy a Rs. 175 book. What is left?', ['රු. 325', 'රු. 335', 'රු. 375', 'රු. 425'], ['Rs. 325', 'Rs. 335', 'Rs. 375', 'Rs. 425'], 0),
  Q('1 kg = ග්‍රෑම් කීයද?', '1 kg = how many grams?', ['10', '100', '1000', '10000'], ['10', '100', '1000', '10000'], 2),
  Q('15:30 = ?', '15:30 = ?', ['ප.ව. 3.30', 'පෙ.ව. 3.30', 'ප.ව. 5.30', 'ප.ව. 1.30'], ['3.30 p.m.', '3.30 a.m.', '5.30 p.m.', '1.30 p.m.'], 0),
  Q('A, C, E, G, ___', 'A, C, E, G, ___', ['H', 'I', 'J', 'K'], ['H', 'I', 'J', 'K'], 1)] };
export const PAPERS_OLD = [{ t: ['Model Paper 06', 'Model Paper 06'], score: '34 / 40', rank: 6 }, { t: ['Model Paper 05', 'Model Paper 05'], score: '31 / 40', rank: 9 }];

export const VIDEOS = [
  { m: ['ඔක්තෝබර්', 'October'], paid: true, list: [[['සංඛ්‍යා රටා - 1 කොටස', 'Number patterns - part 1'], '42:10'], [['සමාන පද', 'Words that mean the same'], '35:20']] },
  { m: ['නොවැම්බර්', 'November'], paid: true, list: [[['භාග සරලව', 'Fractions made easy'], '48:05'], [['කාලය සහ ඔරලෝසුව', 'Time and the clock'], '39:40']] },
  { m: ['දෙසැම්බර්', 'December'], paid: false, list: [[['මිනුම්', 'Measurements'], '44:30'], [['Model Paper 07 සාකච්ඡාව', 'Model Paper 07 discussion'], '58:15']] }];

export const NOTICES = [
  [['සෙනසුරාදා පන්තිය පෙ.ව. 8.00 ට', 'Saturday class at 8.00 a.m.'], ['මේ සතියේ සිට පන්තිය පැය භාගයක් කලින් පටන් ගන්නවා.', 'From this week the class starts half an hour earlier.']],
  [['Model Paper සම්මන්ත්‍රණය', 'Model paper seminar'], ['දෙසැම්බර් 14 - සියලුම සිසුන්ට. පෑන් දෙකක් අරගෙන එන්න.', 'December 14 - for every student. Bring two pens.']],
  [['සතියේ ජයග්‍රාහකයා', 'Star of the week'], ['වැඩිම XP ගත්ත සිසුවාට ගුරුතුමියගෙන් තෑග්ගක්!', 'A gift from Miss for the student with the most XP!']]];

export const LEADERS = [['කවිඳු', 'Kavindu', 1480], ['නෙත්මි', 'Nethmi', 1325], ['සහන්', 'Sahan', 1190], ['දිනිති', 'Dinithi', 960], ['ඔෂධි', 'Oshadhi', 880], ['රවිඳු', 'Ravindu', 760], ['තෙනුලි', 'Thenuli', 590], ['අකිල', 'Akila', 470], ['හිරුනි', 'Hiruni', 380]];

export const QUESTS = [
  { id: 'talk', t: ['ගුරුතුමියට කතා කරන්න', 'Talk to Miss'], xp: 10, coins: 0 },
  { id: 'lesson', t: ['පාඩමක් ඉවර කරන්න', 'Finish a lesson'], xp: 50, coins: 10 },
  { id: 'paper', t: ['Model Paper එකක් කරන්න', 'Do a model paper'], xp: 80, coins: 20 },
  { id: 'game', t: ['Game එකක් ගහන්න', 'Play a game'], xp: 30, coins: 20 }];

// the shop: [id, slot, value, price, si, en]
export const SHOP = [
  ['s-blue', 'shirt', '#2f7fd8', 0, 'නිල් shirt', 'Blue shirt'], ['s-pink', 'shirt', '#e0407e', 40, 'රෝස shirt', 'Pink shirt'], ['s-green', 'shirt', '#22a35a', 40, 'කොළ shirt', 'Green shirt'],
  ['s-purple', 'shirt', '#7a5cff', 60, 'දම් shirt', 'Purple shirt'], ['s-orange', 'shirt', '#f08a24', 60, 'තැඹිලි shirt', 'Orange shirt'], ['s-white', 'shirt', '#f4f1ea', 80, 'පාසල් සුදු', 'School white'],
  ['h-black', 'hair', '#2b1d1a', 0, 'කළු කොණ්ඩය', 'Black hair'], ['h-brown', 'hair', '#6b3e22', 30, 'දුඹුරු කොණ්ඩය', 'Brown hair'], ['h-long', 'long', true, 50, 'දිග කොණ්ඩය', 'Long hair'], ['h-short', 'long', false, 0, 'කොට කොණ්ඩය', 'Short hair'],
  ['c-none', 'hat', null, 0, 'Cap නැතුව', 'No cap'], ['c-red', 'hat', '#e03b3b', 70, 'රතු cap', 'Red cap'], ['c-yellow', 'hat', '#ffb21e', 70, 'කහ cap', 'Yellow cap'], ['c-blue', 'hat', '#1f6fd1', 70, 'නිල් cap', 'Blue cap']];
