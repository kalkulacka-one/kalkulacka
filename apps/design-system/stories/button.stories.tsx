import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@repo/design-system/ui";
import { ButtonInFavour } from "@repo/design-system/ui";
import { ButtonAgainst } from "@repo/design-system/ui";
import { ButtonNeutral } from "@repo/design-system/ui";
import { ArrowIconRight, ArrowIconLeft } from "@repo/design-system/demo";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    kind: {
      options: ["filled", "inverse", "outline", "link"],
      control: { type: "radio" },
    },
    size: {
      options: ["default", "small"],
      control: { type: "radio" },
    },
    hasIcon: {
      control: { type: "boolean" },
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
      control: { type: "boolean" },
    },
    compactable: {
      control: { type: "boolean" },
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
            height: "75vh",
            width: "75vw",
            backgroundColor: "lightyellow",
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
        <Button icon={ArrowIconLeft} {...args} hasIcon iconPosition="left" />
        <Button icon={ArrowIconRight} {...args} hasIcon iconPosition="right" />
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
        <Button icon={ArrowIconLeft} {...args} hasIcon iconPosition="left" />
        <Button icon={ArrowIconRight} {...args} hasIcon iconPosition="right" />
        <Button {...args} fitContent />
      </>
    );
  },
};

export const Link: ButtonStory = {
  args: {
    children: "Button label",
    size: "default",
    kind: "link",
    fitContent: true,
  },
  render: (args) => {
    return (
      <>
        <Button icon={ArrowIconLeft} {...args} hasIcon iconPosition="left" />
        <Button icon={ArrowIconRight} {...args} hasIcon iconPosition="right" />
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
