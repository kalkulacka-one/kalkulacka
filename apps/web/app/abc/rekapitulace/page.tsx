"use client";
import {
  ArrowIconLeft,
  ArrowIconRight,
  PercentageIcon,
} from "@repo/design-system/icons";
import { Blobs, Button } from "@repo/design-system/ui";

export default function Page() {
  return (
    <>
      <Blobs />
      {/* header */}
      <header className="sticky top-0 grid grid-cols-[auto_1fr_auto] items-center gap-8 bg-white p-4 sm:justify-center sm:p-8">
        <Button
          hasIcon
          icon={ArrowIconLeft}
          iconPosition="left"
          kind="link"
          fitContent
          size="auto"
        />
        {/* replace with typo compoment */}
        <h2 className="text-5xl  font-bold tracking-snug text-neutral-strong sm:mr-auto">
          Rekapitulace
        </h2>
        {/* twmerge button fix here */}
        <div className="hidden sm:block">
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
        </div>
      </header>
      <main className="grid grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] justify-center p-4">
        {/* grid col 1 */}
        <div></div>
        {/* grid col 2 */}
        <div>
          {/* replace with typo compoment */}
          <p className="text-sm leading-tight text-neutral">
            Zde si můžete projít a případně upravit svoje odpovědi a jejich
            váhu.
          </p>
        </div>

        {/* grid col 3 */}
        <div></div>
      </main>
      {/* bottom bar */}
      <div className="sticky bottom-0 bg-white p-4 sm:hidden">
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
      </div>
    </>
  );
}
