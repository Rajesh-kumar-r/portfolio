#!/usr/bin/env node
/**
 * gen-icons.mjs — regenerate the raster favicon set from public/favicon.svg.
 *
 * Standalone. NOT wired into `astro build` or CI — this keeps the build
 * deterministic and keeps `sharp` off the deploy/runtime path. Run it by hand
 * after editing favicon.svg:  npm run gen:icons
 *
 * Outputs (all committed to public/):
 *   - favicon-16.png        16x16
 *   - favicon-32.png        32x32
 *   - apple-touch-icon.png  180x180 (flattened on the brand bg for iOS)
 *   - favicon.ico           real ICO container wrapping the 16 + 32 PNGs
 *
 * Why a hand-rolled ICO: `sharp` has no ICO encoder and we refuse to add a new
 * npm dependency for this. The ICO file format is just a small directory header
 * followed by image payloads; Vista+ / every current browser accepts PNG-
 * compressed entries. So we render the PNGs with sharp and wrap them in a
 * minimal 2-entry ICONDIR ourselves. The result is a genuine multi-size .ico
 * (not a PNG with the wrong extension).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const pub = (p) => fileURLToPath(new URL(`../public/${p}`, import.meta.url));

const svg = await readFile(pub('favicon.svg'));

const png = (size, opts = {}) =>
  sharp(svg, { density: 384 }).resize(size, size, { fit: 'contain', ...opts }).png().toBuffer();

// Standalone PNGs
const png16 = await png(16);
const png32 = await png(32);
await writeFile(pub('favicon-16.png'), png16);
await writeFile(pub('favicon-32.png'), png32);

// apple-touch-icon: iOS ignores transparency, so flatten onto the brand bg.
await writeFile(
  pub('apple-touch-icon.png'),
  await sharp(svg, { density: 384 })
    .resize(180, 180, { fit: 'contain' })
    .flatten({ background: '#161826' })
    .png()
    .toBuffer(),
);

// Hand-rolled ICO: ICONDIR (6 bytes) + N * ICONDIRENTRY (16 bytes) + payloads.
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(images.length, 4); // image count

  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 => 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 => 256)
    e.writeUInt8(0, 2); // palette count
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8); // payload size
    e.writeUInt32LE(offset, 12); // payload offset
    entries.push(e);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

await writeFile(
  pub('favicon.ico'),
  buildIco([
    { size: 16, data: png16 },
    { size: 32, data: png32 },
  ]),
);

console.log('gen-icons: wrote favicon-16.png, favicon-32.png, apple-touch-icon.png, favicon.ico');
