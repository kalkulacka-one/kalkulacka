// Ported from kalkulacka-2026/packages/ui/src/recap-row/recap-row.stories.tsx
import { RecapRow } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const meta: Meta<typeof RecapRow> = {
  title: "Components/RecapRow",
  component: RecapRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Omezení vánoční výzdoby",
    tone: "agree",
    important: false,
    skipped: false,
    labels: { answer: "Ano", important: "Pro mě důležité" },
    onOpen: () => {},
    onToggleImportant: () => {},
  },
  argTypes: {
    title: { control: "text" },
    tone: {
      control: "select",
      options: ["agree", "disagree", "neutral", "none"],
    },
    important: { control: "boolean" },
    skipped: { control: "boolean" },
    labels: { control: "object" },
    onOpen: { control: false },
    onToggleImportant: { control: false },
  },
  /* A row is an `<li>`; the recap lays them out in a grid list. */
  decorators: [
    (Story) => (
      <ul style={{ display: "grid", gap: "0.5rem", margin: 0, padding: 0, maxWidth: "28rem" }}>
        <Story />
      </ul>
    ),
  ],
};

type RecapRowStory = StoryObj<typeof meta>;

export const Agree: RecapRowStory = {};

export const Disagree: RecapRowStory = {
  args: { tone: "disagree", labels: { answer: "Ne", important: "Pro mě důležité" } },
};

/** Never reached — same dashed mark a skip gets, but the row stays full-strength. */
export const Unanswered: RecapRowStory = {
  args: {
    tone: "none",
    labels: { answer: "Bez odpovědi", important: "Pro mě důležité" },
  },
};

/** Explicitly passed over: the row reads as secondary and the star can't be armed. */
export const Skipped: RecapRowStory = {
  args: {
    tone: "none",
    skipped: true,
    labels: { answer: "Bez odpovědi", important: "Pro mě důležité" },
  },
};

export const Important: RecapRowStory = {
  args: { important: true },
};

/** Long short-names wrap to a second line rather than truncating mid-word. */
export const LongTitle: RecapRowStory = {
  args: {
    title: "Regulace zábavní pyrotechniky mimo Silvestra dovoleno pouze v centru",
    important: true,
  },
};

/** The star toggles right here; the rest of the tile opens the question. */
export const Interactive: RecapRowStory = {
  render: function InteractiveStory(args) {
    const [important, setImportant] = useState(false);
    const [opened, setOpened] = useState(0);
    return (
      <>
        <RecapRow {...args} important={important} onToggleImportant={() => setImportant((current) => !current)} onOpen={() => setOpened((count) => count + 1)} />
        <li style={{ listStyle: "none", fontFamily: "var(--ko-font-sans)", fontSize: "0.875rem", color: "var(--ko-color-text-muted)" }}>
          {important ? "★ Pro mě důležité" : "☆ Běžná otázka"} · otevřeno {opened}×
        </li>
      </>
    );
  },
};

/** A list as the recap draws it: every state side by side. */
export const List: RecapRowStory = {
  render: (args) => (
    <>
      <RecapRow {...args} title="Omezení vánoční výzdoby" tone="agree" important labels={{ answer: "Ano", important: "Pro mě důležité" }} />
      <RecapRow {...args} title="Regulace zábavní pyrotechniky" tone="disagree" important={false} labels={{ answer: "Ne", important: "Pro mě důležité" }} />
      <RecapRow {...args} title="Bytový fond" tone="none" important={false} skipped labels={{ answer: "Bez odpovědi", important: "Pro mě důležité" }} />
      <RecapRow {...args} title="Fotovoltaika na městské budovy" tone="none" important={false} labels={{ answer: "Bez odpovědi", important: "Pro mě důležité" }} />
    </>
  ),
};

export default meta;
