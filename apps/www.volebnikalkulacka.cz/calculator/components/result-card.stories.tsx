import { ResultCandidateCard } from "@repo/design-system/server";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ResultCandidateCard> = {
  title: "Components/ResultCandidateCard",
  component: ResultCandidateCard,
  tags: ["autodocs"],
  argTypes: {
    order: {
      control: false,
    },
  },
};

type ResultCandidateCardStory = StoryObj<typeof meta>;

const results = [
  {
    id: 1,
    coalition_short: "STAN+TOP+LES+HD",
    coalition_long: "Čtyřkoalice STAROSTOVÉ, TOP 09, HDK, LES",
    value: 65,
  },
  {
    id: 2,
    coalition_short: "SOCDEM+SproK+RH",
    coalition_long: "HLAS samospráv – pro spravedlivý rozvoj Královéhradeckého kraje",
    value: 15,
  },
  {
    id: 3,
    coalition_short: "Zelení+SEN 21",
    coalition_long: "PRO KRAJINU - Zelení, Změna pro Hradec a nezávislí",
    value: 10,
  },
  {
    id: 4,
    coalition_short: "Piráti",
    coalition_long: "Česká pirátská strana",
    value: 5,
  },
];

export const Default: ResultCandidateCardStory = {
  args: {
    order: 1,
  },
  render: (args) => {
    return (
      <>
        {results.map((result, index) => (
          <ResultCandidateCard {...args} result={result} key={result.id} order={index + 1} strong={index === 0} />
        ))}
      </>
    );
  },
};

export default meta;
