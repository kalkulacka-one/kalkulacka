import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QuestionProgress } from "./question-progress";

describe("QuestionProgress", () => {
  it("renders one segment per question", () => {
    const { container } = render(<QuestionProgress current={7} total={42} />);
    expect(container.querySelectorAll("span")).toHaveLength(42);
  });

  it("is decorative", () => {
    const { container } = render(<QuestionProgress current={1} total={10} />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("highlights only the current position", () => {
    const { container } = render(<QuestionProgress current={3} total={5} />);
    const segments = Array.from(container.querySelectorAll("span"));
    const highlightedIndexes: number[] = [];
    segments.forEach((segment, index) => {
      if (segment.className.includes("w-8")) highlightedIndexes.push(index);
    });
    expect(highlightedIndexes).toEqual([2]);
  });
});
