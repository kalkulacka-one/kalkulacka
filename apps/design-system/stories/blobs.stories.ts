import type { Meta, StoryObj } from '@storybook/react';

import { Blobs } from '@repo/design-system/ui';

const meta: Meta<typeof Blobs> = {
  title: 'Components/Blobs',
  component: Blobs,
};

type BlobsStory = StoryObj<typeof meta>;

export const Default: BlobsStory = {};

export default meta;
