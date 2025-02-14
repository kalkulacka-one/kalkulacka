import { ToggleButton } from "@repo/design-system/ui";
import { NoIcon } from "@repo/design-system/icons";
export default function AnswerYesToggle() {
  return (
    <ToggleButton
      kind="inverse"
      color="secondary"
      icon={NoIcon}
      iconPosition="left"
      compactable
      fitContent
      wider
    >
      Ne
    </ToggleButton>
  );
}
