import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-[88px]";

export type PublicResultNavigationCard = {
  onStartClick: () => void;
};

export function PublicResultNavigationCard({ onStartClick }: PublicResultNavigationCard) {
  const t = useTranslations("koa.components.publicResultNavigationCard");

  return (
    <NavigationCard>
      <Button color="neutral" variant="fill" onClick={onStartClick}>
        {t("fillOwnCalculatorButton")}
      </Button>
    </NavigationCard>
  );
}

PublicResultNavigationCard.heightClassNames = HEIGHT;
