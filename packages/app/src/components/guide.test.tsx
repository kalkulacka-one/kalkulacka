import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { csMessages } from "@/locales";
import { calculatorViewModel } from "@/view-models/calculator";

import { Guide } from "./guide";
import { LocaleProvider } from "./providers";

describe("Guide", () => {
  it("renders", () => {
    const mockCalculator = calculatorViewModel({
      id: "test",
      createdAt: new Date().toISOString(),
      key: "test",
      shortTitle: "Test",
      title: "Test Calculator",
      intro: "Test intro",
      methodology: "Test methodology",
    });

    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <Guide calculator={mockCalculator} />
      </LocaleProvider>,
    );
    expect(screen.getByText("Shoda")).toBeInTheDocument();
  });
});
