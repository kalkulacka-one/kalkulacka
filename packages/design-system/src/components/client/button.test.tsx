import { icons } from "@kalkulacka-one/design-system/icons";
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button, ButtonVariants } from "./button";
import { Icon } from "./icon";

const baseClasses = [
  "ko:inline-flex",
  "ko:items-center",
  "ko:justify-center",
  "ko:gap-2",
  "ko:rounded-pill",
  "ko:border-0",
  "ko:font-sans",
  "ko:font-semibold",
  "ko:tracking-[-0.01em]",
  "ko:whitespace-nowrap",
  "ko:no-underline",
  "ko:select-none",
  "ko:cursor-pointer",
  "ko:data-active:scale-[0.97]",
  "ko:data-disabled:opacity-45",
  "ko:data-disabled:cursor-default",
  "ko:data-focus:outline-3",
  "ko:data-focus:outline-offset-2",
  "ko:data-focus:outline-focus/55",
];

const retiredClasses = ["ko:rounded-2xl", "ko:rounded-br-none", "ko:border-2", "ko:h-10", "ko:h-12", "ko:h-14", "ko:text-s", "ko:grid", "ko:pt-[1px]"];

const solidNeutral = ["ko:bg-neutral-ink", "ko:text-on-neutral-ink", "ko:data-hover:bg-neutral-ink/90", "ko:data-active:bg-neutral-ink/80"];
const solidPrimary = ["ko:bg-agree", "ko:text-on-agree", "ko:data-hover:bg-agree-hover", "ko:data-active:bg-agree-active"];
const solidSecondary = ["ko:bg-disagree", "ko:text-on-disagree", "ko:data-hover:bg-disagree-hover", "ko:data-active:bg-disagree-active"];

const classesOf = (...args: Parameters<typeof ButtonVariants>) => twMerge(ButtonVariants(...args)).split(" ");

describe("Button", () => {
  it("should render a children", () => {
    render(<Button>Pokračovat</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Pokračovat");
  });

  describe("by default", () => {
    it("should have the default style", () => {
      render(<Button>Pokračovat</Button>);
      expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants()));
    });

    it("should be the solid neutral pill at the medium size", () => {
      expect(ButtonVariants()).toBe(ButtonVariants({ variant: "solid", color: "neutral", size: "medium" }));
      expect(classesOf()).toEqual(expect.arrayContaining([...baseClasses, ...solidNeutral, "ko:px-6", "ko:py-[0.8125rem]", "ko:text-[0.9375rem]"]));
    });

    it("should carry nothing of the retired design", () => {
      const classes = classesOf();
      for (const retired of retiredClasses) {
        expect(classes).not.toContain(retired);
      }
    });
  });

  describe("variants", () => {
    it("should render the solid variant", () => {
      expect(classesOf({ variant: "solid" })).toEqual(expect.arrayContaining([...baseClasses, ...solidNeutral]));
    });

    it("should render the ghost variant", () => {
      expect(classesOf({ variant: "ghost" })).toEqual(
        expect.arrayContaining([...baseClasses, "ko:bg-transparent", "ko:text-text", "ko:data-hover:bg-neutral-wash", "ko:data-active:bg-neutral-wash-strong"]),
      );
    });

    it("should render the surface variant", () => {
      expect(classesOf({ variant: "surface" })).toEqual(
        expect.arrayContaining([...baseClasses, "ko:bg-surface", "ko:text-text", "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]", "ko:data-hover:bg-neutral-wash"]),
      );
    });

    it("should render the plate variant", () => {
      expect(classesOf({ variant: "plate" })).toEqual(
        expect.arrayContaining([
          ...baseClasses,
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

    it("should render the merged classes of a given variant", () => {
      render(
        <Button variant="plate" size="large">
          Zpět na rekapitulaci
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants({ variant: "plate", size: "large" })));
    });
  });

  describe("colors", () => {
    it("should paint the solid variant in the neutral ink by default", () => {
      expect(classesOf({ variant: "solid" })).toEqual(expect.arrayContaining(solidNeutral));
    });

    it("should paint the solid variant in the agree color", () => {
      const classes = classesOf({ variant: "solid", color: "primary" });
      expect(classes).toEqual(expect.arrayContaining(solidPrimary));
      expect(classes).not.toContain("ko:bg-neutral-ink");
    });

    it("should paint the solid variant in the disagree color", () => {
      const classes = classesOf({ variant: "solid", color: "secondary" });
      expect(classes).toEqual(expect.arrayContaining(solidSecondary));
      expect(classes).not.toContain("ko:bg-neutral-ink");
    });

    it.each(["ghost", "surface", "plate"] as const)("should keep the %s variant neutral regardless of color", (variant) => {
      expect(ButtonVariants({ variant, color: "primary" })).toBe(ButtonVariants({ variant, color: "neutral" }));
      expect(ButtonVariants({ variant, color: "secondary" })).toBe(ButtonVariants({ variant, color: "neutral" }));
      expect(classesOf({ variant, color: "primary" })).not.toContain("ko:bg-agree");
      expect(classesOf({ variant, color: "secondary" })).not.toContain("ko:bg-disagree");
    });
  });

  describe("legacy aliases", () => {
    it("should map fill to solid", () => {
      expect(ButtonVariants({ variant: "fill" })).toBe(ButtonVariants({ variant: "solid" }));
      expect(ButtonVariants({ variant: "fill", color: "primary", size: "small" })).toBe(ButtonVariants({ variant: "solid", color: "primary", size: "small" }));
    });

    it("should map outline to surface", () => {
      expect(ButtonVariants({ variant: "outline" })).toBe(ButtonVariants({ variant: "surface" }));
      expect(ButtonVariants({ variant: "outline", color: "neutral", size: "large" })).toBe(ButtonVariants({ variant: "surface", color: "neutral", size: "large" }));
    });

    it("should map link to ghost", () => {
      expect(ButtonVariants({ variant: "link" })).toBe(ButtonVariants({ variant: "ghost" }));
      expect(ButtonVariants({ variant: "link", color: "neutral", size: "small" })).toBe(ButtonVariants({ variant: "ghost", color: "neutral", size: "small" }));
    });

    it("should render an aliased variant with the canonical classes", () => {
      render(
        <Button variant="outline" color="neutral" size="small">
          Kopírovat odkaz
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants({ variant: "surface", color: "neutral", size: "small" })));
    });
  });

  describe("legacy answer variant", () => {
    it("should take the new geometry", () => {
      const classes = classesOf({ variant: "answer", color: "primary" });
      expect(classes).toEqual(expect.arrayContaining(["ko:rounded-control", "ko:h-fluid-action", "ko:px-6", "ko:border-2", "ko:bg-transparent"]));
      expect(classes).not.toContain("ko:rounded-pill");
      expect(classes).not.toContain("ko:rounded-br-none");
      expect(classes).not.toContain("ko:border-0");
    });

    it("should keep its outlined, checked and just-clicked behaviour", () => {
      expect(classesOf({ variant: "answer", color: "primary" })).toEqual(
        expect.arrayContaining([
          "ko:border-primary",
          "ko:text-primary",
          "ko:hover:bg-primary",
          "ko:data-checked:bg-primary",
          "ko:data-checked:text-on-bg-primary",
          "ko:data-[just-clicked]:hover:!bg-transparent",
          "ko:data-active:bg-primary-active",
        ]),
      );
      expect(classesOf({ variant: "answer", color: "secondary" })).toEqual(expect.arrayContaining(["ko:border-secondary", "ko:text-secondary", "ko:data-checked:bg-secondary"]));
      expect(classesOf({ variant: "answer", color: "neutral" })).toEqual(expect.arrayContaining(["ko:border-neutral", "ko:text-neutral", "ko:data-checked:bg-neutral"]));
    });
  });

  describe("sizes", () => {
    it("should size by padding instead of a fixed height", () => {
      expect(classesOf({ size: "small" })).toEqual(expect.arrayContaining(["ko:px-4", "ko:py-2", "ko:text-sm"]));
      expect(classesOf({ size: "medium" })).toEqual(expect.arrayContaining(["ko:px-6", "ko:py-[0.8125rem]", "ko:text-[0.9375rem]"]));
      expect(classesOf({ size: "large" })).toEqual(expect.arrayContaining(["ko:px-7", "ko:py-4", "ko:text-[1.0625rem]"]));
    });

    it.each(["solid", "ghost", "surface", "plate"] as const)("should apply the same paddings to the %s variant", (variant) => {
      expect(classesOf({ variant, size: "small" })).toEqual(expect.arrayContaining(["ko:px-4", "ko:py-2", "ko:text-sm"]));
      expect(classesOf({ variant, size: "large" })).toEqual(expect.arrayContaining(["ko:px-7", "ko:py-4", "ko:text-[1.0625rem]"]));
      for (const height of ["ko:h-10", "ko:h-12", "ko:h-14"]) {
        expect(classesOf({ variant, size: "small" })).not.toContain(height);
        expect(classesOf({ variant, size: "large" })).not.toContain(height);
      }
    });

    it("should render the correct class for a given size", () => {
      render(
        <Button variant="ghost" size="small">
          Zrušit
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveClass(twMerge(ButtonVariants({ variant: "ghost", size: "small" })));
    });
  });

  describe("when the only child is an icon", () => {
    it("should render a round square at the medium size by default", () => {
      render(
        <Button aria-label="Zavřít">
          <Icon icon={icons.close} decorative />
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("ko:size-11", "ko:p-0", "ko:rounded-full");
      expect(button).not.toHaveClass("ko:px-6", "ko:py-[0.8125rem]", "ko:rounded-pill");
    });

    it("should render a smaller square for the small size", () => {
      render(
        <Button size="small" aria-label="Zavřít">
          <Icon icon={icons.close} decorative />
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("ko:size-9", "ko:p-0", "ko:rounded-full");
      expect(button).not.toHaveClass("ko:px-4", "ko:py-2");
    });

    it("should render a larger square for the large size", () => {
      render(
        <Button size="large" aria-label="Zavřít">
          <Icon icon={icons.close} decorative />
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("ko:size-12", "ko:p-0", "ko:rounded-full");
      expect(button).not.toHaveClass("ko:px-7", "ko:py-4");
    });

    it("should not treat an icon next to a label as icon-only", () => {
      render(
        <Button>
          <Icon icon={icons.close} decorative />
          Zavřít
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("ko:size-11", "ko:p-0", "ko:rounded-full");
      expect(button).toHaveClass("ko:px-6", "ko:rounded-pill");
    });
  });

  describe("when given icons", () => {
    it("should render a decorative icon before the label", () => {
      render(
        <Button variant="solid" color="primary" iconStart={icons.check}>
          Ano
        </Button>,
      );
      const button = screen.getByRole("button");
      const svg = button.firstElementChild;
      expect(svg?.tagName).toBe("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveClass("ko:size-3.5");
      expect(button).toHaveTextContent("Ano");
    });

    it("should render a decorative icon after the label", () => {
      render(
        <Button variant="solid" iconEnd={icons.arrowRight}>
          Pokračovat
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button.lastElementChild?.tagName).toBe("svg");
      expect(button.querySelectorAll("svg")).toHaveLength(1);
    });

    it("should not treat a button with iconStart as icon-only", () => {
      render(
        <Button variant="surface" iconStart={icons.download}>
          Stáhnout
        </Button>,
      );
      expect(screen.getByRole("button")).not.toHaveClass("ko:size-11", "ko:p-0");
    });
  });

  describe("when given fullWidth", () => {
    it("should stretch to the container", () => {
      render(<Button fullWidth>Zobrazit výsledky</Button>);
      expect(screen.getByRole("button")).toHaveClass("ko:w-full");
    });

    it("should not stretch by default", () => {
      render(<Button>Zobrazit výsledky</Button>);
      expect(screen.getByRole("button")).not.toHaveClass("ko:w-full");
    });
  });

  describe("when disabled", () => {
    it("should not be clickable", () => {
      const onClick = vi.fn();
      render(
        <Button onClick={onClick} disabled>
          Pokračovat
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("data-disabled");
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it("should carry the disabled styles", () => {
      render(<Button disabled>Pokračovat</Button>);
      expect(screen.getByRole("button")).toHaveClass("ko:data-disabled:opacity-45", "ko:data-disabled:cursor-default");
    });
  });

  it("should forward a ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Pokračovat</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
