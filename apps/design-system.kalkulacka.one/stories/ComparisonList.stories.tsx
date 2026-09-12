// Ported from kalkulacka-2026/packages/ui/src/comparison-list/comparison-list.stories.tsx
import { ComparisonList } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const ROWS = [
  {
    id: "q1",
    statement: "Město by mělo omezit vánoční výzdobu kvůli cenám energií.",
    user: { tone: "agree" as const, label: "Ano" },
    candidate: { tone: "agree" as const, label: "Ano" },
    important: true,
    comment: "Úspory dávají smysl, výzdobu ale zcela rušit nechceme.",
  },
  {
    id: "q2",
    statement: "Město má vybudovat nový plavecký areál.",
    user: { tone: "disagree" as const, label: "Ne" },
    candidate: { tone: "agree" as const, label: "Ano" },
  },
  {
    id: "q3",
    statement: "Parkování v centru má zdražit.",
    user: { tone: "agree" as const, label: "Ano" },
    candidate: { tone: "none" as const, label: "Bez odpovědi" },
  },
  {
    id: "q4",
    statement: "Město má zavést bezplatnou MHD pro seniory.",
    user: { tone: "neutral" as const, label: "Nevím" },
    candidate: { tone: "disagree" as const, label: "Ne" },
    comment: "Radši bychom investovali do častějších spojů, které pomůžou všem.",
  },
];

const meta: Meta<typeof ComparisonList> = {
  title: "Components/ComparisonList",
  component: ComparisonList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    rows: ROWS,
    labels: { you: "Vy", candidate: "Piráti", important: "Pro mě důležité" },
  },
  argTypes: {
    rows: { control: "object" },
    labels: { control: "object" },
    resetKey: { control: false },
  },
  /* The pane the list scrolls in: a translucent surface, so the sticky heading has something to sit over. */
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: "30rem",
          maxHeight: "22rem",
          overflowY: "auto",
          borderRadius: "var(--ko-radius-control)",
          background: "oklch(from var(--ko-color-surface) l c h / 0.86)",
          boxShadow: "var(--ko-shadow-surface)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

type ComparisonListStory = StoryObj<typeof meta>;

/** All three agreement states, including the one neither side can be blamed for. */
export const Default: ComparisonListStory = {};

/** An archive party name runs across the statement column rather than being clipped to the width of its mark. */
export const LongCandidateName: ComparisonListStory = {
  args: { labels: { you: "Vy", candidate: "SPOLEČNĚ PRO PARDUBICE (Piráti, Zelení a nezávislí)", important: "Pro mě důležité" } },
};

/** Switching the key replays the list's entrance — the way a filter change lands as a new result. */
export const Replayed: ComparisonListStory = {
  render: function ReplayedStory(args) {
    const [key, setKey] = useState(0);
    return (
      <>
        <button type="button" onClick={() => setKey((current) => current + 1)} style={{ margin: "1rem 1.5rem 0", font: "inherit" }}>
          Přehrát znovu
        </button>
        <ComparisonList {...args} resetKey={key} />
      </>
    );
  },
};

export default meta;
