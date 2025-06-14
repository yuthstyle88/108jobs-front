import { test, expect } from "@playwright/test";

test.describe("Job Detail Page", () => {
  test("should render job detail and allow tab switching", async ({ page }) => {
    await page.goto("/vi/user/luckystation/kaebbaebnen-rsamhrabaichngaan-8518dfbe");

    await expect(page.getByRole("heading", { name: /overview/i })).toBeVisible();
    await expect(page.getByText("Packages")).toBeVisible();
    await expect(page.getByText("Reviews")).toBeVisible();

    await expect(page.getByText(/ทำเว็บไซต์ Wordpress/)).toBeVisible();

    await page.getByText("Packages").click();
    await expect(page.locator("text=Package Options")).toBeVisible();

    await page.getByText("Freelancer").click();
    await expect(page.locator("text=About the Freelancer")).toBeVisible();

    await page.getByText("Reviews").click();
    await expect(page.locator("text=Client Reviews")).toBeVisible();
  });

  test("should show AsideJob on mobile and desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto("/vi/user/luckystation/kaebbaebnen-rsamhrabaichngaan-8518dfbe");

    const aside = page.locator("aside");
    await expect(aside).toBeVisible();
  });

  test("should render breadcrumb correctly", async ({ page }) => {
    await page.goto("/vi/user/luckystation/kaebbaebnen-rsamhrabaichngaan-8518dfbe");

    const breadcrumb = page.locator('[data-testid="breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText("หมวดหมู่งานทั้งหมด")).toBeVisible();
  });
});
