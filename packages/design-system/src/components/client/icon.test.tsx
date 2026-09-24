import { EnvelopeIcon, icons } from "@kalkulacka-one/design-system/icons";

import { mdiAccount } from "@mdi/js";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Icon } from "./icon";

describe("Icon", () => {
  it("should render when given a path string", () => {
    render(<Icon icon={mdiAccount} decorative data-testid="account" />);
    expect(screen.getByTestId("account")).toBeInTheDocument();
  });
  it("should render when given an SVG component", () => {
    render(<Icon icon={EnvelopeIcon} decorative data-testid="envelope" />);
    expect(screen.getByTestId("envelope")).toBeInTheDocument();
  });
  describe("when set as decorative", () => {
    it("should not be visible to screen readers", () => {
      const { container } = render(<Icon icon={mdiAccount} decorative data-testid="account" />);
      expect(screen.queryByRole("img")).toBe(null);
      expect(container.querySelector("title")).toBe(null);
      expect(screen.getByTestId("account")).toHaveAttribute("aria-hidden", "true");
    });
  });
  describe("when set as non-decorative", () => {
    it("should be visible to screen readers", () => {
      render(<Icon icon={EnvelopeIcon} decorative={false} title="envelope" />);
      expect(screen.getByRole("img", { name: "envelope" })).toBeVisible();
      expect(screen.getByTitle("envelope")).toBeInTheDocument();
    });
  });
  describe("when given size prop", () => {
    it("should render the correct class", () => {
      const { container } = render(<Icon icon={EnvelopeIcon} decorative size="small" data-testid="envelope" />);
      expect(container.firstChild).toHaveClass("ko:size-4 ko:min-w-4");
    });

    it("should render the xsmall size used inside buttons", () => {
      const { container } = render(<Icon icon={icons.arrowRight} decorative size="xsmall" />);
      expect(container.firstChild).toHaveClass("ko:size-3.5 ko:min-w-3.5");
    });

    it("should render the regular size", () => {
      const { container } = render(<Icon icon={icons.arrowRight} decorative size="regular" />);
      expect(container.firstChild).toHaveClass("ko:size-5 ko:min-w-5");
    });
  });

  describe("when given an icon definition", () => {
    it("should outline a stroke icon", () => {
      const { container } = render(<Icon icon={icons.star} decorative data-testid="star" />);
      const svg = screen.getByTestId("star");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 23");
      expect(svg).toHaveAttribute("fill", "none");
      expect(svg).toHaveAttribute("stroke", "currentColor");
      expect(svg).toHaveAttribute("stroke-width", "2");
      expect(svg).toHaveAttribute("stroke-linejoin", "round");
      expect(svg).not.toHaveAttribute("stroke-linecap");
      expect(container.querySelectorAll("path")).toHaveLength(1);
      expect(container.querySelector("path")).toHaveAttribute("d", icons.star.paths[0]);
    });

    it("should fill a stroke icon when filled", () => {
      render(<Icon icon={icons.star} decorative filled data-testid="star" />);
      const svg = screen.getByTestId("star");
      expect(svg).toHaveAttribute("fill", "currentColor");
      expect(svg).toHaveAttribute("stroke", "currentColor");
      expect(svg).not.toHaveAttribute("filled");
    });

    it("should fill a fill icon without stroke attributes", () => {
      render(<Icon icon={icons.check} decorative data-testid="check" />);
      const svg = screen.getByTestId("check");
      expect(svg).toHaveAttribute("viewBox", "0 0 23 18");
      expect(svg).toHaveAttribute("fill", "currentColor");
      expect(svg).not.toHaveAttribute("stroke");
      expect(svg).not.toHaveAttribute("stroke-width");
    });

    it("should render the thin set's stroke settings", () => {
      render(<Icon icon={icons.arrowLeft} decorative data-testid="arrow" />);
      const svg = screen.getByTestId("arrow");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
      expect(svg).toHaveAttribute("stroke-width", "1.5");
      expect(svg).toHaveAttribute("stroke-linecap", "butt");
      expect(svg).toHaveAttribute("stroke-linejoin", "miter");
    });

    it("should render dots as solid circles", () => {
      const { container } = render(<Icon icon={icons.more} decorative />);
      const circles = container.querySelectorAll("circle");
      expect(container.querySelectorAll("path")).toHaveLength(0);
      expect(circles).toHaveLength(3);
      expect(circles[0]).toHaveAttribute("cx", "5");
      expect(circles[0]).toHaveAttribute("cy", "12");
      expect(circles[0]).toHaveAttribute("r", "1.6");
      expect(circles[0]).toHaveAttribute("fill", "currentColor");
      expect(circles[0]).toHaveAttribute("stroke", "none");
    });

    it("should keep the accessibility contract", () => {
      render(<Icon icon={icons.close} decorative={false} title="Close" />);
      expect(screen.getByRole("img", { name: "Close" })).toBeInTheDocument();
      expect(screen.getByTitle("Close")).toBeInTheDocument();
    });
  });
});
