import { test, expect } from '@playwright/test';

test.describe('theme toggle', () => {
  test('theme select is visible and has three options', async ({ page }) => {
    await page.goto('/');

    const themeSelect = page.locator('#theme-select');
    await expect(themeSelect).toBeVisible();

    const options = themeSelect.locator('option');
    await expect(options).toHaveCount(3);
    await expect(options.nth(0)).toHaveAttribute('value', 'auto');
    await expect(options.nth(1)).toHaveAttribute('value', 'light');
    await expect(options.nth(2)).toHaveAttribute('value', 'dark');
  });

  test('switching to dark theme adds .dark class', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');

    // Switch to dark
    await page.selectOption('#theme-select', 'dark');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(html).toHaveClass(/dark/);

    // Switch to light
    await page.selectOption('#theme-select', 'light');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(html).toHaveClass(/light/);

    // Switch to auto
    await page.selectOption('#theme-select', 'auto');
    await expect(html).toHaveAttribute('data-theme', 'auto');
  });

  test('theme persists across page navigation', async ({ page }) => {
    await page.goto('/');

    // Set dark theme
    await page.selectOption('#theme-select', 'dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Navigate to about page
    await page.goto('/about');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#theme-select')).toHaveValue('dark');
  });
});
