import type { Calculator } from "@kalkulacka-one/schema";

import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Guide } from "@/components/guide";
import { GuideNavigationCard } from "@/components/guide-navigation-card";
import { Introduction } from "@/components/introduction";
import { enMessages } from "@/locales";
import { calculatorViewModel } from "@/view-models";

import { LocaleProvider } from "../providers";
import { GuidePage } from "./guide";

vi.mock("@kalkulacka-one/design-system/client", () => ({
  Button: vi.fn(({ children }) => children),
  Icon: vi.fn(() => null),
}));

vi.mock("@/components/guide", () => ({
  Guide: vi.fn(() => null),
}));

vi.mock("@/components/introduction", () => ({
  Introduction: vi.fn(() => null),
}));

vi.mock("@/components/guide-navigation-card", () => {
  const GuideNavigationCardMock = vi.fn(() => null) as unknown as React.FC & { heightClassNames: string };
  GuideNavigationCardMock.heightClassNames = "h-0";
  return {
    GuideNavigationCard: GuideNavigationCardMock,
  };
});

vi.mock("@/components/layout", () => {
  const LayoutMock = vi.fn(({ children }) => children) as unknown as React.FC<{ children?: React.ReactNode }> & {
    Header: React.FC<{ children?: React.ReactNode }>;
    Content: React.FC<{ children?: React.ReactNode }>;
    BottomNavigation: React.FC<{ children?: React.ReactNode }>;
    Footer: React.FC<{ children?: React.ReactNode }>;
    BottomSpacer: React.FC<{ children?: React.ReactNode }>;
  };
  LayoutMock.Header = vi.fn(({ children }) => children);
  LayoutMock.Content = vi.fn(({ children }) => children);
  LayoutMock.BottomNavigation = vi.fn(({ children }) => children);
  LayoutMock.Footer = vi.fn(({ children }) => children);
  LayoutMock.BottomSpacer = vi.fn(({ children }) => children);

  return {
    Layout: LayoutMock,
  };
});

vi.mock("@/components/embed-footer", () => {
  const EmbedFooterMock = vi.fn(() => null) as unknown as React.FC & { heightClassNames: string; marginBottomClassNames: string };
  EmbedFooterMock.heightClassNames = "h-0";
  EmbedFooterMock.marginBottomClassNames = "mb-0";
  return {
    EmbedFooter: EmbedFooterMock,
  };
});

vi.mock("@/client", () => {
  const AppHeaderMock = vi.fn(({ children }) => children) as unknown as React.FC<{ children?: React.ReactNode }> & {
    Right: React.FC<{ children?: React.ReactNode }>;
    Bottom: React.FC<{ children?: React.ReactNode }>;
    BottomLeft: React.FC<{ children?: React.ReactNode }>;
    BottomMain: React.FC<{ children?: React.ReactNode }>;
  };
  AppHeaderMock.Right = vi.fn(({ children }) => children);
  AppHeaderMock.Bottom = vi.fn(({ children }) => children);
  AppHeaderMock.BottomLeft = vi.fn(({ children }) => children);
  AppHeaderMock.BottomMain = vi.fn(({ children }) => children);

  return {
    AppHeader: AppHeaderMock,
    HideOnEmbed: vi.fn(({ children }) => children),
  };
});

const data = calculatorViewModel({
  id: "00000000-0000-0000-0000-000000000000",
  createdAt: new Date(0).toISOString(),
  key: "kalkulacka",
  shortTitle: "Sněmovní 2025",
  title: "Volební kalkulačka pro sněmovní volby 2025",
  intro: "Čeká vás 35 otázek, na které jsme se zeptali všech 26 kandidujících subjektů.",
} satisfies Calculator);

describe("GuidePage", () => {
  let onNextClick: ReturnType<typeof vi.fn>;
  let onBackClick: ReturnType<typeof vi.fn>;
  let onCloseClick: ReturnType<typeof vi.fn>;

  const renderPage = () =>
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <GuidePage embedContext={{ isEmbed: false }} calculator={data} onNextClick={onNextClick} onBackClick={onBackClick} onCloseClick={onCloseClick} />
      </LocaleProvider>,
    );

  beforeEach(() => {
    onNextClick = vi.fn();
    onBackClick = vi.fn();
    onCloseClick = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders Guide component", () => {
    renderPage();
    expect(Guide).toHaveBeenCalledTimes(1);
  });

  it("passes calculator to Guide component", () => {
    renderPage();
    expect(Guide).toHaveBeenCalledWith(
      expect.objectContaining({
        calculator: data,
      }),
      undefined,
    );
  });

  it("doesn't render Introduction", () => {
    renderPage();
    expect(Introduction).not.toHaveBeenCalled();
  });

  it("renders GuideNavigationCard", () => {
    renderPage();
    expect(GuideNavigationCard).toHaveBeenCalledTimes(1);
  });

  it("passes onNextClick to GuideNavigationCard", () => {
    renderPage();
    expect(GuideNavigationCard).toHaveBeenCalledWith(
      expect.objectContaining({
        onNextClick: onNextClick,
      }),
      undefined,
    );
  });
});
