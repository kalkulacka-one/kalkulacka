import { Logo } from "@repo/design-system/server";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Logo", () => {
  const logoName = "Volební kalkulačka";
  describe("when children are provided", () => {
    it("should have the svg not visible to screen readers", () => {
      render(
        <Logo logoName={logoName} textPosition="horizontal">
          {logoName}
        </Logo>,
      );
      expect(screen.getByRole("img", { hidden: true })).toHaveAttribute("aria-hidden", "true");
    });
    it("should have the svg title not visible to screen readers", () => {
      render(
        <Logo logoName={logoName} textPosition="horizontal">
          {logoName}
        </Logo>,
      );
      expect(screen.queryByTitle(logoName)).toBe(null);
    });
  });
  describe("when children are not provided", () => {
    it("should have the svg visible to screen readers", () => {
      render(<Logo logoName={logoName} textPosition="horizontal" />);
      expect(screen.getByRole("img", { name: logoName })).toBeVisible();
    });
    it("should have the svg title visible to screen readers", () => {
      render(<Logo logoName={logoName} textPosition="horizontal" />);
      expect(screen.getByTitle(logoName)).toBeInTheDocument();
    });
  });
  describe("when textPosition is horizontal", () => {
    it("should render the correct class", () => {
      const { container } = render(<Logo logoName={logoName} textPosition="horizontal" />);
      expect(container.firstChild).toHaveClass("ko:items-center");
    });
  });
});
