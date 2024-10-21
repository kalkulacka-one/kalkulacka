import type { Meta, StoryObj } from "@storybook/react";
import { InputField } from "../../../packages/design-system/src/ui/input/inputField";
import { BadgeStarIcon as icon } from "@repo/design-system/demo";

const meta: Meta<typeof InputField> = {
  title: "Components/Input",
  component: InputField,
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    showClearButton: { control: "boolean" },
    icon: { control: { type: "select" }, options: [undefined, icon] }, //Here should the icons be defined
  },
  tags: ["autodocs"],
};

type InputStory = StoryObj<typeof meta>;

export const Default: InputStory = {
  args: {
    label: "First Name",
    error: "Fix it",
    showClearButton: true,
    icon: undefined,
  },
};

export default meta;
