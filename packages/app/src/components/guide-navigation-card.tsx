import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { NavigationCard } from "@/components/navigation-card";

const HEIGHT = "h-[88px]";

export type GuideNavigationCard = {
  onNextClick: () => void;
};

export function GuideNavigationCard({ onNextClick }: GuideNavigationCard) {
  const t = useTranslations("koa.components.guideNavigationCard");

  return (
    <NavigationCard>
      <Button color="neutral" onClick={onNextClick}>
        {t("startButton")}
      </Button>
    </NavigationCard>
  );
}

GuideNavigationCard.heightClassNames = HEIGHT;
