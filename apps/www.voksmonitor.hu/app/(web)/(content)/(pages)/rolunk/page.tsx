import type { Metadata } from "next";

import { DonateCard } from "../../../../../calculator/components/client";

export const metadata: Metadata = {
  title: "Rólunk",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">A Voksmonitorról</h2>

      <h3 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-xl md:text-lg mb-2 mt-8">Mi az a Voksmonitor?</h3>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A Voksmonitor egy online alkalmazás, amely összehasonlítja az Ön véleményét a Budapesti Fővárosi Közgyűlésben dolgozó frakciók és képviselők álláspontjaival. A Voksmonitorhoz hasonló magyar
        (pl. Vokskabin) és külföldi (pl.Stemwijzer, Wahl-O-Mat,Wahlrechner) választási kalkulátorok történetéről és a világ minden tájáról származó sikeres példákról bővebben a Wikipédián olvashat.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Célja, hogy a választók a politikával ne csak kommunikáción és kampányokon keresztül találkozzanak, hanem megismerjék, hogyan viszonyulnak a döntéshozók a legfontosabb várospolitikai
        kérdésekhez.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Az alkalmazás a válaszadóhoz rendeli azt a frakciót vagy képviselőt, akinek álláspontja a válaszok alapján a legközelebb áll a kitöltő értékrendjéhez.
      </p>

      <h3 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-xl md:text-lg mb-2 mt-8">Ki és hogyan készíti a Voksmonitort?</h3>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">A Voksmonitort a K-Monitor és a KohoVolit.eu nonprofit szervezetek közösen fejlesztik és üzemeltetik.</p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A mostani kiadás a Budapesti Fővárosi Közgyűlés 2024. október 4-i alakuló ülése és 2025. május 28. közötti időszakból válogat 39 olyan ügyet, amelyekben a képviselők vitáztak, közösen
        gondolkodtak és döntést hoztak.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A kérdéseket a K-Monitor munkatársai állították össze úgy, hogy lefedjék a közgyűlés legfontosabb döntési területeit – a közlekedéstől és lakhatástól kezdve a zöldfelületek kezelésén és
        átláthatóságon át a városfejlesztési kérdésekig.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">A képviselők válaszait a közgyűlési szavazások alapján határoztuk meg.</p>

      <h3 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-xl md:text-lg mb-2 mt-8">Hogyan működik?</h3>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A Voksmonitor kérdőíve 39 közgyűlési ügyet mutat be, mindegyiket támogató és ellenző állításokon keresztül, hogy segítse a kitöltőt saját álláspontja kialakításában.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">A kitöltők minden állítással kapcsolatban jelezhetik, hogy egyetértenek-e vele, illetve mennyire tartják fontosnak az adott témát.</p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Az alkalmazás ezután összehasonlítja a válaszokat a frakciók és képviselők álláspontjaival, és kiszámítja, kivel mutat a legnagyobb egyezést. Az eredmény százalékos formában jelenik meg,
        jelezve, mely politikai szereplő (frakció vagy képviselő) áll legközelebb a kitöltő értékrendjéhez.
      </p>

      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">A K-Monitorról</h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A K-Monitornál hisszük, hogy a korrupció olyan probléma, amely a társadalom minden részét érinti, és mindenkinek árt – világnézettől, származástól, nemtől vagy politikai meggyőződéstől
        függetlenül. A korrupció nemcsak hatalmas gazdasági károkat okoz, hanem aláássa az intézményekbe és a jogállamba vetett bizalmat is. Veszélyezteti a demokráciákat, és különösen súlyosan érinti
        azokat a régiókat, ahol a jó kormányzás elengedhetetlen lenne az éhezés, a szegénység és az erőszak felszámolásához.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A korrupció legjobb ellenszere egy olyan társadalom, ahol az állampolgárok felelősséget éreznek az intézmények iránt, és aktívan alakítják a saját környezetüket.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Nonprofit szervezetként a K-Monitor intézményeket, újságírókat és magánszemélyeket támogat a korrupció elleni küzdelemben közösségépítéssel, technológiai fejlesztéssel, érdekképviselettel és
        kutatással.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">Működésünk alapelvei az átláthatóság, a függetlenség és a kritikus szemlélet.</p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Ha érdekel bőveben a tevékenységünk, látogass el <a href="https://k-monitor.hu">honlapunkra</a> vagy <a href="https://k.blog.hu">blogunkra</a>!
      </p>

      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">Támogasd a Voksmonitor elkészítését!</h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-6">Tetszik a Voksmonitor? Kérjük, támogasd az elkészítését!</p>
      <DonateCard />
    </div>
  );
}
