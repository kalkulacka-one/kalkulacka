import { Field as FieldPrimitive } from "@headlessui/react";
import { PropsWithChildren } from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const fieldVariants = cva(
  [
    "k1-relative k1-flex k1-w-full k1-items-center k1-gap-2 k1-rounded-md k1-rounded-br-none k1-border k1-border-neutral k1-p-4 focus-within:k1-outline focus-within:k1-outline-2 focus-within:k1-outline-offset-2 focus-within:k1-outline-primary-30 disabled:k1-border-neutral-disabled",
  ],
  {
    variants: {
      state: {
        default: [
          "k1-text-neutral-muted focus-visible:k1-border-neutral-active",
          "focus-within:k1-border-neutral-active focus-visible:k1-text-neutral-active",
        ],
        error:
          "hover:k1-border-secondary-hover:not(:focus-within) k1-border-secondary-strong k1-text-secondary-strong focus-within:k1-border-secondary-strong focus-visible:k1-border-secondary-strong",
      },
    },
  },
);

type Props = PropsWithChildren<{
  error?: string;
  state?: "default" | "error";
  className?: string;
}>;

function Field({ state, children }: Props) {
  return (
    <FieldPrimitive className={twMerge(fieldVariants({ state }))}>
      {children}
    </FieldPrimitive>
  );
}

export { Field };
