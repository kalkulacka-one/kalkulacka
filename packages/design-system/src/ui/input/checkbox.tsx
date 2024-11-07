import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { CheckedIcon } from "../../icons/checkbox/checkedIcon";

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
      className={twMerge("k1", className)}
      {...props}
    >
      <CheckedIcon className="k1-w-6 k1-h-6 k1-absolute k1-top-0 k1-left-0 k1-bg-black k1-text-white" />
    </CheckboxPrimitive>
  );
});
Checkbox.displayName = CheckboxPrimitive.displayName;

export { Checkbox };
