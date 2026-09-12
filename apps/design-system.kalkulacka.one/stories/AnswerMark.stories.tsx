import { AnswerMark } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof AnswerMark> = {
  title: "Components/AnswerMark",
  component: AnswerMark,
  tags: ["autodocs"],
  args: {
    tone: "agree",
    label: "Ano",
    size: "medium",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["agree", "disagree", "neutral", "none"],
    },
    label: {
      control: "text",
    },
    size: {
      control: "select",
      options: ["small", "medium"],
      defaultValue: {
        summary: "medium",
      },
    },
  },
};

type AnswerMarkStory = StoryObj<typeof meta>;

export const Default: AnswerMarkStory = {
  args: {
    tone: "agree",
    label: "Ano",
  },
};

/** The four states, at the size the recap uses. */
export const Tones: AnswerMarkStory = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <AnswerMark tone="agree" label="Ano" />
      <AnswerMark tone="disagree" label="Ne" />
      <AnswerMark tone="neutral" label="Nevím" />
      <AnswerMark tone="none" label="Bez odpovědi" />
    </div>
  ),
};

/** The comparison's size, where two sit side by side on every row. */
export const Small: AnswerMarkStory = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <AnswerMark tone="agree" label="Ano" size="small" />
      <AnswerMark tone="disagree" label="Ne" size="small" />
      <AnswerMark tone="neutral" label="Nevím" size="small" />
      <AnswerMark tone="none" label="Bez odpovědi" size="small" />
    </div>
  ),
};

/** Every tone in both sizes. */
export const Sizes: AnswerMarkStory = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <AnswerMark tone="agree" label="Ano" size="medium" />
        <AnswerMark tone="disagree" label="Ne" size="medium" />
        <AnswerMark tone="neutral" label="Nevím" size="medium" />
        <AnswerMark tone="none" label="Bez odpovědi" size="medium" />
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <AnswerMark tone="agree" label="Ano" size="small" />
        <AnswerMark tone="disagree" label="Ne" size="small" />
        <AnswerMark tone="neutral" label="Nevím" size="small" />
        <AnswerMark tone="none" label="Bez odpovědi" size="small" />
      </div>
    </div>
  ),
};

export default meta;
