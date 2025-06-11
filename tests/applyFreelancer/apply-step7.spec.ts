import { expect, test } from "@playwright/test";

test.describe("Freelancer Apply - Step 7 (Birthdate)", () => {
  test.use({ storageState: "storage/auth.json" });

  test("should select valid birthdate and continue", async ({ page }) => {
    await page.goto("/apply-freelance");

    await page.getByText("Google").click();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator('input[type="file"]').setInputFiles("tests/fixtures/avatar.jpg");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.getByPlaceholder(/username/i).fill("birthtest");
    await page.getByPlaceholder(/display name/i).fill("Birthdate Test");
    await page.getByLabel(/part time/i).check();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator("textarea").fill("Bio before birth date");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator('input[type="file"]').nth(0).setInputFiles("tests/fixtures/front.jpg");
    await page.locator('input[type="file"]').nth(1).setInputFiles("tests/fixtures/back.jpg");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.selectOption("select[name='title']", "นาย");
    await page.getByPlaceholder(/first name/i).fill("Somchai");
    await page.getByPlaceholder(/last name/i).fill("Testchai");
    await page.getByPlaceholder(/id number/i).fill("1234567890123");
    await page.getByPlaceholder(/address details/i).fill("123 Moo 4");
    await page.getByPlaceholder(/ward/i).fill("Wattana");
    await page.getByPlaceholder(/district/i).fill("Bangkok Noi");
    await page.getByPlaceholder(/province/i).fill("Bangkok");
    await page.getByPlaceholder(/zip code/i).fill("10110");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.selectOption("select[name='birthDay']", "15");
    await page.selectOption("select[name='birthMonth']", "06");
    await page.selectOption("select[name='birthYear']", "1995");

    const nextBtn = page.getByRole("button", { name: /save and continue/i });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    await expect(page.getByText(/contact info|ที่อยู่ปัจจุบัน/i)).toBeVisible();
  });
});
