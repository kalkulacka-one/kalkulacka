import { Button } from "@kalkulacka-one/design-system/client";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-22";

export type ResultNavigationCard = {
  onNextClick: () => void;
  onShareClick: () => void;
};

export function ResultNavigationCard({ onNextClick, onShareClick }: ResultNavigationCard) {
  return (
    <NavigationCard>
      <div className="flex gap-2 w-full">
        <div className="flex-1">
          <Button color="neutral" variant="outline" onClick={onNextClick}>
            Porovnat
          </Button>
        </div>
        <div className="flex-1">
          <Button color="neutral" variant="fill" onClick={onShareClick}>
            Sdílet
          </Button>
        </div>
      </div>
    </NavigationCard>
  );
}

ResultNavigationCard.heightClassNames = HEIGHT;
