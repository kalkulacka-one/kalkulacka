"use client";

import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-22";

export type ReviewNavigationCard = {
  onNextClick: () => void;
};

export function ReviewNavigationCard({ onNextClick }: ReviewNavigationCard) {
  const t = useTranslations("calculator.review");
  return (
    <NavigationCard>
      <Button color="primary" onClick={onNextClick}>
        {t("show-results-button")}
      </Button>
    </NavigationCard>
  );
}

ReviewNavigationCard.heightClassNames = HEIGHT;
