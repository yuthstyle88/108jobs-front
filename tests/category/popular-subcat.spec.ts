import { test, expect } from "@playwright/test";

test.describe("PopularSubCat", () => {
  test("should display selected category and its subcategories", async ({ page }) => {
    await page.goto("/vi/categories/web-development");

    const heading = page.getByRole("heading", { name: /web development/i });
    await expect(heading).toBeVisible();

    const subLinks = page.locator("a[href^='/job/']");
    await expect(subLinks.first()).toBeVisible();
  });

  test("should open and close dropdown", async ({ page }) => {
    await page.goto("/vi/categories/web-development");

    const dropdownBtn = page.locator("button:has-text('Web Development')");
    await dropdownBtn.click();

    const dropdownMenu = page.locator("a[href^='/categories/']");
    await expect(dropdownMenu.first()).toBeVisible();

    await dropdownBtn.click();
    await expect(dropdownMenu.first()).not.toBeVisible();
  });

  test("should navigate to selected category from dropdown", async ({ page }) => {
    await page.goto("/vi/categories/web-development");

    await page.locator("button:has-text('Web Development')").click();

    const firstOption = page.locator("a[href^='/categories/']").first();
    const href = await firstOption.getAttribute("href");

    if (href) {
      await firstOption.click();
      await expect(page).toHaveURL(href);
    }
  });
});
