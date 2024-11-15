import { ComboboxButton as ButtonPrimitive } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import { forwardRef } from "react";

const Button = forwardRef<
  React.ElementRef<typeof ButtonPrimitive>,
  React.ComponentProps<typeof ButtonPrimitive>
>(({ className, ...props }, ref) => (
  <ButtonPrimitive
    ref={ref}
    className={twMerge(
      "k1-h-full k1-flex k1-items-center k1-justify-center",
      className
    )}
    {...props}
  />
));
Button.displayName = "Combobox.Button";

export { Button };
