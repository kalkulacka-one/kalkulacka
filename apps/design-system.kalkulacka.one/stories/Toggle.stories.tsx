import type { Meta, StoryObj } from "@storybook/react";

import { Button, Toggle } from "@repo/design-system/client";
import { useArgs } from "storybook/internal/preview-api";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
    },
  },
};

type ToggleStory = StoryObj<typeof meta>;

export const AnswerYes: ToggleStory = {
  args: {
    checked: false,
  },
  render: function Render() {
    const [{ checked }, updateArgs] = useArgs();

    function onChange() {
      updateArgs({ checked: !checked });
    }

    return (
      <Toggle checked={checked} onChange={onChange}>
        <Button variant="outline" color="primary">
          Pro mě důležité
        </Button>
      </Toggle>
    );
  },
} satisfies ToggleStory;

export default meta;
