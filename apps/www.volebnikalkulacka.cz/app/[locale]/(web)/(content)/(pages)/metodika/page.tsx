import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodika výběru a tvorby otázek",
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Metodika výběru a tvorby otázek</h1>

      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✕</span>
            </div>
            <h2 className="text-xl font-semibold text-red-700">Nevyhovující příklad</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-green-700">Vyhovující příklad</h2>
          </div>
        </div>

        {/* Rule 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">1. Otázka se musí týkat toho, co mají zvolení politici šanci ovlivnit.</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">ČR by měla vystoupit z EU. (otázka v krajských volbách)</p>
                <p className="text-sm text-red-600 mt-1">Krajští politici nemohou ovlivnit vystoupení z EU</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">ČR by měla vystoupit z EU. (otázka v celostátních volbách)</p>
                <p className="text-sm text-green-600 mt-1">Celostátní politici mohou ovlivnit vystoupení z EU</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Chtěl/a bych, aby se v příštích volbách Praha vrátila k systému jediného volebního obvodu. (otázka v pražských volbách)</p>
                <p className="text-sm text-green-600 mt-1">Pražští politici mohou ovlivnit volební systém v Praze</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">2. Na otázku musí jít odpovědět ano i ne a neměla by navádět k odpovědi.</h2>
          <p className="text-gray-700 mb-4">
            Při tvorbě si musíme umět představit lidi, kteří vybírají obě varianty odpovědi, ano i ne. Z otázky by také nemělo být poznat, jak na ni odpovídá sám autor otázky.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Měla by se zlepšit dopravní situace v městských částech Považský Chlmec a Vranie?</p>
                <p className="text-sm text-red-600 mt-1">Otázka je příliš obecná a nekonkrétní</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Chtěl/a bych, aby Opencard nebyla pro cestující cenově výhodnější oproti „papírové tramvajence", aby si cestující mohli vybrat.</p>
                <p className="text-sm text-red-600 mt-1">"aby si mohli vybrat" navádí k odpovědi</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Měla by se vybudovat oddychová zóna pri Rajčianke?</p>
                <p className="text-sm text-green-600 mt-1">Konkrétní otázka s jasným cílem (pouze za předpokladu, že "každý" ví, o co jde)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Mělo by se alespoň 1% z rozpočtu města určeného na dopravu vyčlenit na cyklistickou dopravu?</p>
                <p className="text-sm text-green-600 mt-1">Konkrétní, měřitelná otázka s jasným cílem</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">3. Otázky mají být důležité</h2>
          <p className="text-gray-700 mb-4">
            Bereme např. v potaz, na co vydává dané zastupitelstvo/parlament nejvíce veřejných peněz. Témata vybíráme tak, aby byla relevantní pro všechny skupiny voličů (věkové, příjmové, zájmové).
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Mělo se město omluvit pí. Lorenzové a p. Cejthamrovi za výroky, které při této konfrontaci byly vysloveny?</p>
                <p className="text-sm text-red-600 mt-1">Příliš specifická situace, která není důležitá pro většinu voličů</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Hlasovali byste za zrušení garance a automatický vstup do druhého pilíře?</p>
                <p className="text-sm text-green-600 mt-1">Důležité téma pro všechny občany</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Hlasovali byste za důvěru vládě a permanentní euroval?</p>
                <p className="text-sm text-green-600 mt-1">Důležité téma s dopadem na všechny občany</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">4. Otázka má být co nejkonkrétnější</h2>
          <p className="text-gray-700 mb-4">Jde nám o to, aby se dala odpověď zkontrolovat po 4 letech/na konci volebního období.</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Měla by sa zahušťovat výstavba v centru města?</p>
                <p className="text-sm text-red-600 mt-1">Příliš obecná otázka, nelze ověřit splnění</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Podle mého názoru by z letiště Ruzyně do centra Prahy měla vést rychlodráha.</p>
                <p className="text-sm text-red-600 mt-1">Správně by bylo: "Budu prosazovat/chci, aby se rychlodráha z letiště do centra Prahy začala budovat v následujících 4 letech"</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Měla by se zvýšit dotace pro MHD minimálně o 10% oproti roku 2010?</p>
                <p className="text-sm text-green-600 mt-1">Konkrétní, měřitelná otázka s jasným cílem</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">5. Otázka musí být krátká a srozumitelná</h2>
          <p className="text-gray-700 mb-4">Chceme, aby tázaný/á otázky opravdu pročetl/a a porozuměl/a jim. Formulujeme je tedy o max. délce 20 slov, případný popis omezujeme na 50 slov.</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">
                  Hlasovali byste pro: zrušení sociálního příplatku pro sólo rodiče, redukci dávky – porodného jen na nízkopříjmové rodiče, jednotnou celkovou vyplacenou částku rodičovského příspěvku
                  (220 000) a větší flexibilitu ve volbě výše a délky RP, snížení příspěvku na péči, snížení podpory v nezaměstnanosti a zrušení možnosti minimálního přivýdělku k podpoře, zavedení
                  příspěvku pro začínající podnikatele/ky, zpřísnění podmínek nároku na nemocenské a mateřskou u OSVČ?
                </p>
                <p className="text-sm text-red-600 mt-1">Příliš dlouhá otázka s mnoha částmi</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Souhlasím se zavedením turniketů do metra.</p>
                <p className="text-sm text-green-600 mt-1">Krátká, jasná otázka</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">6. Otázky s popisem musejí dávat smysl i bez něj</h2>
          <p className="text-gray-700 mb-4">Velký počet lidí totiž čte pouze otázku samotnou, ne její popis. Může se take stát, že popis na mobilním zařízení nezobrazí.</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Hlasovali by ste za zrušení garancie a automatický vstup do druhého pilíře?</p>
                <p className="text-sm text-red-600 mt-1">Bez popisu není jasné, o co jde</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Má podle Vás smysl připojovat se k podobným projektům?</p>
                <p className="text-sm text-red-600 mt-1">Bez kontextu není jasné, o jaké projekty jde</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Souhlasím se zpoplatněním vjezdu automobilů do centra města, například formou mýtného.</p>
                <p className="text-sm text-green-600 mt-1">Jasná otázka i bez popisu</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">7. Upřednostňujeme otázky v pozitivním tvaru, vyhýbáme se matoucí dvojité negaci.</h2>
          <p className="text-gray-700 mb-4">Z příkladu níže je viditelné, že dvojitá negace je zavádějící a nepřesná.</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Na Vysočině by úložiště jaderného odpadu nemělo vzniknout za žádnou cenu.</p>
                <p className="text-sm text-red-600 mt-1">
                  Zde totiž není jasné, s čím tázaný/á nesouhlasí:
                  <br />
                  a) ne, nemělo by vzniknout,
                  <br />
                  b) nesouhlasím, mělo by vzniknout.
                  <br />
                  <br />
                  Správně formulována otázka by měla znít: "Měl by kraj učinit vše proti vzniku úložiště jaderného odpadu?"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Střední školy by se měly nadále slučovat do větších celků.</p>
                <p className="text-sm text-green-600 mt-1">Nikoliv "Střední školy už by se nadále neměly slučovat do větších celků".</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 8 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">8. Otázka musí být psána snadno pochopitelným jazykem</h2>
          <p className="text-gray-700 mb-4">Otázky píšeme tak, aby ji a tématu porozuměli různé společenské skupiny.</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <div>
                <p className="font-medium text-red-800">Nový územní plán musí regulovat výškovou výstavbu, která může poškodit panorama Prahy.</p>
                <p className="text-sm text-red-600 mt-1">Příliš odborný jazyk, složitá formulace</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Výstavba mrakodrapů v historickém centru má být zakázána.</p>
                <p className="text-sm text-green-600 mt-1">Jasný, srozumitelný jazyk</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 9 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">9. Vybíráme i otázky, které jsou zajímavé, i když ne zcela důležité.</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Hlasovali byste za (myšleno ironicky) návrh barevně napovídat poslancům, jak hlasovat?</p>
                <p className="text-sm text-green-600 mt-1">Zajímavá otázka pro testování postojů</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Hlasovali byste pro zákon "Václav Havel se zasloužil o svobodu a demokracii."?</p>
                <p className="text-sm text-green-600 mt-1">Zajímavá otázka pro testování postojů</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
