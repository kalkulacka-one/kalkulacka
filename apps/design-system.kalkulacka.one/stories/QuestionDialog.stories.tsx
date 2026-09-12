// Ported from kalkulacka-2026/packages/ui/src/question-dialog/question-dialog.stories.tsx
import { type CardSelection, QuestionDialog, type QuestionDialogLabels, RecapRow } from "@kalkulacka-one/design-system/client";
import type { AnswerMarkTone } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const QUESTION = {
  id: "q-21",
  statement: "Město by mělo kvůli rostoucím cenám energie omezit veřejné slavnostní osvětlení v době Vánoc.",
  title: "Omezení vánoční výzdoby",
  detail: "Vánoční osvětlení stojí město zhruba 1,2 milionu korun ročně. Část zastupitelů navrhuje jeho omezení, jiní upozorňují na dopad na centrum města.",
  topic: "Energetika",
};

const labels: QuestionDialogLabels = {
  agree: "Ano",
  disagree: "Ne",
  important: "Pro mě důležité",
  skip: "Přeskočit",
  close: "Zavřít",
};

const none: CardSelection = { agree: false, disagree: false, important: false };

/**
 * The recap in miniature: one row, and the dialog it opens. Answering in the
 * dialog is written back to the row — a new answer flies the card out and
 * closes it, a re-chosen answer clears it and keeps the dialog open (which is
 * the one moment "Přeskočit" appears under the card), a skip flies it down and
 * marks the row as passed over.
 */
function RecapHarness({ labels, initialSelection = none }: { labels: QuestionDialogLabels; initialSelection?: CardSelection }) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<CardSelection>(initialSelection);
  const [skipped, setSkipped] = useState(false);

  const tone: AnswerMarkTone = selection.agree ? "agree" : selection.disagree ? "disagree" : "none";
  const answer = selection.agree ? labels.agree : selection.disagree ? labels.disagree : "Bez odpovědi";

  return (
    <div style={{ padding: "2rem", maxWidth: "28rem" }}>
      <ul style={{ display: "grid", gap: "0.5rem", margin: 0, padding: 0 }}>
        <RecapRow
          title={QUESTION.title}
          tone={tone}
          important={selection.important}
          skipped={skipped}
          labels={{ answer, important: labels.important }}
          onOpen={() => setOpen(true)}
          onToggleImportant={() => setSelection((current) => ({ ...current, important: !current.important }))}
        />
      </ul>

      <QuestionDialog
        question={open ? QUESTION : undefined}
        selection={selection}
        labels={labels}
        onClose={() => setOpen(false)}
        onAnswer={(agree) => {
          const same = agree ? selection.agree : selection.disagree;
          if (same) {
            // Re-choosing the current answer clears it; the dialog stays open.
            setSelection({ ...selection, agree: false, disagree: false });
            return;
          }
          setSelection({ agree, disagree: !agree, important: selection.important });
          setSkipped(false);
          setOpen(false);
        }}
        onSkip={() => {
          setSelection({ agree: false, disagree: false, important: false });
          setSkipped(true);
          setOpen(false);
        }}
        onToggleImportant={() => setSelection((current) => ({ ...current, important: !current.important }))}
      />
    </div>
  );
}

const meta: Meta<typeof QuestionDialog> = {
  title: "Components/QuestionDialog",
  component: QuestionDialog,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    question: QUESTION,
    selection: none,
    labels,
    onClose: () => {},
    onAnswer: () => {},
    onSkip: () => {},
    onToggleImportant: () => {},
  },
  argTypes: {
    question: { control: "object" },
    selection: { control: "object" },
    labels: { control: "object" },
    onClose: { control: false },
    onAnswer: { control: false },
    onSkip: { control: false },
    onToggleImportant: { control: false },
  },
};

type QuestionDialogStory = StoryObj<typeof meta>;

/**
 * Open by default so the card is visible in the docs. Unanswered from before,
 * so there is no "Přeskočit" under it: that control only appears right after
 * an answer is cleared inside the dialog (see `InteractiveAnswered`).
 */
export const Unanswered: QuestionDialogStory = {};

/** An answer already recorded: the card shows what was chosen. */
export const Answered: QuestionDialogStory = {
  args: { selection: { agree: true, disagree: false, important: true } },
};

/**
 * `question: undefined` is what closes it — there is no separate `open` flag.
 * Open it from the row (no skip control: nothing has been cleared yet), then
 * drag the card (left "Ano", right "Ne", down to skip, lift to also mark it
 * important), use the arrow keys, or its buttons. Reopen the answered question
 * and re-tap the same answer: it clears, the dialog stays open, and only now
 * "Přeskočit" appears under the card.
 */
export const Interactive: QuestionDialogStory = {
  args: { question: undefined },
  render: (args) => <RecapHarness labels={args.labels} />,
};

/**
 * The same harness starting on an answered question, for the sequence in
 * short: open → no skip control; re-choose "Ano" → it clears without closing
 * and "Přeskočit" appears; close and reopen → gone again.
 */
export const InteractiveAnswered: QuestionDialogStory = {
  args: { question: undefined },
  render: (args) => <RecapHarness labels={args.labels} initialSelection={{ agree: true, disagree: false, important: false }} />,
};

export default meta;
