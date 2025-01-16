import { ToggleButton } from "@repo/design-system/ui";
import { NeutralIcon } from "@repo/design-system/icons";
export default function AnswerYesToggle() {
  return (
    <ToggleButton
      kind="inverse"
      color="neutral"
      icon={NeutralIcon}
      iconPosition="left"
      compactable
      fitContent
      wider
    >
      Nevím
    </ToggleButton>
  );
}
