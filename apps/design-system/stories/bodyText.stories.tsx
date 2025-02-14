import type { Meta, StoryObj } from "@storybook/react";

import { BodyText } from "@repo/design-system/ui";

const meta: Meta<typeof BodyText> = {
  title: "Typography/Body",
  component: BodyText,
  argTypes: {
    variant: {
      control: "radio",
      options: ["small", "medium", "large"],
    },
  },
};

type BodyTextStory = StoryObj<typeof meta>;

export const Large: BodyTextStory = {
  args: {
    children: "Large quick brown fox jumps over the lazy dog",
    variant: "large",
  },
};

export const Medium: BodyTextStory = {
  args: {
    children: "Medium quick brown fox jumps over the lazy dog",
    variant: "medium",
  },
};

export const Small: BodyTextStory = {
  args: {
    children: "Small quick brown fox jumps over the lazy dog",
    variant: "small",
  },
};

export default meta;
