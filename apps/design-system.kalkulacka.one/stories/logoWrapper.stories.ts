import type { Meta, StoryObj } from '@storybook/react';

import { LogoWrapper } from '@repo/design-system/components';

const meta: Meta<typeof LogoWrapper> = {
  title: 'Components/LogoWrapper',
  component: LogoWrapper,
  tags: ['autodocs'],
};

type LogoWrapperStory = StoryObj<typeof meta>;

export const Default: LogoWrapperStory = {};

export default meta;
