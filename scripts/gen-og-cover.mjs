// Generate a WhatsApp / Meta Ads / Social-compatible 1200x630 JPEG Open Graph cover
// using the real brand logo and real dress photography.

import sharp from 'sharp';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = join(__dirname, '..', 'public');

const W = 1200;
const H = 630;

// Editorial background SVG with subtle rose/gold wash, typography, and gold frame
const bgSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3F1A20"/>
      <stop offset="55%" stop-color="#53222B"/>
      <stop offset="100%" stop-color="#2E1217"/>
    </linearGradient>
    <radialGradient id="roseGlow" cx="0.22" cy="0.2" r="0.65">
      <stop offset="0%" stop-color="#E9A8B8" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="#E9A8B8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="goldGlow" cx="0.72" cy="0.85" r="0.6">
      <stop offset="0%" stop-color="#C9A961" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#C9A961" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#roseGlow)"/>
  <rect width="${W}" height="${H}" fill="url(#goldGlow)"/>
  <rect x="28" y="28" width="${W - 56}" height="${H - 56}" rx="18" fill="none" stroke="#C9A961" stroke-opacity="0.35" stroke-width="1.5"/>

  <line x1="76" y1="108" x2="112" y2="108" stroke="#C9A961" stroke-width="1.5"/>
  <text x="126" y="114" font-family="Helvetica, Arial, sans-serif" font-size="16" letter-spacing="4" fill="#E6D4A7">SETOR CAMPINAS · GOIÂNIA · DESDE 2013</text>

  <text x="76" y="458" font-family="Georgia, serif" font-size="31" font-style="italic" fill="#FBF7F4" opacity="0.94">
    Aluguel de vestidos de festa
  </text>
  <text x="76" y="498" font-family="Helvetica, Arial, sans-serif" font-size="19" letter-spacing="1.2" fill="#F4D4DC" opacity="0.88">
    Madrinhas · Formatura · Mãe dos Noivos · Debutantes
  </text>

  <rect x="76" y="528" width="270" height="44" rx="22" fill="#C9A961"/>
  <text x="211" y="556" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="600" letter-spacing="0.8" fill="#2A1A1E">
    Agende sua prova
  </text>
</svg>
`);

// Prepare dark-bg logo for left side
const logoBuf = await sharp(join(PUB, 'logo', 'rosa-charmosa-dark-560.webp'))
  .resize({ width: 470, withoutEnlargement: true })
  .png()
  .toBuffer();

// Prepare 2 real dress photos as rounded portrait frames on the right
async function roundedPhoto(file, width, height, radius = 16) {
  const mask = Buffer.from(
    `<svg width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/></svg>`
  );
  return sharp(file)
    .resize(width, height, { fit: 'cover', position: 'top' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

const photo1 = await roundedPhoto(join(PUB, 'img', 'vestidos', 'real-azul-royal-01-900.webp'), 250, 470, 18);
const photo2 = await roundedPhoto(join(PUB, 'img', 'vestidos', 'real-serenity-01-frente-900.webp'), 230, 430, 18);

await sharp(bgSvg)
  .composite([
    { input: logoBuf, left: 76, top: 150 },
    { input: photo1, left: 660, top: 80 },
    { input: photo2, left: 926, top: 118 },
  ])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(join(PUB, 'og-cover.jpg'));

console.log('Generated public/og-cover.jpg (1200x630)');
