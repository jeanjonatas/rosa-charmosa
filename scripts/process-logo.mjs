import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = '/Users/jean/Downloads/5BC8D98E-78FA-4FB4-A5CF-D23C13E26AA3.PNG';
const OUT = join(__dirname, '..', 'public', 'logo');
await mkdir(OUT, { recursive: true });

// Keep original PNG as reference
await copyFile(SRC, join(OUT, 'rosa-charmosa.png'));

// Full logo WebP — wide crop, 800 width (for OG, large displays)
await sharp(SRC)
  .trim({ threshold: 10 })
  .resize({ width: 800, withoutEnlargement: true })
  .webp({ quality: 92 })
  .toFile(join(OUT, 'rosa-charmosa-800.webp'));

// Header logo — small width, high density for retina
await sharp(SRC)
  .trim({ threshold: 10 })
  .resize({ width: 560, withoutEnlargement: true })
  .webp({ quality: 92 })
  .toFile(join(OUT, 'rosa-charmosa-560.webp'));

// Horizontal variant — tulip + text side by side (crop tighter around text on mobile)
// Just the text (crop bottom 55% of image where ROSACHARMOSA is)
await sharp(SRC)
  .trim({ threshold: 10 })
  .metadata()
  .then(async (meta) => {
    const w = meta.width;
    const h = meta.height;
    // Text (ROSACHARMOSA + "vestidos de festa") starts around 60% from top
    await sharp(SRC)
      .trim({ threshold: 10 })
      .extract({ left: 0, top: Math.round(h * 0.58), width: w, height: Math.round(h * 0.42) })
      .resize({ width: 480 })
      .webp({ quality: 92 })
      .toFile(join(OUT, 'rosa-charmosa-text-480.webp'));

    // Tulip only (top 55% of image)
    await sharp(SRC)
      .trim({ threshold: 10 })
      .extract({ left: Math.round(w * 0.35), top: 0, width: Math.round(w * 0.3), height: Math.round(h * 0.6) })
      .resize({ width: 120 })
      .webp({ quality: 92 })
      .toFile(join(OUT, 'tulipa-120.webp'));
  });

console.log('Logo variants generated in', OUT);
