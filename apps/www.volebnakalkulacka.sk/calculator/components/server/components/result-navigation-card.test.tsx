import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ResultNavigationCard } from "./result-navigation-card";

describe("ResultNavigationCard", () => {
  it("renders both navigation buttons", () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    render(<ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />);
    expect(screen.getByText("Porovnat")).toBeInTheDocument();
    expect(screen.getByText("Sdílet")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Porovnat' button is clicked", async () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    const user = userEvent.setup();
    render(<ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />);

    await user.click(screen.getByText("Porovnat"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });

  it("calls onShareClick when 'Sdílet' button is clicked", async () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    const user = userEvent.setup();
    render(<ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />);

    await user.click(screen.getByText("Sdílet"));
    expect(onShareClick).toHaveBeenCalledTimes(1);
  });
});
