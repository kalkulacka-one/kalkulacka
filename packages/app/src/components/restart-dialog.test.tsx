import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { LocaleProvider } from "./providers";
import { RestartDialog } from "./restart-dialog";

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

function renderDialog(open = true) {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <RestartDialog open={open} onClose={onClose} onConfirm={onConfirm} />
    </LocaleProvider>,
  );
  return { onClose, onConfirm };
}

const dialog = () => screen.getByRole("dialog", { hidden: true });

describe("RestartDialog", () => {
  it("asks, spells out the consequence, and names the destructive action by what it does", () => {
    renderDialog();
    expect(dialog()).toHaveProperty("open", true);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Začít znovu?");
    expect(dialog()).toHaveAccessibleDescription("Smažeme všechny vaše odpovědi v této kalkulačce a vrátíme vás na první otázku. Tuhle akci nelze vzít zpět.");
    expect(screen.getByRole("button", { name: "Smazat a začít znovu" })).toBeInTheDocument();
  });

  it("confirms without also dismissing — the owner closes it once the restart is done", async () => {
    const user = userEvent.setup();
    const { onClose, onConfirm } = renderDialog();
    await user.click(screen.getByRole("button", { name: "Smazat a začít znovu" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("cancels from the ghost action and from the corner alike", async () => {
    const user = userEvent.setup();
    const { onClose, onConfirm } = renderDialog();
    await user.click(screen.getByRole("button", { name: "Zrušit" }));
    await user.click(screen.getByRole("button", { name: "Zavřít" }));
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("stays closed until asked", () => {
    renderDialog(false);
    expect(dialog()).toHaveProperty("open", false);
  });
});
