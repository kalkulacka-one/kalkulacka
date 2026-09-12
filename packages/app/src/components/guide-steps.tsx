"use client";

// Ported from kalkulacka-2026/apps/web/components/guide-steps.tsx (+ .module.css)
import { icons } from "@kalkulacka-one/design-system/icons";
import { TutorialStep } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";

import { usePointerKind } from "@/client/hooks";

/** The gestures the practice card can tick off. Rekapitulace is a screen. */
export type PractisedGesture = "agree" | "disagree" | "important" | "skip";

/*
 * The negative `margin-top` pulls the list up against the dialog's own header
 * — its gap is sized for a two-line description above a body, not a body that
 * starts with a list item, and left alone it read as its own extra paragraph
 * break before the steps even started.
 */
const stepsClasses = "koa:flex koa:flex-col koa:gap-6 koa:-mt-3 koa:mx-0 koa:mb-0 koa:p-0 koa:list-none";

/**
 * What the flow's controls mean.
 *
 * Lives on its own so that every surface wanting this list gets the same one:
 * today the help dialog opened from the shell menu anywhere in the flow
 * (`HelpDialog`), and any second overlay that needs the same prose later.
 * Same list, same order, one definition.
 *
 * It says nothing about what the reader has already tried. It used to tick off
 * the gestures practised on the card behind it, which turned reference prose
 * into a scoreboard — and a scoreboard is precisely wrong for the surface
 * someone opens *because they are stuck*, where a row marked "Vyzkoušeno" is
 * the row they came to re-read. Discovery is shown where it is happening, on
 * the card's own arrows.
 *
 * The wording follows the pointer: a finger is told to drag and tap, a mouse is
 * told about the keys and to click.
 */
export function GuideSteps() {
  const t = useTranslations("koa.components.guideSteps");
  const pointer = usePointerKind();
  const touch = pointer === "touch";

  return (
    <ul className={stepsClasses}>
      <TutorialStep icon={icons.arrowLeft} title={t("agreeTitle")} description={touch ? t("agreeDescriptionTouch") : t("agreeDescriptionPointer")} />
      <TutorialStep icon={icons.arrowRight} title={t("disagreeTitle")} description={touch ? t("disagreeDescriptionTouch") : t("disagreeDescriptionPointer")} />
      <TutorialStep icon={icons.starThin} title={t("importantTitle")} description={touch ? t("importantDescriptionTouch") : t("importantDescriptionPointer")} />
      <TutorialStep icon={icons.arrowDown} title={t("skipTitle")} description={touch ? t("skipDescriptionTouch") : t("skipDescriptionPointer")} />
      <TutorialStep icon={icons.results} title={t("recapTitle")} description={t("recapDescription")} />
    </ul>
  );
}
