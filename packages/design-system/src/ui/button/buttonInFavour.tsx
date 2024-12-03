import { Button, buttonVariants } from "@repo/design-system/ui";
import { YesIcon } from "../../icons/yesIcon";
import { VariantProps } from "class-variance-authority";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function ButtonInFavour(props: Props) {
  return (
    <Button
      kind="inverse"
      size="default"
      color="primary"
      icon={YesIcon}
      iconPosition="left"
      hasIcon
      compactable
      wider
      fitContent
      {...props}
    >
      Ano
    </Button>
  );
}
