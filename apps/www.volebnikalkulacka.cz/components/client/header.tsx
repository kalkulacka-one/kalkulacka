import { WithCondenseOnScroll } from "../../calculator/components/client/app-header-with-scroll";
import { AppHeader, AppHeaderMain, LayoutHeader } from "../../calculator/components/server/components";

export function Header() {
  return (
    <LayoutHeader>
      <WithCondenseOnScroll>
        {(condensed) => (
          <AppHeader condensed={condensed}>
            <AppHeaderMain title="Volební kalkulačka" secondaryTitle="Sněmovní volby 2025" />
          </AppHeader>
        )}
      </WithCondenseOnScroll>
    </LayoutHeader>
  );
}
