import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-22";

export type IntroductionNavigationCard = {
  onNextClick: () => void;
};

export function IntroductionNavigationCard({ onNextClick }: IntroductionNavigationCard) {
  return (
    <NavigationCard>
      <Button color="neutral" onClick={onNextClick}>
        Tovább
      </Button>
    </NavigationCard>
  );
}

IntroductionNavigationCard.heightClassNames = HEIGHT;
