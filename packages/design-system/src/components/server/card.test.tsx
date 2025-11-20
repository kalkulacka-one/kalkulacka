import { Card } from "@kalkulacka-one/design-system/server";

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

  describe("when given interactive prop", () => {
    it("should not add any classes when interactive is true", () => {
      const { container } = render(<Card interactive={true}>Children</Card>);
      expect(container.firstChild).not.toHaveClass("ko:transition-colors");
      expect(container.firstChild).not.toHaveClass("ko:duration-200");
    });
  });
});
