import { Checkbox } from "../../checkbox";
import { Option } from "../option";

interface CheckboxOptionProps {
  value: string;

  className?: string;

  children: React.ReactNode;

  key: string | number;
}

export function CheckboxOption({
  value,
  className,
  children,
  key,
}: CheckboxOptionProps) {
  return (
    <Option>
      <Checkbox />
      {children}
    </Option>
  );
}
