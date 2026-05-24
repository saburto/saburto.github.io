import { test, expect } from '@playwright/test';

const pages = ['/', '/about', '/projects'];

for (const path of pages) {
  test.describe(`${path} page`, () => {
    test('returns 200 and renders header/footer', async ({ page, baseURL }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);

      await expect(page.locator('.site-header')).toBeVisible();
      await expect(page.locator('.site-footer')).toBeVisible();
      await expect(page.locator('.site-name')).toContainText('Sebastian Aburto');
    });

    test('has valid <title> and canonical link', async ({ page, baseURL }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href');
      const href = await canonical.getAttribute('href');
      expect(href).toContain('saburto.com');
    });
  });
}

test.describe('home page /', () => {
  test('lists blog posts sorted by date', async ({ page }) => {
    await page.goto('/');

    const items = page.locator('.post-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    // Each post-item should have a date and a link
    const first = items.first();
    await expect(first.locator('.post-date')).toBeVisible();
    await expect(first.locator('a')).toBeVisible();
  });

  test('blog post links point to /blog/{slug}/', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('.post-item a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toMatch(/^\/blog\/[\w-]+\/$/);
    }
  });
});
