import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

test.describe('Favorites Page', () => {
  test('should display favorite jobs or empty state', async ({ page }) => {
    await page.goto('/favorites');

    await expect(page.getByText('งานที่ถูกใจ')).toBeVisible();

    const jobCards = page.locator('[data-testid="job-card"]');
    const emptyMessage = page.getByText('ไม่มีฟรีแลนซ์ที่ถูกใจ');

    const hasCards = await jobCards.count();
    if (hasCards > 0) {
      await expect(jobCards.first()).toBeVisible();
    } else {
      await expect(emptyMessage).toBeVisible();
    }
  });
});
