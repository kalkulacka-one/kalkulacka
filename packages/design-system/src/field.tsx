import React, { useState, useId } from "react";
import { Label, Input } from "./FormComponents";

interface FieldsetWrapperProps {
  legend: string;
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
  legendClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export default function FieldsetWrapper({
  legend,
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  defaultValue = "",
  className = "",
  legendClassName = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
}: FieldsetWrapperProps) {
  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (touched) {
      validateField(e.target.value);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validateField(value);
  };

  const validateField = (fieldValue: string) => {
    if (required && !fieldValue) {
      setError("This field is required");
    } else {
      setError(null);
    }
  };

  return (
    <fieldset className={`space-y-2 ${className}`}>
      <legend
        className={`text-base font-medium text-gray-900 ${legendClassName}`}
      >
        {legend}
      </legend>
      <div className="space-y-1">
        <Label htmlFor={id} required={required} className={labelClassName}>
          {label}
        </Label>
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!error}
          className={inputClassName}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
          <p
            id={`${id}-error`}
            className={`mt-1 text-sm text-red-600 ${errorClassName}`}
          >
            {error}
          </p>
        )}
      </div>
    </fieldset>
  );
}
