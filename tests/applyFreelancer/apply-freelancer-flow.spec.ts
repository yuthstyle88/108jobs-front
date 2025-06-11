import { test, expect } from "@playwright/test";

test.describe("Freelancer Registration Flow", () => {
  test.use({
    storageState: "storage/auth.json", 
  });

  test("should complete first 3 steps of freelancer application", async ({ page }) => {
    await page.goto("/apply-freelance");

    await expect(page.getByRole("heading", { name: /apply/i })).toBeVisible();

    await page.getByLabel(/username/i).fill("testfreelancer");
    await page.getByLabel(/display name/i).fill("Test Freelancer");
    await page.getByLabel(/bio/i).fill("Tôi là freelancer thử nghiệm");

    await page.getByRole("button", { name: /next/i }).click();

    await expect(page.getByLabel(/birth date/i)).toBeVisible();
    await page.getByLabel(/birth date/i).fill("1995-01-01");
    await page.getByLabel(/email/i).fill("test@freelancer.com");

    await page.getByRole("button", { name: /next/i }).click();

    await expect(page.getByLabel(/card number/i)).toBeVisible();
    await page.getByLabel(/card number/i).fill("1234567890123");
    await page.getByLabel(/province/i).selectOption({ index: 1 });
    await page.getByLabel(/zip code/i).fill("10000");

    await page.getByRole("button", { name: /next/i }).click();

  });
});
