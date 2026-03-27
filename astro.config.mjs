import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [react(), sitemap()],
  output: 'static',
  build: {
    format: 'directory'
  },
  site: 'https://xipeter.github.io',
  base: '/',
  trailingSlash: 'always',
  server: {
    port: 4321
  }
});
