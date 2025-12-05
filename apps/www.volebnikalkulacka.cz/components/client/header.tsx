import { WithCondenseOnScroll } from "@kalkulacka-one/app/client";
import { Layout } from "@kalkulacka-one/app/server";

import { AppHeader } from "@/calculator/client";

export function Header() {
  return (
    <Layout.Header>
      <WithCondenseOnScroll>{(condensed) => <AppHeader condensed={condensed} />}</WithCondenseOnScroll>
    </Layout.Header>
  );
}
