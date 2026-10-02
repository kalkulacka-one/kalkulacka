import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

// The nav sits in the document flow at every breakpoint now (sticky, never `fixed`), so no reserved gap is needed.
const HEIGHT = "";

export type IntroductionNavigationCard = {
  onNextClick: () => void;
};

export function IntroductionNavigationCard({ onNextClick }: IntroductionNavigationCard) {
  const t = useTranslations("koa.components.introductionNavigationCard");
  return (
    <NavigationCard bare>
      <Button color="neutral" onClick={onNextClick}>
        {t("continueButton")}
      </Button>
    </NavigationCard>
  );
}

IntroductionNavigationCard.heightClassNames = HEIGHT;
