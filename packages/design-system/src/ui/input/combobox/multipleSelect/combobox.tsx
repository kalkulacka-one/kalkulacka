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
  // eslint-disable-next-line no-unused-vars
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
    ref,
  ) => {
    //Use state for selecting values. If nothing is provided, defaultValue will become the selected value
    const [selectedValues, setSelectedValues] = useState<string[]>(
      defaultValue?.length ? defaultValue : [],
    );
    const [query, setQuery] = useState("");

    // Update formatSelectedValues dynamically to show the input field value
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

    // Debug logging
    console.log("Current selectedValues:", selectedValues);

    // Update filteredOptions to properly filter based on selectedValues
    const filteredOptions = useMemo(() => {
      console.log("Filtering options with selectedValues:", selectedValues);

      return options.filter((option) => {
        const matchesQuery =
          !query || option.label.toLowerCase().includes(query.toLowerCase());
        const notAlreadySelected = !selectedValues.includes(option.value);

        console.log(`Filtering ${option.label}:`, {
          matchesQuery,
          notAlreadySelected,
        });

        return matchesQuery && notAlreadySelected;
      });
    }, [query, options, selectedValues]);

    console.log("Current filteredOptions:", filteredOptions);

    // Update handleInputChange to pass single values
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const safeInputValue = event.target.value || "";
      setQuery(safeInputValue);

      // Remove items that are no longer in the input
      const remainingValues = selectedValues.filter((value) => {
        const normalizedInput = safeInputValue.toLowerCase();
        const normalizedValue = value.toLowerCase();
        return normalizedInput.includes(normalizedValue);
      });

      // Only update if values have changed
      if (remainingValues.length !== selectedValues.length) {
        setSelectedValues(remainingValues);
        if (onInputChange) {
          onInputChange(remainingValues);
        }
      }

      if (onInputChange) {
        onInputChange([safeInputValue]); // Keep array for compatibility
      }
    };

    // Update the handleOptionSelect function
    const handleOptionSelect = (value: string) => {
      console.log("Before selection - selectedValues:", selectedValues);

      // Checks, if the value is an array and takes the first element
      const valueToAdd = Array.isArray(value) ? value[0] : value;

      // Check if the value is already selected
      if (!selectedValues.includes(valueToAdd)) {
        const newSelectedValues = [...selectedValues, valueToAdd];
        console.log("Setting new selectedValues:", newSelectedValues);
        //Tells the par
        setSelectedValues(newSelectedValues);
        setQuery(""); // Clear query after selection

        // Update onChange with new array
        if (onChange) {
          onChange(newSelectedValues);
        }
      }
    };

    // Update handleOptionSelect to properly remove options

    const handleClear = () => {
      setSelectedValues([]); // Clear all selected values in dropdown
      setQuery(""); // Clear query state for searching

      // Notify parent components
      if (onChange) {
        onChange([]); // Notifies the parent, that the array is empty
      }

      if (onClear) {
        onClear();
      }
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
  },
);

export { Combobox, Input };
