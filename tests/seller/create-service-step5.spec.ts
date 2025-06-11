import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Seller - Create Service Step 5 (Confirm)", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should confirm all checkboxes and submit job", async ({ page }) => {
    await page.goto("/manage-product/create");

    await page.locator('select[name="category"]').selectOption({ index: 1 });
    await page.locator('select[name="type"]').selectOption({ index: 1 });
    await page.getByPlaceholder(/service title/i).fill("Step 5 Job");
    await page.getByPlaceholder(/description/i).fill("Step 5 test");

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await page.locator('input[name="packages.0.package_name"]').fill("Gói 1");
    await page.locator('textarea[name="packages.0.description"]').fill("Mô tả");
    await page.locator('input[name="packages.0.price"]').fill("300000");
    await page.locator('input[name="packages.0.execution_time"]').fill("2");

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await page.locator('input[type="file"]#cover-image').setInputFiles(path.resolve(__dirname, "../fixtures/cover.jpg"));
    await page.locator('input[type="file"]#service-images').setInputFiles([
      path.resolve(__dirname, "../fixtures/gallery1.jpg"),
      path.resolve(__dirname, "../fixtures/gallery2.jpg"),
    ]);
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await page.locator('textarea[name="worksteps.0.description"]').fill("Chuẩn bị");
    await page.locator('textarea[name="worksteps.1.description"]').fill("Thực hiện");
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await expect(page.getByRole("heading", { name: /confirm/i })).toBeVisible();

    await page.locator('input[type="checkbox"]#isOwner').check();
    await page.locator('input[type="checkbox"]#canComplete').check();
    await page.locator('input[type="checkbox"]#agreeTerms').check();

    await Promise.all([
      page.waitForNavigation({ waitUntil: "load" }),
      page.getByRole("button", { name: /submit/i }).click(),
    ]);

    await expect(page).toHaveURL(/\/manage-product\/.+/);
  });
});
