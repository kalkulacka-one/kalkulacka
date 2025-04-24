import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '@repo/design-system/components';
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
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
    type: 'email',
    name: 'email',
    placeholder: 'Insert your e-mail here',
  },
};

export default meta;
