import { Label as LabelPrimitive } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

//need to add font Inter and create custom label text

const labelVariants = cva(
  [
    "k1-absolute k1-left-4 k1-uppercase k1-px-1",
    "k1-font-bold",
    "k1-bg-white",
    "k1-text-base",
    "peer-data-[empty=false]:k1-ml-0",
    "peer-data-[focus]:k1-ml-0",
    "peer-data-[empty=false]:k1-text-xs",
    "peer-data-[focus]:k1-text-xs",
    "peer-data-[focus]:k1-translate-y-[-120%] k1-transition-all k1-duration-200",
    "peer-data-[empty=false]:k1-translate-y-[-120%] k1-transition-all k1-duration-200",
  ],
  {
    variants: {
      state: {
        default: "k1-text-neutral-strong",
        error: "k1-text-secondary-strong",
      },
      hasIcon: {
        true: "k1-ml-10 peer-data-[focus]:k1-pl-1 peer-data-[empty=false]:k1-pl-1",
      },
    },
    defaultVariants: {
      state: "default",
      hasIcon: false,
    },
  },
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
      className,
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.displayName;

export { Label };
