import { Button } from "@repo/design-system/ui";

type Props = {
  onClick: (button: ButtonType) => void;
};

export function QuestionGuide({ onClick }: Props) {
  return (
    <>
      <div className="k1-flex k1-w-full k1-flex-col k1-items-center">
        <span className="k1-font-primary k1-text-2xl k1-font-bold k1-tracking-tight k1-text-neutral-strong">
          Krajské volby
          <span className="k1-text-base k1-text-neutral">
            Jihomoravský kraj
          </span>
        </span>
        <p className="k1-font-primary k1-text-base">
          Vítejte ve Volební kalkulačce pro krajské volby 2024 pro Jihomoravský
          kraj. Čeká vás 25 otázek. Stejné otázky dostaly všechny kandidující
          strany. Zodpovězení otázek zabere zhruba 10 minut a na konci se
          dozvíte, jak se jednotlivé strany shodují s vašimi názory.
        </p>
        <p className="k1-font-primary k1-text-base">
          Oslovili jsme všechny strany bez výjimky. Pokud se některá neobjeví ve
          výsledcích, je to proto, že (zatím) neposlala svoje odpovědi.
        </p>
      </div>
      <div>
        <Button kind="link" onClick={() => onClick("guide")}>
          Přeskočit návod ▶▶
        </Button>
      </div>
    </>
  );
}
