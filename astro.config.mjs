// @ts-check
import { defineConfig } from 'astro/config';
import { transformerNotationDiff } from '@shikijs/transformers';

// https://astro.build/config
export default defineConfig({
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
