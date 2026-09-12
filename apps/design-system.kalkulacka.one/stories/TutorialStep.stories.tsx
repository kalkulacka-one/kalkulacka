import { icons } from "@kalkulacka-one/design-system/icons";
import { TutorialStep } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof TutorialStep> = {
  title: "Components/TutorialStep",
  component: TutorialStep,
  tags: ["autodocs"],
  args: {
    icon: icons.starThin,
    title: "Pro mě důležité",
    description: "Otázku, na které vám obzvlášť záleží, můžete označit jako důležitou. Ve výsledku pak má dvojnásobnou váhu.",
  },
  argTypes: {
    icon: {
      control: "select",
      options: ["starThin", "neutral", "results", "arrowLeft", "arrowRight", "checkThin", "crossThin"],
      mapping: {
        starThin: icons.starThin,
        neutral: icons.neutral,
        results: icons.results,
        arrowLeft: icons.arrowLeft,
        arrowRight: icons.arrowRight,
        checkThin: icons.checkThin,
        crossThin: icons.crossThin,
      },
    },
    title: { control: "text" },
    description: { control: "text" },
  },
  /* An `<li>` on its own is a stray list item; the caller always owns the list around a run of steps. */
  render: (args) => (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      <TutorialStep {...args} />
    </ul>
  ),
};

type TutorialStepStory = StoryObj<typeof meta>;

/** One step: a round badge with the icon, a bold title and a muted description. */
export const Default: TutorialStepStory = {};

/**
 * The introduction's facts — what the calculator does with an answer, before
 * anyone gives one. Three steps in a `<ul>`, one gap tighter than the tutorial's
 * rows: each of these carries a single fact rather than a two-clause instruction.
 */
export const IntroFacts: TutorialStepStory = {
  render: () => (
    <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: 0, padding: 0, listStyle: "none" }}>
      <TutorialStep icon={icons.starThin} title="Pro mě důležité" description="Otázku, na které vám obzvlášť záleží, můžete označit jako důležitou. Ve výsledku pak má dvojnásobnou váhu." />
      <TutorialStep icon={icons.neutral} title="Přeskočení" description="Odpovídat nemusíte na všechno. Přeskočená otázka se do výsledku nezapočítá." />
      <TutorialStep icon={icons.results} title="Rekapitulace" description="Na konci uvidíte všechny otázky pohromadě a odpovědi můžete ještě změnit." />
    </ul>
  ),
};

/** A step with a live demonstration below its description — the tutorial's practice card goes here. */
export const WithDemonstration: TutorialStepStory = {
  args: {
    icon: icons.arrowRight,
    title: "Souhlas",
    description: "Kartu přetáhněte doprava, nebo stiskněte šipku doprava.",
  },
  render: (args) => (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      <TutorialStep {...args}>
        <div style={{ marginTop: "0.5rem", padding: "1rem 1.25rem", background: "var(--ko-color-surface)", borderRadius: "var(--ko-radius-control)", boxShadow: "var(--ko-shadow-surface)" }}>
          Zkušební karta
        </div>
      </TutorialStep>
    </ul>
  ),
};

export default meta;
