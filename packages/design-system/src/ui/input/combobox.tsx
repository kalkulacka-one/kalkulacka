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
import { ChevronDownIcon } from "../../icons/ChevronDown";
import { useEffect } from "react";

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
    // inputRef is a reference to a DOM element. Check if it exists before updating
    if (inputRef.current) {
      //if the inputRef is empty - isEmpty will be true
      const isEmpty = inputRef.current.value === "";
      console.log("Updating data-empty attribute:", isEmpty); // Debug log
      inputRef.current.setAttribute("data-empty", isEmpty.toString());
    } else {
      console.log("inputRef.current is null"); // Debug log
    }
  };

  // Override the onChange event to update data-empty attribute
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(event);
    }
    updateDataEmpty();
  };

  useEffect(() => {
    updateDataEmpty(); // Initial check
  }, []);

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
      <Button className="k1-flex-shrink-0 k1-h-full k1-flex">
        <ChevronDownIcon className="k1-w-6 k1-h-6 k1-min-w-6" />
      </Button>
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
