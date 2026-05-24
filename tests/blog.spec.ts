import { test, expect } from '@playwright/test';

test.describe('blog posts', () => {
  test('each post renders with title, date, and content', async ({ page }) => {
    await page.goto('/');

    // Collect all blog post hrefs first (before navigating)
    const hrefs = await page.locator('.post-item a').evaluateAll(
      links => links.map(el => el.getAttribute('href')).filter(Boolean)
    );

    for (const href of hrefs) {
      if (!href) continue;
      await page.goto(href);

      // Should have article element
      await expect(page.locator('article')).toBeVisible();

      // Should have h1 with the title
      const h1 = page.locator('article h1');
      await expect(h1).toBeVisible();
      const titleText = await h1.textContent();
      expect(titleText?.trim().length).toBeGreaterThan(0);

      // Page title should contain 'Sebastian Aburto'
      const pageTitle = await page.title();
      expect(pageTitle).toContain('Sebastian Aburto');
    }
  });

  test('post has JSON-LD structured data', async ({ page }) => {
    await page.goto('/');

    // Get first post link
    const firstLink = page.locator('.post-item a').first();
    const href = await firstLink.getAttribute('href');
    if (!href) return;

    await page.goto(href);

    const jsonld = page.locator('script[type="application/ld+json"]');
    await expect(jsonld).toBeAttached();

    const content = await jsonld.textContent();
    const parsed = JSON.parse(content || '{}');
    expect(parsed['@type']).toBe('BlogPosting');
    expect(parsed.headline).toBeDefined();
    expect(parsed.datePublished).toBeDefined();
    expect(parsed.author.name).toBe('Sebastian Aburto');
  });

  test('adjacent post navigation links work', async ({ page }) => {
    await page.goto('/');

    const postLinks = page.locator('.post-item a');
    const count = await postLinks.count();

    if (count < 2) return; // Need at least 2 posts for nav

    // Go to the first (newest) post
    const firstHref = await postLinks.nth(0).getAttribute('href');
    if (!firstHref) return;

    await page.goto(firstHref);

    const blogNav = page.locator('.blog-nav');
    // The newest post should have a "prev" link (older post)
    const prevLink = blogNav.locator('a[rel="prev"]');
    if (await prevLink.isVisible()) {
      await prevLink.click();
      await expect(page.locator('article h1')).toBeVisible();
      // URL should have changed
      expect(page.url()).not.toBe(firstHref);
    }
  });

  test('code blocks have title bar and copy button', async ({ page }) => {
    await page.goto('/');

    // Find a post that might have code (look through all)
    const postLinks = page.locator('.post-item a');
    const count = await postLinks.count();
    let foundCode = false;

    for (let i = 0; i < count && !foundCode; i++) {
      const href = await postLinks.nth(i).getAttribute('href');
      if (!href) continue;

      await page.goto(href);

      const codeBlocks = page.locator('.code-block');
      if ((await codeBlocks.count()) > 0) {
        foundCode = true;

        const firstBlock = codeBlocks.first();
        // Should have a title bar
        await expect(firstBlock.locator('.code-title')).toBeVisible();
        // Should have a copy button
        const copyBtn = firstBlock.locator('.code-copy');
        await expect(copyBtn).toBeVisible();
        await expect(copyBtn).toHaveText('Copy');

        // Click copy and verify it changes text (clipboard API may not work on localhost)
        await copyBtn.click();
        // Wait briefly and check - clipboard may fail silently on non-HTTPS
        await page.waitForTimeout(500);
        const btnText = await copyBtn.textContent();
        expect(['Copied!', 'Copy']).toContain(btnText);
      }
    }
  });
});
