import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@repo/design-system/client";
import { useIntl } from "react-intl";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "filled",
    color: "primary",
    size: "medium",
    type: "button",
    disabled: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium"],
      defaultValue: {
        summary: "medium",
      },
    },
    variant: {
      control: "select",
      options: ["filled", "outline", "link"],
      defaultValue: {
        summary: "filled",
      },
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "neutral"],
      defaultValue: {
        summary: "primary",
      },
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      defaultValue: {
        summary: "button",
      },
    },
    disabled: {
      control: "boolean",
      defaultValue: {
        summary: false,
      },
    },
  },
};

type ButtonStory = StoryObj<typeof meta>;
7;

const ButtonWithTranslation = () => {
  const intl = useIntl();
  return <Button>{intl.formatMessage({ id: "button", defaultMessage: "Button default" })}</Button>;
};

export const Default: ButtonStory = {
  args: {
    children: "Button",
    variant: "filled",
    color: "primary",
    type: "button",
    disabled: false,
  },
};

export const WithTranslation: ButtonStory = {
  args: {
    children: "Button",
    variant: "filled",
    color: "primary",
    type: "button",
    disabled: false,
  },
  render: () => <ButtonWithTranslation />,
} satisfies ButtonStory;

export default meta;
