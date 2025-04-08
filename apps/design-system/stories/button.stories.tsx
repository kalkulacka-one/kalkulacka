import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@repo/design-system/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    kind: {
      options: ['filled', 'inverse', 'outline', 'link'],
      control: { type: 'radio' },
    },
    size: {
      options: ['default', 'small'],
      control: { type: 'radio' },
    },
    hasIcon: {
      control: { type: 'boolean' },
    },
    iconPosition: {
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
    color: {
      options: ['primary', 'secondary', 'neutral'],
      control: { type: 'radio' },
    },
    wider: {
      control: { type: 'boolean' },
    },
    // compactable: {
    //   control: { type: 'boolean' },
    // },
    fitContent: {
      control: { type: 'boolean' },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#D3D3D3',
        }}
      >
        <div
          style={{
            height: '75vh',
            width: '75vw',
            backgroundColor: 'white',
            display: 'flex',
            gap: '1rem',
            flexDirection: 'column',
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
};

type ButtonStory = StoryObj<typeof meta>;

export const Filled: ButtonStory = {
  args: {
    size: 'default',
    kind: 'filled',
    color: 'primary',
    fitContent: true,
  },
  render: (args) => {
    return (
      <>
        <Button {...args}>Button label</Button>
      </>
    );
  },
};

export const Inverse: ButtonStory = {
  args: {
    size: 'default',
    kind: 'inverse',
    color: 'primary',
    fitContent: true,
  },
  render: (args) => {
    return (
      <>
        <Button {...args}>Button label</Button>
      </>
    );
  },
};

export const Outline: ButtonStory = {
  args: {
    size: 'default',
    kind: 'outline',
    color: 'primary',
    fitContent: true,
  },
  render: (args) => {
    return (
      <>
        <Button {...args}>Button label</Button>
      </>
    );
  },
};

export const Link: ButtonStory = {
  args: {
    size: 'auto',
    kind: 'link',
    color: 'neutral',
    fitContent: true,
  },
  render: (args) => {
    return (
      <>
        <Button {...args}>Button label</Button>
      </>
    );
  },
};

export default meta;
