// Ported from kalkulacka-2026/packages/ui/src/filter-chips/filter-chips.stories.tsx
import { FilterChips } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const OPTIONS = [
  { id: "all", label: "Vše", count: 42 },
  { id: "unanswered", label: "Nezodpovězené", count: 28 },
  { id: "important", label: "Důležité", count: 4 },
  { id: "topic:doprava", label: "Doprava", count: 7, separatorBefore: true },
  { id: "topic:bydleni", label: "Bydlení", count: 5 },
  { id: "topic:energetika", label: "Energetika", count: 8 },
  { id: "topic:skolstvi", label: "Školství", count: 4 },
  { id: "topic:socialni", label: "Sociální politika", count: 6 },
  { id: "topic:kultura", label: "Kultura a sport", count: 3 },
];

const meta: Meta<typeof FilterChips> = {
  title: "Components/FilterChips",
  component: FilterChips,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Filtrovat otázky",
    options: OPTIONS,
    value: "all",
    onChange: () => {},
  },
  argTypes: {
    label: { control: "text" },
    value: {
      control: "select",
      options: OPTIONS.map((option) => option.id),
    },
    options: { control: "object" },
    onChange: { control: false },
  },
};

type FilterChipsStory = StoryObj<typeof meta>;

/** Scrolls sideways in a narrow canvas; wraps once the container is 44rem wide. */
export const Default: FilterChipsStory = {};

export const TopicSelected: FilterChipsStory = {
  args: { value: "topic:energetika" },
};

/** Without counts the chips are just their labels. */
export const WithoutCounts: FilterChipsStory = {
  args: { options: OPTIONS.map(({ count: _count, ...option }) => option) },
};

/** The row scrolls sideways rather than wrapping; drag it to see the rest. */
export const Narrow: FilterChipsStory = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "20rem" }}>
        <Story />
      </div>
    ),
  ],
};

/** Past 44rem of container width the row wraps instead — a desktop hides nothing behind a scroll. */
export const Wide: FilterChipsStory = {
  decorators: [
    (Story) => (
      <div style={{ width: "min(90vw, 48rem)" }}>
        <Story />
      </div>
    ),
  ],
};

/** Exactly one chip is ever pressed; clicking another moves the selection. */
export const Interactive: FilterChipsStory = {
  render: function InteractiveStory(args) {
    const [value, setValue] = useState("all");
    return <FilterChips {...args} value={value} onChange={setValue} />;
  },
};

export default meta;
