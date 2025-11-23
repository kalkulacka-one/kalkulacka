import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressBar } from "./progressBar";

describe("ProgressBar", () => {
  describe("when given valid value", () => {
    it("should render with the correct width and aria-attributes based on value", () => {
      render(<ProgressBar value={50} />);
      const progressBar = screen.getByRole("progressbar");
      const innerBar = progressBar.firstChild as HTMLElement;
      expect(innerBar.style.width).toBe("50%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "50");
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      expect(progressBar).toHaveAttribute("aria-valuemax", "100");
    });
  });

  it("should clamp the value to 100 if value is greater than 100", () => {
    render(<ProgressBar value={150} />);
    const progressBar = screen.getByRole("progressbar");
    const innerBar = progressBar.firstChild as HTMLElement;
    expect(innerBar.style.width).toBe("100%");
  });

  it("should apply the primary color variant by default", () => {
    render(<ProgressBar value={50} />);
    const progressBar = screen.getByRole("progressbar");
    const innerBar = progressBar.firstChild as HTMLElement;
    expect(innerBar).toHaveClass("ko:bg-primary");
  });
});
