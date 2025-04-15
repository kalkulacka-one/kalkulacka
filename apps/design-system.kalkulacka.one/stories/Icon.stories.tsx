import type { Meta, StoryObj } from '@storybook/react';
import type { ArgTypes } from '@storybook/react';

import { Icon, iconSizes } from '@repo/design-system/components';
import { iconNames } from '@repo/design-system/types';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
    size: {
      control: 'select',
      options: iconSizes,
    },
    color: {
      control: 'color',
    },
  } as ArgTypes,
};

type IconStory = StoryObj<typeof meta>;

export const Default: IconStory = {
  args: {
    name: 'SearchIcon',
    size: 'medium',
    title: 'Search icon',
  },
};

export default meta;
