import type { Meta, StoryObj } from '@storybook/react';

import { Footer } from '@repo/design-system/components';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
};

type FooterStory = StoryObj<typeof meta>;

export const Default: FooterStory = {};

export default meta;
