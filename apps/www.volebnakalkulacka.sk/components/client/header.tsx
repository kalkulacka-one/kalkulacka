import { Layout } from "@kalkulacka-one/app";
import { AppHeader, WithCondenseOnScroll } from "@kalkulacka-one/app/client";

export function Header() {
  return (
    <Layout.Header>
      <WithCondenseOnScroll>{(condensed) => <AppHeader condensed={condensed} />}</WithCondenseOnScroll>
    </Layout.Header>
  );
}
