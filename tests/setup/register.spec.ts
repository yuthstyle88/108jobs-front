import { test, expect } from '@playwright/test';

test.describe('Register Form', () => {
  test('should validate and submit the registration form', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('ชื่อผู้ใช้').fill('testuser');
    await page.getByLabel('อีเมล').fill('testuser@example.com');
    await page.getByLabel('รหัสผ่าน').fill('password123');
    await page.getByLabel('ยืนยันรหัสผ่าน').fill('password123');
    await page.getByLabel('เบอร์โทรศัพท์').fill('0987654321');

    await page.getByLabel(/ข้อตกลง/i).check();
    await page.getByLabel(/นโยบายความเป็นส่วนตัว/i).check();

    await page.getByRole('button', { name: 'สร้างบัญชี' }).click();

    await expect(page).toHaveURL(/\/verify-email/);
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/register');

    await page.getByRole('button', { name: 'สร้างบัญชี' }).click();

    await expect(page.getByText('กรุณากรอกอีเมลให้ถูกต้อง')).toBeVisible();
    await expect(page.getByText('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')).toBeVisible();
    await expect(page.getByText('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')).toBeVisible();
  });

  test('should show password mismatch error', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('รหัสผ่าน').fill('abc12345');
    await page.getByLabel('ยืนยันรหัสผ่าน').fill('abc123');

    await page.getByRole('button', { name: 'สร้างบัญชี' }).click();

    await expect(page.getByText('รหัสผ่านไม่ตรงกัน')).toBeVisible();
  });
});
