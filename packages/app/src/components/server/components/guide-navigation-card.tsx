import { Button } from "@kalkulacka-one/design-system/client";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-22";

export type GuideNavigationCard = {
  onNextClick: () => void;
};

export function GuideNavigationCard({ onNextClick }: GuideNavigationCard) {
  return (
    <NavigationCard>
      <Button color="neutral" onClick={onNextClick}>
        Začít odpovídat
      </Button>
    </NavigationCard>
  );
}

GuideNavigationCard.heightClassNames = HEIGHT;
