import type { Meta, StoryObj } from "@storybook/react";

import { Heading } from "@repo/design-system/heading";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
};

type HeadingStory = StoryObj<typeof meta>;

export const Default: HeadingStory = {
  args: {
    children: "Volební kalkulačka",
  },
};

export default meta;
