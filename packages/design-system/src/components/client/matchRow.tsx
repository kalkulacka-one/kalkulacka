"use client";

// Ported from kalkulacka-2026/packages/ui/src/match-row/match-row.tsx and match-row.module.css
import { partyColor, twMerge } from "../../utilities";
import { Avatar, type ImageUrls } from "../server/avatar";
import { Meter } from "../server/progressBar";
import { Tag } from "../server/tag";

export type MatchRowProps = {
  /** 1-based position among candidates that could be compared. */
  rank?: number;
  name: string;
  avatarUrl?: string;
  /** The legacy responsive picture set, for candidates loaded through the existing data layer. */
  avatarImage?: ImageUrls;
  /** The candidate's own accent colour — from data, or derived server-side from the logo. */
  color?: string;
  /** Seeds the palette pick when no colour is given; defaults to `name`. The share card passes the full name here while showing the short one, so both surfaces agree on a party's colour. */
  seed?: string;
  /** 0–100, or `undefined` for a candidate who never answered. */
  matchPercentage?: number;
  /** Pre-formatted, e.g. "74 %" — number formatting is locale work, so it happens above. */
  percentLabel?: string;
  /** Shown instead of a percentage, e.g. "Neodpověděli". */
  noAnswerLabel: string;
  /** The top match: larger, and captioned. */
  winner?: boolean;
  /** The winner's caption, e.g. "Největší shoda". */
  winnerLabel?: string;
  /**
   * A caption under the name, e.g. "Postoje podle veřejných zdrojů, strana
   * neodpověděla na zaslané otázky." — how the platform says a row's answers
   * were filled in by an expert rather than the candidate. Not in the 2026
   * row, whose data never carried the distinction; the app passes it only for
   * the rows it applies to.
   */
  note?: string;
  /** Whether this row's comparison is the one currently open. */
  selected?: boolean;
  onSelect: () => void;
  /**
   * Seconds before the row rises into place. Ignored under reduced motion. A
   * negative delay (`-1` for a result already shown once) is an entrance that
   * has already finished: the row is simply there.
   */
  delay?: number;
};

/* The bar along the top edge, shared by the Meter and the padding compensation below. */
const EDGE_HEIGHT = "0.3125rem";

/*
 * The row rises into place from below (`--ko-animate-match-row-rise`, in
 * `styles.css`), and the list staggers the delays so the ranking assembles
 * bottom-up with the winner landing last.
 *
 * Everything about how the card answers a pointer — the hover lift, the press,
 * the float while its comparison is open — is `.ko-pressable` in `styles.css`,
 * carried on this element in the markup. It is the outer one, which is what the
 * utility wants: the button inside clips its own shadow (see `rowClasses`), and
 * hover/active propagate up to here from it anyway.
 *
 * Radius matches the brand's signature asymmetric card (square top-left,
 * rounded elsewhere), scaled to this row's size via `--ko-radius-control`
 * rather than the fixed 30px the big question card uses.
 */
const itemClasses = "ko:list-none ko:flex ko:rounded-[0_var(--ko-radius-control)_var(--ko-radius-control)_var(--ko-radius-control)] ko:animate-match-row-rise ko:motion-reduce:animate-none";

/*
 * `overflow-hidden` clips the top-edge bar to the card's rounded corners — and
 * that is *all* it does. It cannot also carry the box-shadow: an element's own
 * `overflow: hidden` clips its own box-shadow along with its content, which is
 * what silently cropped every row's shadow before. The shadow lives on the
 * `<li>` (`.ko-pressable`), which has no overflow of its own and can show it in
 * full; `rounded-[inherit]` keeps the two shapes identical without repeating
 * the asymmetric formula twice.
 */
const rowClasses = [
  "ko:relative ko:overflow-hidden ko:rounded-[inherit]",
  "ko:grid ko:grid-cols-[auto_minmax(0,1fr)_auto] ko:items-center ko:gap-4",
  "ko:w-full ko:p-4",
  "ko:border-0 ko:bg-surface ko:text-left ko:cursor-pointer",
  "ko:transition-[background-color] ko:duration-[var(--ko-duration-base)] ko:ease-[ease]",
  "ko:focus-visible:outline-3 ko:focus-visible:outline-offset-2 ko:focus-visible:outline-focus/55",
  /*
   * The open comparison's row: a wash tint over the surface rather than a ring
   * drawn around it — a coloured border reads as decoration competing with the
   * match bar above it, where a tinted card reads as a state the card itself is
   * in. Layered over the solid surface colour rather than swapped in for it:
   * the wash is translucent, and a bare `background: wash` leaves the row
   * seeing through to whatever sits behind it in the stack — including its own
   * and its neighbours' shadows — which showed up as a smudged halo at the
   * corners. A flat gradient is how a colour becomes a *layer*: the source
   * wrote `background: <wash>, <surface>`, which is not valid shorthand (only
   * the final layer may be a colour) and never painted. The scale and the
   * lifted shadow are `.ko-pressable`'s, on the `<li>`.
   */
  "ko:aria-pressed:bg-[linear-gradient(oklch(from_var(--row-accent,var(--ko-color-agree))_l_c_h_/_0.14),oklch(from_var(--row-accent,var(--ko-color-agree))_l_c_h_/_0.14))]",
  /*
   * A candidate who answered nothing can't be compared, so there is no
   * comparison to open. The row still lists them — being absent from the
   * results entirely would be its own kind of misrepresentation — it just
   * isn't a button that does anything. Outlined rather than blanked out:
   * stripping the surface entirely left this row floating on the page with
   * nothing to read against — on the dark theme it all but disappeared, which
   * is the opposite of the point. A party that answered nothing has to be
   * visibly *present and unrankable*, not visibly missing.
   */
  "ko:disabled:cursor-default ko:disabled:bg-surface/40 ko:disabled:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
].join(" ");

/*
 * The bar eats into the top padding, so equal paddings left the contents
 * sitting visibly high on the card. Compensated by exactly the bar's height —
 * and only on rows that have a bar: the no-answer row draws none and needs
 * none. Desktop gets the room: the ranking is the answer this screen exists to
 * give, and on a phone the same padding would spend the whole viewport on four
 * rows. The top match is bigger, not differently built — the same row one step
 * up in scale, so it reads as the head of this list rather than a separate
 * kind of card above it.
 */
const paddingClasses = {
  default: {
    plain: "ko:p-4 ko:lg:p-6",
    edged: `ko:p-4 ko:pt-[calc(1rem_+_${EDGE_HEIGHT})] ko:lg:p-6 ko:lg:pt-[calc(1.5rem_+_${EDGE_HEIGHT})]`,
  },
  winner: {
    plain: "ko:px-4 ko:py-6 ko:lg:px-6 ko:lg:py-8",
    edged: `ko:px-4 ko:py-6 ko:pt-[calc(1.5rem_+_${EDGE_HEIGHT})] ko:lg:px-6 ko:lg:py-8 ko:lg:pt-[calc(2rem_+_${EDGE_HEIGHT})]`,
  },
} as const;

/*
 * The unfilled remainder has to stay visible, or the bar reads as a stripe of
 * arbitrary length rather than a proportion of something. `surface-sunken` is
 * near-invisible against a dark card; the border tone holds in both modes. So
 * the Meter is squared off, recoloured and pinned to the top edge here.
 */
const edgeClasses = "ko:absolute ko:inset-x-0 ko:top-0 ko:rounded-none ko:bg-border";

const identityClasses = "ko:flex ko:flex-col ko:items-start ko:gap-1 ko:min-w-0";
const nameLineClasses = "ko:flex ko:items-baseline ko:gap-1.5 ko:min-w-0";

/* An ordinal in front of the name; the avatar stays clean. */
const rankClasses = "ko:flex-none ko:font-sans ko:text-[0.8125rem] ko:font-bold ko:text-text-muted ko:tabular-nums";

/* Party names in the archive run to 85 characters. Two lines is the ceiling;
   past that the rows stop sharing a rhythm and the ranking is hard to scan. */
const nameClasses = "ko:min-w-0 ko:font-sans ko:text-sm ko:font-semibold ko:leading-[1.3] ko:tracking-[-0.01em] ko:text-text-strong ko:line-clamp-2";
const winnerNameClasses = "ko:text-base";

/* Only ever inside a disabled row, so always in the subtle ink the source gave it there. */
const noAnswerClasses = "ko:font-sans ko:text-xs ko:text-text-subtle";

/* The expert note: a caption on the name, in the muted ink a live row can carry. */
const noteClasses = "ko:font-sans ko:text-xs ko:leading-[1.35] ko:text-text-muted ko:text-pretty";

const percentClasses = "ko:font-display ko:text-xl ko:font-bold ko:tracking-[-0.01em] ko:text-text-strong ko:tabular-nums ko:whitespace-nowrap";
const winnerPercentClasses = "ko:text-2xl";

/**
 * One candidate in the ranking.
 *
 * The percentage is drawn as a bar along the card's top edge rather than inside
 * it. Two reasons, and the second is the important one: it frees the card's
 * interior for whitespace, and — because every card in the column is the same
 * width — every bar is measured against the same scale. Sitting inside the
 * layout, the winner's bar shared a row with a larger avatar and a larger
 * number, so the widest match drew the *shortest* bar.
 *
 * Circles are spent on the avatar, where they identify rather than measure.
 *
 * A candidate who answered nothing gets no bar and no percentage: showing 0 %
 * would read as "opposed on everything" when the truth is "nothing to compare",
 * and that distinction is the difference between a fair result and a libel.
 */
export function MatchRow({
  rank,
  name,
  avatarUrl,
  avatarImage,
  color,
  seed,
  matchPercentage,
  percentLabel,
  noAnswerLabel,
  winner = false,
  winnerLabel,
  note,
  selected = false,
  onSelect,
  delay = 0,
}: MatchRowProps) {
  const comparable = matchPercentage !== undefined;
  /*
   * `color` carries the data colour or the server-derived one when the
   * candidate has either; `partyColor` falls back to its seeded palette
   * otherwise, which is also what covers every party with no picture at all.
   */
  const accent = partyColor(seed ?? name, color);
  const padding = paddingClasses[winner ? "winner" : "default"][comparable ? "edged" : "plain"];

  return (
    <li
      /*
       * A candidate nobody can compare doesn't float above the page like an
       * answer card, and doesn't answer the pointer at all — so it simply
       * isn't pressable. The source kept the class and overrode its shadow
       * and transform at rest and on hover; leaving it off is the same thing
       * said once.
       *
       * The float belongs to the whole card; `aria-pressed` belongs on the
       * button that opens the comparison. `data-open` is what joins them —
       * see `.ko-pressable` in `styles.css`.
       */
      className={twMerge(itemClasses, comparable && "ko-pressable")}
      data-open={selected && comparable ? "" : undefined}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      <button type="button" className={twMerge(rowClasses, padding)} aria-pressed={selected} onClick={onSelect} disabled={!comparable} style={{ "--row-accent": accent } as React.CSSProperties}>
        {/* Decorative: the percentage is text a few pixels away, and a screen
            reader announcing the bar as well would read the same number twice —
            the unlabelled Meter is `aria-hidden` on its own. */}
        {comparable ? <Meter value={matchPercentage} size="small" accent={accent} delay={delay} className={edgeClasses} /> : null}

        <Avatar name={name} src={avatarUrl} image={avatarImage} accent={accent} size={winner ? "large" : "medium"} />

        <span className={identityClasses}>
          {winner && winnerLabel ? <Tag tone="neutral">{winnerLabel}</Tag> : null}
          {/* The rank rides the name as an ordinal — "2." is how Czech writes
              one — rather than sitting in its own column, which spent a whole
              grid track on one or two digits. An unranked candidate simply has
              no ordinal: a bold "–" would shout on the one row that is meant
              to stay quiet. */}
          <span className={nameLineClasses}>
            {rank === undefined ? null : <span className={rankClasses}>{rank}.</span>}
            <span className={twMerge(nameClasses, winner && winnerNameClasses)}>{name}</span>
          </span>
          {comparable ? null : <span className={noAnswerClasses}>{noAnswerLabel}</span>}
          {note ? <span className={noteClasses}>{note}</span> : null}
        </span>

        <span className={twMerge(percentClasses, winner && winnerPercentClasses)}>{comparable ? percentLabel : null}</span>
      </button>
    </li>
  );
}
