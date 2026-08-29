import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-22";

export type GuideNavigationCard = {
  onNextClick: () => void;
};

export function GuideNavigationCard({ onNextClick }: GuideNavigationCard) {
  const t = useTranslations("calculator.guide");

  return (
    <NavigationCard>
      <Button color="primary" onClick={onNextClick}>
        {t("start-answering-button")}
      </Button>
    </NavigationCard>
  );
}

GuideNavigationCard.heightClassNames = HEIGHT;
