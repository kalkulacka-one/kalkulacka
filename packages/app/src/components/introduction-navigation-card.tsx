import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "koa:h-22";

export type IntroductionNavigationCard = {
  onNextClick: () => void;
};

export function IntroductionNavigationCard({ onNextClick }: IntroductionNavigationCard) {
  const t = useTranslations("koa.components.introductionNavigationCard");
  return (
    <NavigationCard>
      <Button color="neutral" onClick={onNextClick}>
        {t("continueButton")}
      </Button>
    </NavigationCard>
  );
}

IntroductionNavigationCard.heightClassNames = HEIGHT;
