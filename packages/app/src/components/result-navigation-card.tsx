import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "koa:h-22";

export type ResultNavigationCard = {
  onNextClick: () => void;
  onShareClick: () => void;
};

export function ResultNavigationCard({ onNextClick, onShareClick }: ResultNavigationCard) {
  const t = useTranslations("koa.components.resultNavigationCard");

  return (
    <NavigationCard>
      <div className="koa:flex koa:gap-2 koa:w-full">
        <div className="koa:flex-1">
          <Button color="neutral" variant="outline" onClick={onNextClick}>
            {t("compareButton")}
          </Button>
        </div>
        <div className="koa:flex-1">
          <Button color="neutral" variant="fill" onClick={onShareClick}>
            {t("shareButton")}
          </Button>
        </div>
      </div>
    </NavigationCard>
  );
}

ResultNavigationCard.heightClassNames = HEIGHT;
