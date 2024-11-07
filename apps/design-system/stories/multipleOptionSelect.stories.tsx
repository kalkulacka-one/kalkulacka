import type { Meta, StoryObj } from "@storybook/react";
import { MultipleSelectField } from "../../../packages/design-system/src/ui/input/combobobx/multipleSelect/multipleSelectField";

const meta: Meta<typeof MultipleSelectField> = {
  title: "Components/MultipleSelectField",
  component: MultipleSelectField,
  argTypes: {},
  tags: ["autodocs"],
};

type MultipleSelectFieldStory = StoryObj<typeof meta>;

export const Default: MultipleSelectFieldStory = {
  args: {},
};

export default meta;
