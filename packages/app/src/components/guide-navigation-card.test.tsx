import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { GuideNavigationCard } from "./guide-navigation-card";
import { LocaleProvider } from "./providers";

describe("GuideNavigationCard", () => {
  it("renders 'Začít odpovídat' button", () => {
    const onNextClick = vi.fn();
    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <GuideNavigationCard onNextClick={onNextClick} />
      </LocaleProvider>,
    );
    expect(screen.getByText("Začít odpovídat")).toBeInTheDocument();
  });

  it("calls onNextClick when button is clicked", async () => {
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <GuideNavigationCard onNextClick={onNextClick} />
      </LocaleProvider>,
    );

    await user.click(screen.getByText("Začít odpovídat"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
