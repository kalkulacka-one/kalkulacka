import { Toggle } from "@repo/design-system/client";

export type ToggleAnswerNo = {
  checked?: boolean;
  onChange: () => void;
};

export function ToggleAnswerNo({ checked, onChange, ...props }: ToggleAnswerNo) {
  return (
    <Toggle variant="answer" color="secondary" checked={checked} onChange={onChange} {...props}>
      Ne
    </Toggle>
  );
}
