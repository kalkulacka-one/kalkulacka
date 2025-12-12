import { Button } from "@kalkulacka-one/design-system/client";

import { useIntl } from "react-intl";

import { NavigationCard } from "@/components/navigation-card";

const HEIGHT = "koa:h-22";

export type GuideNavigationCard = {
  onNextClick: () => void;
};

export function GuideNavigationCard({ onNextClick }: GuideNavigationCard) {
  const intl = useIntl();

  return (
    <NavigationCard>
      <Button color="neutral" onClick={onNextClick}>
        {intl.formatMessage({ id: "components.guideNavigationCard.startButton" })}
      </Button>
    </NavigationCard>
  );
}

GuideNavigationCard.heightClassNames = HEIGHT;
