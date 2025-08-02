import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

test.describe('Freelancer Public Profile Page', () => {
  test('should display profile profile with avatar, name and bio', async ({ page }) => {
    await page.goto('/user/testuser');

    await expect(page.getByRole('img', { name: 'avatar' })).toBeVisible();
    await expect(page.getByText('testuser')).toBeVisible();
    await expect(page.getByText('สมาชิกตั้งแต่')).toBeVisible();
  });

  test('should expand bio when see more is clicked', async ({ page }) => {
    await page.goto('/user/testuser');

    const seeMore = page.getByRole('button', { name: 'ดูเพิ่มเติม' });
    if (await seeMore.isVisible()) {
      await seeMore.click();
      await expect(seeMore).not.toBeVisible();
    }
  });

  test('should show work section and reviews tab', async ({ page }) => {
    await page.goto('/user/testuser');

    await expect(page.getByText('รีวิวจากผู้ว่าจ้าง')).toBeVisible();
    await expect(page.getByText('งานของ testuser')).toBeVisible();
  });
});
