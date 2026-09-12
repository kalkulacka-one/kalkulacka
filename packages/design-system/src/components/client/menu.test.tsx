// Ported from kalkulacka-2026/packages/ui/src/menu/menu.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { icons } from "../icons";
import { Menu } from "./menu";

const items = [
  { id: "help", label: "Jak to funguje", detail: "Připomenutí, jak se odpovídá", icon: icons.info, onSelect: vi.fn() },
  { id: "restart", label: "Začít znovu", detail: "Smaže vaše odpovědi", icon: icons.restart, onSelect: vi.fn() },
  { id: "leave", label: "Opustit kalkulačku", onSelect: vi.fn() },
];

const trigger = () => screen.getByRole("button", { name: "Nabídka" });
const menuitem = (name: string) => screen.getByRole("menuitem", { name: new RegExp(`^${name}`) });

describe("Menu", () => {
  it("is closed by default, with the trigger announcing the popup", () => {
    render(<Menu label="Nabídka" items={items} />);

    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger()).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).not.toHaveAttribute("aria-controls");
  });

  it("opens on click, names the list after the trigger and wires aria-controls to it", async () => {
    render(<Menu label="Nabídka" items={items} />);
    await userEvent.click(trigger());

    const menu = screen.getByRole("menu", { name: "Nabídka" });
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(trigger()).toHaveAttribute("aria-controls", menu.id);
    expect(screen.getAllByRole("menuitem").map((item) => item.textContent)).toEqual(["Jak to fungujePřipomenutí, jak se odpovídá", "Začít znovuSmaže vaše odpovědi", "Opustit kalkulačku"]);
  });

  it("renders an item's icon as decoration and its detail as a second line", async () => {
    render(<Menu label="Nabídka" items={items} />);
    await userEvent.click(trigger());

    const help = menuitem("Jak to funguje");
    expect(help.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(help).toHaveTextContent("Připomenutí, jak se odpovídá");
    expect(menuitem("Opustit kalkulačku").querySelector("svg")).toBeNull();
  });

  it("moves focus to the first item on open and back to the trigger on Escape", async () => {
    render(<Menu label="Nabídka" items={items} />);
    await userEvent.click(trigger());

    expect(menuitem("Jak to funguje")).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger()).toHaveFocus();
  });

  it("cycles through the items with the arrow keys, wrapping at both ends", async () => {
    render(<Menu label="Nabídka" items={items} />);
    await userEvent.click(trigger());

    await userEvent.keyboard("{ArrowDown}");
    expect(menuitem("Začít znovu")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(menuitem("Opustit kalkulačku")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(menuitem("Jak to funguje")).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(menuitem("Opustit kalkulačku")).toHaveFocus();
  });

  it("opens from the trigger on ArrowDown and ArrowUp", async () => {
    render(<Menu label="Nabídka" items={items} />);

    trigger().focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(menuitem("Jak to funguje")).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();

    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes on Tab without stealing focus back", async () => {
    render(<Menu label="Nabídka" items={items} />);
    await userEvent.click(trigger());
    expect(menuitem("Jak to funguje")).toHaveFocus();

    // A bare keydown, so nothing here plays the browser's own Tab move (jsdom
    // has no focus-navigation starting point to carry on from once the item
    // is gone): what is asserted is only that the menu neither stays open nor
    // pulls focus back to the trigger — Tab means "done here".
    fireEvent.keyDown(menuitem("Jak to funguje"), { key: "Tab" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger()).not.toHaveFocus();
  });

  it("closes on a pointer press outside, leaving focus where the press landed", async () => {
    render(
      <>
        <Menu label="Nabídka" items={items} />
        <button type="button">Jinam</button>
      </>,
    );
    await userEvent.click(trigger());
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole("button", { name: "Jinam" }));
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger()).not.toHaveFocus();
  });

  it("stays open on a pointer press inside", async () => {
    render(<Menu label="Nabídka" items={items} />);
    await userEvent.click(trigger());

    fireEvent.pointerDown(menuitem("Začít znovu"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("toggles closed from the trigger", async () => {
    render(<Menu label="Nabídka" items={items} />);
    await userEvent.click(trigger());
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await userEvent.click(trigger());
    expect(screen.queryByRole("menu")).toBeNull();
  });

  /*
   * Selecting drops the item being clicked out of the DOM. Without the
   * restore, focus falls to `<body>` — and since most of these items open a
   * modal, `showModal()` then records `<body>` as the element to hand focus
   * back to, so dismissing the sheet stranded a keyboard user at the top of
   * the document instead of on the menu they opened it from.
   */
  it("restores focus to the trigger before running the selected action", async () => {
    const active: (Element | null)[] = [];
    const onSelect = vi.fn(() => active.push(document.activeElement));

    render(<Menu label="Nabídka" items={[{ id: "mode", label: "Světlý režim", onSelect }]} />);

    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("menuitem", { name: "Světlý režim" }));

    expect(onSelect).toHaveBeenCalledOnce();
    // Read at the moment the action ran, not after: an action that opens a
    // dialog takes focus off the trigger again straight away, and it is the
    // hand-off point that has to be right.
    expect(active[0]).toBe(trigger());
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("selects with Enter from the keyboard", async () => {
    const onSelect = vi.fn();
    render(<Menu label="Nabídka" items={[{ id: "help", label: "Jak to funguje", onSelect }]} />);

    trigger().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger()).toHaveFocus();
  });

  it("draws the trigger as a surface plate and the list as a lifted surface panel", async () => {
    render(<Menu label="Nabídka" items={items} />);
    expect(trigger()).toHaveClass("ko:bg-surface/72");

    await userEvent.click(trigger());
    expect(screen.getByRole("menu")).toHaveClass("ko:absolute", "ko:right-0", "ko:z-6", "ko:bg-surface", "ko:origin-top-right", "ko:animate-menu-in");
    expect(menuitem("Jak to funguje")).toHaveClass("ko:hover:bg-surface-hover", "ko:focus-visible:-outline-offset-3");
  });
});
