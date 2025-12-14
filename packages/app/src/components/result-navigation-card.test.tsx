import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { enMessages } from "@/locales";

import { LocaleProvider } from "./providers";
import { ResultNavigationCard } from "./result-navigation-card";

describe("ResultNavigationCard", () => {
  it("renders both navigation buttons", () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />
      </LocaleProvider>,
    );
    expect(screen.getByText("Compare")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Compare' button is clicked", async () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />
      </LocaleProvider>,
    );

    await user.click(screen.getByText("Compare"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });

  it("calls onShareClick when 'Share' button is clicked", async () => {
    const onNextClick = vi.fn();
    const onShareClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <ResultNavigationCard onNextClick={onNextClick} onShareClick={onShareClick} />
      </LocaleProvider>,
    );

    await user.click(screen.getByText("Share"));
    expect(onShareClick).toHaveBeenCalledTimes(1);
  });
});
