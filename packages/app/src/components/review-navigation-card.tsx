import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

// The nav sits in the document flow at every breakpoint now (sticky, never `fixed`), so no reserved gap is needed.
const HEIGHT = "";

export type ReviewNavigationCard = {
  onNextClick: () => void;
};

export function ReviewNavigationCard({ onNextClick }: ReviewNavigationCard) {
  const t = useTranslations("koa.components.reviewNavigationCard");

  return (
    <NavigationCard bare>
      <Button color="neutral" onClick={onNextClick}>
        {t("showResultsButton")}
      </Button>
    </NavigationCard>
  );
}

ReviewNavigationCard.heightClassNames = HEIGHT;
