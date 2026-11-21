// The student's own character: a 16 x 16 pixel kid drawn from a template (Kenney Tiny Town's look: a dark plum outline, flat colours),
// every colour slot changeable in the shop. Four facings (left = right mirrored), two walk frames + standing.
export const OUT = '#3b2733';
const T = {
  // . clear  o outline  s skin  h hair  e eye  t shirt  c collar/stripe  p pants  b shoes  k cap  K cap peak
  down: [
    '................',
    '.....oooooo.....',
    '....ohhhhhho....',
    '...ohhhhhhhho...',
    '...ohsssssshho..',
    '...osesssesso...',
    '...ossssssssso..',
    '....ossssssso...',
    '...oottcctttoo..',
    '..ottttttttttto.',
    '..ostttttttttso.',
    '..osotttttttoso.',
    '...oopppppppoo..',
    '....oppoopppo...',
    '....obbo.obbo...',
    '.....oo...oo....'],
  up: [
    '................',
    '.....oooooo.....',
    '....ohhhhhho....',
    '...ohhhhhhhho...',
    '...ohhhhhhhho...',
    '...ohhhhhhhho...',
    '...oshhhhhhso...',
    '....ossssssso...',
    '...oottttttttoo.',
    '..otttttttttttto',
    '..ostttttttttso.',
    '..osotttttttoso.',
    '...oopppppppoo..',
    '....oppoopppo...',
    '....obbo.obbo...',
    '.....oo...oo....'],
  side: [
    '................',
    '.....ooooo......',
    '....ohhhhhoo....',
    '...ohhhhhhhho...',
    '...ohhhsssssso..',
    '...ohhssssesso..',
    '...ohsssssssso..',
    '....osssssso....',
    '....oottttto....',
    '...ottttttto....',
    '...otttsstto....',
    '...ottosssto....',
    '....oppppppo....',
    '....oppopppo....',
    '....obbo.obbo...',
    '.....oo...oo....'],
};
// the walk: the legs (rows 13-15) of frame 1 / 2
const LEGS = {
  down: [['....oppo.oppo...', '...obbo...obbo..', '....oo.....oo...'], ['....oppoopppo...', '....obbo.obbo...', '.....oo...oo....']],
  up: [['....oppo.oppo...', '...obbo...obbo..', '....oo.....oo...'], ['....oppoopppo...', '....obbo.obbo...', '.....oo...oo....']],
  side: [['...oppo..oppo...', '..obbo....obbo..', '...oo......oo...'], ['....opppppo.....', '....obbbbo......', '.....oooo.......']],
};
const HAIR_LONG = { down: [[6, '..ohhssssssshho.'], [7, '..ohhsssssssho..'], [8, '..ohhttcctttho..']], up: [[6, '..ohhhhhhhhhho..'], [7, '..ohhhhhhhhhho..'], [8, '..ohhttttttthho.']], side: [[6, '..ohhssssssso...'], [7, '..ohhsssssso....'], [8, '..ohhottttto....']] };
const CAP = { down: [[1, '....kkkkkkk.....'], [2, '...kkkkkkkkk....'], [3, '..oKKKKKKKKKo...']], up: [[1, '....kkkkkkk.....'], [2, '...kkkkkkkkk....'], [3, '...kkkkkkkkko...']], side: [[1, '....kkkkkk......'], [2, '...kkkkkkkk.....'], [3, '...okkkkkKKKKo..']] };

export const LOOK0 = { skin: '#c98a5e', hair: '#2b1d1a', shirt: '#2f7fd8', collar: '#ffffff', pants: '#2b3a55', shoes: '#4a3428', hat: null, long: false };
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), r = Math.min(255, Math.round(((n >> 16) & 255) * k)), g = Math.min(255, Math.round(((n >> 8) & 255) * k)), b = Math.min(255, Math.round((n & 255) * k)); return `rgb(${r},${g},${b})`; };

// -> a canvas strip: 4 facings (down, left, right, up) x 3 frames (stand, walk1, walk2), 16 px cells
export function drawKid(look = LOOK0) {
  const L = { ...LOOK0, ...look }, c = document.createElement('canvas'); c.width = 48; c.height = 64; const g = c.getContext('2d');
  const col = { o: OUT, s: L.skin, h: L.hair, e: '#1d1418', t: L.shirt, c: L.collar, p: L.pants, b: L.shoes, k: L.hat, K: L.hat ? shade(L.hat, .72) : null };
  [['down', 0, false], ['side', 1, true], ['side', 2, false], ['up', 3, false]].forEach(([dir, row, flip]) => {
    for (let f = 0; f < 3; f++) {
      const rows = T[dir].slice(); if (f) { const l = LEGS[dir][f - 1]; rows[13] = l[0]; rows[14] = l[1]; rows[15] = l[2]; }
      if (L.long) HAIR_LONG[dir].forEach(([r, s]) => { rows[r] = s; });
      if (L.hat) CAP[dir].forEach(([r, s]) => { rows[r] = s; });
      rows.forEach((line, y) => { for (let x = 0; x < 16; x++) { const ch = line[x]; if (!ch || ch === '.' || !col[ch]) continue; g.fillStyle = col[ch];
        const px = flip ? 15 - x : x; g.fillRect(f * 16 + px, row * 16 + y + (f && dir !== 'side' ? 0 : 0), 1, 1); } });
    }
  });
  return c;
}
