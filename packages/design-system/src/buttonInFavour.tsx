import { Button } from "@repo/design-system/button";
import { YesIcon } from "@repo/design-system/yesIcon";

export default function ButtonInFavour() {
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
    >
      <span className="k1-hidden md:k1-block">Jsem pro</span>
    </Button>
  );
}
