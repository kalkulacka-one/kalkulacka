import { Card, Button } from "@repo/design-system/ui";

const donationPerks = ["100", "200", "500"];

export default function ResultsDonateCard() {
  return (
    <Card
      shadow="default"
      corner="topLeft"
      border="none"
      className="flex max-w-full flex-col items-start gap-4 p-customMobile sm:p-customDesktop"
    >
      <h2 className="text-5xl font-bold">Líbí se vám Volební kalkulačka?</h2>
      <p className="font-light">
        Máme radost, že jste využili Volební kakulačku. Díky dobrovolníkům a
        štědrým dárcům můžeme kalkulačku poskytovat zdarma.
      </p>
      <p className="font-light">
        Pokud se vám kalkulačka líbí a chcete, aby byla k dispozici i nadále,
        přidejte se k našemu týmu dobrovolníků, do klubu podporovatelů na
        Herohero nebo nás podpořte finančně. Každý příspěvek se počítá!
      </p>
      <Button kind="filled" color="primary" fitContent>
        Chci se zapojit
      </Button>
      <div className="flex flex-wrap items-start gap-4">
        <Button kind="filled" color="primary" fitContent>
          Chci přispět
        </Button>
        {donationPerks.map((perk) => (
          <Button kind="inverse" color="primary" fitContent>
            {perk} Kč
          </Button>
        ))}
      </div>
      <p className="font-light">
        Děkujeme za podporu, díky které můžeme připravit Volební kalkulačku pro
        podzimní komunální a senátní volby a dále ji vylepšovat.
      </p>
    </Card>
  );
}

// TODO:
// 1. Fix button / links styles with new components
// 2. update links
