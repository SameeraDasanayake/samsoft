/* Small helpers for tute data files (loaded before data.js). */
window.B = (en, si) => ({ en, si });                       // one text in both languages
window.fr = (a, b) => `<span class="fr"><i>${a}</i><i>${b}</i></span>`;
window.SVG = (w, vw, vh, body) => `<svg width="${w}mm" viewBox="0 0 ${vw} ${vh}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
// one SVG in both languages: f(lang-picker) -> svg string
window.SVG2 = f => ({ en: f(o => o.en ?? o), si: f(o => o.si ?? o) });
window.ARROW = (id, c = '#1c1d1f') => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker></defs>`;
