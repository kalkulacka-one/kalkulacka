import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, ButtonVariants } from "./button";

describe("Button", () => {
  it("should render a children", () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Button");
  });

  it("should have default style when variant specififed", () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants()));
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
});
