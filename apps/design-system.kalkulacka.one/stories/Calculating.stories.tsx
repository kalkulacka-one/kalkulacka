// Ported from kalkulacka-2026/packages/ui/src/calculating/calculating.stories.tsx
import { Calculating } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const meta: Meta<typeof Calculating> = {
  title: "Components/Calculating",
  component: Calculating,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { label: "Počítáme vaši shodu" },
  argTypes: {
    label: { control: "text" },
    className: { control: false },
  },
};

type CalculatingStory = StoryObj<typeof meta>;

/**
 * Runs once on mount. Re-render the story (the toolbar's reload) to watch it
 * again — the animation is deliberately not looped, because it resolves.
 *
 * Under `prefers-reduced-motion: reduce` (toggle it in the OS, or emulate it
 * in the browser's rendering panel) nothing moves: the gate and its film strip
 * are removed outright, the ring is already full, and the percent mark and the
 * label carry the moment on their own.
 */
export const Default: CalculatingStory = {};

/** The same, with a button that remounts it so the sequence can be watched repeatedly. */
export const Replay: CalculatingStory = {
  render: function ReplayStory(args) {
    const [run, setRun] = useState(0);
    return (
      <div style={{ display: "grid", gap: "1.5rem", justifyItems: "center" }}>
        <Calculating key={run} {...args} />
        <button
          type="button"
          onClick={() => setRun((current) => current + 1)}
          style={{
            font: "inherit",
            padding: "0.5rem 1rem",
            borderRadius: "var(--ko-radius-pill)",
            border: "1.5px solid var(--ko-color-border)",
            background: "var(--ko-color-surface)",
            color: "var(--ko-color-text)",
            cursor: "pointer",
          }}
        >
          Přehrát znovu
        </button>
      </div>
    );
  },
};

export default meta;
