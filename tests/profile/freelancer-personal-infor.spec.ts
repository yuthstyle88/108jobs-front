import { test, expect } from "@playwright/test";

test.use({ storageState: "storage/auth.json" });

test.describe("Personal Info Page", () => {
  test("should load personal info form", async ({ page }) => {
    await page.goto("/seller-account-setting/personal-info");

    await expect(page.getByRole("heading", { name: /ข้อมูลบัตรประชาชน/i })).toBeVisible();
    await expect(page.getByLabel(/ชื่อ/i)).toBeVisible();
    await expect(page.getByLabel(/นามสกุล/i)).toBeVisible();
  });

  test("should upload front and back ID images", async ({ page }) => {
    await page.goto("/seller-account-setting/personal-info");

    const frontInput = page.locator("input[type='file']").nth(0);
    await frontInput.setInputFiles("tests/assets/front-id.jpg");

    const backInput = page.locator("input[type='file']").nth(1);
    await backInput.setInputFiles("tests/assets/back-id.jpg");

    await expect(page.locator("img[alt='ID front']")).toBeVisible();
    await expect(page.locator("img[alt='ID back']")).toBeVisible();
  });

  test("should validate and submit form", async ({ page }) => {
    await page.goto("/seller-account-setting/personal-info");

    await page.getByLabel(/ชื่อ/i).fill("Somchai");
    await page.getByLabel(/นามสกุล/i).fill("Dechdee");
    await page.getByLabel(/หมายเลขบัตร/i).fill("1234567890123");
    await page.getByLabel("ที่อยู่").fill("123/45 ถนนสุขุมวิท");
    await page.getByLabel(/รหัสไปรษณีย์/i).fill("10110");
    await page.getByLabel(/แขวง\/ตำบล/i).fill("คลองเตย");
    await page.getByLabel(/เขต\/อำเภอ/i).fill("คลองเตย");
    await page.getByLabel(/จังหวัด/i).fill("กรุงเทพมหานคร");

    await page.getByRole("button", { name: /บันทึก/i }).click();

    await expect(page.locator("form")).toBeVisible();
  });
});
