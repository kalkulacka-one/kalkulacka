import type { Meta, StoryObj } from "@storybook/react";

import { QuestionCard } from "@repo/design-system/ui";

const meta: Meta<typeof QuestionCard> = {
  title: "Layout/Question",
  component: QuestionCard,
};

type QuestionStory = StoryObj<typeof meta>;

export const Default: QuestionStory = {
  //   args: {
  //     children: "Volební kalkulačka",
  //   },
};

export default meta;
