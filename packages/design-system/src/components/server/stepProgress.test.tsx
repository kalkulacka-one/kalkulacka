import { StepProgress } from "@repo/design-system/server";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Step progress", () => {
  describe("when given valid steps", () => {
    it("renders a progressbar with the correct aria attributes", () => {
      render(<StepProgress stepCurrent={2} stepTotal={5} />);
      const progressbar = screen.getByRole("progressbar");

      expect(progressbar).toBeInTheDocument();
      expect(progressbar).toHaveAttribute("aria-valuenow", "2");
      expect(progressbar).toHaveAttribute("aria-valuemin", "1");
      expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    });
  });

  describe("when given invalid steps", () => {
    it("does not render when stepCurrent is less than 1", () => {
      render(<StepProgress stepCurrent={0} stepTotal={4} />);
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("does not render when stepTotal is less than 1", () => {
      render(<StepProgress stepCurrent={1} stepTotal={0} />);
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("does not render when stepCurrent exceeds stepTotal", () => {
      render(<StepProgress stepCurrent={5} stepTotal={4} />);
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });
});
