import { ToggleButton } from "@repo/design-system/ui";
import { NoIcon } from "@repo/design-system/icons";

type Props = {
  pressed?: boolean | null;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function NoToggleButton({ pressed, onClick }: Props) {
  return (
    <ToggleButton
      kind="inverse"
      color="secondary"
      icon={NoIcon}
      iconPosition="left"
      compactable
      fitContent
      wider
      onClick={onClick}
      data-pressed={pressed ? true : undefined}
    >
      Ne
    </ToggleButton>
  );
}
