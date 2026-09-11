import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { QuestionDeck, type QuestionDeckHandle, type QuestionDeckProps } from "./questionDeck";
import { ANSWER_SWITCH_HOLD, EXIT, PHYSICS, SPEEDS } from "./swipePhysics";

const q1 = { id: "q1", topic: "Energetika", title: "Omezení vánoční výzdoby", statement: "Město by mělo omezit veřejné slavnostní osvětlení v době Vánoc." };
const q2 = { id: "q2", topic: "Veřejný pořádek", title: "Regulace zábavní pyrotechniky", statement: "Používání zábavní pyrotechniky jindy než na Silvestra má být zakázané." };
const q3 = { id: "q3", topic: "Bydlení", title: "Bytový fond", statement: "Město má budovat a udržovat vlastní bytový fond." };

const labels = {
  agree: "Ano",
  disagree: "Ne",
  important: "Pro mě důležité",
  importantSuffix: " · Pro mě důležité",
  skip: "Přeskočit",
};

const none = { agree: false, disagree: false, important: false };

function renderDeck(props: Partial<QuestionDeckProps> = {}) {
  const onAnswer = vi.fn();
  const onSkip = vi.fn();
  const onToggleImportant = vi.fn();
  const utils = render(<QuestionDeck current={q1} next={q2} after={q3} selection={none} labels={labels} onAnswer={onAnswer} onSkip={onSkip} onToggleImportant={onToggleImportant} {...props} />);
  return { ...utils, onAnswer, onSkip, onToggleImportant };
}

/** The card being answered: the one holding the screen's heading. */
function activeCard() {
  const heading = screen.getByRole("heading", { level: 1 });
  const card = heading.closest(".ko-deck-active");
  if (!(card instanceof HTMLDivElement)) throw new Error("No active card");
  return card;
}

function ghost(container: HTMLElement) {
  return container.querySelector<HTMLDivElement>(".ko-deck-ghost");
}

/** A pointer drag from the card's centre, released `dx`/`dy` away. */
function drag(card: HTMLElement, dx: number, dy: number) {
  fireEvent.pointerDown(card, { clientX: 200, clientY: 200, pointerId: 1 });
  fireEvent.pointerMove(window, { clientX: 200 + dx / 2, clientY: 200 + dy / 2, pointerId: 1 });
  fireEvent.pointerMove(window, { clientX: 200 + dx, clientY: 200 + dy, pointerId: 1 });
  fireEvent.pointerUp(window, { clientX: 200 + dx, clientY: 200 + dy, pointerId: 1 });
}

describe("QuestionDeck", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("the stack", () => {
    it("shows the current question as the screen's heading and stacks the rest behind it, inert", () => {
      const { container } = renderDeck();
      expect(screen.getByRole("heading", { level: 1, name: q1.statement })).toBeInTheDocument();

      const next = container.querySelector(".ko-deck-next");
      expect(next).toContainElement(screen.getByText(q2.statement));
      expect(next?.firstElementChild).toHaveAttribute("inert");
      expect(next?.firstElementChild).toHaveClass("ko:shadow-card-next");

      const back = container.querySelector(".ko-deck-back");
      expect(back?.firstElementChild).toHaveClass("ko:bg-surface", "ko:rounded-card", "ko:shadow-card-back");
      expect(back).not.toHaveTextContent(q3.statement);
    });

    it("lays the stack out from the physics constants on mount", () => {
      const { container } = renderDeck();
      expect(activeCard().style.transform).toBe("translate(0px, 0px) rotate(0deg)");
      expect(container.querySelector<HTMLElement>(".ko-deck-next")?.style.transform).toBe("translate(12px, -22px) scale(0.95) rotate(0.5deg)");
      expect(container.querySelector<HTMLElement>(".ko-deck-back")?.style.transform).toBe("translate(24px, -40px) scale(0.9) rotate(1deg)");
    });

    it("omits the layers it has nothing for", () => {
      const { container } = renderDeck({ next: undefined, after: undefined });
      expect(container.querySelector(".ko-deck-next")).toBeNull();
      expect(container.querySelector(".ko-deck-back")).toBeNull();
      expect(activeCard()).toBeInTheDocument();
    });
  });

  describe("dragging", () => {
    it("follows the pointer and tilts, without committing below the threshold", () => {
      const { onAnswer, onSkip } = renderDeck();
      const card = activeCard();
      fireEvent.pointerDown(card, { clientX: 200, clientY: 200, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 164, clientY: 190, pointerId: 1 });
      expect(card.style.transform).toBe(`translate(-36px, -10px) rotate(${-36 / PHYSICS.rotationDivisor}deg)`);
      fireEvent.pointerUp(window, { clientX: 164, clientY: 190, pointerId: 1 });

      expect(onAnswer).not.toHaveBeenCalled();
      expect(onSkip).not.toHaveBeenCalled();
      // Springs back to centre rather than staying where it was let go.
      expect(card.style.transform).toBe("translate(0px, 0px) rotate(0deg)");
      expect(card.style.transition).toContain("var(--ko-ease-spring)");
    });

    it("previews the answer on the buttons while the drag is in a zone", () => {
      renderDeck();
      const card = activeCard();
      fireEvent.pointerDown(card, { clientX: 200, clientY: 200, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 160, clientY: 200, pointerId: 1 });
      expect(screen.getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Ne" })).toHaveAttribute("aria-pressed", "false");

      fireEvent.pointerMove(window, { clientX: 240, clientY: 140, pointerId: 1 });
      expect(screen.getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: "Ne" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Pro mě důležité" })).toHaveAttribute("aria-pressed", "true");

      // Back under the activation distance the preview clears again.
      fireEvent.pointerMove(window, { clientX: 210, clientY: 200, pointerId: 1 });
      expect(screen.getByRole("button", { name: "Ne" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: "Pro mě důležité" })).toHaveAttribute("aria-pressed", "false");
      fireEvent.pointerUp(window, { clientX: 210, clientY: 200, pointerId: 1 });
    });

    it("commits agree on a left drag past the threshold", () => {
      const { container, onAnswer } = renderDeck();
      drag(activeCard(), -(PHYSICS.threshold + 30), 0);
      expect(onAnswer).toHaveBeenCalledWith(true, false);

      // The card that flies is a ghost; the real card is back at rest already.
      const flying = ghost(container);
      expect(flying).not.toBeNull();
      expect(flying).toHaveAttribute("inert");
      expect(flying).toHaveClass("ko:shadow-card-lifted");
      expect(flying?.style.transform).toBe(`translate(${-EXIT.horizontalX}px, ${EXIT.liftNormal}px) rotate(${-EXIT.rotation}deg)`);
      expect(flying?.style.transition).toContain(`transform ${SPEEDS.normal.fly}s var(--ko-ease-exit)`);
      expect(activeCard().style.transform).toBe("translate(0px, 0px) rotate(0deg)");
    });

    it("commits disagree on a right drag, important when it also lifts", () => {
      const { container, onAnswer } = renderDeck();
      drag(activeCard(), PHYSICS.threshold + 30, PHYSICS.importantLiftY - 10);
      expect(onAnswer).toHaveBeenCalledWith(false, true);
      expect(ghost(container)?.style.transform).toBe(`translate(${EXIT.horizontalX}px, ${EXIT.liftImportant}px) rotate(${EXIT.rotation}deg)`);
    });

    it("commits a skip on a downward drag that clearly dominates", () => {
      const { container, onAnswer, onSkip } = renderDeck();
      drag(activeCard(), 10, PHYSICS.threshold + 40);
      expect(onSkip).toHaveBeenCalledTimes(1);
      expect(onAnswer).not.toHaveBeenCalled();
      expect(ghost(container)?.style.transform).toBe(`translate(0px, ${EXIT.skipY}px) rotate(${EXIT.skipRotation}deg)`);
    });

    it("reads a sloppy diagonal as the horizontal answer, never a skip", () => {
      const { onAnswer, onSkip } = renderDeck();
      drag(activeCard(), 90, 90);
      expect(onAnswer).toHaveBeenCalledWith(false, false);
      expect(onSkip).not.toHaveBeenCalled();
    });

    it("forgets the ghost once it has flown", () => {
      const { container } = renderDeck();
      drag(activeCard(), -100, 0);
      expect(ghost(container)).not.toBeNull();
      act(() => {
        vi.advanceTimersByTime(SPEEDS.normal.fly * 1000 + 60);
      });
      expect(ghost(container)).toBeNull();
    });

    it("lights the compass pill the drag is pointing at", () => {
      const { container } = renderDeck({ dragGuides: { split: true } });
      const card = activeCard();
      expect(container.querySelector('[data-direction="w"]')).toHaveTextContent("Ano");
      fireEvent.pointerDown(card, { clientX: 200, clientY: 200, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 160, clientY: 150, pointerId: 1 });
      expect(container.querySelector('[data-direction="nw"]')).toHaveClass("ko:bg-neutral-ink");
      expect(container.querySelector('[data-direction="w"]')).not.toHaveClass("ko:bg-neutral-ink");
      fireEvent.pointerUp(window, { clientX: 160, clientY: 150, pointerId: 1 });
      expect(container.querySelector('[data-direction="nw"]')).not.toHaveClass("ko:bg-neutral-ink");
    });

    it("shows the hint toast naming what a release would record", () => {
      const { container } = renderDeck();
      const toast = container.querySelector(".ko-deck-toast");
      expect(toast).not.toHaveClass("ko-deck-toast-visible");
      fireEvent.pointerDown(activeCard(), { clientX: 200, clientY: 200, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 260, clientY: 150, pointerId: 1 });
      expect(toast).toHaveClass("ko-deck-toast-visible");
      expect(toast).toHaveTextContent("Ne · Pro mě důležité");
      fireEvent.pointerMove(window, { clientX: 200, clientY: 300, pointerId: 1 });
      expect(toast).toHaveTextContent("Přeskočit");
      fireEvent.pointerUp(window, { clientX: 200, clientY: 300, pointerId: 1 });
      expect(toast).not.toHaveClass("ko-deck-toast-visible");
    });
  });

  describe("the keyboard", () => {
    it("answers with the arrow keys, carrying the star's state", () => {
      const { onAnswer, rerender, onSkip, onToggleImportant } = renderDeck();
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      expect(onAnswer).toHaveBeenLastCalledWith(true, false);

      rerender(<QuestionDeck current={q2} selection={{ ...none, important: true }} labels={labels} onAnswer={onAnswer} onSkip={onSkip} onToggleImportant={onToggleImportant} />);
      fireEvent.keyDown(window, { key: "ArrowRight" });
      expect(onAnswer).toHaveBeenLastCalledWith(false, true);

      fireEvent.keyDown(window, { key: "ArrowDown" });
      expect(onSkip).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(window, { key: "ArrowUp" });
      expect(onToggleImportant).toHaveBeenCalledTimes(1);
    });

    it("flies the card out on a keyboard answer, slower than a flick", () => {
      const { container } = renderDeck();
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      const flying = ghost(container);
      expect(flying).toContainElement(screen.getByText(q1.statement, { selector: ".ko-deck-ghost *" }));
      expect(flying?.style.transition).toContain(`transform ${SPEEDS.slow.fly}s var(--ko-ease-exit)`);
      expect(flying?.querySelector('[aria-label="Ano"]')).toHaveAttribute("aria-pressed", "true");
    });

    it("ignores keys pressed with a modifier or inside a form field", () => {
      const { onAnswer, onSkip } = renderDeck();
      fireEvent.keyDown(window, { key: "ArrowLeft", metaKey: true });
      fireEvent.keyDown(window, { key: "ArrowLeft", ctrlKey: true });
      fireEvent.keyDown(window, { key: "ArrowDown", altKey: true });
      expect(onAnswer).not.toHaveBeenCalled();
      expect(onSkip).not.toHaveBeenCalled();

      const input = document.createElement("input");
      document.body.appendChild(input);
      fireEvent.keyDown(input, { key: "ArrowLeft" });
      expect(onAnswer).not.toHaveBeenCalled();
      input.remove();
    });

    it("clears an answer chosen a second time, without leaving the card", () => {
      const { container, onAnswer } = renderDeck({ selection: { agree: true, disagree: false, important: false } });
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      expect(onAnswer).toHaveBeenCalledWith(true, false);
      expect(ghost(container)).toBeNull();
      expect(activeCard()).toBeInTheDocument();
    });

    it("holds a switched answer on screen for a beat before the card leaves on it", () => {
      const { container, onAnswer } = renderDeck({ selection: { agree: true, disagree: false, important: false } });
      fireEvent.keyDown(window, { key: "ArrowRight" });

      // The button moves at once; the flight waits.
      expect(screen.getByRole("button", { name: "Ne" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "false");
      expect(onAnswer).not.toHaveBeenCalled();
      expect(ghost(container)).toBeNull();

      // A second press during the hold is the same press arriving twice.
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      expect(onAnswer).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(ANSWER_SWITCH_HOLD * 1000);
      });
      expect(onAnswer).toHaveBeenCalledWith(false, false);
      expect(ghost(container)).not.toBeNull();
    });
  });

  describe("the live region", () => {
    it("announces the committed answer", () => {
      renderDeck();
      const output = screen.getByRole("status");
      expect(output.tagName).toBe("OUTPUT");
      expect(output).toHaveAttribute("aria-live", "polite");
      expect(output).toHaveTextContent("");

      fireEvent.keyDown(window, { key: "ArrowLeft" });
      expect(output).toHaveTextContent(/^Ano$/);
    });

    it("spells out the important suffix and the skip", () => {
      const { rerender, onAnswer, onSkip, onToggleImportant } = renderDeck({ selection: { ...none, important: true } });
      fireEvent.keyDown(window, { key: "ArrowRight" });
      expect(screen.getByRole("status")).toHaveTextContent("Ne · Pro mě důležité");

      rerender(<QuestionDeck current={q2} selection={none} labels={labels} onAnswer={onAnswer} onSkip={onSkip} onToggleImportant={onToggleImportant} />);
      fireEvent.keyDown(window, { key: "ArrowDown" });
      expect(screen.getByRole("status")).toHaveTextContent("Přeskočit");
    });
  });

  describe("finished", () => {
    it("renders no live card and ignores every input", () => {
      const { container, onAnswer, onSkip } = renderDeck({ finished: true });
      expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
      expect(container.querySelector(".ko-deck-active")).toBeNull();

      fireEvent.keyDown(window, { key: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowDown" });
      expect(onAnswer).not.toHaveBeenCalled();
      expect(onSkip).not.toHaveBeenCalled();
      expect(ghost(container)).toBeNull();
    });

    it("keeps the stack behind for the ghost to leave over", () => {
      const { container } = renderDeck({ finished: true });
      expect(container.querySelector(".ko-deck-next")).not.toBeNull();
    });
  });

  describe("advance()", () => {
    it("lifts the current card away as a ghost without recording anything", () => {
      const ref = createRef<QuestionDeckHandle>();
      const { container, onAnswer, onSkip } = renderDeck({ ref, selection: { agree: true, disagree: false, important: true } });

      act(() => {
        ref.current?.advance();
      });

      const flying = ghost(container);
      expect(flying).not.toBeNull();
      expect(flying?.style.transform).toBe(`translate(0px, ${EXIT.advanceY}px) scale(${EXIT.advanceScale})`);
      expect(flying?.style.transition).toContain(`transform ${SPEEDS.instant.fly}s var(--ko-ease-exit)`);
      expect(flying?.querySelector('[aria-label="Ano"]')).toHaveAttribute("aria-pressed", "true");
      expect(flying?.querySelector('[aria-label="Pro mě důležité"]')).toHaveAttribute("aria-pressed", "true");
      expect(onAnswer).not.toHaveBeenCalled();
      expect(onSkip).not.toHaveBeenCalled();
    });

    it("does nothing once finished", () => {
      const ref = createRef<QuestionDeckHandle>();
      const { container } = renderDeck({ ref, finished: true });
      act(() => {
        ref.current?.advance();
      });
      expect(ghost(container)).toBeNull();
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

      const { container } = renderDeck();
      const card = activeCard();
      fireEvent.pointerDown(card, { clientX: 200, clientY: 200, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 100, clientY: 200, pointerId: 1 });
      // The card still follows the hand.
      expect(card.style.transform).toBe(`translate(-100px, 0px) rotate(${-100 / PHYSICS.rotationDivisor}deg)`);
      fireEvent.pointerUp(window, { clientX: 100, clientY: 200, pointerId: 1 });

      expect(ghost(container)?.style.transition).toContain("transform 0.001s var(--ko-ease-exit)");

      vi.unstubAllGlobals();
    });
  });
});
