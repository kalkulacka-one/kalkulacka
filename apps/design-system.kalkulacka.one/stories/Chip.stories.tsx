import { Chip } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    children: "Energetika",
    variant: "filled",
  },
  argTypes: {
    children: {
      control: "text",
    },
    variant: {
      control: "select",
      options: ["filled", "outline"],
      defaultValue: {
        summary: "filled",
      },
    },
  },
};

type ChipStory = StoryObj<typeof meta>;

/** The topic — a filled, recessed chip. */
export const Filled: ChipStory = {
  args: {
    children: "Energetika",
    variant: "filled",
  },
};

/** The question's short name — outlined against the card. */
export const Outline: ChipStory = {
  args: {
    children: "Omezení vánoční výzdoby",
    variant: "outline",
  },
};

/** How they appear on a question card: topic first, then the question's short name. */
export const Pair: ChipStory = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Chip variant="filled">Energetika</Chip>
      <Chip variant="outline">Omezení vánoční výzdoby</Chip>
    </div>
  ),
};

export default meta;
