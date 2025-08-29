import { mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";
import { DotIndicator } from "@repo/design-system/server";
import { GuideCard } from "./guideCard";

type NavodView = {
  isLoading: boolean;
  guideStep: number;
  electionTitle?: string;
  calculatorIntro?: string;
  onStartCalculator: () => void;
  onSkip: () => void;
  handleGuideStep: (handleType: string) => void;
};

function GuideContent({ guideStep, calculatorIntro }: { guideStep: number; calculatorIntro: string | undefined }) {
  switch (guideStep) {
    case 1: {
      return <div>{calculatorIntro}</div>;
    }
    case 2: {
      return (
        <div>
          <p>Odpovídat můžete pomocí tlačítek:</p>
          <GuideCard stepCurrent={guideStep} />
          <p>
            Když se s politikem nebo stranou v odpovědi shodnete, získá ve výpočtu shody 1 bod. V opačném případě 1 bod ztratí. Pokud kandidát nebo strana na otázku neodpověděli, započítá se ziskem 0
            bodů.
          </p>
        </div>
      );
    }
    case 3: {
      return (
        <div>
          <p>Pokud vám na daném tématu zvlášť záleží, označte ho hvězdičkou:</p>
          <GuideCard stepCurrent={guideStep} />
          <p> Odpověď pak bude mít ve výpočtu shody dvojnásobnou váhu.</p>
        </div>
      );
    }

    case 4: {
      return (
        <div>
          <p>Když si nejste si jisti, téma Vás nezajímá nebo z jiného důvodu nechcete odpovídat, můžete otázku přeskočit šipkou napravo.</p>
          <GuideCard stepCurrent={guideStep} />

          <p>Tato otázka se do výpočtu vaší shody nezapočítá.</p>
        </div>
      );
    }
  }
  return null;
}

export const NavodView = ({ isLoading, guideStep, electionTitle, calculatorIntro, onStartCalculator, onSkip, handleGuideStep }: NavodView) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{electionTitle}</h2>
      <GuideContent guideStep={guideStep} calculatorIntro={calculatorIntro} />
      <div className="font-bold uppercase text-xs flex items-center gap-8">
        <div>Návod: {guideStep} / 4</div>
        <DotIndicator stepCurrent={guideStep} stepTotal={4} />
      </div>
      {guideStep === 4 ? (
        <Button variant="filled" color="primary" onClick={onStartCalculator}>
          Spustit kalkulačku
        </Button>
      ) : (
        <Button variant="outline" color="neutral" onClick={() => handleGuideStep("next")}>
          Další krok
        </Button>
      )}
      {guideStep < 4 && (
        <Button variant="link" color="neutral" onClick={onSkip}>
          Přeskočit návod
        </Button>
      )}
      <div className="flex gap-8">
        <div className={`${guideStep > 1 ? "visible" : "invisible"}`}>
          <Button variant="link" color="neutral" onClick={() => handleGuideStep("previous")}>
            <Icon size="large" icon={mdiArrowLeft} title="arrowLeft" decorative={false} />
          </Button>
        </div>
        <div className={`${guideStep < 4 ? "visible" : "invisible"}`}>
          <Button variant="link" color="neutral" onClick={() => handleGuideStep("next")}>
            <Icon size="large" icon={mdiArrowRight} title="arrowRight" decorative={false} />
          </Button>
        </div>
      </div>
    </div>
  );
};
