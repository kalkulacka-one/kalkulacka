// TODO [TENANT-009]: Translate about page to Slovak

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
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Čo je Volebná kalkulačka</h2>
          <p className="ko:mb-3">
            Volebná kalkulačka® (anglicky Voting Advice Application, VAA) je online nástroj, ktorý porovnáva vaše politické postoje s postojmi strán, kandidátov alebo zákonodarcov. Pomáha voličom
            lepšie sa orientovať v programoch a rozhodovať sa podľa skutočných postojov.
          </p>
          <p>
            Od svojho vzniku sa kalkulačky stali dôležitou súčasťou demokratických volieb po celom svete – viac o histórii nájdete na{" "}
            <a href="https://cs.wikipedia.org/wiki/Volební_kalkulačka" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
              Wikipedii
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Kto ju tvorí</h2>
          <p className="ko:mb-3">
            V Česku a na Slovensku vyvíja a prevádzkuje volebné kalkulačky združenie{" "}
            <a href="https://kohovolit.eu" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
              KohoVolit.eu
            </a>{" "}
            už od roku 2006. Odvtedy sme vytvorili viac ako 150 kalkulačiek pre všetky typy volieb – európske, prezidentské, parlamentné, krajské aj komunálne.
          </p>
          <p className="ko:mb-3">
            Naše kalkulačky využili milióny voličov – napríklad v prezidentských voľbách 2023 v ČR viac než 2,5 milióna. Spolupracujeme aj s partnermi v ďalších európskych krajinách.
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
              v Rakúsku
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
              v Kosove
            </li>
            <li>
              🇦🇱{" "}
              <a href="https://www.kalkulatorizgjedhor.al" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Kalkulatori zgjedhor
              </a>{" "}
              v Albánsku
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
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Typy kalkulačiek</h2>
          <div className="ko:space-y-3">
            <div>
              <h3 className="ko:font-semibold ko:mb-1">Volebná kalkulačka (názorový test)</h3>
              <p className="ko:text-sm ko:text-gray-600">Porovnáva vaše odpovede s odpoveďami strán a kandidátov.</p>
            </div>
            <div>
              <h3 className="ko:font-semibold ko:mb-1">Inventúra hlasovaní</h3>
              <p className="ko:text-sm ko:text-gray-600">Porovnáva vaše postoje so skutočnými hlasovaniami poslancov alebo europoslancov v uplynulom období.</p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Ako vyhodnocujeme zhodu</h2>
          <p className="ko:mb-3">
            Otázka, na ktorú neodpoviete „Áno“ alebo „Nie“, sa do výpočtu nezahrnie. Ak odpoviete „Áno“, strany či kandidáti, ktorí odpovedali tiež „Áno“, získajú jeden bod. Tí, ktorí odpovedali
            „Nie“, jeden bod stratia. Ak odpoviete „Nie“, získajú bod strany či kandidáti, ktorí odpovedali tiež „Nie“. Tí, ktorí odpovedali „Áno“, naopak jeden bod stratia. Strany či kandidáti, ktorí
            na otázku neodpovedali „Áno“ ani „Nie“, nezískajú ani nestratia žiadne body.
          </p>
          <p className="ko:mb-3">
            Pri Inventúre hlasovaní platí: ak sa poslanec hlasovania nezúčastnil, jeho postoj je neutrálny (nevieme, ako by hlasoval) a nezíska ani nestratí bod. Ak v danom čase vôbec nebol poslancom,
            toto hlasovanie sa do zhody s ním vôbec nezapočíta.
          </p>
          <p className="ko:mb-3">
            Následne sa každej strane či kandidátovi sčítajú body za všetky otázky, pri ktorých ste odpovedali „Áno“ alebo „Nie“, a výsledok sa vydelí počtom takých otázok. Tým vznikne zhoda v rozsahu
            -100 % až 100 %. Pre väčšiu názornosť sa zhoda prevádza na rozsah 0 % až 100 % tak, že sa vydelí dvomi a pripočíta sa 50 % (pri kalkulačkách od polovice roka 2013).
          </p>

          <h3 className="ko:text-lg ko:font-semibold ko:mb-2">Dôležitosť otázok a hlasovaní</h3>
          <p className="ko:mb-3">
            Pri každej otázke či hlasovaní si môžete nastaviť, akú dôležitosť má pre vás zhoda — teda váhu, s akou sa má zahrnúť do celkového súčtu. Každej z úrovní dôležitosti (normálna, vysoká)
            zodpovedá určitá váha a celková zhoda je potom váženým priemerom zhody v jednotlivých otázkach či hlasovaniach. V praxi sa teda namiesto jedného bodu pripočíta alebo odpočíta váha danej
            otázky či hlasovania a na konci sa nedelí počtom otázok, ale súčtom absolútnych hodnôt ich váh. Nastavenie váh je také, že vysoká dôležitosť má oproti normálnej dôležitosti dvojnásobnú
            váhu.
          </p>

          <h3 className="ko:text-lg ko:font-semibold ko:mb-2">Zobrazenie výslednej zhody</h3>
          <p>Môže sa stať, že vám vyjde rovnaká zhoda s dvomi alebo viacerými stranami či osobami. V tom prípade je poradie pri zobrazení výslednej zhody určené náhodne.</p>
        </section>
        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Súčasnú Volebnú kalkulačku pripravili</h2>
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
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">obsah a komunikácia</span>
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
