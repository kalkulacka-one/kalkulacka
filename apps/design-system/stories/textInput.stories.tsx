import type { Meta, StoryObj } from "@storybook/react";

import { TextInput } from "../../../packages/design-system/src/textInput";

const meta: Meta<typeof TextInput> = {
  title: "Components/TextInput",
  component: TextInput,
  argTypes: {
    disabled: { control: "boolean" },
    groupName: { control: "text" },
    icon: { control: "boolean" },
    label: { control: "text" },
    modelValue: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
  },
  tags: ["autodocs"],
};

type TextInputStory = StoryObj<typeof meta>;

export const DefaultIcon: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: true,
    label: "",
    modelValue: "",
    placeholder: "Input value",
    error: "",
  },
};

export const DefaultNoIcon: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: false,
    label: "",
    placeholder: "Input value",
    error: "",
  },
};

export const HoverIcon: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: true,
    label: "",
    placeholder: "Input value",
    error: "",
  },
};

export const HoverNoIcon: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: false,
    label: "",
    placeholder: "Input value",
    error: "",
  },
};

export const ReadOnlyIcon: TextInputStory = {
  args: {
    disabled: true,
    groupName: "default",
    icon: true,
    label: "Input Name",
    placeholder: "Input value",
    error: "",
  },
};

export const ReadOnlyNoIcon: TextInputStory = {
  args: {
    disabled: true,
    groupName: "default",
    icon: false,
    label: "Input Name",
    placeholder: "Input value",
    error: "",
  },
};

export const ActiveIcon: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: true,
    label: "Input Name",
    placeholder: "Input value",
    error: "",
  },
};

export const ActiveNoIcon: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: false,
    label: "Input Name",
    placeholder: "",
    error: "",
  },
};

export const DefaultIconFilled: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: true,
    label: "Input Name",
    placeholder: "",
    error: "",
  },
};

export const DefaultNoIconFilled: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: false,
    label: "Input Name",
    placeholder: "",
    error: "",
  },
};

export const HoverIconFilled: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: true,
    label: "Input Name",
    placeholder: "",
    error: "",
  },
};

export const HoverNoIconFilled: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: false,
    label: "Input Name",
    placeholder: "",
    error: "",
  },
};

export const ErrorIcon: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: true,
    label: "Input Name",
    placeholder: "",
    error: "Try fixing this and this",
  },
};

export const ErrorNoIcon: TextInputStory = {
  args: {
    disabled: false,
    groupName: "default",
    icon: false,
    label: "Input Name",
    placeholder: "",
    error: "Try fixing this and this",
  },
};

export default meta;
