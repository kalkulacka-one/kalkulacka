import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RecapRow, type RecapRowProps } from "./recapRow";

const labels = { answer: "Ano", important: "Pro mě důležité" };

function renderRow(props: Partial<RecapRowProps> = {}) {
  const onOpen = vi.fn();
  const onToggleImportant = vi.fn();
  const utils = render(
    <ul>
      <RecapRow title="Omezení vánoční výzdoby" tone="agree" important={false} labels={labels} onOpen={onOpen} onToggleImportant={onToggleImportant} {...props} />
    </ul>,
  );
  return { ...utils, onOpen, onToggleImportant };
}

function star() {
  return screen.getByRole("button", { name: "Pro mě důležité" });
}

function opener() {
  return screen.getByRole("button", { name: /Omezení vánoční výzdoby/ });
}

describe("RecapRow", () => {
  it("is one pressable tile holding two controls", () => {
    renderRow();
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("ko-pressable", "ko:rounded-control");
    expect(item.querySelectorAll("button")).toHaveLength(2);
    expect(item.firstElementChild).toHaveClass("ko:bg-surface", "ko:rounded-control", "ko:grid");
  });

  it("opens the question from the title and the mark, not from the star", () => {
    const { onOpen, onToggleImportant } = renderRow();
    fireEvent.click(screen.getByText("Omezení vánoční výzdoby"));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onToggleImportant).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("img", { name: "Ano" }));
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("draws the answer through AnswerMark", () => {
    const { rerender } = renderRow();
    expect(screen.getByRole("img", { name: "Ano" })).toHaveClass("ko:bg-agree");

    rerender(
      <ul>
        <RecapRow title="Omezení vánoční výzdoby" tone="none" important={false} labels={{ ...labels, answer: "Bez odpovědi" }} onOpen={() => {}} onToggleImportant={() => {}} />
      </ul>,
    );
    expect(screen.getByRole("img", { name: "Bez odpovědi" })).toHaveClass("ko:border-dashed");
  });

  describe("the star", () => {
    it("toggles important right here, without opening the question", () => {
      const { onOpen, onToggleImportant } = renderRow();
      expect(star()).toHaveAttribute("aria-pressed", "false");
      expect(star()).toHaveAttribute("title", "Pro mě důležité");
      expect(star().querySelector("svg")).toHaveAttribute("fill", "none");

      fireEvent.click(star());
      expect(onToggleImportant).toHaveBeenCalledTimes(1);
      expect(onOpen).not.toHaveBeenCalled();
    });

    it("is pressed and filled when the question is important", () => {
      renderRow({ important: true });
      expect(star()).toHaveAttribute("aria-pressed", "true");
      expect(star().querySelector("svg")).toHaveAttribute("fill", "currentColor");
      expect(star()).toHaveClass("ko:aria-pressed:bg-neutral-ink");
    });
  });

  describe("skipped", () => {
    it("reads as secondary while the row stays fully interactive", () => {
      const { onOpen } = renderRow({ skipped: true, tone: "none", labels: { ...labels, answer: "Bez odpovědi" } });
      const item = screen.getByRole("listitem");
      expect(item.firstElementChild).toHaveAttribute("data-secondary");
      expect(item.firstElementChild).toHaveClass("ko:opacity-95");
      expect(screen.getByText("Omezení vánoční výzdoby")).toHaveClass("ko:text-text-muted", "ko:font-medium");

      fireEvent.click(opener());
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it("cannot have its star armed", () => {
      const { onToggleImportant } = renderRow({ skipped: true, tone: "none" });
      expect(star()).toBeDisabled();
      fireEvent.click(star());
      expect(onToggleImportant).not.toHaveBeenCalled();
    });

    it("keeps its title strong when merely unanswered", () => {
      renderRow({ tone: "none", labels: { ...labels, answer: "Bez odpovědi" } });
      expect(screen.getByText("Omezení vánoční výzdoby")).toHaveClass("ko:text-text-strong");
      expect(star()).toBeEnabled();
    });
  });
});
