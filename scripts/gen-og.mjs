// Generates public/og.png (1200x630) — the social-share card.
// Nocturne palette, rendered from an inline SVG via sharp. Run: `npm run gen:og`.
// (The og.dc.html artboard in the Claude Design project is the editable source;
//  this script is the deterministic no-browser fallback that matches it.)
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const W = 1200;
const H = 630;

// Nocturne tokens (dark)
const BG = '#161826';
const TEXT = '#e9e9ed';
const ACC = '#d2cefd';
const MUT = '#b2b6ca';
const LINE = '#5d5294';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g1" cx="10%" cy="-8%" r="80%">
      <stop offset="0%" stop-color="#9184d9" stop-opacity="0.20"/>
      <stop offset="70%" stop-color="#9184d9" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="104%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#9184d9" stop-opacity="0.10"/>
      <stop offset="70%" stop-color="#9184d9" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${LINE}"/>
      <stop offset="100%" stop-color="${LINE}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>

  <g font-family="Inter, 'Helvetica Neue', Arial, sans-serif">
    <text x="96" y="150" font-size="28" letter-spacing="6" fill="${ACC}"
      font-family="'JetBrains Mono', ui-monospace, monospace">~</text>
    <text x="140" y="150" font-size="17" letter-spacing="5" fill="${ACC}"
      style="text-transform:uppercase">Senior Frontend Engineer &#183; React &#183; Next.js &#183; Full-stack</text>

    <text x="94" y="300" font-size="82" font-weight="600" letter-spacing="8" fill="${TEXT}"
      style="text-transform:uppercase">RAJESH KUMAR R</text>

    <text x="96" y="372" font-size="33" fill="${MUT}">Seven years of shipping. The whole portfolio fits in one prompt.</text>

    <rect x="96" y="520" width="640" height="2" fill="url(#rule)"/>
    <text x="770" y="528" font-size="20" fill="${MUT}"
      font-family="'JetBrains Mono', ui-monospace, monospace">rajesh@portfolio $ <tspan fill="${ACC}">open rajesh.fyi</tspan></text>
  </g>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(new URL('../public/og.png', import.meta.url), png);

const meta = await sharp(png).metadata();
console.log(`public/og.png written — ${meta.width}x${meta.height}`);
