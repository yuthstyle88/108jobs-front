import { expect, test } from "@playwright/test";

test.describe("Freelancer Apply - Step 9 (Bank Transfer Verification)", () => {
  test.use({ storageState: "storage/auth.json" });

  test("should display bank info and continue", async ({ page }) => {
    await page.goto("/apply-freelance");

    await page.getByText("Google").click();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator('input[type="file"]').setInputFiles("tests/fixtures/avatar.jpg");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.getByPlaceholder(/username/i).fill("step9user");
    await page.getByPlaceholder(/display name/i).fill("Transfer User");
    await page.getByLabel(/part time/i).check();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator("textarea").fill("I accept the terms and verify identity.");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator('input[type="file"]').nth(0).setInputFiles("tests/fixtures/front.jpg");
    await page.locator('input[type="file"]').nth(1).setInputFiles("tests/fixtures/back.jpg");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.selectOption("select[name='title']", "นาย");
    await page.getByPlaceholder(/first name/i).fill("Somchai");
    await page.getByPlaceholder(/last name/i).fill("Testchai");
    await page.getByPlaceholder(/id number/i).fill("1234567890123");
    await page.getByPlaceholder(/address details/i).fill("123 Moo 4");
    await page.getByPlaceholder(/ward/i).fill("Yannawa");
    await page.getByPlaceholder(/district/i).fill("Sathorn");
    await page.getByPlaceholder(/province/i).fill("Bangkok");
    await page.getByPlaceholder(/zip code/i).fill("10120");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.selectOption("select[name='birthDay']", "15");
    await page.selectOption("select[name='birthMonth']", "06");
    await page.selectOption("select[name='birthYear']", "1995");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.getByPlaceholder(/address/i).fill("123 street");
    await page.getByPlaceholder(/sub-district/i).fill("Sub");
    await page.getByPlaceholder(/district/i).fill("District");
    await page.getByPlaceholder(/province/i).fill("Province");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await expect(page.getByText(/final verification step/i)).toBeVisible();
    await expect(page.getByText(/Bangkok Freelancer/)).toBeVisible(); 

    await page.getByRole("button", { name: /save and continue/i }).click();

    await expect(page.getByText(/complete/i)).toBeVisible();
  });
});
