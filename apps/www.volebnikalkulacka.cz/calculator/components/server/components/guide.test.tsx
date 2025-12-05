import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { calculatorViewModel } from "@/calculator";

import { Guide } from ".";

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

    render(<Guide calculator={mockCalculator} />);
    expect(screen.getByText("Shoda")).toBeInTheDocument();
  });
});
