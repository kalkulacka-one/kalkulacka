import { Button } from "@kalkulacka-one/design-system/client";
import { StickyBar } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const rows = Array.from({ length: 12 }, (_, index) => `Otázka ${index + 1}`);

/** A scroll box for the bar to pin inside of; the story's frame, not part of the component. */
function ScrollFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", height: "18rem", overflowY: "auto", overflowX: "hidden", padding: "0 1rem" }}>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {rows.map((row) => (
          <p key={row} style={{ margin: 0, padding: "0.75rem 0" }}>
            {row}
          </p>
        ))}
      </div>
      {children}
    </div>
  );
}

const meta: Meta<typeof StickyBar> = {
  title: "Components/StickyBar",
  component: StickyBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    variant: "floating",
    children: (
      <Button variant="solid" size="large">
        Zobrazit výsledky
      </Button>
    ),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["floating", "flat"],
      defaultValue: {
        summary: "floating",
      },
    },
  },
  render: (args) => (
    <ScrollFrame>
      <StickyBar {...args} />
    </ScrollFrame>
  ),
};

type StickyBarStory = StoryObj<typeof meta>;

/** Scroll the frame: the bar sticks to the bottom without covering the last row. */
export const OverAList: StickyBarStory = {};

/** Part of the page rather than chrome floating over it — no scrim, no shadows. */
export const Flat: StickyBarStory = {
  args: {
    variant: "flat",
  },
};

/**
 * Two actions. No panel wraps the pair — each floats on its own, the secondary
 * one in `plate` (not `ghost`, which has nothing behind it to read against).
 * Below `xs` they stack with the primary on top; from `xs` up the secondary
 * returns to the left.
 */
export const TwoActions: StickyBarStory = {
  args: {
    children: (
      <>
        <Button variant="plate" size="large">
          Začít znovu
        </Button>
        <Button variant="solid" size="large">
          Pokračovat v odpovídání
        </Button>
      </>
    ),
  },
};

export const TwoActionsFlat: StickyBarStory = {
  args: {
    ...TwoActions.args,
    variant: "flat",
  },
};

export default meta;
