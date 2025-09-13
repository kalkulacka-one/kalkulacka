import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load and display main content", async ({ page }) => {
    await page.goto("/");

    // Check main heading in content (not header)
    await expect(page.locator("main h1")).toContainText("Volební kalkulačka je tady!");

    // Check election date information
    await expect(page.getByText("3. a 4. října 2025")).toBeVisible();

    // Check that the page is fully rendered
    await expect(page.locator("body")).toBeVisible();
  });

  test("should have functional calculator cards", async ({ page }) => {
    await page.goto("/");

    // Check inventura card
    const inventuraCard = page.locator("text=Inventura hlasování").locator("..").locator("..");
    await expect(inventuraCard).toBeVisible();
    await expect(inventuraCard.locator("text=Spustit inventuru")).toBeVisible();

    // Check pro mlade card
    const proMladeCard = page.locator("text=Kalkulačka pro mladé").locator("..").locator("..");
    await expect(proMladeCard).toBeVisible();
    await expect(proMladeCard.locator("text=Spustit kalkulačku")).toBeVisible();
  });

  test("should have working social media links", async ({ page }) => {
    await page.goto("/");

    // Check Instagram link
    const instagramLink = page.locator("a[href='https://instagram.com/volebnikalk']");
    await expect(instagramLink).toBeVisible();
    await expect(instagramLink).toHaveAttribute("target", "_blank");

    // Check X (Twitter) link
    const xLink = page.locator("a[href='https://x.com/volebnikalk']");
    await expect(xLink).toBeVisible();
    await expect(xLink).toHaveAttribute("target", "_blank");
  });

  test("should have subscribe form", async ({ page }) => {
    await page.goto("/");

    // The SubscribeForm component should be present
    // We can't test the exact implementation without knowing the component structure,
    // but we can check for common form elements that might be present
    const subscribeSection = page.locator("text=Nechte nám na sebe e-mail").locator("..").locator("..");
    await expect(subscribeSection).toBeVisible();
  });

  test("should navigate to inventura page", async ({ page }) => {
    await page.goto("/");

    // Click on inventura calculator link using the href attribute
    await page.locator('a[href="/volby/snemovni-2025/inventura"]').click();

    // Wait for navigation and redirect to complete with extended timeout
    await page.waitForURL(/.*\/volby\/snemovni-2025\/inventura\/uvod/, { timeout: 60000 });

    // Verify we're on the inventura introduction page
    await expect(page).toHaveURL(/.*\/volby\/snemovni-2025\/inventura\/uvod/);
  });

  test("should navigate to kalkulačka pro mladé page", async ({ page }) => {
    await page.goto("/");

    // Click on kalkulačka pro mladé calculator link using the href attribute
    await page.locator('a[href="/volby/snemovni-2025/pro-mlade"]').click();

    // Wait for navigation and redirect to complete with extended timeout
    await page.waitForURL(/.*\/volby\/snemovni-2025\/pro-mlade\/uvod/, { timeout: 60000 });

    // Verify we're on the pro mladé introduction page
    await expect(page).toHaveURL(/.*\/volby\/snemovni-2025\/pro-mlade\/uvod/);
  });

  test("should have proper page structure and accessibility", async ({ page }) => {
    await page.goto("/");

    // Check for proper heading hierarchy - should have multiple h1 elements
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Check footer is present
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.getByText("© 2025 Volební kalkulačka")).toBeVisible();

    // Check that images have alt attributes (if any)
    const images = page.locator("img");
    const imageCount = await images.count();
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        await expect(images.nth(i)).toHaveAttribute("alt");
      }
    }
  });
});
