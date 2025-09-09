import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { GuideComponent, GuideNavigationCard, Introduction } from "../components";
import { GuidePage } from "./guide";

vi.mock("../components", () => ({
  Introduction: vi.fn(() => null),
  GuideComponent: vi.fn(() => null),
  GuideNavigationCard: vi.fn(() => null),
  LayoutHeader: vi.fn(({ children }) => children),
  LayoutBottomNavigation: vi.fn(({ children }) => children),
  AppHeader: vi.fn(({ children }) => children),
}));

const data = {
  id: "00000000-0000-0000-0000-000000000000",
  createdAt: new Date(0).toISOString(),
  key: "kalkulacka",
  shortTitle: "Sněmovní 2025",
  title: "Volební kalkulačka pro sněmovní volby 2025",
  intro: "Čeká vás 35 otázek, na které jsme se zeptali všech 26 kandidujících subjektů.",
} satisfies Calculator;

describe("GuidePage", () => {
  let onNavigationNextClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onNavigationNextClick = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders Introduction for step 1", () => {
    render(<GuidePage calculator={data} step={1} onNavigationNextClick={onNavigationNextClick} onNavigationPreviousClick={vi.fn()} />);
    expect(Introduction).toHaveBeenCalledTimes(1);
  });

  it("passes calculator to Introduction component", () => {
    render(<GuidePage calculator={data} step={1} onNavigationNextClick={onNavigationNextClick} onNavigationPreviousClick={vi.fn()} />);
    expect(Introduction).toHaveBeenCalledWith(
      expect.objectContaining({
        calculator: data,
      }),
      undefined,
    );
  });

  it("doesn't render GuideComponent for step 1", () => {
    render(<GuidePage calculator={data} step={1} onNavigationNextClick={onNavigationNextClick} onNavigationPreviousClick={vi.fn()} />);
    expect(GuideComponent).not.toHaveBeenCalled();
  });

  it("renders GuideComponent for step 2", () => {
    render(<GuidePage calculator={data} step={2} onNavigationNextClick={onNavigationNextClick} onNavigationPreviousClick={vi.fn()} />);
    expect(GuideComponent).toHaveBeenCalledTimes(1);
  });

  it("doesn't render Introduction for step 2", () => {
    render(<GuidePage calculator={data} step={2} onNavigationNextClick={onNavigationNextClick} onNavigationPreviousClick={vi.fn()} />);
    expect(Introduction).not.toHaveBeenCalled();
  });

  it("renders GuideNavigationCard for step 1", () => {
    render(<GuidePage calculator={data} step={1} onNavigationNextClick={onNavigationNextClick} onNavigationPreviousClick={vi.fn()} />);
    expect(GuideNavigationCard).toHaveBeenCalledTimes(1);
  });

  it("renders GuideNavigationCard for step 2", () => {
    render(<GuidePage calculator={data} step={2} onNavigationNextClick={onNavigationNextClick} onNavigationPreviousClick={vi.fn()} />);
    expect(GuideNavigationCard).toHaveBeenCalledTimes(1);
  });

  it("passes onNavigationNextClick to GuideNavigationCard", () => {
    render(<GuidePage calculator={data} step={1} onNavigationNextClick={onNavigationNextClick} onNavigationPreviousClick={vi.fn()} />);
    expect(GuideNavigationCard).toHaveBeenCalledWith(
      expect.objectContaining({
        onNextClick: onNavigationNextClick,
      }),
      undefined,
    );
  });
});
