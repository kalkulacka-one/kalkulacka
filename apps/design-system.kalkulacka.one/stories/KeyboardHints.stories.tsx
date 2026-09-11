// Ported from kalkulacka-2026/packages/ui/src/keyboard-hints/keyboard-hints.stories.tsx
import { icons } from "@kalkulacka-one/design-system/icons";
import { type KeyboardHint, KeyboardHints } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

/*
 * The five hints the question flow shows. Left and right get a hint each
 * rather than one shared "odpovědět": which arrow means "souhlasím" is the
 * one thing about this shortcut a first-time user cannot guess, and the
 * paired row also matches the left/right order of the answer buttons on the
 * card.
 */
const flowHints: KeyboardHint[] = [
  { keys: [{ icon: icons.arrowLeft, label: "Šipka vlevo" }], label: "Ano" },
  { keys: [{ icon: icons.arrowRight, label: "Šipka vpravo" }], label: "Ne" },
  { keys: [{ icon: icons.arrowUp, label: "Šipka nahoru" }], label: "Důležité" },
  { keys: [{ icon: icons.arrowDown, label: "Šipka dolů" }], label: "Přeskočit" },
  {
    keys: [
      { icon: icons.comma, label: "Čárka" },
      { icon: icons.period, label: "Tečka" },
    ],
    label: "Procházet bez odpovědi",
  },
];

/**
 * Hidden below the `desk` breakpoint (53.75rem / 860px) by design — there is
 * no keyboard to hint at on a phone. Widen the canvas to see it.
 */
const meta: Meta<typeof KeyboardHints> = {
  title: "Components/KeyboardHints",
  component: KeyboardHints,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { hints: flowHints },
  argTypes: {
    hints: { control: "object" },
  },
};

type KeyboardHintsStory = StoryObj<typeof meta>;

/** The question flow's row: four arrows, then the comma and period pair for browsing without answering. */
export const Default: KeyboardHintsStory = {};

/** Caps can also be literal text — the same browsing pair spelled as characters. */
export const TextKeys: KeyboardHintsStory = {
  args: {
    hints: [
      { keys: [",", "."], label: "Procházet bez odpovědi" },
      { keys: ["Esc"], label: "Zavřít" },
    ],
  },
};

export default meta;
