import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import { forwardRef, useState, useMemo } from "react";
import { ClearButton } from "../../clearButton";
import { ChevronDownIcon } from "../../../../icons/chevronDown";
import { Option } from "../components/option";
import { Options } from "../components/options";
import { Button } from "../components/comboboxButton";
import { Input } from "../components/input";

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
      defaultValue?.length ? defaultValue : []
    );
    const [query, setQuery] = useState("");

    // Update formatSelectedValues to always show current selections
    const formatSelectedValues = () => {
      // Show query while typing
      if (query) return query;

      // Show selected values
      const labels = selectedValues
        .map((value) => options.find((opt) => opt.value === value)?.label)
        .filter(Boolean)
        .join(", ");

      console.log("Formatted labels:", labels);
      return labels || ""; // Return empty string when no selections
    };

    // Add debug logging
    console.log("Current selectedValues:", selectedValues);

    //Filter options based on query and selected values and memoize the result
    const filteredOptions = useMemo(() => {
      return options.filter((option) => {
        const matchesQuery =
          !query || option.label.toLowerCase().includes(query.toLowerCase());
        const notAlreadySelected = !selectedValues.includes(option.value);

        console.log(`Option ${option.label}:`, {
          matchesQuery,
          notAlreadySelected,
        });

        return matchesQuery && notAlreadySelected;
      });
    }, [query, options, selectedValues]);

    console.log("Current filteredOptions:", filteredOptions);

    // Update handleInputChange to pass single values
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setQuery(inputValue);
      if (onInputChange) {
        onInputChange([inputValue]); // Keep array for compatibility
      }
    };

    // Update the handleOptionSelect function
    const handleOptionSelect = (value: string) => {
      console.log("Before selection - selectedValues:", selectedValues);

      // Ensure value is a single string
      const valueToAdd = Array.isArray(value) ? value[0] : value;

      if (!selectedValues.includes(valueToAdd)) {
        const newSelectedValues = [...selectedValues, valueToAdd];
        console.log("Setting new selectedValues:", newSelectedValues);
        setSelectedValues(newSelectedValues);
        setQuery(""); // Clear query after selection

        // Update onChange with new array
        if (onChange) {
          onChange(newSelectedValues);
        }
      }
    };

    const handleClear = () => {
      setSelectedValues([]); // Clear all selected values
      setQuery(""); // Clear query

      // Notify parent components
      if (onChange) {
        onChange([]); // Pass empty array to onChange
      }

      if (onClear) {
        onClear();
      }
    };

    //Removes the selected value from the selectedValues array. Calls the onChange callback with the new array of selected values.
    const handleRemoveOption = (valueToRemove: string) => {
      const newSelectedValues = selectedValues.filter(
        (value) => value !== valueToRemove
      );
      setSelectedValues(newSelectedValues);
      onChange?.(newSelectedValues);
    };

    return (
      <ComboboxPrimitive
        multiple
        as="div"
        ref={ref}
        className={twMerge("k1-absolute k1-w-full", className)}
        onChange={handleOptionSelect}
        value={selectedValues}
        {...props}
      >
        <div className="k1-flex k1-items-center k1-w-full">
          <Input
            onChange={handleInputChange}
            value={formatSelectedValues()}
            className="k1-flex-grow k1-container k1-peer"
            data-focus={query ? "true" : undefined}
          />
          {children}
          <Button>
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
                onClick={() => handleOptionSelect(option.value)} // Add onClick handler
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

export { Combobox, Input };
