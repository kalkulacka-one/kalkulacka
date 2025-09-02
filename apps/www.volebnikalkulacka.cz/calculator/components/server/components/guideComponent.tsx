import { Card } from "@repo/design-system/server";

export type GuideComponent = {
  href: string;
};

export function GuideComponent({ href }: GuideComponent) {
  return (
    <div>
      <p>
        Odpovídejte ANO/NE nebo otázku přeskočte (pak se do výpočtu nebude počítat). <a href={href}>Více o výpočtu shody</a>
      </p>
      <Card>✔✔ Při shodě s Vaší odpovědí strana nebo politik dostane bod</Card>
      <Card>✔✘ Při neshodě bod naopak ztratí</Card>
      <Card>⭐ Pro vás důležitá témata označte hvězdičkou. Odpověď pak bude mít ve výpočtu shody dvojnásobnou váhu.</Card>
    </div>
  );
}
