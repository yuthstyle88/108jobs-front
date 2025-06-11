import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Seller - Create Service Step 4 (Worksteps)", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should fill at least 2 worksteps and proceed to next step", async ({ page }) => {
    await page.goto("/manage-product/create");

    await page.locator('select[name="category"]').selectOption({ index: 1 });
    await page.locator('select[name="type"]').selectOption({ index: 1 });
    await page.getByPlaceholder(/service title/i).fill("Step 4 Job");
    await page.getByPlaceholder(/description/i).fill("Step 4 test");

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await page.locator('input[name="packages.0.package_name"]').fill("Gói 1");
    await page.locator('textarea[name="packages.0.description"]').fill("Mô tả gói 1");
    await page.locator('input[name="packages.0.price"]').fill("200000");
    await page.locator('input[name="packages.0.execution_time"]').fill("3");

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    const coverInput = page.locator('input[type="file"]#cover-image');
    const galleryInput = page.locator('input[type="file"]#service-images');

    await coverInput.setInputFiles(path.resolve(__dirname, "../fixtures/cover.jpg"));
    await galleryInput.setInputFiles([
      path.resolve(__dirname, "../fixtures/gallery1.jpg"),
      path.resolve(__dirname, "../fixtures/gallery2.jpg"),
    ]);

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await expect(page.getByRole("heading", { name: /workflow/i })).toBeVisible();

    await page.locator('textarea[name="worksteps.0.description"]').fill("Bước 1: Chuẩn bị");
    await page.locator('textarea[name="worksteps.1.description"]').fill("Bước 2: Triển khai");

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await expect(page.getByRole("heading")).toContainText(/(pricing|delivery|step 5)/i);
  });
});
