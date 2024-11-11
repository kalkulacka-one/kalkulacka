import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxSelectField } from "../../../packages/design-system/src/ui/input/combobobx/checkboxSelect/checkboxField";

const meta: Meta<typeof CheckboxSelectField> = {
  title: "Components/CheckboxSelectField",
  component: CheckboxSelectField,
  argTypes: {},
  tags: ["autodocs"],
};

type CheckboxSelectFieldStory = StoryObj<typeof meta>;

export const Default: CheckboxSelectFieldStory = {
  args: {},
};

export default meta;
