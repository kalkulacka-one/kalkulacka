import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '@repo/design-system/components';
const meta: Meta<typeof Input> = {
  title: 'Components/InputComp',
  component: Input,
  argTypes: {
    type: {
      control: 'text',
    },
    name: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
  },
};

type InputCompStory = StoryObj<typeof meta>;

export const Default: InputCompStory = {
  args: {
    type: 'text',
    name: 'text',
    placeholder: 'Insert your placeholder here',
  },
};

export default meta;
