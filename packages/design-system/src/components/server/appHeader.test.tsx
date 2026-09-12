import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppHeader } from "./appHeader";

describe("AppHeader", () => {
  it("renders the title as a banner", () => {
    render(<AppHeader title="Volební kalkulačka" />);
    expect(screen.getByRole("banner")).toContainElement(screen.getByText("Volební kalkulačka", { selector: "p" }));
  });

  it("shows no subtitle without an election", () => {
    const { container } = render(<AppHeader title="Volební kalkulačka" />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  describe("election name", () => {
    it("splits the year off and puts the calculator name between type and year", () => {
      const { container } = render(<AppHeader title="Volební kalkulačka" electionName="Komunální volby 2022" calculatorName="Pardubice" />);
      const subtitle = container.querySelectorAll("p")[1];
      expect(subtitle).toHaveTextContent("Komunální volby Pardubice 2022");
      expect(subtitle?.querySelector("span")).toHaveTextContent("Komunální volby");
      expect(subtitle?.querySelector("span")).toHaveClass("ko:text-text-muted");
    });

    it("keeps everything after the year with it", () => {
      const { container } = render(<AppHeader title="Volební kalkulačka" electionName="Krajské volby 2024 (podzim)" />);
      const subtitle = container.querySelectorAll("p")[1];
      expect(subtitle?.querySelector("span")).toHaveTextContent("Krajské volby");
      expect(subtitle).toHaveTextContent("Krajské volby 2024 (podzim)");
    });

    it("shows a name without a year as the type alone", () => {
      const { container } = render(<AppHeader title="Volební kalkulačka" electionName="Volby do Evropského parlamentu" calculatorName="Praha" />);
      const subtitle = container.querySelectorAll("p")[1];
      expect(subtitle?.querySelector("span")).toHaveTextContent("Volby do Evropského parlamentu");
      expect(subtitle).toHaveTextContent("Volby do Evropského parlamentu Praha");
    });
  });

  describe("brand block", () => {
    it("is plain markup by default", () => {
      render(<AppHeader title="Volební kalkulačka" />);
      expect(screen.queryByRole("link")).toBeNull();
      expect(screen.getByText("Volební kalkulačka", { selector: "p" }).closest(".ko-app-header-brand")?.tagName).toBe("DIV");
    });

    it("becomes an attribution link opening in a new tab when given a href", () => {
      render(<AppHeader title="Volební kalkulačka" href="https://www.volebnikalkulacka.cz" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "https://www.volebnikalkulacka.cz");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link).toHaveClass("ko-app-header-brand");
      expect(link).toContainElement(screen.getByText("Volební kalkulačka", { selector: "p" }));
    });
  });

  it("renders the actions after the brand, pushed to the right", () => {
    render(<AppHeader title="Volební kalkulačka" actions={<button type="button">Nabídka</button>} />);
    const actions = screen.getByRole("button", { name: "Nabídka" }).parentElement;
    expect(actions).toHaveClass("ko:ml-auto");
    expect(actions?.previousElementSibling).toHaveClass("ko-app-header-brand");
  });

  describe("logo", () => {
    it("is decorative and coloured by default", () => {
      const { container } = render(<AppHeader title="Volební kalkulačka" />);
      const svg = container.querySelector("svg");
      expect(svg?.closest("[aria-hidden='true']")).not.toBeNull();
      expect(svg?.querySelector("path")).toHaveClass("ko:text-logo-check");
    });

    it("drops the brand colours when monochrome", () => {
      const { container } = render(<AppHeader title="Volební kalkulačka" logoMonochrome />);
      for (const path of container.querySelectorAll("svg path")) {
        expect(path.getAttribute("class") ?? "").toBe("");
      }
    });
  });
});
