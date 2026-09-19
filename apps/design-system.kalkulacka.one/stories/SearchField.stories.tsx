import { SearchField } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const meta: Meta<typeof SearchField> = {
  title: "Components/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  args: {
    label: "Hledat obec",
    placeholder: "Hledat obec",
    clearLabel: "Vymazat hledání",
    value: "",
    onValueChange: () => {},
  },
};

type SearchFieldStory = StoryObj<typeof meta>;

export const Empty: SearchFieldStory = {};

export const Interactive: SearchFieldStory = {
  render: (args) => {
    const [value, setValue] = useState("Pard");
    return <SearchField {...args} value={value} onValueChange={setValue} />;
  },
};

export default meta;
