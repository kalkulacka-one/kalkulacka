import { Button } from "@kalkulacka-one/design-system/client";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-22";

export type ReviewNavigationCard = {
  onNextClick: () => void;
};

export function ReviewNavigationCard({ onNextClick }: ReviewNavigationCard) {
  return (
    <NavigationCard>
      <Button color="primary" onClick={onNextClick}>
        Eredmények mutatása
      </Button>
    </NavigationCard>
  );
}

ReviewNavigationCard.heightClassNames = HEIGHT;
