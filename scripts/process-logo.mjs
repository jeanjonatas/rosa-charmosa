import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'logo');
const SRC = join(OUT, 'rosa-charmosa.png');
await mkdir(OUT, { recursive: true });

// Read trimmed master logo to locate tulip vs text rows cleanly via alpha scan
const trimmed = sharp(SRC).trim({ threshold: 10 });
const { data, info } = await trimmed.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// Find horizontal blank band separating the tulip stem from the wordmark ("ROSA CHARMOSA")
const rowHasInk = new Array(height).fill(false);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * channels + 3] > 20) {
      rowHasInk[y] = true;
      break;
    }
  }
}

// Scan from middle downward to find the first full empty gap after the tulip
let gapStart = Math.round(height * 0.62);
let gapEnd = gapStart;
for (let y = Math.round(height * 0.45); y < Math.round(height * 0.8); y++) {
  if (!rowHasInk[y]) {
    gapStart = y;
    while (y < height && !rowHasInk[y]) y++;
    gapEnd = y;
    break;
  }
}

console.log(`Master trimmed: ${width}x${height}, tulip ends at y=${gapStart}, wordmark starts at y=${gapEnd}`);

// 1. Clean tulip mark (tight bounding box around tulip pixels via alpha scan)
let minX = width;
let maxX = 0;
let minY = gapStart;
let maxY = 0;
for (let y = 0; y < gapStart; y++) {
  for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * channels + 3] > 20) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const tulipRaw = await sharp(data, { raw: { width, height, channels } })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .png()
  .toBuffer();

await sharp(tulipRaw)
  .resize({ width: 120, withoutEnlargement: true })
  .webp({ quality: 92 })
  .toFile(join(OUT, 'tulipa-120.webp'));

await sharp(tulipRaw)
  .resize({ height: 160, withoutEnlargement: true })
  .webp({ quality: 95 })
  .toFile(join(OUT, 'tulipa-mark-160.webp'));

// 2. Clean wordmark (ROSA CHARMOSA + vestidos de festa) without any stem fragment
const wordmarkBuf = await sharp(data, { raw: { width, height, channels } })
  .extract({ left: 0, top: gapEnd, width, height: height - gapEnd })
  .trim({ threshold: 10 })
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

// Standard light-bg wordmark
await sharp(wordmarkBuf.data, { raw: wordmarkBuf.info })
  .resize({ width: 560, withoutEnlargement: true })
  .webp({ quality: 94 })
  .toFile(join(OUT, 'rosa-charmosa-text-480.webp'));

// Dark-bg wordmark: remap burgundy -> bright warm cream (#FBF7F4) and softly lift rose -> #F4B8C7
const darkWordmark = Buffer.from(wordmarkBuf.data);
const CREAM = { r: 0xfb, g: 0xf7, b: 0xf4 };
const ROSE_BRIGHT = { r: 0xf4, g: 0xb8, b: 0xc7 };

for (let i = 0; i < darkWordmark.length; i += wordmarkBuf.info.channels) {
  const r = darkWordmark[i];
  const g = darkWordmark[i + 1];
  const b = darkWordmark[i + 2];
  const a = darkWordmark[i + 3];
  if (a < 8) continue;

  if (r < 145 && g < 105 && b < 115 && r > g && r > b) {
    darkWordmark[i] = CREAM.r;
    darkWordmark[i + 1] = CREAM.g;
    darkWordmark[i + 2] = CREAM.b;
  } else if (r > 180) {
    darkWordmark[i] = ROSE_BRIGHT.r;
    darkWordmark[i + 1] = ROSE_BRIGHT.g;
    darkWordmark[i + 2] = ROSE_BRIGHT.b;
  }
}

await sharp(darkWordmark, { raw: wordmarkBuf.info })
  .resize({ width: 640, withoutEnlargement: true })
  .webp({ quality: 95 })
  .toFile(join(OUT, 'rosa-charmosa-wordmark-dark-640.webp'));

// 3. Also refresh dark full stacked logo for footer with crisp bright cream + rose
const darkFull = Buffer.from(data);
for (let i = 0; i < darkFull.length; i += channels) {
  const r = darkFull[i];
  const g = darkFull[i + 1];
  const b = darkFull[i + 2];
  const a = darkFull[i + 3];
  if (a < 8) continue;
  if (r < 145 && g < 105 && b < 115 && r > g && r > b) {
    darkFull[i] = CREAM.r;
    darkFull[i + 1] = CREAM.g;
    darkFull[i + 2] = CREAM.b;
  } else if (r > 180) {
    darkFull[i] = ROSE_BRIGHT.r;
    darkFull[i + 1] = ROSE_BRIGHT.g;
    darkFull[i + 2] = ROSE_BRIGHT.b;
  }
}

await sharp(darkFull, { raw: { width, height, channels } })
  .resize({ width: 360, withoutEnlargement: true })
  .webp({ quality: 94 })
  .toFile(join(OUT, 'rosa-charmosa-dark-360.webp'));

await sharp(darkFull, { raw: { width, height, channels } })
  .resize({ width: 560, withoutEnlargement: true })
  .webp({ quality: 94 })
  .toFile(join(OUT, 'rosa-charmosa-dark-560.webp'));

console.log('Clean header & footer logo variants generated in', OUT);
