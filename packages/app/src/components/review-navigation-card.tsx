import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-[88px]";

export type ReviewNavigationCard = {
  onNextClick: () => void;
};

export function ReviewNavigationCard({ onNextClick }: ReviewNavigationCard) {
  const t = useTranslations("koa.components.reviewNavigationCard");

  return (
    <NavigationCard>
      <Button color="neutral" onClick={onNextClick}>
        {t("showResultsButton")}
      </Button>
    </NavigationCard>
  );
}

ReviewNavigationCard.heightClassNames = HEIGHT;
