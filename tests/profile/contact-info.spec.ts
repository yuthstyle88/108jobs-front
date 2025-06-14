import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

test.describe('Contact Info Page', () => {
  test('Should load and update address for Thailand location', async ({ page }) => {
    await page.goto('/account-setting/contact-info');

    await expect(page.getByText('ข้อมูลติดต่อ')).toBeVisible();

    await expect(page.getByLabel('รายละเอียดที่อยู่')).toBeVisible();
    await page.getByLabel('รายละเอียดที่อยู่').fill('123 ถนน เพลินจิต');

    await page.getByLabel('แขวง / ตำบล').fill('ลุมพินี');
    await page.getByLabel('เขต / อำเภอ').fill('ปทุมวัน');
    await page.getByLabel('จังหวัด').fill('กรุงเทพมหานคร');

    await page.getByRole('button', { name: 'บันทึก' }).click();

    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeVisible();
  });

  test('Should switch to Foreign address and submit country only', async ({ page }) => {
    await page.goto('/account-setting/contact-info');

    await expect(page.getByText('ข้อมูลติดต่อ')).toBeVisible();

    const radio = page.getByLabel('ต่างประเทศ');
    await radio.check();

    const countrySelect = page.getByLabel('เลือกประเทศ');
    await countrySelect.selectOption('Japan');

    await page.getByRole('button', { name: 'บันทึก' }).click();

    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeVisible();
  });

  test('Should open email change modal and submit email change request', async ({ page }) => {
    await page.goto('/account-setting/contact-info');

    const editBtn = page.getByRole('button', { name: 'แก้ไข' }).first();
    await editBtn.click();

    const confirmBtn = page.getByRole('button', { name: 'ยืนยัน' });
    await confirmBtn.click();

    const emailInput = page.getByPlaceholder('your.email@example.com');
    await emailInput.fill('new.email@example.com');

    const changeBtn = page.getByRole('button', { name: 'เปลี่ยน' });
    await changeBtn.click();

    await expect(page.locator('text=เปลี่ยนอีเมลสำเร็จ')).toBeVisible();
  });
});
