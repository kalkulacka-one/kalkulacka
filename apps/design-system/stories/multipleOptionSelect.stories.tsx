import type { Meta, StoryObj } from "@storybook/react";
import { MultipleSelectField } from "../../../packages/design-system/src/ui/input/combobobx/multipleSelect/multipleSelectField";
import { SearchIcon, HomeIcon } from "@repo/design-system/demo";

const meta: Meta<typeof MultipleSelectField> = {
  title: "Components/MultipleSelectField",
  component: MultipleSelectField,
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    showClearButton: { control: "boolean" },
    icon: {
      control: { type: "select" },
      options: [undefined, "Search", "Home"],
      mapping: {
        Search: SearchIcon,
        Home: HomeIcon,
      },
    },
  },
  tags: ["autodocs"],
};

type MultipleSelectFieldStory = StoryObj<typeof meta>;

export const Default: MultipleSelectFieldStory = {
  args: {},
};

export default meta;
