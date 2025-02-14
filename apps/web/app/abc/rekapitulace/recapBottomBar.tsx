import { ArrowIconRight } from "@repo/design-system/icons";
import { Button } from "@repo/design-system/ui";
import Link from "next/link";

export default function RecapBottomBar() {
  return (
    <div className="sticky bottom-0 bg-white p-4 sm:hidden">
      {/* fix link wrap, should be link in style of a button! */}
      <Link href="/abc/vysledky">
        <Button
          hasIcon
          kind="filled"
          size="default"
          color="primary"
          iconPosition="right"
          icon={ArrowIconRight}
        >
          Zobrazit výsledky
        </Button>
      </Link>
    </div>
  );
}
