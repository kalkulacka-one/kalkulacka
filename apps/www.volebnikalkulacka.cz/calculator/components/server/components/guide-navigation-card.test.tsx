import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideNavigationCard } from "./guideNavigationCard";

describe("GuideNavigationCard", () => {
  it("renders 'Pokračovat' button for step 1", () => {
    render(<GuideNavigationCard step={1} />);
    expect(screen.getByText("Pokračovat")).toBeInTheDocument();
  });

  it("renders 'Začít odpovídat' button for step greater than 1", () => {
    render(<GuideNavigationCard step={2} />);
    expect(screen.getByText("Začít odpovídat")).toBeInTheDocument();
  });

  it("renders 'Začít odpovídat' button for step 0", () => {
    render(<GuideNavigationCard step={0} />);
    expect(screen.getByText("Začít odpovídat")).toBeInTheDocument();
  });
});
