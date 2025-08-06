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
});
