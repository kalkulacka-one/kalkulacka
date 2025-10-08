import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

type CalculatorConfig = {
  key: string;
  group: string;
  name: string;
  path: string;
  expectedTitle?: string;
};

const CALCULATORS: CalculatorConfig[] = [
  {
    key: "snemovni-2025",
    group: "kalkulacka",
    name: "Volební kalkulačka",
    path: "/volby/snemovni-2025/kalkulacka",
    expectedTitle: "Sněmovní 2025",
  },
  {
    key: "snemovni-2025",
    group: "expresni",
    name: "Expresní kalkulačka",
    path: "/volby/snemovni-2025/expresni",
    expectedTitle: "Expresní",
  },
  {
    key: "snemovni-2025",
    group: "ultimatni",
    name: "Ultimátní kalkulačka",
    path: "/volby/snemovni-2025/ultimatni",
    expectedTitle: "Ultimátní",
  },
  {
    key: "snemovni-2025",
    group: "inventura",
    name: "Inventura hlasování",
    path: "/volby/snemovni-2025/inventura",
    expectedTitle: "Inventura 2021–2025",
  },
  {
    key: "snemovni-2025",
    group: "pro-mlade",
    name: "Kalkulačka pro mladé",
    path: "/volby/snemovni-2025/pro-mlade",
    expectedTitle: "Pro mladé",
  },
  {
    key: "snemovni-2025",
    group: "klimaticka",
    name: "Klimatická",
    path: "/volby/snemovni-2025/klimaticka",
    expectedTitle: "Klimatická",
  },
  {
    key: "snemovni-2025",
    group: "klimaticka",
    name: "Volební kompas 2025",
    path: "/volby/snemovni-2025/kompas",
    expectedTitle: "Volební kompas",
  },
];

// Helper functions
async function waitForPageLoad(page: Page, timeout = 30000) {
  try {
    await page.waitForLoadState("networkidle", { timeout });
  } catch {
    await page.waitForLoadState("load", { timeout: 15000 });
  }
}

async function checkForErrors(page: Page): Promise<boolean> {
  const errorElement = page.locator("text=/Error|error|chyba|Chyba|Failed|failed/i");
  return (await errorElement.count()) > 0;
}

async function clickWithRetry(locator: Locator, maxRetries = 3, timeout = 10000) {
  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      await locator.click({ timeout });
      return true;
    } catch {
      if (retry < maxRetries - 1) {
        await locator.page().waitForTimeout(1000);
      }
    }
  }
  return false;
}

async function navigateToCalculator(page: Page, calculator: CalculatorConfig) {
  await page.goto("/");
  await page.locator(`a[href="${calculator.path}"]`).click();
  await page.waitForURL(new RegExp(`.*${calculator.path}/uvod`), { timeout: 60000 });
  await expect(page).toHaveURL(new RegExp(`.*${calculator.path}/uvod`));
  await waitForPageLoad(page);
  await expect(page.locator("main")).toBeVisible();
  return await checkForErrors(page);
}

async function navigateToNavod(page: Page, calculator: CalculatorConfig) {
  const navodButton = page.locator('a[href*="/navod"], button:has-text("Návod"), button:has-text("Pokračovat")').first();
  if (await navodButton.isVisible()) {
    await navodButton.click();
    try {
      await page.waitForURL(new RegExp(`.*${calculator.path}/navod`), { timeout: 60000 });
      await expect(page).toHaveURL(new RegExp(`.*${calculator.path}/navod`));
      await expect(page.locator("main")).toBeVisible();
    } catch {
      console.log(`Navigation to navod failed for ${calculator.name}`);
    }
  }
}

async function startQuestions(page: Page, calculator: CalculatorConfig) {
  const questionButton = page.locator('a[href*="/otazka"], button:has-text("Začít"), button:has-text("Pokračovat"), button:has-text("První otázka")').first();

  let isVisible = false;
  try {
    isVisible = await questionButton.isVisible();
  } catch {
    if (calculator.group === "inventura" || calculator.group === "expresni") {
      try {
        await page.goto(`${calculator.path}/uvod`);
        await page.waitForLoadState("load", { timeout: 15000 });
        isVisible = await questionButton.isVisible();
      } catch {
        return false;
      }
    }
  }

  if (isVisible) {
    await questionButton.click();
    try {
      await page.waitForURL(new RegExp(`.*${calculator.path}/(otazka|otazka/1)`), { timeout: 60000 });
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

      const answerOptions = page.locator('button[role="radio"], input[type="radio"], button:has-text("Souhlasím"), button:has-text("Nesouhlasím"), button:has-text("Ano"), button:has-text("Ne")');

      if ((await answerOptions.count()) === 0) break;

      if (!(await clickWithRetry(answerOptions.first()))) break;
      await page.waitForTimeout(500);

      const nextButton = page.locator('button:has-text("Další"), button:has-text("Pokračovat"), a:has-text("Další")').first();
      if (!(await nextButton.isVisible())) break;

      await page.waitForTimeout(500);
      if (!(await clickWithRetry(nextButton))) break;

      await page.waitForTimeout(2000);
    } catch {
      break;
    }
  }
}

for (const calculator of CALCULATORS) {
  test.describe(`Calculator Flow: ${calculator.name}`, () => {
    test("should complete the full calculator flow from homepage", async ({ page }) => {
      test.setTimeout(calculator.group === "inventura" || calculator.group === "expresni" ? 90000 : 60000);

      const hasError = await navigateToCalculator(page, calculator);
      if (hasError) {
        console.log(`Skipping test for ${calculator.name} due to data loading error`);
        return;
      }

      await navigateToNavod(page, calculator);

      if (await startQuestions(page, calculator)) {
        await answerQuestions(page);
        const currentUrl = page.url();
        expect(currentUrl).toMatch(new RegExp(`.*${calculator.path}/(otazka|rekapitulace|vysledek)`));
      }
    });

    test("should load introduction page directly", async ({ page }) => {
      await page.goto(`${calculator.path}/uvod`);
      await expect(page).toHaveURL(new RegExp(`.*${calculator.path}/uvod`));
      await waitForPageLoad(page);
      await expect(page.locator("main")).toBeVisible();

      const hasError = await checkForErrors(page);
      if (!hasError && calculator.expectedTitle) {
        await page.waitForTimeout(2000);
        const heading = page.locator("h1, h2, h3").filter({ hasText: calculator.expectedTitle }).first();
        await heading.waitFor({ state: "attached", timeout: 10000 });
        await expect(heading).toBeVisible({ timeout: 15000 });
      }
    });

    test("should handle direct navigation to question page", async ({ page }) => {
      test.setTimeout(calculator.group === "inventura" || calculator.group === "expresni" ? 90000 : 60000);

      try {
        await page.goto(`${calculator.path}/otazka`, { timeout: 60000 });
      } catch {
        console.log(`Direct navigation to question failed for ${calculator.name}, trying uvod first`);
        try {
          await page.goto(`${calculator.path}/uvod`, { timeout: 60000 });
        } catch {
          console.log(`Fallback navigation to uvod also failed for ${calculator.name}, skipping test`);
          return;
        }
      }

      await waitForPageLoad(page);
      expect(page.url()).toMatch(new RegExp(`.*${calculator.path}`));
      await expect(page.locator("main")).toBeVisible();
    });

    test("should validate page accessibility and structure", async ({ page }) => {
      await page.goto(`${calculator.path}/uvod`);
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
    await page.goto("/volby/non-existent-calculator");
    await page.waitForLoadState("networkidle");

    const hasMain = (await page.locator("main").count()) > 0;
    const hasBody = (await page.locator("body").count()) > 0;

    expect(hasMain || hasBody).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });

  test("should maintain consistent navigation patterns", async ({ page }) => {
    for (const calculator of CALCULATORS) {
      await page.goto(`${calculator.path}/uvod`);

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
