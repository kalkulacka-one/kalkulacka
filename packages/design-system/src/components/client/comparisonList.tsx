"use client";

// Ported from kalkulacka-2026/packages/ui/src/comparison-list/comparison-list.tsx and comparison-list.module.css
import { icons } from "../icons";
import { AnswerMark, type AnswerMarkTone } from "../server/answerMark";
import { VisuallyHidden } from "../server/visuallyHidden";
import { Icon } from "./icon";

/** One recorded position — the tone that draws the mark, and the words a screen reader gets instead of it. */
export type ComparisonAnswer = {
  tone: AnswerMarkTone;
  /** How the answer reads aloud, e.g. "Ano" — the mark is a bare coloured circle, so this string *is* the answer. */
  label: string;
};

export type ComparisonRow = {
  /** Stable across re-renders — the question's id. */
  id: string;
  statement: string;
  /** The user's recorded position. */
  user: ComparisonAnswer;
  /** The candidate's. */
  candidate: ComparisonAnswer;
  /** The user marked this one "pro mě důležité". */
  important?: boolean;
  /** The candidate's own justification, where they left one. */
  comment?: string;
};

export type ComparisonListProps = {
  rows: ComparisonRow[];
  labels: {
    /** Column heading over the user's answers, e.g. "Vy". */
    you: string;
    /** Column heading over the candidate's — usually their short name. */
    candidate: string;
    /** Accessible marker for a starred question, e.g. "Pro mě důležité". */
    important: string;
  };
  /**
   * Changing this remounts the row list, replaying its entrance animation —
   * the same `key={filter}` trick the recap uses so switching "Shody" to
   * "Neshody" reads as a new result landing rather than a silent swap.
   */
  resetKey?: string | number;
};

/*
 * The list owns its own inset rather than being padded by whatever contains it.
 *
 * That is what lets the column heading below be *sticky and full-bleed*: it
 * cancels this padding with a negative margin so its background reaches both
 * edges of the scroll container. Padded from outside instead, the heading could
 * only ever be as wide as the text column, and rows slid past in the gap beside
 * it — which is exactly how it looked before.
 */
const wrapClasses = "ko:px-6 ko:pb-6";

/* The two fixed mark columns beside the statement, shared by the heading and every row so the circles line up. */
const columnsClasses = "ko:grid ko:grid-cols-[minmax(0,1fr)_1.5rem_1.5rem] ko:gap-4";

/*
 * Nearly opaque, not merely tinted. The sheet this sits in is itself
 * translucent, so a heading at 0.8 was glass over glass and the statements
 * scrolling underneath read straight through the column labels. Enough alpha
 * to stay a surface, with the blur doing the rest.
 */
const headClasses = `${columnsClasses} ko:sticky ko:top-0 ko:z-1 ko:-mx-6 ko:px-6 ko:pt-4 ko:pb-3 ko:bg-surface/95 ko:backdrop-blur-[12px] ko:backdrop-saturate-[1.4]`;

const headLabelClasses = "ko:min-w-0 ko:font-sans ko:text-[0.6875rem] ko:font-semibold ko:tracking-[0.02em] ko:uppercase ko:text-text-muted";

/* The shorter of the two, so it stays put in its own column rather than
   needing the room the candidate's claims — the two now sit on one line
   instead of the candidate's being pushed to a row of its own to avoid
   overlapping it. */
const headYouClasses = `${headLabelClasses} ko:col-start-3 ko:text-center`;

/* Spans the statement column and the candidate's own mark column, so a long
   party name extends leftward into the statement's empty space instead of
   being clipped — and stops short of "Vy"'s column so the two share one line
   rather than one wrapping under the other. Right-aligned so a short name
   still sits next to the mark column it labels rather than drifting off
   toward the statement side. */
const headCandidateClasses = `${headLabelClasses} ko:col-start-1 ko:col-end-3 ko:text-right ko:overflow-hidden ko:text-ellipsis ko:whitespace-nowrap`;

/*
 * Replayed whenever the caller changes `resetKey` (the comparison pane does
 * this on every filter switch) — the same small entrance the recap's own list
 * plays on a filter change (`--ko-animate-recap-list-in`), so "Shody" swapping
 * in over "Vše" reads as a new result landing rather than a silent content
 * swap.
 */
const listClasses = "ko:flex ko:flex-col ko:m-0 ko:p-0 ko:list-none ko:animate-recap-list-in ko:motion-reduce:animate-none";

const rowClasses = `${columnsClasses} ko:items-start ko:gap-y-3 ko:py-4 ko:border-b-[1.5px] ko:border-border ko:last:border-b-0`;

/* `pt-0.5` optically centres the first line against its pair of marks. */
const statementClasses = "ko:col-start-1 ko:m-0 ko:min-w-0 ko:pt-0.5 ko:font-sans ko:text-sm ko:leading-[1.45] ko:text-text";

const starClasses = "ko:inline ko:size-[13px] ko:align-[-0.15em] ko:mr-1.5 ko:text-text-muted";

/*
 * The party's own words.
 *
 * Full width on a phone — the whole row, including the space under the marks —
 * rather than indented into the statement's column. At that width the column is
 * already narrow enough that a quotation set inside it wrapped every four or
 * five words. Once there is width for it (`xs`, 34rem), the comment tucks
 * under the statement it belongs to; the marks' columns stay clear, which
 * keeps the two circles reading as one uninterrupted vertical pair down the
 * whole list.
 *
 * Marked by a quotation mark set as a watermark rather than by a rule down the
 * left. A border is the same device the statement's own column edge uses, so the
 * two competed; a quote says "someone is speaking" on its own, which is exactly
 * the distinction being drawn.
 *
 * The raised opening mark, not Czech's low one. Czech opens a quotation on the
 * baseline, which is right when the marks actually bracket the text — but this
 * is a watermark with no closing partner, and a baseline glyph at this size
 * hung level with the paragraph's second line and read as debris in the
 * margin. The raised shape sits where a drop cap would and is the one people
 * parse as "quoted". Off the type scale on purpose (2.75rem): a watermark
 * glyph, drawn at whatever size balances the block it sits behind. It is never
 * read, so it is artwork that happens to be a character — decorative, and the
 * statement above already establishes whose answer this is.
 */
const commentClasses = [
  "ko:col-span-full ko:xs:col-span-1 ko:xs:col-start-1",
  "ko:relative ko:m-0 ko:pl-8",
  "ko:font-sans ko:text-[0.8125rem] ko:leading-[1.45] ko:text-text-muted ko:text-pretty",
  "ko:before:content-['“'] ko:before:absolute ko:before:left-0 ko:before:-top-2 ko:before:font-display ko:before:text-[2.75rem] ko:before:leading-none ko:before:text-text-muted/30 ko:before:pointer-events-none",
].join(" ");

/**
 * Answer-by-answer, the user against one candidate.
 *
 * The two positions lead the row as a pair of marks in fixed columns, so 42 rows
 * can be read straight down — where the two circles differ is the whole point of
 * the screen, and that pattern only emerges if they line up. They are the same
 * marks the recap uses, at the smaller size.
 *
 * Rows keep their original question order rather than being sorted by agreement:
 * this is a record of what was asked, and re-ordering it would make a candidate
 * look better or worse depending on which end you read first.
 */
export function ComparisonList({ rows, labels, resetKey }: ComparisonListProps) {
  return (
    <div className={wrapClasses}>
      {/*
        The candidate's column heading is allowed to run across the statement
        column rather than being truncated to the width of its circle: archive
        party names reach 85 characters, and clipping one to "SPOLEČN…" in the
        heading that identifies whose answers these are is worse than letting it
        extend into empty space. "Vy" needs no such room — it stays put in the
        one column it labels, which is what keeps this heading a single line
        instead of the two the previous, fully-overlapping layout wrapped to.
      */}
      <div className={headClasses} aria-hidden="true">
        <span className={headCandidateClasses}>{labels.candidate}</span>
        <span className={headYouClasses}>{labels.you}</span>
      </div>

      <ul className={listClasses} key={resetKey}>
        {rows.map((row) => (
          <li key={row.id} className={rowClasses}>
            <p className={statementClasses}>
              {/* The design system's own star — the same heavy mark the question
                  card and the recap wear for "pro mě důležité", not a text
                  asterisk standing in for it. */}
              {row.important ? <Icon icon={icons.star} size={null} filled decorative className={starClasses} /> : null}
              {row.statement}
              {row.important ? <VisuallyHidden> ({labels.important})</VisuallyHidden> : null}
            </p>

            <AnswerMark tone={row.candidate.tone} label={`${labels.candidate}: ${row.candidate.label}`} size="small" />
            <AnswerMark tone={row.user.tone} label={`${labels.you}: ${row.user.label}`} size="small" />

            {/*
              A grid child in its own right rather than nested under the
              statement: on a narrow screen it takes the full row, including the
              space beneath the marks, instead of being squeezed into the same
              column as the question it answers.
            */}
            {row.comment ? <p className={commentClasses}>{row.comment}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
