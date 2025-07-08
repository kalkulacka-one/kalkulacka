import { Logo } from "@repo/design-system/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Logo", () => {
  it("renders the SVG as an image", () => {
    render(<Logo title="Volební kalkulačka" />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("includes the correct <title> element inside SVG", () => {
    render(<Logo title="Volební kalkulačka" />);
    const title = screen.getByTitle("Volební kalkulačka");
    expect(title).toBeInTheDocument();
  });

  it("does not render visible text", () => {
    render(<Logo title="Volební kalkulačka" />);
    expect(screen.queryByText("Volební kalkulačka")).not.toBeVisible();
  });

  describe("when `text` is true", () => {
    it("renders the visible text label", () => {
      render(<Logo title="Volební kalkulačka" text />);
      expect(screen.getByText("Volební kalkulačka")).toBeInTheDocument();
    });

    it("renders SVG with aria-hidden", () => {
      const { container } = render(<Logo title="Volební kalkulačka" text />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("does not include a <title> element", () => {
      render(<Logo title="Volební kalkulačka" text />);
      const title = screen.queryByTitle("Volební kalkulačka");
      expect(title).not.toBeInTheDocument();
    });
  });
});
