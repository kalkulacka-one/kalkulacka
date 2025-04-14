import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '@repo/design-system/components';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: ['EnvelopeIcon', 'SearchIcon'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'extraLarge', 'extraHuge'],
    },
    color: {
      control: 'color',
    },
  },
};

type IconStory = StoryObj<typeof meta>;

export const Default: IconStory = {
  args: {
    name: 'SearchIcon',
    size: 'medium',
    title: '',
  },
};

export default meta;
