import { LogoCheck, LogoCross, LogoPercent, LogoPercentDenominator, LogoPercentNumerator, LogoPercentSlash, LogoSlash } from "@repo/design-system/client";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/Logo/Parts",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large", "default"],
    },
  },
};

export default meta;

// Individual logo parts
export const Check: StoryObj<typeof LogoCheck> = {
  render: (args) => <LogoCheck {...args} />,
  args: {
    size: "default",
  },
};

export const Slash: StoryObj<typeof LogoSlash> = {
  render: (args) => <LogoSlash {...args} />,
  args: {
    size: "default",
  },
};

export const Cross: StoryObj<typeof LogoCross> = {
  render: (args) => <LogoCross {...args} />,
  args: {
    size: "default",
  },
};

export const Percent: StoryObj<typeof LogoPercent> = {
  render: (args) => <LogoPercent {...args} />,
  args: {
    size: "default",
  },
};

// Granular percent parts
export const PercentNumerator: StoryObj<typeof LogoPercentNumerator> = {
  render: (args) => <LogoPercentNumerator {...args} />,
  args: {
    size: "default",
  },
};

export const PercentSlash: StoryObj<typeof LogoPercentSlash> = {
  render: (args) => <LogoPercentSlash {...args} />,
  args: {
    size: "default",
  },
};

export const PercentDenominator: StoryObj<typeof LogoPercentDenominator> = {
  render: (args) => <LogoPercentDenominator {...args} />,
  args: {
    size: "default",
  },
};

// All parts together for comparison
export const AllParts: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex flex-col items-center gap-2">
        <LogoCheck size="large" />
        <span className="text-sm">Check</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LogoSlash size="large" />
        <span className="text-sm">Slash</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LogoCross size="large" />
        <span className="text-sm">Cross</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LogoPercent size="large" />
        <span className="text-sm">Percent</span>
      </div>
    </div>
  ),
};

// Size comparison
export const SizeComparison: StoryObj = {
  render: () => (
    <div className="space-y-6">
      {(["small", "medium", "large", "default"] as const).map((size) => (
        <div key={size} className="flex items-baseline gap-4">
          <span className="w-16 text-sm font-medium">{size}:</span>
          <LogoCheck size={size} />
          <LogoSlash size={size} />
          <LogoCross size={size} />
          <LogoPercent size={size} />
        </div>
      ))}
    </div>
  ),
};
