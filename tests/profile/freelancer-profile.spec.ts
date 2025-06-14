import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

test.describe('Freelancer Account Settings Page', () => {
  test('should render form fields and submit updated info', async ({ page }) => {
    await page.goto('/seller-account-setting');

    await expect(page.getByText('ข้อมูลบัญชีฟรีแลนซ์')).toBeVisible();

    const usernameInput = page.getByLabel('ชื่อผู้ใช้');
    const displayNameInput = page.getByLabel('ชื่อที่แสดง');
    const bioTextarea = page.getByLabel('เกี่ยวกับฟรีแลนซ์');

    await usernameInput.fill('newfreelancer');
    await displayNameInput.fill('Freelancer Name');
    await bioTextarea.fill('This is a sample bio for testing.');

    await page.getByRole('radio', { name: 'Part-time' }).check();

    const saveButton = page.getByRole('button', { name: 'บันทึก' });
    await saveButton.click();

    await expect(saveButton).toBeEnabled();
  });

  test('should open and interact with avatar upload', async ({ page }) => {
    await page.goto('/seller-account-setting');

    const avatar = page.locator('input[type="file"]');
    await avatar.setInputFiles('tests/fixtures/avatar.jpg');

    await page.getByRole('button', { name: 'บันทึก' }).click();

    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeEnabled();
  });
});
