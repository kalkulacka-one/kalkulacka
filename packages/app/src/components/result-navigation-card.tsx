import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "koa:h-[88px] koa:sm:hidden"; // sm+: the nav sits in the document flow now, no reserved gap needed.

export type ResultNavigationCard = {
  onNextClick: () => void;
  onShareClick: () => void;
};

export function ResultNavigationCard({ onNextClick, onShareClick }: ResultNavigationCard) {
  const t = useTranslations("koa.components.resultNavigationCard");

  return (
    <NavigationCard>
      <div className="koa:grid koa:grid-cols-2 koa:gap-2 koa:sm:gap-3 koa:w-full koa:*:w-full">
        <Button color="neutral" variant="outline" onClick={onNextClick}>
          {t("compareButton")}
        </Button>
        <Button color="neutral" variant="fill" onClick={onShareClick}>
          {t("shareButton")}
        </Button>
      </div>
    </NavigationCard>
  );
}

ResultNavigationCard.heightClassNames = HEIGHT;
