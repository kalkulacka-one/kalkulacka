import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type IntroductionNavigationCard = {
  onNextClick: () => void;
  attributionHref?: string;
};

export function IntroductionNavigationCard({ onNextClick, attributionHref }: IntroductionNavigationCard) {
  return (
    <NavigationCard attributionHref={attributionHref}>
      <Button onClick={onNextClick}>Pokračovat</Button>
    </NavigationCard>
  );
}
