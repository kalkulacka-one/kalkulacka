import { Label as LabelPrimitive } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

//need to add font Inter and create custom label text
const labelVariants = cva(
  [
    "k1-absolute k1-left-[0.75rem] k1-top-[-0.5rem] k1-uppercase",
    "k1-font-bold k1-tracking-[0.04] k1-text-[0.625rem]",
    "k1-bg-inherit",
    "peer-data-[focus]:k1-bg-blue-200 peer-data-[empty=false]:k1-bg-green-200",
  ],
  {
    variants: {
      state: {
        default: "k1-text-neutral-strong",
        error: "k1-text-secondary-strong",
      },
      hasIcon: {
        true: "k1-pl-5 peer-data-[focus]:k1-pl-1 peer-data-[empty=false]:k1-pl-1",
      },
    },
    defaultVariants: {
      state: "default",
      hasIcon: false,
    },
  }
);

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive> &
    VariantProps<typeof labelVariants>
>(({ className, state, hasIcon, ...props }, ref) => (
  <LabelPrimitive
    ref={ref}
    className={twMerge(
      labelVariants({
        state,
        hasIcon,
      }),
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.displayName;

export { Label };
