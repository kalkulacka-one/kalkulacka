import { InputField } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof InputField> = {
  title: 'Components/Input',
  component: InputField,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'boolean' },
    errorMessage: { control: 'text' },
  },
  tags: ['autodocs'],
};

type InputStory = StoryObj<typeof meta>;

export const Default: InputStory = {
  args: {
    placeholder: 'Placeholder',
    error: true,
    errorMessage: 'Error',
  },
};

export default meta;
