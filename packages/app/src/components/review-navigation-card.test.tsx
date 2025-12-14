import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { enMessages } from "@/locales";

import { LocaleProvider } from "./providers";
import { ReviewNavigationCard } from "./review-navigation-card";

describe("ReviewNavigationCard", () => {
  it("renders navigation button", () => {
    const onNextClick = vi.fn();
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <ReviewNavigationCard onNextClick={onNextClick} />
      </LocaleProvider>,
    );
    expect(screen.getByText("Show results")).toBeInTheDocument();
  });

  it("calls onNextClick when 'Show results' button is clicked", async () => {
    const onNextClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <ReviewNavigationCard onNextClick={onNextClick} />
      </LocaleProvider>,
    );

    await user.click(screen.getByText("Show results"));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });
});
