/* Small helpers for paper data files (loaded before data.js). */
window.fr = (a, b) => `<span class="fr"><i>${a}</i><i>${b}</i></span>`;
window.mx = (w, a, b) => `${w}${fr(a, b)}`;
window.both = s => ({ en: s, si: s });
/* angle arc at (cx,cy) radius r from screen-angle a0 to a1 (degrees, y down, counter-clockwise on screen) */
window.arc = (cx, cy, r, a0, a1) => {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)].map(v => v.toFixed(1));
  const [x0, y0] = p(a0), [x1, y1] = p(a1), large = ((a1 - a0 + 360) % 360) > 180 ? 1 : 0;
  return `<path d="M${x0} ${y0} A${r} ${r} 0 ${large} 0 ${x1} ${y1}" fill="none" stroke="#141414" stroke-width="1"/>`;
};
window.SVG = (w, h, body) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
