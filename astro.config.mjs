import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lucidaccuracy.com',
  trailingSlash: 'always',
  // Pages load on hover or touch, so moving between them feels instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(404|credits)\/?$/.test(page),
      serialize(item) {
        const path = new URL(item.url).pathname;
        item.lastmod = new Date().toISOString();
        item.changefreq = path === '/' ? 'weekly' : 'monthly';
        item.priority = path === '/' ? 1.0 : /^\/(solutions|ai-calling-agent|industries|contact)/.test(path) ? 0.9 : 0.7;
        return item;
      },
    }),
  ],
  // Old URLs from the previous site keep working (server/index.mjs sends real 301s
  // in production; these cover `astro dev`/`preview`).
  redirects: JSON.parse(readFileSync(new URL('./src/data/redirects.json', import.meta.url), 'utf8')),
});
