import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';

// GitHub Pages serves this repo under /rosa-charmosa/.
// Local dev runs at the root. CI sets GITHUB_ACTIONS=true automatically.
const isGhPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isGhPages ? 'https://jeanjonatas.github.io' : 'https://rosacharmosa.com.br',
  base: isGhPages ? '/rosa-charmosa' : undefined,
  integrations: [solid(), sitemap()],
  vite: {
    plugins: [tailwind()],
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
