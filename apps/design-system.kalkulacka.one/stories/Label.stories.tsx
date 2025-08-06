import type { Meta, StoryObj } from "@storybook/react";

import { Field, Label } from "@repo/design-system/client";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Field>
        <Story />
      </Field>
    ),
  ],
};

type LabelStory = StoryObj<typeof Label>;

export const Default: LabelStory = {
  render: () => <Label>Label</Label>,
};

export default meta;
