import { test, expect } from "@playwright/test";

test.describe("Seller - My Services Page", () => {
  test.use({
    storageState: "storage/auth.json",
  });

  test("should display the My Services page with correct title", async ({ page }) => {
    await page.goto("/manage-product");

    await expect(page.locator("text=/.*dịch vụ của tôi.*/i")).toBeVisible();

    await expect(
      page.getByRole("button", { name: /thêm dịch vụ mới/i })
    ).toBeVisible();

    const jobRows = page.locator("table tbody tr");
    const jobCards = page.locator("div.rounded-lg.shadow-sm, div.shadow-sm.bg-white");

    await expect(jobRows.first().or(jobCards.first())).toBeVisible();

    const jobCount = await jobRows.count().catch(() => 0);
    const cardCount = await jobCards.count().catch(() => 0);

    expect(jobCount + cardCount).toBeGreaterThan(0);
  });
});
