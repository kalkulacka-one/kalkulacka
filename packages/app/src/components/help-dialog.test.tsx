import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { HelpDialog } from "./help-dialog";
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

function renderDialog(open = true) {
  const onClose = vi.fn();
  render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <HelpDialog open={open} onClose={onClose} />
    </LocaleProvider>,
  );
  return { onClose };
}

const dialog = () => screen.getByRole("dialog", { hidden: true });

describe("HelpDialog", () => {
  it("is a wide sheet titled by the guide's own heading", () => {
    renderDialog();
    expect(dialog()).toHaveProperty("open", true);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Jak to funguje");
    expect(dialog().firstElementChild).toHaveClass("ko:max-w-[34rem]");
  });

  it("carries the flow's five steps, in the flow's order", () => {
    renderDialog();
    const titles = screen.getAllByRole("listitem").map((item) => item.querySelector("p")?.textContent);
    expect(titles).toEqual(["Ano", "Ne", "Pro mě důležité", "Přeskočit", "Rekapitulace"]);
  });

  it("stays closed until asked", () => {
    renderDialog(false);
    expect(dialog()).toHaveProperty("open", false);
  });

  it("tells its owner when dismissed from the corner", async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog();
    await user.click(screen.getByRole("button", { name: "Zavřít" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
