import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ResultNavigationCard } from "./result-navigation-card";

describe("ResultNavigationCard", () => {
  it("renders both navigation buttons", () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    render(<ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />);
    expect(screen.getByText("Összehasonlítás")).toBeInTheDocument();
    expect(screen.getByText("Megosztás")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Összehasonlítás' button is clicked", async () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    const user = userEvent.setup();
    render(<ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />);

    await user.click(screen.getByText("Összehasonlítás"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });

  it("calls onShareClick when 'Megosztás' button is clicked", async () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    const user = userEvent.setup();
    render(<ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />);

    await user.click(screen.getByText("Megosztás"));
    expect(onShareClick).toHaveBeenCalledTimes(1);
  });
});
