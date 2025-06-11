import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Freelancer Apply - Step 10 (Final Confirmation)", () => {
  test.use({ storageState: "storage/auth.json" });

  test("should confirm usage rules and apply successfully", async ({ page }) => {
    await page.goto("/apply-freelance");

    await page.getByText(/final verification step/i).click();
    await page.getByRole("button", { name: /save and continue/i }).click();

    await expect(page.getByText(/contact info usage/i)).toBeVisible();
    await expect(page.getByText(/no off-platform payment/i)).toBeVisible();
    await expect(page.getByText(/no illegal jobs/i)).toBeVisible();
    await expect(page.getByText(/use tools correctly/i)).toBeVisible();

    const swipe = page.locator('[data-testid="swipe-to-confirm"]');
    await swipe.dispatchEvent("mousedown");
    await swipe.dispatchEvent("mousemove", { clientX: 300 });
    await swipe.dispatchEvent("mouseup");

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    const confirmBtn = modal.getByRole("button", { name: /confirm/i });
    await confirmBtn.click();

    await page.waitForURL("**/apply-freelance/landing");
    await expect(page).toHaveURL(/.*\/apply-freelance\/landing/);
  });
});
