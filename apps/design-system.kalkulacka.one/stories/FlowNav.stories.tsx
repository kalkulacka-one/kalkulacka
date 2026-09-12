// Ported from kalkulacka-2026/packages/ui/src/flow-nav/flow-nav.stories.tsx
import { FlowNav } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

/**
 * The row sits under the deck's stage in the app, so the stories give it the
 * same width — the three columns only read as "edges and a centre" when there
 * is a card's width to span.
 */
const meta: Meta<typeof FlowNav> = {
  title: "Components/FlowNav",
  component: FlowNav,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    position: 3,
    total: 42,
    canGoBack: true,
    previousLabel: "Předchozí",
    forwardLabel: "Přeskočit",
    counterLabel: "Otázka 3 ze 42",
    isSkipped: false,
    attention: false,
    onPrevious: () => {},
    onForward: () => {},
  },
  argTypes: {
    position: { control: { type: "number", min: 1 } },
    total: { control: { type: "number", min: 1 } },
    canGoBack: { control: "boolean" },
    isSkipped: { control: "boolean" },
    attention: { control: "boolean" },
    previousLabel: { control: "text" },
    forwardLabel: { control: "text" },
    counterLabel: { control: "text" },
    onPrevious: { control: false },
    onForward: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(90vw, 34rem)" }}>
        <Story />
      </div>
    ),
  ],
};

type FlowNavStory = StoryObj<typeof meta>;

/** Nothing answered yet, so the forward control offers to skip. */
export const Default: FlowNavStory = {};

/**
 * On the first question "back" leads to the tutorial rather than a previous
 * card, and the app labels it so — the row keeps its shape whatever the label.
 */
export const FirstQuestion: FlowNavStory = {
  args: { position: 1, previousLabel: "Návod", counterLabel: "Otázka 1 ze 42" },
};

/** Once an answer exists the forward control reads "Další" instead. */
export const Answered: FlowNavStory = {
  args: { forwardLabel: "Další" },
};

/** A question that was explicitly skipped keeps the control filled, as a reminder. */
export const Skipped: FlowNavStory = {
  args: { isSkipped: true },
};

/**
 * Right after re-tapping an answer clears it: the same fill, arriving with a
 * one-shot pulse so it is noticed — a nudge toward "Přeskočit" for a question
 * that is unexpectedly unanswered again. Transient in the app (it resets when
 * the card changes); the button below re-mounts the row to play it again.
 */
export const Attention: FlowNavStory = {
  args: { attention: true },
  render: function AttentionStory(args) {
    const [take, setTake] = useState(0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <div style={{ width: "100%" }}>
          <FlowNav key={take} {...args} />
        </div>
        <button
          type="button"
          onClick={() => setTake((n) => n + 1)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "var(--ko-radius-pill)",
            border: "1.5px solid var(--ko-color-border)",
            background: "var(--ko-color-surface)",
            color: "var(--ko-color-text)",
            cursor: "pointer",
            fontFamily: "var(--ko-font-sans)",
            fontSize: "0.875rem",
          }}
        >
          Přehrát znovu
        </button>
      </div>
    );
  },
};

/** The last question: the counter reaches the total, and forward leads out of the flow. */
export const LastQuestion: FlowNavStory = {
  args: { position: 42, forwardLabel: "Další", counterLabel: "Otázka 42 ze 42" },
};

/** Nowhere back to go — the control is disabled rather than removed, so the counter stays put. */
export const CannotGoBack: FlowNavStory = {
  args: { position: 1, canGoBack: false, counterLabel: "Otázka 1 ze 42" },
};

export default meta;
