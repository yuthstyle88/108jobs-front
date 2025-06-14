import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

test.describe('Create Job Page', () => {
  test('should validate form and show errors if required fields are empty', async ({ page }) => {
    await page.goto('/job-board/create-job');

    await page.getByRole('button', { name: 'โพสต์งาน' }).click();

    await expect(page.getByText('Job title is required')).toBeVisible();
    await expect(page.getByText('Job description is required')).toBeVisible();
    await expect(page.getByText('Service catalog is required')).toBeVisible();
    await expect(page.getByText('Budget is required')).toBeVisible();
  });

  test('should fill form and submit successfully', async ({ page }) => {
    await page.goto('/job-board/create-job');

    await page.getByLabel('หัวข้องาน').fill('สร้างเว็บไซต์ร้านค้าออนไลน์');
    await page.getByLabel('คำอธิบายงาน').fill('ต้องการเว็บไซต์อีคอมเมิร์ซพร้อมระบบชำระเงินครบถ้วนและรองรับมือถือ');

    await page.getByLabel('ตัวอย่างผลงาน (ถ้ามี)').fill('https://example.com');
    await page.getByLabel('งบประมาณ').fill('5000');

    await page.getByLabel('วันที่สิ้นสุดงาน').fill('2025-07-30');

    await page.getByLabel('หมวดหมู่บริการ').selectOption({ index: 1 });

    await page.getByRole('radio', { name: 'Freelance' }).check();
    await page.getByRole('button', { name: 'โพสต์งาน' }).click();

    await expect(page).toHaveURL('/job-board');
  });

  test('should allow toggling anonymous post and intended use options', async ({ page }) => {
    await page.goto('/job-board/create-job');

    const anonymousToggle = page.getByRole('checkbox').nth(1);
    await anonymousToggle.check();

    await page.getByText('สำหรับธุรกิจ').click();
    await page.getByText('ส่วนตัว').click();
    await page.getByText('ยังไม่แน่ใจ').click();
  });
});
