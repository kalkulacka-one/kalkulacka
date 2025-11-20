import { SteppedProgressBar } from "@kalkulacka-one/design-system/server";
import type { Meta, StoryObj } from "@storybook/react";

const stepItems = [
  { id: "1", status: null },
  { id: "2", status: false },
  { id: "3", status: true },
  { id: "4", status: null },
  { id: "5", status: undefined },
];

type ItemType = (typeof stepItems)[0];

const meta: Meta<typeof SteppedProgressBar<ItemType>> = {
  title: "Components/SteppedProgressBar",
  component: SteppedProgressBar,
  tags: ["autodocs"],
  argTypes: {
    idKey: {
      control: "select",
      options: ["id", "status"],
    },
    statusKey: {
      control: "select",
      options: ["id", "status"],
    },
    stepCurrent: {
      control: {
        type: "number",
        min: 1,
      },
    },
    stepTotal: {
      control: false,
    },
  },
};

type SteppedProgressBarStory = StoryObj<typeof meta>;

export const Default: SteppedProgressBarStory = {
  args: {
    stepItems: stepItems,
    stepCurrent: 4,
    stepTotal: stepItems.length,
    idKey: "id",
    statusKey: "status",
  },
};

export default meta;
