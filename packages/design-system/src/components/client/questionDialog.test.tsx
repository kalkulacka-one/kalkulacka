import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { CardSelection } from "./questionCard";
import { ANSWER_SWITCH_HOLD, EXIT, PHYSICS, SPEEDS } from "./questionDeck/swipePhysics";
import { QuestionDialog, type QuestionDialogProps } from "./questionDialog";

/*
 * jsdom doesn't implement `<dialog>`'s `showModal()`/`close()` — the same
 * minimum stub `dialog.test.tsx` uses, so the dialog's own open/close logic
 * runs against something that behaves like a browser.
 */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

const question = {
  id: "q-21",
  statement: "Město by mělo kvůli rostoucím cenám energie omezit veřejné slavnostní osvětlení v době Vánoc.",
  title: "Omezení vánoční výzdoby",
  detail: "Vánoční osvětlení stojí město zhruba 1,2 milionu korun ročně.",
  topic: "Energetika",
};

const labels = {
  agree: "Ano",
  disagree: "Ne",
  important: "Pro mě důležité",
  skip: "Přeskočit",
  close: "Zavřít",
};

const none: CardSelection = { agree: false, disagree: false, important: false };
const agreed: CardSelection = { agree: true, disagree: false, important: false };

function renderDialog(props: Partial<QuestionDialogProps> = {}) {
  const onClose = vi.fn();
  const onAnswer = vi.fn();
  const onSkip = vi.fn();
  const onToggleImportant = vi.fn();
  const utils = render(<QuestionDialog question={question} selection={none} labels={labels} onClose={onClose} onAnswer={onAnswer} onSkip={onSkip} onToggleImportant={onToggleImportant} {...props} />);
  return { ...utils, onClose, onAnswer, onSkip, onToggleImportant };
}

/** An owner that does what the recap does: records, and closes on an answer or a skip. */
function Host({ initialOpen = true, initialSelection = none }: { initialOpen?: boolean; initialSelection?: CardSelection }) {
  const [open, setOpen] = useState(initialOpen);
  const [selection, setSelection] = useState(initialSelection);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Otevřít
      </button>
      <QuestionDialog
        question={open ? question : undefined}
        selection={selection}
        labels={labels}
        onClose={() => setOpen(false)}
        onAnswer={(agree) => {
          const same = agree ? selection.agree : selection.disagree;
          if (same) {
            setSelection({ ...selection, agree: false, disagree: false });
            return;
          }
          setSelection({ agree, disagree: !agree, important: selection.important });
          setOpen(false);
        }}
        onSkip={() => setOpen(false)}
        onToggleImportant={() => setSelection((current) => ({ ...current, important: !current.important }))}
      />
    </>
  );
}

function dialog() {
  return screen.getByRole("dialog", { hidden: true });
}

/** The card: the draggable surface holding the question's heading. */
function card() {
  const element = screen.getByRole("heading", { level: 2 }).closest(".ko\\:cursor-grab");
  if (!(element instanceof HTMLDivElement)) throw new Error("No card");
  return element;
}

function shell() {
  const element = dialog().firstElementChild;
  if (!(element instanceof HTMLDivElement)) throw new Error("No shell");
  return element;
}

/** A pointer drag from the card's centre, released `dx`/`dy` away. */
function drag(element: HTMLElement, dx: number, dy: number) {
  fireEvent.pointerDown(element, { clientX: 200, clientY: 200, pointerId: 1 });
  fireEvent.pointerMove(window, { clientX: 200 + dx / 2, clientY: 200 + dy / 2, pointerId: 1 });
  fireEvent.pointerMove(window, { clientX: 200 + dx, clientY: 200 + dy, pointerId: 1 });
  fireEvent.pointerUp(window, { clientX: 200 + dx, clientY: 200 + dy, pointerId: 1 });
}

describe("QuestionDialog", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("the card as the panel", () => {
    it("opens modally on the question, named by its title, with the card and nothing else", () => {
      renderDialog();
      expect(dialog()).toHaveProperty("open", true);
      expect(dialog()).toHaveAttribute("aria-label", question.title);
      expect(dialog()).toHaveClass("ko-question-dialog", "ko:open:flex", "ko:p-fluid-gutter");

      // Second-level heading: the recap's own `<h1>` still names the screen.
      expect(screen.getByRole("heading", { level: 2, name: question.statement })).toBeInTheDocument();
      expect(card()).toHaveClass("ko:shadow-card-lifted");
      expect(shell()).toHaveClass("ko:animate-question-dialog-in", "ko:max-w-[42rem]");
    });

    it("carries the corner close, which is the dialog's own dismissal", () => {
      const { onClose } = renderDialog();
      fireEvent.click(screen.getByRole("button", { name: "Zavřít" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("stays closed with nothing to show", () => {
      renderDialog({ question: undefined });
      expect(dialog()).toHaveProperty("open", false);
      expect(dialog()).toBeEmptyDOMElement();
    });
  });

  /*
   * "Přeskočit" is a nudge, not a permanent control: it appears only after
   * re-tapping the current answer has cleared it — the one moment a skip is
   * the next move — and never just because a question has no answer.
   */
  describe("the skip control", () => {
    const disagreed: CardSelection = { agree: false, disagree: true, important: false };

    function skipButton() {
      return screen.queryByRole("button", { name: "Přeskočit" });
    }

    /** The dialog with an owner that re-renders it after recording a change. */
    function setup(selection: CardSelection) {
      const utils = renderDialog({ selection });
      const update = (props: Partial<QuestionDialogProps>) =>
        utils.rerender(
          <QuestionDialog
            question={question}
            selection={selection}
            labels={labels}
            onClose={utils.onClose}
            onAnswer={utils.onAnswer}
            onSkip={utils.onSkip}
            onToggleImportant={utils.onToggleImportant}
            {...props}
          />,
        );
      return { ...utils, update };
    }

    it("is not offered just because the question has no answer when it opens", () => {
      renderDialog();
      expect(skipButton()).toBeNull();
    });

    it("appears once re-tapping the current answer has cleared it", () => {
      const { update, onAnswer } = setup(agreed);
      expect(skipButton()).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "Ano" }));
      expect(onAnswer).toHaveBeenCalledWith(true);

      // The owner records the cleared answer and keeps the question open.
      update({ selection: none });
      expect(skipButton()).toBeInTheDocument();
    });

    it("skips from it, flying the card down", () => {
      const { update, onSkip, onAnswer } = setup(agreed);
      update({ selection: none });

      fireEvent.click(screen.getByRole("button", { name: "Přeskočit" }));
      expect(onSkip).toHaveBeenCalledTimes(1);
      expect(onAnswer).not.toHaveBeenCalled();
      expect(card().style.transform).toBe(`translate(0px, ${EXIT.skipY}px) rotate(${EXIT.skipRotation}deg)`);
      expect(card().style.transition).toContain(`transform ${SPEEDS.slow.fly}s var(--ko-ease-exit)`);
    });

    it("never appears on an answer switch, and goes away once an answer is back", () => {
      const { update } = setup(agreed);

      // Ano → Ne is a switch, not a clearing.
      update({ selection: disagreed });
      expect(skipButton()).toBeNull();

      // Ne → nothing is.
      update({ selection: none });
      expect(skipButton()).toBeInTheDocument();

      // …and an answer arriving takes the nudge away again.
      update({ selection: agreed });
      expect(skipButton()).toBeNull();
    });

    it("stays while the question is merely re-starred", () => {
      const { update } = setup(agreed);
      update({ selection: none });
      update({ selection: { ...none, important: true } });
      expect(skipButton()).toBeInTheDocument();
    });

    it("resets when a different question opens", () => {
      const { update } = setup(agreed);
      update({ selection: none });
      expect(skipButton()).toBeInTheDocument();

      update({ question: { ...question, id: "q-22" }, selection: none });
      expect(skipButton()).toBeNull();
    });

    it("resets when the dialog closes, so it never survives to the next opening", () => {
      const { update } = setup(agreed);
      update({ selection: none });
      expect(skipButton()).toBeInTheDocument();

      update({ question: undefined, selection: none });
      fireEvent.animationEnd(shell());
      expect(dialog()).toHaveProperty("open", false);

      update({ selection: none });
      expect(dialog()).toHaveProperty("open", true);
      expect(skipButton()).toBeNull();
    });
  });

  describe("answering from the card", () => {
    it("records a first answer and flies the card out on it, slower than a flick", () => {
      const { onAnswer } = renderDialog();
      fireEvent.click(screen.getByRole("button", { name: "Ano" }));
      expect(onAnswer).toHaveBeenCalledWith(true);

      const flying = card();
      expect(flying.style.transform).toBe(`translate(${-EXIT.horizontalX}px, ${EXIT.liftNormal}px) rotate(${-EXIT.rotation}deg)`);
      expect(flying.style.transition).toContain(`transform ${SPEEDS.slow.fly}s var(--ko-ease-exit)`);
      expect(flying.style.opacity).toBe("0");
      // The card that flies shows the answer just chosen, before the store does.
      expect(screen.getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "true");
    });

    it("carries the star into the flight", () => {
      const { onAnswer } = renderDialog({ selection: { ...none, important: true } });
      fireEvent.click(screen.getByRole("button", { name: "Ne" }));
      expect(onAnswer).toHaveBeenCalledWith(false);
      expect(card().style.transform).toBe(`translate(${EXIT.horizontalX}px, ${EXIT.liftImportant}px) rotate(${EXIT.rotation}deg)`);
    });

    it("clears an answer chosen a second time and keeps the dialog open on the unanswered card", () => {
      render(<Host initialSelection={agreed} />);
      expect(screen.queryByRole("button", { name: "Přeskočit" })).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "Ano" }));

      expect(dialog()).toHaveProperty("open", true);
      expect(card().style.transition).toBe("");
      expect(screen.getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "false");
      // Unanswered again right as someone is looking at it — so "Přeskočit" is offered.
      expect(screen.getByRole("button", { name: "Přeskočit" })).toBeInTheDocument();
    });

    it("holds a switched answer on screen for a beat before the card leaves on it", () => {
      const { onAnswer } = renderDialog({ selection: agreed });
      fireEvent.click(screen.getByRole("button", { name: "Ne" }));

      // The button moves at once; the flight waits.
      expect(screen.getByRole("button", { name: "Ne" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "false");
      expect(onAnswer).not.toHaveBeenCalled();
      expect(card().style.transition).toBe("");

      // A second press during the hold is the same press arriving twice.
      fireEvent.click(screen.getByRole("button", { name: "Ano" }));
      expect(onAnswer).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(ANSWER_SWITCH_HOLD * 1000);
      });
      expect(onAnswer).toHaveBeenCalledWith(false);
      expect(card().style.transform).toBe(`translate(${EXIT.horizontalX}px, ${EXIT.liftNormal}px) rotate(${EXIT.rotation}deg)`);
    });

    it("cancels an answer still being held when the dialog is dismissed mid-hold", () => {
      const { rerender, onClose, onAnswer, onSkip, onToggleImportant } = renderDialog({ selection: agreed });
      fireEvent.click(screen.getByRole("button", { name: "Ne" }));

      rerender(<QuestionDialog question={undefined} selection={agreed} labels={labels} onClose={onClose} onAnswer={onAnswer} onSkip={onSkip} onToggleImportant={onToggleImportant} />);
      act(() => {
        vi.advanceTimersByTime(ANSWER_SWITCH_HOLD * 1000 + 10);
      });
      expect(onAnswer).not.toHaveBeenCalled();
    });

    it("toggles important from the star, but not once an answer is on its way out", () => {
      const { onToggleImportant } = renderDialog();
      fireEvent.click(screen.getByRole("button", { name: "Pro mě důležité" }));
      expect(onToggleImportant).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole("button", { name: "Ano" }));
      fireEvent.click(screen.getByRole("button", { name: "Pro mě důležité" }));
      expect(onToggleImportant).toHaveBeenCalledTimes(1);
    });
  });

  describe("the keyboard", () => {
    it("answers with the arrows, scoped to the dialog", () => {
      const { onAnswer } = renderDialog();
      fireEvent.keyDown(dialog(), { key: "ArrowLeft" });
      expect(onAnswer).toHaveBeenCalledWith(true);
    });

    it("disagrees, skips and arms important the same way", () => {
      const first = renderDialog();
      fireEvent.keyDown(dialog(), { key: "ArrowRight" });
      expect(first.onAnswer).toHaveBeenCalledWith(false);
      first.unmount();

      const second = renderDialog();
      fireEvent.keyDown(dialog(), { key: "ArrowUp" });
      expect(second.onToggleImportant).toHaveBeenCalledTimes(1);
      fireEvent.keyDown(dialog(), { key: "ArrowDown" });
      expect(second.onSkip).toHaveBeenCalledTimes(1);
      // Flying now: the star can no longer change.
      fireEvent.keyDown(dialog(), { key: "ArrowUp" });
      expect(second.onToggleImportant).toHaveBeenCalledTimes(1);
    });

    it("ignores arrows pressed with a modifier", () => {
      const { onAnswer, onSkip } = renderDialog();
      fireEvent.keyDown(dialog(), { key: "ArrowLeft", metaKey: true });
      fireEvent.keyDown(dialog(), { key: "ArrowRight", ctrlKey: true });
      fireEvent.keyDown(dialog(), { key: "ArrowDown", altKey: true });
      expect(onAnswer).not.toHaveBeenCalled();
      expect(onSkip).not.toHaveBeenCalled();
    });

    it("closes on Escape through the owner's state", () => {
      const { onClose } = renderDialog();
      fireEvent.keyDown(dialog(), { key: "Escape" });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("dragging", () => {
    it("follows the pointer and springs back below the threshold", () => {
      const { onAnswer, onSkip } = renderDialog();
      const element = card();
      fireEvent.pointerDown(element, { clientX: 200, clientY: 200, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 164, clientY: 190, pointerId: 1 });
      expect(element.style.transform).toBe(`translate(-36px, -10px) rotate(${-36 / PHYSICS.rotationDivisor}deg)`);
      fireEvent.pointerUp(window, { clientX: 164, clientY: 190, pointerId: 1 });

      expect(onAnswer).not.toHaveBeenCalled();
      expect(onSkip).not.toHaveBeenCalled();
      expect(element.style.transform).toBe("translate(0px, 0px) rotate(0deg)");
      expect(element.style.transition).toContain("var(--ko-ease-spring)");
    });

    it("commits on a drag past the threshold and flies the card on from where it was let go", () => {
      const { onAnswer } = renderDialog();
      drag(card(), -(PHYSICS.threshold + 30), 0);
      expect(onAnswer).toHaveBeenCalledWith(true);

      const flying = card();
      expect(flying.style.transform).toBe(`translate(${-EXIT.horizontalX}px, ${EXIT.liftNormal}px) rotate(${-EXIT.rotation}deg)`);
      expect(flying.style.transition).toContain(`transform ${SPEEDS.normal.fly}s var(--ko-ease-exit)`);
    });

    it("arms important on an upward flick and skips on a downward drag", () => {
      const first = renderDialog();
      drag(card(), PHYSICS.threshold + 30, PHYSICS.importantLiftY - 10);
      expect(first.onToggleImportant).toHaveBeenCalledTimes(1);
      expect(first.onAnswer).toHaveBeenCalledWith(false);
      expect(card().style.transform).toBe(`translate(${EXIT.horizontalX}px, ${EXIT.liftImportant}px) rotate(${EXIT.rotation}deg)`);
      first.unmount();

      const second = renderDialog();
      drag(card(), 10, PHYSICS.threshold + 40);
      expect(second.onSkip).toHaveBeenCalledTimes(1);
      expect(second.onAnswer).not.toHaveBeenCalled();
    });

    it("shows the deck's hint naming what a release would record", () => {
      renderDialog();
      const toast = dialog().querySelector(".ko-deck-toast");
      expect(toast).not.toHaveClass("ko-deck-toast-visible");

      fireEvent.pointerDown(card(), { clientX: 200, clientY: 200, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 260, clientY: 200, pointerId: 1 });
      expect(toast).toHaveClass("ko-deck-toast-visible");
      expect(toast).toHaveTextContent("Ne");
      fireEvent.pointerMove(window, { clientX: 200, clientY: 300, pointerId: 1 });
      expect(toast).toHaveTextContent("Přeskočit");
      fireEvent.pointerUp(window, { clientX: 200, clientY: 300, pointerId: 1 });
      expect(toast).not.toHaveClass("ko-deck-toast-visible");
    });
  });

  describe("closing", () => {
    it("calls onClose on a click on the veil but not on the card", () => {
      const { onClose } = renderDialog();
      fireEvent.click(screen.getByRole("heading", { level: 2 }));
      expect(onClose).not.toHaveBeenCalled();

      fireEvent.click(dialog());
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("keeps the card mounted through the fade-out and closes the element once it ends", () => {
      render(<Host />);
      fireEvent.keyDown(dialog(), { key: "Escape" });

      // The owner has cleared the question; the card is still there, fading.
      expect(dialog()).toHaveProperty("open", true);
      expect(dialog()).toHaveAttribute("data-closing");
      expect(shell()).toHaveClass("ko:animate-question-dialog-out");
      expect(shell()).not.toHaveClass("ko:animate-question-dialog-in");

      fireEvent.animationEnd(shell());
      expect(dialog()).toHaveProperty("open", false);
      expect(dialog()).toBeEmptyDOMElement();

      // And it can open again.
      fireEvent.click(screen.getByRole("button", { name: "Otevřít" }));
      expect(dialog()).toHaveProperty("open", true);
      expect(shell()).toHaveClass("ko:animate-question-dialog-in");
    });

    it("lets a flying card land before closing, without fading the shell", () => {
      render(<Host />);
      fireEvent.click(screen.getByRole("button", { name: "Ano" }));

      expect(dialog()).toHaveProperty("open", true);
      expect(shell()).not.toHaveClass("ko:animate-question-dialog-out");
      expect(card().style.opacity).toBe("0");

      act(() => {
        vi.advanceTimersByTime(SPEEDS.slow.fly * 1000 + 60);
      });
      expect(dialog()).toHaveProperty("open", false);
      expect(dialog()).toBeEmptyDOMElement();
    });
  });

  describe("under prefers-reduced-motion", () => {
    it("collapses the flight but never the drag itself", () => {
      vi.stubGlobal("matchMedia", (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }));

      renderDialog();
      const element = card();
      fireEvent.pointerDown(element, { clientX: 200, clientY: 200, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 100, clientY: 200, pointerId: 1 });
      expect(element.style.transform).toBe(`translate(-100px, 0px) rotate(${-100 / PHYSICS.rotationDivisor}deg)`);
      fireEvent.pointerUp(window, { clientX: 100, clientY: 200, pointerId: 1 });

      expect(element.style.transition).toContain("transform 0.001s var(--ko-ease-exit)");

      vi.unstubAllGlobals();
    });
  });
});
