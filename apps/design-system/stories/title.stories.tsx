import type { Meta, StoryObj } from "@storybook/react";

import { Title } from "@repo/design-system/ui";

const meta: Meta<typeof Title> = {
  title: "Typography/Title",
  component: Title,
  argTypes: {
    variant: {
      control: "radio",
      options: ["medium", "large"],
    },
  },
};

type TitleStory = StoryObj<typeof meta>;

export const Large: TitleStory = {
  args: {
    children: "Title large",
    variant: "large",
  },
};

export const Medium: TitleStory = {
  args: {
    children: "Title medium",
    variant: "medium",
  },
};

export default meta;
