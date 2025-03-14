import { buttonVariants, ToggleButton } from "@repo/design-system/ui";
import { FilterIcon } from "@repo/design-system/icons";
import { VariantProps } from "class-variance-authority";

type Props = {
  onClick: () => void;
  pressed?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function FilterToggleButton({ pressed, onClick }: Props) {
  return (
    <ToggleButton
      kind="link"
      size="auto"
      icon={FilterIcon}
      hasIcon
      fitContent
      iconPosition="right"
      onClick={onClick}
      toggleButtonPressed={pressed}
      data-pressed={pressed ? true : undefined}
    >
      <span className="k1-hidden sm:k1-inline">Nastavit porovnání</span>
    </ToggleButton>
  );
}
