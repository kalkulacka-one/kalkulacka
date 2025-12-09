import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GuideNavigationCard } from "./guide-navigation-card";

describe("GuideNavigationCard", () => {
  it("renders 'Začít odpovídat' button", () => {
    const onNextClick = vi.fn();
    render(<GuideNavigationCard onNextClick={onNextClick} />);
    expect(screen.getByText("Začít odpovídat")).toBeInTheDocument();
  });

  it("calls onNextClick when button is clicked", async () => {
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(<GuideNavigationCard onNextClick={onNextClick} />);

    await user.click(screen.getByText("Začít odpovídat"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
