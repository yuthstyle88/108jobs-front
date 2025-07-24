import { test, expect } from "@playwright/test";

test.describe("Seller - Create Service Step 1", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should create a new service in step 1 and redirect to edit page", async ({ page }) => {
    await page.goto("/manage-product/create");

    await expect(page.getByRole("heading", { name: /service info/i })).toBeVisible();

    const categorySelect = page.locator('select[name="category"]');
    await categorySelect.selectOption({ index: 1 }); 

    const subCategorySelect = page.locator('select[name="type"]');
    await expect(subCategorySelect).toBeEnabled();
    await subCategorySelect.selectOption({ index: 1 });

    await page.getByPlaceholder(/service title/i).fill("EditForm Playwright Job Title");

    await page.getByPlaceholder(/description/i).fill("This is a test job created by Playwright for testing step 1.");

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await expect(page).toHaveURL(/\/manage-product\/.+/);
    await expect(page.getByRole("heading", { name: /edit/i })).toBeVisible();
  });
});
