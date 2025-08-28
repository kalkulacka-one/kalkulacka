import { Button } from "@repo/design-system/client";

type NavodView = {
  isLoading: boolean;
  guideStep: number;
  electionTitle?: string;
  calculatorIntro?: string;
  onStartCalculator: () => void;
  onSkip: () => void;
};

export const NavodView = ({ isLoading, guideStep, electionTitle, calculatorIntro, onStartCalculator, onSkip }: NavodView) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Návod, guideStep: {guideStep}
      <h2>{electionTitle}</h2>
      <p>{calculatorIntro}</p>
      {guideStep === 4 ? (
        <Button variant="filled" color="primary" onClick={onStartCalculator}>
          Spustit kalkulačku
        </Button>
      ) : (
        <Button variant="link" color="neutral" onClick={onSkip}>
          Přeskočit
        </Button>
      )}
    </div>
  );
};
