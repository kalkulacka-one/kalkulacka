import { Button, buttonVariants } from "@repo/design-system/button";
import { NoIcon } from "@repo/design-system/noIcon";
import { VariantProps } from "class-variance-authority";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export default function ButtonAgainst(props: Props) {
  return (
    <Button
      kind="inverse"
      size="default"
      color="secondary"
      icon={NoIcon}
      iconPosition="left"
      hasIcon
      compactable
      wider
      fitContent
      {...props}
    >
      Jsem proti
    </Button>
  );
}
