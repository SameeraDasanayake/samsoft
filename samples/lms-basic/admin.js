/* Samsoft sample LMS: the teacher (admin) side. Uses window.LMS from app.js. */
(function () {
  const { $, $$, L, toast, views } = LMS;
  const P = () => LMS.pk();

  /* ---------- sample students ---------- */
  const NM = [['සෙනුරි පෙරේරා', 'Senuri Perera'], ['ධනුෂ්ක සිල්වා', 'Dhanushka Silva'], ['නෙත්මි ඩයස්', 'Nethmi Dias'], ['කවිඳු ජයවර්ධන', 'Kavindu Jayawardena'],
    ['තරුෂි ප්‍රනාන්දු', 'Tharushi Fernando'], ['යසිරු බණ්ඩාර', 'Yasiru Bandara'], ['ඉමාෂා රත්නායක', 'Imasha Rathnayake'], ['සචින් කුමාර', 'Sachin Kumara'],
    ['දිල්මි හේරත්', 'Dilmi Herath'], ['රවීන් අල්විස්', 'Raveen Alwis'], ['සඳලි වික්‍රමසිංහ', 'Sandali Wickramasinghe'], ['පසිඳු ගුණසේකර', 'Pasindu Gunasekara'],
    ['හිරුණි කරුණාරත්න', 'Hiruni Karunarathne'], ['ඕෂද මධුෂාන්', 'Oshada Madushan']];
  const CL = ['11 · Theory', '11 · Paper', '10 · Theory', 'A/L 2027'];
  const COL = ['#f472b6,#a855f7', '#38bdf8,#6366f1', '#34d399,#0ea5e9', '#fbbf24,#f97316', '#a78bfa,#ec4899', '#22d3ee,#3b82f6'];
  const ST = LMS.STUDENTS = NM.map((n, i) => ({ n, id: 'KJ-2027-' + String(148 - i * 7).padStart(4, '0'), c: CL[i % 4], ph: '07X XXX ' + String(1000 + i * 731).slice(-4),
    paid: ![3, 6, 9, 12].includes(i), seen: ['2 min', '18 min', '1 h', '3 h', 'Today', 'Yesterday', '2 d'][i % 7], avg: [92, 88, 85, 61, 79, 73, 58, 81, 90, 67, 76, 70, 84, 55][i], pts: [1240, 1610, 1475, 620, 990, 870, 410, 1100, 1330, 760, 940, 700, 1210, 380][i], col: COL[i % 6] }));
  const TOTAL = 148, BASEPAID = 112 - ST.filter(s => s.paid).length;
  const paidCount = () => BASEPAID + ST.filter(s => s.paid).length;
  const ini = s => s.n[0].slice(0, 1);
  const av = s => `<span class="av sm" style="background:linear-gradient(140deg,${s.col})">${ini(s)}</span>`;
  const money = n => 'Rs. ' + n.toLocaleString('en');

  function sideMoney() { const p = paidCount(); $('#sideMoney').textContent = money(p * 2200); $('#sideBar').style.width = (p / TOTAL * 100) + '%';
    $('#sidePaid').innerHTML = L(`${p} / ${TOTAL} ගෙවා ඇත`, `${p} / ${TOTAL} paid`); }
  sideMoney();
  const vh = (eb, si, en, right = '') => `<div class="vh"><div><p class="eyebrow">${eb}</p><h2>${L(si, en)}</h2></div>${right}</div>`;
  const remindBtn = s => P() >= 1 ? `<button class="mini wa" data-remind="${s.id}">💬 ${L('මතක් කරන්න', 'Remind')}</button>` : '';

  /* ================= DASHBOARD ================= */
  views['t-dash'] = el => {
    const p = paidCount(), un = ST.filter(s => !s.paid);
    const months = [['ජූලි', 'Jul', 238], ['අගෝ', 'Aug', 251], ['සැප්', 'Sep', 244], ['ඔක්', 'Oct', 262], ['නොවැ', 'Nov', 270], ['දෙසැ', 'Dec', p * 2.2]];
    const max = 330;
    el.innerHTML = `
    <div class="hello glass-dark t-hello"><div>
      <p class="eyebrow">Admin · Kasun ICT</p>
      <h2>${L('සුභ උදෑසනක්, කසුන් සර්!', 'Good morning, Kasun Sir!')}</h2>
      <p>${L(`මේ මාසයේ සිසුන් <b>${TOTAL - p}</b> දෙනෙකුගේ ගාස්තු තවම ලැබිලා නැහැ. අද පන්ති <b>1</b>යි.`, `<b>${TOTAL - p}</b> students have not paid this month yet. You have <b>1</b> class today.`)}</p>
      <div class="row-btns"><button class="btn lime" data-v="t-upload">⇪ ${L('Recording එකක් දාන්න', 'Add a recording')}</button><button class="btn ghost-l" data-v="t-news">✦ ${L('දැන්වීමක් දාන්න', 'Post a notice')}</button><button class="btn ghost-l pk-med" data-v="t-papers">✎ ${L('අලුත් paper එකක්', 'New paper')}</button></div>
    </div><div class="donut" style="--v:${p / TOTAL * 100}"><div><b>${Math.round(p / TOTAL * 100)}%</b><small>${L('ගාස්තු ලැබී ඇත', 'fees in')}</small></div></div></div>

    <div class="stats">
      <div class="stat glass"><i>👥</i><b data-c="${TOTAL}">0</b><small>${L('සිසුන්', 'students')}</small></div>
      <div class="stat glass"><i>₨</i><b data-c="${p * 2200}" data-money>0</b><small>${L('මේ මාසයේ ලැබීම්', 'this month')}</small></div>
      <div class="stat glass"><i>▶</i><b data-c="1384">0</b><small>${L('මේ සතියේ video බැලීම්', 'video views this week')}</small></div>
      ${P() >= 1 ? `<div class="stat glass"><i>✎</i><b data-c="71" data-suf="%">0</b><small>${L('Paper 08 සාමාන්‍යය', 'paper 08 average')}</small></div>`
        : `<div class="stat glass"><i>＋</i><b data-c="9">0</b><small>${L('මේ මාසයේ අලුත් සිසුන්', 'new this month')}</small></div>`}
    </div>

    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>${L('මාසික ගාස්තු ලැබීම් (රු. 000)', 'Monthly fees (Rs. 000)')}</h3><a data-v="t-fees">${L('ගාස්තු', 'Fees')} →</a></div>
        <div class="bars6">${months.map(([si, en, v], i) => `<div><b>${Math.round(v)}</b><i style="--h:${v / max * 100}%" class="${i === 5 ? 'now' : ''}"></i><small>${L(si, en)}</small></div>`).join('')}</div></div>
      <div class="panel glass"><div class="ph"><h3>${L('ගාස්තු ගෙවීමට ඇති අය', 'Still to pay')}</h3><a data-v="t-fees">${L('සියල්ල', 'All')} →</a></div>
        <div class="ulist">${un.map(s => `<div class="urow" data-row="${s.id}">${av(s)}<span><b>${L(s.n[0], s.n[1])}</b><small>${s.c}</small></span>${remindBtn(s)}<button class="mini ok" data-pay="${s.id}">✓ ${L('ගෙවූ', 'Paid')}</button></div>`).join('') || `<p class="empty">${L('🎉 හැමෝම ගෙවලා!', '🎉 Everyone has paid!')}</p>`}</div></div>
    </div>

    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>${L('අලුත්ම ක්‍රියාකාරකම්', 'Latest activity')}</h3></div>
        <div class="feed">${[
          ['▶', 'සෙනුරි "ජාල සහ අන්තර්ජාලය" recording එක බැලුවා', 'Senuri watched "Networks and the Internet"', '2 min', 0],
          ['✎', 'ධනුෂ්ක Paper 09 කළා · 92%', 'Dhanushka did paper 09 · 92%', '9 min', 1],
          ['🎮', 'නෙත්මි Quiz Challenge එකේ ⭐⭐⭐ ගත්තා', 'Nethmi got ⭐⭐⭐ in Quiz Challenge', '14 min', 2],
          ['⎙', 'කවිඳු IP ලිපින tute එක download කළා', 'Kavindu downloaded the IP addresses tute', '22 min', 0],
          ['⌨', 'තරුෂි typing 38 WPM සහතිකය ගත්තා', 'Tharushi earned the 38 WPM typing certificate', '1 h', 2],
          ['＋', 'අලුත් සිසුවෙක්: ඕෂද මධුෂාන් (11 · Theory)', 'New student: Oshada Madushan (11 · Theory)', '3 h', 0]
        ].filter(f => f[4] <= P()).map(([i, si, en, t]) => `<div class="fd"><i>${i}</i><span>${L(si, en)}</span><small>${t}</small></div>`).join('')}</div></div>
      <div class="panel glass">${P() >= 1 ? `<div class="ph"><h3>${L('Paper 08 · ඉහළම සිසුන්', 'Paper 08 · top students')}</h3><a data-v="t-papers">${L('ප්‍රතිඵල', 'Results')} →</a></div>
        <div class="podium">${[ST[1], ST[0], ST[8]].map((s, i) => `<div class="pd p${i}">${av(s)}<b>${L(s.n[0].split(' ')[0], s.n[1].split(' ')[0])}</b><span>${[96, 98, 94][i]}%</span><i>${[2, 1, 3][i]}</i></div>`).join('')}</div>`
        : `<div class="ph"><h3>${L('ඉක්මන් ක්‍රියා', 'Quick actions')}</h3></div>
        <div class="qa"><button data-v="t-students"><i>👥</i>${L('සිසුවෙක් එකතු කරන්න', 'Add a student')}</button><button data-v="t-upload"><i>⇪</i>${L('PDF upload කරන්න', 'Upload a PDF')}</button><button data-v="t-fees"><i>₨</i>${L('ගාස්තු සලකුණු කරන්න', 'Mark fees')}</button><button data-v="t-news"><i>✦</i>${L('දැන්වීමක්', 'A notice')}</button></div>
        <p class="upsell">${L('<b>Medium</b> පැකේජයෙන්: Online papers, ස්වයංක්‍රීය ලකුණු, ස්ථාන සහ WhatsApp ගාස්තු මතක් කිරීම්.', '<b>Medium</b> adds online papers, automatic marks, ranks and WhatsApp fee reminders.')}</p>`}</div>
    </div>`;
    el.querySelectorAll('[data-c]').forEach(b => { const to = +b.dataset.c, isM = 'money' in b.dataset, t0 = performance.now();
      const f = n => { const k = Math.min(1, (n - t0) / 900), v = Math.round(to * (1 - (1 - k) ** 3)); b.textContent = isM ? money(v) : v.toLocaleString('en') + (b.dataset.suf || ''); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); });
    requestAnimationFrame(() => el.querySelector('.bars6').classList.add('go'));
  };

  /* fee actions anywhere in the admin side */
  document.addEventListener('click', e => {
    const p = e.target.closest('[data-pay]'); if (p) { const s = ST.find(x => x.id === p.dataset.pay); s.paid = true; sideMoney();
      toast(L(`✓ ${s.n[0]} ගෙවූ ලෙස සලකුණු කළා. ජනවාරි recordings දැන් විවෘතයි.`, `✓ ${s.n[1]} marked as paid. January recordings are now open.`));
      const row = p.closest('[data-row]'); if (row && row.classList.contains('urow')) { row.classList.add('gone'); setTimeout(() => LMS.show(LMS.cur || 't-dash'), 350); } else rerender(); return; }
    const r = e.target.closest('[data-remind]'); if (r) { r.classList.add('sent'); r.innerHTML = '✓ ' + L('යැව්වා', 'Sent'); toast(L('💬 WhatsApp මතක් කිරීම යැව්වා.', '💬 WhatsApp reminder sent.')); }
    const t = e.target.closest('[data-toggle]'); if (t) { const s = ST.find(x => x.id === t.dataset.toggle); s.paid = !s.paid; t.classList.toggle('on', s.paid); sideMoney();
      toast(s.paid ? L(`✓ ${s.n[0]}: ගෙවා ඇත`, `✓ ${s.n[1]}: paid`) : L(`${s.n[0]}: ගෙවීමට ඇත`, `${s.n[1]}: due`)); }
  });
  const rerender = () => { const v = $('.view.on'); if (v) LMS.show(v.id.slice(2)); };

  /* ================= STUDENTS ================= */
  let sF = 'all', sQ = '';
  views['t-students'] = el => {
    const list = ST.filter(s => (sF === 'all' || s.c === sF) && (!sQ || (s.n[0] + s.n[1] + s.id).toLowerCase().includes(sQ.toLowerCase())));
    el.innerHTML = vh(L('සිසුන්', 'Students'), 'සිසුන්', 'Students', `<button class="btn grad sm" id="addStu">＋ ${L('සිසුවෙක් එකතු කරන්න', 'Add a student')}</button>`) + `
    <div class="toolbar"><div class="tabs" id="sTabs">${['all', ...CL].map(c => `<button data-f="${c}" aria-pressed="${c === sF}">${c === 'all' ? L('සියල්ල', 'All') : c}</button>`).join('')}</div>
      <span class="muted">${L(`මුළු සිසුන් ${TOTAL} · මෙහි ආදර්ශ ${ST.length}ක්`, `${TOTAL} students · ${ST.length} shown as a sample`)}</span></div>
    <div class="tbl glass"><table><thead><tr><th>${L('සිසුවා', 'Student')}</th><th>${L('පන්තිය', 'Class')}</th><th>${L('දුරකථන', 'Phone')}</th>
      ${P() >= 1 ? `<th>${L('සාමාන්‍ය ලකුණු', 'Avg. mark')}</th>` : ''}${P() >= 2 ? `<th>🪙</th>` : ''}<th>${L('අවසන් වරට', 'Last seen')}</th><th>${L('ජනවාරි ගාස්තුව', 'January fee')}</th></tr></thead><tbody>
      ${list.map(s => `<tr><td><div class="who">${av(s)}<span><b>${L(s.n[0], s.n[1])}</b><small>${s.id}</small></span></div></td><td>${s.c}</td><td class="mono">${s.ph}</td>
        ${P() >= 1 ? `<td><span class="mk" style="--v:${s.avg}%">${s.avg}%</span></td>` : ''}${P() >= 2 ? `<td class="mono">${s.pts.toLocaleString('en')}</td>` : ''}
        <td class="muted">${s.seen}</td><td><button class="sw${s.paid ? ' on' : ''}" data-toggle="${s.id}" aria-label="paid"><i></i></button></td></tr>`).join('')}
      </tbody></table></div>`;
    el.querySelectorAll('#sTabs button').forEach(b => b.onclick = () => { sF = b.dataset.f; views['t-students'](el); });
    el.querySelector('#addStu').onclick = addStudent;
  };
  LMS.onSearch = (v, cur) => { if (cur === 't-students') { sQ = v; views['t-students']($('#v-t-students')); const i = $('#q'); i.focus(); } };
  function addStudent() {
    const sh = LMS.sheet(`<h3>${L('අලුත් සිසුවෙක්', 'New student')}</h3><p class="muted">${L('සිසු අංකය සහ මුරපදය ස්වයංක්‍රීයව හැදෙනවා.', 'The student ID and password are made automatically.')}</p>
      <form class="fm" id="stuF"><label>${L('නම', 'Name')}<input required name="n" value="${LMS.root.dataset.lang === 'si' ? 'අකිල දසනායක' : 'Akila Dissanayake'}"></label>
      <label>${L('පන්තිය', 'Class')}<select name="c">${CL.map(c => `<option>${c}</option>`).join('')}</select></label>
      <label>${L('දුරකථන (WhatsApp)', 'Phone (WhatsApp)')}<input name="p" value="07X XXX 2481"></label>
      <label class="chk"><input type="checkbox" checked name="paid"> ${L('ජනවාරි ගාස්තුව ගෙවා ඇත', 'January fee paid')}</label>
      <button class="btn grad">${L('එකතු කරන්න', 'Add')}</button></form>`);
    sh.querySelector('#stuF').onsubmit = e => { e.preventDefault(); const f = e.target; const nm = f.n.value.trim();
      const id = 'KJ-2027-' + String(149 + ST.length).padStart(4, '0');
      ST.unshift({ n: [nm, nm], id, c: f.c.value, ph: f.p.value, paid: f.paid.checked, seen: '—', avg: 0, pts: 0, col: COL[ST.length % 6] });
      LMS.closeSheet(); sideMoney(); views['t-students']($('#v-t-students'));
      toast(L(`✓ ${nm} එකතු කළා · ${id} · මුරපදය WhatsApp කළා`, `✓ ${nm} added · ${id} · password sent on WhatsApp`)); };
  }

  /* ================= FEES ================= */
  views['t-fees'] = el => {
    const p = paidCount(), un = ST.filter(s => !s.paid);
    el.innerHTML = vh(L('ගාස්තු', 'Fees'), 'ගාස්තු කළමනාකරණය', 'Fee management', P() >= 1 ? `<button class="btn grad sm" id="remAll">💬 ${L(`නොගෙවූ ${un.length} දෙනාටම මතක් කරන්න`, `Remind all ${un.length} unpaid`)}</button>` : '') + `
    <div class="fsum">
      <div class="panel glass fs-d"><div class="donut lg" style="--v:${p / TOTAL * 100}"><div><b>${Math.round(p / TOTAL * 100)}%</b><small>${L('ගෙවා ඇත', 'paid')}</small></div></div>
        <div><small>${L('ජනවාරි 2027', 'January 2027')}</small><b class="big">${money(p * 2200)}</b><span class="muted">${L(`ලැබිය යුතු තව ${money((TOTAL - p) * 2200)}`, `${money((TOTAL - p) * 2200)} still to come`)}</span></div></div>
      <div class="panel glass fs-n"><b>${p}</b><small>${L('ගෙවූ සිසුන්', 'paid')}</small></div>
      <div class="panel glass fs-n due"><b>${TOTAL - p}</b><small>${L('ගෙවීමට ඇති', 'due')}</small></div>
      <div class="panel glass fs-n"><b>Rs. 2,200</b><small>${L('11 ශ්‍රේණිය මාසික ගාස්තුව', 'Grade 11 monthly fee')}</small></div>
    </div>
    ${P() < 1 ? `<p class="upsell">${L('Basic පැකේජයේ ගාස්තු සලකුණු කළාම ඒ මාසයේ recordings ස්වයංක්‍රීයව විවෘත වෙනවා. <b>Medium</b> එකේ WhatsApp මතක් කිරීම් සහ මාසික වාර්තා.', 'In Basic, marking a fee opens that month\'s recordings automatically. <b>Medium</b> adds WhatsApp reminders and monthly reports.')}</p>` : ''}
    <div class="grid2 fees2">
      <div class="panel glass"><div class="ph"><h3>${L('ගෙවීමට ඇති', 'Due')} · ${un.length}</h3></div>
        <div class="ulist">${un.map(s => `<div class="urow" data-row="${s.id}">${av(s)}<span><b>${L(s.n[0], s.n[1])}</b><small>${s.c} · ${s.ph}</small></span>${remindBtn(s)}<button class="mini ok" data-pay="${s.id}">✓ ${L('ගෙවූ', 'Paid')}</button></div>`).join('') || `<p class="empty">${L('🎉 හැමෝම ගෙවලා!', '🎉 Everyone has paid!')}</p>`}</div></div>
      <div class="panel glass"><div class="ph"><h3>${L('අලුතින් ගෙවූ', 'Recently paid')}</h3></div>
        <div class="ulist">${ST.filter(s => s.paid).slice(0, 7).map((s, i) => `<div class="urow">${av(s)}<span><b>${L(s.n[0], s.n[1])}</b><small>${['Bank slip', 'Cash', 'Bank slip', 'Online', 'Cash', 'Bank slip', 'Cash'][i]} · ${i + 1} Jan</small></span><em class="paid">Rs. 2,200</em></div>`).join('')}</div></div>
    </div>`;
    const ra = el.querySelector('#remAll'); if (ra) ra.onclick = () => { el.querySelectorAll('[data-remind]').forEach(b => { b.classList.add('sent'); b.innerHTML = '✓ ' + L('යැව්වා', 'Sent'); }); ra.disabled = true;
      toast(L(`💬 ${un.length} දෙනෙකුට WhatsApp මතක් කිරීම් යැව්වා.`, `💬 WhatsApp reminders sent to ${un.length} students.`)); };
  };

  /* ================= UPLOAD ================= */
  views['t-upload'] = el => {
    el.innerHTML = vh(L('අන්තර්ගතය', 'Content'), 'Recordings සහ සටහන්', 'Recordings and notes') + `
    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>▶ ${L('අලුත් recording එකක්', 'New recording')}</h3></div>
        <form class="fm" id="recF">
          <label>${L('මාතෘකාව', 'Title')}<input name="t" required value="${LMS.root.dataset.lang === 'si' ? 'ජාල සහ අන්තර්ජාලය · 2 කොටස' : 'Networks and the Internet · Part 2'}"></label>
          <div class="two"><label>${L('පන්තිය', 'Class')}<select>${CL.map(c => `<option>${c}</option>`).join('')}</select></label>
          <label>${L('මාසය', 'Month')}<select name="m"><option value="jan">${LMS.root.dataset.lang === 'si' ? 'ජනවාරි 2027' : 'January 2027'}</option><option value="dec">${LMS.root.dataset.lang === 'si' ? 'දෙසැම්බර් 2026' : 'December 2026'}</option></select></label></div>
          <label>YouTube link (unlisted)<input name="y" value="https://youtu.be/xY7k2Lm9Qe4"></label>
          <p class="tip">🔒 ${L('ඒ මාසයේ ගාස්තු ගෙවූ සිසුන්ට පමණක් පේනවා. Video එක උඩ සිසුවාගේ නම පාවෙනවා.', 'Only students who paid for that month can see it. The student\'s name floats on the video.')}</p>
          <button class="btn grad">${L('Publish කරන්න', 'Publish')}</button></form></div>
      <div class="panel glass"><div class="ph"><h3>⎙ ${L('සටහන් / PDF upload', 'Upload notes / PDFs')}</h3></div>
        <button class="drop" id="drop"><i>⇪</i><b>${L('PDF, Word, Excel ගොනු මෙතනට දාන්න', 'Drop PDF, Word or Excel files here')}</b><small>${L('හෝ click කර තෝරන්න · උපරිම 50 MB', 'or click to choose · up to 50 MB')}</small></button>
        <div id="upl"></div></div>
    </div>
    <div class="panel glass"><div class="ph"><h3>${L('දැනට ඇති recordings', 'Recordings so far')}</h3><span class="muted">${LMS.REC.length}</span></div>
      <div class="rlist">${LMS.REC.map(r => `<div class="rl">${LMS.thumb(r)}<span><b>${L(r.t[0], r.t[1])}</b><small>${r.d} · ${r.len}</small></span><em class="muted mono">${[412, 388, 251, 190, 344, 301, 0, 0][LMS.REC.indexOf(r)] ?? 0} ${L('බැලීම්', 'views')}</em></div>`).join('')}</div></div>`;
    el.querySelector('#recF').onsubmit = e => { e.preventDefault(); const t = e.target.t.value;
      LMS.REC.unshift({ id: 'n' + Date.now(), t: [t, t], d: '2027-01-11', len: '1:05:00', k: 'theory', m: e.target.m.value === 'jan' ? 'dec' : 'dec', p: 0, c: ['#e11d48', '#7c3aed'] });
      toast(L('✓ Recording එක publish කළා. සිසුන්ට notification එකක් ගියා.', '✓ Recording published. Students were notified.')); views['t-upload'](el); };
    el.querySelector('#drop').onclick = () => {
      const nm = ['Network_Devices_Tute.pdf', 'Paper_09_Answers.pdf', 'Subnet_Practice.xlsx'][(el.querySelectorAll('.up').length) % 3];
      const d = document.createElement('div'); d.className = 'up'; d.innerHTML = `<span class="ft ${nm.endsWith('xlsx') ? 'x' : 'tute'}">${nm.split('.').pop().toUpperCase()}</span><span><b>${nm}</b><i class="upb"><b></b></i></span><em>0%</em>`;
      el.querySelector('#upl').prepend(d); let k = 0;
      const it = setInterval(() => { k = Math.min(100, k + 7 + Math.random() * 12); d.querySelector('.upb b').style.width = k + '%'; d.querySelector('em').textContent = Math.round(k) + '%';
        if (k >= 100) { clearInterval(it); d.querySelector('em').textContent = '✓'; d.classList.add('done');
          LMS.NOTES.unshift({ t: [nm, nm], k: nm.endsWith('xlsx') ? 'other' : 'tute', s: '1.2 MB', n: 6, d: '2027-01-11', x: nm.endsWith('xlsx') ? 'XLSX' : '' });
          toast(L('✓ Upload වුණා. සිසුන්ට දැන් download කරන්න පුළුවන්.', '✓ Uploaded. Students can download it now.')); } }, 120);
    };
  };

  /* ================= NOTICES ================= */
  views['t-news'] = el => {
    el.innerHTML = vh(L('දැන්වීම්', 'Notices'), 'දැන්වීම් පුවරුව', 'Notice board') + `
    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>✦ ${L('අලුත් දැන්වීමක්', 'New notice')}</h3></div>
        <form class="fm" id="nwF">
          <label>${L('මාතෘකාව', 'Title')}<input name="t" required value="${LMS.root.dataset.lang === 'si' ? 'ජනවාරි 18 අමතර පන්තියක්' : 'Extra class on 18 January'}"></label>
          <label>${L('පණිවිඩය', 'Message')}<textarea name="b" rows="4">${LMS.root.dataset.lang === 'si' ? 'සෙනසුරාදා ප.ව. 2.00 සිට 5.00 දක්වා Paper සාකච්ඡාවක්. සියලු දෙනා සහභාගී වන්න.' : 'Paper discussion on Saturday, 2.00 to 5.00 pm. Everyone please attend.'}</textarea></label>
          <div class="two"><label>${L('කාටද', 'To')}<select><option>${LMS.root.dataset.lang === 'si' ? 'සියලු පන්ති' : 'All classes'}</option>${CL.map(c => `<option>${c}</option>`).join('')}</select></label>
            <label class="chk pin"><input type="checkbox" name="pin"> 📌 ${L('උඩින්ම තියන්න', 'Pin to top')}</label></div>
          ${P() >= 1 ? `<label class="chk"><input type="checkbox" checked> 💬 ${L('WhatsApp group එකටත් යවන්න', 'Also send to the WhatsApp group')}</label>` : ''}
          <button class="btn grad">${L('පළ කරන්න', 'Post')}</button></form></div>
      <div class="panel glass"><div class="ph"><h3>${L('පළ කළ දැන්වීම්', 'Posted notices')}</h3></div>
        <div class="ulist">${LMS.NEWS.map((n, i) => `<div class="urow nrow"><time>${n.d}</time><span><b>${n.pin ? '📌 ' : ''}${L(n.t[0], n.t[1])}</b><small>${L(`සිසුන් ${[132, 118, 140, 126][i] || 0} දෙනෙක් කියෙව්වා`, `Read by ${[132, 118, 140, 126][i] || 0} students`)}</small></span><button class="mini" data-del="${i}">🗑</button></div>`).join('')}</div></div>
    </div>`;
    el.querySelector('#nwF').onsubmit = e => { e.preventDefault(); const f = e.target;
      LMS.NEWS.unshift({ unread: true, pin: f.pin.checked, d: 'Today', t: [f.t.value, f.t.value], b: [f.b.value, f.b.value] }); LMS.drawNews();
      toast(L('✓ දැන්වීම පළ කළා. සිසු පැත්තේ දැන් පේනවා.', '✓ Notice posted. It now shows on the student side.')); views['t-news'](el); };
    el.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { LMS.NEWS.splice(+b.dataset.del, 1); LMS.drawNews(); views['t-news'](el); });
  };

  /* ================= PAPERS (medium) ================= */
  const PAPERS = [{ n: 'Paper 09', t: ['ජාල සහ අන්තර්ජාලය', 'Networks and the Internet'], q: 10, att: 96, avg: 0, live: true },
    { n: 'Paper 08', t: ['IP ලිපින', 'IP addresses'], q: 10, att: 131, avg: 71 }, { n: 'Paper 07', t: ['දත්ත සන්නිවේදනය', 'Data communication'], q: 10, att: 138, avg: 76 },
    { n: 'Paper 06', t: ['Spreadsheets', 'Spreadsheets'], q: 10, att: 127, avg: 82 }];
  const QPC = [92, 88, 41, 79, 85, 63, 94, 37, 72, 81];
  let selP = 1;
  views['t-papers'] = el => {
    const p = PAPERS[selP], hard = QPC.indexOf(Math.min(...QPC));
    el.innerHTML = vh('Online papers', 'Papers සහ ප්‍රතිඵල', 'Papers and results', `<button class="btn grad sm" id="newP">＋ ${L('අලුත් paper එකක්', 'New paper')}</button>`) + `
    <div class="pcards">${PAPERS.map((x, i) => `<button class="pc glass${i === selP ? ' on' : ''}" data-sel="${i}">${x.live ? `<em class="live">LIVE</em>` : ''}<b>${x.n}</b><span>${L(x.t[0], x.t[1])}</span>
      <small>${x.att} ${L('දෙනා කළා', 'done')} · ${x.live ? L('අද රෑ 10 දක්වා', 'until 10 pm') : L('සාමාන්‍යය ', 'avg ') + x.avg + '%'}</small></button>`).join('')}</div>
    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>${p.n} · ${L('ප්‍රශ්නයෙන් ප්‍රශ්නයට නිවැරදි %', 'correct % per question')}</h3></div>
        <div class="qbars">${QPC.map((v, i) => `<div class="${i === hard ? 'hard' : ''}"><small>Q${i + 1}</small><i><b style="--w:${v}%"></b></i><span>${v}%</span></div>`).join('')}</div>
        <p class="tip">⚠ ${L(`Q${hard + 1} ට නිවැරදිව උත්තර දුන්නේ ${QPC[hard]}%යි. ඊළඟ පන්තියේ ඒ කොටස නැවත කරන්න.`, `Only ${QPC[hard]}% got Q${hard + 1} right. Go over it again next class.`)}</p></div>
      <div class="panel glass"><div class="ph"><h3>${L('ලකුණු බෙදීම', 'Mark spread')}</h3></div>
        <div class="dist">${[['0–39', 9], ['40–54', 17], ['55–64', 21], ['65–74', 32], ['75–84', 29], ['85–100', 23]].map(([r, n]) => `<div><i style="--h:${n / 32 * 100}%"></i><b>${n}</b><small>${r}</small></div>`).join('')}</div>
        <div class="ph" style="margin-top:18px"><h3>${L('ඉහළම 5', 'Top 5')}</h3></div>
        <div class="ulist">${[...ST].sort((a, b) => b.avg - a.avg).slice(0, 5).map((s, i) => `<div class="urow">${av(s)}<span><b>${i + 1}. ${L(s.n[0], s.n[1])}</b><small>${s.c}</small></span><em class="paid">${s.avg + 4}%</em></div>`).join('')}</div></div>
    </div>`;
    el.querySelectorAll('[data-sel]').forEach(b => b.onclick = () => { selP = +b.dataset.sel; views['t-papers'](el); });
    el.querySelector('#newP').onclick = newPaper;
  };
  function newPaper() {
    const qs = [];
    const sh = LMS.sheet(`<h3>${L('අලුත් MCQ paper එකක්', 'New MCQ paper')}</h3>
      <div class="two"><label class="fl">${L('නම', 'Name')}<input id="pN" value="Paper 10"></label><label class="fl">${L('කාලය (විනාඩි)', 'Time (minutes)')}<input id="pT" type="number" value="30"></label></div>
      <div class="qb"><label class="fl">${L('ප්‍රශ්නය', 'Question')}<input id="qT" value="${LMS.root.dataset.lang === 'si' ? 'ජාලයක දත්ත යවන උපාංගය කුමක්ද?' : 'Which device forwards data between networks?'}"></label>
        <div class="opts">${['Router', 'Switch', 'Hub', 'Modem'].map((o, i) => `<label><input type="radio" name="ok" ${i === 0 ? 'checked' : ''}><input class="ot" value="${o}"></label>`).join('')}</div>
        <button class="btn ghost-d" id="addQ">＋ ${L('ප්‍රශ්නය එකතු කරන්න', 'Add question')}</button></div>
      <div id="qList" class="qlist"></div>
      <button class="btn grad" id="pubP" disabled>${L('Publish කරන්න', 'Publish')}</button>`, true);
    sh.querySelector('#addQ').onclick = () => { qs.push(sh.querySelector('#qT').value);
      sh.querySelector('#qList').innerHTML = qs.map((q, i) => `<div><b>Q${i + 1}</b> ${q} <em>✓</em></div>`).join('');
      sh.querySelector('#pubP').disabled = false; sh.querySelector('#pubP').innerHTML = L(`ප්‍රශ්න ${qs.length}ක් publish කරන්න`, `Publish ${qs.length} question${qs.length > 1 ? 's' : ''}`); };
    sh.querySelector('#pubP').onclick = () => { PAPERS.unshift({ n: sh.querySelector('#pN').value, t: ['අලුත් paper එක', 'New paper'], q: qs.length, att: 0, avg: 0, live: true }); selP = 0;
      LMS.closeSheet(); views['t-papers']($('#v-t-papers')); toast(L('✓ Paper එක publish කළා. සිසුන්ට දැන් කරන්න පුළුවන්.', '✓ Paper published. Students can do it now.')); };
  }

  /* ================= GAMES & REWARDS (advanced) ================= */
  const RULES = [['ගාස්තු 10 වැනිදාට පෙර', 'Fee before the 10th', 30], ['Paper එකේ 80%+', 'Paper 80%+', 30], ['Game එකක ⭐⭐⭐', 'Game ⭐⭐⭐', 5], ['Typing පාඩමක්', 'A typing lesson', 3], ['දින 7 streak', '7-day streak', 20], ['යාළුවෙක් එක්කන් ආවාම', 'Bring a friend', 50]];
  views['t-games'] = el => {
    el.innerHTML = vh(L('Advanced', 'Advanced'), 'Games සහ ත්‍යාග', 'Games and rewards') + `
    <div class="stats">
      <div class="stat glass"><i>🎮</i><b>1,284</b><small>${L('මේ සතියේ games', 'games this week')}</small></div>
      <div class="stat glass"><i>⭐</i><b>2.4</b><small>${L('සාමාන්‍ය තරු', 'avg. stars')}</small></div>
      <div class="stat glass"><i>⌨</i><b>31 WPM</b><small>${L('සාමාන්‍ය typing වේගය', 'avg. typing speed')}</small></div>
      <div class="stat glass"><i>🔥</i><b>87%</b><small>${L('සතියේ active සිසුන්', 'active this week')}</small></div>
    </div>
    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>🏆 ${L('සතියේ leaderboard', 'Weekly leaderboard')}</h3><span class="muted">${L('සඳුදා අලුත් වෙනවා', 'resets on Monday')}</span></div>
        <div class="ulist">${[...ST].sort((a, b) => b.pts - a.pts).slice(0, 6).map((s, i) => `<div class="urow">${av(s)}<span><b>${['🥇', '🥈', '🥉'][i] || (i + 1) + '.'} ${L(s.n[0], s.n[1])}</b><small>${s.c}</small></span><em class="paid">🪙 ${s.pts.toLocaleString('en')}</em></div>`).join('')}</div></div>
      <div class="panel glass"><div class="ph"><h3>⚙ ${L('ත්‍යාග ලකුණු නීති', 'Points rules')}</h3></div>
        <div class="rules">${RULES.map(([si, en, v], i) => `<label><span>${L(si, en)}</span><input type="range" min="0" max="100" value="${v}" data-rule="${i}"><b>${v}</b></label>`).join('')}</div>
        <p class="tip">🎁 ${L('ලකුණු 500කට පොතක්, 1,000කට T-shirt එකක් වගේ ත්‍යාග ඔබම තීරණය කරන්න.', 'You choose the gifts, like a book for 500 points or a T-shirt for 1,000.')}</p></div>
    </div>
    <div class="panel glass"><div class="ph"><h3>${L('වැඩිපුරම සෙල්ලම් කරන games', 'Most played games')}</h3></div>
      <div class="qbars">${[['Quiz Challenge', 412], ['Match it', 301], ['Binary Builder', 266], ['Typing', 198], ['Python Lab', 107]].map(([g, n]) => `<div><small>${g}</small><i><b style="--w:${n / 412 * 100}%"></b></i><span>${n}</span></div>`).join('')}</div></div>`;
    el.querySelectorAll('[data-rule]').forEach(r => r.oninput = () => { r.nextElementSibling.textContent = r.value; RULES[+r.dataset.rule][2] = +r.value; });
  };

  /* ================= SETTINGS ================= */
  views['t-set'] = el => {
    const F = { basic: [['සිසු logins', 'Student logins'], ['Recordings (YouTube, මාසයෙන් lock)', 'Recordings (YouTube, locked by month)'], ['සටහන් / PDF', 'Notes / PDFs'], ['දැන්වීම්', 'Notices'], ['ගාස්තු සලකුණු කිරීම', 'Marking fees']],
      medium: [['Online MCQ papers', 'Online MCQ papers'], ['ස්වයංක්‍රීය ලකුණු සහ ස්ථාන', 'Automatic marks and ranks'], ['ප්‍රශ්නයෙන් ප්‍රශ්නයට විශ්ලේෂණය', 'Per-question analysis'], ['WhatsApp ගාස්තු මතක් කිරීම්', 'WhatsApp fee reminders'], ['QR කාඩ්: පැමිණීම සහ ගාස්තු scan', 'QR cards: scan attendance and fees']],
      advanced: [['Games Hub', 'Games Hub'], ['Typing පාඩම් සහ සහතික', 'Typing lessons and certificates'], ['Practical Lab (Python, HTML)', 'Practical Lab (Python, HTML)'], ['ත්‍යාග ලකුණු, badges, missions', 'Points, badges, missions'], ['සතියේ leaderboard', 'Weekly leaderboard']] };
    const order = ['basic', 'medium', 'advanced'];
    el.innerHTML = vh(L('සැකසුම්', 'Settings'), 'පන්තියේ සැකසුම්', 'Class settings') + `
    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>🎨 ${L('ඔබේ brand එක', 'Your brand')}</h3></div>
        <form class="fm" onsubmit="return false"><label>${L('පන්තියේ නම', 'Class name')}<input id="bn" value="Kasun ICT"></label>
        <label>${L('ප්‍රධාන පාට', 'Main colour')}<div class="sw-cols">${['#3b3fd8', '#0f766e', '#be123c', '#7c3aed', '#ea580c', '#0369a1'].map((c, i) => `<button type="button" style="background:${c}" data-col="${c}" class="${i === 0 ? 'on' : ''}"></button>`).join('')}</div></label>
        <p class="tip">${L('පාටක් තෝරලා බලන්න: මුළු LMS එකම ඒ පාටට මාරු වෙනවා.', 'Pick a colour: the whole LMS changes to it.')}</p></form></div>
      <div class="panel glass"><div class="ph"><h3>📦 ${L('ඔබේ පැකේජය', 'Your package')}: ${LMS.root.dataset.pkg[0].toUpperCase() + LMS.root.dataset.pkg.slice(1)}</h3></div>
        <div class="feat-l">${order.map((o, i) => F[o].map(f => `<div class="${i <= P() ? 'y' : 'n'}"><i>${i <= P() ? '✓' : '🔒'}</i>${L(f[0], f[1])}${i > 0 ? `<em class="tier t${i}">${i === 1 ? 'Medium' : 'Advanced'}</em>` : ''}</div>`).join('')).join('')}</div>
        <button class="btn ghost-d" data-act="logout">${L('ඉවත් වන්න', 'Log out')}</button></div>
    </div>`;
    el.querySelector('#bn').oninput = e => $$('.brand b').forEach(b => b.textContent = e.target.value || 'Kasun ICT');
    el.querySelectorAll('[data-col]').forEach(b => b.onclick = () => { el.querySelectorAll('[data-col]').forEach(x => x.classList.toggle('on', x === b));
      LMS.root.style.setProperty('--ind', b.dataset.col); LMS.root.style.setProperty('--ind2', b.dataset.col);
      LMS.root.style.setProperty('--grad', `linear-gradient(120deg, ${b.dataset.col}, ${b.dataset.col}cc 55%, #22c3ee)`); });
  };
  /* ================= QR CARDS + ATTENDANCE (Medium and up) ================= */
  // The QR holds only the student number; a reprint adds -2, -3... and the old card stops working.
  const QRRE = /^(KJ-\d{4}-\d{4})(?:-(\d+))?$/;
  const NOW = () => new Date().toTimeString().slice(0, 5);
  const TODAY = { c: '11 · Theory', si: 'ඉරිදා · පෙ.ව. 8.00', en: 'Sunday · 8.00 a.m.' };
  const ATT = {}; ST.filter(s => s.c === TODAY.c).slice(0, 3).forEach((s, i) => { ATT[s.id] = ['07:52', '07:55', '07:58'][i]; });
  const qcode = s => QRKit.code(s.id, s.ver || 1);
  const inClass = () => ST.filter(s => s.c === TODAY.c);
  let qMode = 'att', stopCam = null;
  const qrCard = s => `<div class="qcard"><div class="qc-top"><b>Kasun ICT</b><span>${L('සිසු කාඩ්පත', 'Student card')}</span></div>
    <div class="qc-mid"><div>${av(s)}<b>${L(s.n[0], s.n[1])}</b><small>${s.c}</small><code>${qcode(s)}</code></div>${QRKit.svg(qcode(s), { cls: 'qc-qr' })}</div></div>`;
  const qHead = () => vh('QR', 'QR කාඩ් සහ පැමිණීම', 'QR cards & attendance', `<div class="row-btns"><button class="btn grad sm" data-scan="att">📷 ${L('පැමිණීම scan කරන්න', 'Scan attendance')}</button><button class="btn ghost-d" data-scan="fee">₨ ${L('ගාස්තු scan කරන්න', 'Scan fees')}</button><button class="btn ghost-d" id="qPrint">🖨 ${L('කාඩ් print කරන්න', 'Print cards')}</button></div>`);

  views['t-qr'] = async el => {
    el.innerHTML = qHead() + `<p class="muted">…</p>`;
    try { await QRKit.load(); } catch (e) { el.querySelector('p.muted').innerHTML = L('QR library එක load වුණේ නැහැ. Internet එක බලන්න.', 'Could not load the QR library. Check the internet.'); return; }
    const here = inClass().filter(s => ATT[s.id]).sort((a, b) => (ATT[a.id] < ATT[b.id] ? -1 : 1)), away = inClass().filter(s => !ATT[s.id]);
    el.innerHTML = qHead() + `
    <div class="stats">
      <div class="stat glass"><i>✓</i><b>${here.length} / ${inClass().length}</b><small>${L('අද පන්තියට ආවා', 'in class today')}</small></div>
      <div class="stat glass"><i>⏰</i><b>${TODAY.c}</b><small>${L(TODAY.si, TODAY.en)}</small></div>
      <div class="stat glass"><i>₨</i><b>${ST.filter(s => s.paid).length} / ${ST.length}</b><small>${L('ජනවාරි ගාස්තු ගෙවා (ආදර්ශ සිසුන්)', 'paid for January (sample)')}</small></div>
      <div class="stat glass"><i>▦</i><b>${TOTAL}</b><small>${L('සිසු QR කාඩ්', 'student QR cards')}</small></div>
    </div>
    <div class="grid2">
      <div class="panel glass"><div class="ph"><h3>${L('අද පැමිණීම', 'Today')} · ${TODAY.c}</h3><span class="muted">${L(TODAY.si, TODAY.en)}</span></div>
        <div class="ulist">${here.map(s => `<div class="urow">${av(s)}<span><b>${L(s.n[0], s.n[1])}</b><small>${s.id}${s.paid ? '' : ` · <em class="due-t">${L('ජනවාරි ගාස්තුව නැහැ', 'January fee due')}</em>`}</small></span><em class="paid">✓ ${ATT[s.id]}</em><span></span></div>`).join('') || `<p class="muted">${L('තවම කවුරුත් scan කරලා නැහැ.', 'Nobody scanned yet.')}</p>`}</div>
        <h3 class="qh">${L('තවම නාපු අය', 'Not here yet')} · ${away.length}</h3>
        <div class="ulist">${away.map(s => `<div class="urow">${av(s)}<span><b>${L(s.n[0], s.n[1])}</b><small>${s.ph}</small></span><a class="mini wa" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(LMS.root.dataset.lang === 'si' ? `ආයුබෝවන්! ${s.n[0]} අද (${TODAY.si}) Kasun ICT පන්තියට ආවේ නැහැ. - කසුන් සර්` : `Hello! ${s.n[1]} did not come to Kasun ICT today (${TODAY.en}). - Kasun Sir`)}">💬 ${L('දෙමාපියන්ට', 'Parent')}</a><button class="mini" data-here="${s.id}">✓ ${L('ආවා', 'Here')}</button></div>`).join('') || `<p class="muted">🎉 ${L('හැමෝම ආවා!', 'Everyone is here!')}</p>`}</div></div>
      <div class="panel glass"><div class="ph"><h3>${L('සිසු QR කාඩ්', 'Student QR cards')}</h3></div>
        <p class="muted small" style="margin-top:0">${L('සිසුවෙක් එකතු කළාම කාඩ් එක ඉබේම හැදෙනවා. QR එකේ තියෙන්නේ සිසු අංකය. කාඩ් එක නැති වුණොත් Reprint කරන්න: පරණ කාඩ් එක ඉබේම වැඩ කරන්නේ නැති වෙනවා.', 'A card is made by itself when you add a student. The QR holds the student number. If a card is lost, reprint it: the old card stops working.')}</p>
        <div class="qgrid">${ST.slice(0, 4).map(s => `<div>${qrCard(s)}<button class="mini" data-re="${s.id}">↻ Reprint${(s.ver || 1) > 1 ? ' · v' + s.ver : ''}</button></div>`).join('')}</div>
        <p class="muted small">${L(`සිසුන් ${TOTAL}ටම කාඩ් · A4 එකකට 10ක් (ID card size) · print කරලා කපලා දෙන්න`, `Cards for all ${TOTAL} students · 10 per A4 page (ID-card size) · print, cut, hand out`)}</p></div>
    </div>`;
    el.querySelectorAll('[data-scan]').forEach(b => b.onclick = () => openScan(b.dataset.scan));
    el.querySelector('#qPrint').onclick = () => {
      const si = LMS.root.dataset.lang === 'si';
      const ok = QRKit.print(ST.map(s => ({ name: si ? s.n[0] : s.n[1], sub: s.c, code: qcode(s), initial: s.n[0].slice(0, 1) })),
        { brand: 'Kasun ICT', tagline: si ? 'සිසු කාඩ්පත' : 'Student card', title: 'Kasun ICT · QR cards', note: si ? 'පන්තියට එද්දී මේ කාඩ් එක පෙන්වන්න.' : 'Show this card when you come to class.' });
      if (!ok) toast(L('Popup එක block වුණා. Allow කරන්න.', 'The popup was blocked. Please allow it.'));
    };
    el.querySelectorAll('[data-re]').forEach(b => b.onclick = () => { const s = ST.find(x => x.id === b.dataset.re); s.ver = (s.ver || 1) + 1; views['t-qr'](el);
      toast(L(`↻ අලුත් කාඩ් එක: ${qcode(s)} · පරණ කාඩ් එක දැන් වැඩ කරන්නේ නැහැ`, `↻ New card: ${qcode(s)} · the old card no longer works`)); });
    el.querySelectorAll('[data-here]').forEach(b => b.onclick = () => { ATT[b.dataset.here] = NOW(); views['t-qr'](el); });
  };

  function openScan(mode) {
    qMode = mode;
    const old = ST[0], oldCode = (old.ver || 1) > 1 ? old.id : old.id + '-0'; // (demo: a card from before a reprint)
    const sh = LMS.sheet(`<h3>📷 ${L('QR scan කරන්න', 'Scan a QR')}</h3>
      <div class="tabs qtabs"><button data-m="att" aria-pressed="${mode === 'att'}">✓ ${L('පැමිණීම', 'Attendance')}</button><button data-m="fee" aria-pressed="${mode === 'fee'}">₨ ${L('ගාස්තු', 'Fees')}</button></div>
      <div class="qscan"><div class="qcam" id="qCam"><button class="btn grad sm" id="qStart">📷 ${L('Camera එක on කරන්න', 'Turn on the camera')}</button></div><div class="qres" id="qRes"></div></div>
      <p class="muted small">${L('Demo: ළඟ කාඩ් එකක් නැත්නම් පහළ කාඩ් එකක් ඔබන්න (scan කළා වගේ). කාඩ් print කරලා phone එකෙන් scan කරලත් බලන්න පුළුවන්.', 'Demo: no card at hand? Tap a card below (as if scanned). You can also print the cards and scan them with a phone.')}</p>
      <div class="qpick">${ST.slice(0, 6).map(s => `<button data-sim="${qcode(s)}" title="${qcode(s)}">${QRKit.svg(qcode(s), { cls: 'qc-qr' })}<small>${L(s.n[0].split(' ')[0], s.n[1].split(' ')[0])}</small></button>`).join('')}<button data-sim="${oldCode}" class="old" title="${oldCode}">${QRKit.svg(oldCode, { cls: 'qc-qr' })}<small>${L('පරණ කාඩ් එකක්', 'An old card')}</small></button></div>`, true);
    const hint = () => { sh.querySelector('#qRes').innerHTML = `<p class="muted">${qMode === 'att' ? L('<b>පැමිණීම:</b> scan කරන හැම කෙනාම "ආවා" ලෙස සලකුණු වෙනවා. ගාස්තු නොගෙවූ අය ගැනත් කියනවා.', '<b>Attendance:</b> everyone you scan is marked here. It also tells you who has not paid.') : L('<b>ගාස්තු:</b> scan කළාම නම, මාසය, මුදල පේනවා. මුදල ලැබුණාම "ගෙවූ" ඔබන්න.', '<b>Fees:</b> a scan shows the name, month and amount. Press "Paid" once you have the money.')}</p>`; };
    hint();
    sh.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { qMode = b.dataset.m; sh.querySelectorAll('[data-m]').forEach(x => x.setAttribute('aria-pressed', x === b)); hint(); });
    sh.querySelectorAll('[data-sim]').forEach(b => b.onclick = () => onScan(b.dataset.sim));
    sh.querySelector('#qStart').onclick = async () => { sh.querySelector('#qStart').disabled = true; stopCam = await QRKit.scan(sh.querySelector('#qCam'), onScan, () => { sh.querySelector('#qCam').innerHTML = `<p class="muted">${L('Camera එකක් නැහැ / අවසර නැහැ. පහළ demo කාඩ් පාවිච්චි කරන්න.', 'No camera or no permission. Use the demo cards below.')}</p>`; }); };
    LMS.onClose = () => { if (stopCam) stopCam(); stopCam = null; sideMoney(); views['t-qr']($('#v-t-qr')); };
  }

  function onScan(text) {
    const box = $('#qRes'); if (!box) return;
    const p = QRKit.parse(text, QRRE), s = p && ST.find(x => x.id === p.id);
    const bad = msg => { QRKit.beep(false); box.innerHTML = `<div class="qr-out bad"><i>✕</i><div><b>${msg}</b><small class="mono">${String(text).replace(/</g, '&lt;')}</small></div></div>`; };
    if (!s) return bad(L('මේ කාඩ් එක අපේ පන්තියේ නෙවෙයි', 'This card is not from our class'));
    if (p.ver !== (s.ver || 1)) return bad(L(`${s.n[0]} ගේ පරණ කාඩ් එකක්. අලුත් කාඩ් එක ඉල්ලන්න.`, `An old card of ${s.n[1]}. Ask for the new card.`));
    QRKit.beep(true);
    const big = av(s).replace('av sm', 'av big');
    if (qMode === 'att') {
      const again = !!ATT[s.id]; if (!again) ATT[s.id] = NOW();
      box.innerHTML = `<div class="qr-out ${again ? 'info' : 'ok'}">${big}<div><b>${L(s.n[0], s.n[1])}</b><small>${s.id} · ${s.c}</small>
        <p>${again ? L(`ℹ දැනටමත් ආවා · ${ATT[s.id]}`, `ℹ Already here · ${ATT[s.id]}`) : L(`✓ ආවා · ${ATT[s.id]}`, `✓ Here · ${ATT[s.id]}`)}</p>${s.paid ? '' : `<p class="due-t">⚠ ${L('ජනවාරි ගාස්තුව තවම නැහැ', 'January fee not paid yet')}</p>`}</div></div>`;
    } else {
      box.innerHTML = `<div class="qr-out ${s.paid ? 'info' : 'ok'}">${big}<div><b>${L(s.n[0], s.n[1])}</b><small>${s.id} · ${s.c}</small>
        <p>${L('ජනවාරි 2027', 'January 2027')} · <b>Rs. 2,200</b></p>${s.paid ? `<p>✓ ${L('දැනටමත් ගෙවලා', 'Already paid')}</p>` : `<button class="btn grad sm" id="qPay">✓ ${L('මුදල් ලැබුණා: ගෙවූ ලෙස සලකුණු කරන්න', 'Money received: mark as paid')}</button>`}</div></div>`;
      const b = box.querySelector('#qPay'); if (b) b.onclick = () => { s.paid = true; sideMoney(); onScan(text);
        toast(L(`✓ ${s.n[0]} ගෙවූ ලෙස සලකුණු කළා. ජනවාරි recordings විවෘත වුණා.`, `✓ ${s.n[1]} marked paid. The January recordings are open.`)); };
    }
  }
})();
