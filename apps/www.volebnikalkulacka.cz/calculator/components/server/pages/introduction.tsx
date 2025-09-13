import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import { HideOnEmbed } from "../../../../components/client";
import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader, AppHeaderBottom, AppHeaderBottomMain, AppHeaderMain, AppHeaderRight } from "../../client";
import { Introduction, IntroductionNavigationCard, LayoutBottomNavigation, LayoutContent, LayoutHeader } from "../components";

export type IntroductionPage = {
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onCloseClick: () => void;
  isEmbed?: boolean;
};

export function IntroductionPage({ calculator, onNextClick, onCloseClick, isEmbed }: IntroductionPage) {
  const title = "Volební kalkulačka";
  let secondaryTitle: string | undefined = calculator?.shortTitle;
  let tertiaryTitle: string | undefined = "Sněmovní 2025";
  if (!calculator?.shortTitle) {
    secondaryTitle = "Sněmovní 2025";
    tertiaryTitle = undefined;
  }

  return (
    <>
      <LayoutHeader>
        <AppHeader logoTitle={title}>
          <AppHeaderMain title={title} secondaryTitle={secondaryTitle} tertiaryTitle={tertiaryTitle} />
          <AppHeaderRight>
            <HideOnEmbed>
              <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </HideOnEmbed>
          </AppHeaderRight>
          <AppHeaderBottom>
            <AppHeaderBottomMain>
              <h2 className="font-display font-semibold text-3xl">{calculator?.shortTitle || "Sněmovní 2025"}</h2>
            </AppHeaderBottomMain>
          </AppHeaderBottom>
        </AppHeader>
      </LayoutHeader>
      <LayoutContent>
        <Introduction calculator={calculator} />
      </LayoutContent>
      <LayoutBottomNavigation>
        <IntroductionNavigationCard onNextClick={onNextClick} attribution={isEmbed} />
      </LayoutBottomNavigation>
    </>
  );
}
