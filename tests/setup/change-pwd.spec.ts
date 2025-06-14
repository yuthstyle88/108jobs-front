import { test, expect } from '@playwright/test';

test.describe('Change Password Form', () => {
  test('should show validation error when passwords do not match', async ({ page }) => {
    await page.goto('/change-password?token=mocktoken');

    await page.getByLabel('รหัสผ่าน').fill('newpassword123');
    await page.getByLabel('ยืนยันรหัสผ่าน').fill('different123');

    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    await expect(page.getByText('รหัสผ่านไม่ตรงกัน')).toBeVisible();
  });

  test('should change password successfully with valid token and match passwords', async ({ page }) => {
    await page.goto('/change-password?token=mocktoken');

    await page.getByLabel('รหัสผ่าน').fill('newpassword123');
    await page.getByLabel('ยืนยันรหัสผ่าน').fill('newpassword123');

    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    await expect(page).toHaveURL('/');
  });

  test('should show API error when change fails', async ({ page }) => {
    await page.goto('/change-password?token=invalidtoken');

    await page.getByLabel('รหัสผ่าน').fill('newpassword123');
    await page.getByLabel('ยืนยันรหัสผ่าน').fill('newpassword123');

    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    await expect(page.getByText('ไม่สามารถเปลี่ยนรหัสผ่านได้')).toBeVisible();
  });
});
