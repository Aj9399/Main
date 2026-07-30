// Code 39 barcode — returns bar segments so React can render them as <i> bars.
// Code 39 needs no checksum and encodes A–Z, 0–9, and - . space $ / + %
const C39: Record<string, string> = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw',
  '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn',
  'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw', 'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnnn',
  'F': 'nnwnwwnnn', 'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn',
  'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww', 'O': 'wnnnwnnwn',
  'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn', 'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn',
  'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw', 'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn',
  'Z': 'nwwnwnnnn', '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '*': 'nwnnwnwnn',
};

export interface BarSeg {
  w: number;   // width in px
  on: boolean; // true = black bar, false = white space
}

export function code39(text: string, narrow = 1.6, ratio = 2.6): BarSeg[] {
  const clean = String(text).toUpperCase().replace(/[^0-9A-Z\- .]/g, '');
  const data = `*${clean}*`;
  const segs: BarSeg[] = [];
  for (const ch of data) {
    const pat = C39[ch];
    if (!pat) continue;
    for (let j = 0; j < 9; j++) {
      segs.push({ w: pat[j] === 'w' ? narrow * ratio : narrow, on: j % 2 === 0 });
    }
    segs.push({ w: narrow, on: false }); // inter-character gap
  }
  return segs;
}
