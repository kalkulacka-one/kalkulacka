import { Button as ButtonHeadless, type ButtonProps as ButtonPropsHeadless } from "@headlessui/react";
import { twMerge } from "@repo/design-system/utils";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

export type Button = {
  children: React.ReactNode;
} & Omit<ButtonPropsHeadless, "className" | "as"> &
  VariantProps<typeof ButtonVariants>;

const ButtonVariants = cva(
  [
    "ko:select-none ko:data-hover:cursor-pointer",
    "ko:font-display ko:font-bold ko:uppercase ko:leading-[1.85] ko:tracking-[.07em]",
    "ko:rounded-tr-none ko:rounded-2xl",
    "ko:text-xs",
    "ko:data-disabled:cursor-not-allowed",
    "ko:data-focus:ring-2 ko:data-focus:ring-offset-2 ko:data-focus:ring-yellow",
  ],
  {
    variants: {
      variant: {
        filled: [
          "ko:border-2",
          "ko:bg-primary ko:border-primary",
          "ko:data-hover:bg-primary-hover ko:data-hover:border-primary-hover",
          "ko:text-on-fill-primary",
          "ko:data-disabled:bg-primary-disabled ko:data-disabled:border-primary-disabled",
          "ko:data-hover:data-active:bg-primary-active ko:data-hover:data-active:border-primary-active",
        ],
        outline: [
          "ko:border-2",
          "ko:border-neutral-strong",
          "ko:data-hover:bg-neutral-hover ko:text-on-fill-neutral-hover",
          "ko:text-neutral-strong",
          "ko:data-disabled:border-neutral-disabled ko:data-disabled:text-neutral-disabled",
          "ko:data-hover:data-active:bg-neutral-active ko:data-hover:data-active:text-on-fill-neutral-active",
        ],
        // text token color names ???
        link: [
          "ko:p-0",
          "ko:text-neutral-strong",
          "ko:data-hover:text-neutral-hover",
          "ko:data-disabled:text-neutral-disabled",
          "ko:data-hover:data-active:text-neutral-active",
          "ko:data-disabled:text-neutral-disabled",
        ],
      },
      // link size default better solution?
      size: {
        default: "ko:p-4",
        small: "ko:px-4 ko:py-2 ",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "default",
    },
    // assurance link has p-0 anytime is called
    compoundVariants: [{ variant: "link", class: "ko:p-0!" }],
  },
);

function ButtonComponent({ children, variant, size, ...props }: Button, ref: React.Ref<HTMLButtonElement>) {
  return (
    <ButtonHeadless className={twMerge(ButtonVariants({ variant, size }))} {...props} ref={ref}>
      {children}
    </ButtonHeadless>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
