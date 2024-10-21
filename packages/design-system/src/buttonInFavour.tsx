import { Button, buttonVariants } from "@repo/design-system/button";
import { YesIcon } from "@repo/design-system/yesIcon";
import { VariantProps } from "class-variance-authority";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export default function ButtonInFavour(props: Props) {
  return (
    <Button
      kind="outline"
      size="default"
      color="primary"
      icon={YesIcon}
      iconPosition="left"
      hasIcon
      wider
      fitContent
      {...props}
    >
      <span className="k1-hidden md:k1-block">Jsem pro</span>
    </Button>
  );
}
