import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import { HideOnEmbed } from "../../../../components/client";
import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader, AppHeaderBottom, AppHeaderBottomLeft, AppHeaderBottomMain, AppHeaderMain, AppHeaderRight } from "../../client";
import { Guide, GuideNavigationCard, LayoutBottomNavigation, LayoutContent, LayoutHeader } from "../components";

export type GuidePage = {
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onBackClick: () => void;
  onCloseClick: () => void;
  isEmbed?: boolean;
};

export function GuidePage({ calculator, onNextClick, onBackClick, onCloseClick, isEmbed }: GuidePage) {
  const title = "Volební kalkulačka";

  return (
    <>
      <LayoutHeader>
        <AppHeader logoTitle={title}>
          <AppHeaderMain title={title} calculator={calculator} />
          <AppHeaderRight>
            <HideOnEmbed>
              <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </HideOnEmbed>
          </AppHeaderRight>
          <AppHeaderBottom>
            <AppHeaderBottomLeft condensed={false}>
              <Button variant="link" color="neutral" size="small" onClick={onBackClick} aria-label="Zpět na úvod">
                <Icon icon={mdiArrowLeft} size="medium" decorative />
              </Button>
            </AppHeaderBottomLeft>
            <AppHeaderBottomMain condensed={false}>
              <h3 className="font-display font-semibold text-3xl">Návod</h3>
            </AppHeaderBottomMain>
          </AppHeaderBottom>
        </AppHeader>
      </LayoutHeader>
      <LayoutContent>
        <Guide calculator={calculator} />
      </LayoutContent>
      <LayoutBottomNavigation>
        <GuideNavigationCard onNextClick={onNextClick} attribution={isEmbed} />
      </LayoutBottomNavigation>
    </>
  );
}
