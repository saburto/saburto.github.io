// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { transformerNotationDiff } from '@shikijs/transformers';
import remarkGhAlerts from 'remark-gh-alerts';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  site: 'https://saburto.com',
  base: '/',
  output: 'static',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGhAlerts],
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        ],
      ],
    }),
    shikiConfig: {
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
      transformers: [transformerNotationDiff()],
    },
  },
});
