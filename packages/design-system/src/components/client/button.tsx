import { Button as HeadlessButton } from "@headlessui/react";
import { twMerge } from "@repo/design-system/utils";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

export type Button = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof ButtonVariants>;

const ButtonVariants = cva(
  [
    "ko:p-4",
    "ko:select-none ko:data-hover:cursor-pointer",
    "ko:font-display ko:font-bold ko:uppercase ko:leading-[1.85] ko:tracking-[.07em]",
    "ko:rounded-tr-none ko:rounded-2xl",
    "ko:text-xs",
    "ko:data-disabled:cursor-not-allowed",
  ],
  {
    variants: {
      kind: {
        filled: [
          "ko:bg-primary ko:border-primary",
          "ko:hover:bg-primary-hover ko:hover:border-primary-hover",
          "ko:text-on-fill-primary",
          "ko:data-disabled:bg-primary-disabled ko:data-disabled:border-primary-disabled",
          "ko:data-active:bg-primary-active ko:data-active:border-primary-active",
        ],
      },
    },
  },
);

function ButtonComponent({ children, kind, className, ...props }: Button, ref: React.Ref<HTMLButtonElement>) {
  return (
    <HeadlessButton className={twMerge(ButtonVariants({ kind }), className)} {...props} ref={ref}>
      {children}
    </HeadlessButton>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
