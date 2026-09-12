// Ported from kalkulacka-2026/packages/ui/src/app-header/app-header.tsx and app-header.module.css
import type { ReactNode } from "react";

import { Logo } from "../client/logo";

export type AppHeader = {
  /** The product name, next to the mark. */
  title: string;
  /**
   * The election's display name, e.g. "Komunální volby 2022" — split into type
   * and year, with the type shown in the secondary colour.
   */
  electionName?: string;
  /** The chosen region/district, shown between the election type and year. */
  calculatorName?: string;
  /**
   * Makes the brand block (mark + names) a link, opened in a new tab. Used by
   * embeds, where the wordmark doubles as the attribution — the one way from a
   * partner's iframe to the full site.
   */
  href?: string;
  /** Right-hand controls. In the app, the shell menu. */
  actions?: ReactNode;
  /** Draws the mark in the text ink rather than the brand colours. */
  logoMonochrome?: boolean;
};

/**
 * Splits "Komunální volby 2022" into type ("Komunální volby") and year
 * ("2022") so the two can be styled and ordered independently.
 */
function splitElectionName(electionName: string): { type: string; year?: string } {
  const match = electionName.match(/^(.+?)\s+(\d{4}.*)$/);
  if (!match?.[1] || !match[2]) return { type: electionName };
  return { type: match[1], year: match[2] };
}

const brandClasses = "ko-app-header-brand ko:flex ko:items-center ko:gap-3.5 ko:min-w-0";

/**
 * The bar at the top of every screen.
 *
 * Lifted out of the question flow, which is the one screen that already had a
 * header worth keeping, so that the rest of the app inherits it rather than
 * each screen inventing its own. Deliberately full-bleed: it frames the page
 * instead of sitting inside the content column, which is what makes the
 * scrolling screens and the fixed flow read as the same app.
 */
export function AppHeader({ title, electionName, calculatorName, href, actions, logoMonochrome }: AppHeader) {
  const election = electionName ? splitElectionName(electionName) : undefined;

  const brandContent = (
    <>
      {/* The visible title right beside it is the name; the mark itself is decoration. */}
      <div className="ko:flex ko:flex-none ko:text-text" aria-hidden="true">
        <Logo title={title} size="xsmall" monochrome={logoMonochrome} />
      </div>
      <div className="ko:min-w-0">
        <p className="ko-app-header-title ko:text-fluid-brand ko:font-bold ko:text-text">{title}</p>
        {election ? (
          /* One line — a long city plus election name must not wrap the bar taller. */
          <p className="ko:truncate ko:text-fluid-brand ko:font-normal ko:text-text">
            <span className="ko:text-text-muted">{election.type}</span>
            {calculatorName ? <> {calculatorName}</> : null}
            {election.year ? <> {election.year}</> : null}
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <header className="ko:flex ko:flex-none ko:items-center ko:gap-4 ko:font-display ko:leading-[1.2] ko:tracking-[-0.03em]">
      {href ? (
        // A real anchor, not a router link: from inside an iframe this must
        // escape into a new tab, never navigate the embed itself away. Chrome
        // first and attribution second, so it reads as plain header until
        // pointed at — the hover underline is `.ko-app-header-brand` in
        // `styles.css`.
        <a className={`${brandClasses} ko:no-underline ko:text-inherit`} href={href} target="_blank" rel="noreferrer">
          {brandContent}
        </a>
      ) : (
        <div className={brandClasses}>{brandContent}</div>
      )}

      {actions ? <div className="ko:flex ko:items-center ko:gap-2 ko:ml-auto">{actions}</div> : null}
    </header>
  );
}
