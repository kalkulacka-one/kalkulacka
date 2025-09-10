import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type GuideNavigationCard = {
  onNextClick: () => void;
};

export function GuideNavigationCard({ onNextClick }: GuideNavigationCard) {
  return (
    <NavigationCard>
      <Button onClick={onNextClick}>Začít odpovídat</Button>
    </NavigationCard>
  );
}
