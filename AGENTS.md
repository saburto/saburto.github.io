# Project Agent Instructions

## Overview

Personal blog at **saburto.com**, a static site built with Astro 6. Posts are Markdown files with frontmatter. The site is styled with a custom CSS theme and uses Shiki for code syntax highlighting.

## Privacy and Public Repository

**This repository is public.** Never include:

- **Secrets**: API keys, tokens, passwords, credentials, SSH keys, or environment variables
- **Personal information**: private email addresses, phone numbers, home addresses, or any PII
- **NDA-covered content**: names of people, clients, employers, companies, or internal projects that could violate a non-disclosure or confidentiality agreement
- **Sensitive internal details**: unreleased product plans, proprietary algorithms, internal URLs, or infrastructure details

When writing blog posts, use generic examples rather than real company names or projects unless already publicly disclosed. Review every commit for accidental exposure before pushing.

## Tech Stack

- **Astro 6**: static site generator
- **Markdown**: blog content (no MDX)
- **Shiki**: code syntax highlighting (`one-light` for light mode, `one-dark-pro` for dark) with `@shikijs/transformers` for diff notation
- **@astrojs/rss**: RSS feed generation
- **sharp**: image optimization
- **@playwright/test**: end-to-end testing

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

| Field         | Type           | Required | Notes                                        |
| ------------- | -------------- | -------- | -------------------------------------------- |
| `title`       | string         | Yes      | Post title                                   |
| `date`        | Date           | Yes      | Publication date (YYYY-MM-DD)                |
| `description` | string         | No       | Used for meta description and JSON-LD        |
| `draft`       | boolean        | No       | When `true`, post is hidden from production  |
| `tags`        | string[]       | No       | List of tags for categorization              |
| `updated`     | Date           | No       | Date the post was last updated               |

## Conventions

- **Never use `--` or em dash (`—`) for separation in any text.** Use commas, colons, or other punctuation instead.
- **Avoid passive voice.** Use active voice whenever possible. Prefer direct, clear sentences (e.g., "The agent constructed this script" instead of "This script was constructed by the agent").
- **Prefer positive phrasing.** Frame sentences in the affirmative rather than the negative to improve readability (e.g., "Remember to close the connection" instead of "Don't forget to close the connection").
- **Avoid filler words and helper verbs.** Cut words that add no meaning (e.g., "basically", "actually", "just", "really", "very", "quite", "rather", "somewhat"). Remove unnecessary helper verbs (e.g., "start to learn" → "learn", "helps to improve" → "improves").
- **Ensure logical, coherent flow.** Every paragraph and section should follow naturally from the previous one. Use transitions where needed, and check that ideas progress in a clear order rather than jumping between unrelated points.
- **Use GFM alerts for callouts.** Use `> [!TIP]`, `> [!WARNING]`, `> [!NOTE]`, `> [!IMPORTANT]`, or `> [!CAUTION]` blockquotes instead of bold labels like `**Tip:**` or `**Warning:**`. Each line of the callout body must start with `>`. The CSS theme styles these with colored left borders, icons, and tinted backgrounds that support light/dark/auto.
- URLs are at `saburto.com/blog/{slug}/` where slug is the filename minus `.md`
- The home page lists all non-draft posts sorted by date descending (newest first)
- Theme toggle supports light, dark, and auto (follows system preference)
- Every blog post gets JSON-LD structured data for SEO
