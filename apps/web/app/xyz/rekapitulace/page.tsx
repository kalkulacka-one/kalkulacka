"use client";
import { Badge } from "@repo/design-system/badge";
import {
  YesIcon,
  NoIcon,
  NeutralIcon,
  ArrowIconRight,
} from "@repo/design-system/icons";
import { Button, Card } from "@repo/design-system/ui";
import { StarIconButton } from "@repo/design-system/ui";
import { DetailIconButton } from "@repo/design-system/ui";
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
      <div className="grid">
        <div>
          <span>
            Zde si můžete projít a případně upravit svoje odpovědi a jejich
            váhu.
          </span>
          <Card
            id="Id"
            corner="topLeft"
            className="flex w-1/2 flex-col items-center justify-between gap-4 p-customMobile md:p-customDesktop"
          >
            <div className="flex items-center justify-between">
              {/* toggle star */}
              <StarIconButton onClick={() => alert("Toggle clicked")} />

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-normal">1/25</span>
                  <span className="text-sm font-normal">
                    Více míst na gymnáziích
                  </span>
                  <Badge>Vzdělání</Badge>
                </div>
                <div>
                  {/* TODO: line height fix value */}
                  <span className="text-lg font-bold leading-6 tracking-tighter">
                    Měl by kraj rozšířit kapacitu gymnázií a podpořit všeobecné
                    vzdělávací obory?
                  </span>
                </div>
              </div>
              <div className="group-[detail]">
                <DetailIconButton
                  onClick={() => alert("Detail icon toggled")}
                />
              </div>
            </div>
            <div className="flex w-full">
              <Button
                kind="inverse"
                color="primary"
                size="default"
                hasIcon
                icon={YesIcon}
                compactable
                wider
                onClick={() => alert(-"In Favour clicked")}
              >
                Ano
              </Button>
              <Button
                kind="inverse"
                color="secondary"
                size="default"
                hasIcon
                icon={NoIcon}
                compactable
                wider
                onClick={() => alert(-"Against clicked")}
              >
                Ne
              </Button>
            </div>
            <div>
              <p className="text-base font-normal text-neutral">
                V ČR studuje na všeobecných oborech 30 % žáků, zatímco v Evropě
                je tento podíl 50 %. Zastánci chtějí připravit studenty/ky na
                proměnlivý pracovní trh a zlepšit šance i na další, vyšší
                vzdělávání, odpůrci argumentují potřebou odborných škol pro
                naplnění poptávky po specializovaných pracovních místech.
              </p>
            </div>

            {/* <ButtonInFavour onClick={() => alert("In Favour clicked")} />
            {/* <ButtonAgainst onClick={() => alert("Against clicked")} /> */}
            {/* detail wrapper */}
            {/* <div>
              <span>Detail wrapper</span>
            </div> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
