import { Description as DescriptionPrimitive } from "@headlessui/react";
import { cva, VariantProps } from "class-variance-authority";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const descriptionVariants = cva(
  [
    "k1-absolute -k1-bottom-3 k1-right-4 k1-bg-white k1-px-1 k1-gap-1 k1-inline-flex",
  ],
  {
    variants: {
      state: {
        default: "k1-text-neutral-strong",
        error: "k1-text-secondary-strong",
      },
    },
  },
);

// Description is <p> element, but we don't need to expose it to the caller in our design system.
type Props = PropsWithChildren<{} & VariantProps<typeof descriptionVariants>>;

function Description({ state, children }: Props) {
  return (
    <DescriptionPrimitive
      className={twMerge(
        descriptionVariants({
          state,
        }),
      )}
    >
      {children}
    </DescriptionPrimitive>
  );
}

export { Description };
