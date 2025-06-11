import { test, expect } from "@playwright/test";

test.describe("Seller - Create Service Step 2", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should add a service package and proceed to next step", async ({ page }) => {
    await page.goto("/manage-product/create");

    const categorySelect = page.locator('select[name="category"]');
    await categorySelect.selectOption({ index: 1 });

    const subCategorySelect = page.locator('select[name="type"]');
    await subCategorySelect.selectOption({ index: 1 });

    await page.getByPlaceholder(/service title/i).fill("Step 2 Test Job Title");
    await page.getByPlaceholder(/description/i).fill("Test job for step 2 Playwright test");

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    // Bắt đầu Step 2
    await expect(page.getByRole("heading", { name: /package/i })).toBeVisible();

    await page.locator('input[name="packages.0.package_name"]').fill("Basic Package");
    await page.locator('textarea[name="packages.0.description"]').fill("Mô tả gói cơ bản");
    await page.locator('input[name="packages.0.price"]').fill("100000");
    await page.locator('input[name="packages.0.execution_time"]').fill("2");

    await Promise.all([
      page.waitForNavigation({ waitUntil: "load" }),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await expect(page.getByRole("heading")).toContainText(/(image|gallery|step 3)/i);
  });
});
