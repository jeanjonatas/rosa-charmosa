import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'img', 'vestidos');

const pieces = [
  { id: 'ref-001', color: '#2F6F55', accent: '#1E4A37', name: 'Esmeralda' },
  { id: 'ref-002', color: '#D4425E', accent: '#962E42', name: 'Fúcsia Sereia' },
  { id: 'ref-003', color: '#1A1A1A', accent: '#2D2D2D', name: 'Noir' },
  { id: 'ref-004', color: '#C6D63A', accent: '#8E9C27', name: 'Verde Lima' },
  { id: 'ref-005', color: '#8F2F3A', accent: '#5F1D25', name: 'Marsala' },
  { id: 'ref-006', color: '#C9A961', accent: '#8A7238', name: 'Dourado' },
  { id: 'ref-007', color: '#E8B94D', accent: '#A6822F', name: 'Amarelo' },
  { id: 'ref-008', color: '#6B3A2A', accent: '#422319', name: 'Terracota' },
  { id: 'ref-009', color: '#E68562', accent: '#B45939', name: 'Coral' },
];

const ANGLES = ['frente', 'costas', 'detalhe'];

function svgFor({ id, color, accent, name, angle }) {
  const bgTone = angle === 'costas' ? '#F0EEE8' : angle === 'detalhe' ? '#EFE7DB' : '#F6F3EC';
  const silhouetteOpacity = angle === 'detalhe' ? 0.85 : 1;
  const sway = angle === 'costas' ? 'translate(0,0) scaleX(-1) translate(-800,0)' : 'translate(0,0)';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1067" width="800" height="1067">
  <defs>
    <linearGradient id="bg-${id}-${angle}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bgTone}"/>
      <stop offset="100%" stop-color="#E9E3D4"/>
    </linearGradient>
    <linearGradient id="dress-${id}-${angle}" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.88"/>
      <stop offset="50%" stop-color="${color}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
    <radialGradient id="glow-${id}-${angle}" cx="0.5" cy="0.35" r="0.5">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft-${id}-${angle}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.6"/>
    </filter>
  </defs>
  <rect width="800" height="1067" fill="url(#bg-${id}-${angle})"/>
  <ellipse cx="400" cy="950" rx="260" ry="28" fill="#1A1A1A" opacity="0.08"/>
  <g transform="${sway}" opacity="${silhouetteOpacity}" filter="url(#soft-${id}-${angle})">
    <!-- torso -->
    <path d="M 400 220
             C 450 220, 480 260, 470 320
             L 510 460
             C 560 620, 600 780, 620 940
             L 180 940
             C 200 780, 240 620, 290 460
             L 330 320
             C 320 260, 350 220, 400 220 Z"
          fill="url(#dress-${id}-${angle})"/>
    <!-- bodice shimmer -->
    <path d="M 340 260 C 370 240, 430 240, 460 260 L 450 340 L 350 340 Z"
          fill="url(#glow-${id}-${angle})"/>
    <!-- waist cinch -->
    <path d="M 310 440 Q 400 470 490 440 L 500 460 Q 400 495 300 460 Z"
          fill="${accent}" opacity="0.55"/>
    <!-- skirt folds -->
    <path d="M 320 500 Q 310 700 240 940" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>
    <path d="M 400 500 Q 400 720 380 940" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>
    <path d="M 480 500 Q 490 700 560 940" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>
    <!-- straps / neckline detail -->
    <path d="M 350 230 Q 400 210 450 230" fill="none" stroke="${accent}" stroke-width="3" opacity="0.6"/>
  </g>
  <!-- paper grain -->
  <rect width="800" height="1067" fill="url(#glow-${id}-${angle})" opacity="0.4"/>
  <!-- label -->
  <g font-family="Georgia, serif" fill="#1A1A1A" opacity="0.55">
    <text x="60" y="1010" font-size="18" letter-spacing="4">ROSA CHARMOSA</text>
    <text x="60" y="1035" font-size="12" letter-spacing="2" opacity="0.7">${id.toUpperCase()} · ${name.toUpperCase()}</text>
  </g>
  <g font-family="Georgia, serif" fill="#1A1A1A" opacity="0.4">
    <text x="740" y="1035" font-size="11" letter-spacing="2" text-anchor="end">MOCKUP</text>
  </g>
</svg>`;
}

await mkdir(OUT, { recursive: true });

for (const p of pieces) {
  for (const angle of ANGLES) {
    const file = `${p.id}-${angle}.svg`;
    await writeFile(join(OUT, file), svgFor({ ...p, angle }));
  }
}
console.log(`Generated ${pieces.length * ANGLES.length} placeholder SVGs in ${OUT}`);
