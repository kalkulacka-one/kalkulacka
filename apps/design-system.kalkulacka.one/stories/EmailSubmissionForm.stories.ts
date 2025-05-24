import type { Meta, StoryObj } from '@storybook/react';

import { EmailSubmissionForm } from '@repo/design-system/components';
const meta: Meta<typeof EmailSubmissionForm> = {
  title: 'Components/EmailSubmissionForm',
  component: EmailSubmissionForm,
};

type EmailSubmissionFormStory = StoryObj<typeof meta>;

export const Default: EmailSubmissionFormStory = {};

export default meta;
