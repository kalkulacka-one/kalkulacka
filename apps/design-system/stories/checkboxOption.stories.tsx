import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxOption } from "../../../packages/design-system/src/ui/input/combobobx/multipleSelect/checkboxOption";

const meta: Meta<typeof CheckboxOption> = {
  title: "Components/CheckboxOption",
  component: CheckboxOption,
  argTypes: {},
  tags: ["autodocs"],
};

type CheckboxOptionStory = StoryObj<typeof meta>;

export const Default: CheckboxOptionStory = {
  args: {},
};

export default meta;
