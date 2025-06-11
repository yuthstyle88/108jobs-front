import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Freelancer Apply - Step 3 (Basic Info)", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should fill username, display name, choose freelance type and continue", async ({ page }) => {
    await page.goto("/apply-freelance");

    await page.getByText("Google", { exact: true }).click();
    await page.getByRole("button", { name: /save and continue/i }).click();

    const fileInput = page.locator('input[type="file"]');
    const avatarPath = path.resolve(__dirname, "../fixtures/avatar.jpg");
    await fileInput.setInputFiles(avatarPath);
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.getByPlaceholder(/username/i).fill("freelancer_test");
    await page.getByPlaceholder(/display name/i).fill("Playwright Test");
    await page.getByLabel(/part time/i).check();

    await page.getByRole("button", { name: /save and continue/i }).click();

    await expect(page.getByText(/bio/i)).toBeVisible();
  });
});
