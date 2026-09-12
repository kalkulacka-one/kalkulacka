import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { AppMenu } from "./app-menu";
import { LocaleProvider } from "./providers";

/* jsdom doesn't implement `<dialog>`'s `showModal()`/`close()` — the same minimum stub the design system's dialog tests use. */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

/* jsdom has no `matchMedia`; this stands in for the colour-scheme query the mode hook asks. */
function mockScheme(dark: boolean) {
  const query = { matches: dark, media: "(prefers-color-scheme: dark)", addEventListener: () => {}, removeEventListener: () => {} };
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: vi.fn(() => query) });
}

function renderMenu(props: Partial<AppMenu> = {}) {
  const onRestart = vi.fn();
  const onLeave = vi.fn();
  const user = userEvent.setup();
  render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <AppMenu onRestart={onRestart} onLeave={onLeave} {...props} />
    </LocaleProvider>,
  );
  return { user, onRestart, onLeave };
}

const trigger = () => screen.getByRole("button", { name: "Nabídka" });
const labels = () => screen.getAllByRole("menuitem").map((item) => item.querySelector("span > span")?.textContent);
const openDialog = () => screen.getAllByRole("dialog", { hidden: true }).find((dialog) => (dialog as HTMLDialogElement).open);

describe("AppMenu", () => {
  afterEach(() => {
    Reflect.deleteProperty(window, "matchMedia");
    localStorage.clear();
    delete document.documentElement.dataset.mode;
  });

  it("offers help, the mode switch, restart and leave, in that order", async () => {
    const { user } = renderMenu();
    await user.click(trigger());
    expect(labels()).toEqual(["Jak to funguje", "Tmavý režim", "Začít znovu", "Opustit kalkulačku"]);
    expect(screen.getByRole("menuitem", { name: /^Začít znovu/ })).toHaveTextContent("Smaže vaše odpovědi");
    expect(screen.getByRole("menuitem", { name: /^Opustit kalkulačku/ })).toHaveTextContent("Postup zůstane uložený");
  });

  it("labels the mode item by what it switches to", async () => {
    mockScheme(true);
    const { user } = renderMenu();
    await user.click(trigger());
    expect(screen.getByRole("menuitem", { name: /^Světlý režim/ })).toHaveTextContent("Přepne aplikaci do světlého vzhledu");
    expect(screen.queryByRole("menuitem", { name: /^Tmavý režim/ })).toBeNull();
  });

  it("switches the mode and relabels the item for the way back", async () => {
    mockScheme(false);
    const { user } = renderMenu();
    await user.click(trigger());
    await user.click(screen.getByRole("menuitem", { name: /^Tmavý režim/ }));

    expect(document.documentElement.dataset.mode).toBe("dark");
    expect(localStorage.getItem("ko-color-mode")).toBe("dark");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger()).toHaveFocus();

    await user.click(trigger());
    expect(screen.getByRole("menuitem", { name: /^Světlý režim/ })).toBeInTheDocument();
  });

  it("withholds the mode switch under a single-mode theme", async () => {
    const { user } = renderMenu({ colorModeToggle: false });
    await user.click(trigger());
    expect(labels()).toEqual(["Jak to funguje", "Začít znovu", "Opustit kalkulačku"]);
  });

  it("drops leaving inside an embed but keeps restarting", async () => {
    const { user } = renderMenu({ embed: true });
    await user.click(trigger());
    expect(labels()).toEqual(["Jak to funguje", "Tmavý režim", "Začít znovu"]);
  });

  it("keeps only help and the mode switch on a read-only screen", async () => {
    const { user } = renderMenu({ readOnly: true });
    await user.click(trigger());
    expect(labels()).toEqual(["Jak to funguje", "Tmavý režim"]);
  });

  it("opens the help sheet from the help item", async () => {
    const { user } = renderMenu();
    expect(openDialog()).toBeUndefined();

    await user.click(trigger());
    await user.click(screen.getByRole("menuitem", { name: /^Jak to funguje/ }));

    const dialog = openDialog();
    expect(dialog).toHaveAccessibleName("Jak to funguje");
    expect(dialog?.querySelectorAll("li")).toHaveLength(5);

    await user.click(screen.getByRole("button", { name: "Zavřít" }));
    expect(openDialog()).toBeUndefined();
  });

  it("asks before restarting, and restarts only on the confirming action", async () => {
    const { user, onRestart } = renderMenu();
    await user.click(trigger());
    await user.click(screen.getByRole("menuitem", { name: /^Začít znovu/ }));

    expect(openDialog()).toHaveAccessibleName("Začít znovu?");
    await user.click(screen.getByRole("button", { name: "Zrušit" }));
    expect(onRestart).not.toHaveBeenCalled();
    expect(openDialog()).toBeUndefined();

    await user.click(trigger());
    await user.click(screen.getByRole("menuitem", { name: /^Začít znovu/ }));
    await user.click(screen.getByRole("button", { name: "Smazat a začít znovu" }));
    expect(onRestart).toHaveBeenCalledTimes(1);
    expect(openDialog()).toBeUndefined();
  });

  it("asks before leaving, and leaves only on the confirming action", async () => {
    const { user, onLeave } = renderMenu();
    await user.click(trigger());
    await user.click(screen.getByRole("menuitem", { name: /^Opustit kalkulačku/ }));

    expect(openDialog()).toHaveAccessibleName("Opustit kalkulačku?");
    await user.click(screen.getByRole("button", { name: "Zrušit" }));
    expect(onLeave).not.toHaveBeenCalled();

    await user.click(trigger());
    await user.click(screen.getByRole("menuitem", { name: /^Opustit kalkulačku/ }));
    await user.click(screen.getByRole("button", { name: "Opustit" }));
    expect(onLeave).toHaveBeenCalledTimes(1);
    expect(openDialog()).toBeUndefined();
  });

  it("holds every sheet closed while the menu is idle, each under its own title", () => {
    renderMenu();
    const dialogs = screen.getAllByRole("dialog", { hidden: true });
    expect(dialogs).toHaveLength(3);
    for (const dialog of dialogs) expect(dialog).toHaveProperty("open", false);
    expect(new Set(dialogs.map((dialog) => dialog.getAttribute("aria-labelledby"))).size).toBe(3);
  });
});
