import { Icon, ToggleButton } from "@kalkulacka-one/design-system/client";

import { mdiHeart, mdiHeartOutline } from "@mdi/js";
import type { Meta, StoryObj } from "@storybook/react";
import { createElement } from "react";
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
      <ToggleButton variant="answer" color="primary" checked={checked} onChange={onChange}>
        Ano
      </ToggleButton>
    );
  },
} satisfies ToggleButtonStory;

export const AnswerNo: ToggleButtonStory = {
  args: {
    checked: false,
  },
  render: function Render() {
    const [{ checked }, updateArgs] = useArgs();

    function onChange() {
      updateArgs({ checked: !checked });
    }

    return (
      <ToggleButton variant="answer" color="secondary" checked={checked} onChange={onChange}>
        Ne
      </ToggleButton>
    );
  },
} satisfies ToggleButtonStory;

export const IconToggle: ToggleButtonStory = {
  args: {
    checked: false,
  },
  render: function Render() {
    const [{ checked }, updateArgs] = useArgs();

    function onChange() {
      updateArgs({ checked: !checked });
    }

    return (
      <ToggleButton variant="fill" color={checked ? "secondary" : "neutral"} checked={checked} onChange={onChange}>
        {createElement(Icon, {
          icon: checked ? mdiHeart : mdiHeartOutline,
          decorative: true,
        })}
      </ToggleButton>
    );
  },
} satisfies ToggleButtonStory;

export default meta;
