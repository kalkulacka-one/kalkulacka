import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { Guide, GuideNavigationCard, Introduction } from "../components";
import { GuidePage } from "./guide";

vi.mock("@repo/design-system/client", () => ({
  Button: vi.fn(({ children }) => children),
  Icon: vi.fn(() => null),
}));

vi.mock("../components", () => ({
  Introduction: vi.fn(() => null),
  Guide: vi.fn(() => null),
  GuideNavigationCard: vi.fn(() => null),
  LayoutHeader: vi.fn(({ children }) => children),
  LayoutBottomNavigation: vi.fn(({ children }) => children),
  LayoutContent: vi.fn(({ children }) => children),
  AppHeader: vi.fn(({ children }) => children),
  AppHeaderMain: vi.fn(() => null),
  AppHeaderRight: vi.fn(({ children }) => children),
  AppHeaderBottom: vi.fn(({ children }) => children),
  AppHeaderBottomLeft: vi.fn(({ children }) => children),
  AppHeaderBottomMain: vi.fn(({ children }) => children),
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
  let onNextClick: ReturnType<typeof vi.fn>;
  let onBackClick: ReturnType<typeof vi.fn>;
  let onCloseClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onNextClick = vi.fn();
    onBackClick = vi.fn();
    onCloseClick = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders Guide component", () => {
    render(<GuidePage calculator={data} onNextClick={onNextClick} onBackClick={onBackClick} onCloseClick={onCloseClick} />);
    expect(Guide).toHaveBeenCalledTimes(1);
  });

  it("passes calculator to Guide component", () => {
    render(<GuidePage calculator={data} onNextClick={onNextClick} onBackClick={onBackClick} onCloseClick={onCloseClick} />);
    expect(Guide).toHaveBeenCalledWith(
      expect.objectContaining({
        calculator: data,
      }),
      undefined,
    );
  });

  it("doesn't render Introduction", () => {
    render(<GuidePage calculator={data} onNextClick={onNextClick} onBackClick={onBackClick} onCloseClick={onCloseClick} />);
    expect(Introduction).not.toHaveBeenCalled();
  });

  it("renders GuideNavigationCard", () => {
    render(<GuidePage calculator={data} onNextClick={onNextClick} onBackClick={onBackClick} onCloseClick={onCloseClick} />);
    expect(GuideNavigationCard).toHaveBeenCalledTimes(1);
  });

  it("passes onNextClick to GuideNavigationCard", () => {
    render(<GuidePage calculator={data} onNextClick={onNextClick} onBackClick={onBackClick} onCloseClick={onCloseClick} />);
    expect(GuideNavigationCard).toHaveBeenCalledWith(
      expect.objectContaining({
        onNextClick: onNextClick,
      }),
      undefined,
    );
  });
});
