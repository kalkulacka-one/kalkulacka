import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type ReviewNavigationCard = {
  onNextClick: () => void;
  attribution?: boolean;
};

export function ReviewNavigationCard({ onNextClick, attribution }: ReviewNavigationCard) {
  return (
    <NavigationCard attribution={attribution}>
      <Button onClick={onNextClick}>Zobrazit výsledky</Button>
    </NavigationCard>
  );
}
