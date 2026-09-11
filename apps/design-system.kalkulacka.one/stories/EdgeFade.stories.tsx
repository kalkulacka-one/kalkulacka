import { EdgeFade } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const rows = Array.from({ length: 20 }, (_, index) => `Řádek ${index + 1}`);

/** A scroll box in a positioned frame — the arrangement every fading list uses. */
function ScrollFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", height: "16rem", maxWidth: "32rem" }}>
      <div style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
        {rows.map((row) => (
          <p key={row} style={{ margin: 0, padding: "0.6rem 0" }}>
            {row}
          </p>
        ))}
      </div>
      {children}
    </div>
  );
}

const meta: Meta<typeof EdgeFade> = {
  title: "Components/EdgeFade",
  component: EdgeFade,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    edge: "bottom",
    size: "edge",
    visible: true,
  },
  argTypes: {
    edge: {
      control: "select",
      options: ["top", "bottom"],
    },
    size: {
      control: "select",
      options: ["edge", "action"],
      defaultValue: {
        summary: "edge",
      },
    },
    visible: { control: "boolean" },
  },
  render: (args) => (
    <ScrollFrame>
      <EdgeFade {...args} />
    </ScrollFrame>
  ),
};

type EdgeFadeStory = StoryObj<typeof meta>;

export const Default: EdgeFadeStory = {};

/** Both edges over one scroll box — the only fade treatment lists get. */
export const BothEdges: EdgeFadeStory = {
  render: () => (
    <ScrollFrame>
      <EdgeFade edge="top" />
      <EdgeFade edge="bottom" />
    </ScrollFrame>
  ),
};

/** The taller band a floating action sits in (`size="action"`). */
export const ActionBand: EdgeFadeStory = {
  args: {
    edge: "bottom",
    size: "action",
  },
};

/** Toggle `visible` in the controls: the band fades rather than snapping. */
export const Hidden: EdgeFadeStory = {
  args: {
    visible: false,
  },
};

export default meta;
