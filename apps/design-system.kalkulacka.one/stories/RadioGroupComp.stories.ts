import type { Meta, StoryObj } from '@storybook/react';

import { RadioGroupComp } from '@repo/design-system/components';
const meta: Meta<typeof RadioGroupComp> = {
  title: 'Components/RadioGroupComp',
  component: RadioGroupComp,
};

type RadioGroupCompStory = StoryObj<typeof meta>;

export const Default: RadioGroupCompStory = {};

export default meta;
