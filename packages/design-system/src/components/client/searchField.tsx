import { mdiMagnify } from "@mdi/js";
import type { InputHTMLAttributes, Ref } from "react";

import { Field } from "./field";
import { Icon } from "./icon";
import { Input } from "./input";
import { Label } from "./label";

export type SearchField = {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  clearLabel: string;
  placeholder?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "className" | "placeholder">;

export function SearchField({ value, onValueChange, label, clearLabel, placeholder, className, ref, ...rest }: SearchField) {
  return (
    <Field className={className}>
      <Label className="ko:sr-only">{label}</Label>
      <Input
        {...rest}
        ref={ref}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
        onClear={() => onValueChange("")}
        clearLabel={clearLabel}
      >
        <Icon icon={mdiMagnify} decorative size="small" />
      </Input>
    </Field>
  );
}
