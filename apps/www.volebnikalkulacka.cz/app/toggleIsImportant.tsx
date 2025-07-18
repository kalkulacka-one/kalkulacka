import { Toggle } from "@repo/design-system/client";

export type ToggleAnswerYes = {
  checked?: boolean;
  onChange: () => void;
};

export function ToggleIsImportant({ checked, onChange, ...props }: ToggleAnswerYes) {
  return (
    <Toggle variant="answer" color="neutral" checked={checked} onChange={onChange} {...props}>
      Pro mě důležité
    </Toggle>
  );
}
