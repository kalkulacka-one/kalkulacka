import type { Meta, StoryObj } from "@storybook/react";
import { SingleSelectField } from "../../../packages/design-system/src/ui/input/combobobx/singleSelect/singleSelectField";
import { SearchIcon } from "@repo/design-system/demo";
import { HomeIcon } from "@repo/design-system/demo";

const meta: Meta<typeof SingleSelectField> = {
  title: "Components/SingleSelectField",
  component: SingleSelectField,
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

type SingleSelectFieldStory = StoryObj<typeof meta>;

export const Default: SingleSelectFieldStory = {
  args: {},
};

export default meta;
