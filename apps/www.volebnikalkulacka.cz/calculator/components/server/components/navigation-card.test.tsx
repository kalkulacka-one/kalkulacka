import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavigationCard } from "./navigation-card";

describe("NavigationCard", () => {
  it("renders children", () => {
    render(
      <NavigationCard>
        <div>Test content</div>
      </NavigationCard>,
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
