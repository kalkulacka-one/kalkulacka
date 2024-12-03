"use client";

import { Question } from "@repo/design-system/ui";
import { ArrowIconLeft, ArrowIconRight } from "@repo/design-system/demo";
import { Button } from "@repo/design-system/ui";

export default function Page() {
  return (
    <>
      {/* content */}
      {/* mobile arrow bar */}
      <div className="flex justify-between sm:hidden">
        <Button
          hasIcon
          icon={ArrowIconLeft}
          iconPosition="left"
          kind="link"
          fitContent
        >
          Předchozí
        </Button>
        <Button
          hasIcon
          icon={ArrowIconRight}
          iconPosition="right"
          kind="link"
          fitContent
        >
          Přeskočit
        </Button>
      </div>
      <div className="xs:flex xs:flex-col xs:gap-2 min-[701px]:grid min-[701px]:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:grid sm:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:gap-8">
        {/* desktop grid content */}
        {/* Place button end with flex ok? */}
        <div className="items-center justify-end xs:hidden min-[701px]:flex">
          {/* button wrapper */}
          <div className="hidden min-[701px]:hidden sm:block">
            <Button
              hasIcon
              fitContent
              icon={ArrowIconLeft}
              kind="link"
              // fix k1 prefix issue!!!
            >
              <span className="hidden md:block">
                Předchozí <span className="hidden lg:inline">otázka</span>
              </span>
            </Button>
          </div>
        </div>
        <div>
          <Question />
        </div>
        <div className="hidden content-center xs:block">
          {/* button wrapper */}
          <div className="hidden min-[701px]:hidden sm:block">
            <Button
              hasIcon
              fitContent
              icon={ArrowIconRight}
              iconPosition="right"
              kind="link"
            >
              <span className="hidden md:block">
                Přeskočit <span className="hidden lg:inline">otázku</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
