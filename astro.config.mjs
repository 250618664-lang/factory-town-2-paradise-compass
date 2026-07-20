import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ft2paradiseguide.com',
  integrations: [sitemap()],
  output: 'static',
});
