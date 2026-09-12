import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressSegments, type Segment } from "./progressSegments";

const segments: Segment[] = [
  { state: "agree" },
  { state: "agree", important: true },
  { state: "disagree" },
  { state: "skipped" },
  { state: "disagree", important: true },
  { state: "unanswered", important: true },
  { state: "unanswered" },
  { state: "unanswered" },
];

function segment(index: number) {
  const element = screen.getByRole("progressbar").children[index];
  if (!(element instanceof HTMLElement)) throw new Error(`No segment ${index}`);
  return element;
}

function bar(index: number) {
  const element = segment(index).firstElementChild;
  if (!(element instanceof HTMLElement)) throw new Error(`No bar ${index}`);
  return element;
}

function dot(index: number) {
  return segment(index).querySelector("span");
}

describe("ProgressSegments", () => {
  it("is a labelled progressbar counting questions from one", () => {
    render(<ProgressSegments segments={segments} currentIndex={5} label="Otázka 6 z 8" />);
    const progressbar = screen.getByRole("progressbar", { name: "Otázka 6 z 8" });
    expect(progressbar).toHaveAttribute("aria-valuemin", "1");
    expect(progressbar).toHaveAttribute("aria-valuemax", "8");
    expect(progressbar).toHaveAttribute("aria-valuenow", "6");
  });

  it("draws one segment per question, hidden from assistive tech", () => {
    render(<ProgressSegments segments={segments} currentIndex={0} label="Otázka 1 z 8" />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.children).toHaveLength(segments.length);
    for (const child of progressbar.children) {
      expect(child).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("colours answered segments by the answer", () => {
    render(<ProgressSegments segments={segments} currentIndex={7} label="Otázka 8 z 8" />);
    expect(bar(0)).toHaveClass("ko:bg-agree");
    expect(bar(2)).toHaveClass("ko:bg-disagree");
    expect(bar(6)).toHaveClass("ko:bg-border");
    expect(bar(6)).not.toHaveClass("ko:bg-agree", "ko:bg-disagree");
  });

  it("reads a skipped question exactly like an unanswered one", () => {
    render(<ProgressSegments segments={segments} currentIndex={7} label="Otázka 8 z 8" />);
    expect(bar(3).className).toBe(bar(6).className);
    expect(bar(3)).toHaveClass("ko:bg-border");
  });

  it("enlarges the current segment in the subtle text colour", () => {
    render(<ProgressSegments segments={segments} currentIndex={5} label="Otázka 6 z 8" />);
    expect(bar(5)).toHaveClass("ko:h-[11px]", "ko:bg-text-subtle", "ko:animate-segment-pop", "ko:motion-reduce:animate-none");
    expect(bar(5)).not.toHaveClass("ko:h-1.5", "ko:bg-border");
    expect(bar(4)).toHaveClass("ko:h-1.5");
    expect(bar(4)).not.toHaveClass("ko:bg-text-subtle");
  });

  it("lets the current colour win over an answer already given", () => {
    render(<ProgressSegments segments={segments} currentIndex={0} label="Otázka 1 z 8" />);
    expect(bar(0)).toHaveClass("ko:bg-text-subtle");
    expect(bar(0)).not.toHaveClass("ko:bg-agree");
  });

  describe("the important dot", () => {
    it("is drawn only under segments marked important", () => {
      render(<ProgressSegments segments={segments} currentIndex={7} label="Otázka 8 z 8" />);
      expect(dot(0)).toBeNull();
      expect(dot(1)).not.toBeNull();
      expect(dot(4)).not.toBeNull();
      expect(dot(5)).not.toBeNull();
      expect(screen.getByRole("progressbar").querySelectorAll("span")).toHaveLength(3);
    });

    it("takes the answer's colour, and stays idle before one exists", () => {
      render(<ProgressSegments segments={segments} currentIndex={7} label="Otázka 8 z 8" />);
      expect(dot(1)).toHaveClass("ko:bg-agree", "ko:size-1", "ko:rounded-full");
      expect(dot(4)).toHaveClass("ko:bg-disagree");
      expect(dot(5)).toHaveClass("ko:bg-border");
      expect(dot(5)).not.toHaveClass("ko:bg-agree", "ko:bg-disagree");
    });

    it("drops below the taller current segment", () => {
      render(<ProgressSegments segments={segments} currentIndex={1} label="Otázka 2 z 8" />);
      expect(dot(1)).toHaveClass("ko:top-[14px]");
      expect(dot(1)).not.toHaveClass("ko:top-[9px]");
      expect(dot(4)).toHaveClass("ko:top-[9px]");
    });
  });
});
