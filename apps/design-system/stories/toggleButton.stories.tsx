import { Meta, StoryObj } from "@storybook/react";
import { ToggleButton } from "@repo/design-system/toggleButton";
import { YesIcon } from "@repo/design-system/yesIcon";
import { Button } from "@repo/design-system/button";

export default {
  title: "Components/ToggleButton",
  component: ToggleButton,
  argTypes: {},
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj<typeof ToggleButton>;

export const AnswerInFavour: Story = {
  render: () => (
    <ToggleButton>
      <Button
        answerType="In favour"
        hasIcon
        icon={YesIcon}
        iconPosition="left"
        color="primary"
        kind="inverse"
        size="default"
        wider
        fitContent
        compactable
      >
        Jsem pro
      </Button>
    </ToggleButton>
  ),
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
