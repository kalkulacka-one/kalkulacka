import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { GuidePage } from "./guide-page";
import { LocaleProvider } from "./providers";

function renderPage(props: Partial<GuidePage> = {}) {
  const onBackClick = vi.fn();
  const onStartClick = vi.fn();

  const result = render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <GuidePage appTitle="Volební kalkulačka" electionName="Sněmovní volby 2025" calculatorName="Volební kalkulačka" onBackClick={onBackClick} onStartClick={onStartClick} {...props} />
    </LocaleProvider>,
  );

  return { ...result, onBackClick, onStartClick };
}

/* The app bar, found from its wordmark — the screen's own title block is a `<header>` too. */
const appHeader = () => screen.getByText("Volební kalkulačka", { selector: "p" }).closest("header");

describe("GuidePage", () => {
  it("titles the screen and names the election and the calculator in the header", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Jak to funguje");
    expect(screen.getByText("Vyzkoušejte si to na cvičné kartě — nic z ní se nikam nezapočítá.")).toBeInTheDocument();
    expect(appHeader()).toHaveTextContent("Sněmovní volby Volební kalkulačka 2025");
  });

  it("keeps a single heading — the practice card has no statement of its own", () => {
    renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("carries the practice card and its counter", () => {
    renderPage();
    expect(screen.getByText("Táhněte kartou do vyznačených směrů, nebo tapněte na jednu z možností.")).toBeInTheDocument();
    expect(screen.getByText("Vyzkoušeno 0 ze 4")).toBeInTheDocument();
  });

  it("goes back under the calculator's name", async () => {
    const user = userEvent.setup();
    const { onBackClick, onStartClick } = renderPage({ calculatorName: "Expresní kalkulačka" });

    await user.click(screen.getByRole("button", { name: "Expresní kalkulačka" }));
    expect(onBackClick).toHaveBeenCalledTimes(1);
    expect(onStartClick).not.toHaveBeenCalled();
  });

  it("starts on Rozumím, začít", async () => {
    const user = userEvent.setup();
    const { onBackClick, onStartClick } = renderPage();

    await user.click(screen.getByRole("button", { name: "Rozumím, začít" }));
    expect(onStartClick).toHaveBeenCalledTimes(1);
    expect(onBackClick).not.toHaveBeenCalled();
  });

  it("renders the header actions and the attribution link when given", () => {
    renderPage({ headerActions: <button type="button">Zavřít</button>, attributionHref: "https://www.volebnikalkulacka.cz" });
    expect(appHeader()).toContainElement(screen.getByRole("button", { name: "Zavřít" }));
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://www.volebnikalkulacka.cz");
  });

  describe("methodology", () => {
    it("is absent by default", () => {
      const { container } = renderPage();
      expect(container.querySelector("strong")).toBeNull();
    });

    it("renders markdown with the allow-list and safe links", () => {
      renderPage({ methodology: ["Shoda se počítá **po otázkách**.", "# Nadpis pryč", "Více na [kalkulacka.one](https://www.kalkulacka.one)."].join("\n\n") });
      expect(screen.getByText("po otázkách").tagName).toBe("STRONG");
      expect(screen.queryByText("Nadpis pryč")).toBeNull();
      const link = screen.getByRole("link", { name: "kalkulacka.one" });
      expect(link).toHaveAttribute("href", "https://www.kalkulacka.one");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
