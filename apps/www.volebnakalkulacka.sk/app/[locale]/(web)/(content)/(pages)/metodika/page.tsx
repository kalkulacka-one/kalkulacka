// TODO [TENANT-012]: Translate methodology page to Slovak

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodika výberu a tvorby otázok",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h1 className="ko:text-3xl ko:font-bold ko:mb-8">Metodika výberu a tvorby otázok</h1>

      <div className="ko:space-y-8">
        {/* Introduction */}
        <div className="ko:bg-gray-50 ko:p-6 ko:rounded-lg">
          <div className="ko:flex ko:items-center ko:gap-3 ko:mb-4">
            <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center">
              <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
            </div>
            <h2 className="ko:text-xl ko:font-semibold ko:text-red-700">Nevyhovujúci príklad</h2>
          </div>
          <div className="ko:flex ko:items-center ko:gap-3">
            <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center">
              <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
            </div>
            <h2 className="ko:text-xl ko:font-semibold ko:text-green-700">Vyhovujúci príklad</h2>
          </div>
        </div>

        {/* Rule 1 */}
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">1. Otázka sa musí týkať toho, čo majú zvolení politici šancu ovplyvniť.</h2>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">ČR by mala vystúpiť z EÚ. (otázka v krajských voľbách)</p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">Krajskí politici nemôžu ovplyvniť vystúpenie z EÚ</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">ČR by mala vystúpiť z EÚ. (otázka v celoštátnych voľbách)</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Celoštátni politici môžu ovplyvniť vystúpenie z EÚ</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Chcel/a by som, aby sa v nasledujúcich voľbách Praha vrátila k systému jediného volebného obvodu. (otázka v pražských voľbách)</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Pražskí politici môžu ovplyvniť volebný systém v Prahe</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 2 */}
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">2. Na otázku musí ísť odpovedať áno aj nie a nemala by navádzať k odpovedi.</h2>
          <p className="ko:text-gray-700 ko:mb-4">
            Pri tvorbe si musíme vedieť predstaviť ľudí, ktorí si vyberajú obe varianty odpovede, áno aj nie. Z otázky by tiež nemalo byť poznať, ako na ňu odpovedá samotný autor otázky.
          </p>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">Mala by sa zlepšiť dopravná situácia v mestských častiach Považský Chlmec a Vranie?</p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">Otázka je príliš všeobecná a nekonkrétna</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">
                  Chcel/a by som, aby Opencard nebola pre cestujúcich cenovo výhodnejšia oproti „papierovej električenke", aby si cestujúci mohli vybrať.
                </p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">„aby si mohli vybrať“ navádza k odpovedi</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Mala by sa vybudovať oddychová zóna pri Rajčianke?</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Konkrétna otázka s jasným cieľom (iba za predpokladu, že „každý“ vie, o čo ide)</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Malo by sa aspoň 1 % z rozpočtu mesta určeného na dopravu vyčleniť na cyklistickú dopravu?</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Konkrétna, merateľná otázka s jasným cieľom</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 3 */}
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">3. Otázky majú byť dôležité</h2>
          <p className="ko:text-gray-700 ko:mb-4">
            Berieme napr. do úvahy, na čo dáva dané zastupiteľstvo/parlament najviac verejných peňazí. Témy vyberáme tak, aby boli relevantné pre všetky skupiny voličov (vekové, príjmové, záujmové).
          </p>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">Malo sa mesto ospravedlniť p. Lorenzovej a p. Cejthamrovi za výroky, ktoré pri tejto konfrontácii odzneli?</p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">Príliš špecifická situácia, ktorá nie je dôležitá pre väčšinu voličov</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Hlasovali by ste za zrušenie garancie a automatický vstup do druhého piliera?</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Dôležitá téma pre všetkých občanov</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Hlasovali by ste za dôveru vláde a permanentný euroval?</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Dôležitá téma s dopadom na všetkých občanov</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 4 */}
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">4. Otázka má byť čo najkonkrétnejšia</h2>
          <p className="ko:text-gray-700 ko:mb-4">Ide nám o to, aby sa dala odpoveď skontrolovať po 4 rokoch / na konci volebného obdobia.</p>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">Mala by sa zahusťovať výstavba v centre mesta?</p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">Príliš všeobecná otázka, nedá sa overiť splnenie</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">Podľa môjho názoru by z letiska Ruzyně do centra Prahy mala viesť rýchlodráha.</p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">Správne by bolo: „Budem presadzovať / chcem, aby sa rýchlodráha z letiska do centra Prahy začala budovať v nasledujúcich 4 rokoch“</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Mali by sa dotácie pre MHD zvýšiť minimálne o 10 % oproti roku 2010?</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Konkrétna, merateľná otázka s jasným cieľom</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 5 */}
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">5. Otázka musí byť krátka a zrozumiteľná</h2>
          <p className="ko:text-gray-700 ko:mb-4">Chceme, aby opýtaný/á otázky naozaj prečítal/a a porozumel/a im. Formulujeme ich preto na max. 20 slov, prípadný popis obmedzujeme na 50 slov.</p>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">
                  Hlasovali by ste za: zrušenie sociálneho príplatku pre sólo rodičov, zníženie dávky – pôrodného len pre nízkopríjmových rodičov, jednotnú celkovú vyplatenú sumu rodičovského
                  príspevku (220 000) a väčšiu flexibilitu pri voľbe výšky a dĺžky RP, zníženie príspevku na starostlivosť, zníženie podpory v nezamestnanosti a zrušenie možnosti minimálneho
                  privyrobenia popri podpore, zavedenie príspevku pre začínajúcich podnikateľov/ky, sprísnenie podmienok nároku na nemocenské a materskú u SZČO?
                </p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">Príliš dlhá otázka s mnohými časťami</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Súhlasím so zavedením turniketov do metra.</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Krátka, jasná otázka</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 6 */}
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">6. Otázky s popisom musia dávať zmysel aj bez neho</h2>
          <p className="ko:text-gray-700 ko:mb-4">Veľký počet ľudí totiž číta iba otázku samotnú, nie jej popis. Môže sa tiež stať, že sa popis na mobilnom zariadení nezobrazí.</p>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">Hlasovali by ste za zrušenie garancie a automatický vstup do druhého piliera?</p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">Bez popisu nie je jasné, o čo ide</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">Má podľa vás zmysel pripájať sa k podobným projektom?</p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">Bez kontextu nie je jasné, o aké projekty ide</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Súhlasím so spoplatnením vjazdu áut do centra mesta, napríklad formou mýta.</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Jasná otázka aj bez popisu</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 7 */}
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">7. Uprednostňujeme otázky v pozitívnom tvare, vyhýbame sa mätúcej dvojitej negácii.</h2>
          <p className="ko:text-gray-700 ko:mb-4">Z príkladu nižšie je vidieť, že dvojitá negácia je zavádzajúca a nepresná.</p>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">Na Vysočine by úložisko jadrového odpadu nemalo vzniknúť za žiadnu cenu.</p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">
                  Tu totiž nie je jasné, s čím opýtaný/á nesúhlasí:
                  <br />
                  a) nie, nemalo by vzniknúť,
                  <br />
                  b) nesúhlasím, malo by vzniknúť.
                  <br />
                  <br />
                  Správne formulovaná otázka by mala znieť: „Mal by kraj urobiť všetko proti vzniku úložiska jadrového odpadu?“
                </p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Stredné školy by sa mali naďalej zlučovať do väčších celkov.</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Nie „Stredné školy by sa už naďalej nemali zlučovať do väčších celkov“.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 8 */}
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">8. Otázka musí byť napísaná ľahko pochopiteľným jazykom</h2>
          <p className="ko:text-gray-700 ko:mb-4">Otázky píšeme tak, aby im a téme porozumeli rôzne spoločenské skupiny.</p>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-red-50 ko:border-l-4 ko:border-red-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-red-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✕</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-red-800">Nový územný plán musí regulovať výškovú výstavbu, ktorá môže poškodiť panorámu Prahy.</p>
                <p className="ko:text-sm ko:text-red-600 ko:mt-1">Príliš odborný jazyk, zložitá formulácia</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Výstavba mrakodrapov v historickom centre má byť zakázaná.</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Jasný, zrozumiteľný jazyk</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rule 9 */}
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">9. Vyberáme aj otázky, ktoré sú zaujímavé, aj keď nie celkom dôležité.</h2>

          <div className="ko:space-y-3">
            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Hlasovali by ste za (myslené ironicky) návrh farebne napovedať poslancom, ako hlasovať?</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Zaujímavá otázka na testovanie postojov</p>
              </div>
            </div>

            <div className="ko:flex ko:items-start ko:gap-3 ko:p-4 ko:bg-green-50 ko:border-l-4 ko:border-green-500 ko:rounded">
              <div className="ko:w-6 ko:h-6 ko:bg-green-500 ko:rounded-full ko:flex ko:items-center ko:justify-center ko:flex-shrink-0 ko:mt-1">
                <span className="ko:text-white ko:text-sm ko:font-bold">✓</span>
              </div>
              <div>
                <p className="ko:font-medium ko:text-green-800">Hlasovali by ste za zákon „Václav Havel sa zaslúžil o slobodu a demokraciu.“?</p>
                <p className="ko:text-sm ko:text-green-600 ko:mt-1">Zaujímavá otázka na testovanie postojov</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
