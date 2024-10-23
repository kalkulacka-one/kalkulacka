import { Button, buttonVariants } from "@repo/design-system/button";
import { NeutralIcon } from "@repo/design-system/neutralIcon";
import { VariantProps } from "class-variance-authority";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export default function ButtonNeutral(props: Props) {
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
