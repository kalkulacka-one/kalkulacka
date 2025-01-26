"use client";
import {
  ArrowIconLeft,
  ArrowIconRight,
  ShareIcon,
} from "@repo/design-system/icons";
import { Button } from "@repo/design-system/ui";
import Link from "next/link";
import ResultCard from "./resultCard";

interface Result {
  partyShort: string;
  partyLong: string;
  result: number;
}

interface Results {
  results: Result[];
}

const data: Results[] = [
  {
    results: [
      {
        partyShort: "STAN+SOL",
        partyLong: "STAROSTOVÉ PRO JIŽNÍ MORAVU",
        result: 89,
      },
      {
        partyShort: "Piráti",
        partyLong: "Česká pirátská strana",
        result: 89,
      },
      {
        partyShort: "SOM+Nestran2024",
        partyLong: "STAROSTOVÉ PRO JIŽNÍ MORAVU",
        result: 30,
      },
      {
        partyShort: "SOM+Nestran2024",
        partyLong: "STAROSTOVÉ PRO JIŽNÍ MORAVU",
        result: 15,
      },
      {
        partyShort: "KDU+ODS+TOP 09",
        partyLong: "SPOLU - ODS, KDU-ČSL, TOP 09",
        result: 6,
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 bg-white p-2  sm:gap-8 sm:p-8">
        {/* fix link wrap, should be link in style of a button! */}
        {/*Link to the last question "current quesiton" */}
        <div className="flex items-center  justify-self-start">
          <Link className="flex items-center" href="/abc/rekapitulace">
            <Button
              hasIcon
              icon={ArrowIconLeft}
              iconPosition="left"
              kind="link"
              fitContent
              size="auto"
            />
          </Link>
        </div>

        {/* replace with typo compoment */}
        <div className="justify-self-center sm:mr-auto">
          <h2 className="text-3xl font-bold tracking-snug text-neutral-strong sm:text-5xl">
            Moje shoda
          </h2>
        </div>

        {/* twmerge button fix here */}
        <div className="flex items-center gap-4 sm:justify-self-end">
          <Button
            hasIcon
            size="auto"
            kind="link"
            iconPosition="left"
            fitContent
            icon={ShareIcon}
          >
            Sdílet
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
      <main className="grid grid-cols-1 justify-center gap-4 p-4 min-[701px]:grid-cols-[clamp(32rem,50vw,48rem)]">
        {/* cards wrapper */}
        <div className="flex flex-col gap-4 ">
          {data[0]?.results.map((result, index) => (
            <ResultCard
              key={index}
              cardNumber={index + 1}
              isFirst={index === 0}
              results={result}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

// TODO
// 1. Main layout
// 2. Fallback layout
