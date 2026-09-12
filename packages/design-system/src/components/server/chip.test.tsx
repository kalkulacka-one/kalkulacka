import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Chip, ChipVariants } from "./chip";

describe("Chip", () => {
  it("should render children in a span", () => {
    render(<Chip>Energetika</Chip>);
    expect(screen.getByText("Energetika").tagName).toBe("SPAN");
  });

  it("should be filled by default", () => {
    render(<Chip>Energetika</Chip>);
    expect(screen.getByText("Energetika")).toHaveClass(twMerge(ChipVariants()));
    expect(ChipVariants().split(" ")).toEqual(expect.arrayContaining(["ko:bg-surface-sunken", "ko:rounded-chip", "ko:text-fluid-chip", "ko:font-medium", "ko:text-text"]));
  });

  describe("when given the outline variant", () => {
    it("should render as an outlined chip", () => {
      render(<Chip variant="outline">Omezení vánoční výzdoby</Chip>);
      expect(screen.getByText("Omezení vánoční výzdoby")).toHaveClass(twMerge(ChipVariants({ variant: "outline" })));

      const classes = ChipVariants({ variant: "outline" }).split(" ");
      expect(classes).toEqual(expect.arrayContaining(["ko:bg-surface", "ko:shadow-[inset_0_0_0_1px_var(--ko-color-border)]"]));
      expect(classes).not.toContain("ko:bg-surface-sunken");
    });
  });
});
