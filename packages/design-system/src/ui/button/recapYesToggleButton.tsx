import { buttonVariants, ToggleButton } from "@repo/design-system/ui";
import { YesIcon } from "@repo/design-system/icons";
import { VariantProps } from "class-variance-authority";

type Props = {
  onClick: () => void;
  pressed?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function RecapYesToggleButton({ pressed, onClick }: Props) {
  return (
    <ToggleButton
      kind="inverse"
      color="primary"
      icon={YesIcon}
      hasIcon
      compactable
      iconPosition="left"
      className="!k1-w-full !k1-justify-center !k1-gap-6 min-[576px]:!k1-justify-start lg:!k1-w-full lg:!k1-justify-start"
      onClick={onClick}
      wider
      toggleButtonPressed={pressed}
      data-pressed={pressed ? true : undefined}
    >
      Ano
    </ToggleButton>
  );
}
