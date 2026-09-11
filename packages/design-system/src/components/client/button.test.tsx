import { icons } from "@kalkulacka-one/design-system/icons";
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

  describe("pill variants", () => {
    const pillClasses = ["ko:border-0", "ko:rounded-pill", "ko:tracking-[-0.01em]", "ko:whitespace-nowrap", "ko:data-active:scale-[0.97]", "ko:data-disabled:opacity-45", "ko:data-focus:outline-3"];

    it("should render the solid variant in the neutral ink", () => {
      const classes = ButtonVariants({ variant: "solid", color: "neutral" }).split(" ");
      expect(classes).toEqual(expect.arrayContaining([...pillClasses, "ko:bg-neutral-ink", "ko:text-on-neutral-ink", "ko:data-hover:bg-neutral-ink/90", "ko:data-active:bg-neutral-ink/80"]));
    });

    it("should render the solid variant in the answer colors", () => {
      expect(ButtonVariants({ variant: "solid", color: "primary" }).split(" ")).toEqual(
        expect.arrayContaining(["ko:bg-agree", "ko:text-on-agree", "ko:data-hover:bg-agree-hover", "ko:data-active:bg-agree-active"]),
      );
      expect(ButtonVariants({ variant: "solid", color: "secondary" }).split(" ")).toEqual(
        expect.arrayContaining(["ko:bg-disagree", "ko:text-on-disagree", "ko:data-hover:bg-disagree-hover", "ko:data-active:bg-disagree-active"]),
      );
    });

    it("should render the ghost variant", () => {
      const classes = ButtonVariants({ variant: "ghost" }).split(" ");
      expect(classes).toEqual(expect.arrayContaining([...pillClasses, "ko:bg-transparent", "ko:text-text", "ko:data-hover:bg-neutral-wash", "ko:data-active:bg-neutral-wash-strong"]));
    });

    it("should render the surface variant", () => {
      const classes = ButtonVariants({ variant: "surface" }).split(" ");
      expect(classes).toEqual(expect.arrayContaining([...pillClasses, "ko:bg-surface", "ko:text-text", "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]", "ko:data-hover:bg-neutral-wash"]));
    });

    it("should render the plate variant", () => {
      const classes = ButtonVariants({ variant: "plate" }).split(" ");
      expect(classes).toEqual(
        expect.arrayContaining([
          ...pillClasses,
          "ko:bg-surface/72",
          "ko:text-text-muted",
          "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
          "ko:backdrop-blur-[12px]",
          "ko:backdrop-saturate-[1.4]",
          "ko:data-hover:bg-surface",
          "ko:data-hover:text-text-strong",
          "ko:data-hover:shadow-[inset_0_0_0_1.5px_var(--ko-color-border-strong),var(--ko-shadow-card-back)]",
        ]),
      );
    });

    it("should size by padding instead of a fixed height", () => {
      expect(ButtonVariants({ variant: "solid", size: "small" }).split(" ")).toEqual(expect.arrayContaining(["ko:h-auto", "ko:px-4", "ko:py-2", "ko:text-sm"]));
      expect(ButtonVariants({ variant: "ghost", size: "medium" }).split(" ")).toEqual(expect.arrayContaining(["ko:h-auto", "ko:px-6", "ko:py-[0.8125rem]", "ko:text-[0.9375rem]"]));
      expect(ButtonVariants({ variant: "surface", size: "large" }).split(" ")).toEqual(expect.arrayContaining(["ko:h-auto", "ko:px-7", "ko:py-4", "ko:text-[1.0625rem]"]));
      expect(ButtonVariants({ variant: "plate", size: "large" }).split(" ")).toEqual(expect.arrayContaining(["ko:h-auto", "ko:px-7", "ko:py-4", "ko:text-[1.0625rem]"]));
    });

    it("should not apply the pill sizing to the existing variants", () => {
      expect(ButtonVariants({ variant: "fill", size: "small" }).split(" ")).not.toContain("ko:h-auto");
      expect(ButtonVariants({ variant: "outline", size: "medium" }).split(" ")).toEqual(expect.arrayContaining(["ko:h-12", "ko:px-3"]));
    });

    it("should render the merged classes", () => {
      render(
        <Button variant="plate" size="large">
          Button
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants({ variant: "plate", size: "large" })));
    });
  });

  describe("twMerge", () => {
    it("should let the pill radius win over the base radius", () => {
      expect(twMerge("ko:rounded-2xl ko:rounded-br-none ko:rounded-pill")).toBe("ko:rounded-pill");
    });

    it("should let an automatic height win over a fixed height", () => {
      expect(twMerge("ko:h-12 ko:h-auto")).toBe("ko:h-auto");
    });

    it("should drop the base shape from the pill variants", () => {
      const merged = twMerge(ButtonVariants({ variant: "solid" })).split(" ");
      expect(merged).not.toContain("ko:rounded-2xl");
      expect(merged).not.toContain("ko:rounded-br-none");
      expect(merged).not.toContain("ko:h-12");
      expect(merged).not.toContain("ko:px-3");
      expect(merged).not.toContain("ko:border-2");
      expect(merged).not.toContain("ko:text-s");
      expect(merged).toEqual(expect.arrayContaining(["ko:rounded-pill", "ko:h-auto", "ko:px-6", "ko:border-0", "ko:text-[0.9375rem]"]));
    });

    it("should keep the existing variants intact", () => {
      const outline = twMerge(ButtonVariants({ variant: "outline", color: "primary" })).split(" ");
      expect(outline).toEqual(expect.arrayContaining(["ko:border-2", "ko:rounded-2xl", "ko:rounded-br-none", "ko:h-12", "ko:px-3", "ko:text-s", "ko:text-primary", "ko:border-primary"]));

      const link = twMerge(ButtonVariants({ variant: "link", color: "primary" })).split(" ");
      expect(link).toEqual(expect.arrayContaining(["ko:border-transparent", "ko:data-disabled:border-transparent", "ko:rounded-br-none"]));
      expect(link).not.toContain("ko:border-primary");

      const answer = twMerge(ButtonVariants({ variant: "answer", color: "primary" })).split(" ");
      expect(answer).toEqual(expect.arrayContaining(["ko:px-6", "ko:rounded-br-none"]));
      expect(answer).not.toContain("ko:px-3");
    });
  });

  describe("when given fullWidth", () => {
    it("should stretch to the container", () => {
      render(<Button fullWidth>Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("ko:w-full");
    });

    it("should not stretch by default", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).not.toHaveClass("ko:w-full");
    });
  });

  describe("when given icons", () => {
    it("should render a decorative icon before the label", () => {
      render(
        <Button variant="ghost" iconStart={icons.arrowLeft}>
          Back
        </Button>,
      );
      const button = screen.getByRole("button");
      const svg = button.firstElementChild;
      expect(svg?.tagName).toBe("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveClass("ko:size-3.5");
      expect(button).toHaveTextContent("Back");
    });

    it("should render a decorative icon after the label", () => {
      render(
        <Button variant="solid" iconEnd={icons.arrowRight}>
          Next
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button.lastElementChild?.tagName).toBe("svg");
      expect(button.querySelectorAll("svg")).toHaveLength(1);
    });
  });
});
