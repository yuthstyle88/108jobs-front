import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Seller - Create Service Step 3", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should upload cover and gallery images and proceed to next step", async ({ page }) => {
    await page.goto("/manage-product/create");

    await page.locator('select[name="category"]').selectOption({ index: 1 });
    await page.locator('select[name="type"]').selectOption({ index: 1 });
    await page.getByPlaceholder(/service title/i).fill("Job With Media EditForm");
    await page.getByPlaceholder(/description/i).fill("Step 3 Media Upload");

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    // Step 2
    await page.locator('input[name="packages.0.package_name"]').fill("Gói cơ bản");
    await page.locator('textarea[name="packages.0.description"]').fill("Mô tả test");
    await page.locator('input[name="packages.0.price"]').fill("100000");
    await page.locator('input[name="packages.0.execution_time"]').fill("2");

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await expect(page.getByRole("heading", { name: /upload/i })).toBeVisible();

    const coverInput = page.locator('input[type="file"]#cover-image');
    const coverPath = path.resolve(__dirname, "../fixtures/cover.jpg");
    await coverInput.setInputFiles(coverPath);

    const galleryInput = page.locator('input[type="file"]#service-images');
    const galleryPath1 = path.resolve(__dirname, "../fixtures/gallery1.jpg");
    const galleryPath2 = path.resolve(__dirname, "../fixtures/gallery2.jpg");
    await galleryInput.setInputFiles([galleryPath1, galleryPath2]);

    await Promise.all([
      page.waitForNavigation({ waitUntil: "load" }),
      page.getByRole("button", { name: /next/i }).click(),
    ]);

    await expect(page.getByRole("heading")).toContainText(/(step 4|detail|price|delivery)/i);
  });
});
