import type { Meta, StoryObj } from "@storybook/react";

import { Question } from "@repo/design-system/ui";

const meta: Meta<typeof Question> = {
  title: "Layouts/Question",
  component: Question,
};

type QuestionStory = StoryObj<typeof meta>;

export const Default: QuestionStory = {
  //   args: {
  //     children: "Volební kalkulačka",
  //   },
};

export default meta;