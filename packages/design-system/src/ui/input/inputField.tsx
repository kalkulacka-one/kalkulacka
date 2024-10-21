import React, { forwardRef } from "react";
import { Description } from "./description";
import { Field } from "./field";
import { Input } from "./input";
import { Label } from "./label";
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

const InputField = forwardRef<React.ElementRef<typeof Input>, Props>(
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
        {hasIcon && (
          <Icon
            className={twMerge(
              "k1-w-3 k1-h-3",
              hasError && "k1-text-secondary-strong"
            )}
          />
        )}
        <Input
          {...props}
          ref={ref}
          className="k1-bg-transparent k1-outline-none"
          placeholder={showPlaceholder ? placeholder : undefined}
          showClearButton={showClearButton}
        />
        {label && (
          <Label state={hasError ? "error" : "default"} hasIcon={hasIcon}>
            {label}
          </Label>
        )}
        {hasError && (
          <Description state="error">{`Fix the ${label?.toLowerCase()}`}</Description>
        )}
      </Field>
    );
  }
);

export { InputField };
