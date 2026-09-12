"use client";

// Ported from kalkulacka-2026/apps/web/components/guide.tsx
import { Button } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AppHeader, Screen, StickyBar } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { EditorialMarkdown } from "./editorial-markdown";
import { GuidePractice } from "./guide-practice";

export type GuidePage = {
  /** The header wordmark text, e.g. "Volební kalkulačka" — the product name, owned by the app. */
  appTitle: string;
  /** The election's display name, e.g. "Sněmovní volby 2025". */
  electionName?: string;
  /** The calculator's display name — the header's subtitle and the label of the way back. */
  calculatorName: string;
  /**
   * Optional editorial markdown from the calculator data, rendered under the
   * practice. The previous guide showed it; whether a screen about *how* to
   * answer is where the methodology belongs is the same open question as the
   * intro's optional text, so it stays optional and the Czech app does not
   * pass it.
   */
  methodology?: string;
  /** Right side of the header: today the app's close button, later the menu. */
  headerActions?: ReactNode;
  /** Embeds: makes the wordmark an outbound link to the full site. */
  attributionHref?: string;
  logoMonochrome?: boolean;
  /** The way back — the app takes the reader to the intro. */
  onBackClick: () => void;
  /** "Rozumím, začít" — the app takes the reader to the first question. */
  onStartClick: () => void;
};

/*
 * Every screen puts the way back at the top of a flex column, whose default
 * `align-items: stretch` would pull the button to the full width of the page.
 * `Button` deliberately does not accept a `className` — its appearance is the
 * design system's to decide — so the alignment lives on a wrapper rather than
 * being smuggled into the control itself.
 */
const backClasses = "koa:inline-flex koa:self-start koa:max-w-full";

/**
 * How the flow works, before the first card.
 *
 * It teaches operation and nothing else — which way to drag, which key to
 * press. What answering *means* (a star doubles the weight, a skip counts for
 * nothing, the recap can undo any of it) belongs to the intro and is said
 * there, so this screen can be the card and the hands on it.
 *
 * A button rather than a link for the way back and the start, like the intro:
 * the app owns the routes, and the guide only says where the reader wants to
 * go.
 */
export function GuidePage({ appTitle, electionName, calculatorName, methodology, headerActions, attributionHref, logoMonochrome, onBackClick, onStartClick }: GuidePage) {
  const t = useTranslations("koa.components.guidePage");

  return (
    <Screen
      header={<AppHeader title={appTitle} electionName={electionName} calculatorName={calculatorName} href={attributionHref} logoMonochrome={logoMonochrome} actions={headerActions} />}
      title={t("title")}
      description={t("description")}
      back={
        <span className={backClasses}>
          <Button variant="plate" size="small" iconStart={icons.chevronLeftThin} onClick={onBackClick}>
            {calculatorName}
          </Button>
        </span>
      }
      footer={
        <StickyBar>
          <Button variant="solid" color="neutral" size="large" onClick={onStartClick}>
            {t("start")}
          </Button>
        </StickyBar>
      }
    >
      <GuidePractice />

      {methodology ? <EditorialMarkdown>{methodology}</EditorialMarkdown> : null}
    </Screen>
  );
}
