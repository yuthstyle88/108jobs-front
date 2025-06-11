import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Freelancer Apply - Step 5 (Upload ID card)", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should upload front and back ID card and continue", async ({ page }) => {
    await page.goto("/apply-freelance");

    await page.getByText("Google", { exact: true }).click();
    await page.getByRole("button", { name: /save and continue/i }).click();

    const avatarPath = path.resolve(__dirname, "../fixtures/avatar.jpg");
    await page.locator('input[type="file"]').setInputFiles(avatarPath);
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.getByPlaceholder(/username/i).fill("idtest");
    await page.getByPlaceholder(/display name/i).fill("ID Upload");
    await page.getByLabel(/part time/i).check();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await page.locator("textarea").fill("Freelancer verify ID step.");
    await page.getByRole("button", { name: /save and continue/i }).click();

    const frontPath = path.resolve(__dirname, "../fixtures/front.jpg");
    const backPath = path.resolve(__dirname, "../fixtures/back.jpg");

    const inputs = page.locator('input[type="file"]');
    await inputs.nth(0).setInputFiles(frontPath);

    await inputs.nth(1).setInputFiles(backPath);

    await expect(page.locator('img[alt="National ID Front"]')).toBeVisible();
    await expect(page.locator('img[alt="National ID Back"]')).toBeVisible();

    await page.getByRole("button", { name: /save and continue/i }).click();

    await expect(page.getByText(/id info/i)).toBeVisible(); 
  });
});
