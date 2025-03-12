import type { Meta, StoryObj } from '@storybook/react';

import { Demo } from '@repo/design-system/demo';

const meta: Meta<typeof Demo> = {
	title: 'Components/Demo',
	component: Demo,
};

type DemoStory = StoryObj<typeof meta>;

export const Default: DemoStory = {};

export default meta;
