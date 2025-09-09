import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import type { CalculatorViewModel, ResultViewModel } from "../../../view-models";
import { AppHeader, AppHeaderBottomMain, AppHeaderLeft, AppHeaderMain, AppHeaderRight } from "../../client";
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
          <AppHeaderLeft>
            <Button variant="link" color="neutral" size="small" aria-label="Go back" onClick={onPreviousClick}>
              <Icon icon={mdiArrowLeft} size="medium" decorative />
            </Button>
          </AppHeaderLeft>
          <AppHeaderMain />
          <AppHeaderRight>
            <Button variant="link" color="neutral" size="small" aria-label="Close">
              <Icon icon={mdiClose} size="medium" decorative />
            </Button>
          </AppHeaderRight>
          <AppHeaderBottomMain>Výsledek</AppHeaderBottomMain>
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
