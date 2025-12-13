import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ReviewNavigationCard } from "./review-navigation-card";

describe("ReviewNavigationCard", () => {
  it("renders navigation button", () => {
    const onNextClick = vi.fn();
    render(<ReviewNavigationCard onNextClick={onNextClick} />);
    expect(screen.getByText("Eredmények mutatása")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Eredmények mutatása' button is clicked", async () => {
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(<ReviewNavigationCard onNextClick={onNextClick} />);

    await user.click(screen.getByText("Eredmények mutatása"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
