// Generate a "dark background" variant of the Rosa Charmosa logo.
// The official logo has burgundy pixels (CHARMOSA text) that become invisible
// on a burgundy background, so we remap burgundy → cream while keeping the
// rose pixels (tulip + ROSA + tagline) untouched.

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = '/Users/jean/Downloads/5BC8D98E-78FA-4FB4-A5CF-D23C13E26AA3.PNG';
const OUT = join(__dirname, '..', 'public', 'logo');
await mkdir(OUT, { recursive: true });

// Cream (target for burgundy pixels on dark bg)
const CREAM = { r: 0xFB, g: 0xF7, b: 0xF4 };
// Rose stays untouched (stays on dark bg nicely)

async function makeVariant(targetWidth, basename) {
  const img = sharp(SRC).trim({ threshold: 10 });
  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const buf = Buffer.from(data);
  for (let i = 0; i < buf.length; i += channels) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];
    const a = buf[i + 3];
    if (a < 10) continue;
    // Burgundy pixels: dark-red/wine. Loose range so anti-aliased edges flip too.
    // Rose pixels are much lighter (R > 200), so they are safe.
    if (r < 140 && g < 100 && b < 110 && r > g && r > b) {
      // Preserve alpha, replace color
      buf[i] = CREAM.r;
      buf[i + 1] = CREAM.g;
      buf[i + 2] = CREAM.b;
    }
  }

  await sharp(buf, { raw: { width, height, channels } })
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(join(OUT, `${basename}.webp`));
}

await makeVariant(800, 'rosa-charmosa-dark-800');
await makeVariant(560, 'rosa-charmosa-dark-560');
await makeVariant(360, 'rosa-charmosa-dark-360');
console.log('Dark-bg logo variants generated');
