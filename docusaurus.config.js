// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

import rehypeShiki from "@shikijs/rehype";
import { bundledLanguages } from "shiki";
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
  transformerNotationMap,
  transformerMetaWordHighlight
} from "@shikijs/transformers";
import { Children } from "react";


const rehypeShikiPlugin = [
  rehypeShiki,
  {

    themes: {
      light: "github-light",
      dark: "one-dark-pro",
    },
    langs: Object.keys(bundledLanguages),
    transformers: [
      transformerMetaHighlight({
        className: "saburto-lineHighlighted"
      }),
      transformerNotationHighlight({
        classActiveLine: "saburto-lineHighlighted"
      }),
      transformerMetaWordHighlight({
        className: "saburto-activeWord"
      }),
      transformerNotationWordHighlight({
        classActiveWord: "saburto-activeWord"
      }),
      transformerNotationDiff({
        classLineAdd: "saburto-codeLineDiffAdd",
        classLineRemove: "saburto-codeLineDiffRemove"
      }),
      transformerNotationFocus(), {
        name: "my-transform",
        root(node) {
          const pre = node.children[0];
          const metaRaw = this.options.meta.__raw;
          pre.properties.dataCode = this.source;

          if (!metaRaw.match(/showlang:false/)) {
            pre.properties.lang = this.options.lang;
          }
          pre.properties.shikijs = true;
          pre.properties.style = {};


          const titleMatch = metaRaw.match(/title="([^"]+)"/);
          if (titleMatch) {
            pre.properties.title = titleMatch[1];
          }
        }
      }
    ],
  }
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "{ Sebastian Aburto }",
  tagline: "Sharing knowledge and learning to the world",
  favicon: "favicon.ico",

  // Set the production url of your site here
  url: "https://saburto.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "saburto", // Usually your GitHub org/user name.
  projectName: "saburto.github.io", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        blog: {
          showLastUpdateTime: true,
          editUrl: "https://github.com/saburto/saburto.github.io/tree/main/",
          editLocalizedFiles: true,
          beforeDefaultRehypePlugins: [rehypeShikiPlugin],
        },
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/saburto/saburto.github.io/tree/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: "G-LM76HVKGTY",
          anonymizeIP: true,
        },
      }),
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'tutorials',
        path: 'tutorials',
        routeBasePath: 'tutorials',
        sidebarPath: './sidebarsTutorials.js',
        beforeDefaultRehypePlugins: [rehypeShikiPlugin],
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        editUrl: "https://github.com/saburto/saburto.github.io/tree/main/"
      }
    ]

  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "android-chrome-512x512.png",
      navbar: {
        title: "Sebastian Aburto",
        logo: {
          alt: "My Site Logo",
          src: "android-chrome-512x512.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tilSidebar",
            position: "left",
            label: "Today I Learned",
          },
          {
            type: "docSidebar",
            position: "left",
            sidebarId: "tutorials",
            label: "Tutorials",
            docsPluginId: "tutorials"
          },
          {
            to: "blog",
            position: "left",
            label: "Blog",
          },
          {
            type: "localeDropdown",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} Sebastian Aburto. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.oneDark,
        additionalLanguages: ["java", "ini", "bash", "log", "diff"],
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: { start: 'highlight-start', end: 'highlight-end' }
          },
          {
            className: 'code-input',
            line: 'highlight-next-input'
          },
          {
            className: 'code-success',
            line: 'highlight-next-success'
          }
        ]
      },
    }),
};

export default config;
