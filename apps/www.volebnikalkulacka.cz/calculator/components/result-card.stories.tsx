import type { Meta, StoryObj } from "@storybook/react";

import { ResultCard } from "./result-card";

const meta: Meta<typeof ResultCard> = {
  title: "Components/ResultCard",
  component: ResultCard,
  tags: ["autodocs"],
  argTypes: {
    order: {
      control: false,
    },
  },
};

type ResultCardStory = StoryObj<typeof meta>;

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

export const Default: ResultCardStory = {
  args: {
    order: 1,
  },
  render: (args) => {
    return (
      <>
        {results.map((result, index) => (
          <ResultCard {...args} result={result} key={result.id} order={index + 1} strong={index === 0} />
        ))}
      </>
    );
  },
};

export default meta;
