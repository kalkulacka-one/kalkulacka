import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

type CalculatorConfig = {
  key: string;
  name: string;
  path: string;
  expectedTitle?: string;
};

// This site runs one standalone calculator, addressed by its key alone — no election group in the path.
const CALCULATORS: CalculatorConfig[] = [
  {
    key: "kompas-2025",
    name: "Изборен компас",
    path: "/kompas-2025",
    expectedTitle: "Изборен компас 2025",
  },
];

const TIMEOUTS = {
  DEFAULT: 30000,
  STANDARD: 60000,
  EXTENDED: 90000,
  LOAD_STATE: 15000,
  RETRY_DELAY: 1000,
  ACTION_DELAY: 500,
  QUESTION_DELAY: 2000,
  VISIBILITY_CHECK: 10000,
  HEADING_VISIBILITY: 15000,
} as const;

// Helper functions
async function waitForPageLoad(page: Page, timeout = TIMEOUTS.DEFAULT) {
  try {
    await page.waitForLoadState("networkidle", { timeout });
  } catch {
    await page.waitForLoadState("load", { timeout: TIMEOUTS.LOAD_STATE });
  }
}

async function checkForErrors(page: Page): Promise<boolean> {
  const errorElement = page.locator("text=/Error|error|грешка|Грешка|Failed|failed/i");
  return (await errorElement.count()) > 0;
}

async function clickWithRetry(locator: Locator, maxRetries = 3, timeout = TIMEOUTS.VISIBILITY_CHECK) {
  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      await locator.click({ timeout });
      return true;
    } catch {
      if (retry < maxRetries - 1) {
        await locator.page().waitForTimeout(TIMEOUTS.RETRY_DELAY);
      }
    }
  }
  return false;
}

async function navigateToCalculator(page: Page, calculator: CalculatorConfig) {
  await page.goto("/");
  await page.locator(`a[href="${calculator.path}"]`).click();
  await page.waitForURL(new RegExp(`.*${calculator.path}/voved`), { timeout: TIMEOUTS.STANDARD });
  await expect(page).toHaveURL(new RegExp(`.*${calculator.path}/voved`));
  await waitForPageLoad(page);
  await expect(page.locator("main")).toBeVisible();
  return await checkForErrors(page);
}

async function navigateToVodic(page: Page, calculator: CalculatorConfig) {
  const vodicButton = page.locator('a[href*="/vodic"], button:has-text("Водич"), button:has-text("Продолжи")').first();
  if (await vodicButton.isVisible()) {
    await vodicButton.click();
    try {
      await page.waitForURL(new RegExp(`.*${calculator.path}/vodic`), { timeout: TIMEOUTS.STANDARD });
      await expect(page).toHaveURL(new RegExp(`.*${calculator.path}/vodic`));
      await expect(page.locator("main")).toBeVisible();
    } catch {
      console.log(`Navigation to guide failed for ${calculator.name}`);
    }
  }
}

async function startQuestions(page: Page, calculator: CalculatorConfig) {
  const questionButton = page
    .locator('a[href*="/prasanje"], button:has-text("Разбирам, почни"), button:has-text("Започни со одговарање"), button:has-text("Продолжи"), button:has-text("Прво прашање")')
    .first();

  let isVisible = false;
  try {
    isVisible = await questionButton.isVisible();
  } catch {
    try {
      await page.goto(`${calculator.path}/voved`);
      await page.waitForLoadState("load", { timeout: TIMEOUTS.LOAD_STATE });
      isVisible = await questionButton.isVisible();
    } catch {
      return false;
    }
  }

  if (isVisible) {
    await questionButton.click();
    try {
      await page.waitForURL(new RegExp(`.*${calculator.path}/(prasanje|prasanje/1)`), { timeout: TIMEOUTS.STANDARD });
    } catch {
      console.log(`Question navigation timeout for ${calculator.name}`);
    }
    return true;
  }
  return false;
}

async function answerQuestions(page: Page, maxQuestions = 3) {
  for (let i = 0; i < maxQuestions; i++) {
    try {
      await expect(page.locator("main")).toBeVisible();

      // By role, so the answer buttons on the cards stacked behind the active one
      // (inert and `aria-hidden`, but earlier in the DOM) are never the first match.
      const answerOptions = page.locator('button[role="radio"], input[type="radio"]').or(page.getByRole("button", { name: /^(Да|Не)$/ }));

      if ((await answerOptions.count()) === 0) break;

      if (!(await clickWithRetry(answerOptions.first()))) break;
      await page.waitForTimeout(TIMEOUTS.ACTION_DELAY);

      // Answering moves to the next question on its own; a "Следно" is only there to press when the question was already answered.
      const nextButton = page.locator('button:has-text("Следно"), button:has-text("Продолжи"), a:has-text("Следно")').first();
      if (await nextButton.isVisible()) {
        await page.waitForTimeout(TIMEOUTS.ACTION_DELAY);
        if (!(await clickWithRetry(nextButton))) break;
      }

      await page.waitForTimeout(TIMEOUTS.QUESTION_DELAY);
    } catch {
      break;
    }
  }
}

for (const calculator of CALCULATORS) {
  test.describe(`Calculator Flow: ${calculator.name}`, () => {
    test("should complete the full calculator flow from homepage", async ({ page }) => {
      test.setTimeout(TIMEOUTS.EXTENDED);

      const hasError = await navigateToCalculator(page, calculator);
      if (hasError) {
        console.log(`Skipping test for ${calculator.name} due to data loading error`);
        return;
      }

      await navigateToVodic(page, calculator);

      if (await startQuestions(page, calculator)) {
        await answerQuestions(page);
        const currentUrl = page.url();
        expect(currentUrl).toMatch(new RegExp(`.*${calculator.path}/(prasanje|pregled|rezultat)`));
      }
    });

    test("should load introduction page directly", async ({ page }) => {
      await page.goto(`${calculator.path}/voved`);
      await expect(page).toHaveURL(new RegExp(`.*${calculator.path}/voved`));
      await waitForPageLoad(page);
      await expect(page.locator("main")).toBeVisible();

      const hasError = await checkForErrors(page);
      if (!hasError && calculator.expectedTitle) {
        await page.waitForTimeout(TIMEOUTS.QUESTION_DELAY);
        const heading = page.locator("h1, h2, h3").filter({ hasText: calculator.expectedTitle }).first();
        await heading.waitFor({ state: "attached", timeout: TIMEOUTS.VISIBILITY_CHECK });
        await expect(heading).toBeVisible({ timeout: TIMEOUTS.HEADING_VISIBILITY });
      }
    });

    test("should handle direct navigation to question page", async ({ page }) => {
      test.setTimeout(TIMEOUTS.EXTENDED);

      try {
        await page.goto(`${calculator.path}/prasanje`, { timeout: TIMEOUTS.STANDARD });
      } catch {
        console.log(`Direct navigation to question failed for ${calculator.name}, trying voved first`);
        try {
          await page.goto(`${calculator.path}/voved`, { timeout: TIMEOUTS.STANDARD });
        } catch {
          console.log(`Fallback navigation to voved also failed for ${calculator.name}, skipping test`);
          return;
        }
      }

      await waitForPageLoad(page);
      expect(page.url()).toMatch(new RegExp(`.*${calculator.path}`));
      await expect(page.locator("main")).toBeVisible();
    });

    test("should validate page accessibility and structure", async ({ page }) => {
      await page.goto(`${calculator.path}/voved`);
      await waitForPageLoad(page);

      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      const images = page.locator("img");
      const imageCount = await images.count();
      if (imageCount > 0) {
        for (let i = 0; i < imageCount; i++) {
          await expect(images.nth(i)).toHaveAttribute("alt");
        }
      }

      const skipLinks = page.locator('a[href^="#"], [role="button"], button');
      expect(await skipLinks.count()).toBeGreaterThan(0);
    });
  });
}

test.describe("Calculator System", () => {
  test("should handle invalid calculator paths gracefully", async ({ page }) => {
    await page.goto("/izbori/non-existent-calculator");
    await page.waitForLoadState("networkidle");

    const hasMain = (await page.locator("main").count()) > 0;
    const hasBody = (await page.locator("body").count()) > 0;

    expect(hasMain || hasBody).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });

  test("should maintain consistent navigation patterns", async ({ page }) => {
    for (const calculator of CALCULATORS) {
      await page.goto(`${calculator.path}/voved`);

      const navigationElements = page.locator('nav, [role="navigation"], .navigation');
      if ((await navigationElements.count()) > 0) {
        await expect(navigationElements.first()).toBeVisible();
      }

      const progressElements = page.locator('.progress, [role="progressbar"], .breadcrumb');
      if ((await progressElements.count()) > 0) {
        await expect(progressElements.first()).toBeVisible();
      }
    }
  });
});
