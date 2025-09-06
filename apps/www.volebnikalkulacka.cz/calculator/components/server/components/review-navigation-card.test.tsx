import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ReviewNavigationCard } from "./review-navigation-card";

describe("ReviewNavigationCard", () => {
  it("renders both navigation buttons", () => {
    const onPreviousClick = vi.fn();
    const onNextClick = vi.fn();
    render(<ReviewNavigationCard onPreviousClick={onPreviousClick} onNextClick={onNextClick} />);
    expect(screen.getByText("Zpět")).toBeInTheDocument();
    expect(screen.getByText("Zobrazit výsledky")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Zobrazit výsledky' button is clicked", async () => {
    const onPreviousClick = vi.fn();
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(<ReviewNavigationCard onPreviousClick={onPreviousClick} onNextClick={onNextClick} />);

    await user.click(screen.getByText("Zobrazit výsledky"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
    expect(onPreviousClick).not.toHaveBeenCalled();
  });

  it("calls onPreviousClick when 'Zpět' button is clicked", async () => {
    const onPreviousClick = vi.fn();
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(<ReviewNavigationCard onPreviousClick={onPreviousClick} onNextClick={onNextClick} />);

    await user.click(screen.getByText("Zpět"));
    expect(onPreviousClick).toHaveBeenCalledTimes(1);
    expect(onNextClick).not.toHaveBeenCalled();
  });
});
