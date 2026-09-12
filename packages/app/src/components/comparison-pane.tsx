"use client";

// Ported from kalkulacka-2026/apps/web/components/comparison-pane.tsx (+ comparison-pane.module.css — the box's
// sheet/column presentations live in the design system's `styles.css` as `.ko-comparison-pane`).
import { ComparisonList, type ComparisonRow, FilterChips, IconButton } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";

import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { answerTone } from "@/answers";
import { useDragDismiss } from "@/client/hooks";
import { useAnswersStore, useCalculatorStore } from "@/client/stores";
import { useQuestions } from "@/client/view-models";
import { type CandidateMatchViewModel, getCandidateAnswerComparison } from "@/view-models";

/** Matches the closing animation's duration in the CSS (`--ko-duration-base`). */
export const CLOSE_MS = 150;

type ComparisonFilter = "all" | "match" | "mismatch" | "important";

/** How the user's answer and the candidate's relate on one question. */
type Agreement = "match" | "mismatch" | "none";

export type ComparisonPane = {
  /** The ranked list, so the pane can still find a candidate that is on its way out. */
  matches: CandidateMatchViewModel[];
  /** Whose comparison is open. `undefined` means the pane shows `children` instead. */
  selectedId: string | undefined;
  /** Asks the owner to clear `selectedId`. The exit animation is this pane's business. */
  onClose: () => void;
  /** "74 %", the way the active locale writes it — number formatting is locale work, so it happens above. */
  formatPercent: (value: number) => string;
  /** What the pane holds when nothing is selected — the insight dashboard. */
  children: ReactNode;
};

/**
 * Ported from `agreementOf` in kalkulacka-2026/packages/core/src/matching/results.ts.
 *
 * A neutral on either side is a real answer that simply carries no direction,
 * so it is neither a match nor a mismatch — and neither is a question one side
 * never answered.
 */
function agreementOf(user: boolean | null | undefined, candidate: boolean | null | undefined): Agreement {
  if (user === undefined || candidate === undefined) return "none";
  if (user === null || candidate === null) return "none";
  return user === candidate ? "match" : "mismatch";
}

const headClasses = "koa:flex-none koa:flex koa:items-start koa:justify-between koa:gap-4 koa:px-6 koa:py-4";
const headingClasses = "koa:min-w-0";

/*
 * Focus lands here when a comparison opens (see below), so the ring has to be
 * spelled out both ways rather than left to the UA: silent for the mouse click
 * that put it here — nothing on screen changes for someone who never left the
 * pointer — and drawn for the keyboard press that did, which is the reader
 * who needs to see where they were taken.
 */
const titleClasses = [
  "koa:m-0 koa:font-(family-name:--ko-font-sans) koa:text-base koa:font-semibold koa:leading-[1.3] koa:tracking-[-0.01em] koa:text-(--ko-color-text-strong)",
  "koa:focus:outline-none koa:focus-visible:outline-3 koa:focus-visible:outline-offset-2 koa:focus-visible:outline-(--ko-color-focus)/55",
].join(" ");

/*
 * Not the accent: the bar on the row behind this pane already spends that
 * colour on the same number, and repeating it here made the heading compete
 * with the ranking rather than label it.
 */
const percentClasses = "koa:m-0 koa:mt-0.5 koa:font-(family-name:--ko-font-display) koa:text-2xl koa:font-bold koa:tracking-[-0.01em] koa:text-(--ko-color-text-strong) koa:tabular-nums";

/* Matches `ComparisonList`'s own inset (1.5rem) so the chips line up with the
   statements and marks scrolling beneath them. */
const filtersClasses = "koa:flex-none koa:px-6 koa:pb-3";

/*
 * The grab handle. Phone only — on a desktop the pane is a column, not a sheet,
 * and there is nothing to drag it away from. `touch-none` claims the vertical
 * gesture from the browser so a drag doesn't also scroll.
 */
const gripClasses = [
  "ko-comparison-pane-grip koa:flex-none koa:flex koa:items-center koa:justify-center koa:pt-3 koa:pb-2 koa:touch-none koa:cursor-grab koa:active:cursor-grabbing koa:lg:hidden",
  "koa:before:content-[''] koa:before:w-10 koa:before:h-1 koa:before:rounded-full koa:before:bg-(--ko-color-border-strong)",
].join(" ");

/**
 * One candidate's answers against the reader's own — and, when nothing is
 * picked, whatever the caller puts in the same box.
 *
 * The pane owns its own exit: `selectedId` clearing is the *start* of closing,
 * not the end of it, so the comparison has to keep rendering for a beat after
 * the owner has already forgotten about it.
 *
 * The rows come from the platform's own `getCandidateAnswerComparison` — the
 * same per-candidate reading the legacy comparison used — narrowed to the
 * questions the reader actually answered: a question they skipped says nothing
 * about either side, and listing it would pad the comparison with rows that
 * carry no information.
 */
export function ComparisonPane({ matches, selectedId, onClose, formatPercent, children }: ComparisonPane) {
  const t = useTranslations("koa.components.comparisonPane");

  const answers = useAnswersStore((state) => state.answers);
  const candidatesAnswers = useCalculatorStore((state) => state.data.candidatesAnswers);
  const { questions } = useQuestions();

  /**
   * Set for the duration of the close animation only — the comparison for
   * this id keeps rendering (and the pane keeps its sheet/popover styling)
   * after `selectedId` clears, so there is something to animate out instead
   * of the dashboard just appearing underneath it.
   */
  const [closingId, setClosingId] = useState<string | undefined>(undefined);
  /** Which of a comparison's rows are shown — reset whenever a different candidate opens. */
  const [comparisonFilter, setComparisonFilter] = useState<ComparisonFilter>("all");

  /*
   * The button/Escape route: play the pane's exit animation, then swap to the
   * dashboard once it's finished. A drag dismissal skips this entirely — see
   * `dismissDrag` below — because `useDragDismiss` has already animated the
   * sheet away by the time it calls its own callback.
   */
  const closeComparison = useCallback(() => {
    if (selectedId !== undefined) setClosingId(selectedId);
    onClose();
  }, [selectedId, onClose]);

  const dismissDrag = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (closingId === undefined) return;
    const timer = window.setTimeout(() => setClosingId(undefined), CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [closingId]);

  /*
   * Escape, the third route out — the close button covers the pointer, the
   * grip covers a finger. Handled explicitly rather than left to anything
   * native: this is a `<section>`, not a `<dialog>`, so there is no built-in
   * dismissal to inherit, and `dialog.tsx` documents why even the real
   * element's own Escape is not trusted in this codebase.
   *
   * On `window` rather than the section, because on a desktop the pane is a
   * column beside the ranking and the reader may well still be in the list —
   * but skipped while a modal is up. The share, help, restart and leave sheets
   * all sit over this pane, and dismissing the comparison underneath one would
   * be answering a key that was aimed somewhere else.
   */
  useEffect(() => {
    if (selectedId === undefined) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (document.querySelector("dialog[open]")) return;
      event.preventDefault();
      closeComparison();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, closeComparison]);

  /**
   * Where focus goes when the comparison closes — the row that opened it.
   *
   * Without this the close button is simply unmounted out from under the
   * caret and focus falls to `<body>`, which on a ranking of nine candidates
   * means tabbing back down from the top of the page to reach the next one.
   */
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasOpenRef = useRef(false);
  const headingId = useId();

  useEffect(() => {
    const open = selectedId !== undefined;

    if (open) {
      // Only on the way in: picking a second candidate while the first is
      // still open must not record the first's close button as the way back.
      if (!wasOpenRef.current) {
        const active = document.activeElement;
        returnFocusRef.current = active instanceof HTMLElement ? active : null;
      }
      // The name of whose comparison this is, which is the one thing a reader
      // needs told before the 42 rows underneath it.
      headingRef.current?.focus();
    } else if (wasOpenRef.current) {
      returnFocusRef.current?.focus();
      returnFocusRef.current = null;
    }

    wasOpenRef.current = open;
  }, [selectedId]);

  const { sheetRef, handleProps, dragging } = useDragDismiss({
    open: selectedId !== undefined,
    onDismiss: dismissDrag,
  });

  /** The comparison rendered in the pane — kept alive through `closingId` so it has something to animate out with. */
  const shownId = selectedId ?? closingId;

  /*
   * Only *closing* while nothing is selected. Picking a row while another
   * comparison is still on its way out cuts the exit short — the new one is
   * what's on screen now, so there is nothing left to animate out. Derived
   * rather than cleared by hand at the moment of selection, which keeps the
   * rule in one place and out of the owner's select handler.
   */
  const closing = selectedId === undefined && closingId !== undefined;

  const selected = useMemo(() => matches.find((entry) => entry.candidate.id === shownId), [matches, shownId]);

  /**
   * How an answer reads aloud — the accessible name behind a mark. The mark is
   * a bare coloured circle, so this string *is* the answer as far as a screen
   * reader is concerned; the tone that draws it is `answerTone`'s, and this is
   * its counterpart for the words — the same four the recap rows use.
   */
  const answerLabel = useCallback(
    (tone: ReturnType<typeof answerTone>) => {
      if (tone === "agree") return t("yes");
      if (tone === "disagree") return t("no");
      if (tone === "neutral") return t("neutral");
      return t("none");
    },
    [t],
  );

  const comparison = useMemo(() => {
    if (!selected) return undefined;

    return getCandidateAnswerComparison(selected.candidate.id, answers, candidatesAnswers, questions)
      .filter((entry) => entry.userAnswer !== undefined)
      .map((entry) => {
        const userTone = answerTone({ questionId: entry.questionId, answer: entry.userAnswer });
        const candidateTone = answerTone({ questionId: entry.questionId, answer: entry.candidateAnswer });

        return {
          row: {
            id: entry.questionId,
            statement: entry.questionText ?? "",
            user: { tone: userTone, label: answerLabel(userTone) },
            candidate: { tone: candidateTone, label: answerLabel(candidateTone) },
            important: entry.isImportant === true,
            ...(entry.candidateComment ? { comment: entry.candidateComment } : {}),
          } satisfies ComparisonRow,
          agreement: agreementOf(entry.userAnswer, entry.candidateAnswer),
        };
      });
  }, [selected, answers, candidatesAnswers, questions, answerLabel]);

  /*
   * Starting over on the filter every time a different comparison opens, so a
   * "Neshody" pick made on one candidate can't silently hide rows on the next.
   *
   * `shownId` is the effect's *trigger*, not an input it reads — which is why
   * the exhaustive-deps rule reads it as surplus and offers to delete it. Taking
   * that fix would leave an empty dependency array, resetting the filter once on
   * mount and never again. The suppression below has to stay a single line and
   * sit directly on the hook: Biome only parses the first line of a `//` run as
   * the suppression, so a wrapped one silently detaches and stops working.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: the dep is the reset trigger, not an input.
  useEffect(() => {
    setComparisonFilter("all");
  }, [shownId]);

  const comparisonCounts = useMemo(() => {
    const counts = { all: 0, match: 0, mismatch: 0, important: 0 };
    for (const entry of comparison ?? []) {
      counts.all += 1;
      if (entry.agreement === "match") counts.match += 1;
      else if (entry.agreement === "mismatch") counts.mismatch += 1;
      if (entry.row.important) counts.important += 1;
    }
    return counts;
  }, [comparison]);

  // Only offered when they would leave something — same rule the recap's own
  // filter chips follow for "Přeskočené" and "Důležité".
  const comparisonFilterOptions = [
    { id: "all" as const, label: t("filterAll"), count: comparisonCounts.all },
    ...(comparisonCounts.match > 0 ? [{ id: "match" as const, label: t("filterMatches"), count: comparisonCounts.match }] : []),
    ...(comparisonCounts.mismatch > 0 ? [{ id: "mismatch" as const, label: t("filterMismatches"), count: comparisonCounts.mismatch }] : []),
    ...(comparisonCounts.important > 0 ? [{ id: "important" as const, label: t("filterImportant"), count: comparisonCounts.important }] : []),
  ];

  const visibleRows = useMemo(() => {
    if (!comparison) return [];
    if (comparisonFilter === "all") return comparison.map((entry) => entry.row);
    if (comparisonFilter === "important") return comparison.filter((entry) => entry.row.important).map((entry) => entry.row);
    return comparison.filter((entry) => entry.agreement === comparisonFilter).map((entry) => entry.row);
  }, [comparison, comparisonFilter]);

  return (
    /*
      One element, two presentations: the right-hand pane on a desktop, and
      a bottom sheet over the list on a phone once something is open (see
      `.ko-comparison-pane` in the design system's `styles.css`). Rendering it
      twice — once per breakpoint — is how the scroll position and the filter's
      state end up differing between the two.
    */
    <section
      ref={sheetRef}
      className="ko-comparison-pane"
      /* A named region only while it holds a comparison — with the dashboard
         in it there is no one heading that describes the box, and a landmark
         called nothing in particular is one more stop to skip past. */
      aria-labelledby={selected && comparison ? headingId : undefined}
      data-open={selected ? "" : undefined}
      data-closing={closing ? "" : undefined}
      data-dragging={dragging ? "" : undefined}
    >
      {selected && comparison ? (
        <>
          {/*
            Phone only (hidden from `lg`): drag it down to put the sheet away.
            The close button beside it is the keyboard and assistive-tech
            route; this is a pointer affordance layered on top.
          */}
          <div className={gripClasses} {...handleProps} aria-hidden="true" />
          <div className={headClasses}>
            <div className={headingClasses}>
              {/* `tabIndex={-1}` is not a tab stop — it only makes the
                  heading a legal target for the focus move above, so opening
                  a comparison lands the reader on whose it is. The short name,
                  as the column heading below: the row behind this sheet
                  already carries the full one. */}
              <h2 ref={headingRef} id={headingId} className={titleClasses} tabIndex={-1}>
                {selected.candidate.name}
              </h2>
              {selected.match !== undefined ? <p className={percentClasses}>{formatPercent(selected.match)}</p> : null}
            </div>

            <IconButton icon={icons.close} label={t("close")} onClick={closeComparison} />
          </div>

          {comparisonCounts.match > 0 || comparisonCounts.mismatch > 0 || comparisonCounts.important > 0 ? (
            <div className={filtersClasses}>
              <FilterChips label={t("filterLabel")} options={comparisonFilterOptions} value={comparisonFilter} onChange={(id) => setComparisonFilter(id as ComparisonFilter)} />
            </div>
          ) : null}

          <div className="ko-comparison-pane-body">
            <ComparisonList
              rows={visibleRows}
              labels={{
                you: t("you"),
                candidate: selected.candidate.shortName,
                important: t("important"),
              }}
              resetKey={comparisonFilter}
            />
          </div>
        </>
      ) : (
        <div className="ko-comparison-pane-body">{children}</div>
      )}
    </section>
  );
}
