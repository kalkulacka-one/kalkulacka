// Ported from kalkulacka-2026/packages/ui/src/dialog/dialog.test.tsx
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { Dialog } from "./dialog";

/**
 * jsdom doesn't implement `<dialog>`'s `showModal()`/`close()` at all —
 * verified directly: `typeof dialog.showModal === "undefined"`. This is the
 * minimum stub needed to exercise Dialog's own logic against something that
 * behaves like a real browser: `showModal()` flips `open` true, `close()`
 * flips it false and fires the native `close` event.
 */
function installRealisticDialogStub() {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}

beforeAll(() => {
  installRealisticDialogStub();
});

/** A stateful host, since Dialog treats `open` as a prop it only reflects, not owns. */
function Host({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Otevřít
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Jak to funguje" closeLabel="Zavřít">
        <p>Obsah</p>
      </Dialog>
    </>
  );
}

function dialog() {
  return screen.getByRole("dialog", { hidden: true });
}

function panel() {
  const element = dialog().firstElementChild;
  if (!(element instanceof HTMLDivElement)) throw new Error("The dialog has no panel");
  return element;
}

describe("Dialog", () => {
  it("opens the element modally when `open` flips true and closes it when it flips false", () => {
    render(<Host />);
    expect(dialog()).toHaveProperty("open", false);

    fireEvent.click(screen.getByRole("button", { name: "Otevřít" }));
    expect(dialog()).toHaveProperty("open", true);

    fireEvent.click(screen.getByRole("button", { name: "Zavřít" }));
    expect(dialog()).toHaveProperty("open", false);
  });

  it("closes on Escape through React state, not by waiting on the native close event", () => {
    render(<Host initialOpen />);
    expect(dialog()).toHaveProperty("open", true);

    fireEvent.keyDown(dialog(), { key: "Escape" });

    expect(dialog()).toHaveProperty("open", false);
  });

  it("calls onClose on a backdrop click but not on a click inside the panel", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Jak to funguje" closeLabel="Zavřít">
        <p>Obsah</p>
      </Dialog>,
    );

    fireEvent.click(screen.getByText("Obsah"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(dialog());
    expect(onClose).toHaveBeenCalledOnce();
  });

  /*
   * The app keeps several dialogs mounted at once — the shell menu alone holds
   * help, restart and leave, and the results screen adds share on top. The
   * label id used to be derived from the CSS module's class name, i.e. one
   * string shared by every instance, so all of them carried the same `id` and
   * `aria-labelledby` resolved to whichever heading came first in the
   * document: the open dialog announced a closed one's title.
   */
  it("labels each instance by its own heading, with several mounted at once", () => {
    render(
      <>
        <Dialog open={false} onClose={() => {}} title="Nápověda" closeLabel="Zavřít" />
        <Dialog open onClose={() => {}} title="Sdílet výsledek" closeLabel="Zavřít" />
      </>,
    );

    const [help, share] = screen.getAllByRole("dialog", { hidden: true });
    const labelOf = (element: HTMLElement | undefined) => document.getElementById(element?.getAttribute("aria-labelledby") ?? "")?.textContent;

    expect(help?.getAttribute("aria-labelledby")).not.toBe(share?.getAttribute("aria-labelledby"));
    expect(labelOf(help)).toBe("Nápověda");
    expect(labelOf(share)).toBe("Sdílet výsledek");
  });

  it("describes itself by its description, and only when it has one", () => {
    const { rerender } = render(<Dialog open onClose={() => {}} title="Začít znovu?" description="Smažeme všechny vaše odpovědi." closeLabel="Zavřít" />);
    const described = document.getElementById(dialog().getAttribute("aria-describedby") ?? "");
    expect(described).toHaveTextContent("Smažeme všechny vaše odpovědi.");
    expect(described).toHaveClass("ko:text-text-muted");

    rerender(<Dialog open onClose={() => {}} title="Začít znovu?" closeLabel="Zavřít" />);
    expect(dialog()).not.toHaveAttribute("aria-describedby");
  });

  it("draws the panel as the lifted card, compact by default and wide on request", () => {
    const { rerender } = render(<Dialog open onClose={() => {}} title="Začít znovu?" closeLabel="Zavřít" />);
    expect(panel()).toHaveClass("ko-dialog-panel", "ko:bg-surface", "ko:rounded-card", "ko:shadow-card-lifted", "ko:max-w-[26rem]");
    expect(dialog()).toHaveClass("ko-dialog", "ko:open:flex");

    rerender(<Dialog open onClose={() => {}} title="Jak to funguje" closeLabel="Zavřít" size="wide" />);
    expect(panel()).toHaveClass("ko:max-w-[34rem]");
    expect(panel()).not.toHaveClass("ko:max-w-[26rem]");
  });

  it("renders the body and the actions only when given, the actions stacking on a narrow screen", () => {
    const { rerender } = render(<Dialog open onClose={() => {}} title="Začít znovu?" closeLabel="Zavřít" />);
    expect(panel().childElementCount).toBe(1);

    rerender(
      <Dialog open onClose={() => {}} title="Začít znovu?" closeLabel="Zavřít" actions={<button type="button">Smazat</button>}>
        <p>Obsah</p>
      </Dialog>,
    );
    expect(screen.getByText("Obsah").parentElement).toHaveClass("ko:min-w-0");
    expect(screen.getByRole("button", { name: "Smazat" }).parentElement).toHaveClass("ko:justify-end", "ko:max-[26rem]:flex-col-reverse", "ko:max-[26rem]:*:w-full");
  });

  /*
   * A browser queues the `close` event rather than firing it inline from
   * `close()`. Seen in Chrome: a dismissal followed by a reopen before that
   * task ran delivered the stale event to an element that was open again, and
   * the listener told the owner to close it a second time. This block runs
   * with a `close()` that fires the event a tick later, as the platform does.
   */
  describe("when the native close event arrives late", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
        this.open = false;
        setTimeout(() => this.dispatchEvent(new Event("close")), 0);
      };
    });

    afterEach(() => {
      installRealisticDialogStub();
      vi.useRealTimers();
    });

    it("ignores a stale close event once the dialog has been reopened", () => {
      render(<Host initialOpen />);

      fireEvent.keyDown(dialog(), { key: "Escape" });
      expect(dialog()).toHaveProperty("open", false);

      fireEvent.click(screen.getByRole("button", { name: "Otevřít" }));
      expect(dialog()).toHaveProperty("open", true);

      act(() => {
        vi.runAllTimers();
      });
      expect(dialog()).toHaveProperty("open", true);
    });

    it("still tells the owner about a closing nothing has undone", () => {
      const onClose = vi.fn();
      render(<Dialog open onClose={onClose} title="Jak to funguje" closeLabel="Zavřít" />);

      // Closed from outside — a browser-initiated dismissal, say.
      act(() => {
        (dialog() as HTMLDialogElement).close();
        vi.runAllTimers();
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  /*
   * The regression that motivated Dialog's own onKeyDown handling: a modal
   * `<dialog>` dismisses itself on Escape, but that path only reports back via
   * the `close` event. If that event never arrives — verified true of the
   * Claude Browser tool used to check this app, and simulated here — the
   * element shuts while `open` still says true, and the same dialog can never
   * be told to open again. This block runs with a `close()` that flips `.open`
   * but never fires the event, so these tests fail if Escape is ever rerouted
   * back through the native event alone instead of calling `onClose` directly.
   */
  describe("when the native close event never fires", () => {
    beforeEach(() => {
      HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
        this.open = false;
      };
    });

    afterEach(() => {
      installRealisticDialogStub();
    });

    it("still closes on Escape", () => {
      render(<Host initialOpen />);

      fireEvent.keyDown(dialog(), { key: "Escape" });

      expect(dialog()).toHaveProperty("open", false);
    });

    it("reopens after an Escape dismissal", () => {
      render(<Host initialOpen />);

      fireEvent.keyDown(dialog(), { key: "Escape" });
      expect(dialog()).toHaveProperty("open", false);

      fireEvent.click(screen.getByRole("button", { name: "Otevřít" }));

      expect(dialog()).toHaveProperty("open", true);
    });
  });
});
