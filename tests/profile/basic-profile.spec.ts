import { test, expect } from '@playwright/test';

test.describe('Chỉnh sửa thông tin cơ bản', () => {
  test.use({ storageState: 'storage/auth.json' });

  test('Hiển thị trang và cập nhật thông tin thành công', async ({ page }) => {
    await page.goto('/account-setting/basic-information');

    await expect(page.getByText('ข้อมูลบัญชี')).toBeVisible();

    const displayNameInput = page.getByLabel('ชื่อที่แสดง'); 
    await displayNameInput.fill('Tên Mới Playwright');

    await page.selectOption('select[name="birth_day"]', '15');
    await page.selectOption('select[name="birth_month"]', '6');
    await page.selectOption('select[name="birth_year"]', '2000');

    const submitButton = page.getByRole('button', { name: /บันทึก/i });
    await submitButton.click();

    await expect(submitButton).toHaveText(/บันทึก/i, { timeout: 10000 });

  });
});
