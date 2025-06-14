import { test, expect } from '@playwright/test';

test.describe('Forgot Password Form', () => {
  test('should show validation error when email is empty', async ({ page }) => {
    await page.goto('/forgot-password');

    await page.getByRole('button', { name: 'ส่งรหัสยืนยัน' }).click();

    await expect(page.getByText('กรุณากรอกอีเมลหรือเบอร์โทรศัพท์')).toBeVisible();
  });

  test('should submit forgot password with valid email', async ({ page }) => {
    await page.goto('/forgot-password');

    await page.getByLabel('อีเมลหรือเบอร์โทรศัพท์').fill('testuser@example.com');

    await page.getByRole('button', { name: 'ส่งรหัสยืนยัน' }).click();

    await expect(page).toHaveURL(/\/verify-forgot-password/);
  });

  test('should display API error for non-existing email', async ({ page }) => {
    await page.goto('/forgot-password');

    await page.getByLabel('อีเมลหรือเบอร์โทรศัพท์').fill('notfound@example.com');

    await page.getByRole('button', { name: 'ส่งรหัสยืนยัน' }).click();

    await expect(page.getByText('อีเมลนี้ไม่มีอยู่ในระบบ')).toBeVisible();
  });
});
