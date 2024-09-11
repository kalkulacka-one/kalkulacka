import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@repo/design-system/button";
import { ArrowIcon } from "@repo/design-system/arrowIcon";
import { StarIcon } from "@repo/design-system/starIcon";
import { YesIcon } from "@repo/design-system/yesIcon";
import { NoIcon } from "@repo/design-system/noIcon";
import { NeutralIcon } from "@repo/design-system/neutralIcon";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      options: [
        "default",
        "filled",
        "outline",
        "link",
        "answerInFavour",
        "answerAgainst",
        "answerNeutral",
        "icon",
      ],
      control: { type: "radio" },
    },
    size: {
      options: [
        "default",
        "sm",
        "iconSm",
        "iconDefault",
        "iconLg",
        "linkDefault",
        "linkSm",
      ],
      control: { type: "radio" },
    },
    asChild: {
      control: { type: "boolean" },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
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
            backgroundColor: "yellow", // Equivalent to Tailwind's bg-gray-100
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
};

// Default button
type ButtonStory = StoryObj<typeof meta>;

export const Default: ButtonStory = {
  args: {
    children: "Button label",
    size: "default",
    variant: "default",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const FilledIconRight: ButtonStory = {
  args: {
    size: "default",
    variant: "default",
  },
  render: (args) => {
    return (
      <Button {...args}>
        <span>Button label</span>
        <ArrowIcon
          style={{ width: "1.5rem", height: "1.5rem", marginLeft: "auto" }}
        />
      </Button>
    );
  },
};

export const FilledIconLeft: ButtonStory = {
  args: {
    size: "default",
    variant: "default",
  },
  render: (args) => {
    return (
      <Button {...args}>
        <ArrowIcon
          style={{ width: "1.5rem", height: "1.5rem", marginRight: "auto" }}
        />
        Button label
      </Button>
    );
  },
};

export const Filled: ButtonStory = {
  args: {
    children: "Button label",
    size: "default",
    variant: "filled",
  },
};

export const Outline: ButtonStory = {
  args: {
    children: "Button label",
    size: "default",
    variant: "outline",
  },
};

export const Link: ButtonStory = {
  args: {
    size: "default",
    variant: "link",
  },
  render: (args) => {
    return (
      <Button {...args} asChild>
        <a href="/">Button link</a>
      </Button>
    );
  },
};

export const LinkWithIcon: ButtonStory = {
  args: {
    size: "linkDefault",
    variant: "link",
  },
  render: (args) => {
    return (
      <Button {...args} asChild>
        <a href="/">
          <span>Button label</span>
          <ArrowIcon
            style={{ width: "1.5rem", height: "1.5rem", marginLeft: "auto" }}
          />
        </a>
      </Button>
    );
  },
};

export const InFavour: ButtonStory = {
  args: {
    size: "default",
    variant: "answerInFavour",
  },
  render: (args) => {
    return (
      <Button {...args}>
        <YesIcon
          style={{ width: "1.5rem", height: "1.5rem", marginRight: "auto" }}
        />
        Jsem pro
      </Button>
    );
  },
};

export const Against: ButtonStory = {
  args: {
    children: "Button label",
    size: "default",
    variant: "answerAgainst",
  },
  render: (args) => {
    return (
      <Button {...args}>
        <NoIcon
          style={{ width: "1.5rem", height: "1.5rem", marginRight: "auto" }}
        />
        Jsem proti
      </Button>
    );
  },
};

export const Neutral: ButtonStory = {
  args: {
    size: "default",
    variant: "answerNeutral",
  },
  render: (args) => {
    return (
      <Button {...args}>
        <NeutralIcon
          style={{ width: "1.5rem", height: "1.5rem", marginRight: "auto" }}
        />
        Přeskočit
      </Button>
    );
  },
};

export const Icon: ButtonStory = {
  args: {
    size: "default",
    variant: "icon",
  },
  render: (args) => {
    return (
      <Button {...args}>
        <StarIcon style={{ width: "1.5rem" }} />
      </Button>
    );
  },
};

export default meta;
