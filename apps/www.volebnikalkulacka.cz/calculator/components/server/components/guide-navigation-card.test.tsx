import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GuideNavigationCard } from "./guide-navigation-card";

describe("GuideNavigationCard", () => {
  it("renders 'Pokračovat' button for step 1", () => {
    const onNextClick = vi.fn();
    render(<GuideNavigationCard step={1} onNextClick={onNextClick} />);
    expect(screen.getByText("Pokračovat")).toBeInTheDocument();
  });

  it("renders 'Začít odpovídat' button for step 2", () => {
    const onNextClick = vi.fn();
    render(<GuideNavigationCard step={2} onNextClick={onNextClick} />);
    expect(screen.getByText("Začít odpovídat")).toBeInTheDocument();
  });

  it("calls onNextClick when button is clicked", async () => {
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(<GuideNavigationCard step={1} onNextClick={onNextClick} />);

    await user.click(screen.getByText("Pokračovat"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
