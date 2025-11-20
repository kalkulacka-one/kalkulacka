import type { Icon } from "@kalkulacka-one/design-system/client";
import { twMerge } from "@kalkulacka-one/design-system/utils";

import { Input as InputHeadless, type InputProps as InputPropsHeadless } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

export type Input = {
  children?: React.ReactElement<React.ComponentProps<typeof Icon>>;
} & InputPropsHeadless &
  VariantProps<typeof InputVariants>;

const InputVariants = cva(
  [
    "ko:w-full",
    "ko:border ko:border-neutral",
    "ko:rounded-2xl ko:rounded-br-none",
    "ko:placeholder:text-base ko:placeholder:font-sans ko:placeholder:text-neutral",
    "ko:data-hover:border-neutral-hover",
    "ko:data-disabled:placeholder:text-neutral-disabled ko:data-disabled:border-neutral-disabled ko:data-disabled:text-neutral-disabled",
  ],
  {
    variants: {
      variant: {
        default: "ko:p-4",
        icon: "ko:pl-14 ko:p-4",
      },
    },
  },
);

function InputComponent({ children, variant, ...props }: Input, ref: React.Ref<HTMLInputElement>) {
  const hasIcon = children != null;

  return (
    <div className="ko:relative">
      {hasIcon && <div className="ko:absolute ko:left-4 ko:top-1/2 ko:-translate-y-1/2">{children}</div>}
      <InputHeadless {...props} ref={ref} className={twMerge(InputVariants({ variant: hasIcon ? "icon" : "default" }))} />
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, Input>(InputComponent);
