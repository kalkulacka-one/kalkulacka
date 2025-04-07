type GuideStepsProps = {
  intro: string;
  currentStep: number;
};

export default function GuideSteps({ intro, currentStep }: GuideStepsProps) {
  switch (currentStep) {
    case 1: {
      return <h1>Card 1, {intro}</h1>;
    }
    case 2: {
      return <h1>Card 2</h1>;
    }
    case 3: {
      return <h1>Card 3</h1>;
    }
    case 4: {
      return <h1>Card 4</h1>;
    }
  }
}
