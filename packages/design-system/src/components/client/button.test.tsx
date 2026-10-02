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

  describe.each(["fill", "outline", "link", "answer", "round", "pill"] as const)("variant %s", (variant) => {
    it.each(["primary", "secondary", "neutral"] as const)("renders the %s color classes", (color) => {
      render(
        <Button variant={variant} color={color}>
          Button
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants({ variant, color })));
    });
  });

  describe("variant answer", () => {
    it("uses a strongly tinted border and the control radius, unchecked", () => {
      render(
        <Button variant="answer" color="primary">
          Ano
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass("ko:border-primary-tint-strong", "ko:rounded-control", "ko:h-[clamp(58px,51.8776px+1.6327vw,78px)]", "ko:text-text-strong");
    });

    it("fills with the colour and the on-colour ink when checked", () => {
      render(
        <Button variant="answer" color="primary" data-checked>
          Ano
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass("ko:data-checked:bg-primary", "ko:data-checked:text-on-bg-primary");
    });
  });

  describe("variant round", () => {
    it("is a hairline circle sized to the star spacing token", () => {
      render(
        <Button variant="round" color="neutral" aria-label="Důležité">
          <Icon icon="M0 0h24v24H0z" decorative />
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass("ko:rounded-full", "ko:h-[clamp(52px,46.4898px+1.4694vw,70px)]", "ko:w-[clamp(52px,46.4898px+1.4694vw,70px)]", "ko:border-border");
    });

    it("fills with the colour when checked", () => {
      render(
        <Button variant="round" color="neutral" data-checked aria-label="Důležité">
          <Icon icon="M0 0h24v24H0z" decorative />
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass("ko:data-checked:bg-neutral", "ko:data-checked:text-on-bg-neutral");
    });

    it("is a fixed 44px touch target at size small, for the header close/back button", () => {
      render(
        <Button variant="round" color="neutral" size="small" aria-label="Zavřít">
          <Icon icon="M0 0h24v24H0z" decorative />
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass("ko:h-11", "ko:w-11");
      expect(screen.getByRole("button")).not.toHaveClass("ko:h-[clamp(52px,46.4898px+1.4694vw,70px)]");
    });
  });

  describe("variant pill", () => {
    it("is a light, hairline-bordered 40px pill regardless of color", () => {
      render(
        <Button variant="pill" color="primary">
          <Icon icon="M0 0h24v24H0z" decorative />
          Zpět
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass("ko:h-10", "ko:rounded-pill", "ko:border-border", "ko:bg-surface", "ko:text-text-strong");
      expect(screen.getByRole("button")).not.toHaveClass("ko:border-primary");
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
