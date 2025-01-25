import { buttonVariants, ToggleButton } from "@repo/design-system/ui";
import { NoIcon } from "@repo/design-system/icons";
import { VariantProps } from "class-variance-authority";

type Props = {
  pressed?: boolean;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function NoToggleButton({ pressed, onClick }: Props) {
  // console.log("NoToggleButton pressed:", pressed);
  return (
    <ToggleButton
      kind="inverse"
      color="secondary"
      icon={NoIcon}
      iconPosition="left"
      className="max-[576px]:!k1-w-full max-[576px]:!k1-justify-center xs:!k1-w-fit lg:!k1-w-full lg:!k1-justify-start"
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
