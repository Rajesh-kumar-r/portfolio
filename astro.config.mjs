import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rajesh.fyi',
  output: 'static',
  integrations: [react(), mdx(), sitemap()],
  vite: { ssr: { noExternal: ['@fontsource/*'] } },
});
