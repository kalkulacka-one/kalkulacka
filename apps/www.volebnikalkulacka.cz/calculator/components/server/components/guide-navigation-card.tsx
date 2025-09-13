import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type GuideNavigationCard = {
  onNextClick: () => void;
  attributionHref?: string;
};

export function GuideNavigationCard({ onNextClick, attributionHref }: GuideNavigationCard) {
  return (
    <NavigationCard attributionHref={attributionHref}>
      <Button onClick={onNextClick}>Začít odpovídat</Button>
    </NavigationCard>
  );
}
