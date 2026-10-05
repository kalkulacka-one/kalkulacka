import { Button, Dialog } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  args: {
    title: "Občané mají mít možnost volit ve volbách online.",
    closeLabel: "Zavřít",
  },
  argTypes: {
    open: { control: false },
    onClose: { control: false },
    eyebrow: { control: false },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="fill" color="primary" onClick={() => setOpen(true)}>
          Open the dialog
        </Button>
        <Dialog {...args} open={open} onClose={() => setOpen(false)}>
          <p className="ko:text-text-muted">Online volby mohou zjednodušit hlasování, zejména pro mladé. Odpůrci ale varují, že u digitální voleb je náročné zaručit anonymitu.</p>
        </Dialog>
      </>
    );
  },
};
