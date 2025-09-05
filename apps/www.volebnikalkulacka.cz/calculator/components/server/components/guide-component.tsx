import { Card } from "@repo/design-system/server";

export function GuideComponent() {
  return (
    <div>
      <p>Odpovídejte ANO/NE nebo otázku přeskočte (pak se do výpočtu nebude počítat).</p>
      <Card>✔✔ Při shodě s Vaší odpovědí strana nebo politik dostane bod</Card>
      <Card>✔✘ Při neshodě bod naopak ztratí</Card>
      <Card>⭐ Pro vás důležitá témata označte hvězdičkou. Odpověď pak bude mít ve výpočtu shody dvojnásobnou váhu.</Card>
    </div>
  );
}
