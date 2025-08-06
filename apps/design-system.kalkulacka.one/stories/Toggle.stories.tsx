import type { Meta, StoryObj } from "@storybook/react";

import { Toggle } from "@repo/design-system/client";
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
      <Toggle variant="answer" color="primary" checked={checked} onChange={onChange}>
        Ano
      </Toggle>
    );
  },
} satisfies ToggleStory;

export const AnswerNo: ToggleStory = {
  args: {
    checked: false,
  },
  render: function Render() {
    const [{ checked }, updateArgs] = useArgs();

    function onChange() {
      updateArgs({ checked: !checked });
    }

    return (
      <Toggle variant="answer" color="secondary" checked={checked} onChange={onChange}>
        Ne
      </Toggle>
    );
  },
} satisfies ToggleStory;

export default meta;
