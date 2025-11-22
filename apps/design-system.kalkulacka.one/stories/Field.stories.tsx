import { Field } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Field> = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
};

type FieldStory = StoryObj<typeof Field>;

export const Default: FieldStory = {
  render: () => <Field>Field</Field>,
};

export default meta;
