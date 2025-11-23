import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SteppedProgressBar } from "./steppedProgressBar";

const stepItems = [
  { id: "1", status: true },
  { id: "2", status: false },
  { id: "3", status: null },
  { id: "4", status: undefined },
];

describe("SteppedProgressBar", () => {
  it("should render with correct aria attributes", () => {
    render(<SteppedProgressBar stepItems={stepItems} stepCurrent={1} stepTotal={stepItems.length} idKey="id" statusKey="status" />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "1");
    expect(progressBar).toHaveAttribute("aria-valuemin", "1");
    expect(progressBar).toHaveAttribute("aria-valuemax", "4");
    expect(progressBar).toHaveAttribute("aria-valuetext", "Question 1 of 4");
  });

  it("should render the correct number of steps", () => {
    render(<SteppedProgressBar stepItems={stepItems} stepCurrent={1} stepTotal={stepItems.length} idKey="id" statusKey="status" />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar.childNodes).toHaveLength(stepItems.length);
  });

  it("should apply the active style to the current step", () => {
    render(<SteppedProgressBar stepItems={stepItems} stepCurrent={2} stepTotal={stepItems.length} idKey="id" statusKey="status" />);
    const progressBar = screen.getByRole("progressbar");
    const secondStep = progressBar.childNodes[1] as HTMLElement;
    expect(secondStep).toHaveClass("ko:h-2");
  });

  it("should apply correct styles for different statuses", () => {
    render(<SteppedProgressBar stepItems={stepItems} stepCurrent={1} stepTotal={stepItems.length} idKey="id" statusKey="status" />);
    const progressBar = screen.getByRole("progressbar");
    const firstStep = progressBar.childNodes[0] as HTMLElement;
    const secondStep = progressBar.childNodes[1] as HTMLElement;
    const thirdStep = progressBar.childNodes[2] as HTMLElement;
    const fourthStep = progressBar.childNodes[3] as HTMLElement;

    expect(firstStep).toHaveClass("ko:bg-primary");
    expect(secondStep).toHaveClass("ko:bg-secondary");
    expect(thirdStep).toHaveClass("ko:bg-neutral-inactive");
    expect(fourthStep).toHaveClass("ko:bg-neutral-inactive");
  });
});
