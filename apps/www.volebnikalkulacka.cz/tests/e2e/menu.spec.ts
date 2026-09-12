import { expect, test } from "@playwright/test";

/*
 * The shell menu in the corner of every calculator screen: what it offers on
 * the site, inside a partner iframe, and under a single-mode partner theme —
 * and that the mode it switches survives a reload.
 */

const INTRO = "/volby/snemovni-2025/kalkulacka/uvod";
const EMBED_INTRO = "/embed/idnes/volby/snemovni-2025/kalkulacka/uvod";
const THEMED_EMBED_INTRO = "/embed/alarm/volby/snemovni-2025/kalkulacka/uvod";

const MENU = "Nabídka";

test.describe("App menu", () => {
  test("offers help, dark mode, restart and leave on the site", async ({ page }) => {
    await page.goto(INTRO);
    await page.getByRole("button", { name: MENU }).click();

    await expect(page.getByRole("menuitem")).toHaveText([/^Jak to funguje/, /^Tmavý režim/, /^Začít znovu/, /^Opustit kalkulačku/]);

    // Escape closes it and hands focus back to the trigger.
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(page.getByRole("button", { name: MENU })).toBeFocused();
  });

  test("the help item opens the guide's steps as a sheet", async ({ page }) => {
    await page.goto(INTRO);
    await page.getByRole("button", { name: MENU }).click();
    await page.getByRole("menuitem", { name: /^Jak to funguje/ }).click();

    const dialog = page.getByRole("dialog", { name: "Jak to funguje" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("listitem")).toHaveCount(5);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    // Dismissing the sheet returns focus to the menu it was opened from, not to the top of the document.
    await expect(page.getByRole("button", { name: MENU })).toBeFocused();
  });

  test("switching to dark mode is applied at once and remembered across a reload", async ({ page }) => {
    await page.goto(INTRO);
    await page.getByRole("button", { name: MENU }).click();
    await page.getByRole("menuitem", { name: /^Tmavý režim/ }).click();

    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe("dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

    // Labelled by what it switches *to*.
    await page.getByRole("button", { name: MENU }).click();
    await expect(page.getByRole("menuitem", { name: /^Světlý režim/ })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /^Tmavý režim/ })).toHaveCount(0);
  });

  test("leaving asks first and then goes to the homepage", async ({ page }) => {
    await page.goto(INTRO);
    await page.getByRole("button", { name: MENU }).click();
    await page.getByRole("menuitem", { name: /^Opustit kalkulačku/ }).click();

    const dialog = page.getByRole("dialog", { name: "Opustit kalkulačku?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Zrušit" }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${INTRO}$`));

    await page.getByRole("button", { name: MENU }).click();
    await page.getByRole("menuitem", { name: /^Opustit kalkulačku/ }).click();
    await dialog.getByRole("button", { name: "Opustit", exact: true }).click();
    await page.waitForURL(/\/$/);
  });

  test("an embed keeps help and restart but drops leaving", async ({ page }) => {
    await page.goto(EMBED_INTRO);
    await page.getByRole("button", { name: MENU }).click();

    await expect(page.getByRole("menuitem", { name: /^Jak to funguje/ })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /^Začít znovu/ })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /Opustit kalkulačku/ })).toHaveCount(0);
  });

  test("a themed partner embed stays light and withholds the dead mode toggle", async ({ page }) => {
    // A dark preference stored on the main site must not leak into a
    // single-mode partner theme — that combination (partner accents on the
    // default theme's dark surfaces) is a palette nobody authored.
    await page.addInitScript(() => localStorage.setItem("ko-color-mode", "dark"));
    await page.goto(THEMED_EMBED_INTRO);

    // The stored override is on the element (the bootstrap ran), but the
    // single-mode theme's colour-scheme pin outranks it.
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe("light");

    await page.getByRole("button", { name: MENU }).click();
    await expect(page.getByRole("menuitem", { name: /^Jak to funguje/ })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /režim/ })).toHaveCount(0);
  });
});
