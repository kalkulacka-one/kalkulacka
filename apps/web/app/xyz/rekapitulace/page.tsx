"use client";
import { Badge } from "@repo/design-system/badge";
import { ArrowIconRight, ChevronDownIcon } from "@repo/design-system/icons";
import { Button, Card } from "@repo/design-system/ui";
import { ButtonInFavour, ButtonAgainst } from "@repo/design-system/ui";
import { StarIconButton } from "@repo/design-system/ui";
import { ToggleIconButton } from "@repo/design-system/ui";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col">
      {/* sticky subheader */}
      <div className="flex h-fit items-center justify-between gap-4 bg-red-400">
        <Button fitContent kind="link">
          <span className="text-2xl">←</span>
        </Button>
        <span className="mr-auto text-2xl font-bold">Rekapitulace</span>
        <Button
          kind="filled"
          size="default"
          color="primary"
          icon={ArrowIconRight}
          iconPosition="left"
          hasIcon
          compactable
          wider
          fitContent
        >
          Zobrazit výsledky
        </Button>
      </div>
      {/* rekapitulace cards */}
      {/* fix grid here, redudant cols */}
      <div className="grid grid-cols-3">
        <div></div>
        <div>
          <span>
            Zde si můžete projít a případně upravit svoje odpovědi a jejich
            váhu.
          </span>
          <Card
            id="Id"
            corner="topLeft"
            className="flex w-fit items-center justify-between gap-4 p-customMobile md:p-customDesktop"
          >
            {/* toggle star */}
            <StarIconButton onClick={() => alert("Toggle clicked")} />
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-normal">1/25</span>
                <span className="text-sm font-normal">Title něco</span>
                <Badge>Badge</Badge>
              </div>
              <div>
                {/* TODO: line height fix value */}
                <span className="text-2xl font-bold leading-6 tracking-tighter md:text-4xl">
                  Statement
                </span>
              </div>
              <div>
                <p className="text-base font-normal text-neutral">
                  Detail otázky, detail otázky.
                </p>
              </div>
            </div>

            <ButtonInFavour onClick={() => alert("In Favour clicked")} />
            {/* <ButtonAgainst onClick={() => alert("Against clicked")} /> */}
            <ToggleIconButton
              iconDefault={ChevronDownIcon}
              iconPressed={ArrowIconRight}
              onClick={() => alert("Arrow toggle clicked")}
            ></ToggleIconButton>
          </Card>
        </div>
        <div></div>
      </div>
    </div>
  );
}
