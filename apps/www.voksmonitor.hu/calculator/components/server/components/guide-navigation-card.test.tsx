import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GuideNavigationCard } from "./guide-navigation-card";

describe("GuideNavigationCard", () => {
  it("renders 'Válaszadás megkezdése' button", () => {
    const onNextClick = vi.fn();
    render(<GuideNavigationCard onNextClick={onNextClick} />);
    expect(screen.getByText("Válaszadás megkezdése")).toBeInTheDocument();
  });

  it("calls onNextClick when button is clicked", async () => {
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(<GuideNavigationCard onNextClick={onNextClick} />);

    await user.click(screen.getByText("Válaszadás megkezdése"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
