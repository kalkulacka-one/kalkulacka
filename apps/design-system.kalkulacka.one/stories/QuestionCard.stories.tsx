import type { Meta, StoryObj } from "@storybook/react";

import { QuestionCard } from "@repo/design-system/server";

const questions = [
  {
    id: "b2e48e5f-2a73-498a-8817-3f8c36663984",
    title: "Více míst na gymnáziích",
    statement: "Měl by kraj rozšířit kapacitu gymnázií a podpořit všeobecné vzdělávací obory?",
    detail:
      "V ČR studuje na všeobecných oborech 30 % žáků, zatímco v Evropě je tento podíl 50 %. Zastánci chtějí připravit studenty/ky na proměnlivý pracovní trh a zlepšit šance i na další, vyšší vzdělávání, odpůrci argumentují potřebou odborných škol pro naplnění poptávky po specializovaných pracovních místech.",
    tags: ["Vzdělání"],
  },
  {
    id: "36079500-1556-4330-81c6-defe94472c99",
    title: "Hromadná doprava vs. automobilová",
    statement: "Investice do hromadné dopravy by měly mít přednost před rozvojem infrastruktury pro osobní automobilovou dopravu.",
    detail: "Investice do veřejné dopravy jsou klíčové pro všechny kraje, zejména pro venkovské a méně rozvinuté oblasti.",
    tags: ["Veřejná doprava"],
  },
  {
    id: "0908ae4c-c4bc-4908-8032-8bc96ae8ca49",
    title: "Podpora obnovitelných zdrojů energie",
    statement: "Kraj by měl finančně podporovat budování obnovitelných zdrojů energie na veřejných budovách a pozemcích.",
    detail:
      "Obnovitelné zdroje pomáhají snížit uhlíkovou stopu kraje. Zastánci argumentují, že to přispívá k boji proti změně klimatu, kritici varují před vysokými počátečními investicemi a technickými obtížemi.",
    tags: ["Obnovitelná energie"],
  },
];

const meta: Meta<typeof QuestionCard> = {
  title: "Components/QuestionCard",
  component: QuestionCard,
  tags: ["autodocs"],
  argTypes: {
    questionCurrent: {
      control: { type: "range", min: 1, max: questions.length, step: 1 },
    },
    questionTotal: {
      control: { type: "number", min: 1, max: questions.length },
    },
  },
};

type QuestionCardStory = StoryObj<typeof meta>;

export const Default: QuestionCardStory = {
  args: {
    questionCurrent: 1,
    questionTotal: questions.length,
  },
  render: (args) => {
    // biome-ignore lint/style/noNonNullAssertion: questionCurrent is constrained by our Storybook argTypes to 0…questions.length-1, so this lookup can never be undefined.
    const question = questions[args.questionCurrent - 1]!;
    return <QuestionCard {...args} questionCurrent={args.questionCurrent} question={question} />;
  },
};

export default meta;
