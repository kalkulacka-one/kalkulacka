import React, { forwardRef } from "react";
import { Description } from "./description";
import { Field } from "./field";
import { Combobox, Input, Options, Option, Button } from "./combobox";
import { Label } from "./label";
import { ChevronDownIcon } from "../../icons/ChevronDown";
import { twMerge } from "tailwind-merge";

/*
  We choose what Input field properties we allow to be passed to the Input component
  This is needed to allow to manage the Input field using things like ...register("field") react-form-hook

  We omit className to disable extra styling from the outside
  */
type InheritedInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "style"
>;

type Props = {
  label?: string;
  error?: string;
  showClearButton?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} & InheritedInputProps;

const SelectInputField = forwardRef<React.ElementRef<typeof Input>, Props>(
  (
    { label, error, showClearButton, icon, placeholder, ...props }: Props,
    ref
  ) => {
    // if error is present, we pass it to all the sub-components
    const hasError = !!error;

    console.info("InputField", { hasError, label, error, showClearButton });

    // We show label instead of placeholder if label is provided
    const showPlaceholder = !label;

    // We need to pass hasIcon to some sub-components
    const Icon = icon;
    const hasIcon = !!Icon;

    return (
      <Field state={hasError ? "error" : "default"}>
        {hasIcon && <Icon className={twMerge("k1-w-6 k1-h-6 k1-min-w-6")} />}
        <Combobox className="k1-relative k1-w-full k1-bg-transparent k1-outline-none">
          <div className="k1-flex k1-items-center k1-w-full">
            <Input
              {...(props as Omit<InheritedInputProps, "defaultValue"> & {
                defaultValue?: string;
              })}
              ref={ref}
              className="k1-bg-transparent k1-outline-none k1-flex-grow"
              placeholder={showPlaceholder ? placeholder : undefined}
              showClearButton={showClearButton}
            />
            <Button className="k1-flex-shrink-0 k1-w-10 k1-h-full k1-flex k1-items-center k1-justify-center">
              <ChevronDownIcon className="k1-w-6 k1-h-6 k1-min-w-6" />
            </Button>
          </div>
          <Options className="k1-absolute k1-mt-1 k1-bg-white k1-shadow-lg k1-z-50 k1-w-full">
            <Option value="1">Option 1</Option>
            <Option value="2">Option 2</Option>
            <Option value="3">Option 3</Option>
          </Options>
        </Combobox>

        {label && (
          <Label state={hasError ? "error" : "default"} hasIcon={hasIcon}>
            {label}
          </Label>
        )}
        {hasError && <Description state="error">{error}</Description>}
      </Field>
    );
  }
);

export { SelectInputField };
