// Process real Rosa Charmosa photos:
// - 3 dress photos (rotated across detail angles)
// - 1 brand avatar (tulip on marsala) → favicon pack

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = '/Users/jean/Documents/Projects/Rosa Charmosa';
const OUT = join(__dirname, '..', 'public', 'img', 'vestidos');
await mkdir(OUT, { recursive: true });

const dresses = [
  // Azul Royal — 2 ângulos
  { file: 'snapgram.io_download-file-gqppis10.jpg', out: 'real-azul-royal-01' },
  { file: '914587521_18577101997078684_8915113253771450889_n.jpg', out: 'real-azul-royal-02' },
  // Serenity Floral — 3 ângulos (frente, costas, detalhe)
  { file: 'snapgram.io_download-file-htxp5rhw.jpg', out: 'real-serenity-01-frente' },
  { file: '926458098_18578053372078684_2954643094691562686_n.jpg', out: 'real-serenity-02-costas' },
  { file: '931780451_18578053333078684_5796471669326657895_n.jpg', out: 'real-serenity-03-detalhe' },
  // Champagne — 2 ângulos
  { file: 'snapgram.io_download-file-g0lee3fy.jpg', out: 'real-champagne-01' },
  { file: '926734231_18578259034078684_1874844038313205224_n.jpg', out: 'real-champagne-02' },
];

// Primary photo at 900px (detail), 600px (card)
for (const d of dresses) {
  const src = join(SRC_DIR, d.file);
  await sharp(src).resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(join(OUT, `${d.out}-900.webp`));
  await sharp(src).resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(OUT, `${d.out}-600.webp`));
}

// Brand avatar → favicon pack
const AV = join(SRC_DIR, 'snapgram.io_ROSA-CHARMOSA-LOCAÇÃO-MODA-FESTA.jpg');
const FAV = join(__dirname, '..', 'public');

await sharp(AV).resize(32, 32, { fit: 'cover' }).png().toFile(join(FAV, 'favicon-32.png'));
await sharp(AV).resize(180, 180, { fit: 'cover' }).png().toFile(join(FAV, 'apple-touch-icon.png'));
await sharp(AV).resize(512, 512, { fit: 'cover' }).png().toFile(join(FAV, 'favicon-512.png'));

console.log('Processed 3 dress photos + favicon pack.');
