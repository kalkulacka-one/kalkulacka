import React, { forwardRef, useState } from "react";
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

// Test options
const options = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
  { id: 4, name: "Option 4" },
];

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

    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [query, setQuery] = useState("");

    //Filtering the options based on the query
    const filteredOptions =
      query === ""
        ? options
        : options.filter((option) => {
            return option.name.toLowerCase().includes(query.toLowerCase());
          });

    return (
      <Field state={hasError ? "error" : "default"}>
        {hasIcon && <Icon className={twMerge("k1-w-6 k1-h-6 k1-min-w-6")} />}
        <Combobox
          className="k1-relative k1-w-full k1-bg-transparent k1-outline-none k1-flex"
          value={selectedOption}
          onChange={setSelectedOption}
          onClose={() => setQuery("")}
        >
          <Input
            {...(props as Omit<InheritedInputProps, "defaultValue"> & {
              defaultValue?: string;
            })}
            ref={ref}
            displayValue={(option) => option?.name}
            className={twMerge(
              "k1-bg-transparent k1-outline-none k1-flex-grow"
            )}
            placeholder={showPlaceholder ? placeholder : undefined}
            showClearButton={showClearButton}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Options anchor="bottom start" className="border empty:invisible">
            {filteredOptions.map((option) => (
              <Option
                key={option.id}
                value={option}
                className="k1-data-[focus]:bg-blue-100 k1-w-full"
              >
                {option.name}
              </Option>
            ))}
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
