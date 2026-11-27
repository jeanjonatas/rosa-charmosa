/**
 * Prepend Astro's BASE_URL to a public-asset path so it works both on root
 * (local dev / custom domain) and under a subpath (GitHub Pages).
 *
 * Usage: asset('/img/vestidos/foo.webp') → '/rosa-charmosa/img/vestidos/foo.webp'
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
