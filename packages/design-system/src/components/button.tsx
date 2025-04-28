import * as Headless from "@headlessui/react";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

const ButtonStyles = cva(
  [
    "ko:p-4",
    "ko:select-none",
    "ko:cursor-pointer",
    "ko:font-display ko:font-bold ko:uppercase ko:leading-[1.85] ko:tracking-[.07em]",
    "ko:rounded-tr-none ko:rounded-2xl",
    "ko:text-xs",
    "ko:border-2",
  ],
  {
    variants: {
      kind: {
        filled: [
          "ko:bg-bg-primary",
          "ko:text-text-primary-on-fill-primary",
          "ko:border-border-primary",
          "ko:hover:bg-bg-primary-hover",
          "ko:hover:text-text-primary-on-fill-primary-hover",
          "ko:disabled:bg-bg-primary-disabled",
          "ko:disabled:text-text-primary-on-fill-primary-disabled",
          "ko:disabled:border-border-primary-disabled",
          "ko:disabled:cursor-not-allowed",
        ],
      },
    },
  }
);

type ButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof ButtonStyles>;

function ButtonComponent(
  { children, kind, ...props }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <Headless.Button className={ButtonStyles({ kind })} ref={ref} {...props}>
      {children}
    </Headless.Button>
  );
}

const Button = React.forwardRef(ButtonComponent);

export { Button };
