import { AppHeader, AppHeaderMain, WithCondenseOnScroll } from "../../calculator/components/client";
import { LayoutHeader } from "../../calculator/components/server/components";

export function Header() {
  return (
    <LayoutHeader>
      <WithCondenseOnScroll>
        {(condensed) => (
          <AppHeader condensed={condensed} logoTitle="Volební kalkulačka">
            <AppHeaderMain title="Volební kalkulačka" />
          </AppHeader>
        )}
      </WithCondenseOnScroll>
    </LayoutHeader>
  );
}
