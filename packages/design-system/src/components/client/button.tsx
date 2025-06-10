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
    "ko:p-4",
    "ko:select-none ko:data-hover:cursor-pointer",
    "ko:font-display ko:font-bold ko:uppercase ko:leading-[1.85] ko:tracking-[.07em]",
    "ko:rounded-tr-none ko:rounded-2xl",
    "ko:text-xs",
    "ko:data-disabled:cursor-not-allowed",
    "ko:data-focus:ring-2 ko:data-focus:ring-offset-2 ko:data-focus:ring-yellow",
  ],
  {
    variants: {
      kind: {
        filled: [
          "ko:border-2",
          "ko:bg-primary ko:border-primary",
          "ko:data-hover:bg-primary-hover ko:data-hover:border-primary-hover",
          "ko:text-on-fill-primary",
          "ko:data-disabled:bg-primary-disabled ko:data-disabled:border-primary-disabled",
          "ko:data-hover:data-active:bg-primary-active ko:data-hover:data-active:border-primary-active",
        ],
      },
    },
    defaultVariants: {
      kind: "filled",
    },
  },
);

function ButtonComponent({ children, kind, ...props }: Button, ref: React.Ref<HTMLButtonElement>) {
  return (
    <ButtonHeadless className={twMerge(ButtonVariants({ kind }))} {...props} ref={ref}>
      {children}
    </ButtonHeadless>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
