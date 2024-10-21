import { Button } from "@repo/design-system/button";
import { NeutralIcon } from "@repo/design-system/neutralIcon";

export default function ButtonNeutral() {
  return (
    <Button
      kind="outline"
      size="default"
      color="neutral"
      icon={NeutralIcon}
      iconPosition="left"
      hasIcon
      wider
      fitContent
    >
      <span className="k1-hidden md:k1-block">Jsem proti</span>
    </Button>
  );
}
