import { Checkbox } from "../../checkbox";
import { Option } from "../components/option";

interface CheckboxOptionProps {
  value: string;

  className?: string;

  children: React.ReactNode;

  key: string | number;
}

export function CheckboxOption({ children }: CheckboxOptionProps) {
  return (
    <Option value={undefined}>
      <Checkbox />
      {children}
    </Option>
  );
}
