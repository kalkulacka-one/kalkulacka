import type { Meta, StoryObj } from "@storybook/react";

import { LabelText } from "@repo/design-system/ui";

const meta: Meta<typeof LabelText> = {
  title: "Typography/Label",
  component: LabelText,
};

type LabelTextStory = StoryObj<typeof meta>;

export const Default: LabelTextStory = {
  args: {
    children: "Label text (inter).",
  },
};

export default meta;
