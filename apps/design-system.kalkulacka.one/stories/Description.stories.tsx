import { Description, Field } from "@repo/design-system/client";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Description> = {
  title: "Components/Description",
  component: Description,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Field>
        <Story />
      </Field>
    ),
  ],
};

type DescriptionStory = StoryObj<typeof Description>;

export const Default: DescriptionStory = {
  render: () => <Description>Description</Description>,
};

export default meta;
