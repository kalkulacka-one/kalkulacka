import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-22";

export type IntroductionNavigationCard = {
  onNextClick: () => void;
};

export function IntroductionNavigationCard({ onNextClick }: IntroductionNavigationCard) {
  const t = useTranslations("calculator.introduction");
  return (
    <NavigationCard>
      <Button color="primary" onClick={onNextClick}>
        {t("next-button")}
      </Button>
    </NavigationCard>
  );
}

IntroductionNavigationCard.heightClassNames = HEIGHT;
