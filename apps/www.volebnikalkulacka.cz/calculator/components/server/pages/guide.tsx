import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import { HideOnEmbed } from "../../../../components/client";
import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader } from "../../client";
import { Guide, GuideNavigationCard, LayoutBottomNavigation, LayoutContent, LayoutHeader } from "../components";

export type GuidePage = {
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onBackClick: () => void;
  onCloseClick: () => void;
  attribution?: boolean;
};

export function GuidePage({ calculator, onNextClick, onBackClick, onCloseClick, attribution }: GuidePage) {
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
            <AppHeader.BottomLeft condensed={false}>
              <Button variant="link" color="neutral" size="small" onClick={onBackClick} aria-label="Zpět na úvod">
                <Icon icon={mdiArrowLeft} size="medium" decorative />
              </Button>
            </AppHeader.BottomLeft>
            <AppHeader.BottomMain condensed={false}>
              <h3 className="font-display font-semibold text-2xl tracking-tight text-slate-700">Návod</h3>
            </AppHeader.BottomMain>
          </AppHeader.Bottom>
        </AppHeader>
      </LayoutHeader>
      <LayoutContent>
        <Guide calculator={calculator} />
      </LayoutContent>
      <LayoutBottomNavigation spacer={attribution ? "8rem" : "5rem"}>
        <GuideNavigationCard onNextClick={onNextClick} attribution={attribution} />
      </LayoutBottomNavigation>
    </>
  );
}
