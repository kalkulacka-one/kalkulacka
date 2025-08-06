import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SteppedProgressBar } from "./steppedProgressBar";

describe("SteppedProgressBar", () => {
  const mockQuestions = [
    { id: 1, answer: 1 },
    { id: 2, answer: 2 },
    { id: 3, answer: 3 },
    { id: 4, answer: 0 },
    { id: 5, answer: 1 },
  ];

  it("should render the correct number of steps", () => {
    render(<SteppedProgressBar questions={mockQuestions} stepCurrent={1} stepTotal={5} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.children).toHaveLength(5);
  });

  it("should have the correct aria attributes", () => {
    render(<SteppedProgressBar questions={mockQuestions} stepCurrent={3} stepTotal={5} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "3");
    expect(progressbar).toHaveAttribute("aria-valuemin", "1");
    expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    expect(progressbar).toHaveAttribute("aria-valuetext", "Question 3 of 5");
  });

  it("should apply correct classes for answer statuses", () => {
    render(<SteppedProgressBar questions={mockQuestions} stepCurrent={1} stepTotal={5} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.children[0]).toHaveClass("ko:bg-primary");
    expect(progressbar.children[1]).toHaveClass("ko:bg-secondary");
    expect(progressbar.children[2]).toHaveClass("ko:bg-neutral-inactive");
    expect(progressbar.children[3]).toHaveClass("ko:bg-neutral-inactive");
    expect(progressbar.children[4]).toHaveClass("ko:bg-primary");
  });

  it("should apply correct classes for active and inactive steps", () => {
    render(<SteppedProgressBar questions={mockQuestions} stepCurrent={2} stepTotal={5} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.children[0]).toHaveClass("ko:h-1");
    expect(progressbar.children[1]).toHaveClass("ko:h-2 ko:bg-neutral-active!");
    expect(progressbar.children[2]).toHaveClass("ko:h-1");
  });
});
