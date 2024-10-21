import { Button } from "@repo/design-system/button";
import { NoIcon } from "@repo/design-system/noIcon";

export default function ButtonAgainst() {
  return (
    <Button
      kind="outline"
      size="default"
      color="secondary"
      icon={NoIcon}
      iconPosition="left"
      hasIcon
      wider
      fitContent
    >
      <span className="k1-hidden md:k1-block">Jsem proti</span>
    </Button>
  );
}
