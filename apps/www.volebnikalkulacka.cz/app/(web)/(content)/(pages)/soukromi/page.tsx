import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ochrana dat",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h1 className="ko:text-3xl ko:font-bold ko:mb-8">Ochrana dat</h1>

      <div className="ko:space-y-6">
        <section>
          <p className="ko:mb-4">
            V tomto dokumentu naleznete informace o tom, jaké údaje o Vás zpracováváme my, spolek KohoVolit.eu, IČO: 22841890, se sídlem Vinice 347, Plasy, zapsaný ve spolkovém rejstříku vedeném u
            Krajského soudu v Plzni, spisová značka: L 5397, jako správce osobních údajů. Dozvíte se také, za jakými účely zpracováváme Vaše osobní údaje a z jakých zdrojů je získáváme. V poslední
            části uvádíme, jaká máte práva při zpracování Vašich osobních údajů a jak je můžete uplatnit.
          </p>
        </section>

        <section>
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">Jaké osobní údaje zpracováváme a za jakými účely?</h2>

          <div className="ko:space-y-4">
            <div className="ko:bg-gray-50 ko:p-4 ko:rounded-lg">
              <h3 className="ko:text-lg ko:font-semibold ko:mb-2">Základní verze Volební kalkulačky</h3>
              <p className="ko:text-gray-700">
                Základní verze Volební kalkulačky nepoužívá cookies ani nesbírá žádná data o Vás. Pokud kalkulačku využijete anonymně, nejsou sbírány žádné osobní údaje.
              </p>
            </div>

            <div className="ko:bg-blue-50 ko:p-4 ko:rounded-lg">
              <h3 className="ko:text-lg ko:font-semibold ko:mb-2">Sdílení odpovědí</h3>
              <p className="ko:text-gray-700">
                V případě sdílení Vašich odpovědí zpracováváme údaje o Vašich odpovědích a odvozených preferencích. Tyto údaje budeme zpracovávat na základě Vašeho souhlasu a pouze za účelem sdílení
                Vašich odpovědí, po dobu 1 měsíce od provedení sdílení.
              </p>
            </div>

            <div className="ko:bg-green-50 ko:p-4 ko:rounded-lg">
              <h3 className="ko:text-lg ko:font-semibold ko:mb-2">E-mailové informace</h3>
              <p className="ko:text-gray-700">
                V případě udělení souhlasu pro příležitostné zasílání informačních a propagačních e-mailů uložíme Vaši e-mailovou adresu a budeme ji zpracovávat pro tyto účely. Dozvíte se tak
                například o spuštění Volební kalkulačky pro nadcházející volby. Souhlas lze kdykoliv odvolat – na uvedených kontaktech nebo přímo v zaslaném e-mailu. Osobní údaje zpracováváme do
                odvolání Vašeho souhlasu.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">Z jakých zdrojů osobní údaje získáváme?</h2>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3">
              <div className="ko:w-2 ko:h-2 ko:bg-primary ko:rounded-full ko:mt-2 ko:flex-shrink-0" />
              <p className="ko:text-gray-700">Osobní údaje pocházejí především od Vás, a to z Vašeho používání webu Volební kalkulačky a vyplňování údajů.</p>
            </div>
            <div className="ko:flex ko:items-start ko:gap-3">
              <div className="ko:w-2 ko:h-2 ko:bg-primary ko:rounded-full ko:mt-2 ko:flex-shrink-0" />
              <p className="ko:text-gray-700">
                Další osobní údaje získáváme v rámci naší činnosti, přičemž se jedná zejména o odvozené údaje z Vámi poskytnutých údajů, například údaje o Vaší předpokládané volební preferenci a shodě
                s preferencemi vybraného kandidáta.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">Jaká máte práva při zpracování osobních údajů?</h2>

          <div className="ko:bg-yellow-50 ko:p-4 ko:rounded-lg ko:border-l-4 ko:border-yellow-400 ko:mb-4">
            <p className="ko:text-gray-700 ko:mb-3">
              Stejně jako my máme svá práva a povinnosti při zpracování Vašich osobních údajů, máte i Vy určitá práva. Všechna tato práva, stejně jako dotazy či stížnosti, můžete uplatnit na e-mailové
              adrese{" "}
              <a href="mailto:info@kohovolit.eu" className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium">
                info@kohovolit.eu
              </a>
            </p>
            <p className="ko:text-gray-700">
              Váš požadavek vyřídíme co nejdříve, nejpozději do jednoho měsíce. Tuto lhůtu můžeme ve výjimečných případech prodloužit o další dva měsíce, o čemž Vás budeme informovat.
            </p>
          </div>

          <div className="ko:bg-white ko:p-6 ko:rounded-lg ko:border ko:border-gray-200">
            <h3 className="ko:text-lg ko:font-semibold ko:mb-4">V souvislosti se zpracováním Vašich osobních údajů máte tato práva:</h3>

            <div className="ko:space-y-4">
              <div className="ko:flex ko:items-start ko:gap-3">
                <div className="ko:w-6 ko:h-6 ko:bg-blue-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                  <span className="ko:text-white ko:text-sm ko:font-bold">1</span>
                </div>
                <div>
                  <h4 className="ko:font-semibold ko:text-gray-800 ko:mb-1">Právo odvolat souhlas</h4>
                  <p className="ko:text-gray-700">Můžete kdykoliv odvolat souhlas se zpracováním osobních údajů.</p>
                </div>
              </div>

              <div className="ko:flex ko:items-start ko:gap-3">
                <div className="ko:w-6 ko:h-6 ko:bg-blue-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                  <span className="ko:text-white ko:text-sm ko:font-bold">2</span>
                </div>
                <div>
                  <h4 className="ko:font-semibold ko:text-gray-800 ko:mb-1">Právo na přístup</h4>
                  <p className="ko:text-gray-700">Můžete požadovat potvrzení, zda Vaše osobní údaje zpracováváme, a získat k nim přístup.</p>
                </div>
              </div>

              <div className="ko:flex ko:items-start ko:gap-3">
                <div className="ko:w-6 ko:h-6 ko:bg-blue-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                  <span className="ko:text-white ko:text-sm ko:font-bold">3</span>
                </div>
                <div>
                  <h4 className="ko:font-semibold ko:text-gray-800 ko:mb-1">Právo na opravu</h4>
                  <p className="ko:text-gray-700">Máte právo požadovat opravu nepřesných nebo doplnění neúplných osobních údajů.</p>
                </div>
              </div>

              <div className="ko:flex ko:items-start ko:gap-3">
                <div className="ko:w-6 ko:h-6 ko:bg-blue-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                  <span className="ko:text-white ko:text-sm ko:font-bold">4</span>
                </div>
                <div>
                  <h4 className="ko:font-semibold ko:text-gray-800 ko:mb-1">Právo na výmaz</h4>
                  <p className="ko:text-gray-700">V určitých případech můžete požadovat výmaz osobních údajů.</p>
                </div>
              </div>

              <div className="ko:flex ko:items-start ko:gap-3">
                <div className="ko:w-6 ko:h-6 ko:bg-blue-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                  <span className="ko:text-white ko:text-sm ko:font-bold">5</span>
                </div>
                <div>
                  <h4 className="ko:font-semibold ko:text-gray-800 ko:mb-1">Právo na omezení zpracování</h4>
                  <p className="ko:text-gray-700">Můžete žádat omezení zpracování v zákonem stanovených případech.</p>
                </div>
              </div>

              <div className="ko:flex ko:items-start ko:gap-3">
                <div className="ko:w-6 ko:h-6 ko:bg-blue-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                  <span className="ko:text-white ko:text-sm ko:font-bold">6</span>
                </div>
                <div>
                  <h4 className="ko:font-semibold ko:text-gray-800 ko:mb-1">Právo na přenositelnost</h4>
                  <p className="ko:text-gray-700">Máte právo získat kopii osobních údajů v běžně používaném formátu a předat je jinému správci.</p>
                </div>
              </div>

              <div className="ko:flex ko:items-start ko:gap-3">
                <div className="ko:w-6 ko:h-6 ko:bg-blue-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                  <span className="ko:text-white ko:text-sm ko:font-bold">7</span>
                </div>
                <div>
                  <h4 className="ko:font-semibold ko:text-gray-800 ko:mb-1">Právo vznést námitku</h4>
                  <p className="ko:text-gray-700">Proti zpracování založenému na našem oprávněném zájmu či proti zpracování pro přímý marketing.</p>
                </div>
              </div>

              <div className="ko:flex ko:items-start ko:gap-3">
                <div className="ko:w-6 ko:h-6 ko:bg-blue-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                  <span className="ko:text-white ko:text-sm ko:font-bold">8</span>
                </div>
                <div>
                  <h4 className="ko:font-semibold ko:text-gray-800 ko:mb-1">Právo podat stížnost</h4>
                  <p className="ko:text-gray-700">
                    U dozorového úřadu, kterým je <span className="ko:font-medium">Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
