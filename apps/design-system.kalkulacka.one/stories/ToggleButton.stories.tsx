import type { Meta, StoryObj } from "@storybook/react";

import { Button, ToggleButton } from "@repo/design-system/client";
import { useArgs } from "storybook/internal/preview-api";

const meta: Meta<typeof ToggleButton> = {
  title: "Components/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
    },
  },
};

type ToggleButtonStory = StoryObj<typeof meta>;

export const AnswerYes: ToggleButtonStory = {
  args: {
    checked: false,
  },
  render: function Render() {
    const [{ checked }, updateArgs] = useArgs();

    function onChange() {
      updateArgs({ checked: !checked });
    }

    return (
      <ToggleButton checked={checked} onChange={onChange}>
        <Button variant="outline" color="primary">
          Pro mě důležité
        </Button>
      </ToggleButton>
    );
  },
} satisfies ToggleButtonStory;

export default meta;
