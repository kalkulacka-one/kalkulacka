import { expect, test } from "@playwright/test";

/*
 * The share dialog over the results: which actions it offers on a desktop
 * browser without a backend, and that "Stáhnout" really hands over a PNG.
 * The share assertions are ported from kalkulacka-2026/apps/web/e2e/calculator-flow.spec.ts.
 */

const FIRST_QUESTION = "/volby/snemovni-2025/kalkulacka/otazka/1";
const TOTAL_QUESTIONS = 42;

test.describe("Share dialog", () => {
  test("opens over the results with the desktop pair — no backend, no share sheet — and downloads the card", async ({ page }) => {
    // Forty-one keypresses through the deck, then the calculating beat.
    test.setTimeout(120_000);

    await page.goto(FIRST_QUESTION);
    // One answer is all a ranking needs; the card's rows come from it.
    await page.getByRole("button", { name: "Ano", exact: true }).click();
    await expect(page).toHaveURL(/\/otazka\/2$/);

    // `.` browses forward without touching the answer store (see
    // question-page.tsx); past the last question it is the recap's entrance.
    for (let position = 2; position <= TOTAL_QUESTIONS; position++) {
      await expect(page).toHaveURL(new RegExp(`/otazka/${position}$`));
      await page.keyboard.press(".");
    }
    await expect(page).toHaveURL(/\/rekapitulace$/);

    await page.getByRole("button", { name: "Zobrazit výsledky", exact: true }).click();
    await expect(page).toHaveURL(/\/vysledek$/);

    await page.getByRole("button", { name: "Sdílet", exact: true }).click();

    /*
     * Matched by role *and* name, which is the assertion that every `Dialog`
     * on this page (help, restart, leave, this one) labels itself rather than
     * borrowing a sibling's heading — they used to share one `aria-labelledby`
     * id derived from a CSS module class, so the browser resolved all four to
     * whichever came first in the DOM.
     */
    const dialog = page.getByRole("dialog", { name: "Sdílet výsledek" });
    await expect(dialog).toBeVisible();

    // No database locally: the sessions endpoint answers 500, so the session
    // status never becomes `ready`, the result page never receives
    // `onRequestShareLink`, and the dialog never renders "Kopírovat odkaz"
    // (see `session-status.tsx`, `result.tsx` and `share-dialog.tsx`).
    await expect(dialog.getByRole("button", { name: "Kopírovat odkaz", exact: true })).toHaveCount(0);

    // `Desktop Chrome` reports a fine, hovering pointer, which `chooseShareMode`
    // (see `packages/app/src/utilities/share-mode.ts`) always sends to the
    // copy/download pair — never the OS share sheet, regardless of what
    // `navigator.share` itself claims to support (the macOS Safari "Copy" trap
    // that pair exists to avoid). So the sheet's own label must be absent, not
    // merely optional.
    await expect(dialog.getByRole("button", { name: "Sdílet obrázek", exact: true })).toHaveCount(0);

    await expect(dialog.getByRole("button", { name: "Zkopírovat obrázek", exact: true })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Stáhnout", exact: true })).toBeVisible();

    // Four themes and two formats, the first of each pressed; a pick moves the pressed state.
    await expect(dialog.getByRole("button", { name: "Světlý", exact: true })).toHaveAttribute("aria-pressed", "true");
    await dialog.getByRole("button", { name: "Souhlas", exact: true }).click();
    await expect(dialog.getByRole("button", { name: "Souhlas", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(dialog.getByRole("button", { name: "Světlý", exact: true })).toHaveAttribute("aria-pressed", "false");
    await dialog.getByRole("button", { name: "Na šířku", exact: true }).click();
    await expect(dialog.getByRole("button", { name: "Na šířku", exact: true })).toHaveAttribute("aria-pressed", "true");

    // The download is a real PNG named after the card that was picked, and the status line says so.
    const download = page.waitForEvent("download");
    await dialog.getByRole("button", { name: "Stáhnout", exact: true }).click();
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/^shoda-[0-9a-f-]+-landscape-agree\.png$/);
    await expect(dialog.getByRole("status")).toHaveText("Obrázek uložen");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
