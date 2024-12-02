import * as LabelPrimitive from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import cn from "classnames";

//need to add font Inter and create custom label text
const labelVariants = cva(
  "k1-justify-space-between k1-bg-neutral-fg-hover k1-absolute k1-left-3 k1-top-[-0.5rem] k1-flex k1-flex-row k1-items-start k1-bg-white k1-px-1 k1-font-bold k1-uppercase",
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
