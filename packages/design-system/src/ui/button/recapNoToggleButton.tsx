import { buttonVariants, ToggleButton } from "@repo/design-system/ui";
import { NoIcon } from "@repo/design-system/icons";
import { VariantProps } from "class-variance-authority";

type Props = {
  pressed?: boolean;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function RecapNoToggleButton({ pressed, onClick }: Props) {
  return (
    <ToggleButton
      kind="inverse"
      color="secondary"
      icon={NoIcon}
      iconPosition="left"
      className="!k1-w-full !k1-justify-center !k1-gap-6 min-[576px]:!k1-justify-start lg:!k1-w-full lg:!k1-justify-start"
      compactable
      fitContent
      wider
      onClick={onClick}
      toggleButtonPressed={pressed}
      data-pressed={pressed ? true : undefined}
    >
      Ne
    </ToggleButton>
  );
}
