import { DotIndicator } from "@kalkulacka-one/design-system/server";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Dot indicator", () => {
  describe("when given valid steps", () => {
    it("renders a dot indicator with the correct aria attributes", () => {
      render(<DotIndicator stepCurrent={2} stepTotal={5} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toBeInTheDocument();
      expect(progressbar).toHaveAttribute("aria-valuenow", "2");
      expect(progressbar).toHaveAttribute("aria-valuemin", "1");
      expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    });
  });
  describe("when given invalid steps", () => {
    it("it will throw error when stepCurrent is less than 1", () => {
      expect(() => render(<DotIndicator stepCurrent={0} stepTotal={4} />)).toThrow("Invalid props");
    });
    it("it will throw error when stepTotal is less than 1", () => {
      expect(() => render(<DotIndicator stepCurrent={1} stepTotal={0} />)).toThrow("Invalid props");
    });
    it("it will throw error when stepCurrent exceeds stepTotal", () => {
      expect(() => render(<DotIndicator stepCurrent={5} stepTotal={4} />)).toThrow("Invalid props");
    });
  });
});
