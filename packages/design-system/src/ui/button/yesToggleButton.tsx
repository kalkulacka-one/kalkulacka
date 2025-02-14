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
      className="max-[576px]:!k1-w-full max-[576px]:!k1-justify-center xs:!k1-w-fit lg:!k1-w-full lg:!k1-justify-start"
      onClick={onClick}
      wider
      toggleButtonPressed={pressed}
      data-pressed={pressed ? true : undefined}
    >
      Ano
    </ToggleButton>
  );
}

// "max-[576px]:!k1-w-full
// xs:!k1-w-fit
// !k1-justify-center
// min-[1200px]:!k1-max-w-64
// min-[1200px]:!k1-justify-start"
