import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { LocaleProvider } from "./providers";
import { ResultNavigationCard } from "./result-navigation-card";

describe("ResultNavigationCard", () => {
  it("renders both navigation buttons", () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />
      </LocaleProvider>,
    );
    expect(screen.getByText("Porovnat")).toBeInTheDocument();
    expect(screen.getByText("Sdílet")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Porovnat' button is clicked", async () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />
      </LocaleProvider>,
    );

    await user.click(screen.getByText("Porovnat"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });

  it("calls onShareClick when 'Sdílet' button is clicked", async () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />
      </LocaleProvider>,
    );

    await user.click(screen.getByText("Sdílet"));
    expect(onShareClick).toHaveBeenCalledTimes(1);
  });
});
