import { expect, test } from "@playwright/test";

/*
 * The share dialog over the results: which actions it offers on a desktop
 * browser without a backend, and that "Stiahnuť" really hands over a PNG.
 * The share assertions are ported from kalkulacka-2026/apps/web/e2e/calculator-flow.spec.ts.
 */

const FIRST_QUESTION = "/inventura-2023-2025/otazka/1";
const TOTAL_QUESTIONS = 21;

test.describe("Share dialog", () => {
  test("opens over the results with the desktop pair — no backend, no share sheet — and downloads the card", async ({ page }) => {
    // Twenty keypresses through the deck, then the calculating beat.
    test.setTimeout(120_000);

    await page.goto(FIRST_QUESTION);
    // One answer is all a ranking needs; the card's rows come from it.
    await page.getByRole("button", { name: "Áno", exact: true }).click();
    await expect(page).toHaveURL(/\/otazka\/2$/);

    // `.` browses forward without touching the answer store (see
    // question-page.tsx); past the last question it is the recap's entrance.
    for (let position = 2; position <= TOTAL_QUESTIONS; position++) {
      await expect(page).toHaveURL(new RegExp(`/otazka/${position}$`));
      await page.keyboard.press(".");
    }
    await expect(page).toHaveURL(/\/rekapitulacia$/);

    await page.getByRole("button", { name: "Zobraziť výsledky", exact: true }).click();
    await expect(page).toHaveURL(/\/vysledok$/);

    await page.getByRole("button", { name: "Zdieľať", exact: true }).click();

    /*
     * Matched by role *and* name, which is the assertion that every `Dialog`
     * on this page (help, restart, leave, this one) labels itself rather than
     * borrowing a sibling's heading.
     */
    const dialog = page.getByRole("dialog", { name: "Zdieľať výsledok" });
    await expect(dialog).toBeVisible();

    // No database locally: the sessions endpoint answers 500, so the session
    // status never becomes `ready`, the result page never receives
    // `onRequestShareLink`, and the dialog never renders "Kopírovať odkaz"
    // (see `session-status.tsx`, `result.tsx` and `share-dialog.tsx`).
    await expect(dialog.getByRole("button", { name: "Kopírovať odkaz", exact: true })).toHaveCount(0);

    // `Desktop Chrome` reports a fine, hovering pointer, which `chooseShareMode`
    // (see `packages/app/src/utilities/share-mode.ts`) always sends to the
    // copy/download pair — never the OS share sheet, regardless of what
    // `navigator.share` itself claims to support. So the sheet's own label
    // must be absent, not merely optional.
    await expect(dialog.getByRole("button", { name: "Zdieľať obrázok", exact: true })).toHaveCount(0);

    await expect(dialog.getByRole("button", { name: "Skopírovať obrázok", exact: true })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Stiahnuť", exact: true })).toBeVisible();

    // Four themes and two formats, the first of each pressed; a pick moves the pressed state.
    await expect(dialog.getByRole("button", { name: "Svetlý", exact: true })).toHaveAttribute("aria-pressed", "true");
    await dialog.getByRole("button", { name: "Súhlas", exact: true }).click();
    await expect(dialog.getByRole("button", { name: "Súhlas", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(dialog.getByRole("button", { name: "Svetlý", exact: true })).toHaveAttribute("aria-pressed", "false");
    await dialog.getByRole("button", { name: "Na šírku", exact: true }).click();
    await expect(dialog.getByRole("button", { name: "Na šírku", exact: true })).toHaveAttribute("aria-pressed", "true");

    // The download is a real PNG named after the card that was picked, and the status line says so.
    const download = page.waitForEvent("download");
    await dialog.getByRole("button", { name: "Stiahnuť", exact: true }).click();
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/^shoda-[0-9a-f-]+-landscape-agree\.png$/);
    await expect(dialog.getByRole("status")).toHaveText("Obrázok uložený");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
