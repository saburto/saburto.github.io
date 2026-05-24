import { test, expect } from '@playwright/test';

test.describe('SEO & metadata', () => {
  test('homepage has correct meta tags', async ({ page }) => {
    await page.goto('/');

    // Description
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content');

    // Open Graph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content');

    // Twitter
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content');

    // Canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href');
    const href = await canonical.getAttribute('href');
    expect(href).toMatch(/^https:\/\/saburto\.com\/?$/);
  });

  test('blog posts have article meta tags', async ({ page }) => {
    await page.goto('/');

    const firstLink = page.locator('.post-item a').first();
    const href = await firstLink.getAttribute('href');
    if (!href) return;

    await page.goto(href);

    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content');
  });

  test('favicon is linked', async ({ page }) => {
    await page.goto('/');

    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', '/favicon.svg');
  });

  test('viewport meta tag is present', async ({ page }) => {
    await page.goto('/');

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1');
  });
});

test.describe('RSS feed', () => {
  test('RSS feed returns valid XML', async ({ page }) => {
    const res = await page.goto('/rss.xml');
    expect(res?.status()).toBe(200);

    const contentType = res?.headers()['content-type'];
    expect(contentType).toMatch(/xml/);

    // Use response body directly to avoid XML viewer wrapping in WebKit
    const body = await res?.text() || '';
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
    expect(body).toContain('<title>Sebastian Aburto</title>');
    expect(body).toContain('<item>');
  });
});

test.describe('sitemap', () => {
  test('sitemap.xml returns valid XML with URLs', async ({ page }) => {
    const res = await page.goto('/sitemap.xml');
    expect(res?.status()).toBe(200);

    const contentType = res?.headers()['content-type'];
    expect(contentType).toMatch(/xml/);

    // Use response body directly to avoid XML viewer wrapping in WebKit
    const body = await res?.text() || '';
    expect(body).toContain('<urlset');
    expect(body).toContain('saburto.com');
  });
});
