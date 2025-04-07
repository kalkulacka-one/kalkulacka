import type { Meta, StoryObj } from '@storybook/react';

import { LinkComp } from '@repo/design-system/ui';

const meta: Meta<typeof LinkComp> = {
  title: 'Components/Link',
  component: LinkComp,
};

type LinkCompStory = StoryObj<typeof meta>;

export const Default: LinkCompStory = {
  args: {
    children: 'Link',
    href: '/',
    color: 'neutral',
    underline: true,
    linkArrow: true,
  },
};

export default meta;
