import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nás",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h1 className="ko:text-3xl ko:font-bold ko:mb-8">O nás</h1>

      <div className="ko:space-y-6">
        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Co je volební kalkulačka</h2>
          <p className="ko:mb-3">
            Volební kalkulačka® (anglicky Voting Advice Application, VAA) je online nástroj, který porovnává vaše politické postoje s postoji stran, kandidátů nebo zákonodárců. Pomáhá voličům lépe se
            orientovat v programech a rozhodovat se podle skutečných postojů.
          </p>
          <p>
            Od svého vzniku se kalkulačky staly důležitou součástí demokratických voleb po celém světě – více o historii najdete na{" "}
            <a href="https://cs.wikipedia.org/wiki/Volební_kalkulačka" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
              Wikipedii
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Kdo ji tvoří</h2>
          <p className="ko:mb-3">
            V Česku a na Slovensku vyvíjí a provozuje volební kalkulačky spolek{" "}
            <a href="https://kohovolit.eu" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
              KohoVolit.eu
            </a>{" "}
            už od roku 2006. Od té doby jsme vytvořili přes 150 kalkulaček pro všechny typy voleb – evropské, prezidentské, parlamentní, krajské i komunální.
          </p>
          <p className="ko:mb-3">
            Naše kalkulačky využily miliony voličů – například v prezidentských volbách 2023 v ČR více než 2,5 milionu. Spolupracujeme i s partnery v dalších evropských zemích.
          </p>
          <p>Naše partnerské kalkulačky:</p>
          <ul className="ko:list-disc ko:list-inside ko:space-y-1 ko:mt-2">
            <li>
              🇭🇺{" "}
              <a href="https://www.voksmonitor.hu" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Voksmonitor
              </a>{" "}
              v Maďarsku
            </li>
            <li>
              🇦🇹{" "}
              <a href="https://www.wahlrechner.at" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Wahlrechner
              </a>{" "}
              v Rakousku
            </li>
            <li>
              🇸🇰{" "}
              <a href="https://www.volebnakalkulacka.sk" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Volebná kalkulačka
              </a>{" "}
              na Slovensku
            </li>
            <li>
              🇽🇰{" "}
              <a href="https://www.kalkulatorizgjedhor.org" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Kalkulatori zgjedhor
              </a>{" "}
              v Kosovu
            </li>
            <li>
              🇦🇱{" "}
              <a href="https://www.kalkulatorizgjedhor.al" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Kalkulatori zgjedhor
              </a>{" "}
              v Albánii
            </li>
            <li>
              🇷🇴{" "}
              <a href="https://www.testvot.eu" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Testvot
              </a>{" "}
              v Rumunsku
            </li>
          </ul>
        </section>
        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Typy kalkulaček</h2>
          <div className="ko:space-y-3">
            <div>
              <h3 className="ko:font-semibold ko:mb-1">Volební kalkulačka (názorový test)</h3>
              <p className="ko:text-sm ko:text-gray-600">Srovnává vaše odpovědi s odpověďmi stran a kandidátů.</p>
            </div>
            <div>
              <h3 className="ko:font-semibold ko:mb-1">Inventura hlasování</h3>
              <p className="ko:text-sm ko:text-gray-600">Porovnává vaše postoje s reálnými hlasováními poslanců či europoslanců v uplynulém období.</p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Jak vyhodnocujeme shodu</h2>
          <p className="ko:mb-3">
            Otázka, u níž neodpovíte „Ano" či „Ne", se do výpočtu nezahrnuje. Pokud na otázku odpovíte „Ano", strany či kandidáti, kteří rovněž odpověděli „Ano", získávají jeden bod. Strany či
            kandidáti, kteří odpověděli „Ne", jeden bod ztrácejí. Pokud odpovíte „Ne", získávají jeden bod strany či kandidáti, kteří rovněž odpověděli „Ne". Ti, kteří odpověděli „Ano", naopak jeden
            bod ztrácejí. Strany či kandidáti, kteří na otázku neodpověděli „Ano" ani „Ne", nezískávají ani neztrácí žádné body.
          </p>
          <p className="ko:mb-3">
            U Inventury hlasování platí, že pokud se poslanec daného hlasování nezúčastnil, je jeho postoj neutrální (nevíme, jak by hlasoval) a nezíská ani neztratí bod. Pokud v té době vůbec nebyl
            poslancem, toto hlasování se do shody s ním vůbec nezapočte.
          </p>
          <p className="ko:mb-3">
            Následně se každé straně či kandidátovi sečtou body za všechny otázky, u nichž jste odpověděli „Ano" či „Ne", a výsledek se vydělí počtem takových otázek. Tím je získána shoda v rozmezí
            -100 % až 100 %. Pro větší názornost se shoda převádí na rozmezí 0 % až 100 % tak, že se vydělí dvěma a přičte se k ní 50 % (u kalkulaček od poloviny roku 2013).
          </p>

          <h3 className="ko:text-lg ko:font-semibold ko:mb-2">Důležitost otázek a hlasování</h3>
          <p className="ko:mb-3">
            U každé otázky či hlasování máte možnost nastavit, jakou pro Vás má shoda důležitost, tedy váhu s jakou se má zahrnout do celkového součtu shody. Každé ze dvou úrovní důležitosti
            (normální, vysoká) odpovídá jistá váha a celková shoda je pak váženým průměrem shody v jednotlivých otázkách či hlasováních. Ve skutečnosti se tedy místo jednoho bodu ke shodě přičte,
            resp. odečte váha příslušné otázky či hlasování a na konci se dělí nikoli počtem otázek či hlasování, ale součtem absolutních hodnot jejich vah. Nastavení vah je takové, že vysoká
            důležitost má oproti normální důležitosti dvojnásobnou váhu.
          </p>

          <h3 className="ko:text-lg ko:font-semibold ko:mb-2">Zobrazení výsledné shody</h3>
          <p>Může se stát, že Vám vyjde stejná shoda se dvěma nebo více stranami či osobami. V tom případě je pořadí stran či osob při zobrazení výsledné shody určeno náhodně.</p>
        </section>
        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Současnou Volební kalkulačku připravili</h2>
          <div className="ko:grid ko:grid-cols-1 ko:md:grid-cols-2 ko:gap-4">
            <div className="ko:space-y-3">
              <div>
                <a href="https://www.linkedin.com/in/skopmichal/" className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium" target="_blank" rel="noopener noreferrer">
                  Michal Škop
                </a>
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">KohoVolit.eu</span>
              </div>
              <div>
                <a href="https://www.linkedin.com/in/krystofk/" className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium" target="_blank" rel="noopener noreferrer">
                  Kryštof Korb
                </a>
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">Tech Lead</span>
              </div>
              <div>
                <a
                  href="https://www.linkedin.com/in/katerina-mahdalova-89050a70/"
                  className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kateřina Mahdalová
                </a>
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">obsah a komunikace</span>
              </div>
              <div>
                <a href="https://www.linkedin.com/in/mwenisch/" className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium" target="_blank" rel="noopener noreferrer">
                  Martin Wenisch
                </a>
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">Tech</span>
              </div>
            </div>
            <div className="ko:space-y-3">
              <div>
                <a href="https://www.linkedin.com/in/mew-dev/" className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium" target="_blank" rel="noopener noreferrer">
                  Michał Wierzgoń
                </a>
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">Development</span>
              </div>
              <div>
                <a href="https://www.linkedin.com/in/klara-scholleova/" className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium" target="_blank" rel="noopener noreferrer">
                  Klára Schoelleová
                </a>
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">UX/UI</span>
              </div>
              <div>
                <a href="https://www.linkedin.com/in/klara-scholleova/" className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium" target="_blank" rel="noopener noreferrer">
                  Natália Bebjaková
                </a>
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">UX/UI</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
