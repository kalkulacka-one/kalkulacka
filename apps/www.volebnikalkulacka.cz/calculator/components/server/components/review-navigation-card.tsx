import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type ReviewNavigationCard = {
  onNextClick: () => void;
};

export function ReviewNavigationCard({ onNextClick }: ReviewNavigationCard) {
  return (
    <NavigationCard>
      <Button onClick={onNextClick}>Začít odpovídat</Button>
    </NavigationCard>
  );
}
