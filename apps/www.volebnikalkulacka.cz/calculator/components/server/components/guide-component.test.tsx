import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideComponent } from ".";

describe("GuideComponent", () => {
  it("renders", () => {
    const mockCalculator = {
      id: "test",
      createdAt: new Date().toISOString(),
      key: "test",
      shortTitle: "Test",
      title: "Test Calculator",
      intro: "Test intro",
      methodology: "Test methodology",
    };

    render(<GuideComponent calculator={mockCalculator} />);
    expect(screen.getByText("Shoda")).toBeInTheDocument();
  });
});
