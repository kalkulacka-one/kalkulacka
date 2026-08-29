import { AppHeader, AppHeaderRight, WithCondenseOnScroll } from "../../calculator/components/client";
import { Layout } from "../../calculator/components/server/components";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  return (
    <Layout.Header>
      <WithCondenseOnScroll>
        {(condensed) => (
          <AppHeader condensed={condensed}>
            <AppHeaderRight>
              <LanguageSwitcher />
            </AppHeaderRight>
          </AppHeader>
        )}
      </WithCondenseOnScroll>
    </Layout.Header>
  );
}
