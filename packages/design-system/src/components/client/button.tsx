import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { Button as ButtonHeadless, type ButtonProps as ButtonPropsHeadless } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { Icon } from "./icon";

export type Button = {
  children: React.ReactNode;
} & Omit<ButtonPropsHeadless, "className" | "as"> &
  VariantProps<typeof ButtonVariants>;

/*
 * Colour is expressed through the `primary`/`secondary`/`neutral` tokens —
 * the same names a themed instance already pins to restyle the "ano"/"ne"
 * meaning. This restyle only changes which formulas those names resolve to
 * (2026's flat hover/active steps and soft/wash variants), not the names
 * themselves, so every existing caller keeps working unchanged.
 */
export const ButtonVariants = cva(
  [
    "ko:select-none ko:data-hover:cursor-pointer",
    "ko:font-semibold ko:tracking-[.01em]",
    "ko:rounded-pill",
    "ko:text-s",
    "ko:border-2",
    "ko:transition-[background-color,color,border-color,transform] ko:duration-base ko:data-active:duration-fast",
    "ko:data-disabled:cursor-not-allowed ko:data-disabled:opacity-45",
    "ko:grid ko:grid-flow-col ko:place-items-center ko:place-content-center ko:gap-1",
    "ko:data-active:scale-[0.97]",
    "ko:data-focus:outline-3 ko:data-focus:outline-offset-2 ko:data-focus:outline-focus/55",
  ],
  {
    variants: {
      size: {
        small: "ko:h-10 ko:px-4",
        medium: "ko:h-12 ko:px-5",
      },
      variant: {
        fill: [""],
        outline: ["ko:bg-transparent"],
        link: ["ko:bg-transparent"],
        answer: ["ko:rounded-control ko:px-6"],
      },
      color: {
        primary: ["ko:border-primary", "ko:data-disabled:border-primary"],
        secondary: ["ko:border-secondary", "ko:data-disabled:border-secondary"],
        neutral: ["ko:border-neutral", "ko:data-disabled:border-neutral"],
      },
    },
    defaultVariants: {
      size: "medium",
      variant: "fill",
      color: "primary",
    },
    compoundVariants: [
      {
        variant: "link",
        class: ["ko:border-transparent", "ko:data-disabled:border-transparent"],
      },
      {
        variant: "fill",
        color: "primary",
        class: [
          "ko:bg-primary",
          "ko:text-on-bg-primary",
          "ko:data-hover:bg-primary-hover",
          "ko:data-focus:bg-primary-hover",
          "ko:data-active:bg-primary-active",
          "ko:data-hover:data-active:bg-primary-active",
        ],
      },
      {
        variant: "fill",
        color: "secondary",
        class: [
          "ko:bg-secondary",
          "ko:text-on-bg-secondary",
          "ko:data-hover:bg-secondary-hover",
          "ko:data-focus:bg-secondary-hover",
          "ko:data-active:bg-secondary-active",
          "ko:data-hover:data-active:bg-secondary-active",
        ],
      },
      {
        variant: "fill",
        color: "neutral",
        class: ["ko:bg-neutral", "ko:text-on-bg-neutral", "ko:data-hover:bg-neutral/90", "ko:data-focus:bg-neutral/90", "ko:data-active:bg-neutral/80", "ko:data-hover:data-active:bg-neutral/80"],
      },
      {
        variant: "outline",
        color: "primary",
        class: [
          "ko:text-primary",
          "ko:data-hover:bg-primary-wash ko:data-focus:bg-primary-wash",
          "ko:data-active:bg-primary-wash-strong",
          "ko:data-hover:data-active:bg-primary-wash-strong",
          "ko:data-disabled:text-primary",
        ],
      },
      {
        variant: "outline",
        color: "secondary",
        class: [
          "ko:text-secondary",
          "ko:data-hover:bg-secondary-wash ko:data-focus:bg-secondary-wash",
          "ko:data-active:bg-secondary-wash-strong",
          "ko:data-hover:data-active:bg-secondary-wash-strong",
          "ko:data-disabled:text-secondary",
        ],
      },
      {
        variant: "outline",
        color: "neutral",
        class: [
          "ko:text-neutral",
          "ko:data-hover:bg-neutral-wash ko:data-focus:bg-neutral-wash",
          "ko:data-active:bg-neutral-wash-strong",
          "ko:data-hover:data-active:bg-neutral-wash-strong",
          "ko:data-disabled:text-neutral",
        ],
      },
      {
        variant: "link",
        color: "primary",
        class: [
          "ko:text-primary",
          "ko:data-hover:bg-primary-wash ko:data-hover:text-primary-hover ko:data-focus:text-primary-hover",
          "ko:data-active:text-primary-active ko:data-active:bg-primary-wash",
          "ko:data-hover:data-active:text-primary-active",
          "ko:data-disabled:text-primary",
        ],
      },
      {
        variant: "link",
        color: "secondary",
        class: [
          "ko:text-secondary",
          "ko:data-hover:bg-secondary-wash ko:data-hover:text-secondary-hover ko:data-focus:text-secondary-hover",
          "ko:data-active:text-secondary-active ko:data-active:bg-secondary-wash",
          "ko:data-hover:data-active:text-secondary-active",
          "ko:data-disabled:text-secondary",
        ],
      },
      {
        variant: "link",
        color: "neutral",
        class: [
          "ko:text-neutral",
          "ko:data-hover:bg-neutral-wash ko:data-hover:text-text-strong ko:data-focus:text-text-strong",
          "ko:data-active:text-text-strong ko:data-active:bg-neutral-wash",
          "ko:data-hover:data-active:text-text-strong",
          "ko:data-disabled:text-neutral",
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
          "ko:data-checked:hover:bg-transparent ko:data-checked:hover:text-primary ko:data-checked:active:bg-primary-wash-strong ko:data-checked:active:border-primary",
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
          "ko:data-checked:hover:bg-transparent ko:data-checked:hover:text-secondary ko:data-checked:active:bg-secondary-wash-strong ko:data-checked:active:border-secondary",
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
          "ko:data-checked:hover:bg-transparent ko:data-checked:hover:text-neutral ko:data-checked:active:bg-neutral-wash-strong ko:data-checked:active:border-neutral",
          "ko:data-checked:data-[just-clicked]:hover:!bg-neutral ko:data-checked:data-[just-clicked]:hover:!text-on-bg-neutral",
          "ko:data-active:bg-neutral/80 ko:data-active:border-neutral ko:data-active:hover:bg-neutral/80 ko:data-active:text-on-bg-neutral",
        ],
      },
    ],
  },
);

function ButtonComponent({ children, size, variant, color, ...props }: Button, ref: React.Ref<HTMLButtonElement>) {
  const isIconOnly = React.isValidElement(children) && (children as React.ReactElement).type === Icon;

  const iconOnlyClasses = isIconOnly ? "ko:aspect-square ko:!p-0 ko:!rounded-full ko:grid ko:place-items-center" : "";

  return (
    <ButtonHeadless className={twMerge(ButtonVariants({ size, variant, color }), iconOnlyClasses)} {...props} ref={ref}>
      {children}
    </ButtonHeadless>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
