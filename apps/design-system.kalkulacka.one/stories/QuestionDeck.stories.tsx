import { type CardSelection, type QuestionCardContent, QuestionDeck, type QuestionDeckHandle, type QuestionDeckProps } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useRef, useState } from "react";

/* Three real questions from the 2026 Pardubice set. */
const QUESTIONS: [QuestionCardContent, QuestionCardContent, QuestionCardContent] = [
  {
    id: "q1",
    topic: "Energetika",
    title: "Omezení vánoční výzdoby",
    statement: "Město by mělo kvůli rostoucím cenám energie omezit veřejné slavnostní osvětlení v době Vánoc.",
    detail: "K podobnému kroku přistoupila například rakouská Vídeň. Na hlavním bulváru Ring kolem centra nebude vánoční osvětlení vůbec.",
  },
  {
    id: "q2",
    topic: "Veřejný pořádek",
    title: "Regulace zábavní pyrotechniky",
    statement: "Používání zábavní pyrotechniky jindy než na Silvestra má být ve městě zakázané.",
    detail: "V případě neregulace bývají problematické hlavně letní měsíce, kdy jsou ohňostroje součástí řady domácích oslav.",
  },
  {
    id: "q3",
    topic: "Bydlení",
    title: "Bytový fond",
    statement: "Město má budovat a udržovat vlastní bytový fond.",
    detail: "Odpůrci tvrdí, že soukromí majitelé se o nemovitosti postarají lépe.",
  },
];

const labels = {
  agree: "Ano",
  disagree: "Ne",
  important: "Pro mě důležité",
  importantSuffix: " · Pro mě důležité",
  skip: "Přeskočit",
};

const none: CardSelection = { agree: false, disagree: false, important: false };

/** The deck cycles, so every position resolves to one of the three. */
function questionAt(index: number): QuestionCardContent {
  return QUESTIONS[((index % QUESTIONS.length) + QUESTIONS.length) % QUESTIONS.length] ?? QUESTIONS[0];
}

/**
 * The deck fills whatever positioned box it is given — the flow's stage in
 * the app. The stage is the deck's own size, the buttons below it are the
 * story's.
 */
function Stage({ children }: { children: React.ReactNode }) {
  return <div style={{ position: "relative", width: "min(90vw, 34rem)", height: "33.75rem" }}>{children}</div>;
}

type HarnessProps = Pick<QuestionDeckProps, "labels" | "dragGuides" | "finished">;

/**
 * Fully interactive: drag the card left to agree, right to disagree, down to
 * skip, and up-and-across to also mark it important. Arrow keys do the same;
 * so do the buttons on the card. Answers are kept per question, so cycling
 * back round to a card shows what was recorded — and choosing the answer it
 * already has clears it, as the app's store does.
 */
function DeckHarness({ labels, dragGuides, finished }: HarnessProps) {
  const deck = useRef<QuestionDeckHandle>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CardSelection>>({});

  const current = questionAt(index);
  const selection = answers[current.id] ?? none;

  const advance = () => setIndex((i) => (i + 1) % QUESTIONS.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
      <Stage>
        <QuestionDeck
          ref={deck}
          current={current}
          next={questionAt(index + 1)}
          after={questionAt(index + 2)}
          selection={selection}
          labels={labels}
          dragGuides={dragGuides}
          finished={finished}
          onAnswer={(agree, important) => {
            const same = agree ? selection.agree : selection.disagree;
            if (same) {
              // Choosing the answer already given clears it; the deck did
              // not fly the card, so the story stays on it too.
              setAnswers((prev) => ({ ...prev, [current.id]: { ...selection, agree: false, disagree: false, important } }));
              return;
            }
            setAnswers((prev) => ({ ...prev, [current.id]: { agree, disagree: !agree, important } }));
            advance();
          }}
          onSkip={advance}
          onToggleImportant={() => setAnswers((prev) => ({ ...prev, [current.id]: { ...selection, important: !selection.important } }))}
        />
      </Stage>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", fontFamily: "var(--ko-font-sans)", fontSize: "0.875rem", color: "var(--ko-color-text-muted)" }}>
        <button
          type="button"
          onClick={() => {
            // What "Další" does in the app: the card lifts away and the next
            // one comes up, with nothing recorded.
            deck.current?.advance();
            advance();
          }}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "var(--ko-radius-pill)",
            border: "1.5px solid var(--ko-color-border)",
            background: "var(--ko-color-surface)",
            color: "var(--ko-color-text)",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Další (ref.advance)
        </button>
        <span>
          {index + 1}/{QUESTIONS.length} · {selection.agree ? "Ano" : selection.disagree ? "Ne" : "—"}
          {selection.important ? " ★" : ""}
        </span>
      </div>
    </div>
  );
}

const meta: Meta<typeof QuestionDeck> = {
  title: "Components/QuestionDeck",
  component: QuestionDeck,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    current: QUESTIONS[0],
    next: QUESTIONS[1],
    after: QUESTIONS[2],
    selection: none,
    labels,
    finished: false,
    dragGuides: undefined,
    onAnswer: () => {},
    onSkip: () => {},
    onToggleImportant: () => {},
  },
  argTypes: {
    finished: { control: "boolean" },
    dragGuides: {
      control: "select",
      options: ["off", "touch", "pointer"],
      mapping: {
        off: undefined,
        touch: { practised: new Set(["w"] as const) },
        pointer: { split: true, practised: new Set(["w"] as const) },
      },
      description: "The tutorial's compass over the card: icon-only on touch, split and labelled for a mouse. `w` starts practised, as it does after the first swipe.",
    },
    current: { control: false },
    next: { control: false },
    after: { control: false },
    selection: { control: false },
    labels: { control: "object" },
    onAnswer: { control: false },
    onSkip: { control: false },
    onToggleImportant: { control: false },
    ref: { control: false },
  },
  render: (args) => <DeckHarness labels={args.labels} dragGuides={args.dragGuides} finished={args.finished} />,
};

type QuestionDeckStory = StoryObj<typeof meta>;

/**
 * Drag left for "Ano", right for "Ne", down to skip, and lift while dragging
 * sideways to also mark the question important. The card that leaves is a
 * ghost; the next question is already under the pointer while it flies. Arrow
 * keys mirror every gesture. Pressing an answer the card already shows clears
 * it without leaving; switching to the other answer holds for a beat first.
 */
export const Interactive: QuestionDeckStory = {};

/**
 * The tutorial's practice deck: pills around the statement for every direction
 * the card can leave in, lighting up as a drag reaches them. "Ano" starts
 * faded here, as it does once it has been tried.
 */
export const WithDragGuides: QuestionDeckStory = {
  args: { dragGuides: { practised: new Set(["w"] as const) } },
};

/** The same compass under a mouse: diagonals split into two arrows, every pill labelled. */
export const WithSplitDragGuides: QuestionDeckStory = {
  args: { dragGuides: { split: true, practised: new Set(["w"] as const) } },
};

/**
 * The last answer has been committed and the screen is leaving: the stack
 * stays for the ghost to fly over, but no live card comes up and the keys and
 * the pointer are ignored.
 */
export const Finished: QuestionDeckStory = {
  args: { finished: true },
};

export default meta;
