import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

test.describe('Job Board Page', () => {
  test('should display job board and switch tabs', async ({ page }) => {
    await page.goto('/job-board');

    await expect(page.getByText('กระดานงาน')).toBeVisible();

    await page.getByRole('button', { name: 'งานทั้งหมด' }).click();
    await page.getByRole('button', { name: 'งานที่บันทึกไว้' }).click();
    await page.getByRole('button', { name: 'งานทั้งหมด' }).click();
  });

  test('should filter jobs by category and render table', async ({ page }) => {
    await page.goto('/job-board');

    const categoryDropdown = page.getByRole('combobox').first();
    await categoryDropdown.selectOption({ index: 1 });

    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should navigate to post job page and start selling', async ({ page }) => {
    await page.goto('/job-board');

    const postJobLink = page.getByRole('link', { name: /โพสต์งาน/i });
    await expect(postJobLink).toHaveAttribute('href', '/job-board/create-job');

    const startSellingLink = page.getByRole('link', { name: /เริ่มขายงานของคุณ/i });
    await expect(startSellingLink).toHaveAttribute('href', '/start-selling');
  });

  test('should show pagination and navigate pages', async ({ page }) => {
    await page.goto('/job-board');

    const pagination = page.locator('nav');
    await expect(pagination).toBeVisible();

    await pagination.getByRole('link', { name: 'Next' }).click();
  });
});
