import type { Meta, StoryObj } from "@storybook/react";

import { BottomBar } from "@repo/design-system/ui";

const meta: Meta<typeof BottomBar> = {
  title: "Layout/BottomBar",
  component: BottomBar,
};

type BottomBarStory = StoryObj<typeof meta>;

export const Default: BottomBarStory = {};

export default meta;
