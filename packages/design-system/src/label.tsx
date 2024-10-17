import * as LabelPrimitive from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import cn from "classnames";

//need to add font Inter and create custom label text
const labelVariants = cva(
  "k1-pl-1 k1-pr-1 k1-flex k1-flex-row k1-justify-space-between k1-items-start k1-absolute k1-left-[0.75rem] k1-top-[-0.5rem] k1-bg-neutral-fg-hover k1-bg-white k1-uppercase k1-font-bold k1-tracking-[0.04] k1-text-[0.625rem]",
);

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Label> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Label
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Label.displayName;

export { Label };
