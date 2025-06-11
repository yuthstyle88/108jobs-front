import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Freelancer Apply - Step 2 (Upload Avatar)", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should upload avatar and proceed to Step 3", async ({ page }) => {
    await page.goto("/apply-freelance");

    await page.getByText("Google", { exact: true }).click();
    await page.getByRole("button", { name: /save and continue/i }).click();

    const fileInput = page.locator('input[type="file"]');
    const avatarPath = path.resolve(__dirname, "../fixtures/avatar.jpg");
    await fileInput.setInputFiles(avatarPath);

    const imagePreview = page.locator("img[alt='Profile Preview']");
    await expect(imagePreview).toBeVisible();

    await page.getByRole("button", { name: /save and continue/i }).click();

    await expect(page.getByText(/create freelancer profile/i)).toBeVisible();
  });
});
