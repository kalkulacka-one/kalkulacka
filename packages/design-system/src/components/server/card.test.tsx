import { Card } from "@repo/design-system/server";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Card", () => {
  it("should render children", () => {
    render(<Card>Children</Card>);
    expect(screen.getByText("Children")).toBeInTheDocument();
  });
  describe("when given color prop", () => {
    it("should render the correct class", () => {
      const { container } = render(<Card color="transparent">Children</Card>);
      expect(container.firstChild).toHaveClass("ko:bg-transparent");
    });
  });

  describe("when given hardShadow prop", () => {
    it("should render no shadow when none", () => {
      const { container } = render(<Card hardShadow="none">Children</Card>);
      expect(container.firstChild).not.toHaveClass("ko:[box-shadow:2px_2px_0px_black]");
    });

    it("should render small hard shadow", () => {
      const { container } = render(<Card hardShadow="sm">Children</Card>);
      expect(container.firstChild).toHaveClass("ko:[box-shadow:2px_2px_0px_black]");
    });

    it("should render medium hard shadow", () => {
      const { container } = render(<Card hardShadow="md">Children</Card>);
      expect(container.firstChild).toHaveClass("ko:[box-shadow:4px_4px_0px_black]");
    });

    it("should render large hard shadow", () => {
      const { container } = render(<Card hardShadow="lg">Children</Card>);
      expect(container.firstChild).toHaveClass("ko:[box-shadow:6px_6px_0px_black]");
    });

    it("should render primary colored hard shadow", () => {
      const { container } = render(<Card hardShadow="primary">Children</Card>);
      expect(container.firstChild).toHaveClass("ko:[box-shadow:4px_4px_0px_black]");
    });

    it("should render secondary colored hard shadow", () => {
      const { container } = render(<Card hardShadow="secondary">Children</Card>);
      expect(container.firstChild).toHaveClass("ko:[box-shadow:4px_4px_0px_black]");
    });
  });
});
