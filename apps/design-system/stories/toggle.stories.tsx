import type { Meta, StoryObj } from "@storybook/react";

import { Toggle } from "@repo/design-system/toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
};

type ToggleStory = StoryObj<typeof meta>;

export const Default: ToggleStory = {
  args: {
    children: (checked) => (
      <button
        style={{
          transition: "background-color ease-in-out 300ms",
          backgroundColor: checked ? "#2563eb" : "#e5e7eb", // Adjust these hex codes to match your Tailwind colors
        }}
      >
        Toggle button
      </button>
    ),
  },
};

export default meta;
