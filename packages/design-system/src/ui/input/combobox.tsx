import {
  Combobox as ComboboxPrimitive,
  ComboboxInput as InputPrimitive,
  ComboboxInputProps as InputPrimitiveProps,
  ComboboxOptions as OptionsPrimitive,
  ComboboxOption as OptionPrimitive,
  ComboboxButton as ButtonPrimitive,
  ComboboxButtonProps as ButtonProps,
} from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ClearButton } from "./clearButton";

const Combobox = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive
    as="div"
    ref={ref}
    className={twMerge("", className)}
    {...props}
  >
    {children}
  </ComboboxPrimitive>
));
Combobox.displayName = "Combobox";

const Input = forwardRef<
  React.ElementRef<typeof InputPrimitive>,
  InputPrimitiveProps & { className?: string; showClearButton?: boolean } // InputProps has more variable className, but we need string
>(({ className, showClearButton, ...props }, ref) => {
  // We need to get object ref we're passing to check if the input is empty
  const inputRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  // Add a data attribute based on the input value. This is for peer styling.
  const updateDataEmpty = () => {
    if (inputRef.current) {
      const isEmpty = inputRef.current.value === "";
      inputRef.current.setAttribute("data-empty", isEmpty.toString());
    }
  };

  // Override the onChange event to update data-empty attribute
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(event);
    }
    updateDataEmpty();
  };

  // Clear the input field and fire the onChange event
  const clearHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      handleChange({
        target: inputRef.current,
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <>
      <InputPrimitive
        ref={inputRef}
        className={twMerge("k1-peer k1-flex-grow", className)}
        onChange={handleChange}
        {...props}
      />
      {showClearButton && <ClearButton onClose={clearHandler} />}
    </>
  );
});
Input.displayName = InputPrimitive.displayName;

const Options = forwardRef<
  React.ElementRef<typeof OptionsPrimitive>,
  React.ComponentPropsWithoutRef<typeof OptionsPrimitive>
>(({ className, children, ...props }, ref) => (
  <OptionsPrimitive ref={ref} className={twMerge("", className)} {...props}>
    {children}
  </OptionsPrimitive>
));
Options.displayName = "Combobox.Options";

const Option = forwardRef<
  React.ElementRef<typeof OptionPrimitive>,
  React.ComponentPropsWithoutRef<typeof OptionPrimitive>
>(({ className, children, ...props }, ref) => (
  <OptionPrimitive ref={ref} className={twMerge("", className)} {...props}>
    {children}
  </OptionPrimitive>
));
Option.displayName = "Combobox.Option";

const Button = forwardRef<
  React.ElementRef<typeof ButtonPrimitive>,
  ButtonProps & { className?: string }
>(({ className, ...props }, ref) => (
  <ButtonPrimitive ref={ref} className={twMerge("", className)} {...props} />
));
Button.displayName = "Combobox.Button";

export { Combobox, Input, Options, Option, Button };
