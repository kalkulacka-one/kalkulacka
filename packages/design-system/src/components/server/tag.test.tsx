import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tag, TagVariants } from "./tag";

describe("Tag", () => {
  it("should render children in a span", () => {
    render(<Tag>Vy</Tag>);
    expect(screen.getByText("Vy").tagName).toBe("SPAN");
  });

  it("should be a neutral pill by default", () => {
    render(<Tag>Vy</Tag>);
    expect(screen.getByText("Vy")).toHaveClass(twMerge(TagVariants()));
    expect(TagVariants().split(" ")).toEqual(expect.arrayContaining(["ko:rounded-pill", "ko:uppercase", "ko:tracking-[0.02em]", "ko:font-semibold", "ko:bg-neutral-wash", "ko:text-text"]));
  });

  describe("when given the agree tone", () => {
    it("should render in the agree wash", () => {
      render(<Tag tone="agree">Největší shoda</Tag>);
      expect(screen.getByText("Největší shoda")).toHaveClass(twMerge(TagVariants({ tone: "agree" })));

      const classes = TagVariants({ tone: "agree" }).split(" ");
      expect(classes).toEqual(expect.arrayContaining(["ko:bg-agree-wash", "ko:text-agree"]));
      expect(classes).not.toContain("ko:bg-neutral-wash");
    });
  });
});
