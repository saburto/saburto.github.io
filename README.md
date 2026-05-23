# saburto.dev

Personal blog built with [Astro 5](https://astro.build), deployed to GitHub Pages via GitHub Actions.

## Tech Stack

- **Astro 5** — static site generator
- **Markdown** — blog content
- **Shiki** — code syntax highlighting
- **GitHub Actions** — CI/CD deploy to GitHub Pages

## Project Structure

```
src/
├── assets/          # Static images
├── content/
│   └── blog/        # Blog posts (*.md)
├── content.config.ts # Zod schema for blog frontmatter
├── layouts/
│   ├── BaseLayout.astro      # HTML shell (head, nav, footer, theme toggle)
│   └── BlogPostLayout.astro  # Blog post wrapper (date, JSON-LD)
├── pages/
│   ├── index.astro           # Home page
│   ├── about.md              # About page
│   ├── blog/[...slug].astro  # Blog post route
│   ├── rss.xml.ts            # RSS feed
│   └── sitemap.xml.ts        # Sitemap
└── styles/
    └── global.css            # All styles
```

## Commands

| Command             | Action                               |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start dev server at `localhost:4321` |
| `npm run build`     | Build to `./dist/`                   |
| `npm run preview`   | Preview the production build         |

## Adding a Blog Post

Create a Markdown file in `src/content/blog/` with frontmatter:

```yaml
---
title: My Post Title
date: 2026-05-23
description: Optional description for SEO and RSS
draft: true   # Remove to publish
---
```

## Deployment

Pushing to `main` triggers the `.github/workflows/deploy.yml` workflow, which builds the Astro site and deploys to GitHub Pages.
