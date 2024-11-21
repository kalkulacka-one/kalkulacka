import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxSelectField } from "../../../packages/design-system/src/ui/input/combobox/checkboxSelect/checkboxField";
import { SearchIcon, HomeIcon } from "@repo/design-system/demo";

const meta: Meta<typeof CheckboxSelectField> = {
  title: "Components/CheckboxSelectField",
  component: CheckboxSelectField,
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

type CheckboxSelectFieldStory = StoryObj<typeof meta>;

export const Default: CheckboxSelectFieldStory = {
  args: {},
};

export default meta;
