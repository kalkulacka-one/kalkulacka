import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import type { CalculatorViewModel, ResultViewModel } from "../../../view-models";
import { WithCondenseOnScroll } from "../../client/app-header-with-scroll";
import { AppHeader, AppHeaderBottom, AppHeaderBottomLeft, AppHeaderBottomMain, AppHeaderMain, AppHeaderRight, LayoutContent, LayoutHeader, MatchCard } from "../components";

export type ResultPage = {
  result: ResultViewModel;
  calculator: CalculatorViewModel;
  onPreviousClick: () => void;
  onCloseClick: () => void;
};

export function ResultPage({ result, calculator, onPreviousClick, onCloseClick }: ResultPage) {
  return (
    <>
      <LayoutHeader>
        <WithCondenseOnScroll>
          {(condensed) => (
            <AppHeader condensed={condensed}>
              <AppHeaderMain title="Volební kalkulačka" secondaryTitle={calculator?.shortTitle} tertiaryTitle="Sněmovní volby 2025" />
              <AppHeaderRight>
                <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                  <Icon icon={mdiClose} size="medium" decorative />
                </Button>
              </AppHeaderRight>
              <AppHeaderBottom>
                <AppHeaderBottomLeft condensed={condensed}>
                  <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label="Back">
                    <Icon icon={mdiArrowLeft} size="medium" decorative />
                  </Button>
                </AppHeaderBottomLeft>
                <AppHeaderBottomMain condensed={condensed}>
                  <h3 className="ko:font-display font-semibold text-3xl">Výsledek</h3>
                </AppHeaderBottomMain>
              </AppHeaderBottom>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </LayoutHeader>
      <LayoutContent>
        {result.matches.map((match) => (
          <MatchCard key={match.candidate.id} candidate={match.candidate} order={match.order} match={match.match} />
        ))}
      </LayoutContent>
    </>
  );
}
