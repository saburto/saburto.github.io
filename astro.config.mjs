// @ts-check
import { defineConfig } from 'astro/config';
import { transformerNotationDiff } from '@shikijs/transformers';
import remarkGhAlerts from 'remark-gh-alerts';

// https://astro.build/config
export default defineConfig({
  site: 'https://saburto.com',
  base: '/',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkGhAlerts],
    shikiConfig: {
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
      transformers: [transformerNotationDiff()],
    },
  },
});
