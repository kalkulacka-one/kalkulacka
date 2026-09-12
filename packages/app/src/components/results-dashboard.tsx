"use client";

// Ported from kalkulacka-2026/apps/web/components/results-dashboard.tsx (+ results-dashboard.module.css)
import { AvatarStack, Button, Icon } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AnswerMark, Avatar, Donut, type DonutSegment, Meter } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { answerTone } from "@/answers";
import { type AnswerDistribution, MIN_TOPIC_ANSWERS, type QuestionConsensus, type TopicMatch, topicIcon } from "@/insights";
import { copyText } from "@/utilities";
import type { CandidateViewModel } from "@/view-models";

export type ResultsDashboard = {
  distribution: AnswerDistribution;
  topics: TopicMatch[];
  important: QuestionConsensus[];
  againstTheGrain: QuestionConsensus[];
  /** Pre-assembled by `buildAiPrompt` — this component only offers it. */
  prompt: string;
  /** "74 %", the way the active locale writes it — number formatting is locale work, so it happens above. */
  formatPercent: (value: number) => string;
  /**
   * Ways into the question-centric comparison view — the whole topic row
   * becomes an entry point, and the important card gets an action. Absent on
   * a shared result, where that view would compare the *visitor's* (likely
   * empty) answers, not the ones on screen. The app owns the routes, so the
   * dashboard only says which topic the reader chose.
   */
  onCompareTopicClick?: (topic: string) => void;
  onCompareImportantClick?: () => void;
};

/*
 * Container queries, not media queries: the dashboard sits in the right pane
 * on a desktop and full-width under the list on a phone, so what it can afford
 * is a question about the space it was given, not about the window.
 *
 * The container has to be a *wrapper* around the grid rather than the grid
 * itself — `@container` resolves against an element's nearest ancestor
 * container, never against the element that declares one, so a rule matching
 * the grid while the grid is the container can never fire.
 *
 * `flex` here is what actually puts a gap between the multi-column grid and
 * the summary card below it — they are siblings, and the grid's own
 * `margin-bottom` on its cards only spaces cards *within* the column flow.
 * Left as a plain block, the two sat flush against each other with no seam at
 * all.
 */
const containerClasses = "koa:@container koa:flex koa:flex-col koa:gap-4";

/*
 * Multi-column flow rather than a grid.
 *
 * These four cards hold unrelated amounts of content — the donut is short, the
 * topic list is long — and a grid gives every card in a row the height of the
 * tallest, leaving a hole under the short one whether the cards stretch into
 * it or not. Columns let each card be its own height and the next one start
 * immediately, which is the packing this content actually wants.
 */
const gridClasses = "koa:columns-1 koa:gap-x-4 koa:@[34rem]:columns-2";

/*
 * Outlined and flat, where a result row is solid and lifted.
 *
 * These cards are context, not the answer — the ranking beside them is what
 * someone came for, and when both were opaque white tiles with the same
 * shadow the screen read as two equal halves. Drawing these as ruled areas on
 * the page instead of objects resting on it puts them a layer back without
 * having to shrink or mute the type inside them.
 */
const cardClasses =
  "koa:flex koa:flex-col koa:gap-2 koa:p-5 koa:rounded-(--ko-radius-control) koa:bg-[oklch(from_var(--ko-color-surface)_l_c_h_/_0.45)] koa:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]";

/* Columns break anywhere by default, including through the middle of a card. */
const gridCardClasses = `${cardClasses} koa:break-inside-avoid koa:mb-4`;

const cardTitleClasses = "koa:m-0 koa:text-[0.9375rem] koa:font-semibold koa:tracking-[-0.01em] koa:text-(--ko-color-text-strong)";
const cardSubtitleClasses = "koa:m-0 koa:-mt-1 koa:text-[0.8125rem] koa:text-(--ko-color-text-muted)";
const noteClasses = "koa:m-0 koa:text-[0.6875rem] koa:leading-[1.45] koa:text-(--ko-color-text-muted)";
const emptyClasses = "koa:m-0 koa:mt-2 koa:text-[0.8125rem] koa:text-(--ko-color-text-muted)";

/* --- How you answered ----------------------------------------------------- */

const distributionClasses = "koa:mt-2";

/* --- Topics --------------------------------------------------------------- */

const topicsClasses = "koa:flex koa:flex-col koa:gap-3 koa:m-0 koa:mt-2 koa:p-0 koa:list-none";

/*
 * Icon, subject, number — no bar.
 *
 * The bar was measuring the wrong thing. Every row's leader is somewhere in
 * the sixties to nineties, so eleven near-identical bars stacked up read as a
 * texture rather than as a comparison, and they took the vertical room that
 * the one fact a topic list is actually for — *who* is closest on this
 * subject — had to be squeezed into. The icon carries the scanning job the
 * bar was pretending to do: you find the row you care about by its subject.
 */
const topicRowClasses = "koa:grid koa:grid-cols-[auto_minmax(0,1fr)_auto] koa:items-center koa:gap-3";

/*
 * The row as a button into the comparison view, filtered to its topic. The
 * hover plate breathes past the row's own box via the negative margin, the
 * same trick the results list uses, so the row doesn't jump when it gains a
 * background. A button takes only the room its content wants, so the width
 * is stated: the row's full width plus the margin it hangs over on each side.
 */
const topicButtonClasses = [
  "koa:grid koa:grid-cols-[auto_minmax(0,1fr)_auto_auto] koa:items-center koa:gap-3",
  "koa:w-[calc(100%+0.5rem)] koa:p-1 koa:-m-1 koa:border-0 koa:bg-transparent koa:text-left koa:text-inherit koa:cursor-pointer",
  "koa:rounded-(--ko-radius-control) koa:transition-[background-color] koa:duration-(--ko-duration-fast) koa:ease-[ease]",
  "koa:hover:bg-(--ko-color-surface-hover)",
  "koa:focus-visible:outline-3 koa:focus-visible:outline-offset-2 koa:focus-visible:outline-(--ko-color-focus)/55",
].join(" ");

const topicIconClasses = "koa:inline-flex koa:items-center koa:justify-center koa:size-9 koa:rounded-(--ko-radius-control) koa:bg-(--ko-color-surface-sunken) koa:text-(--ko-color-text-muted)";
const topicBodyClasses = "koa:flex koa:flex-col koa:gap-1 koa:min-w-0";
const topicNameClasses = "koa:flex koa:items-baseline koa:gap-2 koa:text-[0.8125rem] koa:font-semibold koa:text-(--ko-color-text-strong)";

/* How many answers the row rests on. Present on every row rather than only the
   thin ones, so it reads as information rather than as a warning. */
const topicCountClasses = "koa:font-medium koa:text-(--ko-color-text-muted) koa:tabular-nums";

const topicBestClasses = "koa:flex koa:items-center koa:gap-2 koa:min-w-0";
const topicBestNameClasses = "koa:text-xs koa:text-(--ko-color-text-muted) koa:truncate";

/* The row's one number, so it is set at the row's scale rather than as a
   footnote to the party's name — it is what the topic list is ranked on. */
const topicPercentClasses = "koa:flex-none koa:text-[0.9375rem] koa:font-semibold koa:text-(--ko-color-text-strong) koa:tabular-nums";

const topicChevronClasses = "koa:inline-flex koa:items-center koa:text-(--ko-color-text-muted)";

/* The card's one action, separated from the list it acts on. */
const cardActionClasses = "koa:mt-4";

/* --- Important / against the grain ---------------------------------------- */

const consensusListClasses = "koa:flex koa:flex-col koa:gap-3 koa:m-0 koa:mt-2 koa:p-0 koa:list-none";
const consensusRowClasses = "koa:grid koa:grid-cols-[auto_minmax(0,1fr)] koa:items-start koa:gap-3";
const consensusBodyClasses = "koa:flex koa:flex-col koa:gap-1.5 koa:min-w-0";
const consensusTitleClasses = "koa:m-0 koa:text-[0.8125rem] koa:font-semibold koa:leading-[1.35] koa:text-(--ko-color-text-strong)";
const consensusCountClasses = "koa:m-0 koa:text-xs koa:text-(--ko-color-text-muted)";

/* --- The copyable summary -------------------------------------------------- */

const promptClasses = [
  "koa:w-full koa:mt-2 koa:p-3 koa:box-border",
  "koa:border-[1.5px] koa:border-solid koa:border-(--ko-color-border) koa:rounded-(--ko-radius-control)",
  "koa:bg-(--ko-color-surface-sunken) koa:text-(--ko-color-text)",
  "koa:font-(family-name:--ko-font-mono) koa:text-xs koa:leading-[1.6] koa:resize-y",
  "koa:focus-visible:outline-3 koa:focus-visible:outline-offset-2 koa:focus-visible:outline-(--ko-color-focus)/55",
].join(" ");

const promptActionsClasses = "koa:flex koa:items-center koa:gap-3 koa:flex-wrap";
const promptNoteClasses = `${noteClasses} koa:flex-1 koa:min-w-48`;

/** The smallest picture the data layer serves — a stack of faces needs no more. */
function avatarSrc(candidate: CandidateViewModel): string | undefined {
  const urls = candidate.avatar?.urls;
  if (!urls) return undefined;
  return urls.xs ?? urls.sm ?? urls.md ?? urls.original;
}

/**
 * A question with how much company you had on it — shared by two of the cards.
 *
 * The two cards ask opposite things of the same row, so they draw the company
 * differently. "Vaše důležité otázky" is about the questions you chose to
 * weigh: there, *who* stood with you is the answer, so it shows their faces.
 * "Kde jste proti proudu" is about being outnumbered, which is a proportion —
 * a bar states that in one glance and a row of faces does not.
 */
function ConsensusRow({ entry, show = "share" }: { entry: QuestionConsensus; show?: "share" | "agreeing" }) {
  const t = useTranslations("koa.components.resultsDashboard");
  const share = entry.respondedCount > 0 ? (entry.agreeing.length / entry.respondedCount) * 100 : 0;

  /* The mark is a bare coloured circle, so its label *is* the answer as far as
     a screen reader is concerned — the same four words the recap rows use. */
  const tone = answerTone({ questionId: entry.question.id, answer: entry.userAnswer });
  const label = tone === "agree" ? t("yes") : tone === "disagree" ? t("no") : tone === "neutral" ? t("neutral") : t("none");

  return (
    <li className={consensusRowClasses}>
      <AnswerMark tone={tone} label={label} size="small" />

      <div className={consensusBodyClasses}>
        <p className={consensusTitleClasses}>{entry.question.title}</p>

        {show === "agreeing" ? (
          <AvatarStack
            items={entry.agreeing.map((candidate) => ({ id: candidate.id, name: candidate.displayName ?? "", src: avatarSrc(candidate) }))}
            label={t("agreeingParties")}
            popover={{ closeLabel: t("close") }}
          />
        ) : (
          <Meter value={share} tone="neutral" size="small" />
        )}

        <p className={consensusCountClasses}>{t("agreeCount", { agreeing: entry.agreeing.length, responded: entry.respondedCount })}</p>
      </div>
    </li>
  );
}

/**
 * What the results screen shows before you pick anybody.
 *
 * The right pane would otherwise sit empty until a party is chosen, and the
 * ranking on its own answers only the narrowest version of the question
 * someone came here with. These cards are about the shape of the answers
 * rather than the order of the parties: which topics you actually have a
 * position on, where you stood nearly alone, and what the whole thing looks
 * like as one figure.
 *
 * The card titles are `<h2>`: they sit directly under the results screen's own
 * `<h1>`, and they are the same rung as the candidate name that replaces this
 * whole pane when a comparison opens. They had been `<h3>`, which skipped a
 * level and left a reader browsing by heading unable to tell whether they were
 * one step down from the title or two.
 */
export function ResultsDashboard({ distribution, topics, important, againstTheGrain, prompt, formatPercent, onCompareTopicClick, onCompareImportantClick }: ResultsDashboard) {
  const t = useTranslations("koa.components.resultsDashboard");
  const [copyState, setCopyState] = useState<"idle" | "done" | "failed">("idle");
  const promptRef = useRef<HTMLTextAreaElement>(null);

  // Clears itself so the button doesn't sit reading "Zkopírováno" forever, which
  // stops it looking like a button you can press again.
  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), copyState === "failed" ? 6000 : 2400);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const copyPrompt = useCallback(async () => {
    if (await copyText(prompt)) {
      setCopyState("done");
      return;
    }

    /*
     * The clipboard is refusable, and absent entirely on a plain-http origin.
     * Rather than leave a dead button, hand the reader the next best thing:
     * the text selected and ready for their own copy gesture.
     */
    setCopyState("failed");
    promptRef.current?.focus();
    promptRef.current?.select();
  }, [prompt]);

  /* The legend names the reader's own answers, so it uses the same four strings
     the cards and the recap do rather than a synonym set of its own. */
  const segments: DonutSegment[] = [
    { tone: "agree", value: distribution.agree, label: t("yes") },
    { tone: "disagree", value: distribution.disagree, label: t("no") },
    { tone: "neutral", value: distribution.neutral, label: t("neutral") },
    { tone: "none", value: distribution.unanswered, label: t("none") },
  ];

  return (
    <div className={containerClasses}>
      <div className={gridClasses}>
        <section className={gridCardClasses}>
          <h2 className={cardTitleClasses}>{t("distributionTitle")}</h2>

          {/* The ring carries its own legend — the key can't drift from the ring it explains. */}
          <div className={distributionClasses}>
            <Donut segments={segments} centerValue={String(distribution.total)} centerLabel={t("distributionUnit")} />
          </div>
        </section>

        <section className={gridCardClasses}>
          <h2 className={cardTitleClasses}>{t("topicsTitle")}</h2>
          <p className={cardSubtitleClasses}>{t("topicsSubtitle")}</p>

          {topics.length > 0 ? (
            <>
              <ul className={topicsClasses}>
                {topics.map((topic) => {
                  const row = (
                    <>
                      {/* Decorative: the topic is named in the text beside it,
                          and the icon is a second reading of the same word. */}
                      <span className={topicIconClasses}>
                        <Icon icon={icons[topicIcon(topic.topic)]} size={null} decorative className="koa:size-[1.375rem]" />
                      </span>

                      <span className={topicBodyClasses}>
                        <span className={topicNameClasses}>
                          {topic.topic}
                          <span className={topicCountClasses}>{topic.answeredCount}</span>
                        </span>

                        <span className={topicBestClasses}>
                          <Avatar name={topic.best.candidate.displayName} image={topic.best.candidate.avatar?.urls} size="small" />
                          <span className={topicBestNameClasses}>{topic.best.candidate.displayName}</span>
                        </span>
                      </span>

                      <span className={topicPercentClasses}>{formatPercent(topic.best.matchPercentage)}</span>
                    </>
                  );

                  return (
                    <li key={topic.topic}>
                      {onCompareTopicClick ? (
                        /*
                          The whole row is the control, with the chevron only
                          saying so — an `aria-label` names the destination,
                          because the row's visible text is a *finding*
                          ("Doprava, nejblíž Piráti") rather than an action.
                        */
                        <button type="button" className={topicButtonClasses} onClick={() => onCompareTopicClick(topic.topic)} aria-label={t("topicCompare", { topic: topic.topic })}>
                          {row}
                          <span className={topicChevronClasses} aria-hidden="true">
                            <Icon icon={icons.chevronRightThin} size={null} decorative className="koa:size-[1.125rem]" />
                          </span>
                        </button>
                      ) : (
                        <span className={topicRowClasses}>{row}</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Said plainly rather than left to be inferred from the counts: a
                  topic missing from this list is missing for a reason, and the
                  reason is not that nobody matched you on it. */}
              <p className={noteClasses}>{t("topicsNote", { min: MIN_TOPIC_ANSWERS })}</p>
            </>
          ) : (
            <p className={emptyClasses}>{t("topicsEmpty")}</p>
          )}
        </section>

        <section className={gridCardClasses}>
          <h2 className={cardTitleClasses}>{t("importantTitle")}</h2>
          <p className={cardSubtitleClasses}>{t("importantSubtitle")}</p>

          {important.length > 0 ? (
            <>
              <ul className={consensusListClasses}>
                {important.map((entry) => (
                  <ConsensusRow key={entry.question.id} entry={entry} show="agreeing" />
                ))}
              </ul>

              {onCompareImportantClick ? (
                <div className={cardActionClasses}>
                  <Button variant="surface" size="small" iconEnd={icons.arrowRight} onClick={onCompareImportantClick}>
                    {t("importantCompare")}
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <p className={emptyClasses}>{t("importantEmpty")}</p>
          )}
        </section>

        <section className={gridCardClasses}>
          <h2 className={cardTitleClasses}>{t("grainTitle")}</h2>
          <p className={cardSubtitleClasses}>{t("grainSubtitle")}</p>

          {againstTheGrain.length > 0 ? (
            <ul className={consensusListClasses}>
              {againstTheGrain.map((entry) => (
                <ConsensusRow key={entry.question.id} entry={entry} />
              ))}
            </ul>
          ) : (
            <p className={emptyClasses}>{t("grainEmpty")}</p>
          )}
        </section>
      </div>

      {/* Outside the columns: a block of prose reads badly in a narrow measure,
          and it is the one card that concerns the whole screen rather than one
          slice of it. */}
      <section className={cardClasses}>
        <h2 className={cardTitleClasses}>{t("promptTitle")}</h2>
        <p className={cardSubtitleClasses}>{t("promptSubtitle")}</p>

        {/*
          A real textarea rather than a styled block: it is selectable, it scrolls
          on its own, and it keeps working when the clipboard API is refused or
          the page is not on a secure origin.
        */}
        <textarea ref={promptRef} className={promptClasses} value={prompt} readOnly rows={7} spellCheck={false} aria-label={t("promptTitle")} />

        <div className={promptActionsClasses}>
          <Button variant="surface" size="small" onClick={copyPrompt}>
            {copyState === "done" ? t("promptCopied") : t("promptCopy")}
          </Button>
          <p className={promptNoteClasses} role={copyState === "failed" ? "status" : undefined}>
            {copyState === "failed" ? t("promptFallback") : t("promptNote")}
          </p>
        </div>
      </section>
    </div>
  );
}
