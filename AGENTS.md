# Project Agent Instructions

## Overview

Personal blog at **saburto.dev**, a static site built with Astro 5. Posts are Markdown files with frontmatter. The site is styled with a custom CSS theme and uses Shiki for code syntax highlighting.

## Tech Stack

- **Astro 5**: static site generator
- **Markdown**: blog content (no MDX)
- **Shiki**: code syntax highlighting (Rosé Pine themes: `rose-pine-dawn` for light, `rose-pine-moon` for dark)
- **@astrojs/rss**: RSS feed generation

## Project Structure

```
src/
├── assets/          # Static images (saburto.jpg, houston.webp)
├── content/
│   └── blog/        # Blog posts (*.md)
├── content.config.ts # Zod schema for blog frontmatter
├── layouts/
│   ├── BaseLayout.astro      # HTML shell (head, nav, footer, theme toggle)
│   └── BlogPostLayout.astro  # Blog post wrapper (date, JSON-LD)
├── pages/
│   ├── index.astro           # Home page, lists all non-draft posts
│   ├── about.md              # About page
│   ├── blog/[...slug].astro  # Blog post route, renders individual posts
│   ├── rss.xml.ts            # RSS feed endpoint
│   └── sitemap.xml.ts        # Sitemap endpoint
└── styles/
    └── global.css            # All styles
```

## Commands

| Command           | Action                               |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server at `localhost:4321` |
| `npm run build`   | Build to `./dist/`                   |
| `npm run preview` | Preview the production build         |

## How to Add a New Blog Post

1. Create a new Markdown file in `src/content/blog/`, name it with kebab-case, e.g. `my-new-post.md`.
2. Add frontmatter at the top:

```yaml
---
title: My New Post Title
date: 2026-05-23
description: A short description for SEO and RSS (optional)
draft: true   # Set to true to hide from the listing; remove or set false to publish
---
```

3. Write the post content in Markdown. The `<!-- excerpt -->` comment is optional, not currently used by the templates, but can be used for future excerpt support.
4. Code blocks use standard Markdown triple backticks with an optional language tag, e.g.:

````markdown
```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```
````

5. **Drafts**: Posts with `draft: true` are excluded from the home page listing and the `[...slug].astro` route at build time. During `npm run dev` they are still accessible at their URL.

## Content Schema

Defined in `src/content.config.ts`:

| Field         | Type    | Required | Notes                                        |
| ------------- | ------- | -------- | -------------------------------------------- |
| `title`       | string  | Yes      | Post title                                   |
| `date`        | Date    | Yes      | Publication date (YYYY-MM-DD)                |
| `description` | string  | No       | Used for meta description and JSON-LD        |
| `draft`        | boolean | No       | When `true`, post is hidden from production  |

## Conventions

- **Never use `--` or em dash (`—`) for separation in any text.** Use commas, colons, or other punctuation instead.
- URLs are at `saburto.dev/blog/{slug}/` where slug is the filename minus `.md`
- The home page lists all non-draft posts sorted by date descending (newest first)
- Theme toggle supports light, dark, and auto (follows system preference)
- Every blog post gets JSON-LD structured data for SEO
