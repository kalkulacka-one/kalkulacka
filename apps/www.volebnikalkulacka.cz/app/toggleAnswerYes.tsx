import { Toggle } from "@repo/design-system/client";

export type ToggleAnswerYes = {
  checked: boolean;
  onChange: () => void;
};

export function ToggleAnswerYes({ checked, onChange, ...props }: ToggleAnswerYes) {
  return (
    <Toggle variant="answer" color="primary" checked={checked} onChange={onChange} {...props}>
      Ano
    </Toggle>
  );
}
