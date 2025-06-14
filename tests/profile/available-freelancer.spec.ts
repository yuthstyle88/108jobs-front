import { test, expect } from "@playwright/test";

test.describe("DocumentInfo Component", () => {
  test("should toggle job availability successfully", async ({ page }) => {
    await page.goto("/vi/account-setting");

    const toggle = page.locator('button[role="switch"]');
    await expect(toggle).toBeVisible();

    const isChecked = await toggle.getAttribute("aria-checked");

    // Toggle switch
    await toggle.click();

    await expect(
      page.getByText(/กำลังเปิดรับงานใหม่|กำลัง đóng nhận việc/i)
    ).toBeVisible();

    await toggle.click();
    await expect(
      page.getByText(/กำลังเปิดรับงานใหม่|กำลัง đóng nhận việc/i)
    ).toBeVisible();

    const isCheckedAfter = await toggle.getAttribute("aria-checked");
    expect(isCheckedAfter).not.toBe(isChecked);
  });

  test("should show error toast if API fails", async ({ page }) => {
    await page.route("**/api/v1/profile/update-available", (route) => {
      route.abort();
    });

    await page.goto("/vi/account-setting");

    const toggle = page.locator('button[role="switch"]');
    await toggle.click();

    await expect(page.getByText(/ไม่สามารถอัปเดตสถานะได้/i)).toBeVisible();
  });
});
