import {
  Combobox as ComboboxPrimitive,
  ComboboxInput as InputPrimitive,
  ComboboxInputProps as InputPrimitiveProps,
  ComboboxOptions as OptionsPrimitive,
  ComboboxButton as ButtonPrimitive,
  ComboboxButtonProps as ButtonProps,
} from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { ClearButton } from "./clearButton";
import { ChevronDownIcon } from "../../icons/ChevronDown";

const Combobox = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive> & {
    showClearButton?: boolean;
  }
>(({ className, children, showClearButton, onChange, ...props }, ref) => {
  const clearHandler = () => {
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <ComboboxPrimitive
      as="div"
      ref={ref}
      className={twMerge("", className)}
      {...props}
    >
      <>
        {children}
        <Button className="k1-flex-shrink-0 k1-h-full k1-flex">
          <ChevronDownIcon className="k1-w-6 k1-h-6 k1-min-w-6" />
        </Button>
        {showClearButton && <ClearButton onClose={clearHandler} />}
      </>
    </ComboboxPrimitive>
  );
});
Combobox.displayName = "Combobox";

const Input = forwardRef<
  React.ElementRef<typeof InputPrimitive>,
  InputPrimitiveProps & { className?: string } // InputProps has more variable className, but we need string
>(({ className, ...props }) => {
  return (
    <InputPrimitive
      className={twMerge("k1-peer k1-flex-grow", className)}
      {...props}
    />
  );
});
Input.displayName = InputPrimitive.displayName;

const Options = forwardRef<
  React.ElementRef<typeof OptionsPrimitive>,
  React.ComponentPropsWithoutRef<typeof OptionsPrimitive>
>(({ className, children, ...props }, ref) => (
  <OptionsPrimitive
    ref={ref}
    className={twMerge(
      "k1-bg-white k1-rounded-tl-lg k1-border k1-border-neutral k1-flex-col k1-justify-start k1-items-start k1-inline-flex",
      className
    )}
    {...props}
  >
    {children}
  </OptionsPrimitive>
));
Options.displayName = "Combobox.Options";

const Button = forwardRef<
  React.ElementRef<typeof ButtonPrimitive>,
  ButtonProps & { className?: string }
>(({ className, ...props }, ref) => (
  <ButtonPrimitive ref={ref} className={twMerge("", className)} {...props} />
));
Button.displayName = "Combobox.Button";

export { Combobox, Input, Options, Button };
