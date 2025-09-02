import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GuideNavigationCard } from "./guideNavigationCard";

describe("GuideNavigationCard", () => {
  it("renders 'Pokračovat' button for step 1", () => {
    render(<GuideNavigationCard step={1} onNavigationClick={vi.fn()} />);
    expect(screen.getByText("Pokračovat")).toBeInTheDocument();
  });

  it("renders 'Začít odpovídat' button for step greater than 1", () => {
    render(<GuideNavigationCard step={2} onNavigationClick={vi.fn()} />);
    expect(screen.getByText("Začít odpovídat")).toBeInTheDocument();
  });

  it("renders 'Začít odpovídat' button for step 0", () => {
    render(<GuideNavigationCard step={0} onNavigationClick={vi.fn()} />);
    expect(screen.getByText("Začít odpovídat")).toBeInTheDocument();
  });
});
