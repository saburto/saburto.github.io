import { test, expect } from '@playwright/test';

test.describe('mobile responsiveness', () => {
  test('header is visible on mobile viewport', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('.site-header');
    await expect(header).toBeVisible();

    const siteName = page.locator('.site-name');
    await expect(siteName).toBeVisible();
  });

  test('nav links are accessible on mobile', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('.site-nav');
    await expect(nav).toBeVisible();

    // All nav links should be present
    const navLinks = nav.locator('a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(4); // blog, tags, projects, about
  });

  test('blog post content is readable on mobile', async ({ page }) => {
    await page.goto('/');

    const firstLink = page.locator('.post-item a').first();
    const href = await firstLink.getAttribute('href');
    if (!href) return;

    await page.goto(href);

    // Article content should be visible and not overflow
    const article = page.locator('article');
    await expect(article).toBeVisible();

    // Check no horizontal overflow on the body
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 0;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // small tolerance
  });

  test('footer is visible and social links work', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('.site-footer');
    await expect(footer).toBeVisible();

    // Footer social links
    const socialLinks = footer.locator('.footer-social a');
    const count = await socialLinks.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // GitHub link
    const ghLink = footer.locator('a[aria-label="GitHub"]');
    await expect(ghLink).toHaveAttribute('href', 'https://github.com/saburto');

    // LinkedIn link
    const liLink = footer.locator('a[aria-label="LinkedIn"]');
    await expect(liLink).toHaveAttribute('href', 'https://www.linkedin.com/in/saburto/');

    // RSS link
    const rssLink = footer.locator('a[aria-label="RSS Feed"]');
    await expect(rssLink).toHaveAttribute('href', '/rss.xml');
  });
});

test.describe('touch interactions', () => {
  test('theme toggle works via tap on mobile', async ({ page }) => {
    await page.goto('/');

    // Tap the theme select
    await page.locator('#theme-select').selectOption('dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#theme-select').selectOption('light');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('blog post links are tappable', async ({ page, isMobile }) => {
    await page.goto('/');

    const postLinks = page.locator('.post-item a');
    const count = await postLinks.count();
    expect(count).toBeGreaterThan(0);

    // Tap the first post link
    const firstHref = await postLinks.first().getAttribute('href');
    if (!firstHref) return;

    // Use tap on mobile, click on desktop
    if (isMobile) {
      await postLinks.first().tap();
    } else {
      await postLinks.first().click();
    }
    await expect(page.locator('article')).toBeVisible();
    expect(page.url()).toContain(firstHref);
  });
});
