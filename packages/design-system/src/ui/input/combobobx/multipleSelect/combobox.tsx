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
  useRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { ClearButton } from "../../clearButton";
import { ChevronDownIcon } from "../../../../icons/chevronDown";
import { Option } from "../option";

interface ComboboxProps
  extends React.ComponentPropsWithoutRef<typeof ComboboxPrimitive> {
  showClearButton?: boolean;
  onClear?: () => void;
  defaultValue?: string[];
  onInputChange?: (value: string[]) => void;
  options: Array<{ id: string | number; value: string; label: string }>;
  showPlaceholder?: boolean;
  children?: React.ReactNode;
}

const Combobox = forwardRef<
  React.ElementRef<typeof ComboboxPrimitive>,
  ComboboxProps
>(
  (
    {
      className,
      children,
      showClearButton,
      onChange,
      defaultValue,
      onClear,
      onInputChange,
      options,
      ...props
    },
    ref
  ) => {
    //Use state for selecting values. If nothing is provided, defaultValue will become the selected value
    const [selectedValues, setSelectedValues] = useState<string[]>(
      defaultValue instanceof Array
        ? defaultValue
        : defaultValue
          ? [defaultValue]
          : []
    );

    const [query, setQuery] = useState<string>(
      defaultValue ? defaultValue.join(", ") : ""
    );
    const [filteredOptions, setFilteredOptions] = useState(options);

    useEffect(() => {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOptions(filtered);
    }, [query, options]);

    const handleClear = () => {
      setSelectedValues([]);
      setQuery("");
      if (onChange) {
        onChange([]);
      }
      if (onClear) {
        onClear();
      }
      if (onInputChange) {
        onInputChange([]);
      }
    };

    const handleChange = (value: string | null) => {
      setSelectedValues(value ? [value] : []);
      if (value) {
        const selectedOption = options.find((opt) => opt.value === value);
        if (selectedOption) {
          setQuery(selectedOption.label);
          if (onInputChange) {
            onInputChange([selectedOption.label]);
          }
        }
      }
      if (onChange) {
        onChange(value);
      }
    };

    //Takes an input change event as an argument. Extracts the new value from the input element. Updates the state with the new value. Optionally calls a provided callback function with the new value.
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuery(value);
      if (onInputChange) {
        onInputChange([value]);
      }
    };

    return (
      <ComboboxPrimitive
        multiple
        as="div"
        ref={ref}
        className={twMerge("k1-relative k1-w-full", className)}
        onChange={handleChange}
        value={selectedValues}
        {...props}
      >
        <div className="k1-flex k1-items-center k1-w-full">
          <Input
            onChange={handleInputChange}
            className="k1-flex-grow k1-container k1-peer"
            value={
              selectedValues.length > 0 ? selectedValues.join(", ") : query
            }
            data-focus={query ? "true" : undefined}
            displayValue={(value: string) => {
              const option = options.find((opt) => opt.value === value);
              return option ? option.label : query;
            }}
          />
          {children}
          <Button className="k1-flex-shrink-0 k1-h-full k1-flex k1-items-center k1-pr-2">
            <ChevronDownIcon className="k1-h-6 k1-w-6" />
          </Button>
          {showClearButton && <ClearButton onClose={handleClear} />}
        </div>
        <Options anchor="bottom start">
          {filteredOptions.length === 0 ? (
            <div className="k1-px-4 k1-py-2">Žadné vysledky</div>
          ) : (
            filteredOptions.map((option) => (
              <Option
                key={option.id}
                value={option.value}
                className={twMerge("", className)}
              >
                {option.label}
              </Option>
            ))
          )}
        </Options>
      </ComboboxPrimitive>
    );
  }
);

const Input = forwardRef<
  React.ElementRef<typeof InputPrimitive>,
  InputPrimitiveProps & { className?: string } // InputProps has more variable className, but we need string
>(({ className, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  return (
    <InputPrimitive
      ref={inputRef}
      className={twMerge(
        "w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm",
        className
      )}
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
