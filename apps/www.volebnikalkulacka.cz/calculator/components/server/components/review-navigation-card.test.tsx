import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ReviewNavigationCard } from "./review-navigation-card";

describe("ReviewNavigationCard", () => {
  it("renders navigation button", () => {
    const onNextClick = vi.fn() as () => void;
    render(<ReviewNavigationCard onNextClick={onNextClick} />);
    expect(screen.getByText("Zobrazit výsledky")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Zobrazit výsledky' button is clicked", async () => {
    const onNextClick = vi.fn() as () => void;
    const user = userEvent.setup();
    render(<ReviewNavigationCard onNextClick={onNextClick} />);

    await user.click(screen.getByText("Zobrazit výsledky"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
