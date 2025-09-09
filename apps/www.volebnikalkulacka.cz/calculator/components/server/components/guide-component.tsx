import { Card } from "@repo/design-system/server";

export function GuideComponent() {
  return (
    <div className="grid gap-4">
      <Card shadow="hard">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ✅
          </span>
          <div>
            <p className="font-semibold">Shoda</p>
            <p className="text-sm">Při shodě s Vaší odpovědí strana nebo politik dostane bod</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ❌
          </span>
          <div>
            <p className="font-semibold">Neshoda</p>
            <p className="text-sm">Při neshodě bod naopak ztratí</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ⏭️
          </span>
          <div>
            <p className="font-semibold">Přeskočit</p>
            <p className="text-sm">Otázku můžete přeskočit a nebude se do výpočtu počítat</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ⭐
          </span>
          <div>
            <p className="font-semibold">Důležité otázky</p>
            <p className="text-sm">Pro vás důležité otázky označte hvězdičkou. Odpověď pak bude mít ve výpočtu shody dvojnásobnou váhu.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
