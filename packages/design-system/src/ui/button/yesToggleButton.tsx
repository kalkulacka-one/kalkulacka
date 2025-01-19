import { ToggleButton } from "@repo/design-system/ui";
import { YesIcon } from "@repo/design-system/icons";

type Props = {
  onClick: () => void;
  pressed?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function YesToggleButton({ pressed, onClick }: Props) {
  return (
    <ToggleButton
      kind="inverse"
      color="primary"
      icon={YesIcon}
      iconPosition="left"
      compactable
      onClick={onClick}
      fitContent
      wider
      toggleButtonPressed={pressed}
      data-pressed={pressed ? true : undefined}
    >
      Ano
    </ToggleButton>
  );
}
