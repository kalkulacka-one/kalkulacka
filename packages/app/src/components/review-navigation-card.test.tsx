import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { LocaleProvider } from "./providers";
import { ReviewNavigationCard } from "./review-navigation-card";

describe("ReviewNavigationCard", () => {
  it("renders navigation button", () => {
    const onNextClick = vi.fn();
    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <ReviewNavigationCard onNextClick={onNextClick} />
      </LocaleProvider>,
    );
    expect(screen.getByText("Zobrazit výsledky")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Zobrazit výsledky' button is clicked", async () => {
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <ReviewNavigationCard onNextClick={onNextClick} />
      </LocaleProvider>,
    );

    await user.click(screen.getByText("Zobrazit výsledky"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
