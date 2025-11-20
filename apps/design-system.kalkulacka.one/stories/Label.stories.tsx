import { Field, Label } from "@kalkulacka-one/design-system/client";
import type { Meta, StoryObj } from "@storybook/react";

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
