import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type GuideNavigationCard = {
  onNextClick: () => void;
  attribution?: boolean;
};

export function GuideNavigationCard({ onNextClick, attribution }: GuideNavigationCard) {
  return (
    <NavigationCard attribution={attribution}>
      <Button color="neutral" onClick={onNextClick}>
        Začít odpovídat
      </Button>
    </NavigationCard>
  );
}
