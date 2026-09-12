import { AppHeader } from "./app-header";
import { WithCondenseOnScroll } from "./app-header-with-scroll";

/*
 * The header of the content pages (homepage, methodology, …). This is the
 * retired calculator header — the ported calculator screens draw their own
 * through the design system's `AppHeader` — kept only for these pages, which
 * the port did not touch. The sticky wrapper is what the retired `Layout.Header`
 * used to render around it.
 */
export function Header() {
  return (
    <div className="sticky top-0 z-50">
      <WithCondenseOnScroll>{(condensed) => <AppHeader condensed={condensed} />}</WithCondenseOnScroll>
    </div>
  );
}
