import { Button, buttonVariants } from "@repo/design-system/ui";
import { NeutralIcon } from "../../icons/neutralIcon";
import { VariantProps } from "class-variance-authority";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function ButtonNeutral(props: Props) {
  return (
    <Button
      kind="inverse"
      size="default"
      color="neutral"
      icon={NeutralIcon}
      iconPosition="left"
      hasIcon
      compactable
      wider
      fitContent
      {...props}
    >
      Přeskočit
    </Button>
  );
}
