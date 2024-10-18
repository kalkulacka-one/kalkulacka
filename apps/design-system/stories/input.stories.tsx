import type { Meta, StoryObj } from "@storybook/react";
import { InputField } from "../../../packages/design-system/src/ui/input/inputField";

const meta: Meta<typeof InputField> = {
  title: "Components/Input",
  component: InputField,
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    showClearButton: { control: "boolean" },
    icon: { control: { type: "select" }, options: [undefined, "Icon"] }, //Here should the icons be defined
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
