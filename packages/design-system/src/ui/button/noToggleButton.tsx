import { ToggleButton } from "@repo/design-system/ui";
import { NoIcon } from "@repo/design-system/icons";
type Props = {
  pressed?: boolean | null;
};
export function NoToggleButton({ pressed }: Props) {
  return (
    <ToggleButton
      kind="inverse"
      color="secondary"
      icon={NoIcon}
      iconPosition="left"
      compactable
      fitContent
      wider
      data-pressed={pressed ? true : undefined}
    >
      Ne
    </ToggleButton>
  );
}
