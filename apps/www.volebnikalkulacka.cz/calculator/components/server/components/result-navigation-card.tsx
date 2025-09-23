import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-22";

export type ResultNavigationCard = {
  onNextClick: () => void;
};

export function ResultNavigationCard({ onNextClick }: ResultNavigationCard) {
  return (
    <NavigationCard>
      <Button color="neutral" onClick={onNextClick}>
        Zobrazit porovnání
      </Button>
    </NavigationCard>
  );
}

ResultNavigationCard.heightClassNames = HEIGHT;
