// @ts-check
import { defineConfig } from 'astro/config';
import { transformerNotationDiff } from '@shikijs/transformers';

// https://astro.build/config
export default defineConfig({
  site: 'https://saburto.dev',
  base: '/',
  output: 'static',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
      transformers: [transformerNotationDiff()],
    },
  },
});
