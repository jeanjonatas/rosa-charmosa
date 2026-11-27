# Rosa Charmosa — Catálogo

Site de catálogo da **Rosa Charmosa**, loja de locação de vestidos de festa em Goiânia-GO.

- 📍 R. Quintino Bocaiúva, 862 · Setor Campinas · Goiânia-GO
- 📱 WhatsApp (62) 98515-3577
- 📷 [@rosacharmosavestidos](https://www.instagram.com/rosacharmosavestidos)

## Stack

- [Astro 5](https://astro.build) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Solid.js](https://solidjs.com) para ilhas interativas (filtros, galeria)
- [Keen Slider](https://keen-slider.io) para carrossel de fotos
- Deploy: GitHub Pages via GitHub Actions

## Rodar local

```bash
npm install
npm run dev
```

Abre em `http://localhost:4321`.

## Build

```bash
npm run build       # roda astro check + astro build → dist/
npm run preview     # serve dist/ localmente
```

## Deploy

Push na branch `main` dispara o workflow em `.github/workflows/deploy.yml` que roda `npm run build` com `GITHUB_ACTIONS=true` (ativa `base: '/rosa-charmosa'`) e publica em `https://jeanjonatas.github.io/rosa-charmosa/`.

## Alimentar o catálogo

Os vestidos ficam em `src/data/vestidos.ts` — arquivo tipado único. Pra adicionar peça: editar o arquivo, `git push`, aguardar o workflow (~1 min).

## Estrutura

```
src/
├── components/     # Header, Hero, Catalogo, VestidoCard, Filtros, Galeria, Footer, BotoesFlutuantes, etc.
├── data/           # vestidos.ts (catálogo + CONTATO)
├── layouts/        # Base.astro (SEO, fonts, JSON-LD)
├── pages/          # index.astro, vestido/[id].astro
├── styles/         # global.css (tokens, animações)
└── utils/          # asset.ts (helper pra BASE_URL)

public/
├── img/vestidos/   # Fotos reais e placeholders SVG
├── logo/           # Logo horizontal nas variantes
└── favicon-*.png   # Ícones gerados do avatar da marca
```
