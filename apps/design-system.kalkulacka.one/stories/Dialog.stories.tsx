// Ported from kalkulacka-2026/packages/ui/src/dialog/dialog.stories.tsx
import { Button, Dialog } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    open: true,
    onClose: () => {},
    closeLabel: "Zavřít",
    title: "Začít znovu?",
    description: "Smažeme všechny vaše odpovědi v této kalkulačce a vrátíme vás na první otázku. Tuhle akci nelze vzít zpět.",
    size: "compact",
  },
  argTypes: {
    open: { control: "boolean" },
    size: {
      control: "select",
      options: ["compact", "wide"],
      defaultValue: { summary: "compact" },
    },
    title: { control: "text" },
    description: { control: "text" },
    closeLabel: { control: "text" },
    onClose: { control: false },
    children: { control: false },
    actions: { control: false },
  },
};

type DialogStory = StoryObj<typeof meta>;

/**
 * Rendered open by default so the panel is visible in the docs — the real
 * control is the `open` prop, exercised by `Interactive` below.
 */
export const Confirm: DialogStory = {
  args: {
    actions: (
      <>
        <Button variant="ghost">Zrušit</Button>
        <Button>Smazat a začít znovu</Button>
      </>
    ),
  },
};

/** No actions: a sheet you read and dismiss, like the flow's help overlay. */
export const Content: DialogStory = {
  args: {
    size: "wide",
    title: "Jak to funguje",
    description: undefined,
    children: <p style={{ margin: 0, lineHeight: 1.6 }}>Táhněte kartu doleva pro souhlas, doprava pro nesouhlas. Otázku, na kterou nechcete odpovídat, přeskočte — do výsledku se nezapočítá.</p>,
  },
};

/** Open, close with Escape, the corner button or the backdrop, and open again — the full cycle. */
export const Interactive: DialogStory = {
  args: { open: false },
  render: function InteractiveStory(args) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Otevřít dialog</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Zrušit
              </Button>
              <Button onClick={() => setOpen(false)}>Smazat a začít znovu</Button>
            </>
          }
        />
      </>
    );
  },
};

export default meta;
