import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@repo/design-system/button";
import ButtonInFavour from "@repo/design-system/buttonInFavour";
import ButtonAgainst from "@repo/design-system/buttonAgainst";
import ButtonNeutral from "@repo/design-system/buttonNeutral";
import { ArrowIcon } from "@repo/design-system/arrowIcon";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    kind: {
      options: ["default", "filled", "outline"],
      control: { type: "radio" },
    },
    size: {
      options: ["default", "small"],
      control: { type: "radio" },
    },
    hasIcon: {
      options: ["true", "false"],
      control: { type: "radio" },
    },
    iconPosition: {
      options: ["left", "right"],
      control: { type: "radio" },
    },
    color: {
      options: ["primary", "secondary", "neutral"],
      control: { type: "radio" },
    },
    wider: {
      options: ["true", "false"],
      control: { type: "radio" },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#D3D3D3",
        }}
      >
        <div
          style={{
            height: "50%",
            width: "50%",
            backgroundColor: "yellow",
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
};

type ButtonStory = StoryObj<typeof meta>;

export const Filled: ButtonStory = {
  args: {
    children: "Button label",
    size: "default",
    kind: "filled",
    color: "primary",
  },
  render: (args) => {
    return (
      <>
        <Button icon={ArrowIcon} {...args} hasIcon iconPosition="left" />
        <Button icon={ArrowIcon} {...args} hasIcon iconPosition="right" />
        <Button {...args} fitContent />
      </>
    );
  },
};

export const Outline: ButtonStory = {
  args: {
    children: "Button label",
    size: "default",
    kind: "outline",
    color: "neutral",
  },
  render: (args) => {
    return (
      <>
        <Button icon={ArrowIcon} {...args} hasIcon iconPosition="left" />
        <Button icon={ArrowIcon} {...args} hasIcon iconPosition="right" />
        <Button {...args} fitContent />
      </>
    );
  },
};

export const AnswerInFavour: ButtonStory = {
  render: () => {
    return <ButtonInFavour />;
  },
};

export const AnswerAgainst: ButtonStory = {
  render: () => {
    return <ButtonAgainst />;
  },
};

export const AnswerNeutral: ButtonStory = {
  render: () => {
    return <ButtonNeutral />;
  },
};

export default meta;
