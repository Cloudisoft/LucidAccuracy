import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lucidaccuracy.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  // Old URLs from the previous site keep working.
  redirects: {
    '/services': '/solutions/',
    '/recruitment': '/solutions/recruitment-workforce/',
    '/technology': '/solutions/technology/',
    '/training': '/solutions/training/',
    '/operations': '/solutions/business-process/',
    '/partner': '/about/',
    '/locations': '/global-presence/',
    '/case-studies': '/projects/',
  },
});
