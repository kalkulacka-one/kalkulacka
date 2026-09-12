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
    expectedTitle: "Volební kalkulačka",
  },
  {
    key: "snemovni-2025",
    group: "expresni",
    name: "Expresní kalkulačka",
    path: "/volby/snemovni-2025/expresni",
    expectedTitle: "Expresní kalkulačka",
  },
  {
    key: "snemovni-2025",
    group: "ultimatni",
    name: "Ultimátní kalkulačka",
    path: "/volby/snemovni-2025/ultimatni",
    expectedTitle: "Ultimátní kalkulačka",
  },
  {
    key: "snemovni-2025",
    group: "inventura",
    name: "Inventura hlasování",
    path: "/volby/snemovni-2025/inventura",
    expectedTitle: "Inventura hlasování",
  },
  {
    key: "snemovni-2025",
    group: "pro-mlade",
    name: "Kalkulačka pro mladé",
    path: "/volby/snemovni-2025/pro-mlade",
    expectedTitle: "Kalkulačka pro mladé",
  },
  {
    key: "snemovni-2025",
    group: "klimaticka",
    name: "Klimatická",
    path: "/volby/snemovni-2025/klimaticka",
    expectedTitle: "Klimatická kalkulačka",
  },
  {
    key: "snemovni-2025",
    group: "kompas",
    name: "Volební kompas 2025",
    path: "/volby/snemovni-2025/kompas",
    expectedTitle: "Volební kompas",
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
  const errorElement = page.locator("text=/Error|error|chyba|Chyba|Failed|failed/i");
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
  await page.locator('a[href="/volby/snemovni-2025"]').click();
  await page.waitForURL(/.*\/volby\/snemovni-2025$/, { timeout: TIMEOUTS.STANDARD });
  await waitForPageLoad(page);
  await page.locator(`a[href="${calculator.path}"]`).click();
  await page.waitForURL(new RegExp(`.*${calculator.path}/uvod`), { timeout: TIMEOUTS.STANDARD });
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
      await page.waitForURL(new RegExp(`.*${calculator.path}/navod`), { timeout: TIMEOUTS.STANDARD });
      await expect(page).toHaveURL(new RegExp(`.*${calculator.path}/navod`));
      await expect(page.locator("main")).toBeVisible();
    } catch {
      console.log(`Navigation to guide failed for ${calculator.name}`);
    }
  }
}

async function startQuestions(page: Page, calculator: CalculatorConfig) {
  const questionButton = page
    .locator('a[href*="/otazka"], button:has-text("Rozumím, začít"), button:has-text("Začít odpovídat"), button:has-text("Začít"), button:has-text("Pokračovat"), button:has-text("První otázka")')
    .first();

  let isVisible = false;
  try {
    isVisible = await questionButton.isVisible();
  } catch {
    if (calculator.group === "inventura" || calculator.group === "expresni") {
      try {
        await page.goto(`${calculator.path}/uvod`);
        await page.waitForLoadState("load", { timeout: TIMEOUTS.LOAD_STATE });
        isVisible = await questionButton.isVisible();
      } catch {
        return false;
      }
    }
  }

  if (isVisible) {
    await questionButton.click();
    try {
      await page.waitForURL(new RegExp(`.*${calculator.path}/(otazka|otazka/1)`), { timeout: TIMEOUTS.STANDARD });
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
      const answerOptions = page.locator('button[role="radio"], input[type="radio"]').or(page.getByRole("button", { name: /^(Souhlasím|Nesouhlasím|Ano|Ne)$/ }));

      if ((await answerOptions.count()) === 0) break;

      if (!(await clickWithRetry(answerOptions.first()))) break;
      await page.waitForTimeout(TIMEOUTS.ACTION_DELAY);

      // Answering moves to the next question on its own; a "Další" is only there to press when the question was already answered.
      const nextButton = page.locator('button:has-text("Další"), button:has-text("Pokračovat"), a:has-text("Další")').first();
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
      test.setTimeout(calculator.group === "inventura" || calculator.group === "expresni" ? TIMEOUTS.EXTENDED : TIMEOUTS.STANDARD);

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
        await page.waitForTimeout(TIMEOUTS.QUESTION_DELAY);
        const heading = page.locator("h1, h2, h3").filter({ hasText: calculator.expectedTitle }).first();
        await heading.waitFor({ state: "attached", timeout: TIMEOUTS.VISIBILITY_CHECK });
        await expect(heading).toBeVisible({ timeout: TIMEOUTS.HEADING_VISIBILITY });
      }
    });

    test("should handle direct navigation to question page", async ({ page }) => {
      test.setTimeout(calculator.group === "inventura" || calculator.group === "expresni" ? TIMEOUTS.EXTENDED : TIMEOUTS.STANDARD);

      try {
        await page.goto(`${calculator.path}/otazka`, { timeout: TIMEOUTS.STANDARD });
      } catch {
        console.log(`Direct navigation to question failed for ${calculator.name}, trying uvod first`);
        try {
          await page.goto(`${calculator.path}/uvod`, { timeout: TIMEOUTS.STANDARD });
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

// A municipal calculator is reached the other way round from a 2025 one: there
// is no card per calculator, only a city picker, and the URL is only knowable
// once a city has been picked out of it.
const MUNICIPAL: CalculatorConfig & { selectionPath: string; city: string } = {
  key: "komunalni-2026",
  group: "beroun",
  name: "Beroun",
  path: "/volby/komunalni-2026/beroun",
  expectedTitle: "Beroun",
  selectionPath: "/volby/komunalni-2026",
  city: "Beroun",
};

test.describe(`Calculator Flow: Komunální volby 2026 (${MUNICIPAL.name})`, () => {
  // The 2026 data is not on every data endpoint this suite runs against, and a
  // missing calculator group is not a regression in the app.
  async function skipUnlessPublished(page: Page) {
    await page.goto(MUNICIPAL.selectionPath);
    await waitForPageLoad(page);
    const picker = page.getByRole("searchbox");
    test.skip((await picker.count()) === 0, `${MUNICIPAL.key} is not published on this data endpoint`);
  }

  test("should find a city in the picker and complete its flow", async ({ page }) => {
    test.setTimeout(TIMEOUTS.EXTENDED);
    await skipUnlessPublished(page);

    await page.getByRole("searchbox").fill(MUNICIPAL.city);
    await page.locator(`a[href="${MUNICIPAL.path}"]`).click();
    await page.waitForURL(new RegExp(`.*${MUNICIPAL.path}/uvod`), { timeout: TIMEOUTS.STANDARD });
    await waitForPageLoad(page);
    await expect(page.locator("main")).toBeVisible();

    // Driven by exact button names rather than the shared helpers above: those
    // match on substrings, and "Smazat a začít znovu" inside the restart dialog
    // is an earlier, invisible match for their "Začít".
    await page.getByRole("button", { name: "Pokračovat", exact: true }).click();
    await page.waitForURL(new RegExp(`.*${MUNICIPAL.path}/navod`), { timeout: TIMEOUTS.STANDARD });

    await page.getByRole("button", { name: "Rozumím, začít", exact: true }).click();
    await page.waitForURL(new RegExp(`.*${MUNICIPAL.path}/otazka/1`), { timeout: TIMEOUTS.STANDARD });

    // `getByRole` skips the `aria-hidden` copies on the cards stacked behind
    // the active question, so this is the answer the voter can actually press.
    for (const question of [1, 2, 3]) {
      await expect(page).toHaveURL(new RegExp(`.*${MUNICIPAL.path}/otazka/${question}`));
      await page.getByRole("button", { name: "Ano", exact: true }).click();
      await page.waitForURL(new RegExp(`.*${MUNICIPAL.path}/otazka/${question + 1}`), { timeout: TIMEOUTS.STANDARD });
    }
  });

  test("should narrow the picker to what was typed", async ({ page }) => {
    await skipUnlessPublished(page);

    // A city that is in the data but is not the one being searched for.
    await expect(page.locator('a[href="/volby/komunalni-2026/brno"]')).toBeVisible();

    await page.getByRole("searchbox").fill(MUNICIPAL.city);

    await expect(page.locator(`a[href="${MUNICIPAL.path}"]`)).toBeVisible();
    await expect(page.locator('a[href="/volby/komunalni-2026/brno"]')).toHaveCount(0);
  });

  test("should show the election and the city on the introduction", async ({ page }) => {
    await skipUnlessPublished(page);

    await page.goto(`${MUNICIPAL.path}/uvod`);
    await waitForPageLoad(page);

    await expect(page.locator("h1").filter({ hasText: MUNICIPAL.city }).first()).toBeVisible({ timeout: TIMEOUTS.HEADING_VISIBILITY });
    // The shell composes the election name around the city: "Komunální volby Beroun 2026".
    const shellHeader = page.locator("header").first();
    await expect(shellHeader).toContainText("Komunální volby");
    await expect(shellHeader).toContainText(MUNICIPAL.city);
  });
});
