import { test, expect } from '@playwright/test';

test.describe('Site navigation by clicking', () => {
  test('navigate through main pages via nav bar', async ({ page }) => {
    // Start at homepage
    await page.goto('/en/');
    await expect(page).toHaveTitle(/./);

    // Click "Tools" in the nav
    await page.getByRole('link', { name: 'Tools' }).first().click();
    await expect(page).toHaveURL(/\/en\/tools\//);
    await expect(page.locator('main')).toBeVisible();

    // Click "Articles" in the nav
    await page.getByRole('link', { name: 'Articles' }).first().click();
    await expect(page).toHaveURL(/\/en\/articles\//);
    await expect(page.locator('main')).toBeVisible();

    // Click "Promos" in the nav
    await page.getByRole('link', { name: 'Promos' }).first().click();
    await expect(page).toHaveURL(/\/en\/promos\//);
    await expect(page.locator('main')).toBeVisible();

    // Click logo to go back home
    await page.getByRole('link', { name: 'TechHub' }).click();
    await expect(page).toHaveURL(/\/en\//);
  });

  test('navigate to footer pages', async ({ page }) => {
    await page.goto('/en/');

    // Scroll to footer and click About
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/en\/about\//);
    await expect(page.locator('main')).toBeVisible();

    // Click Contact from footer
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/en\/contact\//);
    await expect(page.locator('main')).toBeVisible();
  });

  test('switch language', async ({ page }) => {
    await page.goto('/en/');

    // Click the language switcher to Chinese
    await page.getByRole('link', { name: '中文' }).click();
    await expect(page).toHaveURL(/\/zh\//);
  });
});
