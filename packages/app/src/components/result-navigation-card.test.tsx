import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { enMessages } from "@/locales";

import { LocaleProvider } from "./providers";
import { ResultNavigationCard } from "./result-navigation-card";

describe("ResultNavigationCard", () => {
  it("renders the compare button", () => {
    const onNextClick = vi.fn();
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <ResultNavigationCard onNextClick={onNextClick} />
      </LocaleProvider>,
    );
    expect(screen.getByText("Compare")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Compare' button is clicked", async () => {
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <ResultNavigationCard onNextClick={onNextClick} />
      </LocaleProvider>,
    );

    await user.click(screen.getByText("Compare"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
