import HomeIconComponent from "./Icons/HomeIcon";
import { Label } from "./label";
import { Field } from "@headlessui/react";
import ErrorIcon from "./Icons/ErrorIcon";
import { useState } from "react";
import { cva } from "class-variance-authority";
import { InputWithIcon } from "./input";

export interface textInputProps {
  //změnit na typ, musí dědit od HTMLInputProps (podle komponenty Input)
  disabled?: boolean | undefined; //if true, the input is disabled
  groupName?: string | undefined;
  icon?: boolean; //represents the icon path
  label?: string | null; //represents the label name
  modelValue?: string | undefined; //represents the value of the input. To think, if it is necessary
  placeholder?: string | undefined; //displays value before user inputs something
  error?: string | null; //represents the error message
}

const textInputStyles = cva(
  [
    "k1-h-[3.5rem] k1-w-[18.5rem] k1-p-4 k1-flex k1-flex-row k1-flex-no-wrap k1-justify-start k1-items-center k1-relative k1-border-solid k1-border-2 k1-rounded-l-3xl k1-rounded-tr-2xl",
  ],
  {
    variants: {
      variant: {
        default: ["k1-border-neutral-border", "k1-text-[#1D1C1C]"],
        hover: ["k1-border-neutral-border-hover", "k1-text-[#ADA6A6]"],
        readonly: ["k1-border-neutral-fg-disabled", "k1-text-[#565252]"],
        active: ["k1-border-neutral-border-active", "k1-text-[#1D1C1C]"],
        error: ["k1-border-secondary-border-strong", "k1-text-[#D04646]"],
      },
    },
  },
);

const TextInput = ({
  disabled,
  groupName,
  icon,
  label,
  modelValue,
  placeholder,
  error,
}: textInputProps) => {
  const [text, setText] = useState(modelValue || "");
  const [state, setState] = useState<
    "default" | "hover" | "readonly" | "active" | "error"
  >("default");

  const showIcon = icon || false;
  const hasError = error || false;
  const isDisabled = disabled || false;

  const determineState = () => {
    if (hasError) return "error";
    if (isDisabled) return "readonly";
    if (state === "active") return "active";
    if (state === "hover") return "hover";
    return "default";
  };

  return (
    <div className={textInputStyles({ variant: determineState() })}>
      <Field className="input-field">
        {label && <Label>{label}</Label>}
        <div className="input-container k1-flex">
          {showIcon && <HomeIconComponent className="k1-mr-2" />}
          <InputWithIcon
            type="text"
            name={groupName}
            className="input"
            disabled={disabled}
            value={text}
            placeholder={placeholder}
            onChange={(e) => {
              setText(e.target.value);
              setState("active");
            }}
            onFocus={() => setState("active")}
            onBlur={() => setState("default")}
            onMouseEnter={() => setState("hover")}
            onMouseLeave={() => setState("default")}
          />
        </div>
        {error && (
          <div className="k1-pl-1 k1-pr-1 k1-flex-row k1-justify-between k1-items-center k1-absolute k1-right-[0.75rem] k1-bottom-[-0.75rem] k1-bg-neutral-fg-hover k1-flex">
            <div>{error}</div>
            <ErrorIcon className="k1-ml-1" />
          </div>
        )}
      </Field>
    </div>
  );
};

export { TextInput };
