import { AppHeader, AppHeaderMain, WithCondenseOnScroll } from "../../calculator/components/client";
import { LayoutHeader } from "../../calculator/components/server/components";

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
