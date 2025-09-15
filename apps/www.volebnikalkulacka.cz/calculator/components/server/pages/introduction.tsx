import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import { HideOnEmbed } from "../../../../components/client";
import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader } from "../../client";
import { Introduction, IntroductionNavigationCard, LayoutBottomNavigation, LayoutContent, LayoutHeader } from "../components";

export type IntroductionPage = {
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onCloseClick: () => void;
  attribution?: boolean;
};

export function IntroductionPage({ calculator, onNextClick, onCloseClick, attribution }: IntroductionPage) {
  return (
    <>
      <LayoutHeader>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <HideOnEmbed>
              <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </HideOnEmbed>
          </AppHeader.Right>
          <AppHeader.Bottom>
            <AppHeader.BottomMain>
              <h2 className="font-display font-semibold text-2xl tracking-tight text-slate-700">{calculator?.shortTitle || "Sněmovní 2025"}</h2>
            </AppHeader.BottomMain>
          </AppHeader.Bottom>
        </AppHeader>
      </LayoutHeader>
      <LayoutContent>
        <Introduction calculator={calculator} />
      </LayoutContent>
      <LayoutBottomNavigation spacer="5rem">
        <IntroductionNavigationCard onNextClick={onNextClick} />
      </LayoutBottomNavigation>
    </>
  );
}
