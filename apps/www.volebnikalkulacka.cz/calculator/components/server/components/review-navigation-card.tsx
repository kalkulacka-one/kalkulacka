import { NavigationCard } from "@kalkulacka-one/app";
import { Button } from "@kalkulacka-one/design-system/client";

const HEIGHT = "h-22";

export type ReviewNavigationCard = {
  onNextClick: () => void;
};

export function ReviewNavigationCard({ onNextClick }: ReviewNavigationCard) {
  return (
    <NavigationCard>
      <Button color="neutral" onClick={onNextClick}>
        Zobrazit výsledky
      </Button>
    </NavigationCard>
  );
}

ReviewNavigationCard.heightClassNames = HEIGHT;
