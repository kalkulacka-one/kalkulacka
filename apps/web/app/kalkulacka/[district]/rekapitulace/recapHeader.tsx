/* eslint-disable tailwindcss/no-custom-classname */
import {
  ArrowIconLeft,
  ArrowIconRight,
  PercentageIcon,
} from "@repo/design-system/icons";
import { Button } from "@repo/design-system/ui";
import Link from "next/link";

type Props = {
  lastQuestion?: number;
  district?: string | string[] | undefined;
};

export default function RecapHeader({ lastQuestion, district }: Props) {
  return (
    <header className="sticky top-0 grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 bg-white p-2 backdrop-blur-[6px] xs:p-4 sm:gap-8 sm:p-8">
      {/* fix link wrap, should be link in style of a button! */}
      {/*Link to the last question "current quesiton" */}
      <div className="flex items-center  justify-self-start">
        <Link
          className="flex items-center"
          href={`/kalkulacka/${district}/otazka`}
        >
          <Button
            hasIcon
            icon={ArrowIconLeft}
            iconPosition="left"
            kind="link"
            fitContent
            size="auto"
            // important is temp fix due to probable twMerge strane behavior
            className="!k1-justify-center k1-p-2"
          />
        </Link>
      </div>

      <div className="absolute justify-self-center sm:relative sm:mr-auto">
        {/* replace with typo compoment */}
        <h2 className="text-3xl font-bold tracking-snug text-neutral-strong sm:text-5xl">
          Rekapitulace
        </h2>
      </div>

      {/* twmerge button fix here */}
      <div className="hidden sm:block sm:justify-self-end">
        {/* fix link wrap, should be link in style of a button! */}
        <Link href={`/kalkulacka/${district}/vysledky`}>
          <Button
            hasIcon
            kind="filled"
            size="default"
            color="primary"
            iconPosition="right"
            fitContent
            icon={ArrowIconRight}
          >
            <div className="flex">
              {/* margin or gap? */}
              <PercentageIcon className="mr-4 size-6" />
              Zobrazit výsledky
            </div>
          </Button>
        </Link>
      </div>
    </header>
  );
}
