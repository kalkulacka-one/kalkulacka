import type { APIRequestContext, Page } from "@playwright/test";
import { test as base, expect } from "@playwright/test";

import { routeSlugs } from "@/config/route-slugs";

import { vocabulary } from "./vocabulary";

/**
 * Smoke suite against live election content (contract T9b): every calculator the site links to
 * completes its flow and renders a result. Calculators are discovered from the running app and
 * the assertions are structural – no titles, counts or values from the content – so content
 * changes never require a test change. The file is identical in every instance: the slugs come
 * from the app's config and the four core words from the vocabulary file next to this one.
 */

const [slugs] = Object.values(routeSlugs);
if (!slugs) throw new Error("route-slugs.ts declares no locale");

const pages = {
  introduction: `/${slugs.pages.introduction}`,
  guide: `/${slugs.pages.guide}`,
  question: `/${slugs.pages.question}`,
  review: `/${slugs.pages.review}`,
  result: `/${slugs.pages.result}`,
} as const;

const limits = { crawlDepth: 3, crawlPages: 50, questions: 200 } as const;
const timeouts = { request: 60_000, navigation: 60_000, step: 30_000, introduction: 60_000, flow: 240_000 } as const;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const endsWith = (path: string) => new RegExp(`${escapeRegExp(path)}$`);
const toPath = (location: string) => new URL(location, "http://localhost").pathname;
const isPage = (path: string) => path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/_next/") && !path.startsWith("/api/") && !/\.[a-z0-9]+$/i.test(path);

function internalLinks(html: string): string[] {
  const links = new Set<string>();
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1]?.replace(/&amp;/g, "&");
    if (href && isPage(href)) links.add(toPath(href));
  }
  return [...links];
}

/** Follows internal links from the homepage; a path whose root redirects to an introduction page is a calculator. */
async function discoverCalculators(context: APIRequestContext): Promise<string[]> {
  const calculators = new Set<string>();
  const visited = new Set<string>();
  const queue: { path: string; depth: number }[] = [{ path: "/", depth: 0 }];
  const found = (introductionPath: string) => calculators.add(introductionPath.slice(0, -pages.introduction.length));

  while (visited.size < limits.crawlPages) {
    const next = queue.shift();
    if (!next) break;
    if (visited.has(next.path)) continue;
    visited.add(next.path);

    const response = await context.get(next.path, { maxRedirects: 0, timeout: timeouts.request });
    const location = response.headers().location;
    if (location) {
      const target = toPath(location);
      if (target.endsWith(pages.introduction)) found(target);
      else if (isPage(target)) queue.push({ path: target, depth: next.depth });
      continue;
    }
    if (!response.ok() || next.depth >= limits.crawlDepth) continue;

    for (const link of internalLinks(await response.text())) {
      if (link.endsWith(pages.introduction)) found(link);
      else queue.push({ path: link, depth: next.depth + 1 });
    }
  }

  return [...calculators].sort();
}

let discovery: Promise<string[]> | undefined;

const test = base.extend<{ calculators: string[] }>({
  calculators: async ({ request }, use) => {
    // Discover once per worker and print the list, so the CI log shows what was covered.
    discovery ??= discoverCalculators(request).then((calculators) => {
      console.log(`Smoke: ${calculators.length} calculator(s) reachable from the homepage\n${calculators.map((calculator) => `  ${calculator}`).join("\n")}`);
      return calculators;
    });
    const calculators = await discovery;
    expect(calculators, "no calculator is reachable from the homepage").not.toEqual([]);
    await use(calculators);
  },
});

async function expectPageShell(page: Page) {
  await expect(page.locator("main")).toBeVisible({ timeout: timeouts.step });
  await expect(page.locator("h1").first()).toBeVisible();
}

// An answer control is identified by its accessible name; it may be a switch or a toggle button.
const answerControl = (page: Page, name: string) => page.getByRole("switch", { name }).or(page.getByRole("button", { name })).first();

// An action is identified by its accessible name; it may be a button or a link.
const action = (page: Page, name: string) => page.getByRole("button", { name }).or(page.getByRole("link", { name })).first();

async function answerEveryQuestion(page: Page, calculator: string) {
  const reviewUrl = endsWith(calculator + pages.review);
  for (let answered = 0; answered < limits.questions; answered++) {
    if (reviewUrl.test(page.url())) return;
    const before = page.url();
    // Choosing an answer advances to the next question, and after the last one to the review.
    await answerControl(page, vocabulary.yes).click({ timeout: timeouts.step });
    await page.waitForURL((url) => url.toString() !== before, { timeout: timeouts.step });
  }
  throw new Error(`${calculator} did not reach its review page within ${limits.questions} questions`);
}

async function completeFlow(page: Page, calculator: string) {
  await page.goto(calculator + pages.introduction, { timeout: timeouts.navigation });
  await expectPageShell(page);

  await action(page, vocabulary.continue).click({ timeout: timeouts.step });
  await page.waitForURL(endsWith(calculator + pages.guide), { timeout: timeouts.navigation });
  await expectPageShell(page);

  await action(page, vocabulary.start).click({ timeout: timeouts.step });
  await page.waitForURL(new RegExp(`${escapeRegExp(calculator + pages.question)}/\\d+$`), { timeout: timeouts.navigation });
  await answerEveryQuestion(page, calculator);
  await expectPageShell(page);

  await action(page, vocabulary.showResults).click({ timeout: timeouts.step });
  await page.waitForURL(endsWith(calculator + pages.result), { timeout: timeouts.navigation });
  await expectPageShell(page);
  await expect(page.getByText(/\d+\s?%/).first()).toBeVisible({ timeout: timeouts.step });
}

test.describe("Calculator smoke", () => {
  test("every linked calculator renders its introduction", async ({ page, calculators }) => {
    test.setTimeout(timeouts.introduction * calculators.length);
    for (const calculator of calculators) {
      await test.step(calculator, async () => {
        await page.goto(calculator + pages.introduction, { timeout: timeouts.navigation });
        await expect(page).toHaveURL(endsWith(calculator + pages.introduction));
        await expectPageShell(page);
        for (const image of await page.locator("img").all()) {
          await expect(image).toHaveAttribute("alt");
        }
      });
    }
  });

  test("every linked calculator completes its flow and renders a result", async ({ page, calculators }) => {
    test.setTimeout(timeouts.flow * calculators.length);
    for (const calculator of calculators) {
      await test.step(calculator, () => completeFlow(page, calculator));
    }
  });

  test("an unknown calculator path is a not-found page, not a crash", async ({ page }) => {
    const response = await page.goto(`/${slugs.prefixes.election}/unknown-calculator`, { timeout: timeouts.navigation });
    expect(response?.status()).toBe(404);
    await expect(page.locator("body")).toBeVisible();
  });
});
