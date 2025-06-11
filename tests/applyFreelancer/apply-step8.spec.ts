import { expect, test } from "@playwright/test";

test.describe("Freelancer Apply - Step 8 (Contact Info)", () => {
  test.use({ storageState: "storage/auth.json" });

  test("should fill address info for Thailand and continue", async ({ page }) => {
    await page.goto("/apply-freelance");

    await page.getByText("Google").click();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator('input[type="file"]').setInputFiles("tests/fixtures/avatar.jpg");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.getByPlaceholder(/username/i).fill("contacttest");
    await page.getByPlaceholder(/display name/i).fill("Contact Step");
    await page.getByLabel(/part time/i).check();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator("textarea").fill("Bio for Step 8");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator('input[type="file"]').nth(0).setInputFiles("tests/fixtures/front.jpg");
    await page.locator('input[type="file"]').nth(1).setInputFiles("tests/fixtures/back.jpg");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.selectOption("select[name='title']", "นาย");
    await page.getByPlaceholder(/first name/i).fill("Somchai");
    await page.getByPlaceholder(/last name/i).fill("Testchai");
    await page.getByPlaceholder(/id number/i).fill("1234567890123");
    await page.getByPlaceholder(/address details/i).fill("456/78");
    await page.getByPlaceholder(/ward/i).fill("แขวงปทุมวัน");
    await page.getByPlaceholder(/district/i).fill("เขตปทุมวัน");
    await page.getByPlaceholder(/province/i).fill("กรุงเทพ");
    await page.getByPlaceholder(/zip code/i).fill("10330");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.selectOption("select[name='birthDay']", "15");
    await page.selectOption("select[name='birthMonth']", "06");
    await page.selectOption("select[name='birthYear']", "1992");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await expect(page.getByText(/contact info|verify contact/i)).toBeVisible();

    await page.getByPlaceholder(/address/i).fill("123 ถนนสาทร");
    await page.getByPlaceholder(/sub-district/i).fill("ยานนาวา");
    await page.getByPlaceholder(/district/i).fill("สาทร");
    await page.getByPlaceholder(/province/i).fill("กรุงเทพมหานคร");

    const nextBtn = page.getByRole("button", { name: /save and continue/i });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    await expect(page.getByText(/bank|บัญชีธนาคาร/i)).toBeVisible();
  });
});
