import { test, expect } from "@playwright/test";

test.describe("Freelancer Apply - Step 1", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should select a source and proceed to Step 2", async ({ page }) => {
    await page.goto("/apply-freelance");

    await expect(page.getByRole("heading", { name: /how did you hear/i })).toBeVisible();

    const googleOption = page.getByText("Google", { exact: true });
    await googleOption.click();

    await expect(googleOption).toHaveClass(/bg-secondary/);

    await page.getByRole("button", { name: /save and continue/i }).click();

    await expect(page.getByText(/choose profile picture/i)).toBeVisible();
  });
});
