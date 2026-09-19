import { Icon, Input } from "@kalkulacka-one/design-system/client";
import { EnvelopeIcon } from "@kalkulacka-one/design-system/icons";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
    },
  },
};

type InputStory = StoryObj<typeof meta>;

export const Default: InputStory = {
  args: {
    placeholder: "Input placeholder",
  },
};

export const WithIcon: InputStory = {
  args: {
    placeholder: "Input placeholder",
    children: <Icon decorative icon={EnvelopeIcon} />,
  },
};

export const Clearable: InputStory = {
  render: () => {
    const [value, setValue] = useState("Brno");
    return <Input value={value} onChange={(event) => setValue(event.target.value)} onClear={() => setValue("")} clearLabel="Vymazat" placeholder="Input placeholder" />;
  },
};

export default meta;
