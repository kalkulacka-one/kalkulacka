import type { Meta, StoryObj } from '@storybook/react';

import { PillGroupItem } from '@repo/design-system/components';
const meta: Meta<typeof PillGroupItem> = {
  title: 'Components/PillGroupItem',
  component: PillGroupItem,
  argTypes: {
    value: {
      control: 'text',
    },
  },
};

type PillGroupItemStory = StoryObj<typeof meta>;

export const Default: PillGroupItemStory = {
  args: {
    children: 'Vzdělání',
    value: 'vzdelani',
  },
};

export default meta;
