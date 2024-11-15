import {
  Combobox as ComboboxPrimitive,
  ComboboxInput as InputPrimitive,
  ComboboxInputProps as InputPrimitiveProps,
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
import { Option } from "../components/option";
import { Options } from "../components/options";
import { Button } from "../components/comboboxButton";

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

    const [query, setQuery] = useState<string>("");
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [filteredOptions, setFilteredOptions] = useState(options);

    useEffect(() => {
      const filtered = options.filter((option) => {
        // Always show options that aren't selected
        const notSelected = !selectedValues.includes(option.value);

        // If there's a query, filter by it
        if (query) {
          return (
            notSelected &&
            option.label.toLowerCase().includes(query.toLowerCase())
          );
        }

        // If no query, show all unselected options
        return notSelected;
      });

      setFilteredOptions(filtered);
    }, [query, options, selectedValues]);

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
      if (value) {
        if (!selectedValues.includes(value)) {
          const newSelectedValues = [...selectedValues, value];
          setSelectedValues(newSelectedValues);

          // Get all selected labels as array
          const allSelectedLabels = newSelectedValues
            .map((val) => options.find((opt) => opt.value === val)?.label)
            .filter(Boolean);

          // Update display with all selected labels
          setQuery(allSelectedLabels.join(", "));
          setSelectedLabels(allSelectedLabels as string[]);

          if (onInputChange) {
            onInputChange(allSelectedLabels as string[]);
          }

          if (onChange) {
            onChange(newSelectedValues);
          }

          // Clear query after short delay to allow new selections
          setTimeout(() => {
            setQuery("");
          }, 100);
        }
      }
    };

    //Takes an input change event as an argument. Extracts the new value from the input element. Updates the state with the new value. Optionally calls a provided callback function with the new value.
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuery(value);

      if (onInputChange) {
        const selectedLabels = selectedValues
          .map((val) => options.find((opt) => opt.value === val)?.label)
          .filter(Boolean);
        onInputChange(selectedLabels as string[]);
      }
    };

    return (
      <ComboboxPrimitive
        multiple
        as="div"
        ref={ref}
        className={twMerge("k1-absolute k1-w-full", className)}
        onChange={handleChange}
        value={selectedValues}
        {...props}
      >
        <div className="k1-flex k1-items-center k1-w-full">
          <Input
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const matchingOption = filteredOptions[0];
                if (matchingOption) {
                  handleChange(matchingOption.value);
                }
              }
            }}
            className="k1-flex-grow k1-container k1-peer"
            data-focus={query ? "true" : undefined}
            value={
              selectedValues.length > 0 ? selectedValues.join(", ") : query
            }
            displayValue={() => {
              return selectedLabels.join(", ");
            }}
          />
          {children}
          <Button>
            <ChevronDownIcon className="k1-h-6 k1-w-6" />
          </Button>
          {showClearButton && <ClearButton onClose={handleClear} />}
        </div>
        <Options anchor="bottom start" className="k1-w-[var(--input-width)]">
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
      className={twMerge("k1-w-full k1-py-2 k1-pl-3", className)}
      {...props}
    />
  );
});
Input.displayName = InputPrimitive.displayName;

export { Combobox, Input };
