import type { IconDefinition } from "@kalkulacka-one/design-system/icons";
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { Button as ButtonHeadless, type ButtonProps as ButtonPropsHeadless } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { Icon } from "./icon";

const buttonVariants = cva(
  [
    "ko:inline-flex ko:items-center ko:justify-center ko:gap-2",
    "ko:rounded-pill ko:border-0",
    "ko:font-sans ko:font-semibold ko:tracking-[-0.01em] ko:whitespace-nowrap ko:no-underline",
    "ko:select-none ko:cursor-pointer",
    "ko:transition-[background-color,color,transform] ko:duration-[var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-fast)]",
    "ko:data-active:scale-[0.97]",
    "ko:data-disabled:opacity-45 ko:data-disabled:cursor-default",
    "ko:data-focus:outline-3 ko:data-focus:outline-offset-2 ko:data-focus:outline-focus/55",
  ],
  {
    variants: {
      /* Padding rather than a fixed height, so the pill grows with its label. */
      size: {
        small: "ko:px-4 ko:py-2 ko:text-sm",
        medium: "ko:px-6 ko:py-[0.8125rem] ko:text-[0.9375rem]",
        large: "ko:px-7 ko:py-4 ko:text-[1.0625rem]",
      },
      /*
       * Colour only reaches `solid` through the compound variants below;
       * `ghost`, `surface` and `plate` are neutral whatever is passed.
       */
      color: {
        neutral: "",
        primary: "",
        secondary: "",
      },
      variant: {
        solid: "",
        ghost: ["ko:bg-transparent ko:text-text", "ko:data-hover:bg-neutral-wash", "ko:data-active:bg-neutral-wash-strong"],
        surface: ["ko:bg-surface ko:text-text ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]", "ko:data-hover:bg-neutral-wash"],
        /*
         * Chrome that floats over the animated backdrop: the back link, the
         * share action. Deliberately the same values as IconButton's `surface`
         * variant — these sit within a few hundred pixels of each other on the
         * results screen, and any drift between them reads as unrelated
         * controls rather than one set. Translucent rather than opaque, because
         * the contrast behind them is never the same two frames running.
         */
        plate: [
          "ko:bg-surface/72 ko:text-text-muted ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
          "ko:backdrop-blur-[12px] ko:backdrop-saturate-[1.4]",
          "ko:data-hover:bg-surface ko:data-hover:text-text-strong ko:data-hover:shadow-[inset_0_0_0_1.5px_var(--ko-color-border-strong),var(--ko-shadow-card-back)]",
        ],
      },
    },
    defaultVariants: {
      size: "medium",
      variant: "solid",
      color: "neutral",
    },
    compoundVariants: [
      {
        variant: "solid",
        color: "neutral",
        class: ["ko:bg-neutral-ink ko:text-on-neutral-ink", "ko:data-hover:bg-neutral-ink/90", "ko:data-active:bg-neutral-ink/80"],
      },
      {
        variant: "solid",
        color: "primary",
        class: ["ko:bg-agree ko:text-on-agree", "ko:data-hover:bg-agree-hover", "ko:data-active:bg-agree-active"],
      },
      {
        variant: "solid",
        color: "secondary",
        class: ["ko:bg-disagree ko:text-on-disagree", "ko:data-hover:bg-disagree-hover", "ko:data-active:bg-disagree-active"],
      },
    ],
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonVariant = NonNullable<ButtonVariantProps["variant"]>;
export type ButtonSize = NonNullable<ButtonVariantProps["size"]>;

/**
 * Variant names of the retired design, still used by the screens the port did
 * not touch — the homepage and content pages, the subscribe, donate and
 * city-signup forms. `fill` is the `solid` pill, `outline` the `surface` one
 * and `link` the `ghost`.
 *
 * @deprecated Removed once those pages are restyled; use `solid`, `surface` or `ghost`.
 */
export type LegacyButtonVariant = "fill" | "outline" | "link";

/** @deprecated Removed together with `LegacyButtonVariant`. */
const legacyVariants = {
  fill: "solid",
  outline: "surface",
  link: "ghost",
} as const satisfies Record<LegacyButtonVariant, ButtonVariant>;

export type ButtonVariantsProps = Omit<ButtonVariantProps, "variant"> & {
  variant?: ButtonVariant | LegacyButtonVariant | null;
};

function canonicalVariant(variant: ButtonVariantsProps["variant"]): ButtonVariantProps["variant"] {
  if (variant === "fill" || variant === "outline" || variant === "link") {
    return legacyVariants[variant];
  }
  return variant;
}

/** The Button's class list. Legacy variant names resolve to their pill counterpart first, so `fill` and `solid` produce the same classes. */
export function ButtonVariants({ variant, ...props }: ButtonVariantsProps = {}): string {
  return buttonVariants({ ...props, variant: canonicalVariant(variant) });
}

export type Button = {
  children: React.ReactNode;
  /** Icon shown before the label. */
  iconStart?: IconDefinition | string;
  /** Icon shown after the label. */
  iconEnd?: IconDefinition | string;
  fullWidth?: boolean;
} & Omit<ButtonPropsHeadless, "className" | "as"> &
  VariantProps<typeof ButtonVariants>;

/* Explicit squares: a pill with no padding would otherwise collapse onto its icon. */
const iconOnlySizes: Record<ButtonSize, string> = {
  small: "ko:size-9",
  medium: "ko:size-11",
  large: "ko:size-12",
};

function ButtonComponent({ children, size, variant, color, iconStart, iconEnd, fullWidth = false, ...props }: Button, ref: React.Ref<HTMLButtonElement>) {
  const isIconOnly = React.isValidElement(children) && (children as React.ReactElement).type === Icon;

  const iconOnlyClasses = isIconOnly ? [iconOnlySizes[size ?? "medium"], "ko:p-0 ko:rounded-full"] : "";

  return (
    <ButtonHeadless className={twMerge(ButtonVariants({ size, variant, color }), fullWidth && "ko:w-full", iconOnlyClasses)} {...props} ref={ref}>
      {iconStart && <Icon icon={iconStart} size="xsmall" decorative />}
      {children}
      {iconEnd && <Icon icon={iconEnd} size="xsmall" decorative />}
    </ButtonHeadless>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
