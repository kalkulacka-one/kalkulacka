import React, { forwardRef } from "react";
import { Description } from "../../description";
import { Field } from "../../field";
import { Combobox, Input } from "./combobox";
import { Label } from "../../label";
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

// Test options
const options = [
  { id: 1, value: "option1", label: "Option 1" },
  { id: 2, value: "option2", label: "Option 2" },
  { id: 3, value: "option3", label: "Option 3" },
  { id: 4, value: "option4", label: "Option 4" },
];

const CheckboxSelectField = forwardRef<React.ElementRef<typeof Input>, Props>(
  ({ label, error, showClearButton, icon }: Props, ref) => {
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
        <Combobox
          className="k1-relative k1-w-full k1-bg-transparent k1-outline-none k1-flex"
          ref={ref}
          showClearButton={showClearButton}
          options={options}
          defaultValue={[]}
          onChange={(value) => console.log("Selected value:", value)}
          onInputChange={(value) => console.log("Input value:", value)}
          onClear={() => console.log("Cleared")}
          showPlaceholder={showPlaceholder}
        >
          {label && (
            <Label state={hasError ? "error" : "default"} hasIcon={hasIcon}>
              {label}
            </Label>
          )}
        </Combobox>
        {hasError && <Description state="error">{error}</Description>}
      </Field>
    );
  },
);

export { CheckboxSelectField };
