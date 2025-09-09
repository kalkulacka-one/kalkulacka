import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import type { CalculatorViewModel, ResultViewModel } from "../../../view-models";
import { AppHeader, AppHeaderMain, AppHeaderRight, AppHeaderBottomMain } from "../../client";
import { LayoutHeader, MatchCard } from "../components";

export type ResultPage = {
  result: ResultViewModel;
  calculator?: CalculatorViewModel;
  onPreviousClick: () => void;
};

export function ResultPage({ result, calculator, onPreviousClick }: ResultPage) {
  return (
    <>
      <LayoutHeader>
        <AppHeader>
          <AppHeaderMain />
          <AppHeaderRight>
            <Button variant="link" color="neutral" size="small" aria-label="Close">
              <Icon icon={mdiClose} size="medium" decorative />
            </Button>
          </AppHeaderRight>
          <AppHeaderBottomMain>
            Výsledek
          </AppHeaderBottomMain>
        </AppHeader>
      </LayoutHeader>
      <div className="grid gap-4">
        {result.matches.map((match) => (
          <MatchCard key={match.candidate.id} candidate={match.candidate} order={match.order} match={match.match} />
        ))}
      </div>
    </>
  );
}
