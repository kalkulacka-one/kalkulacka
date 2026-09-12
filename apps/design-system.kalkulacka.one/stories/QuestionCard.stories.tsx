import { type CardSelection, QuestionCard } from "@kalkulacka-one/design-system/client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

const content = {
  id: "q1",
  topic: "Energetika",
  title: "Omezení vánoční výzdoby",
  statement: "Město by mělo kvůli rostoucím cenám energie omezit veřejné slavnostní osvětlení v době Vánoc.",
  detail:
    "K podobnému kroku přistoupila například rakouská Vídeň. Na hlavním bulváru Ring kolem centra nebude vánoční osvětlení vůbec, na dalších místech se bude rozsvěcet o hodinu později než doposud.",
};

const labels = {
  agree: "Ano",
  disagree: "Ne",
  important: "Pro mě důležité",
};

const none: CardSelection = { agree: false, disagree: false, important: false };

/**
 * The card positions itself absolutely, so stories give it a box to fill —
 * the same job the flow's "stage" element does in the app. Sized so the
 * answer labels stay hidden on a laptop (the labels appear from a 37.5rem
 * *card* width, see `Wide`).
 */
function Stage({ width = "min(90vw, 34rem)", height = "33.75rem", children }: { width?: string; height?: string; children: React.ReactNode }) {
  return <div style={{ position: "relative", width, height }}>{children}</div>;
}

const meta: Meta<typeof QuestionCard> = {
  title: "Components/QuestionCard",
  component: QuestionCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    content,
    labels,
    selection: none,
    elevation: "active",
    statementAs: "p",
    inert: false,
  },
  argTypes: {
    elevation: {
      control: "select",
      options: ["active", "next", "back", "lifted"],
      defaultValue: { summary: "active" },
    },
    statementAs: {
      control: "select",
      options: ["p", "h1", "h2"],
      defaultValue: { summary: "p" },
    },
    inert: { control: "boolean" },
    content: { control: "object" },
    selection: { control: "object" },
    labels: { control: "object" },
    close: { control: false },
    guides: { control: false },
    ref: { control: false },
    className: { control: false },
  },
  decorators: [
    (Story) => (
      <Stage>
        <Story />
      </Stage>
    ),
  ],
};

type QuestionCardStory = StoryObj<typeof meta>;

/** Topic and title chips, the statement, its explainer, and the three actions. */
export const Default: QuestionCardStory = {};

/** The buttons drive the selection here, as the deck drives them in the app. */
export const Interactive: QuestionCardStory = {
  render: (args) => {
    const [selection, setSelection] = useState<CardSelection>(none);
    return (
      <QuestionCard
        {...args}
        selection={selection}
        onAgree={() => setSelection((current) => ({ ...current, agree: !current.agree, disagree: false }))}
        onDisagree={() => setSelection((current) => ({ ...current, disagree: !current.disagree, agree: false }))}
        onToggleImportant={() => setSelection((current) => ({ ...current, important: !current.important }))}
      />
    );
  },
};

export const Agreed: QuestionCardStory = {
  args: { selection: { agree: true, disagree: false, important: false } },
};

export const Disagreed: QuestionCardStory = {
  args: { selection: { agree: false, disagree: true, important: false } },
};

/** The star fills and inverts; the answer keeps its own colour. */
export const DisagreedAndImportant: QuestionCardStory = {
  args: { selection: { agree: false, disagree: true, important: true } },
};

export const Important: QuestionCardStory = {
  args: { selection: { agree: false, disagree: false, important: true } },
};

/**
 * The deck's stack: `back` and `next` behind the active card, scaled and lifted
 * as the deck lays them out, and a `lifted` copy mid-flight in front of it. The
 * cards behind are `inert`; only the active one is in the accessibility tree.
 */
export const Elevations: QuestionCardStory = {
  render: (args) => (
    <>
      <div style={{ position: "absolute", inset: 0, transform: "translateY(-60px) scale(0.88)", filter: "brightness(0.95)" }}>
        <QuestionCard {...args} content={{ ...content, id: "back" }} elevation="back" inert />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: "translateY(-32px) scale(0.94)", filter: "brightness(0.98)" }}>
        <QuestionCard {...args} content={{ ...content, id: "next" }} elevation="next" inert />
      </div>
      <QuestionCard {...args} elevation="active" statementAs="h1" />
      <div style={{ position: "absolute", inset: 0, transform: "translate(160px, -12px) rotate(6deg)", pointerEvents: "none" }}>
        <QuestionCard {...args} content={{ ...content, id: "ghost" }} selection={{ agree: false, disagree: true, important: false }} elevation="lifted" inert />
      </div>
    </>
  ),
  decorators: [
    (Story) => (
      <Stage width="min(90vw, 34rem)" height="38rem">
        <Story />
      </Stage>
    ),
  ],
};

/** From a 37.5rem card width the answer buttons spell their labels out next to the marks. */
export const Wide: QuestionCardStory = {
  decorators: [
    (Story) => (
      <Stage width="min(90vw, 48rem)" height="30rem">
        <Story />
      </Stage>
    ),
  ],
};

/** Only the recap's dialog passes this — the deck's own cards never close. */
export const Closable: QuestionCardStory = {
  args: { close: { label: "Zavřít", onClose: () => {} } },
};

/** A card behind the active one: out of the tab order and the accessibility tree, no grab cursor. */
export const Inert: QuestionCardStory = {
  args: { inert: true, elevation: "next" },
};

/** Questions without an explainer are common in the archive data. */
export const WithoutDetail: QuestionCardStory = {
  args: {
    content: {
      ...content,
      detail: undefined,
      title: "Fotovoltaika na městské budovy",
      statement: "Město má investovat do fotovoltaických panelů na střechách městských budov.",
    },
  },
};

/** Tags are empty for some data sources; the card drops to a single chip. */
export const WithoutTopic: QuestionCardStory = {
  args: { content: { ...content, topic: undefined } },
};

/** The tutorial's practice card: no chips, no statement — the only text is the instruction, centred. */
export const PracticeCard: QuestionCardStory = {
  args: {
    content: { id: "practice", detail: "Zkuste kartu přetáhnout doleva nebo doprava." },
    onPointerDown: () => {},
  },
};

/** The longest statement and explainer in the Pardubice set. */
export const LongestContent: QuestionCardStory = {
  args: {
    content: {
      id: "q-long",
      topic: "Bydlení",
      title: "Podpora družstevního bydlení",
      statement: "Město má podporovat družstevní a spolkové formy bytové výstavby i subjekty, které budou poskytovat bydlení na neziskovém principu.",
      detail:
        "Kritikům vadí, že ekonomické tlaky na původní obyvatele vedou k jejich postupnému vytlačování. Městské části pak ztrácejí pestrost a uzavírají se jen pro vybrané skupiny lidí. Zastánci tvrdí, že to je přirozený proces a že na bydlení v dobré čtvrti si člověk musí vydělat.",
    },
  },
};

export default meta;
