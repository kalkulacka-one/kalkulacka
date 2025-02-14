import { ArrowIconRight } from "@repo/design-system/icons";
import { Card, Button } from "@repo/design-system/ui";
import Link from "next/link";

export default function ResultsFallback() {
  return (
    <Card color="white" corner="bottomLeft" border="none" className="p-4">
      <div className="flex flex-col items-start gap-6">
        {/* replace with font typo component */}
        <p className="text-3xl font-bold leading-[1.28] tracking-slight-tight">
          Pro zobrazení výsledku je nutné odpovědět alespoň na 1 otázku
        </p>
        <p className="font-light leading-normal">
          Můžete se{" "}
          <a className="text-primary hover:no-underline" href="/abc/otazka/1">
            vrátit na začátek
          </a>{" "}
          a odpovědět na minimálně 1 otázku, nebo si{" "}
          <a className="text-primary hover:no-underline" href="#">
            zobrazit porovnání odpovědí kandidátů
          </a>
          .
        </p>
        <div className="flex flex-wrap items-start gap-6">
          <Link href="/abc/otazka/1">
            <Button
              kind="inverse"
              color="primary"
              hasIcon
              iconPosition="right"
              fitContent
              icon={ArrowIconRight}
            >
              Vyplnit kalkulačku
            </Button>
          </Link>
          <Button
            kind="inverse"
            color="primary"
            hasIcon
            fitContent
            iconPosition="right"
            icon={ArrowIconRight}
          >
            Odpovědi kandidátů
          </Button>
        </div>
      </div>
    </Card>
  );
}
