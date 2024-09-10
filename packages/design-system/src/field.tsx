import { Field } from "@headlessui/react";
import React from "react";
import Label from "./Label";
import Input from "./Input";

interface FieldProps extends React.ComponentPropsWithoutRef<typeof Field> {
  children: React.ReactNode;
  label?: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}

const FieldComponent: React.FC<FieldProps> = ({
  children,
  label,
  name,
  required = false,
  type = "text",
  placeholder,
  ...props
}) => {
  const id = `${name}-input`;

  return (
    <Field {...props}>
      <Label htmlFor={id} text={label} required={required} />
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
      {children}
    </Field>
  );
};

export default FieldComponent;
