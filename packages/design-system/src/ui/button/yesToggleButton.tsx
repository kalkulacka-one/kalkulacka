import { ToggleButton } from "@repo/design-system/ui";
import { YesIcon } from "@repo/design-system/icons";

type Props = {
  pressed?: boolean | null;
};
export function YesToggleButton({ pressed }: Props) {
  return (
    <ToggleButton
      kind="inverse"
      color="primary"
      icon={YesIcon}
      iconPosition="left"
      compactable
      fitContent
      wider
      data-pressed={pressed ? true : undefined}
    >
      Ano
    </ToggleButton>
  );
}
