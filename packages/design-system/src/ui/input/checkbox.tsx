import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive>
>(({ className, ...props }, ref) => {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <CheckboxPrimitive
      ref={ref}
      checked={enabled}
      onChange={setEnabled}
      className={twMerge("k1-w-6 k1-h-6 k1-relative k1-min-w-6", className)}
      {...props}
    ></CheckboxPrimitive>
  );
});
Checkbox.displayName = CheckboxPrimitive.displayName;

export { Checkbox };
