import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, ButtonVariants } from "./button";
import { Icon } from "./icon";

describe("Button", () => {
  it("should render a children", () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Button");
  });

  it("should have default style when variant specififed", () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants()));
  });

  it("should default to variant fill and color primary", () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants({ variant: "fill", color: "primary" })));
  });

  describe("when given a specific variant and size prop", () => {
    it("should render the correct class", () => {
      render(
        <Button variant="outline" size="small">
          Button
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants({ variant: "outline", size: "small" })));
    });
  });

  describe.each(["fill", "outline", "link", "answer"] as const)("variant %s", (variant) => {
    it.each(["primary", "secondary", "neutral"] as const)("renders the %s color classes", (color) => {
      render(
        <Button variant={variant} color={color}>
          Button
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants({ variant, color })));
    });
  });

  it("should apply icon-only sizing when the only child is an Icon", () => {
    render(
      <Button aria-label="Search">
        <Icon icon="M0 0h24v24H0z" decorative />
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("ko:aspect-square", "ko:!rounded-full");
  });

  it("should not apply icon-only sizing when there is text alongside the icon", () => {
    render(
      <Button>
        <Icon icon="M0 0h24v24H0z" decorative />
        Button
      </Button>,
    );
    expect(screen.getByRole("button")).not.toHaveClass("ko:aspect-square");
  });
});
