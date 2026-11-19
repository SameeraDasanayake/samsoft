/* Samsoft Decks — a live score on every quiz slide (right on the first try). Skips slides that already have their own score. */
(function () {
  document.querySelectorAll('.slide').forEach(s => {
    const qs = [...s.querySelectorAll('.mcq')]; if (!qs.length || s.querySelector('#score, .qscore')) return;
    const b = document.createElement('div'); b.className = 'qscore'; b.textContent = `0 / ${qs.length}`; s.appendChild(b);
    const tried = new Set(); let pts = 0;
    qs.forEach((q, qi) => [...q.querySelectorAll('li')].forEach(li => li.addEventListener('click', () => setTimeout(() => {
      if (tried.has(qi)) return;
      if (li.classList.contains('right')) { tried.add(qi); pts++; } else if (li.classList.contains('wrong')) tried.add(qi); else return;
      b.textContent = `${pts} / ${qs.length}`; b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    }, 0))));
  });
})();
