import { test, expect } from '@playwright/test';

test.describe('site navigation', () => {
  test('nav links are present and functional', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('.site-nav');
    await expect(nav).toBeVisible();

    // Check all nav links
    const links = [
      { href: '/', text: 'blog' },
      { href: '/tags/', text: 'tags' },
      { href: '/projects', text: 'projects' },
      { href: '/about', text: 'about' },
    ];

    for (const { href, text } of links) {
      const link = nav.locator(`a[href="${href}"]`);
      await expect(link).toBeVisible();
      await expect(link).toContainText(text);

      await link.click();
      await expect(page.locator('main')).toBeVisible();

      // Check active state on the blog link when on home
      if (href === '/') {
        await page.goto('/');
        await expect(page.locator('.site-nav a.active')).toBeVisible();
      }
    }
  });

  test('home link from within a blog post works', async ({ page }) => {
    await page.goto('/');

    const postLinks = page.locator('.post-item a');
    const href = await postLinks.first().getAttribute('href');
    if (!href) return;

    await page.goto(href);

    // Click the site name to go home
    await page.locator('.site-name').click();
    // Production may redirect to www subdomain
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.post-item').first()).toBeVisible();
  });
});
