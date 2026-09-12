"use client";

// Ported from kalkulacka-2026/apps/web/components/results.tsx (+ results.module.css)
import { Button, Calculating, FilterChips, MatchRow, type ShareCardContent } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { AppHeader, Screen, Shell, StickyBar } from "@kalkulacka-one/design-system/server";
import { prefersReducedMotion } from "@kalkulacka-one/design-system/utilities";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Fragment, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { countAnswered } from "@/answers";
import { useAnswersStore } from "@/client/stores";
import { useAnswerDistribution, useCalculatedMatches, useCalculator, useQuestionConsensus, useQuestions, useResult, useTopicMatches } from "@/client/view-models";
import { buildAiPrompt, selectAgainstTheGrain, selectImportant } from "@/insights";
import type { calculateMatches } from "@/result-calculation";

import { ComparisonPane } from "./comparison-pane";
import { ResultsDashboard } from "./results-dashboard";
import { ShareDialog, type ShareMethod } from "./share-dialog";

/**
 * What the app hands the share dialog — the two things it alone knows: where
 * its routes are, and whether it has a backend to mint a public link on.
 */
export type ResultPageShare = {
  /**
   * The address offered alongside the picture in the OS share sheet — the
   * calculator's intro, absolute, never the results page (see `ShareDialog`).
   */
  url?: string;
  /**
   * Mints the public link and resolves to its absolute address, or `null` when
   * it could not be made. Absent without a backend: the dialog then never
   * offers "Kopírovat odkaz".
   */
  onRequestShareLink?: () => Promise<string | null>;
  /**
   * Rewrites a candidate's picture URL for the canvas export — a same-origin
   * proxy, where the data CDN sends no CORS header. Only the card goes through
   * it; the rows on screen keep loading the CDN directly.
   */
  assetUrl?: (url: string) => string;
  /**
   * An action in the dialog completed — which ones count is `ShareDialog`'s
   * `onShared` to say. The app's analytics hook; nothing for a dismissed
   * sheet or a failure.
   */
  onShared?: (method: ShareMethod) => void;
};

export type ResultPage = {
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
  /**
   * Somebody else's result, opened from a public link. The whole read-only
   * switch: the screen says whose numbers these are, skips the calculating
   * beat (the visitor gave no answers to wait for), and offers a way into
   * their own calculator instead of the ways out of this one.
   */
  shared?: boolean;
  /**
   * A ranking to show in place of the one computed from the answers in the
   * store — a shared result replays the ranking stored with the session, as
   * it stood when it was shared, rather than recomputing one that a later
   * data or algorithm change could have quietly altered. The dashboard and
   * the comparison pane still read the answers, which the app puts in the
   * store alongside.
   */
  algorithmMatches?: ReturnType<typeof calculateMatches>;
  /** "Zpět na rekapitulaci", and the empty state's "Přejít na otázky" — the app takes the reader back. */
  onBackClick: () => void;
  /*
   * The three ways into the comparison. All optional for one reason: a
   * shared result offers none of them (that view compares the *visitor's*
   * store against a ranking that isn't theirs), so its app has none to hand
   * over. Left out on your own result, the same thing happens — the link
   * under the list goes and the dashboard's rows turn inert.
   */
  /** "Porovnat odpovědi" — the question-centric comparison of every party. */
  onCompareClick?: () => void;
  /** A topic row on the dashboard — the comparison filtered to that topic, named by its slug (`topicSlug`). */
  onCompareTopicClick?: (topicSlug: string) => void;
  /** "Porovnat důležité otázky" — the comparison filtered to the starred questions. */
  onCompareImportantClick?: () => void;
  /**
   * "Sdílet" was pressed. With `share` set the page opens its own share
   * dialog and this is a notification (the app's analytics hook); without it
   * this is the whole action — the app opens whatever it still shares with.
   */
  onShareClick?: () => void;
  /**
   * The owner's ranking is on screen — once per mount, the first time the
   * rows render: after the calculating beat, never during it, never again
   * on a re-render, and never on a shared result (the visitor of a public
   * link completed nothing) or the empty screen (which ranks nothing). The
   * app's "completed" hook, gated so it means the same thing as the ranking
   * the app saves.
   */
  onRankingShown?: () => void;
  /** Opts the page into the share dialog; the apps that still have a share surface of their own leave it out. */
  share?: ResultPageShare;
  /** A shared result's "Vyplnit vlastní kalkulačku". */
  onStartOwnClick?: () => void;
  /** The app's own card between the rows — the Czech app's donation ask. */
  donateCard?: ReactNode;
  /**
   * Where `donateCard` sits: `0` before the first row, `n` after the n-th,
   * `false` (the default) nowhere. Counted over the rows on screen, so a
   * position past the folded ranking's fifth row waits for "Zobrazit další
   * strany".
   */
  donateCardPosition?: number | false;
};

/**
 * How long the loader is shown even when the answer is instantaneous.
 *
 * The calculation is a few hundred multiplications — it finishes before the
 * screen paints. The pause is not fake work: it is the beat that lets someone
 * register that a result was produced *from their answers* rather than having
 * been sitting there all along. Matched to the film-gate animation's own length
 * so the loader is allowed to finish resolving rather than being cut off
 * mid-shutter. Reduced motion skips it entirely.
 */
export const CALCULATING_MS = 1700;

/** Seconds between two rows arriving. Nine rows land inside half a second. */
const ROW_STAGGER = 0.06;

/**
 * A row's `delay` when the entrance should not play at all: a negative delay
 * longer than any of the row's animations (`--ko-duration-slow`, 250ms)
 * starts them already finished — the ranking is simply there. Used on a
 * return visit, where the reveal has already happened.
 */
const SKIP_ENTRANCE_DELAY = -1;

/**
 * The calculating beat and the bottom-up stagger are a *reveal* — they earn
 * their time exactly once. Coming back from the comparison view (or any other
 * later visit in the same browsing session) is not a reveal, so the first
 * showing is remembered here. Session-scoped on purpose: a fresh visit
 * tomorrow deserves the beat again. sessionStorage throws in some private
 * modes; a visitor there just gets the beat every time.
 */
export const seenKey = (calculatorId: string) => `ko-results-shown:${calculatorId}`;

function hasSeenResults(calculatorId: string): boolean {
  try {
    return window.sessionStorage.getItem(seenKey(calculatorId)) !== null;
  } catch {
    return false;
  }
}

function markResultsSeen(calculatorId: string): void {
  try {
    window.sessionStorage.setItem(seenKey(calculatorId), "1");
  } catch {
    /* The next visit replays the beat — harmless. */
  }
}

/**
 * How much of the ranking shows before the tail folds behind "Zobrazit další
 * strany". Five, because that is where a share card cuts too — the part of a
 * ranking people actually read.
 */
const COLLAPSED_RESULTS = 5;

const calculatingClasses = "koa:flex-1 koa:min-h-0 koa:flex koa:items-center koa:justify-center koa:p-6";

/*
 * On a phone this whole column scrolls: the ranking, then the dashboard under
 * it, as one page. On a desktop it stops scrolling and hands that job to the
 * two panes individually — see the `lg` variants below (64rem, where the
 * design system's fixed frame returns).
 */
const screenClasses =
  "koa:flex-1 koa:min-h-0 koa:flex koa:pl-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-left,0px))] koa:pr-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-right,0px))] koa:lg:overflow-hidden";

/*
 * The reading column. Capped and centred like every other screen rather than
 * run to the window's edges — on a wide monitor a full-bleed two-pane layout
 * puts the ranking and the dashboard in different postcodes and makes both
 * feel like filler stretched to fit. The page's last row would otherwise come
 * to rest under the address bar with no way to bring it out — hence the
 * scroll tail.
 */
const innerClasses = "koa:flex-1 koa:min-h-0 koa:flex koa:flex-col koa:gap-5 koa:w-full koa:max-w-[80rem] koa:mx-auto koa:pt-4 koa:lg:pt-8 koa:pb-(--ko-spacing-scroll-tail)";

/*
 * A grid rather than a flex row, because the back link and the title need to
 * swap which row they share depending on the viewport, and a flex row can only
 * reorder siblings — it cannot pull an element out of a nested group. On a
 * phone, back and share are the two *controls* and sit together on their own
 * line, with the title given a full-width line of its own rather than being
 * squeezed between them with a wide dead gap on either side. On a desktop the
 * same three pieces resolve into the previous look — back over title, share
 * bottom-aligned beside both (the grid area repeated across two rows is what
 * makes it span them) — by naming the areas differently, not by duplicating
 * the markup.
 */
const headClasses =
  "koa:flex-none koa:grid koa:grid-cols-[1fr_auto] koa:[grid-template-areas:'back_share'_'title_title'_'hint_hint'] koa:items-start koa:gap-x-4 koa:gap-y-3 koa:lg:[grid-template-areas:'back_share'_'title_share'_'hint_hint'] koa:lg:items-end";

const headBackClasses = "koa:[grid-area:back] koa:justify-self-start koa:min-w-0 koa:inline-flex koa:max-w-full";

/*
 * Takes the back link's place on a shared result — the same slot, because it
 * answers the same question the back link does on your own results: where you
 * are and what this screen is. Set at label scale rather than body scale so it
 * reads as a caption on the title beneath it, not as the page's first sentence.
 */
const sharedNoteClasses = "koa:[grid-area:back] koa:justify-self-start koa:m-0 koa:max-w-[44rem] koa:min-w-0 koa:text-sm koa:leading-[1.45] koa:text-(--ko-color-text-muted) koa:text-pretty";

/*
 * The recap's title, to the letter — this screen follows it directly, and two
 * consecutive steps of one task reading as two products is exactly what the
 * type scale exists to prevent. The back link (or a shared result's note)
 * always occupies the row above — the same clearance every screen gives a
 * headline under a control.
 */
const titleClasses =
  "koa:[grid-area:title] koa:m-0 koa:mt-1 koa:min-w-0 koa:font-(family-name:--ko-font-display) koa:text-(length:--ko-text-title) koa:font-bold koa:tracking-[-0.045em] koa:leading-[1.1] koa:text-(--ko-color-text) koa:text-balance";

/* The one-line invitation under the title — how the ranking's rows say they
   can be opened. Caption scale: it annotates the title, it isn't a sentence
   of the page. */
const listHintClasses = "koa:[grid-area:hint] koa:m-0 koa:min-w-0 koa:text-sm koa:leading-[1.45] koa:text-(--ko-color-text-muted) koa:text-pretty";

const shareBoxClasses = "koa:[grid-area:share] koa:justify-self-end koa:flex koa:flex-col koa:items-end koa:gap-2 koa:min-w-0";

/*
 * The ranking is the answer this screen exists to give, so from `lg` it gets
 * the fixed, generous column and the dashboard takes what is left. Sized in
 * `rem` rather than a fraction: a party row has a legibility width that does
 * not scale with the monitor, and a `1fr` column simply made the rows longer.
 * That is the width at which the ranking and a comparison can be read at
 * once; below it they take turns.
 */
const panesClasses = "koa:grid koa:grid-cols-[minmax(0,1fr)] koa:gap-6 koa:items-start koa:lg:flex-1 koa:lg:min-h-0 koa:lg:grid-cols-[30rem_minmax(0,1fr)] koa:lg:gap-8 koa:lg:items-stretch";

/* Holds the ranking and the actions under it, so the grid's left column stays
   one child and the actions can sit outside the list's own scroll region. */
const listPaneClasses = "koa:flex koa:flex-col koa:gap-2 koa:min-h-0 koa:min-w-0";

/* The "Kandidátní listiny / Lidé" switch, above the rows it swaps. */
const viewClasses = "koa:flex-none koa:pb-2";

/*
 * From `lg` the list is its own scroller: `0 1 auto`, not `flex: 1` — the
 * scroll box sizes to its rows and only *shrinks* when the pane runs out of
 * room. Stretched, a folded ranking's short list left the box mostly empty
 * and pushed the actions to the bottom of the page, a pane's height away from
 * the rows they act on. The scroll container clips at its padding box — and
 * `overflow-y: auto` silently makes the horizontal axis clip too — so the
 * padding there is not spacing, it is the room the rows' shadows and the
 * selected row's scale need in order not to be sliced off against the edges;
 * negative margins put the column back where it was, so nothing moves.
 */
const listClasses =
  "koa:flex koa:flex-col koa:gap-4 koa:m-0 koa:p-0 koa:pb-4 koa:list-none koa:lg:flex-[0_1_auto] koa:lg:min-h-0 koa:lg:overflow-y-auto koa:lg:p-4 koa:lg:pb-6 koa:lg:-mt-4 koa:lg:-mx-4 koa:lg:mb-0";

/* The app's card rides the list as a row of its own, without the row's pressable chrome. */
const donateItemClasses = "koa:list-none";

/* Centred on a phone, where the whole column is centred reading; the desktop
   left-aligns them under the list's own edge instead. */
const listActionsClasses = "koa:flex koa:flex-wrap koa:justify-center koa:gap-3 koa:lg:justify-start";

/**
 * The ranking, and what the answers say beyond it.
 *
 * Three renderings, in the order a reader meets them: the calculating beat
 * (once per session), the empty screen when nothing was answered, and the
 * result — the top five rows with the tail folded, and the dashboard beside
 * or below them.
 *
 * Two things the 2026 screen did not have, both driven by the data rather
 * than by a flag: a row scored on an expert's reading of public sources says
 * so under the party's name, and a calculator whose candidates are lists of
 * people offers a switch between the lists and the people on them.
 *
 * Buttons rather than links for every way out, like the other screens: the
 * app owns the routes, and the page only says where the reader wants to go.
 */
export function ResultPage({
  appTitle,
  electionName,
  calculatorName,
  headerActions,
  attributionHref,
  logoMonochrome,
  shared = false,
  algorithmMatches,
  onBackClick,
  onCompareClick,
  onCompareTopicClick,
  onCompareImportantClick,
  onShareClick,
  onRankingShown,
  share,
  onStartOwnClick,
  donateCard,
  donateCardPosition = false,
}: ResultPage) {
  const t = useTranslations("koa.components.resultPage");
  const td = useTranslations("koa.components.resultsDashboard");
  const format = useFormatter();
  const locale = useLocale();

  const calculator = useCalculator();
  const { questions } = useQuestions();
  const answers = useAnswersStore((state) => state.answers);
  const answered = countAnswered(questions, answers);

  /**
   * "Kandidátní listiny" or "Lidé": whether the ranking lists the candidates
   * themselves or the people nested under them. Only offered when there is
   * anything nested to show.
   */
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  /* Computed unconditionally — hooks are — and set aside when a ranking was handed in. */
  const calculatedMatches = useCalculatedMatches();
  const { matches } = useResult(algorithmMatches ?? calculatedMatches, { showOnlyNested });
  const hasNested = matches.some((entry) => entry.nestedMatches !== undefined && entry.nestedMatches.length > 0);
  const showViewSwitch = hasNested || showOnlyNested;

  /**
   * The candidate whose comparison is open. Nothing is open on arrival — the
   * dashboard holds the pane. Clearing this *starts* the pane closing; the exit
   * animation belongs to `ComparisonPane`, which keeps rendering the comparison
   * for a beat after this has already forgotten about it.
   */
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const closeComparison = useCallback(() => setSelectedId(undefined), []);
  /*
   * The beat is skipped outright on a shared result: it exists to let someone
   * register that a ranking came out of the answers they just gave, and the
   * visitor of a public link gave none. Waiting there would be theatre.
   */
  const [waited, setWaited] = useState(shared);
  /**
   * True when this session has already seen this ranking revealed — the beat
   * is skipped above and the rows land without their entrance (see
   * `SKIP_ENTRANCE_DELAY`). State rather than a render-time sessionStorage
   * read: the server renders too, and it has no session to ask.
   */
  const [revisit, setRevisit] = useState(false);

  useEffect(() => {
    if (shared) return;

    if (hasSeenResults(calculator.id)) {
      setRevisit(true);
      setWaited(true);
      return;
    }

    if (prefersReducedMotion()) {
      setWaited(true);
      markResultsSeen(calculator.id);
      return;
    }

    const timer = window.setTimeout(() => {
      setWaited(true);
      markResultsSeen(calculator.id);
    }, CALCULATING_MS);
    return () => window.clearTimeout(timer);
  }, [shared, calculator.id]);

  /*
   * Once per mount, the moment the ranking is first on screen for its own
   * owner. `waited` is in the guard: without it the calculating beat would
   * be counted, not the result. A ref rather than state, so that a re-render
   * — a row opened, the tail unfolded, an answer changed under the page —
   * cannot report it a second time.
   */
  const rankingShown = useRef(false);
  useEffect(() => {
    if (shared || !waited || answered === 0 || rankingShown.current) return;
    rankingShown.current = true;
    onRankingShown?.();
  }, [shared, waited, answered, onRankingShown]);

  /**
   * Whether the ranking's tail (below the fifth row) has been unfolded.
   * One-way by design — see the buttons under the list.
   */
  const [showAllParties, setShowAllParties] = useState(false);
  const visibleMatches = showAllParties ? matches : matches.slice(0, COLLAPSED_RESULTS);
  const hiddenMatches = matches.length - visibleMatches.length;

  /* "74 %", the way the active locale writes it — Czech puts a no-break space before the sign, English none. */
  const formatPercent = useCallback((value: number) => format.number(value / 100, { style: "percent", maximumFractionDigits: 0 }), [format]);

  /*
   * Everything the dashboard reads, memoized over the stores by the hooks:
   * they all walk the same answers against the same candidates, and the
   * stores change only when an answer does.
   */
  const distribution = useAnswerDistribution();
  const topics = useTopicMatches();
  const consensus = useQuestionConsensus();
  const important = useMemo(() => selectImportant(consensus), [consensus]);
  const againstTheGrain = useMemo(() => selectAgainstTheGrain(consensus), [consensus]);

  const prompt = useMemo(
    () =>
      buildAiPrompt(
        {
          electionName: electionName ?? calculatorName,
          // A standalone calculator has no election: naming it twice read as
          // "Inventúra… (Inventúra…)" on the Slovak site.
          districtName: electionName ? calculatorName : undefined,
          answered,
          total: questions.length,
          matches,
          topics,
          important,
          againstTheGrain,
        },
        {
          intro: (values) => td("promptIntro", values),
          introStandalone: (values) => td("promptIntroStandalone", values),
          matches: td("promptMatches"),
          topics: td("promptTopics"),
          important: td("promptImportant"),
          grain: td("promptGrain"),
          ask: td("promptAsk"),
          agree: td("promptAgree"),
          disagree: td("promptDisagree"),
          neutral: td("promptNeutral"),
          agreeCount: (values) => td("agreeCount", values),
          percent: formatPercent,
          locale,
        },
      ),
    [electionName, calculatorName, answered, questions.length, matches, topics, important, againstTheGrain, td, formatPercent, locale],
  );

  const [shareOpen, setShareOpen] = useState(false);
  /*
   * Mounted on the first "Sdílet" and kept after: the dialog's live preview is
   * a second full ranking of rows, and there is no reason to build it — or to
   * read the theme's colours off the DOM for it — on a visit that never
   * shares. Kept mounted afterwards so the close transition has something to
   * fade.
   */
  const [shareMounted, setShareMounted] = useState(false);
  const closeShare = useCallback(() => setShareOpen(false), []);

  const handleShareClick = () => {
    onShareClick?.();
    if (!share) return;
    setShareMounted(true);
    setShareOpen(true);
  };

  /*
   * The page's own host, read after mount rather than during render: there is
   * no `window` on the server, and a share card that rendered it into the
   * HTML would be baking one visitor's host into everyone's page.
   */
  const [host, setHost] = useState("");
  useEffect(() => {
    setHost(window.location.host);
  }, []);

  /** What gets painted onto the shared image — the top five, and where they came from. */
  const shareContent = useMemo<ShareCardContent>(
    () => ({
      brand: appTitle,
      electionName,
      calculatorName,
      title: t("title"),
      winnerLabel: t("winner"),
      entries: matches.slice(0, COLLAPSED_RESULTS).map(({ candidate, match, order }, index) => {
        // The largest picture worth the bytes: the card's rows are zoomed
        // almost three times, where the row's own `xs` would go soft.
        const picture = candidate.avatar?.urls.md ?? candidate.avatar?.urls.sm ?? candidate.avatar?.urls.original;
        return {
          // A candidate nobody could compare has no order, only a place in
          // the list — but they sit after everybody who does, so the index
          // is always a number the reader would agree with.
          rank: order ?? index + 1,
          // The short name, as the prototype's card does — five rows at export
          // size have no room for "Svoboda a přímá demokracie" — while the
          // hashed party colour stays seeded from the full name, so the card
          // and the rows on this screen agree on every party's accent.
          name: candidate.shortName ?? candidate.name,
          seed: candidate.name,
          // Routed through the app's same-origin proxy here only: the canvas
          // export needs readable pixels, everywhere else on this screen
          // keeps loading the CDN directly.
          avatarUrl: picture && share?.assetUrl ? share.assetUrl(picture) : picture,
          ...(match === undefined ? { noAnswerLabel: t("noAnswer") } : { percentLabel: formatPercent(match), matchPercentage: match }),
        };
      }),
      url: host,
    }),
    [appTitle, electionName, calculatorName, t, matches, share, formatPercent, host],
  );

  const header = <AppHeader title={appTitle} electionName={electionName} calculatorName={calculatorName} href={attributionHref} logoMonochrome={logoMonochrome} actions={headerActions} />;

  if (!waited) {
    return (
      // Inside the shell like every other screen: the header and the backdrop
      // carrying straight through is what makes this read as a moment in the
      // flow rather than the app blinking out and coming back.
      <Shell scroll="document" header={header}>
        <main className={calculatingClasses}>
          <Calculating label={t("calculating")} />
        </main>
      </Shell>
    );
  }

  if (answered === 0) {
    return (
      <Screen
        header={header}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        footer={
          <StickyBar>
            <Button variant="solid" color="neutral" size="large" onClick={onBackClick}>
              {t("emptyAction")}
            </Button>
          </StickyBar>
        }
      >
        <div />
      </Screen>
    );
  }

  return (
    /* The ranking is read, not acted on: scrolling the document is what lets
       it carry on under Safari's glass rather than stop in a line above it. */
    <Shell scroll="document" header={header}>
      <main className={screenClasses}>
        <div className={innerClasses}>
          <header className={headClasses}>
            {shared ? (
              /*
                Said before the ranking, not after it: someone arriving from a
                link needs to know whose numbers these are before they read
                them, and needs to know their own answers are safe before they
                touch anything.
              */
              <p className={sharedNoteClasses}>{t("sharedNote")}</p>
            ) : (
              <span className={headBackClasses}>
                <Button variant="plate" size="small" iconStart={icons.chevronLeftThin} onClick={onBackClick}>
                  {t("backToRecap")}
                </Button>
              </span>
            )}

            {/*
              No standing caveat under the title. That the match rests only on
              answered questions is still stated where it can be acted on —
              the dashboard's donut counts "Bez odpovědi" explicitly, and a
              candidate who answered nothing says so on their own row.
            */}
            <h1 className={titleClasses}>{shared ? t("sharedTitle") : t("title")}</h1>

            {/* Not on a shared result: the answers on this screen aren't the
                visitor's, so "svoje odpovědi" would be a false promise. */}
            {shared ? null : <p className={listHintClasses}>{t("listHint")}</p>}

            <div className={shareBoxClasses}>
              {shared ? (
                /* The only thing this page asks of its visitor. */
                <Button variant="solid" color="neutral" size="small" iconEnd={icons.arrowRight} onClick={onStartOwnClick}>
                  {t("sharedCta")}
                </Button>
              ) : (
                /*
                  Opens the app's share surface rather than copying a link on
                  the spot: a ranking is a thing people post, and a URL is not.
                */
                <Button variant="plate" size="small" iconStart={icons.share} onClick={handleShareClick}>
                  {t("share")}
                </Button>
              )}
            </div>
          </header>

          <div className={panesClasses}>
            <div className={listPaneClasses}>
              {showViewSwitch ? (
                <div className={viewClasses}>
                  <FilterChips
                    label={t("viewLabel")}
                    options={[
                      { id: "lists", label: t("viewLists") },
                      { id: "people", label: t("viewPeople") },
                    ]}
                    value={showOnlyNested ? "people" : "lists"}
                    /* The rows swap wholesale, and the one that was open is
                       not among the new ones — so its comparison goes too,
                       rather than lingering over a list it is not in. */
                    onChange={(id) => {
                      setShowOnlyNested(id === "people");
                      setSelectedId(undefined);
                    }}
                  />
                </div>
              ) : null}

              <ul className={listClasses}>
                {donateCard && donateCardPosition === 0 ? <li className={donateItemClasses}>{donateCard}</li> : null}

                {visibleMatches.map(({ candidate, match, order, respondent }, index) => (
                  <Fragment key={candidate.id}>
                    <MatchRow
                      rank={order}
                      /* The full name, as 2026 heads its rows: "Svoboda a přímá demokracie",
                         with "SPD" kept for the comparison pane's tighter places. */
                      name={candidate.name}
                      avatarImage={candidate.avatar?.urls}
                      matchPercentage={match}
                      percentLabel={match === undefined ? undefined : formatPercent(match)}
                      noAnswerLabel={t("noAnswer")}
                      winner={order === 1}
                      winnerLabel={t("winner")}
                      /* A row filled in from public sources by an expert says so — the platform's data carries the distinction, 2026's did not. */
                      note={respondent === "expert" ? t("expertNote") : undefined}
                      selected={candidate.id === selectedId}
                      onSelect={() => setSelectedId(candidate.id)}
                      /* Reversed, so the list assembles from the bottom and the top
                         match is the last thing to land — unless this session has
                         already watched it land once. */
                      delay={revisit ? SKIP_ENTRANCE_DELAY : (visibleMatches.length - 1 - index) * ROW_STAGGER}
                    />
                    {donateCard && donateCardPosition !== false && donateCardPosition > 0 && index === donateCardPosition - 1 ? <li className={donateItemClasses}>{donateCard}</li> : null}
                  </Fragment>
                ))}
              </ul>

              {/*
                The tail of the ranking is offered, not shown: places six and
                down are rarely what anyone came for, and folding them is what
                makes room to offer the question-centric view instead. One-way —
                a ranking that re-folds under the reader is worse than a long
                one. The comparison link stays after expanding; only a shared
                result drops it, since that view compares the *visitor's* store
                against a ranking that isn't theirs.
              */}
              {hiddenMatches > 0 || !shared ? (
                <div className={listActionsClasses}>
                  {hiddenMatches > 0 ? (
                    <Button variant="surface" onClick={() => setShowAllParties(true)}>
                      {t("showMoreParties")} ({hiddenMatches})
                    </Button>
                  ) : null}

                  {shared || !onCompareClick ? null : (
                    <Button variant="surface" iconEnd={icons.arrowRight} onClick={onCompareClick}>
                      {t("compareAnswers")}
                    </Button>
                  )}
                </div>
              ) : null}
            </div>

            {/*
              The right pane: the dashboard flowing under the list on a phone
              and a column of its own from `lg` — until a row is picked, when
              the same box holds that candidate's comparison instead (a sheet
              over the ranking on a phone, the column beside it on a desktop).
            */}
            <ComparisonPane matches={matches} selectedId={selectedId} onClose={closeComparison} formatPercent={formatPercent}>
              <ResultsDashboard
                distribution={distribution}
                topics={topics}
                important={important}
                againstTheGrain={againstTheGrain}
                prompt={prompt}
                formatPercent={formatPercent}
                onCompareTopicClick={shared ? undefined : onCompareTopicClick}
                onCompareImportantClick={shared ? undefined : onCompareImportantClick}
              />
            </ComparisonPane>
          </div>
        </div>
      </main>

      {/*
        Never on a shared result — there is no "Sdílet" to mount it from, and
        the guard says so outright: the card would be a copy of somebody
        else's ranking, and the link would be minted from *the visitor's*
        session for this calculator, which they have no reason to have.
      */}
      {!shared && share && shareMounted ? (
        <ShareDialog
          open={shareOpen}
          onClose={closeShare}
          content={shareContent}
          fileName={`shoda-${calculator.id}`}
          shareUrl={share.url}
          onRequestShareLink={share.onRequestShareLink}
          onShared={share.onShared}
        />
      ) : null}
    </Shell>
  );
}
