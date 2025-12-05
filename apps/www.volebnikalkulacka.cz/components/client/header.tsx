import { AppHeader, WithCondenseOnScroll } from "@/calculator/client";
import { Layout } from "@/calculator/server";

export function Header() {
  return (
    <Layout.Header>
      <WithCondenseOnScroll>{(condensed) => <AppHeader condensed={condensed} />}</WithCondenseOnScroll>
    </Layout.Header>
  );
}
