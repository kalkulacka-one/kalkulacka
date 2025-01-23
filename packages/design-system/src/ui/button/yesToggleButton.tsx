import { buttonVariants, ToggleButton } from "@repo/design-system/ui";
import { YesIcon } from "@repo/design-system/icons";
import { VariantProps } from "class-variance-authority";

type Props = {
  onClick: () => void;
  pressed?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function YesToggleButton({ pressed, onClick }: Props) {
  return (
    <ToggleButton
      kind="inverse"
      color="primary"
      icon={YesIcon}
      hasIcon
      compactable
      iconPosition="left"
      className="!k1-w-full !k1-justify-center xs:k1-w-fit min-[1200px]:!k1-w-64 min-[1200px]:!k1-justify-start"
      onClick={onClick}
      wider
      // compactable
      toggleButtonPressed={pressed}
      data-pressed={pressed ? true : undefined}
    >
      Ano
    </ToggleButton>
  );
}
