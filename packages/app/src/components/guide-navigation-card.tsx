import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "@/components/navigation-card";

// The nav sits in the document flow at every breakpoint now (sticky, never `fixed`), so no reserved gap is needed.

export type GuideNavigationCard = {
  onNextClick: () => void;
};

export function GuideNavigationCard({ onNextClick }: GuideNavigationCard) {
  const t = useTranslations("koa.components.guideNavigationCard");

  return (
    <NavigationCard bare alignStart>
      <Button color="neutral" onClick={onNextClick}>
        {t("startButton")}
      </Button>
    </NavigationCard>
  );
}
