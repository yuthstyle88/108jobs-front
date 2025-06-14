import { test, expect } from "@playwright/test";

test.describe("Category Detail Page", () => {
  test("should render category page with job cards and filters", async ({ page }) => {
    await page.goto("/vi/job/seo-marketing");

    await expect(page.getByRole("heading", { name: /hire freelancer/i })).toBeVisible();

    await expect(page.getByText(/filter/i)).toBeVisible();
    await expect(page.getByText(/sort/i)).toBeVisible();

    const jobCards = page.locator("[data-testid='job-card']");
    await expect(jobCards.first()).toBeVisible();

    const pagination = page.locator("[data-testid='pagination']");
    if (await pagination.count()) {
      await expect(pagination).toBeVisible();
    }
  });

  test("should change page on pagination click", async ({ page }) => {
    await page.goto("/vi/job/seo-marketing");

    const nextPageBtn = page.locator('[aria-label="Go to page 2"]');
    if (await nextPageBtn.count()) {
      await nextPageBtn.click();
      await expect(page).toHaveURL(/page=2/);
    }
  });

  test("should apply tag filter", async ({ page }) => {
    await page.goto("/vi/job/seo-marketing");

    const tagButton = page.locator('[data-testid="tag-button"]').first(); 
    if (await tagButton.count()) {
      const tagText = await tagButton.textContent();
      await tagButton.click();
      await expect(page).toHaveURL(new RegExp(`q=${tagText?.trim()}`));
    }
  });
});
