import type { Meta, StoryObj } from "@storybook/react";
import { SelectInputField } from "../../../packages/design-system/src/ui/input/selectField";
import { SearchIcon } from "@repo/design-system/demo";
import { HomeIcon } from "@repo/design-system/demo";

const meta: Meta<typeof SelectInputField> = {
  title: "Components/SelectInput",
  component: SelectInputField,
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    showClearButton: { control: "boolean" },
    icon: {
      control: { type: "select" },
      options: {
        NoIcon: undefined,
        SearchIcon: SearchIcon,
        HomeIcon: HomeIcon,
      },
      mapping: {
        SearchIcon: SearchIcon,
        HomeIcon: HomeIcon,
      },
    },
  },
  tags: ["autodocs"],
};

type SelectInputStory = StoryObj<typeof meta>;

export const Default: SelectInputStory = {
  args: {},
};

export default meta;
