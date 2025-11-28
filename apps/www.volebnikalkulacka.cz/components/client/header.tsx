import { WithCondenseOnScroll } from "@kalkulacka-one/app/components/client";
import { Layout } from "@kalkulacka-one/app/components/server/components";

import { AppHeader } from "@/calculator/components/client";

export function Header() {
  return (
    <Layout.Header>
      <WithCondenseOnScroll>{(condensed: boolean) => <AppHeader condensed={condensed} />}</WithCondenseOnScroll>
    </Layout.Header>
  );
}
