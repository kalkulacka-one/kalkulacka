import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../../../packages/design-system/src/ui/input/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {},
  tags: ["autodocs"],
};

type CheckboxStory = StoryObj<typeof meta>;

export const Default: CheckboxStory = {
  args: {},
};

export default meta;
