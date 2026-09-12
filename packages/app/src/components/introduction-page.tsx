"use client";

// Ported from kalkulacka-2026/apps/web/components/calculator-intro.tsx (+ .module.css) and intro-facts.tsx (+ .module.css)
import { Button } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AppHeader, Screen, StickyBar, TutorialStep } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { countAnswered, firstUnansweredIndex } from "@/answers";
import { useAnswersStore } from "@/client/stores";
import { useQuestions } from "@/client/view-models";

import { EditorialMarkdown } from "./editorial-markdown";
import { RestartDialog } from "./restart-dialog";

/** Where a returning visitor picks up: the first unvisited question (1-based), or the recap once every question was visited. */
export type IntroductionResumeTarget = { question: number } | { review: true };

export type IntroductionPage = {
  /** The header wordmark text, e.g. "Volební kalkulačka" — the product name, owned by the app. */
  appTitle: string;
  /** The election's display name, e.g. "Sněmovní volby 2025". */
  electionName?: string;
  /** The calculator's display name — the screen's `h1` and the header's subtitle. */
  calculatorName: string;
  candidateCount: number;
  /** Optional editorial markdown from the calculator data, rendered under the facts. */
  intro?: string;
  /** Right side of the header: today the app's close button, later the menu. */
  headerActions?: ReactNode;
  /** Embeds: makes the wordmark an outbound link to the full site. */
  attributionHref?: string;
  logoMonochrome?: boolean;
  /** A fresh visitor starts — the app takes them to the guide. */
  onContinueClick: () => void;
  /** A returning visitor resumes where they left off. */
  onResumeClick: (target: IntroductionResumeTarget) => void;
  /**
   * A returning visitor confirmed "Začít znovu" — the app clears the answers
   * and takes them to the first question, the same way the shell menu's
   * restart does.
   */
  onRestartClick: () => void;
};

/**
 * The calculator's front door: what this is, what happens to your answers, and
 * — for anyone coming back — where you left off.
 *
 * Answers arrive from the app's session loader, so someone returning to a
 * half-finished calculator lands on the question they stopped at rather than
 * being sent back to question 1.
 *
 * The 2026 screen briefly redirected first-timers straight to the guide, on
 * the grounds that a name and a "Začít" button is not worth a tap. That was
 * treating the symptom: the screen was thin, not redundant. It now carries
 * `IntroFacts`, and the two screens divide the onboarding cleanly — this one
 * explains what the calculator *does* with an answer, the guide teaches how to
 * *give* one.
 *
 * A returner also gets "Začít znovu" beside the way back in: it asks first,
 * through the same `RestartDialog` the shell menu uses, so the one destructive
 * action in the app is worded the same wherever it is reached from.
 */
export function IntroductionPage({
  appTitle,
  electionName,
  calculatorName,
  candidateCount,
  intro,
  headerActions,
  attributionHref,
  logoMonochrome,
  onContinueClick,
  onResumeClick,
  onRestartClick,
}: IntroductionPage) {
  const t = useTranslations("koa.components.introductionPage");
  const { questions, total } = useQuestions();
  const answers = useAnswersStore((state) => state.answers);
  const [confirmingRestart, setConfirmingRestart] = useState(false);

  // Derived once per render from the store, so the primary action does not
  // change its mind from "Pokračovat" to "Pokračovat v odpovídání" mid-render.
  const answered = countAnswered(questions, answers);
  const inProgress = answered > 0;

  // -1 once every question has been visited; that's the recap's cue.
  const nextIndex = firstUnansweredIndex(questions, answers);
  const resumeTarget: IntroductionResumeTarget = nextIndex === -1 ? { review: true } : { question: nextIndex + 1 };

  return (
    <Screen
      header={<AppHeader title={appTitle} electionName={electionName} calculatorName={calculatorName} href={attributionHref} logoMonochrome={logoMonochrome} actions={headerActions} />}
      title={calculatorName}
      /* No privacy clause here, by request. "Nikam se nic neposílá" predated
         server sessions and became untrue with a backend configured; the
         honest replacement read as a warning that something gets saved —
         scarier than saying nothing. The reader deciding whether to start
         does not care; the leave dialog still reassures where it matters. */
      description={t("description", { count: total })}
      footer={
        <StickyBar>
          {inProgress ? (
            <>
              {/*
                `plate`, not `ghost`: this button floats directly over the
                backdrop with no container behind it (`StickyBar` has no
                panel), and `ghost`'s transparent background needs one to read
                against. `plate` is the variant built for exactly this — the
                back link, the share action, the shell's menu trigger. First
                in the DOM as the secondary action; `StickyBar` puts the
                primary one on top when the pair stacks.
              */}
              <Button variant="plate" size="large" onClick={() => setConfirmingRestart(true)}>
                {t("restart")}
              </Button>
              <Button variant="solid" color="neutral" size="large" onClick={() => onResumeClick(resumeTarget)}>
                {t("continue")}
              </Button>
            </>
          ) : (
            <Button variant="solid" color="neutral" size="large" onClick={onContinueClick}>
              {t("start")}
            </Button>
          )}
        </StickyBar>
      }
    >
      <p className="koa:m-0 koa:text-base koa:leading-[1.55] koa:text-(--ko-color-text-muted)">{t("candidates", { count: candidateCount })}</p>

      {inProgress ? (
        <p className="koa:m-0 koa:p-4 koa:rounded-(--ko-radius-control) koa:bg-(--ko-color-surface) koa:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)] koa:text-[0.9375rem] koa:font-semibold koa:text-(--ko-color-text-strong)">
          {t("progress", { answered, total })}
        </p>
      ) : null}

      {/*
        What answering actually does, for the reader deciding whether to start.
        The screen used to be a name and a button, which is what made merging it
        into the tutorial tempting; the fix was to give it something to say
        rather than to delete it. Deliberately not the gestures — those are the
        next screen's whole job, and a reader who has to be taught to swipe
        twice has been taught nothing the second time.
      */}
      <IntroFacts />

      {intro ? <EditorialMarkdown>{intro}</EditorialMarkdown> : null}

      <RestartDialog
        open={confirmingRestart}
        onClose={() => setConfirmingRestart(false)}
        onConfirm={() => {
          setConfirmingRestart(false);
          // Same destination as the menu's restart: cleared answers and a
          // screen still saying "Pokračovat v odpovídání" would be its own
          // small lie.
          onRestartClick();
        }}
      />
    </Screen>
  );
}

/**
 * What the calculator does with an answer, before anyone gives one.
 *
 * The split with the guide's steps is deliberate and is the whole reason the
 * onboarding is two screens rather than one: this list is about *consequences*
 * — a starred question counts double, a skipped one counts for nothing, and
 * nothing is final until the recap — while the tutorial's list is about
 * *operation*: which way to drag, which key to press. Someone deciding whether
 * to start needs the first; someone holding the card needs the second.
 *
 * So the rows here are the same three ideas the detailed guide ends its
 * descriptions with, lifted out and given the screen to themselves, with the
 * gesture clause that carried them dropped. Nothing here mentions a direction,
 * a key or a tap, which is what keeps it from being a tutorial the reader has
 * to sit through twice.
 *
 * Same rhythm as the guide's steps, one step tighter: those rows carry a
 * two-clause instruction each and need the air, these carry a single fact.
 * The negative `margin-top` pulls the list up against `Screen`'s own
 * description paragraph above it — that gap is sized for a page whose next
 * thing is a heading or a card, not a list item, and left alone it read as
 * its own extra paragraph break before the facts even started.
 */
function IntroFacts() {
  const t = useTranslations("koa.components.introductionPage");

  return (
    <ul className="koa:flex koa:flex-col koa:gap-4 koa:-mt-3 koa:mx-0 koa:mb-0 koa:p-0 koa:list-none">
      <TutorialStep icon={icons.starThin} title={t("factImportantTitle")} description={t("factImportantDescription")} />
      <TutorialStep icon={icons.neutral} title={t("factSkipTitle")} description={t("factSkipDescription")} />
      <TutorialStep icon={icons.results} title={t("factRecapTitle")} description={t("factRecapDescription")} />
    </ul>
  );
}
