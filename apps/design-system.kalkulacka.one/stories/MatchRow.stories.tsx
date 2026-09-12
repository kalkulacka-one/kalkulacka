// Ported from kalkulacka-2026/packages/ui/src/match-row/match-row.stories.tsx
import { MatchRow } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

/* Locale work happens above the row: "74 %" with the no-break space Czech puts before the sign. */
const percent = (value: number) => `${value}\u00a0%`;

const meta: Meta<typeof MatchRow> = {
  title: "Components/MatchRow",
  component: MatchRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    rank: 2,
    name: "Žijeme Pardubice",
    matchPercentage: 74,
    percentLabel: percent(74),
    noAnswerLabel: "Neodpověděli",
    onSelect: () => {},
  },
  argTypes: {
    rank: { control: "number" },
    name: { control: "text" },
    avatarUrl: { control: "text" },
    avatarImage: { control: false },
    color: { control: "color" },
    matchPercentage: { control: { type: "range", min: 0, max: 100 } },
    percentLabel: { control: "text" },
    noAnswerLabel: { control: "text" },
    winner: { control: "boolean" },
    winnerLabel: { control: "text" },
    selected: { control: "boolean" },
    delay: { control: "number" },
    onSelect: { control: false },
  },
  /* A row is an `<li>`; the results lay them out in a grid list. */
  decorators: [
    (Story) => (
      <ul style={{ display: "grid", gap: "0.5rem", margin: 0, padding: 0, maxWidth: "26rem" }}>
        <Story />
      </ul>
    ),
  ],
};

type MatchRowStory = StoryObj<typeof meta>;

export const Default: MatchRowStory = {};

/** The top match: same row, one step up in scale. */
export const Winner: MatchRowStory = {
  args: {
    rank: 1,
    name: "Piráti: 42projektu.cz",
    matchPercentage: 81,
    percentLabel: percent(81),
    winner: true,
    winnerLabel: "Největší shoda",
  },
};

/** The row whose comparison is currently open. */
export const Selected: MatchRowStory = {
  args: { selected: true },
};

/**
 * KSČM: no answers at all, so no bar, no percentage, and nothing to open. Never
 * 0 %, which would read as "opposed on everything".
 */
export const NoAnswers: MatchRowStory = {
  args: {
    rank: undefined,
    name: "Komunistická strana Čech a Moravy",
    matchPercentage: undefined,
    percentLabel: undefined,
  },
};

/** Archive party names run to 85 characters; two lines is the ceiling. */
export const LongName: MatchRowStory = {
  args: {
    rank: 6,
    name: "SPOLEČNĚ PRO PARDUBICE (Pardubáci společně, Sdružení pro Pardubice, Pardubice pro lidi)",
    matchPercentage: 48,
    percentLabel: percent(48),
  },
};

/** A candidate with a picture and a data colour of their own, which the bar and the avatar's ring share. */
export const WithPictureAndColor: MatchRowStory = {
  args: {
    rank: 3,
    name: "Portrét",
    avatarUrl: "https://i.pravatar.cc/128?img=12",
    color: "#db2777",
    matchPercentage: 66,
    percentLabel: percent(66),
  },
};

const RANKING = [
  { name: "Piráti: 42projektu.cz", match: 81 },
  { name: "Žijeme Pardubice", match: 74 },
  { name: "Společně pro Pardubice", match: 63 },
  { name: "ANO 2011", match: 55 },
  { name: "SPD", match: 31 },
  { name: "Komunistická strana Čech a Moravy", match: undefined },
];

/**
 * The ranking as the results draw it: staggered so the rows rise bottom-up
 * and the winner lands last, and tapping a row opens (floats) it. Re-render
 * the story (the toolbar's reload) to watch the entrance again.
 */
export const Ranking: MatchRowStory = {
  render: function RankingStory(args) {
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const comparable = RANKING.filter((row) => row.match !== undefined);
    return (
      <>
        {RANKING.map((row, index) => {
          const rank = row.match === undefined ? undefined : index + 1;
          return (
            <MatchRow
              {...args}
              key={row.name}
              rank={rank}
              name={row.name}
              matchPercentage={row.match}
              percentLabel={row.match === undefined ? undefined : percent(row.match)}
              winner={index === 0}
              winnerLabel="Největší shoda"
              selected={selected === row.name}
              onSelect={() => setSelected((current) => (current === row.name ? undefined : row.name))}
              delay={Math.max(0, comparable.length - 1 - index) * 0.06}
            />
          );
        })}
      </>
    );
  },
};

/** A result already shown once: `delay = -1` is an entrance that has finished before the first frame. */
export const AlreadyShown: MatchRowStory = {
  render: (args) => (
    <>
      {RANKING.slice(0, 3).map((row, index) => (
        <MatchRow
          {...args}
          key={row.name}
          rank={index + 1}
          name={row.name}
          matchPercentage={row.match}
          percentLabel={row.match === undefined ? undefined : percent(row.match)}
          winner={index === 0}
          winnerLabel="Největší shoda"
          delay={-1}
        />
      ))}
    </>
  ),
};

export default meta;
