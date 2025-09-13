import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type ReviewNavigationCard = {
  onNextClick: () => void;
  attributionHref?: string;
};

export function ReviewNavigationCard({ onNextClick, attributionHref }: ReviewNavigationCard) {
  return (
    <NavigationCard attributionHref={attributionHref}>
      <Button onClick={onNextClick}>Zobrazit výsledky</Button>
    </NavigationCard>
  );
}
