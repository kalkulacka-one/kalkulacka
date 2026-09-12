"use client";

// Ported from kalkulacka-2026/apps/web/components/answers-comparison.tsx (+ answers-comparison.module.css). The
// route half of its filter is `comparisonFilterToId` / `comparisonFilterFromId` in `@/recap`; the address bar itself
// belongs to the app's wrapper, since this platform's routes carry the filter as a query rather than a segment.
import { AvatarStack, type AvatarStackItem, Button, FilterChips, Icon } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AnswerMark, type AnswerMarkTone, AppHeader, Avatar, Shell, Tag, VisuallyHidden } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import { type ReactNode, useMemo, useState } from "react";

import { answersByQuestion, answerTone } from "@/answers";
import { useAnswersStore } from "@/client/stores";
import { useAnswerGroups, useCalculatedMatches, useQuestions, useRecapTotals, useResult } from "@/client/view-models";
import type { CandidatePosition } from "@/insights";
import {
  type ComparisonFilter,
  comparisonFilterFromId,
  comparisonFilterToId,
  countRecapTopics,
  matchesRecapFilter,
  RECAP_FILTER_ALL,
  RECAP_FILTER_IMPORTANT,
  type RecapFilterId,
  type RecapFilterOption,
  topicFilterId,
} from "@/recap";
import { avatarSrc } from "@/view-models";

export type ComparisonPage = {
  /** The header wordmark text, e.g. "Volební kalkulačka" — the product name, owned by the app. */
  appTitle: string;
  /** The election's display name, e.g. "Sněmovní volby 2025". */
  electionName?: string;
  /** The calculator's display name — the header's subtitle. */
  calculatorName: string;
  /**
   * The filter the reader arrived with — from the URL, or a dashboard link.
   * Absent = everything. Read once, on arrival: the page keeps its own filter
   * from there and reports every change through `onFilterChange`.
   */
  initialFilter?: ComparisonFilter;
  /** Right side of the header: today the app's close button, later the menu. */
  headerActions?: ReactNode;
  /** Embeds: makes the wordmark an outbound link to the full site. */
  attributionHref?: string;
  logoMonochrome?: boolean;
  /** "Zpět na výsledky" — the app takes the reader back to the ranking. */
  onBackClick: () => void;
  /**
   * A chip was picked: `undefined` for everything, else the filter in route
   * terms. The app keeps the address bar in step so a filtered view survives a
   * reload or being shared — with a `replaceState`, not a navigation: the
   * screen already has the data for every filter, and a server round-trip
   * would only re-fetch it.
   */
  onFilterChange?: (filter: ComparisonFilter | undefined) => void;
};

/** How many faces a collapsed row's stack shows before the "+n" disc. */
const STACK_MAX = 5;

/** The mark's tone and its accessible name, together: the mark is a bare coloured circle, so the name *is* the answer. */
type Mark = { tone: AnswerMarkTone; label: string };

/*
 * A single reading column, unlike the results screen's two panes: this is a
 * list to be scanned top to bottom, and a second pane would only be somewhere
 * for the eye to lose its place. The document scrolls (see `scroll="document"`
 * on the shell), so long comment threads behave like a page, not a widget.
 *
 * On a desktop the shell reverts to a fixed frame (the design system's
 * `styles.css` caps `document` mode back to `overflow: hidden` at 64rem), so
 * the screen scrolls internally: the header and the filter row stay put, the
 * question list is what moves — the same division the recap makes.
 */
const screenClasses =
  "koa:flex-1 koa:min-h-0 koa:flex koa:pl-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-left,0px))] koa:pr-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-right,0px))] koa:lg:overflow-hidden";

/* Narrower than the results screen's 80rem: one column of statements reads
   best at text width, and the stacks never need more. */
const innerClasses = "koa:flex-1 koa:min-h-0 koa:flex koa:flex-col koa:gap-5 koa:w-full koa:max-w-[52rem] koa:mx-auto koa:pt-4 koa:lg:pt-8 koa:pb-(--ko-spacing-scroll-tail)";

const headClasses = "koa:flex-none koa:flex koa:flex-col koa:items-start koa:gap-3";

/* `Button` takes no `className`, so the alignment lives on a wrapper — the same one every screen's back link wears. */
const backClasses = "koa:inline-flex koa:self-start koa:max-w-full";

/* The results screen's title, to the letter — this screen opens from it. The
   back link precedes it, hence the same clearance every screen gives a
   headline under a control. */
const titleClasses =
  "koa:m-0 koa:mt-1 koa:font-(family-name:--ko-font-display) koa:text-(length:--ko-text-title) koa:font-bold koa:tracking-[-0.045em] koa:leading-[1.1] koa:text-(--ko-color-text) koa:text-balance";

const descriptionClasses = "koa:m-0 koa:max-w-[32rem] koa:text-[0.9375rem] koa:leading-[1.45] koa:text-(--ko-color-text-muted) koa:text-pretty";

const filtersClasses = "koa:flex-none koa:min-w-0";

const emptyClasses = "koa:flex koa:flex-col koa:items-start koa:gap-4 koa:py-6";
const emptyTextClasses = "koa:m-0 koa:text-[0.9375rem] koa:text-(--ko-color-text-muted)";

/*
 * The entrance (`--ko-animate-recap-list-in`) is replayed on every filter
 * change via the `key={filter}` remount below — the same "new result landing"
 * cue the recap and the comparison pane give.
 *
 * From `lg` the list is the screen's scroller. The padding/negative-margin
 * pair is the recap's trick too: `overflow-y: auto` clips at the padding box,
 * and without the extra room the rows' focus rings and hover growth would be
 * sliced off at the edges.
 */
const listClasses = [
  "koa:flex koa:flex-col koa:gap-3 koa:m-0 koa:p-0 koa:list-none",
  "koa:animate-(--ko-animate-recap-list-in) koa:motion-reduce:animate-none",
  "koa:lg:flex-1 koa:lg:min-h-0 koa:lg:overflow-y-auto koa:lg:px-2 koa:lg:pt-2 koa:lg:pb-6 koa:lg:-mx-2 koa:lg:-mt-2",
].join(" ");

/*
 * One question. The same card the dashboard uses, so the view reads as the
 * results screen unfolded rather than a different product.
 *
 * `relative` anchors the toggle's stretched overlay below — the whole
 * collapsed card is clickable through it. Scale-not-lift on hover and the
 * pressed-in active state are `MatchRow`'s own values, so reaching for a
 * question feels like reaching for a party.
 */
const rowClasses = [
  "koa:relative koa:flex koa:flex-col",
  "koa:rounded-(--ko-radius-control) koa:bg-(--ko-color-surface) koa:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
  "koa:[transition:box-shadow_var(--ko-duration-base)_ease,scale_var(--ko-duration-base)_var(--ko-ease-spring)]",
].join(" ");

/*
 * Hover reads off the toggle, not the card: the stretched overlay makes the
 * two the same surface everywhere *except* the avatar stacks, which sit above
 * it — hovering a stack previews its popover and should not also promise the
 * card is about to open. Only while collapsed: an expanded card is mostly
 * reading surface, and a card that swells under a reader chasing a comment is
 * noise.
 */
const rowCollapsedClasses = [
  "koa:has-[[data-toggle]:hover]:scale-(--ko-pressable-scale-hover) koa:has-[[data-toggle]:hover]:shadow-[inset_0_0_0_1.5px_var(--ko-color-border),var(--ko-shadow-card-back)]",
  "koa:has-[[data-toggle]:active]:scale-[0.99] koa:has-[[data-toggle]:active]:[transition-duration:var(--ko-duration-fast)]",
].join(" ");

/*
 * The toggle is the statement line — and, while the card is collapsed, the
 * stretched overlay (`toggleOverlayClasses`) extends its hit area over the
 * whole card, meta line and whitespace included. The avatar stacks stay
 * clickable because they come *after* the toggle in the DOM: both the overlay
 * and a stack's root are positioned with no z-index, and positioned boxes
 * paint in tree order, so the stack lands on top without a z-index of its own
 * — which matters, because a z-index on a wrapper would cap the stack's open
 * popover under the next card's faces. A nested-button structure is what this
 * dodges: the stacks are buttons of their own and cannot live inside this one.
 *
 * Roomier inset from `lg` — and the chevron stops hugging the rounded corner
 * for free.
 */
const toggleClasses = [
  "koa:flex koa:items-start koa:gap-3 koa:w-full",
  "koa:px-4 koa:pt-4 koa:pb-2 koa:lg:px-5 koa:lg:pt-5 koa:lg:pb-3",
  "koa:border-0 koa:bg-transparent koa:text-inherit koa:text-left koa:cursor-pointer",
  "koa:rounded-t-(--ko-radius-control)",
  "koa:focus-visible:outline-3 koa:focus-visible:-outline-offset-2 koa:focus-visible:outline-(--ko-color-focus)/55",
].join(" ");

const toggleOverlayClasses = "koa:after:content-[''] koa:after:absolute koa:after:inset-0 koa:after:rounded-(--ko-radius-control)";

const statementClasses = "koa:flex-1 koa:min-w-0 koa:font-(family-name:--ko-font-sans) koa:text-sm koa:leading-[1.45] koa:text-(--ko-color-text)";

const starClasses = "koa:inline-block koa:h-[13px] koa:w-auto koa:align-[-0.15em] koa:mr-1.5 koa:text-(--ko-color-text-muted)";

/* Optically level with the statement's first line. */
const chevronClasses = "koa:flex-none koa:inline-flex koa:items-center koa:mt-0.5 koa:text-(--ko-color-text-muted)";
const chevronIconClasses = "koa:size-[1.125rem]";

/*
 * The collapsed card's summary line. On a phone the pairs flow and wrap; from
 * `lg` they sit in fixed columns instead, so the marks line up vertically card
 * after card and the list can be read straight down a column of beads.
 * `contents` on the stacks wrapper dissolves it into the grid; the explicit
 * column on each pair keeps "ne" in its own column even on a question where
 * nobody answered "ano".
 *
 * No reserved column for the skip/neutral fallback pair here — it used to
 * always claim column 1, leaving it empty (and its width plus the gap beside
 * it as dead indent) on every card that got an ordinary yes/no answer, which
 * is nearly all of them. The agree pair now opens column 1 itself, flush with
 * the statement text above it. `metaFallbackClasses` re-adds the reserved
 * column only for the handful of cards that actually render the fallback
 * pair, auto-sized to that pair's own content, at the cost of those specific
 * cards' "ano" not lining up with everyone else's — an acceptable trade since
 * cross-card bead alignment matters far less than the indent did.
 *
 * Column 1 ("ano") is sized for its fullest occupant — mark, "Vy" tag, a full
 * face stack with overflow counter — so the tag never wraps the counter onto
 * a second line.
 */
const metaBaseClasses = "koa:flex koa:flex-wrap koa:items-center koa:gap-x-5 koa:gap-y-3 koa:px-4 koa:pb-4 koa:lg:px-5 koa:lg:pb-5 koa:lg:grid koa:lg:items-center";
const metaClasses = `${metaBaseClasses} koa:lg:grid-cols-[16rem_minmax(0,1fr)]`;
const metaFallbackClasses = `${metaBaseClasses} koa:lg:grid-cols-[auto_16rem_minmax(0,1fr)]`;

const stacksClasses = "koa:inline-flex koa:flex-wrap koa:items-center koa:gap-x-5 koa:gap-y-2 koa:lg:contents";

/*
 * One side's summary — the mark, an optional "Vy" tag, the face stack. No
 * separate "your answer" row any more: the tag moves into whichever pair
 * matches the reader's own answer instead (see the row for why), so this
 * same pair has to hold three things some of the time and two the rest, hence
 * the wrap-friendly `inline-flex` rather than a fixed slot count.
 */
const pairClasses = "koa:inline-flex koa:items-center koa:gap-2";

/*
 * The fallback pair for a skipped or explicit "nevím" answer, which matches
 * neither face stack this summary shows (it only ever draws the yes/no groups
 * — see the merged third group in the expanded card for where "nevím" gets
 * its own row). Same mark-plus-tag shape as a matching pair.
 *
 * On the phone's wrapping flow the pair is narrow enough to share a line with
 * a party stack, where it reads as part of that stack's answer. A full-row
 * basis gives it the line to itself, and `order` moves it up to where the old
 * "your answer" row sat — neither applies on desktop, where `contents`
 * dissolves the flex context and the grid seats it in its own column.
 */
const fallbackPairClasses = "koa:whitespace-nowrap koa:basis-full koa:-order-1 koa:lg:col-start-1";

/* Sits directly under the statement now that the open card drops its summary
   line, so it carries the gap the summary line used to provide. */
const bodyClasses = "koa:flex koa:flex-col koa:gap-5 koa:px-4 koa:pt-2 koa:pb-4 koa:lg:px-5 koa:lg:pb-5";

/*
 * The border between groups is the *only* horizontal rule inside the expanded
 * card — individual party rows carry none — so it reads as the one place Ano
 * hands off to Ne hands off to Nevím. It stays on the same hairline colour as
 * every other border in the app: it is a boundary between sections, not
 * something that should out-weigh the card's own edge.
 *
 * Your side is marked by the "Vy" tag in the group's header and nothing else
 * — no tinted container, by explicit request. The tag rather than reordering
 * is what keeps the party order best-match-first in every group.
 */
const groupClasses = "koa:border-t-[1.5px] koa:border-solid koa:border-(--ko-color-border) koa:pt-4 koa:first:border-t-0 koa:first:pt-0";

/*
 * A real heading, set as such: body size and bold, the same rung the party
 * names below it read at. It had been small uppercase, which made the one word
 * that names each group — Ano, Ne — look like a field label rather than the
 * answer it is.
 */
const groupHeadClasses = "koa:flex koa:items-center koa:gap-2 koa:m-0 koa:mb-3 koa:font-(family-name:--ko-font-sans) koa:text-sm koa:font-bold koa:text-(--ko-color-text-strong)";

/*
 * A fixed-width column for every mark this card draws — every group header's
 * mark — so the text beside them all starts at the same x regardless of
 * whether the icon in that slot is a 1.5rem `AnswerMark` or a 2rem `Avatar`
 * (which fills the slot exactly and needs no wrapper of its own). Without
 * this a group's smaller mark left its label sitting to the left of where a
 * party row's avatar leaves its name, and the whole card read as two
 * uncoordinated columns rather than one.
 */
const groupIconClasses = "koa:flex-none koa:inline-flex koa:items-center koa:justify-center koa:w-8";
const groupLabelClasses = "koa:min-w-0";
const groupCountClasses = "koa:font-medium koa:text-(--ko-color-text-muted) koa:tabular-nums";
const groupListClasses = "koa:flex koa:flex-col koa:gap-3 koa:m-0 koa:p-0 koa:list-none";

/* No divider between rows on purpose — see `groupClasses` above. Vertical
   rhythm alone is what separates one party from the next. */
const partyClasses = "koa:flex koa:flex-col koa:gap-1";
const partyLineClasses = "koa:flex koa:items-center koa:gap-3 koa:min-h-8";
const partyNameClasses = "koa:flex-1 koa:min-w-0 koa:font-(family-name:--ko-font-sans) koa:text-[0.8125rem] koa:text-(--ko-color-text)";

/*
 * The party's own words — always shown, no disclosure — marked by the same
 * raised-quote watermark the 1:1 comparison uses, so a comment reads as the
 * same kind of thing in both places.
 *
 * A flex row rather than padding plus an absolutely-positioned glyph: the mark
 * then *sits in* the same 2rem column the avatar above it occupies and the
 * text starts at exactly the party name's x, with no offsets to keep in sync
 * by hand. That is what the absolute version got wrong — it was placed
 * against the paragraph's own box, so it drifted with every comment length.
 */
const commentClasses = "koa:flex koa:gap-3 koa:m-0 koa:font-(family-name:--ko-font-sans) koa:text-[0.8125rem] koa:leading-[1.45] koa:text-(--ko-color-text-muted) koa:text-pretty";

/*
 * U+201C is a *raised* mark: its ink sits high in the em box, nowhere near the
 * baseline the box is positioned from. Left to the normal flow it therefore
 * floats a good half-line above the text it opens, which is what made it read
 * as debris in the margin.
 *
 * `leading-none` pins the glyph's box to its own em, and the nudge is
 * measured, not guessed: at this size the ink's centre lands 7.4px below the
 * box top, while the first line's cap band centres at 9.3px — so ~2px down
 * puts the mark level with the words beside it. Recheck it if the display face
 * ever changes; the number belongs to that face's outlines.
 */
const quoteClasses =
  "koa:flex-none koa:w-8 koa:mt-0.5 koa:font-(family-name:--ko-font-display) koa:text-[1.75rem] koa:leading-none koa:text-center koa:text-(--ko-color-text-muted)/35 koa:pointer-events-none koa:select-none";

/**
 * One party's row inside an expanded question — face, name and, where the
 * party left one, their own comment straight underneath. Not collapsible: a
 * reader who opened the question already asked to see this level of detail,
 * and a comment hidden behind a second click inside an already-open
 * disclosure is one click too many.
 *
 * `mark` adds the party's own answer mark — wanted only in the merged
 * "nevím / bez odpovědi" group, where the mark is what tells an explicit
 * shrug from silence; in the yes/no groups the group header already says it.
 */
function PartyRow({ position, mark }: { position: CandidatePosition; mark?: Mark }) {
  const { candidate, comment } = position;

  return (
    <li className={partyClasses}>
      <div className={partyLineClasses}>
        <Avatar name={candidate.name} src={avatarSrc(candidate)} size="small" />
        <span className={partyNameClasses}>{candidate.name}</span>

        {mark ? <AnswerMark tone={mark.tone} label={mark.label} size="small" /> : null}
      </div>

      {comment ? (
        <p className={commentClasses}>
          <span className={quoteClasses} aria-hidden="true">
            “
          </span>
          {comment}
        </p>
      ) : null}
    </li>
  );
}

/**
 * One side of a question — everyone who gave this answer.
 *
 * `you` marks the group holding the reader's own position with a plain "Vy"
 * tag, neutral-toned rather than agree-toned: the tag says whose side this is,
 * not that the side is good — a green pill under "Ne" would read as praise for
 * having disagreed. No tinted container either, by request; the tag alone is
 * what keeps the party order (best-match-first) undisturbed by any
 * re-sorting.
 *
 * Shared by all three groups — including the merged "nevím / bez odpovědi"
 * one, via `icon`/`markOf` — so a header never has to duplicate this
 * structure by hand.
 */
function AnswerGroup({
  icon,
  label,
  positions,
  you,
  youLabel,
  markOf,
}: {
  icon: ReactNode;
  label: string;
  positions: CandidatePosition[];
  you: boolean;
  youLabel: string;
  markOf?: (position: CandidatePosition) => Mark;
}) {
  if (positions.length === 0) return null;

  return (
    <section className={groupClasses} data-you={you || undefined}>
      <h3 className={groupHeadClasses}>
        <span className={groupIconClasses}>{icon}</span>
        <span className={groupLabelClasses}>{label}</span>
        <span className={groupCountClasses}>{positions.length}</span>
        {you ? <Tag tone="neutral">{youLabel}</Tag> : null}
      </h3>

      <ul className={groupListClasses}>
        {positions.map((position) => (
          <PartyRow key={position.candidate.id} position={position} mark={markOf?.(position)} />
        ))}
      </ul>
    </section>
  );
}

/**
 * Every party's answer to every question, side by side with the reader's own.
 *
 * The question-centric counterpart of the per-candidate comparison pane: that
 * one asks "how does this party line up with me overall", this one asks "who
 * stands where on this question". Rows collapse to a scannable line — the
 * statement, your mark, and two face stacks — because forty questions times
 * nine parties in full would be a wall; the stacks' popover answers "whose
 * faces are those" without opening anything.
 *
 * Unlike the pane this includes questions the reader skipped: the subject
 * here is the parties' positions, and a question you didn't answer still has
 * nine of those worth reading.
 *
 * A button rather than a link for the way back, like the other screens: the
 * app owns the routes, and the page only says where the reader wants to go.
 */
export function ComparisonPage({ appTitle, electionName, calculatorName, initialFilter, headerActions, attributionHref, logoMonochrome, onBackClick, onFilterChange }: ComparisonPage) {
  const t = useTranslations("koa.components.comparisonPage");

  const { questions } = useQuestions();
  const answers = useAnswersStore((state) => state.answers);
  const lookup = useMemo(() => answersByQuestion(answers), [answers]);
  const groups = useAnswerGroups();
  const { matches } = useResult(useCalculatedMatches());
  const { total, important } = useRecapTotals();

  const topics = useMemo(() => countRecapTopics(questions), [questions]);

  const [filter, setFilter] = useState<RecapFilterId>(() =>
    comparisonFilterToId(
      initialFilter,
      topics.map(([topic]) => topic),
    ),
  );
  /** Which questions are open, by id. Reset when the filter changes. */
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());

  /*
   * The ranking decides the order of faces inside every group: the stacks are
   * a sample (the first five), and the sample should be the parties the reader
   * has most reason to recognise — the ones at the top of their result.
   */
  const rankOf = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of matches) {
      map.set(entry.candidate.id, entry.order ?? Number.MAX_SAFE_INTEGER);
    }
    return map;
  }, [matches]);

  const ranked = useMemo(() => {
    const byRank = (a: CandidatePosition, b: CandidatePosition) => (rankOf.get(a.candidate.id) ?? Number.MAX_SAFE_INTEGER) - (rankOf.get(b.candidate.id) ?? Number.MAX_SAFE_INTEGER);

    // `other` keeps the builder's order — neutrals ahead of the silent — so
    // an explicit "nevím" with a comment isn't buried under empty rows.
    return groups.map((entry) => ({
      ...entry,
      yes: [...entry.yes].sort(byRank),
      no: [...entry.no].sort(byRank),
    }));
  }, [groups, rankOf]);

  const visible = useMemo(() => ranked.filter((entry) => matchesRecapFilter(entry.question, answers, filter)), [ranked, answers, filter]);

  // "Důležité" only when it would leave something — the same rule the recap's
  // own chips follow. Topics always follow, separated by a hairline because
  // they answer a different question from the progress filter.
  const filterOptions: RecapFilterOption[] = [
    { id: RECAP_FILTER_ALL, label: t("filterAll"), count: total },
    ...(important > 0 ? [{ id: RECAP_FILTER_IMPORTANT, label: t("filterImportant"), count: important } satisfies RecapFilterOption] : []),
    ...topics.map(([topic, count], index) => ({
      id: topicFilterId(topic),
      label: topic,
      count,
      separatorBefore: index === 0,
    })),
  ];

  /**
   * How an answer reads aloud — the accessible name behind a mark. The mark is
   * a bare coloured circle, so this string *is* the answer as far as a screen
   * reader is concerned; the tone that draws it is `answerTone`'s, and this is
   * its counterpart for the words — the same four the recap rows use.
   */
  const answerLabel = (tone: AnswerMarkTone) => {
    if (tone === "agree") return t("yes");
    if (tone === "disagree") return t("no");
    if (tone === "neutral") return t("neutral");
    return t("none");
  };

  const markOf = (questionId: string, answer: boolean | null | undefined): Mark => {
    const tone = answerTone({ questionId, answer });
    return { tone, label: answerLabel(tone) };
  };

  const changeFilter = (id: RecapFilterId) => {
    setFilter(id);
    setExpanded(new Set());
    onFilterChange?.(comparisonFilterFromId(id));
  };

  const toggleQuestion = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const faces = (positions: CandidatePosition[]): AvatarStackItem[] => positions.map(({ candidate }) => ({ id: candidate.id, name: candidate.shortName, src: avatarSrc(candidate) }));

  const youTag = (
    <Tag tone="neutral">
      {/* The mark beside it already reads "Vy: Ano" aloud; the pill is for the eye. */}
      <span aria-hidden="true">{t("you")}</span>
    </Tag>
  );

  return (
    <Shell
      scroll="document"
      header={<AppHeader title={appTitle} electionName={electionName} calculatorName={calculatorName} href={attributionHref} logoMonochrome={logoMonochrome} actions={headerActions} />}
    >
      <main className={screenClasses}>
        <div className={innerClasses}>
          <header className={headClasses}>
            <span className={backClasses}>
              <Button variant="plate" size="small" iconStart={icons.chevronLeftThin} onClick={onBackClick}>
                {t("back")}
              </Button>
            </span>
            <h1 className={titleClasses}>{t("title")}</h1>
            <p className={descriptionClasses}>{t("description")}</p>
          </header>

          <div className={filtersClasses}>
            <FilterChips label={t("filterLabel")} options={filterOptions} value={filter} onChange={(id) => changeFilter(id as RecapFilterId)} />
          </div>

          {visible.length === 0 ? (
            <div className={emptyClasses}>
              <p className={emptyTextClasses}>{t("emptyFilter")}</p>
              <Button variant="surface" size="small" onClick={() => changeFilter(RECAP_FILTER_ALL)}>
                {t("emptyFilterAction")}
              </Button>
            </div>
          ) : (
            /* Keyed on the filter so switching it replays the entrance
               animation — the same "new result landing" cue the recap and the
               comparison pane give. */
            <ul className={listClasses} key={filter}>
              {visible.map((entry) => {
                const answer = lookup.get(entry.question.id);
                const isExpanded = expanded.has(entry.question.id);
                const isImportant = answer?.isImportant === true;
                const userAnswer = answer?.answer;
                // Only the skipped/neutral answer draws the fallback pair — see
                // `fallbackPairClasses` — and only those cards need the desktop
                // grid's reserved first column, so the row's own markup carries
                // that fact rather than duplicating the condition in the CSS.
                const hasFallbackPair = userAnswer !== true && userAnswer !== false;
                const userMark = markOf(entry.question.id, userAnswer);

                return (
                  <li key={entry.question.id} className={isExpanded ? rowClasses : `${rowClasses} ${rowCollapsedClasses}`} data-expanded={isExpanded || undefined}>
                    <button
                      type="button"
                      className={isExpanded ? toggleClasses : `${toggleClasses} ${toggleOverlayClasses}`}
                      data-toggle=""
                      aria-expanded={isExpanded}
                      onClick={() => toggleQuestion(entry.question.id)}
                    >
                      <span className={statementClasses}>
                        {isImportant ? <Icon icon={icons.star} size={null} filled decorative className={starClasses} /> : null}
                        {entry.question.statement || entry.question.title}
                        {isImportant ? <VisuallyHidden> ({t("important")})</VisuallyHidden> : null}
                      </span>

                      <span className={chevronClasses}>
                        <Icon icon={isExpanded ? icons.chevronUpThin : icons.chevronDownThin} size={null} decorative className={chevronIconClasses} />
                      </span>
                    </button>

                    {/*
                      The summary line belongs to the collapsed card only. Open,
                      the groups below say the same thing at full length — and
                      which of them is the reader's own is carried by the "Vy"
                      tag on that group's heading, so repeating their mark up
                      here would be the answer stated twice.

                      There is no separate "your answer" row any more: it used
                      to sit above the two stacks wearing a text label where
                      every other row wears a face, so the eye had to parse a
                      column that only sometimes held avatars. Instead the "Vy"
                      tag moves *into* whichever stack matches — same "Vy" pill
                      the expanded groups already use, reused rather than
                      reinvented, immediately before that row's faces. A
                      skipped or neutral answer matches no stack (this summary
                      never shows the merged "nevím" group), so it falls back
                      to its own pair with the tag and no faces.
                    */}
                    {isExpanded ? null : (
                      <div className={hasFallbackPair ? metaFallbackClasses : metaClasses} data-has-fallback={hasFallbackPair || undefined}>
                        <span className={stacksClasses}>
                          {entry.yes.length > 0 || userAnswer === true ? (
                            <span className={`${pairClasses} ${hasFallbackPair ? "koa:lg:col-start-2" : "koa:lg:col-start-1"}`}>
                              <AnswerMark tone="agree" size="small" label={userAnswer === true ? `${t("you")}: ${answerLabel("agree")}` : undefined} />
                              {userAnswer === true ? youTag : null}
                              {entry.yes.length > 0 ? <AvatarStack items={faces(entry.yes)} max={STACK_MAX} label={t("stackYes")} popover={{ closeLabel: t("close") }} /> : null}
                            </span>
                          ) : null}

                          {entry.no.length > 0 || userAnswer === false ? (
                            <span className={`${pairClasses} koa:lg:justify-self-start ${hasFallbackPair ? "koa:lg:col-start-3" : "koa:lg:col-start-2"}`}>
                              <AnswerMark tone="disagree" size="small" label={userAnswer === false ? `${t("you")}: ${answerLabel("disagree")}` : undefined} />
                              {userAnswer === false ? youTag : null}
                              {entry.no.length > 0 ? <AvatarStack items={faces(entry.no)} max={STACK_MAX} label={t("stackNo")} popover={{ closeLabel: t("close") }} /> : null}
                            </span>
                          ) : null}

                          {hasFallbackPair ? (
                            <span className={`${pairClasses} ${fallbackPairClasses}`}>
                              <AnswerMark tone={userMark.tone} label={`${t("you")}: ${userMark.label}`} size="small" />
                              {youTag}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    )}

                    {isExpanded ? (
                      <div className={bodyClasses}>
                        <AnswerGroup icon={<AnswerMark tone="agree" size="small" />} label={t("yes")} positions={entry.yes} you={userAnswer === true} youLabel={t("you")} />
                        <AnswerGroup icon={<AnswerMark tone="disagree" size="small" />} label={t("no")} positions={entry.no} you={userAnswer === false} youLabel={t("you")} />
                        <AnswerGroup
                          icon={<AnswerMark tone="neutral" size="small" />}
                          label={t("groupOther")}
                          positions={entry.other}
                          you={hasFallbackPair}
                          youLabel={t("you")}
                          markOf={(position) => markOf(entry.question.id, position.answer)}
                        />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </Shell>
  );
}
