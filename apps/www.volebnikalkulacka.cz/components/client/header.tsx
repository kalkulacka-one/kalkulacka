import { Layout } from "@/calculator";
import { AppHeader, WithCondenseOnScroll } from "@/calculator/client";

export function Header() {
  return (
    <Layout.Header>
      <WithCondenseOnScroll>{(condensed) => <AppHeader condensed={condensed} />}</WithCondenseOnScroll>
    </Layout.Header>
  );
}
