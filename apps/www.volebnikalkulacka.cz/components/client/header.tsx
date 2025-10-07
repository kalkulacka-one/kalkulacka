import { AppHeader, WithCondenseOnScroll } from "../../calculator/components/client";
import { Layout } from "../../calculator/components/server/components";

export function Header() {
  return (
    <Layout.Header>
      <WithCondenseOnScroll>{(condensed) => <AppHeader condensed={condensed} />}</WithCondenseOnScroll>
    </Layout.Header>
  );
}
