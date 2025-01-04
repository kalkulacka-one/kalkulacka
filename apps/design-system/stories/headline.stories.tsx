import type { Meta, StoryObj } from "@storybook/react";

import { Headline } from "@repo/design-system/ui";

const meta: Meta<typeof Headline> = {
  title: "Typography/Headline",
  component: Headline,
  argTypes: {
    variant: {
      control: "radio",
      options: ["small", "medium", "large"],
    },
  },
};

type HeadlineStory = StoryObj<typeof meta>;

export const Large: HeadlineStory = {
  args: {
    children: "Headline large",
    variant: "large",
    type: "h1",
  },
};

export const Medium: HeadlineStory = {
  args: {
    children: "Headline medium",
    variant: "medium",
    type: "h2",
  },
};

export const Small: HeadlineStory = {
  args: {
    children: "Headline small",
    variant: "small",
    type: "h3",
  },
};

export default meta;
