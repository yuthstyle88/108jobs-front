import { expect, test } from "@playwright/test";

test.describe("Freelancer Apply - Step 6 (ID Info Form)", () => {
  test.use({ storageState: "storage/auth.json" });

  test("should fill all ID info fields and proceed", async ({ page }) => {
    await page.goto("/apply-freelance");

    await page.getByText("Google").click();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator('input[type="file"]').setInputFiles("tests/fixtures/avatar.jpg");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.getByPlaceholder(/username/i).fill("teststep6");
    await page.getByPlaceholder(/display name/i).fill("Playwright User");
    await page.getByLabel(/part time/i).check();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator("textarea").fill("Bio for Step 6");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator('input[type="file"]').nth(0).setInputFiles("tests/fixtures/front.jpg");
    await page.locator('input[type="file"]').nth(1).setInputFiles("tests/fixtures/back.jpg");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.selectOption("select[name='title']", "นาย");
    await page.getByPlaceholder(/first name/i).fill("Somchai");
    await page.getByPlaceholder(/last name/i).fill("Testchai");
    await page.getByPlaceholder(/id number/i).fill("1234567890123");
    await page.getByPlaceholder(/address details/i).fill("123 Moo 4");
    await page.getByPlaceholder(/ward|commune/i).fill("Wattana");
    await page.getByPlaceholder(/district/i).fill("Bangkok Noi");
    await page.getByPlaceholder(/province/i).fill("Bangkok");
    await page.getByPlaceholder(/zip code/i).fill("10110");

    const nextBtn = page.getByRole("button", { name: /save and continue/i });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    await expect(page.getByText(/birth date|step 7/i)).toBeVisible();
  });
});
