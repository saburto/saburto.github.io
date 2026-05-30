---
name: post-review
description: Review new blog posts to ensure they meet the project's formatting, structural, and privacy guidelines before publishing. Use this skill when a user asks to review a draft or new Markdown post in the src/content/blog directory.
---

# Blog Post Review Skill

This skill contains the instructions to review a blog post markdown file for `saburto.com`. The site is an Astro 6 static site, and posts are built from Markdown with specific requirements.

## How to Review a Post

When asked to review a post, you should check the contents against the project guidelines and provide actionable feedback or direct edits. Read the Markdown file and verify the following:

### 1. Frontmatter Checks

Verify the following required frontmatter properties exist and are correctly formatted:
- `title` (string)
- `date` (YYYY-MM-DD format)

Verify optional properties if present:
- `description` (string)
- `draft` (boolean - typical for new posts under review)
- `tags` (array of strings)

### 2. Content and Formatting Checks

- **Typography:** Ensure no double hyphens (`--`) or em dashes (`—`) are used in prose text. Suggest rewriting with commas, colons, or other punctuation. Code blocks (triple backtick fences) are exempt — em dashes and double hyphens are fine within code, SQL, shell scripts, and program output.
- **Passive voice:** Flag passive voice constructions and suggest active voice rewrites. Prefer direct, clear sentences (e.g., "The agent constructed this script" instead of "This script was constructed by the agent").
- **Positive phrasing:** Flag negative sentence constructions and suggest affirmative rewrites (e.g., "Remember to close the connection" instead of "Don't forget to close the connection").
- **Filler words and helper verbs:** Flag filler words ("basically", "actually", "just", "really", "very", "quite") and unnecessary helper verbs (e.g., "start to learn" → "learn", "helps to improve" → "improves"). Suggest removing them.
- **Logical coherent flow:** Review the overall structure. Every paragraph and section should follow naturally from the previous one. Flag sections that feel disconnected, jump between unrelated points, or lack clear transitions.
- **Skimmability & Headings:** Post must be skimmer-friendly. Ensure proper formatting, bolding, bullet points, and logical usage of heading levels (e.g., stopping appropriately at H2s and H3s without skipping levels).
- **Code Blocks:** Ensure all code blocks use standard Markdown triple backticks with an optional, correct language identifier matching the content (since Shiki is used).
- **Public Repository Privacy:** Read through the content to detect any:
  - Secrets (API keys, tokens, passwords)
  - Personal Information (PII, private emails, phone numbers, home addresses)
  - NDA-covered content (real company names, clients, internal projects not publicly disclosed)
  - Sensitive internal details (internal URLs, proprietary algorithms)
  *If any are found, immediately alert the user and offer to remove or anonymize them.*

### 3. Narrative Structure

Review the flow and structure of the post to ensure it contains the following key elements:
- **Core Idea Focus:** The post should focus on **only one main idea or topic**. It must not drift into too many disparate topics.
- **Hook/Introduction:** Does the post start with an engaging introduction that grabs the reader's attention and outlines what will be covered regarding that single main idea?
- **Arguments/Body (At least 2):** Does the post present at least two clear arguments, points, or sections supporting the main topic?
- **Conclusion/Call to Action:** Is there a clear wrap-up at the end, summarizing the thoughts, or offering a call to action for the reader?
- **Visual Aids:** Does the post include graphs, illustrations, diagrams, or other visual elements (like code blocks or structured lists) to make the main points easier to understand and break up large walls of text?
- **Resources/Links (Optional):** Are there references to external reading, tools, or related posts? Ensure these are properly formatted.

### 4. Action

- If issues are found, either provide a bulleted list of suggested fixes or ask the user if you should automatically apply the corrections using the `edit` tool.
- If the post is clean, inform the user that it passes the review and is ready to publish (they can remove the `draft: true` flag).
