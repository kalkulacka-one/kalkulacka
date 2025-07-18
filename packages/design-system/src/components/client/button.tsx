import { Button as ButtonHeadless, type ButtonProps as ButtonPropsHeadless } from "@headlessui/react";
import { twMerge } from "@repo/design-system/utils";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

export type Button = {
  children: React.ReactNode;
} & Omit<ButtonPropsHeadless, "className" | "as"> &
  VariantProps<typeof ButtonVariants>;

export const ButtonVariants = cva(
  [
    "ko:border-2",
    "ko:select-none ko:data-hover:cursor-pointer",
    "ko:font-display ko:font-bold ko:uppercase ko:leading-[1.85] ko:tracking-[.07em]",
    "ko:rounded-tr-none ko:rounded-2xl",
    "ko:text-xs",
    "ko:data-disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        small: "ko:px-4 ko:py-2",
        medium: "ko:p-4",
      },
      variant: {
        filled: [""],
        outline: ["ko:bg-transparent"],
        link: ["ko:bg-transparent", "ko:border-transparent", "ko:data-disabled:border-transparent"],
      },
      color: {
        primary: ["ko:border-primary", "ko:data-disabled:border-primary-disabled"],
        secondary: ["ko:border-secondary", "ko:data-disabled:border-secondary-disabled"],
        neutral: ["ko:border-neutral", "ko:data-disabled:border-neutral-disabled"],
      },
    },
    defaultVariants: {
      size: "medium",
      variant: "filled",
      color: "primary",
    },
    compoundVariants: [
      {
        variant: "filled",
        color: "primary",
        class: [
          "ko:bg-primary",
          "ko:text-on-bg-primary",
          "ko:data-hover:bg-primary-hover ko:data-hover:border-primary-hover",
          "ko:data-focus:bg-primary-hover ko:data-focus:border-primary-hover",
          "ko:data-hover:data-active:bg-primary-active ko:data-hover:data-active:border-primary-active",
          "ko:data-disabled:bg-primary-disabled",
        ],
      },
      {
        variant: "filled",
        color: "secondary",
        class: [
          "ko:bg-secondary",
          "ko:text-on-bg-secondary",
          "ko:data-hover:bg-secondary-hover ko:data-hover:border-secondary-hover",
          "ko:data-focus:bg-secondary-hover ko:data-focus:border-secondary-hover",
          "ko:data-hover:data-active:bg-secondary-active ko:data-hover:data-active:border-secondary-active",
          "ko:data-disabled:bg-secondary-disabled",
        ],
      },
      {
        variant: "filled",
        color: "neutral",
        class: [
          "ko:bg-neutral",
          "ko:text-on-bg-neutral",
          "ko:data-hover:bg-neutral-hover ko:data-hover:border-neutral-hover",
          "ko:data-focus:bg-neutral-hover ko:data-focus:border-neutral-hover",
          "ko:data-hover:data-active:bg-neutral-active ko:data-hover:data-active:border-neutral-active",
          "ko:data-disabled:bg-neutral-disabled",
        ],
      },
      {
        variant: "outline",
        color: "primary",
        class: ["ko:text-primary", "ko:data-hover:bg-primary-hover/10 ko:data-focus:bg-primary-hover/10", "ko:data-hover:data-active:bg-primary-active/10", "ko:data-disabled:text-primary-disabled"],
      },
      {
        variant: "outline",
        color: "secondary",
        class: [
          "ko:text-secondary",
          "ko:data-hover:bg-secondary-hover/10 ko:data-focus:bg-secondary-hover/10",
          "ko:data-hover:data-active:bg-secondary-active/10",
          "ko:data-disabled:text-secondary-disabled",
        ],
      },
      {
        variant: "outline",
        color: "neutral",
        class: ["ko:text-neutral", "ko:data-hover:bg-neutral-hover/10 ko:data-focus:bg-neutral-hover/10", "ko:data-hover:data-active:bg-neutral-active/10", "ko:data-disabled:text-neutral-disabled"],
      },
      {
        variant: "link",
        color: "primary",
        class: ["ko:text-primary", "ko:data-hover:text-primary-hover ko:data-focus:text-primary-hover", "ko:data-hover:data-active:text-primary-active", "ko:data-disabled:text-primary-disabled"],
      },
      {
        variant: "link",
        color: "secondary",
        class: [
          "ko:text-secondary",
          "ko:data-hover:text-secondary-hover ko:data-focus:text-secondary-hover",
          "ko:data-hover:data-active:text-secondary-active",
          "ko:data-disabled:text-secondary-disabled",
        ],
      },
      {
        variant: "link",
        color: "neutral",
        class: ["ko:text-neutral", "ko:data-hover:text-neutral-hover ko:data-focus:text-neutral-hover", "ko:data-hover:data-active:text-neutral-active", "ko:data-disabled:text-neutral-disabled"],
      },
    ],
  },
);

function ButtonComponent({ children, size, variant, color, ...props }: Button, ref: React.Ref<HTMLButtonElement>) {
  return (
    <ButtonHeadless className={twMerge(ButtonVariants({ size, variant, color }))} {...props} ref={ref}>
      {children}
    </ButtonHeadless>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
