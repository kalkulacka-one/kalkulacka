import type { IconDefinition } from "@kalkulacka-one/design-system/icons";
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { Button as ButtonHeadless, type ButtonProps as ButtonPropsHeadless } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { Icon } from "./icon";

export type Button = {
  children: React.ReactNode;
  /** Icon shown before the label. */
  iconStart?: IconDefinition | string;
  /** Icon shown after the label. */
  iconEnd?: IconDefinition | string;
  fullWidth?: boolean;
} & Omit<ButtonPropsHeadless, "className" | "as"> &
  VariantProps<typeof ButtonVariants>;

/*
 * Shared by the pill-shaped variants (`solid`, `ghost`, `surface`, `plate`).
 * They replace the base's border, corner radius, tracking and fixed heights,
 * which `twMerge` resolves in their favour because they come later.
 */
const pillVariant = [
  "ko:border-0 ko:rounded-pill",
  "ko:font-semibold ko:tracking-[-0.01em] ko:whitespace-nowrap",
  "ko:gap-2 ko:[&>svg]:translate-y-0",
  "ko:transition-[background-color,color,transform] ko:duration-[var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-fast)]",
  "ko:data-active:scale-[0.97]",
  "ko:data-disabled:opacity-45 ko:data-disabled:cursor-default",
  "ko:data-focus:outline-3 ko:data-focus:outline-offset-2 ko:data-focus:outline-focus/55",
];

const pillVariants = ["solid", "ghost", "surface", "plate"] as const;

export const ButtonVariants = cva(
  [
    "ko:border-2",
    "ko:select-none ko:data-hover:cursor-pointer",
    "ko:font-semibold ko:tracking-[.01em]",
    "ko:rounded-2xl ko:rounded-br-none",
    "ko:text-s",
    "ko:data-disabled:cursor-not-allowed",
    "ko:grid ko:grid-flow-col ko:place-items-center ko:place-content-center ko:gap-1",
    "ko:pt-[1px] ko:[&>svg]:translate-y-[-1px]",
  ],
  {
    variants: {
      size: {
        small: "ko:h-10 ko:px-2",
        medium: "ko:h-12 ko:px-3",
        large: "ko:h-14 ko:px-4",
      },
      /* Listed before `variant` so a variant's own border (link's transparent one) wins the merge. */
      color: {
        primary: ["ko:border-primary", "ko:data-disabled:border-primary-disabled"],
        secondary: ["ko:border-secondary", "ko:data-disabled:border-secondary-disabled"],
        neutral: ["ko:border-neutral", "ko:data-disabled:border-neutral-disabled"],
      },
      variant: {
        fill: [""],
        outline: ["ko:bg-transparent"],
        link: ["ko:bg-transparent", "ko:border-transparent", "ko:data-disabled:border-transparent"],
        answer: ["ko:px-6"],
        solid: pillVariant,
        ghost: [...pillVariant, "ko:bg-transparent ko:text-text", "ko:data-hover:bg-neutral-wash", "ko:data-active:bg-neutral-wash-strong"],
        surface: [...pillVariant, "ko:bg-surface ko:text-text ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]", "ko:data-hover:bg-neutral-wash"],
        /*
         * Chrome that floats over the animated backdrop: the back link, the
         * share action. Deliberately the same values as IconButton's `surface`
         * variant — these sit within a few hundred pixels of each other on the
         * results screen, and any drift between them reads as unrelated
         * controls rather than one set. Translucent rather than opaque, because
         * the contrast behind them is never the same two frames running.
         */
        plate: [
          ...pillVariant,
          "ko:bg-surface/72 ko:text-text-muted ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
          "ko:backdrop-blur-[12px] ko:backdrop-saturate-[1.4]",
          "ko:data-hover:bg-surface ko:data-hover:text-text-strong ko:data-hover:shadow-[inset_0_0_0_1.5px_var(--ko-color-border-strong),var(--ko-shadow-card-back)]",
        ],
      },
    },
    defaultVariants: {
      size: "medium",
      variant: "fill",
      color: "primary",
    },
    compoundVariants: [
      {
        variant: "fill",
        color: "primary",
        class: [
          "ko:bg-primary",
          "ko:text-on-bg-primary",
          "ko:data-hover:bg-primary-hover ko:data-hover:border-primary-hover",
          "ko:data-focus:bg-primary-hover ko:data-focus:border-primary-hover",
          "ko:data-active:bg-primary-active ko:data-active:border-primary-active",
          "ko:data-hover:data-active:bg-primary-active ko:data-hover:data-active:border-primary-active",
          "ko:data-disabled:bg-primary-disabled",
        ],
      },
      {
        variant: "fill",
        color: "secondary",
        class: [
          "ko:bg-secondary",
          "ko:text-on-bg-secondary",
          "ko:data-hover:bg-secondary-hover ko:data-hover:border-secondary-hover",
          "ko:data-focus:bg-secondary-hover ko:data-focus:border-secondary-hover",
          "ko:data-active:bg-secondary-active ko:data-active:border-secondary-active",
          "ko:data-hover:data-active:bg-secondary-active ko:data-hover:data-active:border-secondary-active",
          "ko:data-disabled:bg-secondary-disabled",
        ],
      },
      {
        variant: "fill",
        color: "neutral",
        class: [
          "ko:bg-neutral",
          "ko:text-on-bg-neutral",
          "ko:data-hover:bg-neutral-hover ko:data-hover:border-neutral-hover",
          "ko:data-focus:bg-neutral-hover ko:data-focus:border-neutral-hover",
          "ko:data-active:bg-neutral-active ko:data-active:border-neutral-active",
          "ko:data-hover:data-active:bg-neutral-active ko:data-hover:data-active:border-neutral-active",
          "ko:data-disabled:bg-neutral-disabled",
        ],
      },
      {
        variant: "outline",
        color: "primary",
        class: [
          "ko:text-primary",
          "ko:data-hover:bg-primary-hover/10 ko:data-focus:bg-primary-hover/10",
          "ko:data-active:bg-primary-active/10",
          "ko:data-hover:data-active:bg-primary-active/10",
          "ko:data-disabled:text-primary-disabled",
        ],
      },
      {
        variant: "outline",
        color: "secondary",
        class: [
          "ko:text-secondary",
          "ko:data-hover:bg-secondary-hover/10 ko:data-focus:bg-secondary-hover/10",
          "ko:data-active:bg-secondary-active/10",
          "ko:data-hover:data-active:bg-secondary-active/10",
          "ko:data-disabled:text-secondary-disabled",
        ],
      },
      {
        variant: "outline",
        color: "neutral",
        class: [
          "ko:text-neutral",
          "ko:data-hover:bg-neutral-hover/10 ko:data-focus:bg-neutral-hover/10",
          "ko:data-active:bg-neutral-active/10",
          "ko:data-hover:data-active:bg-neutral-active/10",
          "ko:data-disabled:text-neutral-disabled",
        ],
      },
      {
        variant: "link",
        color: "primary",
        class: [
          "ko:text-primary",
          "ko:data-hover:bg-primary/10 ko:data-hover:text-primary-hover ko:data-focus:text-primary-hover",
          "ko:data-active:text-primary-active ko:data-active:bg-primary/10",
          "ko:data-hover:data-active:text-primary-active",
          "ko:data-disabled:text-primary-disabled",
        ],
      },
      {
        variant: "link",
        color: "secondary",
        class: [
          "ko:text-secondary",
          "ko:data-hover:bg-secondary/10 ko:data-hover:text-secondary-hover ko:data-focus:text-secondary-hover",
          "ko:data-active:text-secondary-active ko:data-active:bg-secondary/10",
          "ko:data-hover:data-active:text-secondary-active",
          "ko:data-disabled:text-secondary-disabled",
        ],
      },
      {
        variant: "link",
        color: "neutral",
        class: [
          "ko:text-neutral",
          "ko:data-hover:bg-neutral/10 ko:data-hover:text-neutral-hover ko:data-focus:text-neutral-hover",
          "ko:data-active:text-neutral-active ko:data-active:bg-neutral/10",
          "ko:data-hover:data-active:text-neutral-active",
          "ko:data-disabled:text-neutral-disabled",
        ],
      },
      {
        variant: "answer",
        color: "primary",
        class: [
          "ko:text-primary",
          "ko:hover:bg-primary ko:hover:text-on-bg-primary",
          "ko:data-[just-clicked]:hover:!bg-transparent ko:data-[just-clicked]:hover:!text-primary",
          "ko:data-checked:bg-primary ko:data-checked:text-on-bg-primary",
          "ko:data-checked:hover:bg-transparent ko:data-checked:hover:text-primary ko:data-checked:active:bg-primary-active/10 ko:data-checked:active:border-primary",
          "ko:data-checked:data-[just-clicked]:hover:!bg-primary ko:data-checked:data-[just-clicked]:hover:!text-on-bg-primary",
          "ko:data-active:bg-primary-active ko:data-active:border-primary-active ko:data-active:hover:bg-primary-active ko:data-active:text-on-bg-primary",
        ],
      },
      {
        variant: "answer",
        color: "secondary",
        class: [
          "ko:text-secondary",
          "ko:hover:bg-secondary ko:hover:text-on-bg-secondary",
          "ko:data-[just-clicked]:hover:!bg-transparent ko:data-[just-clicked]:hover:!text-secondary",
          "ko:data-checked:bg-secondary ko:data-checked:text-on-bg-secondary",
          "ko:data-checked:hover:bg-transparent ko:data-checked:hover:text-secondary ko:data-checked:active:bg-secondary-active/10 ko:data-checked:active:border-secondary",
          "ko:data-checked:data-[just-clicked]:hover:!bg-secondary ko:data-checked:data-[just-clicked]:hover:!text-on-bg-secondary",
          "ko:data-active:bg-secondary-active ko:data-active:border-secondary-active ko:data-active:hover:bg-secondary-active ko:data-active:text-on-bg-secondary",
        ],
      },
      {
        variant: "answer",
        color: "neutral",
        class: [
          "ko:text-neutral",
          "ko:hover:bg-neutral ko:hover:text-on-bg-neutral",
          "ko:data-[just-clicked]:hover:!bg-transparent ko:data-[just-clicked]:hover:!text-neutral",
          "ko:data-checked:bg-neutral ko:data-checked:text-on-bg-neutral",
          "ko:data-checked:hover:bg-transparent ko:data-checked:hover:text-neutral ko:data-checked:active:bg-neutral-active/10 ko:data-checked:active:border-neutral",
          "ko:data-checked:data-[just-clicked]:hover:!bg-neutral ko:data-checked:data-[just-clicked]:hover:!text-on-bg-neutral",
          "ko:data-active:bg-neutral-active ko:data-active:border-neutral-active ko:data-active:hover:bg-neutral-active ko:data-active:text-on-bg-neutral",
        ],
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
      {
        variant: "solid",
        color: "neutral",
        class: ["ko:bg-neutral-ink ko:text-on-neutral-ink", "ko:data-hover:bg-neutral-ink/90", "ko:data-active:bg-neutral-ink/80"],
      },
      /* The pill variants size by padding rather than by a fixed height. */
      {
        variant: [...pillVariants],
        size: "small",
        class: "ko:h-auto ko:px-4 ko:py-2 ko:text-sm",
      },
      {
        variant: [...pillVariants],
        size: "medium",
        class: "ko:h-auto ko:px-6 ko:py-[0.8125rem] ko:text-[0.9375rem]",
      },
      {
        variant: [...pillVariants],
        size: "large",
        class: "ko:h-auto ko:px-7 ko:py-4 ko:text-[1.0625rem]",
      },
    ],
  },
);

function ButtonComponent({ children, size, variant, color, iconStart, iconEnd, fullWidth = false, ...props }: Button, ref: React.Ref<HTMLButtonElement>) {
  const isIconOnly = React.isValidElement(children) && (children as React.ReactElement).type === Icon;

  const iconOnlyClasses = isIconOnly ? "ko:aspect-square ko:!p-0 ko:!rounded-full ko:grid ko:place-items-center" : "";

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
