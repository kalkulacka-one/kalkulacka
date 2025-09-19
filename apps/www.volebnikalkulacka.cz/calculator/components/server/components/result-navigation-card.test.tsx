import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ResultNavigationCard } from "./result-navigation-card";

describe("ResultNavigationCard", () => {
  it("renders navigation button", () => {
    const onNextClick = vi.fn();
    render(<ResultNavigationCard onNextClick={onNextClick} />);
    expect(screen.getByText("Zobrazit porovnání")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Zobrazit porovnání' button is clicked", async () => {
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(<ResultNavigationCard onNextClick={onNextClick} />);

    await user.click(screen.getByText("Zobrazit porovnání"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
