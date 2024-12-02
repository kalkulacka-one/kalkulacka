import { twMerge } from "tailwind-merge";
import { ComboboxOptions as OptionsPrimitive } from "@headlessui/react";
import { forwardRef } from "react";

const Options = forwardRef<
  React.ElementRef<typeof OptionsPrimitive>,
  React.ComponentPropsWithoutRef<typeof OptionsPrimitive>
>(({ className, children, ...props }, ref) => (
  <OptionsPrimitive
    ref={ref}
    className={twMerge(
      "k1-inline-flex k1-w-[var(--input-width)] k1-flex-col k1-items-start k1-justify-start k1-rounded-tl-lg k1-border k1-border-neutral k1-bg-white",
      className,
    )}
    {...props}
  >
    {children}
  </OptionsPrimitive>
));
Options.displayName = "Combobox.Options";

export { Options };
