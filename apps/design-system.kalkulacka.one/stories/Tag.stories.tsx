import { Tag } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  args: {
    children: "Největší shoda",
    tone: "neutral",
  },
  argTypes: {
    children: {
      control: "text",
    },
    tone: {
      control: "select",
      options: ["agree", "neutral"],
      defaultValue: {
        summary: "neutral",
      },
    },
  },
};

type TagStory = StoryObj<typeof meta>;

/** A positive callout — the winner's row on the results. */
export const Agree: TagStory = {
  args: {
    children: "Největší shoda",
    tone: "agree",
  },
};

/** A plain label — "Vy" beside the visitor's own answer on the comparison. */
export const Neutral: TagStory = {
  args: {
    children: "Vy",
    tone: "neutral",
  },
};

/** Both tones side by side. */
export const Tones: TagStory = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Tag tone="agree">Největší shoda</Tag>
      <Tag tone="neutral">Vy</Tag>
      <Tag tone="neutral">Neodpověděli</Tag>
    </div>
  ),
};

export default meta;
