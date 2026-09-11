"use client";

import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-22";

export type ResultNavigationCard = {
  onNextClick: () => void;
};

export function ResultNavigationCard({ onNextClick }: ResultNavigationCard) {
  const t = useTranslations("calculator.result");
  return (
    <NavigationCard>
      <Button color="neutral" variant="fill" onClick={onNextClick}>
        {t("comparison-button")}
      </Button>
    </NavigationCard>
  );
}

ResultNavigationCard.heightClassNames = HEIGHT;
