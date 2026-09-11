import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { icons } from "../icons";
import { AnswerMark, AnswerMarkVariants } from "./answerMark";

describe("AnswerMark", () => {
  it("should have default style", () => {
    const { container } = render(<AnswerMark tone="agree" />);
    expect(container.firstElementChild).toHaveClass(twMerge(AnswerMarkVariants({ tone: "agree" })));
  });

  describe("when given no label", () => {
    it("should be hidden from assistive tech", () => {
      const { container } = render(<AnswerMark tone="agree" />);
      const mark = container.firstElementChild;
      expect(mark).toHaveAttribute("aria-hidden", "true");
      expect(mark).not.toHaveAttribute("role");
      expect(mark).not.toHaveAttribute("aria-label");
      expect(screen.queryByRole("img")).toBeNull();
    });
  });

  describe("when given a label", () => {
    it("should be an image named by the label", () => {
      render(<AnswerMark tone="agree" label="Ano" />);
      const mark = screen.getByRole("img", { name: "Ano" });
      expect(mark).toHaveAttribute("aria-label", "Ano");
      expect(mark).not.toHaveAttribute("aria-hidden");
    });
  });

  describe("icons", () => {
    it("should render the check for agree as a decorative icon at the recap height", () => {
      const { container } = render(<AnswerMark tone="agree" label="Ano" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("viewBox", icons.check.viewBox);
      expect(svg).toHaveClass("ko:h-[11px]", "ko:w-auto");
      expect(svg).not.toHaveClass("ko:size-6");
    });

    it("should render the cross for disagree", () => {
      const { container } = render(<AnswerMark tone="disagree" label="Ne" />);
      expect(container.querySelector("svg")).toHaveAttribute("viewBox", icons.cross.viewBox);
    });

    it("should render the neutral bar for neutral", () => {
      const { container } = render(<AnswerMark tone="neutral" label="Nevím" />);
      expect(container.querySelector("svg")).toHaveAttribute("viewBox", icons.neutral.viewBox);
    });

    it("should render no icon for none", () => {
      const { container } = render(<AnswerMark tone="none" label="Bez odpovědi" />);
      expect(container.querySelector("svg")).toBeNull();
    });

    it("should shrink the icon for the small size", () => {
      const { container } = render(<AnswerMark tone="agree" label="Ano" size="small" />);
      expect(container.querySelector("svg")).toHaveClass("ko:h-[9px]", "ko:w-auto");
    });
  });

  describe("variants", () => {
    it("should fill agree and disagree in their colours with white ink", () => {
      expect(AnswerMarkVariants({ tone: "agree" }).split(" ")).toEqual(expect.arrayContaining(["ko:rounded-pill", "ko:bg-agree", "ko:text-white"]));
      expect(AnswerMarkVariants({ tone: "disagree" }).split(" ")).toEqual(expect.arrayContaining(["ko:rounded-pill", "ko:bg-disagree", "ko:text-white"]));
    });

    it("should fill neutral in the neutral ink", () => {
      expect(AnswerMarkVariants({ tone: "neutral" }).split(" ")).toEqual(expect.arrayContaining(["ko:bg-neutral-ink", "ko:text-white"]));
    });

    it("should draw none as a dashed ring", () => {
      const classes = AnswerMarkVariants({ tone: "none" }).split(" ");
      expect(classes).toEqual(expect.arrayContaining(["ko:bg-transparent", "ko:border-[1.5px]", "ko:border-dashed", "ko:border-text-muted/50"]));
      expect(classes).not.toContain("ko:text-white");
    });

    it("should size the circle for the recap by default and smaller for the comparison", () => {
      expect(AnswerMarkVariants({ tone: "agree" }).split(" ")).toContain("ko:size-[2.125rem]");
      expect(AnswerMarkVariants({ tone: "agree", size: "small" }).split(" ")).toContain("ko:size-6");
    });
  });

  it("should merge className", () => {
    const { container } = render(<AnswerMark tone="agree" className="ko:ml-2" />);
    expect(container.firstElementChild).toHaveClass("ko:ml-2", "ko:bg-agree");
  });
});
