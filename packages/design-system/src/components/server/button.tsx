import { Button as HeadlessButton } from "@headlessui/react";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";
import { twMerge } from "../../utils/utils";

const ButtonVariants = cva(
  [
    "ko:p-4",
    "ko:select-none ko:data-hover:cursor-pointer",
    "ko:font-display ko:font-bold ko:uppercase ko:leading-[1.85] ko:tracking-[.07em]",
    "ko:rounded-tr-none ko:rounded-2xl",
    "ko:text-xs",
    "ko:disabled:cursor-not-allowed",
  ],
  {
    variants: {
      kind: {
        filled: [
          "ko:bg-primary ko:border-primary",
          "ko:hover:bg-primary-hover ko:hover:border-primary-hover",
          "ko:text-on-fill-primary",
          "ko:disabled:bg-primary-disabled ko:disabled:border-primary-disabled",
          "ko:data-active:bg-primary-active ko:data-active:border-primary-active",
        ],
      },
    },
  },
);

export type Button = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof ButtonVariants>;

function ButtonComponent({ children, kind, className, ...props }: Button, ref: React.Ref<HTMLButtonElement>) {
  return (
    <HeadlessButton className={twMerge(ButtonVariants({ kind }), className)} {...props} ref={ref}>
      {children}
    </HeadlessButton>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
