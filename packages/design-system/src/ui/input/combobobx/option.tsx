import { ComboboxOption as OptionPrimitive } from "@headlessui/react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Option = forwardRef<
  React.ElementRef<typeof OptionPrimitive>,
  React.ComponentPropsWithoutRef<typeof OptionPrimitive>
>(({ className, children, ...props }, ref) => {
  return (
    <OptionPrimitive
      ref={ref}
      className={twMerge(
        "k1-px-4 k1-py-3 k1-border-b k1-border-neutral k1-justify-start k1-items-start k1-flex hover:k1-bg-neutral-backdrop-hover focus:k1-bg-neutral-backdrop-active k1-text-neutral-fg k1-text-base",
        className
      )}
      {...props}
    >
      {children}
    </OptionPrimitive>
  );
});
Option.displayName = "Combobox.Option";

export { Option };
