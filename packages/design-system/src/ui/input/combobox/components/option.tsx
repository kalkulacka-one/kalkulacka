import { ComboboxOption as OptionPrimitive } from "@headlessui/react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Option = forwardRef<
  React.ElementRef<typeof OptionPrimitive>,
  React.ComponentPropsWithoutRef<typeof OptionPrimitive>
>(({ className, children, ...props }, ref) => (
  <OptionPrimitive
    ref={ref}
    className={twMerge(
      "k1-text-neutral-fg disabled:k1-bg-muted disabled:k1-text-muted disabled:cursor-not-allowed k1-inline-flex k1-w-full k1-items-start k1-justify-start k1-border-b k1-border-neutral k1-px-4 k1-py-3 k1-text-base hover:k1-bg-neutral-backdrop-hover data-[focus]:k1-bg-neutral-backdrop-active",
      className,
    )}
    {...props}
  >
    {children}
  </OptionPrimitive>
));
Option.displayName = "Combobox.Option";

export { Option };
