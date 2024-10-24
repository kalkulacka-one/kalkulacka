import { Button, buttonVariants } from "@repo/design-system/ui";
import { NoIcon } from "../../icons/noIcon";
import { VariantProps } from "class-variance-authority";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function ButtonAgainst(props: Props) {
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
