import type { Meta, StoryObj } from "@storybook/react";

import { Button, ToggleButton } from "@repo/design-system/client";

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
  render: () => (
    <ToggleButton>
      <Button variant="outline" color="primary">
        Pro mě důležité
      </Button>
    </ToggleButton>
  ),
};

export default meta;
