import type { Meta, StoryObj } from '@storybook/react';
import type { ArgTypes } from '@storybook/react';

import { Button } from '@repo/design-system/components';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
};

type ButtonStory = StoryObj<typeof meta>;

export const Default: ButtonStory = {
  args: {
    children: 'Button text',
    kind: 'filled',
    disabled: true,
  },
};

export default meta;
