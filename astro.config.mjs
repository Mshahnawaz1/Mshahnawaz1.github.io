import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mshahnawaz1.github.io',
  integrations: [sitemap()],
});
