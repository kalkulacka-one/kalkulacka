"use client";

// Ported from kalkulacka-2026/packages/ui/src/share-card/share-card-layout.tsx and share-card-layout.module.css
import { twMerge } from "../../../utilities";
import { AppHeader } from "../../server/appHeader";
import { MatchRow, type MatchRowProps } from "../matchRow";
import { CARD_SIZES, type CardFormat } from "./cardFormat";
import { type CardColorSet, type CardTheme, cardColorScheme, cardCssVars, css } from "./themeColors";

/** One line of the ranking. Purely presentational — no domain types here. */
export type ShareCardEntry = {
  rank: number;
  name: string;
  /** Seed for the hashed party colour when `color` is absent — the full name, so the card and the screen agree while the card shows the short one. */
  seed?: string;
  avatarUrl?: string;
  /** The candidate's own accent colour — from data, or derived server-side from the logo. */
  color?: string;
  /** Pre-formatted by the caller, so the locale's own percent shape survives ("63 %"). */
  percentLabel?: string;
  /** 0–100. Sets the bar's length; omitted for a candidate who answered nothing. */
  matchPercentage?: number;
  /** Shown in place of the percentage. */
  noAnswerLabel?: string;
};

/*
 * The lockup's three parts, kept separate rather than pre-joined into one
 * string: `AppHeader` splits the election's year off its type and sets the
 * type, the district and the year in different weights. Handing it a joined
 * "Komunální volby 2022 · Pardubice" would render one flat line with a
 * separator the app's own header has never had.
 */
export type ShareCardContent = {
  /** The product name — "Volební kalkulačka" — set next to the mark. */
  brand: string;
  /** e.g. "Komunální volby 2022". */
  electionName?: string;
  /** The district, e.g. "Pardubice". */
  calculatorName?: string;
  /** The card's own headline, e.g. "Moje shoda". */
  title: string;
  /** The top row's caption — e.g. "Největší shoda". */
  winnerLabel?: string;
  entries: readonly ShareCardEntry[];
  /** The site to type in. */
  url?: string;
};

const noop = () => {};

/** Never a real interaction: this list is a picture of a ranking, not one to open. */
function StaticMatchRow(props: Omit<MatchRowProps, "selected" | "onSelect">) {
  return <MatchRow {...props} selected={false} onSelect={noop} />;
}

/**
 * The wash behind the ranking.
 *
 * In 2026 this is a WebGL canvas painted at export resolution — the same
 * shader as the live backdrop, drawn once a few seconds in, where the blobs
 * have drifted into something with a direction to it — with the CSS gradient
 * below underneath it for a browser without WebGL. The shader is deferred
 * here together with the animated backdrop itself (see `Backdrop`), so the
 * fallback is the whole wash: the same radial layers `.ko-backdrop` paints,
 * mixed from the card's own palette rather than the page's tokens.
 *
 * Stronger than the live backdrop on purpose: on screen the wash sits
 * *behind* a page of opaque cards and has to stay quiet so it never competes
 * with them. Here it more or less *is* the picture — the only thing behind
 * the ranking — so it is allowed to read as deliberately colourful rather
 * than a hint of one.
 */
function Wash({ colors }: { colors: CardColorSet }) {
  return (
    <div
      className="ko:absolute ko:inset-0 ko:size-full ko:pointer-events-none"
      aria-hidden="true"
      style={{
        background: [
          `radial-gradient(60% 50% at 50% 45%, ${css(colors.surface, 0.6)}, transparent 70%)`,
          `radial-gradient(circle at 20% 25%, ${css(colors.agree, 0.28)}, transparent 55%)`,
          `radial-gradient(circle at 80% 75%, ${css(colors.disagree, 0.24)}, transparent 55%)`,
          css(colors.page),
        ].join(", "),
      }}
    />
  );
}

export type ShareCardLayoutProps = {
  content: ShareCardContent;
  colors: CardColorSet;
  theme: CardTheme;
  format: CardFormat;
};

/*
 * Everything below is sized with `zoom` rather than by overriding each
 * component's own font sizes and paddings.
 *
 * Those components are built for a phone viewport, and a share image is a
 * ~3× wider canvas that has to *read* at the same scale someone sees in the
 * app — so the whole lockup and the whole ranking are magnified bodily,
 * exactly as a screenshot of the app would be. Restyling them piecemeal would
 * mean re-deciding every size the design system has already decided, and
 * re-deciding them again the next time the app's own sizes move.
 *
 * `zoom` and not `transform: scale`: a transformed box keeps its *pre*-scale
 * footprint in flow, so the layout would have to be told each block's real
 * height by hand. `zoom` reflows for real, and ordinary flexbox does the rest.
 *
 * The per-format numbers were the source's `--card-*` custom properties; they
 * are a record here because every one of them is an inline value anyway.
 */
type FormatMetrics = {
  pad: string;
  headGap: string;
  brandZoom: number;
  titleSize: string;
  rowsZoom: number;
  rowGap: string;
  footSize: string;
};

const METRICS: Record<CardFormat, FormatMetrics> = {
  /*
   * Story: the head belongs *with* the ranking, not stranded at the top edge
   * above a field of empty wash — two `margin-top: auto` (the head's and the
   * url's) split the slack evenly, which drops the head-and-list group into
   * the middle of the card and leaves the url alone on the bottom line.
   */
  story: { pad: "3.5rem", headGap: "2.5rem", brandZoom: 3.4, titleSize: "6.25rem", rowsZoom: 2.8, rowGap: "0.75rem", footSize: "2rem" },
  /*
   * Landscape: header as a left column, ranking as a right one — the same
   * two-pane shape the results screen itself uses above its own 64rem
   * breakpoint. Height is the binding constraint at 16:9, so the ranking
   * zooms less here than in the story: five rows have 936px to live in
   * rather than most of 1792.
   *
   * The brand zoom is lower than the story's, and not a taste call:
   * `AppHeader`'s subtitle is `white-space: nowrap` with an ellipsis, sized
   * for a full-width bar. Zoomed inside a column this narrow it runs out of
   * room and clips to "Komunální volby Pardubic…", so the zoom is capped at
   * what the longest of those lines actually fits in — 2.5 in the source,
   * whose longest line was that one; 2.2 here, where "Sněmovní volby Volební
   * kalkulačka 2025" has to fit the same column.
   */
  landscape: { pad: "4rem", headGap: "1.75rem", brandZoom: 2.2, titleSize: "5.5rem", rowsZoom: 1.95, rowGap: "0.625rem", footSize: "2rem" },
};

/**
 * The header's type, pinned. `AppHeader` sets its names in `text-fluid-brand`,
 * a viewport-fluid clamp (11px on a phone, 13px on a wide monitor) — right
 * for a bar that frames the page, wrong for a card that is exported at a
 * fixed 1080/1920px and has to come out the same from every device: at the
 * desktop size the zoomed subtitle overran its column and clipped to
 * "Sněmovní volby Volební kalkulačka 20…", while the phone export of the same
 * result fit. The phone value is the one the zooms above were tuned against.
 * Same story for the row's control radius, which is fluid for the same
 * reason.
 */
const PINNED_TOKENS = {
  "--ko-text-fluid-brand": "11px",
  "--ko-radius-control": "16px",
} as const;

/*
 * True export pixel size, set inline by the caller. Square corners — this is
 * the bleed of the exported PNG itself; a phone-frame rounding belongs to the
 * dialog's *preview* wrapper, one level up, not to the picture that gets saved.
 */
const cardClasses = "ko:relative ko:overflow-hidden ko:bg-page ko:text-text";

const contentClasses = {
  story: "ko:relative ko:flex ko:flex-col ko:h-full ko:box-border",
  /* Left column: the head centred in the tall row, url on the line below.
     Right column ignores both and spans the full height. */
  landscape: "ko:relative ko:grid ko:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] ko:grid-rows-[1fr_auto] ko:gap-x-14 ko:h-full ko:box-border",
} as const;

/* The lockup and the headline travel together — they are one block of type,
   and both layouts place them as one. */
const headClasses = {
  story: "ko:flex ko:flex-col ko:mt-auto ko:mb-10",
  landscape: "ko:flex ko:flex-col ko:col-start-1 ko:row-start-1 ko:self-center",
} as const;

/*
 * The results screen's own title, to the letter — `font-family`, weight,
 * tracking, leading and colour all match `result-page.tsx`'s title. The one
 * deliberate departure is size: that token is a `vw`-fluid clamp, and a card
 * exported at a fixed 1080/1920px has to look the same regardless of which
 * device happened to render it, so this uses a fixed size per format instead
 * of following the viewport it's captured from.
 */
const titleClasses = "ko:m-0 ko:font-display ko:font-bold ko:tracking-[-0.045em] ko:leading-[1.1] ko:text-text";

const rowsClasses = {
  story: "ko:list-none ko:m-0 ko:p-0 ko:flex ko:flex-col ko:pointer-events-none",
  landscape: "ko:list-none ko:m-0 ko:p-0 ko:flex ko:flex-col ko:pointer-events-none ko:col-start-2 ko:row-start-1 ko:row-span-2 ko:self-center",
} as const;

const urlClasses = {
  story: "ko:m-0 ko:font-sans ko:font-medium ko:text-text ko:mt-auto",
  landscape: "ko:m-0 ko:font-sans ko:font-medium ko:text-text ko:col-start-1 ko:row-start-2",
} as const;

/**
 * The card, at true export pixel size.
 *
 * Built entirely from the app's own components — `MatchRow`, `Avatar`,
 * `Logo` — rather than redrawn: a candidate's picture, the ranking's
 * typography and its match bar all come from the same source the results
 * screen itself renders from, so the two cannot drift apart the way a second,
 * hand-painted implementation eventually would.
 *
 * Rasterised by the caller (`renderShareCard`) via `html-to-image`; rendered
 * as-is (scaled down with a CSS `transform`) for the dialog's live preview,
 * which is why this component itself knows nothing about either job.
 */
export function ShareCardLayout({ content, colors, theme, format }: ShareCardLayoutProps) {
  const { width, height } = CARD_SIZES[format];
  const metrics = METRICS[format];

  return (
    <div className={cardClasses} data-format={format} data-ko-theme-scope="" style={{ width, height, ...PINNED_TOKENS, ...cardCssVars(colors, cardColorScheme(theme)) }}>
      <Wash colors={colors} />

      <div className={contentClasses[format]} style={{ padding: metrics.pad }}>
        {/*
          Literally the app's own header, not a copy of it — so the mark, the
          weights, and the un-separated "Komunální volby Pardubice 2022" line
          are the ones every screen already shows. It is sized by `zoom` on the
          wrapper rather than by props, because `AppHeader` pins its own mark
          to 12px and its type to a viewport-fluid token: neither is a knob,
          and both need to grow together anyway.
        */}
        <div className={headClasses[format]} style={{ gap: metrics.headGap }}>
          <div style={{ zoom: metrics.brandZoom }}>
            <AppHeader title={content.brand} electionName={content.electionName} calculatorName={content.calculatorName} />
          </div>
          <h2 className={titleClasses} style={{ fontSize: metrics.titleSize }}>
            {content.title}
          </h2>
        </div>

        {/* `pointer-events: none` — this is a picture of the list, not the list. */}
        <ul className={twMerge(rowsClasses[format])} style={{ gap: metrics.rowGap, zoom: metrics.rowsZoom }}>
          {content.entries.map((entry) => (
            <StaticMatchRow
              key={`${entry.rank}-${entry.name}`}
              rank={entry.rank}
              seed={entry.seed}
              name={entry.name}
              avatarUrl={entry.avatarUrl}
              color={entry.color}
              matchPercentage={entry.matchPercentage}
              percentLabel={entry.percentLabel}
              noAnswerLabel={entry.noAnswerLabel ?? ""}
              winner={entry.rank === 1}
              winnerLabel={entry.rank === 1 ? content.winnerLabel : undefined}
            />
          ))}
        </ul>

        {content.url ? (
          <p className={urlClasses[format]} style={{ fontSize: metrics.footSize }}>
            {content.url}
          </p>
        ) : null}
      </div>
    </div>
  );
}
