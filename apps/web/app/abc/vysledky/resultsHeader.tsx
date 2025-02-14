/* eslint-disable tailwindcss/no-custom-classname */
import {
  ArrowIconLeft,
  ArrowIconRight,
  ShareIcon,
} from "@repo/design-system/icons";
import { Button } from "@repo/design-system/ui";
import Link from "next/link";

export default function ResultsHeader() {
  return (
    <header className="sticky top-0 z-10 grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 bg-white p-2 backdrop-blur-[6px] xs:p-4 sm:gap-8 sm:p-8">
      {/* fix link wrap, should be link in style of a button! */}
      {/*Link to the last question "current quesiton" */}
      <div className="flex items-center  justify-self-start">
        <Link className="flex items-center" href="/abc/rekapitulace">
          <Button
            hasIcon
            icon={ArrowIconLeft}
            iconPosition="left"
            kind="link"
            // important is temp fix due to probable twMerge strane behavior
            className="!k1-justify-center k1-p-2"
            fitContent
            size="auto"
          />
        </Link>
      </div>

      {/* replace with typo compoment */}
      <div className="absolute justify-self-center sm:relative sm:mr-auto">
        <h2 className="text-3xl font-bold tracking-snug text-neutral-strong sm:text-5xl">
          Moje shoda
        </h2>
      </div>

      {/* twmerge button fix here */}
      <div className="flex items-center justify-self-end sm:gap-4">
        <Button size="auto" kind="link" fitContent>
          <span className="flex items-center text-primary">
            <ShareIcon className="mr-2 size-6" /> Sdílet
          </span>
        </Button>
        {/* fix link wrap, should be link in style of a button! */}
        <div></div>
        <Link className="hidden sm:inline" href="/abc/vysledky">
          <Button
            hasIcon
            kind="filled"
            size="default"
            color="primary"
            iconPosition="right"
            fitContent
            icon={ArrowIconRight}
          >
            {/* margin or gap? */}
            Porovnat odpovědi
          </Button>
        </Link>
      </div>
    </header>
  );
}
