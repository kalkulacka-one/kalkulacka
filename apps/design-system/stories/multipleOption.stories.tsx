import type { Meta, StoryObj } from "@storybook/react";
import { MultipleOption } from "../../../packages/design-system/src/ui/input/combobobx/multipleOption";

const meta: Meta<typeof MultipleOption> = {
  title: "Components/MultipleOption",
  component: MultipleOption,
  argTypes: {},
  tags: ["autodocs"],
};

type MultipleOptionStory = StoryObj<typeof meta>;

export const Default: MultipleOptionStory = {
  args: {},
};

export default meta;
