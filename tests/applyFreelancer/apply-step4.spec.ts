import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Freelancer Apply - Step 4 (Bio)", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should enter bio and proceed to Step 5", async ({ page }) => {
    await page.goto("/apply-freelance");

    await page.getByText("Google", { exact: true }).click();
    await page.getByRole("button", { name: /save and continue/i }).click();

    const avatarPath = path.resolve(__dirname, "../fixtures/avatar.jpg");
    await page.locator('input[type="file"]').setInputFiles(avatarPath);
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.getByPlaceholder(/username/i).fill("testbio");
    await page.getByPlaceholder(/display name/i).fill("EditForm Bio");
    await page.getByLabel(/part time/i).check();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator("textarea").fill("Tôi là freelancer chuyên về Playwright test.");
    await page.getByRole("button", { name: /save and continue/i }).click();

    await expect(page.getByText(/upload id/i)).toBeVisible();
  });
});
