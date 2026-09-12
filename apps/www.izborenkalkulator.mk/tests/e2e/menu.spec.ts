import { expect, test } from "@playwright/test";

/*
 * The shell menu in the corner of every calculator screen: what it offers on
 * the site and inside a partner iframe, and that the mode it switches
 * survives a reload. This site has no single-mode partner theme, so there is
 * no themed embed to check the withheld toggle on — see the Czech app's
 * `menu.spec.ts` for that case.
 */

const INTRO = "/kompas-2025/voved";
const EMBED_INTRO = "/embed/default/kompas-2025/voved";

const MENU = "Мени";

test.describe("App menu", () => {
  test("offers help, dark mode, restart and leave on the site", async ({ page }) => {
    await page.goto(INTRO);
    await page.getByRole("button", { name: MENU }).click();

    await expect(page.getByRole("menuitem")).toHaveText([/^Како функционира/, /^Темен режим/, /^Почни одново/, /^Напушти го калкулаторот/]);

    // Escape closes it and hands focus back to the trigger.
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(page.getByRole("button", { name: MENU })).toBeFocused();
  });

  test("the help item opens the guide's steps as a sheet", async ({ page }) => {
    await page.goto(INTRO);
    await page.getByRole("button", { name: MENU }).click();
    await page.getByRole("menuitem", { name: /^Како функционира/ }).click();

    const dialog = page.getByRole("dialog", { name: "Како функционира" });
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
    await page.getByRole("menuitem", { name: /^Темен режим/ }).click();

    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe("dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

    // Labelled by what it switches *to*.
    await page.getByRole("button", { name: MENU }).click();
    await expect(page.getByRole("menuitem", { name: /^Светол режим/ })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /^Темен режим/ })).toHaveCount(0);
  });

  test("leaving asks first and then goes to the homepage", async ({ page }) => {
    await page.goto(INTRO);
    await page.getByRole("button", { name: MENU }).click();
    await page.getByRole("menuitem", { name: /^Напушти го калкулаторот/ }).click();

    const dialog = page.getByRole("dialog", { name: "Да го напуштите калкулаторот?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Откажи" }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${INTRO}$`));

    await page.getByRole("button", { name: MENU }).click();
    await page.getByRole("menuitem", { name: /^Напушти го калкулаторот/ }).click();
    await dialog.getByRole("button", { name: "Напушти", exact: true }).click();
    await page.waitForURL(/\/$/);
  });

  test("an embed keeps help and restart but drops leaving", async ({ page }) => {
    await page.goto(EMBED_INTRO);
    await page.getByRole("button", { name: MENU }).click();

    await expect(page.getByRole("menuitem", { name: /^Како функционира/ })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /^Почни одново/ })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /Напушти го калкулаторот/ })).toHaveCount(0);
  });
});
