// Ported from kalkulacka-2026/packages/ui/src/share-card/share-card.stories.tsx
import { CARD_FORMATS, CARD_THEMES, ShareCard } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { type ReactNode, useEffect, useState } from "react";

const content = {
  brand: "Volební kalkulačka",
  electionName: "Komunální volby 2022",
  calculatorName: "Pardubice",
  title: "Moje shoda",
  winnerLabel: "Největší shoda",
  entries: [
    { rank: 1, name: "SPOLU", percentLabel: "87 %", matchPercentage: 87 },
    { rank: 2, name: "Piráti a Starostové", percentLabel: "74 %", matchPercentage: 74 },
    { rank: 3, name: "ANO 2011", percentLabel: "61 %", matchPercentage: 61 },
    { rank: 4, name: "Společně pro Pardubice", percentLabel: "52 %", matchPercentage: 52 },
    { rank: 5, name: "SPD", noAnswerLabel: "Neodpověděli" },
  ],
  url: "volebnikalkulacka.cz",
};

/**
 * Holds the story back until the preview's theme is in the document.
 *
 * The card samples the live theme off the DOM once, on mount — and this
 * preview swaps its theme stylesheet in asynchronously (`.storybook/preview.tsx`),
 * so a card mounted in the same frame as the decorator reads a document with
 * no `--ko-palette-*` at all, every token falls back to the light hexes, and
 * the "dark" card comes out light. Keyed on the toolbar's theme by the
 * decorator below, so switching themes remounts the cards and they sample again.
 */
function WhenThemed({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => Boolean(document.getElementById("theme-style"));
    if (check()) {
      setReady(true);
      return;
    }
    const observer = new MutationObserver(() => {
      if (!check()) return;
      setReady(true);
      observer.disconnect();
    });
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);

  return ready ? children : null;
}

/**
 * The image someone posts. Built out of the app's own `MatchRow`/`Avatar`
 * components rather than redrawn, so the preview here — a scaled-down instance
 * of the same layout the export rasterises — cannot drift from either.
 */
const meta: Meta<typeof ShareCard> = {
  title: "Results/ShareCard",
  component: ShareCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story, context) => (
      <WhenThemed key={String(context.globals.theme)}>
        <Story />
      </WhenThemed>
    ),
  ],
  args: { content, theme: "light", format: "story", size: 360, label: "Náhled" },
  argTypes: {
    theme: { control: "inline-radio", options: CARD_THEMES },
    format: { control: "inline-radio", options: CARD_FORMATS },
    content: { control: false },
  },
};

type ShareCardStory = StoryObj<typeof meta>;

export const Story: ShareCardStory = { args: { format: "story" } };

export const Landscape: ShareCardStory = { args: { format: "landscape", size: 520 } };

/** The two brand colourways, derived from whatever the theme calls agree and disagree. */
export const Themes: ShareCardStory = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {CARD_THEMES.map((theme) => (
        <ShareCard key={theme} {...args} theme={theme} size={240} />
      ))}
    </div>
  ),
};

export default meta;
