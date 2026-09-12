"use client";

// Ported from kalkulacka-2026/apps/web/components/recap.tsx (+ recap.module.css)
import { Button, FilterChips, QuestionDialog, RecapRow } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AppHeader, EdgeFade, Shell, StickyBar } from "@kalkulacka-one/design-system/server";
import type { Answer } from "@kalkulacka-one/schema";

import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useRef, useState } from "react";

import { answersByQuestion, answerTone, hasAnswer, isSkipped } from "@/answers";
import { useAnswersStore } from "@/client/stores";
import { useQuestions, useRecapTotals } from "@/client/view-models";
import { buildRecapFilters, filterRecapQuestions, RECAP_FILTER_ALL, type RecapFilterId } from "@/recap";

import { toCardContent } from "./question-page";

export type ReviewPage = {
  /** The header wordmark text, e.g. "Volební kalkulačka" — the product name, owned by the app. */
  appTitle: string;
  /** The election's display name, e.g. "Sněmovní volby 2025". */
  electionName?: string;
  /** The calculator's display name — the header's subtitle. */
  calculatorName: string;
  /** Right side of the header: today the app's close button, later the menu. */
  headerActions?: ReactNode;
  /** Embeds: makes the wordmark an outbound link to the full site. */
  attributionHref?: string;
  logoMonochrome?: boolean;
  /** "Zpět k otázkám" — the app takes the reader to the last question, the card this screen follows. */
  onBackClick: () => void;
  /** "Zobrazit výsledky" — the app takes the reader to the result. Never called with nothing answered; the control is disabled then. */
  onShowResultsClick: () => void;
};

/*
 * The recap is a fixed composition, like the deck — not a document.
 *
 * `Screen` (the scroll-the-whole-page shell the other content screens use) is
 * deliberately not used here. This screen follows the last question directly,
 * and having the title and the primary action scroll away made the transition
 * out of the deck feel like leaving the app. So the frame holds still and the
 * list is the only thing that moves.
 *
 * On a wide screen the deck leaves room below itself on a tall viewport rather
 * than stretching to fill it (the question page's stage caps the same way);
 * the recap matches that instead of using every last pixel just because a
 * flex box will happily give it away.
 */
const screenClasses =
  "koa:flex-1 koa:min-h-0 koa:flex koa:pl-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-left,0px))] koa:pr-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-right,0px))] koa:min-[56rem]:pb-8";

/*
 * A *pinned* shell's app bar carries no bottom padding of its own — in
 * `document` mode the bar adds 0.75rem there (`.ko-shell-bar` in the design
 * system's `styles.css`), so the top padding here makes up the difference over
 * the screens' usual head clearance (1rem, 2rem from `lg`, as `Screen` has
 * it) and every screen's back link lands on the same line regardless of
 * scroll mode.
 */
const innerClasses = "koa:flex-1 koa:min-h-0 koa:flex koa:flex-col koa:gap-4 koa:w-full koa:max-w-[62rem] koa:mx-auto koa:pt-7 koa:lg:pt-11";

/*
 * Arriving from the deck, the screen assembles rather than appears: the header
 * leads, the filters and the list follow a beat later. The stagger is small on
 * purpose — this is a transition between two steps of one task, not a curtain
 * going up. The keyframes are the design system's (`--ko-animate-recap-rise`).
 */
const riseClasses = "koa:animate-(--ko-animate-recap-rise) koa:motion-reduce:animate-none";

/*
 * Collapses to just the filter row below while scrolling forward on a phone
 * (`data-collapsed`, mobile-only) — `.ko-recap-header` in the design system's
 * `styles.css` is the grid that lets that animate to and from an unknown
 * content height instead of a guessed `max-height`.
 */
const headerClasses = `ko-recap-header koa:flex-none ${riseClasses}`;
const headerInnerClasses = "koa:flex koa:flex-col koa:gap-4";

/*
 * Every screen puts the way back at the top of a flex column, whose default
 * `align-items: stretch` would pull the button to the full width of the page.
 * `Button` deliberately does not accept a `className`, so the alignment lives
 * on a wrapper — the same one the guide wears.
 */
const backClasses = "koa:inline-flex koa:self-start koa:max-w-full";

/*
 * Title and tally share a line from `wide` (56rem, the design system's "the
 * recap's two columns" breakpoint — spelled out here because the app package
 * has no named breakpoints of its own): the header stops being a stack of four
 * paragraphs and becomes one band, which is where the extra whitespace on a
 * desktop actually comes from.
 */
const headlineClasses = "koa:flex koa:flex-col koa:gap-3 koa:min-[56rem]:flex-row koa:min-[56rem]:items-end koa:min-[56rem]:justify-between koa:min-[56rem]:gap-6";
const titlesClasses = "koa:flex koa:flex-col koa:gap-2 koa:min-w-0";
const titleClasses =
  "koa:m-0 koa:font-(family-name:--ko-font-display) koa:text-(length:--ko-text-title) koa:font-bold koa:tracking-[-0.045em] koa:leading-[1.1] koa:text-(--ko-color-text) koa:text-balance";

/*
 * Wide enough for one line from `wide`. Every line the header takes is a row
 * of questions the list doesn't get, and on this screen the list is the point.
 */
const descriptionClasses = "koa:m-0 koa:max-w-[32rem] koa:min-[56rem]:max-w-[42rem] koa:text-[0.9375rem] koa:leading-[1.45] koa:text-(--ko-color-text-muted) koa:text-pretty";

/*
 * The tally sits beside the title on a wide screen rather than under it: it is
 * the answer to "am I done?", and putting it on the same line as the question
 * makes the header one statement instead of four stacked ones.
 */
const tallyClasses =
  "koa:flex koa:flex-wrap koa:items-baseline koa:gap-x-2 koa:gap-y-1 koa:m-0 koa:min-[56rem]:flex-none koa:min-[56rem]:flex-col koa:min-[56rem]:items-end koa:min-[56rem]:text-right";
const countClasses = "koa:text-[0.9375rem] koa:font-bold koa:text-(--ko-color-text-strong) koa:whitespace-nowrap";
const mutedClasses = "koa:text-sm koa:text-(--ko-color-text-muted)";

const filtersClasses = `koa:flex-none ${riseClasses} koa:[animation-delay:60ms]`;

/*
 * Everything below the filters lives in this one positioned box: the list (or
 * the empty state) fills it, the `EdgeFade` bands sit over its edges (they
 * position against this box), and the control panel floats over the bottom
 * band rather than taking a row of its own beneath it. `min-h-0` is what lets
 * it shrink inside the flex column instead of pushing past the viewport.
 */
const listShellClasses = `koa:relative koa:flex-1 koa:min-h-0 ${riseClasses} koa:[animation-delay:110ms]`;

/*
 * The scroller. The 3px of padding, pulled back with a matching negative
 * margin, is room for row focus rings, which a tight scroll box would clip;
 * the bottom padding keeps the last row clear of the floating button — it
 * tracks the action band's height.
 */
const listWrapClasses =
  "koa:absolute koa:inset-0 koa:overflow-y-auto koa:overscroll-contain koa:[-webkit-overflow-scrolling:touch] koa:scroll-smooth koa:px-[3px] koa:-mx-[3px] koa:pb-[calc(var(--ko-spacing-fade-action)-0.5rem)]";

/*
 * Two columns once there is width for them — the point is not density but
 * *less scrolling*: forty-two rows in one column is a long haul past the very
 * viewport edge this screen is trying to hold still.
 *
 * The entrance (`--ko-animate-recap-list-in`) is replayed on every filter
 * change via the `key={filter}` remount below — a new result set deserves its
 * own small entrance, not a silent swap.
 */
const listClasses = "koa:grid koa:grid-cols-1 koa:min-[56rem]:grid-cols-2 koa:gap-3 koa:m-0 koa:p-0 koa:list-none koa:animate-(--ko-animate-recap-list-in) koa:motion-reduce:animate-none";

/*
 * Clears the floating control panel the same way the list's own bottom padding
 * does, so "Zobrazit vše" never sits under "Zobrazit výsledky".
 */
const emptyClasses = "koa:absolute koa:inset-0 koa:pb-(--ko-spacing-fade-action) koa:flex koa:flex-col koa:items-center koa:justify-center koa:gap-3 koa:text-center";
const emptyTextClasses = "koa:m-0 koa:text-[0.9375rem] koa:text-(--ko-color-text-muted)";

/*
 * The control panel — floating over the bottom `EdgeFade` band rather than in
 * a row beneath it, so the list reads as continuing underneath it instead of
 * stopping to make room. Its height is the same `--ko-spacing-fade-action`
 * token the band uses, so the two stay one number by construction.
 * Bottom-aligned within the band rather than centred in it: the shell's
 * content is already sized to `100dvh`, the live-tracking edge just above the
 * browser's own chrome, so the button only needs a small margin off that
 * edge, not half the band's height. Centred horizontally on a phone; from
 * `wide` it sits under the list's own right edge, not centred beneath a
 * column-and-a-half of rows it has no relationship to. `z-3` keeps it above
 * the band (the fade paints at 2). Transparent to pointers except for the bar
 * itself, so the rows showing through the band stay reachable.
 */
const footerClasses =
  "koa:absolute koa:left-0 koa:right-0 koa:bottom-0 koa:h-(--ko-spacing-fade-action) koa:z-3 koa:flex koa:items-end koa:justify-center koa:min-[56rem]:justify-end koa:pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] koa:pointer-events-none koa:[&>*]:w-fit koa:[&>*]:pointer-events-auto";

/**
 * Every question at once — as a list you scan, not a stack you re-read.
 *
 * Two things shape this screen. First, edits go straight to the same store the
 * deck writes to, so this is a second *view* of the answers rather than a copy:
 * there is no save step and no way for the two screens to disagree. Second, the
 * screen does not scroll — only the list inside it does. The deck is a fixed,
 * balanced composition, and a recap that scrolled the title and the call to
 * action off the top made the step after it feel like a different product.
 *
 * A button rather than a link for the way back and the results, like the other
 * screens: the app owns the routes, and the recap only says where the reader
 * wants to go.
 */
export function ReviewPage({ appTitle, electionName, calculatorName, headerActions, attributionHref, logoMonochrome, onBackClick, onShowResultsClick }: ReviewPage) {
  const t = useTranslations("koa.components.reviewPage");
  const { questions } = useQuestions();
  const answers = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const { total, answered, remaining } = useRecapTotals();

  const [filter, setFilter] = useState<RecapFilterId>(RECAP_FILTER_ALL);
  /** The question the dialog is showing, as an index into `questions`. */
  const [openIndex, setOpenIndex] = useState<number | undefined>();

  /** Whether the list has been scrolled away from its top edge — drives the top fade (there's more above). */
  const [scrolled, setScrolled] = useState(false);
  /**
   * On a phone, the header (back link, title, description, tally) collapses
   * to just the filter row while scrolling forward through the list, and
   * re-expands the moment the scroll reverses — the common "toolbar hides
   * advancing, reappears on the way back" pattern, not merely "hidden until
   * you're back at the very top". `lastScrollTopRef` is what makes it
   * direction-aware rather than distance-from-top-aware.
   */
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const lastScrollTopRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    const top = el?.scrollTop ?? 0;
    setScrolled(top > 4);

    // A dead zone at *both* ends, not just the top: the elastic overscroll
    // bounce at the bottom of the list reports a few small reverse-direction
    // scroll events while it springs back, and without this a scroll that
    // simply reaches the end reads as "scrolled up" and flickers the header
    // back open for a frame before it re-collapses.
    const maxTop = el ? el.scrollHeight - el.clientHeight : 0;
    if (top <= 24) {
      setHeaderCollapsed(false);
      lastScrollTopRef.current = top;
      return;
    }
    if (top >= maxTop - 24) {
      lastScrollTopRef.current = top;
      return;
    }

    const delta = top - lastScrollTopRef.current;
    if (delta > 8) setHeaderCollapsed(true);
    else if (delta < -8) setHeaderCollapsed(false);
    lastScrollTopRef.current = top;
  }, []);

  // Which questions a filter leaves, and what each chip counts, is `@/recap`'s
  // to decide — this screen only lays the answer out.
  const options = buildRecapFilters(questions, answers, {
    all: t("filterAll"),
    unanswered: t("filterUnanswered"),
    important: t("filterImportant"),
  });

  const visible = filterRecapQuestions(questions, answers, filter);
  const lookup = answersByQuestion(answers);

  const openQuestion = openIndex === undefined ? undefined : questions[openIndex];
  const openAnswer = openQuestion ? lookup.get(openQuestion.id) : undefined;

  /**
   * How an answer reads aloud — the accessible name behind a row's mark. The
   * mark is a bare coloured circle, so this string *is* the answer as far as a
   * screen reader is concerned; the tone that draws it is `answerTone`'s, and
   * this is its counterpart for the words.
   */
  const answerLabel = (answer?: Answer) => {
    const tone = answerTone(answer);
    if (tone === "agree") return t("yes");
    if (tone === "disagree") return t("no");
    if (tone === "neutral") return t("neutral");
    return t("none");
  };

  /**
   * Toggle "pro mě důležité" — from a row's star or from the dialog. Can be
   * armed before answering, like on the deck: the flag is carried into
   * whichever answer is then given.
   */
  const toggleImportant = (questionId: string) => {
    const current = lookup.get(questionId);
    const next = !current?.isImportant;
    // Un-starring a question with no position leaves the entry as an arrival
    // would: `false` beside a missing position is the record of a skip (see
    // `isSkipped`), and a mis-tapped star must not lock the row.
    setAnswer({ questionId, isImportant: next ? true : hasAnswer(current) ? false : undefined });
  };

  const handleAnswer = (agree: boolean) => {
    if (!openQuestion) return;

    // Re-choosing the same answer clears it — an undo, not a decision — so the
    // dialog stays open to show the row's mark go empty. Same rule the deck
    // uses to decide whether an answer counts as progress. 2026 dropped the
    // entry outright; here it stays (an entry without a position is how this
    // platform records "visited"), but the flag goes with the position as it
    // did there — "important" only makes sense attached to a real one.
    const isClearing = openAnswer?.answer === agree;
    if (isClearing) {
      setAnswer({ questionId: openQuestion.id, answer: undefined, isImportant: false });
      return;
    }

    setAnswer({ questionId: openQuestion.id, answer: agree });
    setOpenIndex(undefined);
  };

  /** Explicitly skip — the position and the flag both go, as the flow's own skip does. */
  const handleSkip = () => {
    if (!openQuestion) return;
    setAnswer({ questionId: openQuestion.id, answer: undefined, isImportant: false });
    setOpenIndex(undefined);
  };

  const handleClose = useCallback(() => setOpenIndex(undefined), []);

  return (
    <Shell
      scroll="pinned"
      header={<AppHeader title={appTitle} electionName={electionName} calculatorName={calculatorName} href={attributionHref} logoMonochrome={logoMonochrome} actions={headerActions} />}
    >
      <main className={screenClasses}>
        <div className={innerClasses}>
          {/*
            Collapses to just the filter row below while scrolling forward on
            a phone (`data-collapsed`, mobile-only in the CSS) — the grid
            wrapping the inner element is what lets that animate to and from an
            unknown content height instead of a guessed `max-height`.
          */}
          <header className={headerClasses} data-collapsed={headerCollapsed || undefined}>
            <div className={headerInnerClasses}>
              <span className={backClasses}>
                <Button variant="plate" size="small" iconStart={icons.chevronLeftThin} onClick={onBackClick}>
                  {t("back")}
                </Button>
              </span>

              <div className={headlineClasses}>
                <div className={titlesClasses}>
                  <h1 className={titleClasses}>{t("title")}</h1>
                  <p className={descriptionClasses}>{t("description")}</p>
                </div>

                {/*
                  The tally sits beside the title on a wide screen rather than
                  under it: it is the answer to "am I done?", and putting it on
                  the same line as the question makes the header one statement
                  instead of four stacked ones.
                */}
                <p className={tallyClasses}>
                  <span className={countClasses}>{t("tally", { answered, total })}</span>
                  {remaining > 0 ? <span className={mutedClasses}>{t("skipped", { remaining })}</span> : null}
                </p>
              </div>
            </div>
          </header>

          <div className={filtersClasses}>
            <FilterChips label={t("filterLabel")} options={options} value={filter} onChange={(id) => setFilter(id as RecapFilterId)} />
          </div>

          <div className={listShellClasses}>
            {visible.length === 0 ? (
              <div className={emptyClasses}>
                <p className={emptyTextClasses}>{t("empty")}</p>
                <Button variant="surface" size="small" onClick={() => setFilter(RECAP_FILTER_ALL)}>
                  {t("showAll")}
                </Button>
              </div>
            ) : (
              <>
                {/* Only there to say "there's more above" — invisible at rest,
                    faded in once the list has actually moved. */}
                <EdgeFade edge="top" visible={scrolled} />

                <div ref={listRef} className={listWrapClasses} onScroll={handleScroll}>
                  {/* Keyed on the filter so switching it replays the entrance
                      animation — the rows on screen after a filter change are a
                      new result, not a continuation of the old list. */}
                  <ul className={listClasses} key={filter}>
                    {visible.map(({ question, index }) => {
                      const answer = lookup.get(question.id);

                      return (
                        <RecapRow
                          key={question.id}
                          title={question.title}
                          tone={answerTone(answer)}
                          important={answer?.isImportant === true}
                          skipped={isSkipped(answer)}
                          labels={{
                            answer: answerLabel(answer),
                            important: t("important"),
                          }}
                          onOpen={() => setOpenIndex(index)}
                          onToggleImportant={() => toggleImportant(question.id)}
                        />
                      );
                    })}
                  </ul>
                </div>

                {/* The tall `action` band, so the control panel below reads as
                    floating over the list rather than sitting in a lane of its
                    own underneath it. */}
                <EdgeFade edge="bottom" size="action" />
              </>
            )}

            <div className={footerClasses}>
              <StickyBar>
                {/*
                  With nothing answered there is nothing to compare, so the control
                  is a genuinely disabled button rather than a link wearing
                  `aria-disabled` — which would still navigate on click.
                */}
                <Button variant="solid" color="neutral" size="large" iconEnd={icons.arrowRight} disabled={answered === 0} onClick={onShowResultsClick}>
                  {t("showResults")}
                </Button>
              </StickyBar>
            </div>
          </div>
        </div>
      </main>

      <QuestionDialog
        question={openQuestion ? toCardContent(openQuestion) : undefined}
        selection={{
          agree: openAnswer?.answer === true,
          disagree: openAnswer?.answer === false,
          important: openAnswer?.isImportant === true,
        }}
        labels={{
          agree: t("yes"),
          disagree: t("no"),
          important: t("important"),
          skip: t("skip"),
          close: t("close"),
        }}
        onClose={handleClose}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onToggleImportant={() => openQuestion && toggleImportant(openQuestion.id)}
      />
    </Shell>
  );
}
