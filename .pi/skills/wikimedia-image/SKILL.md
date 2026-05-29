---
name: wikimedia-image
description: Download an image from Wikimedia Commons, convert it to WebP, place it in src/assets/, and insert it into a blog post with proper formatting and attribution. Use this skill when the user wants to add a Wikimedia Commons image to a Markdown blog post.
---

# Wikimedia Image Skill

Downloads an image from a Wikimedia Commons file page, converts it to WebP at quality 85, places it in `src/assets/`, and inserts it into the current blog post with centered layout and attribution.

## Usage

1. The user provides a Wikimedia Commons file page URL (e.g., `https://commons.wikimedia.org/wiki/File:Eclipse_suspended_at_breakpoint.png`).
2. The user may provide an optional output name (without extension).
3. The script downloads, converts, and places the file.
4. Then, insert the image into the blog post using this template:

```markdown
![Alt text describing the image](../../assets/output-name.webp)
*Image: [Original Name](https://commons.wikimedia.org/wiki/File:OriginalName.ext)*
```

The global CSS in `src/styles/global.css` automatically centers images and their captions. Use an italicized line (`*...*`) directly after the image for the caption — no HTML wrapper needed.

## Script

Run the download script from the project root:

```bash
$PROJECT_ROOT/.pi/skills/wikimedia-image/download.sh "<wikimedia-commons-url>" "<optional-output-name>"
```

### Script details

- Extracts the direct upload URL from the Wikimedia Commons file page
- Downloads the original PNG/JPG image
- Converts it to WebP at quality 85 using `sharp`
- Places the output in `src/assets/`
- Cleans up the temporary file

## After running

1. Read the script output to confirm success and get the file name.
2. Determine where in the blog post to place the image.
3. Use the `edit` tool to insert the Markdown block shown above (image + italic caption) with the correct filename and alt text.
4. Use the Wikimedia Commons file page URL (not the direct upload URL) for the attribution link.
5. If replacing an existing image, remove the old file from `src/assets/`.

## Example

User says: "add this image https://commons.wikimedia.org/wiki/File:Eclipse_suspended_at_breakpoint.png to the post"

Steps:
1. Run: `.pi/skills/wikimedia-image/download.sh "https://commons.wikimedia.org/wiki/File:Eclipse_suspended_at_breakpoint.png"`
2. Output: `eclipse_suspended_at_breakpoint.webp`
3. Insert into post:

```markdown
![Eclipse IDE suspended at a breakpoint](../../assets/eclipse_suspended_at_breakpoint.webp)
*Image: [Eclipse suspended at breakpoint](https://commons.wikimedia.org/wiki/File:Eclipse_suspended_at_breakpoint.png)*
```
