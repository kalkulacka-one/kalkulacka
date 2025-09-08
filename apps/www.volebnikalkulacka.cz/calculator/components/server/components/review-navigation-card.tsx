import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type ReviewNavigationCard = {
  onPreviousClick: () => void;
  onNextClick: () => void;
};

export function ReviewNavigationCard({ onPreviousClick, onNextClick }: ReviewNavigationCard) {
  return (
    <NavigationCard>
      <div className="grid grid-flow-col gap-4">
        <Button variant="outline" onClick={onPreviousClick}>
          Zpět
        </Button>
        <Button onClick={onNextClick}>Zobrazit výsledky</Button>
      </div>
    </NavigationCard>
  );
}
