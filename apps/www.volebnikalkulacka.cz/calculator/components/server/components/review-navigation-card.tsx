import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type ReviewNavigationCard = {
  onPreviousClick: () => void;
  onNextClick: () => void;
};

export function ReviewNavigationCard({ onPreviousClick, onNextClick }: ReviewNavigationCard) {
  return (
    <NavigationCard>
      <Button variant="outline" onClick={onPreviousClick}>
        Zpět
      </Button>
      <Button onClick={onNextClick}>Zobrazit výsledky</Button>
    </NavigationCard>
  );
}
