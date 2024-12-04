import { YesIcon } from "@repo/design-system/demo";
import { ToggleButton } from "@repo/design-system/ui";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/ToggleButton",
  component: ToggleButton,
  argTypes: {},
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj<typeof ToggleButton>;

export const AnswerInFavour: Story = {
  args: {
    answerType: "InFavour",
    children: "Jsem pro",
    hasIcon: true,
    icon: YesIcon,
    iconPosition: "left",
    color: "primary",
    kind: "inverse",
    size: "default",
    wider: true,
    fitContent: true,
    compactable: true,
  },
};

export const AnswerAgainst: Story = {
  args: {
    answerType: "Against",
    children: "Jsem proti",
    hasIcon: true,
    icon: YesIcon,
    iconPosition: "left",
    color: "secondary",
    kind: "inverse",
    size: "default",
    wider: true,
    fitContent: true,
    compactable: true,
  },
};

export const AnswerNeutral: Story = {
  args: {
    answerType: "Neutral",
    children: "Přeskočit",
    hasIcon: true,
    icon: YesIcon,
    iconPosition: "left",
    color: "neutral",
    kind: "inverse",
    size: "default",
    wider: true,
    fitContent: true,
    compactable: true,
  },
};
