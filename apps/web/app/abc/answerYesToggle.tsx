import { ToggleButton } from "@repo/design-system/ui";
import { YesIcon } from "@repo/design-system/icons";
export default function AnswerYesToggle() {
  return (
    <ToggleButton
      kind="inverse"
      color="primary"
      icon={YesIcon}
      iconPosition="left"
      compactable
      fitContent
      wider
    >
      Ano
    </ToggleButton>
  );
}
