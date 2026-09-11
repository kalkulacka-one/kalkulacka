import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "./logo";

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

  it("renders the SVG with `aria-labelledby`", () => {
    const { container } = render(<Logo title="Volební kalkulačka" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-labelledby");
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("does not render visible text", () => {
    render(<Logo title="Volební kalkulačka" />);
    expect(screen.queryByText("Volební kalkulačka")).not.toBeVisible();
  });

  describe("size", () => {
    it("has no fixed size by default", () => {
      const { container } = render(<Logo title="Volební kalkulačka" />);
      expect(container.firstElementChild?.className).not.toMatch(/ko:text-\[/);
    });

    it("renders a 12px mark as `xsmall`", () => {
      const { container } = render(<Logo title="Volební kalkulačka" size="xsmall" />);
      expect(container.firstElementChild).toHaveClass("ko:text-[0.1875rem]");
      expect(container.querySelector("svg")).toHaveClass("ko:h-[4em]");
    });
  });

  describe("when `text` is true", () => {
    it("renders the visible text label", () => {
      render(<Logo title="Volební kalkulačka" text />);
      expect(screen.getByText("Volební kalkulačka")).toBeInTheDocument();
    });

    it("renders SVG with `aria-hidden`", () => {
      const { container } = render(<Logo title="Volební kalkulačka" text />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).not.toHaveAttribute("aria-labelledby");
    });

    it("does not include a <title> element", () => {
      render(<Logo title="Volební kalkulačka" text />);
      const title = screen.queryByTitle("Volební kalkulačka");
      expect(title).not.toBeInTheDocument();
    });
  });
});
