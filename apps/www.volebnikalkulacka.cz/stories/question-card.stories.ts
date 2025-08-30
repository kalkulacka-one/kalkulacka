import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { QuestionCard } from "../calculator/components/questionCard";

const meta = {
  title: "Example/QuestionCard",
  component: QuestionCard,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof QuestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    question: {
      title: "Sample Question Title",
      id: "q1",
      statement: "This is a sample question statement.",
      detail: "Optional detail text.",
      tags: ["sample", "test"]
    },
    questionCurrent: 1,
    questionTotal: 10
  }
};
